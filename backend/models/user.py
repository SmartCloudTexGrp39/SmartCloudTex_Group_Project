from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from enum import Enum
from bson import ObjectId

class Role(str, Enum):
    ADMIN = "Admin"
    SUPERVISOR = "Supervisor"
    STAFF = "Staff"

class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: Role = Role.STAFF

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: Optional[str] = Field(alias="_id", default=None)
    hashed_password: str

class UserResponse(UserBase):
    id: Optional[str] = Field(alias="_id", default=None)
    
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[Role] = None
