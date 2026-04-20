from services.cloud_storage import gdrive_service
from services.dropbox_storage import dropbox_service
from services.onedrive_storage import onedrive_service

# Thresholds in Bytes
MB = 1024 * 1024
DRIVE_THRESHOLD = 15 * MB
DROPBOX_THRESHOLD = 100 * MB

def route_file_upload(filename: str, file_stream, mime_type: str, file_size: int) -> tuple[str, str]:
    """
    Dynamically routes a file to the appropriate cloud storage based on its size.
    Returns a tuple of (cloud_provider_name, cloud_file_id)
    - < 15MB: Google Drive
    - 15MB - 100MB: Dropbox
    - > 100MB: OneDrive
    """
    
    # We must reset stream position before handing off if it was read elsewhere.
    file_stream.seek(0)
    
    if file_size < DRIVE_THRESHOLD:
        return "Google Drive", gdrive_service.upload_file(filename, file_stream, mime_type)
    elif file_size <= DROPBOX_THRESHOLD:
        return "Dropbox", dropbox_service.upload_file(filename, file_stream, mime_type)
    else:
        return "OneDrive", onedrive_service.upload_file(filename, file_stream, mime_type)
