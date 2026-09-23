import datetime
from typing import Optional
from pydantic import BaseModel

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    organization: Optional[str] = "Demo Corp"
    language: Optional[str] = "en"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    language: str
    organization: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
