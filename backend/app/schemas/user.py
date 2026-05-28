from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

class UserBase(BaseModel):
    email: EmailStr
    name: str
    phone: str
    blood_group: Optional[str] = None
    allergies: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    blood_group: Optional[str] = None
    allergies: Optional[str] = None

class UserResponse(UserBase):
    id: str

    model_config = {
        'from_attributes': True,
        'populate_by_name': True,
        'extra': 'ignore',  # Drop unknown fields like 'password' from MongoDB docs
    }
