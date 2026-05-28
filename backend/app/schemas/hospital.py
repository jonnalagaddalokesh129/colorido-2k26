from pydantic import BaseModel
from typing import Optional, List

class HospitalBase(BaseModel):
    name: str
    address: str
    phone: str
    latitude: float
    longitude: float
    distance: Optional[float] = None
    rating: float
    specialties: List[str] = []

class HospitalResponse(HospitalBase):
    id: str

    class Config:
        from_attributes = True
        populate_by_name = True
