import msal
import json


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

    cache = msal.SerializableTokenCache()

    app = msal.PublicClientApplication(
        client_id,
        authority=authority,
        token_cache=cache
    )

    print("\nInitiating Device Flow...")
    flow = app.initiate_device_flow(scopes=scopes)

    if "user_code" not in flow:
        print("[ERROR] Could not initiate device flow. Check your Client ID.")
        print(f"Server response: {flow.get('error_description')}")
        return

    print("\n" + flow["message"])

    result = app.acquire_token_by_device_flow(flow)

    if "access_token" in result:
        token_data = {
            "client_id": client_id,
            "token_cache": cache.serialize()
        }

        with open("onedrive_token.json", "w") as f:
            json.dump(token_data, f, indent=4)

        print("\n[SUCCESS] Successfully authenticated OneDrive!")
        print("Tokens saved to onedrive_token.json.")
        print("You can now restart your backend to use real OneDrive storage.")
    else:
        print("\n[ERROR] Authentication failed: " + result.get("error_description", "Unknown error"))


if __name__ == "__main__":
    setup()