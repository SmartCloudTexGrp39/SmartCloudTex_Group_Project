import uuid

class OneDriveService:
    def __init__(self):
        # We simulate authentication for the MVP
        self.is_authenticated = True
        print("OneDrive service initialized")

    def upload_file(self, filename: str, file_stream, mime_type: str) -> str:
        """
        Simulates uploading a file to OneDrive.
        Real implementation would use msgraph-sdk-python or requests to Graph API.
        """
        # Mock successful upload and return a mock OneDrive file ID
        mock_id = f"odrv_{uuid.uuid4().hex[:12]}"
        print(f"Uploaded {filename} to mock OneDrive with id {mock_id}")
        return mock_id

onedrive_service = OneDriveService()
