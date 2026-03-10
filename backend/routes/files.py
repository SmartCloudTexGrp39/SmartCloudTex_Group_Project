from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from models.user import UserInDB, Role
from routes.auth import get_current_user, check_role
from services.cloud_storage import gdrive_service
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
        contents = await file.read()
        file_stream = io.BytesIO(contents)
        
        # In MVP we just upload directly to Google Drive
        cloud_id = gdrive_service.upload_file(file.filename, file_stream, file.content_type)
        
        file_record = {
            "filename": file.filename,
            "cloud_provider": "Google Drive",
            "cloud_id": cloud_id,
            "uploaded_by": current_user.username,
            "upload_date": datetime.datetime.utcnow(),
            "size_bytes": len(contents),
            "mime_type": file.content_type,
            "tags": tags.split(",") if tags else []
        }
        
        db = get_db()
        result = await db["files"].insert_one(file_record)
        
        return {
            "message": "File uploaded successfully",
            "file_id": str(result.inserted_id),
            "cloud_id": cloud_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/list")
async def list_files(current_user: UserInDB = Depends(get_current_user)):
    db = get_db()
    cursor = db["files"].find()
    
    files = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        files.append(doc)
        
    return files
