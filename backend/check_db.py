import motor.motor_asyncio
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def check():
    uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    client = motor.motor_asyncio.AsyncIOMotorClient(uri)
    db = client[os.getenv("MONGO_DB_NAME", "smartcloudtex")]
    
    print("Recent uploads:")
    cursor = db["files"].find().sort("upload_date", -1).limit(5)
    async for doc in cursor:
        print(f"- {doc['filename']} | Provider: {doc['cloud_provider']} | ID: {doc['cloud_id']} | Date: {doc['upload_date']}")

if __name__ == "__main__":
    asyncio.run(check())
