from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
from app.schemas.towing import TowingServiceResponse
from app.middleware.auth import get_current_user
from app.database.connection import get_db
from app.utils.helpers import parse_mongo_id, calculate_distance

router = APIRouter(prefix="/towing", tags=["towing"])

@router.get("", response_model=List[TowingServiceResponse])
async def list_towing_services(
    latitude: Optional[float] = Query(None, description="Current latitude"),
    longitude: Optional[float] = Query(None, description="Current longitude"),
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available",
        )
        
    towing_cursor = db.towing_services.find()
    towing_services = await towing_cursor.to_list(length=100)
    
    parsed_services = []
    for t in towing_services:
        parsed_t = parse_mongo_id(t)
        if latitude is not None and longitude is not None:
            parsed_t["distance"] = calculate_distance(
                latitude, longitude, parsed_t["latitude"], parsed_t["longitude"]
            )
        else:
            parsed_t["distance"] = None
        parsed_services.append(parsed_t)
        
    if latitude is not None and longitude is not None:
        parsed_services.sort(key=lambda x: x["distance"] if x["distance"] is not None else float('inf'))
        
    return parsed_services
