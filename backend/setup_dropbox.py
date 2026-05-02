import dropbox
from dropbox import DropboxOAuth2FlowNoRedirect
import json
import os

def setup():
    print("\n--- Dropbox Authentication Setup ---")
    print("Go to https://www.dropbox.com/developers/apps to create an app if you haven't already.")
    print("Make sure to add 'files.content.write' and 'files.content.read' scopes in the 'Permissions' tab.")
    
    app_key = input("\nEnter your Dropbox App Key: ").strip()
    app_secret = input("Enter your Dropbox App Secret: ").strip()

    if not app_key or not app_secret:
        print("Error: App Key and App Secret are required.")
        return

    auth_flow = DropboxOAuth2FlowNoRedirect(app_key, app_secret, token_access_type='offline')

    authorize_url = auth_flow.start()
    print("\n1. Go to this URL in your browser: \n" + authorize_url)
    print("\n2. Click \"Allow\" (you might have to log in first).")
    print("3. Copy the authorization code.")
    auth_code = input("\nEnter the authorization code here: ").strip()

    try:
        oauth_result = auth_flow.finish(auth_code)
        
        token_data = {
            "access_token": oauth_result.access_token,
            "refresh_token": oauth_result.refresh_token,
            "app_key": app_key,
            "app_secret": app_secret
        }
        
        with open("dropbox_token.json", "w") as f:
            json.dump(token_data, f)
            
        print("\n[SUCCESS] Successfully authenticated! Tokens saved to dropbox_token.json")
        print("You can now restart your backend to use real Dropbox storage.")
        
    except Exception as e:
        print('\n[ERROR] Authentication failed: %s' % (e,))

if __name__ == "__main__":
    setup()
