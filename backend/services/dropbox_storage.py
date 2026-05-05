import dropbox
import json
import os
import io

class DropboxService:
    def __init__(self):
        self.dbx = None
        self.token_path = "dropbox_token.json"
        self.authenticate()

    def authenticate(self):
        """
        Initializes the Dropbox client using stored refresh tokens.
        """
        if os.path.exists(self.token_path):
            try:
                with open(self.token_path, 'r') as f:
                    data = json.load(f)
                    
                # We use the refresh token to ensure the session stays active
                self.dbx = dropbox.Dropbox(
                    oauth2_refresh_token=data['refresh_token'],
                    app_key=data['app_key'],
                    app_secret=data['app_secret'],
                    timeout=120 # Increase timeout for large files
                )
                
                # Test connection
                self.dbx.users_get_current_account()
                print("Dropbox service initialized and authenticated.")
            except Exception as e:
                print(f"[ERROR] Dropbox authentication failed: {e}")
                self.dbx = None
        else:
            print("[INFO] Dropbox token not found. Run setup_dropbox.py to enable real storage.")

    def upload_file(self, filename: str, file_stream: io.BytesIO, mime_type: str) -> str:
        """
        Uploads a file to the root of the Dropbox app folder.
        """
        if not self.dbx:
            mock_id = f"mock_dbx_{os.urandom(4).hex()}"
            print(f"[MOCK] Dropbox not authenticated. Generated mock ID: {mock_id}")
            return mock_id

        try:
            file_stream.seek(0)
            file_content = file_stream.read()
            dropbox_path = f"/{filename}"
            
            print(f"Uploading {filename} to Dropbox (with retry)...")
            
            # Simple retry logic for SSL/Network issues
            for attempt in range(3):
                try:
                    res = self.dbx.files_upload(
                        file_content, 
                        dropbox_path, 
                        mode=dropbox.files.WriteMode.overwrite
                    )
                    print(f"Successfully uploaded to Dropbox. ID: {res.id}")
                    return res.id
                except Exception as e:
                    if attempt < 2:
                        print(f"Dropbox upload attempt {attempt+1} failed: {e}. Retrying...")
                        import time
                        time.sleep(2)
                    else:
                        raise e
                        
        except Exception as e:
            print(f"[ERROR] Dropbox upload failed after retries: {e}")
            return f"error_dbx_{os.urandom(4).hex()}"

    def download_file(self, file_id: str) -> bytes:
        if not self.dbx:
            return b"mock dropbox content"
        try:
            # Dropbox download can use the ID (prefixed with id:)
            metadata, res = self.dbx.files_download(file_id)
            return res.content
        except Exception as e:
            print(f"[ERROR] Dropbox download failed: {e}")
            return b""

    def delete_file(self, file_id: str):
        if not self.dbx:
            return
        try:
            self.dbx.files_delete_v2(file_id)
            print(f"Deleted file from Dropbox: {file_id}")
        except Exception as e:
            print(f"[ERROR] Dropbox delete failed: {e}")

# Singleton instance
dropbox_service = DropboxService()
