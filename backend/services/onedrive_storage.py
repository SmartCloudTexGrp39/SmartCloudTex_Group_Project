import msal
import json
import os
import io
import requests

class OneDriveService:
    def __init__(self):
        self.app = None
        self.client_id = None
        self.token_path = "onedrive_token.json"
        self.authenticate()

    def authenticate(self):
        """
        Initializes the MSAL PublicClientApplication and loads the token cache.
        """
        if os.path.exists(self.token_path):
            try:
                with open(self.token_path, 'r') as f:
                    data = json.load(f)
                
                self.client_id = data['client_id']
                cache = msal.SerializableTokenCache()
                cache.deserialize(data['token_cache'])
                
                # We use the common authority for multi-tenant/personal account support
                self.app = msal.PublicClientApplication(
                    self.client_id, 
                    authority="https://login.microsoftonline.com/common",
                    token_cache=cache
                )
                print("OneDrive (MS Graph) service initialized.")
            except Exception as e:
                print(f"[ERROR] OneDrive initialization failed: {e}")
        else:
            print("[INFO] OneDrive token not found. Run setup_onedrive.py to enable real storage.")

    def _get_access_token(self):
        """
        Retrieves a valid access token from the cache or refreshes it if needed.
        """
        if not self.app:
            return None
            
        accounts = self.app.get_accounts()
        if accounts:
            # Try to get token from cache
            result = self.app.acquire_token_silent(["Files.ReadWrite.All"], account=accounts[0])
            if result and "access_token" in result:
                return result['access_token']
        return None

    def upload_file(self, filename: str, file_stream: io.BytesIO, mime_type: str) -> str:
        """
        Uploads a file to OneDrive using the Microsoft Graph API.
        Uses an Upload Session to handle large files reliably.
        """
        token = self._get_access_token()
        if not token:
            mock_id = f"mock_odrv_{os.urandom(4).hex()}"
            print(f"[MOCK] OneDrive not authenticated. Generated mock ID: {mock_id}")
            return mock_id

        try:
            file_stream.seek(0)
            file_content = file_stream.read()
            file_size = len(file_content)

            print(f"Creating OneDrive upload session for {filename} ({file_size} bytes)...")
            
            # 1. Create an upload session
            # Microsoft Graph requires the file path in the URL
            session_url = f"https://graph.microsoft.com/v1.0/me/drive/root:/{filename}:/createUploadSession"
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
            
            session_response = requests.post(session_url, headers=headers)
            if session_response.status_code != 200:
                print(f"[ERROR] Could not create OneDrive session: {session_response.text}")
                return f"error_odrv_{os.urandom(4).hex()}"
                
            upload_url = session_response.json().get("uploadUrl")
            
            # 2. Upload the file content to the session
            # For simplicity in this implementation, we upload in a single chunk.
            # Graph API allows chunks up to 60MB, but for very large files (>60MB), 
            # this should be broken into multiple PUT requests.
            put_headers = {
                "Content-Length": str(file_size),
                "Content-Range": f"bytes 0-{file_size-1}/{file_size}"
            }
            
            print(f"Uploading file content to OneDrive...")
            upload_response = requests.put(upload_url, headers=put_headers, data=file_content)
            
            if upload_response.status_code in [200, 201]:
                file_id = upload_response.json().get("id")
                print(f"Successfully uploaded to OneDrive. ID: {file_id}")
                return file_id
            else:
                print(f"[ERROR] OneDrive upload failed: {upload_response.text}")
                return f"error_odrv_{os.urandom(4).hex()}"

        except Exception as e:
            print(f"[ERROR] OneDrive service error: {e}")
            return f"error_odrv_{os.urandom(4).hex()}"

    def download_file(self, file_id: str) -> bytes:
        """
        Downloads a file's content from OneDrive using the Graph API.
        """
        token = self._get_access_token()
        if not token: 
            return b"mock onedrive content"
            
        try:
            url = f"https://graph.microsoft.com/v1.0/me/drive/items/{file_id}/content"
            headers = {"Authorization": f"Bearer {token}"}
            res = requests.get(url, headers=headers)
            if res.status_code == 200:
                return res.content
            else:
                print(f"[ERROR] OneDrive download failed: {res.text}")
                return b""
        except Exception as e:
            print(f"[ERROR] OneDrive download error: {e}")
            return b""

    def delete_file(self, file_id: str):
        """
        Permanently deletes a file from OneDrive.
        """
        token = self._get_access_token()
        if not token: 
            return
            
        try:
            url = f"https://graph.microsoft.com/v1.0/me/drive/items/{file_id}"
            headers = {"Authorization": f"Bearer {token}"}
            res = requests.delete(url, headers=headers)
            if res.status_code == 204:
                print(f"Deleted file from OneDrive: {file_id}")
            else:
                print(f"[ERROR] OneDrive delete failed: {res.text}")
        except Exception as e:
            print(f"[ERROR] OneDrive delete error: {e}")

# Singleton instance
onedrive_service = OneDriveService()
