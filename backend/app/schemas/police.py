from pydantic import BaseModel
from typing import Optional

class PoliceStationBase(BaseModel):
    name: str
    address: str
    phone: str
    latitude: float
    longitude: float
    distance: Optional[float] = None
    rating: float
    jurisdiction: Optional[str] = None

class PoliceStationResponse(PoliceStationBase):
    id: str

    class Config:
        from_attributes = True
        populate_by_name = True
