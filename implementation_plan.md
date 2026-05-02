# Real Cloud Storage Integrations (Dropbox & OneDrive)

This plan outlines the steps to transition Dropbox and OneDrive from mock services to real cloud-integrated services using their respective APIs and Python SDKs.

## User Review Required

> [!IMPORTANT]
> To enable these integrations, you will need to create developer accounts and register applications on the following platforms:
> 1. **Dropbox Developer Console:** To get an App Key and App Secret.
> 2. **Microsoft Azure Portal:** To register an application and get a Client ID and Client Secret for OneDrive.
>
> I will provide scripts to help you authorize these applications locally, similar to the `setup_gdrive.py` process.

## Proposed Changes

### 1. Backend: Dependencies
- Install `dropbox` (for Dropbox integration).
- Install `msal` (for OneDrive/Microsoft Graph authentication).

### 2. Backend: Dropbox Integration
#### [NEW] `backend/setup_dropbox.py`
- A script to perform the OAuth2 flow for Dropbox.
- Will save access tokens (or refresh tokens) to `dropbox_token.json`.

#### [MODIFY] `backend/services/dropbox_storage.py`
- Initialize the `dropbox.Dropbox` client using tokens from `dropbox_token.json`.
- Implement real `upload_file` and `download_file` (if needed) logic.

### 3. Backend: OneDrive Integration
#### [NEW] `backend/setup_onedrive.py`
- A script using `msal` to perform the OAuth2 flow for Microsoft Graph.
- Will save tokens to `onedrive_token.json`.

#### [MODIFY] `backend/services/onedrive_storage.py`
- Initialize a Microsoft Graph client or use `requests` with MSAL tokens.
- Implement real `upload_file` logic (supporting large file uploads via upload sessions if needed).

### 4. Frontend: Settings Page
- **[MODIFY]** `frontend/src/app/dashboard/settings/page.tsx`
- Update the UI to show "Pending Authentication" instructions for Dropbox and OneDrive, similar to the Google Drive setup.

## Verification Plan

### Automated Tests
- Create small test scripts for each service (`test_dropbox.py`, `test_onedrive.py`) to verify uploads and downloads.

### Manual Verification
- Upload files of different sizes to trigger the routing logic in `routing.py`.
- Verify files appear in the respective cloud dashboards.
- Check the Dashboard storage metrics to ensure they reflect live usage.
