import dropbox
import json
import os

def test():
    token_path = "dropbox_token.json"
    if not os.path.exists(token_path):
        print("Token not found.")
        return

    with open(token_path, 'r') as f:
        data = json.load(f)
    
    try:
        dbx = dropbox.Dropbox(
            oauth2_refresh_token=data['refresh_token'],
            app_key=data['app_key'],
            app_secret=data['app_secret']
        )
        
        account = dbx.users_get_current_account()
        print(f"Connected as: {account.name.display_name}")
        
        # Check files in root
        print("\nListing files in root (which could be the App folder or the actual root):")
        res = dbx.files_list_folder('')
        for entry in res.entries:
            print(f" - {entry.name}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test()
