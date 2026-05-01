import requests

# 1. Register a test user (or login if exists)
base_url = "http://localhost:8000"

try:
    reg_resp = requests.post(f"{base_url}/auth/register", json={
        "username": "testuser",
        "email": "test@test.com",
        "role": "Staff",
        "password": "password"
    })
    print("Register:", reg_resp.text)
except Exception as e:
    print(e)

# 2. Login
try:
    login_resp = requests.post(f"{base_url}/auth/login", data={
        "username": "testuser",
        "password": "password"
    })
    print("Login:", login_resp.text)
    token = login_resp.json().get("access_token")
    
    # 3. Upload
    if token:
        with open("test_upload.txt", "rb") as f:
            upload_resp = requests.post(f"{base_url}/files/upload", 
                headers={"Authorization": f"Bearer {token}"},
                files={"file": ("test_upload.txt", f, "text/plain")},
                data={"tags": "test"}
            )
            print("Upload:", upload_resp.text)
except Exception as e:
    print(e)
