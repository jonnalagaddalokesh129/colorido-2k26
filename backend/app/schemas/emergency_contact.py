from pydantic import BaseModel
from typing import Optional

class EmergencyContactBase(BaseModel):
    name: str
    phone: str
    relationship: str

class EmergencyContactCreate(EmergencyContactBase):
    pass

class EmergencyContactUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    relationship: Optional[str] = None

class EmergencyContactResponse(EmergencyContactBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True
        populate_by_name = True
