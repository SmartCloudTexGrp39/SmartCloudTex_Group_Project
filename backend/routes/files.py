from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from models.user import UserInDB, Role
from routes.auth import get_current_user, check_role
from services.routing import route_file_upload
from services.ai_service import generate_ai_tags
from utils.hashing import generate_file_hash
from database import get_db
import io
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
