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
    
    status = "Connected" if gdrive_connected else ("Pending Authentication" if gdrive_has_creds else "Not Configured")
    
    return [
        {
            "id": "Google Drive",
            "status": status,
            "has_credentials": gdrive_has_creds
        },
        {
            "id": "Dropbox",
            "status": "Not Configured",
            "has_credentials": False
        },
        {
            "id": "OneDrive",
            "status": "Not Configured",
            "has_credentials": False
        }
    ]

@router.post("/integrations/disconnect")
async def disconnect_integration(provider: dict):
    if provider.get("id") == "Google Drive":
        if os.path.exists("token.json"):
            os.remove("token.json")
            return {"message": "Disconnected Google Drive"}
        return {"message": "Already disconnected"}
    raise HTTPException(status_code=400, detail="Cannot disconnect this provider")
