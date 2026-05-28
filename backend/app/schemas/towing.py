from pydantic import BaseModel
from typing import Optional, List

class TowingServiceBase(BaseModel):
    name: str
    address: str
    phone: str
    latitude: float
    longitude: float
    distance: Optional[float] = None
    rating: float
    available: bool = True
    vehicle_types: List[str] = []

class TowingServiceResponse(TowingServiceBase):
    id: str

    class Config:
        from_attributes = True
        populate_by_name = True
