import msal
import json
import os
import time

def setup():
    print("\n--- OneDrive (Microsoft Graph) Authentication Setup ---")
    print("1. Go to the Azure Portal (https://portal.azure.com).")
    print("2. Navigate to 'App registrations' and create a new registration.")
    print("3. Supported account types: 'Accounts in any organizational directory and personal Microsoft accounts'.")
    print("4. Under 'Authentication', add a platform: 'Mobile and desktop applications' and check 'https://login.microsoftonline.com/common/oauth2/nativeclient'.")
    print("5. Under 'API permissions', add 'Files.ReadWrite.All' and 'User.Read' (delegated).")
    
    client_id = input("\nEnter your Application (client) ID: ").strip()

    if not client_id:
        print("Error: Client ID is required.")
        return

    authority = "https://login.microsoftonline.com/common"
    scopes = ["Files.ReadWrite.All", "User.Read"]

    # Use PublicClientApplication for Device Flow (best for terminal-based auth)
    app = msal.PublicClientApplication(client_id, authority=authority)

    print("\nInitiating Device Flow...")
    flow = app.initiate_device_flow(scopes=scopes)
    
    if "user_code" not in flow:
        print("[ERROR] Could not initiate device flow. Check your Client ID.")
        print(f"Server response: {flow.get('error_description')}")
        return

    print("\n" + flow["message"])
    
    # Wait for the user to complete the flow
    result = app.acquire_token_by_device_flow(flow)

    if "access_token" in result:
        # We save the client_id and the token cache (which contains the refresh token)
        token_data = {
            "client_id": client_id,
            "token_cache": app.token_cache.serialize()
        }
        
        with open("onedrive_token.json", "w") as f:
            json.dump(token_data, f)
            
        print("\n[SUCCESS] Successfully authenticated OneDrive!")
        print("Tokens saved to onedrive_token.json.")
        print("You can now restart your backend to use real OneDrive storage.")
    else:
        print("\n[ERROR] Authentication failed: " + result.get("error_description", "Unknown error"))

if __name__ == "__main__":
    setup()
