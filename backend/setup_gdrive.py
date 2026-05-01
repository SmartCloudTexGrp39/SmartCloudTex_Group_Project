import os
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# Scopes needed for Google Drive upload
SCOPES = ['https://www.googleapis.com/auth/drive.file']

def authenticate_and_save_token():
    creds = None
    creds_path = "credentials.json"
    token_path = "token.json"

    # Check if we already have a valid token
    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)
    
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("Token expired, refreshing...")
            creds.refresh(Request())
        else:
            if not os.path.exists(creds_path):
                print(f"Error: {creds_path} not found in the current directory.")
                return

            print(f"Starting browser authentication using {creds_path}...")
            flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
            # This opens your default web browser for authentication
            creds = flow.run_local_server(port=0)

        # Save the credentials for the next run
        print(f"Successfully authenticated! Saving to {token_path}...")
        with open(token_path, 'w') as token:
            token.write(creds.to_json())
        print("Done. You can now restart your FastAPI backend.")
    else:
        print(f"Valid {token_path} already exists! No need to re-authenticate.")

if __name__ == '__main__':
    authenticate_and_save_token()
