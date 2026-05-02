from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from models.user import UserInDB, Role
from routes.auth import get_current_user, check_role
from services.routing import route_file_upload
from services.ai_service import generate_ai_tags
from utils.hashing import generate_file_hash
from database import get_db
import io
import os
import datetime
from fastapi.responses import Response
from bson import ObjectId
from services.cloud_storage import gdrive_service
from services.dropbox_storage import dropbox_service
from services.onedrive_storage import onedrive_service

router = APIRouter(prefix="/files", tags=["files"])

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    tags: str = Form(""),
    current_user: UserInDB = Depends(check_role(Role.STAFF))
):
    try:
        db = get_db()
        contents = await file.read()
        file_size = len(contents)
        
        # Deduplication check
        file_hash = generate_file_hash(contents)
        existing_file = await db["files"].find_one({"file_hash": file_hash})
        
        if existing_file:
            print(f"File {file.filename} is a duplicate. Re-using cloud ID {existing_file['cloud_id']}")
            cloud_provider = existing_file['cloud_provider']
            cloud_id = existing_file['cloud_id']
        else:
            file_stream = io.BytesIO(contents)
            
            # Dynamic routing based on file size (Drive < 15MB, Dropbox 15-100MB, OneDrive > 100MB)
            cloud_provider, cloud_id = route_file_upload(file.filename, file_stream, file.content_type, file_size)
        
        # Combine user tags and AI tags
        user_tags = tags.split(",") if tags else []
        ai_tags = generate_ai_tags(contents, file.filename, file.content_type)
        combined_tags = list(set([tag.strip().lower() for tag in user_tags + ai_tags if tag.strip()]))
        
        file_record = {
            "filename": file.filename,
            "cloud_provider": cloud_provider,
            "cloud_id": cloud_id,
            "file_hash": file_hash,
            "uploaded_by": current_user.username,
            "upload_date": datetime.datetime.utcnow(),
            "size_bytes": file_size,
            "mime_type": file.content_type,
            "tags": combined_tags
        }
        
        result = await db["files"].insert_one(file_record)
        
        return {
            "message": "File processed successfully" if existing_file else "File uploaded successfully",
            "is_duplicate": bool(existing_file),
            "file_id": str(result.inserted_id),
            "cloud_id": cloud_id,
            "cloud_provider": cloud_provider,
            "size_bytes": file_size,
            "tags": file_record["tags"]
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/list")
async def list_files():
    db = get_db()
    cursor = db["files"].find()
    
    files = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        files.append(doc)
        
    return files

@router.get("/download/{file_id}")
async def download_file(file_id: str):
    db = get_db()
    try:
        file_record = await db["files"].find_one({"_id": ObjectId(file_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid file ID format")
        
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    provider = file_record["cloud_provider"]
    cloud_id = file_record["cloud_id"]
    filename = file_record["filename"]
    mime_type = file_record.get("mime_type", "application/octet-stream")
    
    print(f"Downloading {filename} from {provider}...")
    
    content = b""
    try:
        if provider == "Google Drive":
            content = gdrive_service.download_file(cloud_id)
        elif provider == "Dropbox":
            content = dropbox_service.download_file(cloud_id)
        elif provider == "OneDrive":
            content = onedrive_service.download_file(cloud_id)
    except Exception as e:
        print(f"Download error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch from {provider}")
        
    return Response(
        content=content,
        media_type=mime_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.delete("/{file_id}")
async def delete_file(file_id: str, current_user: UserInDB = Depends(check_role(Role.ADMIN))):
    db = get_db()
    try:
        file_record = await db["files"].find_one({"_id": ObjectId(file_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid file ID format")

    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    provider = file_record["cloud_provider"]
    cloud_id = file_record["cloud_id"]
    
    # 1. Delete from Cloud
    try:
        if provider == "Google Drive":
            gdrive_service.delete_file(cloud_id)
        elif provider == "Dropbox":
            dropbox_service.delete_file(cloud_id)
        elif provider == "OneDrive":
            onedrive_service.delete_file(cloud_id)
    except Exception as e:
        print(f"Cloud delete error (continuing with DB delete): {e}")
        
    # 2. Delete from DB
    await db["files"].delete_one({"_id": ObjectId(file_id)})
    
    return {"message": "File deleted successfully"}

@router.post("/share/{file_id}")
async def share_file(file_id: str):
    # Simulated sharing link logic
    return {
        "message": "Public share link generated",
        "share_url": f"http://localhost:8000/files/download/{file_id}"
    }

@router.get("/metrics")
async def get_storage_metrics():
    db = get_db()
    pipeline = [
        {"$group": {"_id": "$cloud_provider", "used_bytes": {"$sum": "$size_bytes"}}}
    ]
    cursor = db["files"].aggregate(pipeline)
    
    # Defaults/Limits in Bytes
    GB = 1024 * 1024 * 1024
    limits = {
        "Google Drive": 15 * GB,
        "Dropbox": 2 * GB,
        "OneDrive": 5 * GB
    }
    
    # Initialize with 0 usage
    metrics = {
        provider: {"used": 0, "total": limit}
        for provider, limit in limits.items()
    }
    
    async for doc in cursor:
        provider = doc["_id"]
        if provider in metrics:
            metrics[provider]["used"] = doc["used_bytes"]
            
    return metrics

@router.get("/integrations")
async def get_integrations():
    # Check Google Drive status
    gdrive_connected = os.path.exists("token.json")
    gdrive_has_creds = os.path.exists("credentials.json")
    gdrive_status = "Connected" if gdrive_connected else ("Pending Authentication" if gdrive_has_creds else "Not Configured")
    
    # Check Dropbox status
    dbx_connected = os.path.exists("dropbox_token.json")
    dbx_status = "Connected" if dbx_connected else "Not Configured"
    
    # Check OneDrive status
    odrv_connected = os.path.exists("onedrive_token.json")
    odrv_status = "Connected" if odrv_connected else "Not Configured"
    
    return [
        {
            "id": "Google Drive",
            "status": gdrive_status,
            "has_credentials": gdrive_has_creds
        },
        {
            "id": "Dropbox",
            "status": dbx_status,
            "has_credentials": True
        },
        {
            "id": "OneDrive",
            "status": odrv_status,
            "has_credentials": True
        }
    ]

@router.post("/integrations/disconnect")
async def disconnect_integration(provider: dict):
    provider_id = provider.get("id")
    file_map = {
        "Google Drive": "token.json",
        "Dropbox": "dropbox_token.json",
        "OneDrive": "onedrive_token.json"
    }
    
    if provider_id in file_map:
        token_file = file_map[provider_id]
        if os.path.exists(token_file):
            os.remove(token_file)
            return {"message": f"Disconnected {provider_id}"}
        return {"message": "Already disconnected"}
        
    raise HTTPException(status_code=400, detail="Cannot disconnect this provider")
