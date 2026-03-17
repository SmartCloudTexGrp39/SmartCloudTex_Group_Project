from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from database import connect_to_mongo, close_mongo_connection
from routes import auth, files

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(
    title="SmartCloudTex API", 
    description="AI-Enhanced Multi-Cloud File Storage System for SMEs", 
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(auth.router)
app.include_router(files.router)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "SmartCloudTex API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
