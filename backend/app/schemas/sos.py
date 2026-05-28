from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class SOSCreate(BaseModel):
    latitude: float
    longitude: float
    location_name: Optional[str] = None
    voice_sos: Optional[bool] = False

class SOSResponse(BaseModel):
    id: str
    user_id: str
    latitude: float
    longitude: float
    location_name: Optional[str] = None
    voice_sos: bool
    status: str  # pending, active, resolved, in_progress
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
