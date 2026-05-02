import os
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload, MediaIoBaseDownload
import io

SCOPES = ['https://www.googleapis.com/auth/drive.file']

class GoogleDriveService:
    def __init__(self):
        self.creds = None
        self.service = None
        self._authenticate()

    def _authenticate(self):
        # We assume credentials.json is provided by the admin. 
        # If not present, we will bypass and log it to avoid crashing the server.
        creds_path = os.getenv("GDRIVE_CREDENTIALS_PATH", "credentials.json")
        token_path = os.getenv("GDRIVE_TOKEN_PATH", "token.json")
        
        if os.path.exists(token_path):
            self.creds = Credentials.from_authorized_user_file(token_path, SCOPES)
            
        if not self.creds or not self.creds.valid:
            if self.creds and self.creds.expired and self.creds.refresh_token:
                self.creds.refresh(Request())
            elif os.path.exists(creds_path):
                # The console-based flow requires user interaction, mocked here for MVP headless startup
                # flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
                # self.creds = flow.run_local_server(port=0)
                # with open(token_path, 'w') as token:
                #     token.write(self.creds.to_json())
                print("Drive Auth requires token.json or interactive setup not possible in headless mode.")
            else:
                print(f"No Google Drive credentials found at {creds_path}")
                return
                
        self.service = build('drive', 'v3', credentials=self.creds)

    def upload_file(self, file_name: str, file_stream: io.BytesIO, mime_type: str) -> str:
        if not self.service:
            print("Google Drive service not authenticated, mocking upload.")
            return "mock-upload-id-123"
            
        file_metadata = {'name': file_name}
        media = MediaIoBaseUpload(file_stream, mimetype=mime_type, resumable=True)
        file = self.service.files().create(body=file_metadata, media_body=media, fields='id').execute()
        return file.get('id')

    def download_file(self, file_id: str) -> bytes:
        if not self.service:
            print("Google Drive service not authenticated, mocking download.")
            return b"mock file content"
            
        request = self.service.files().get_media(fileId=file_id)
        fh = io.BytesIO()
        downloader = MediaIoBaseDownload(fh, request)
        done = False
        while done is False:
            status, done = downloader.next_chunk()
        return fh.getvalue()

    def delete_file(self, file_id: str):
        if not self.service:
            print("Google Drive service not authenticated, mocking delete.")
            return
        self.service.files().delete(fileId=file_id).execute()

gdrive_service = GoogleDriveService()
