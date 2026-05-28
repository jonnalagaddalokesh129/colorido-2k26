from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
from app.schemas.hospital import HospitalResponse
from app.middleware.auth import get_current_user
from app.database.connection import get_db
from app.utils.helpers import parse_mongo_id, calculate_distance

router = APIRouter(prefix="/hospitals", tags=["hospitals"])

@router.get("", response_model=List[HospitalResponse])
async def list_hospitals(
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
        
    hospitals_cursor = db.hospitals.find()
    hospitals = await hospitals_cursor.to_list(length=100)
    
    parsed_hospitals = []
    for h in hospitals:
        parsed_h = parse_mongo_id(h)
        if latitude is not None and longitude is not None:
            parsed_h["distance"] = calculate_distance(
                latitude, longitude, parsed_h["latitude"], parsed_h["longitude"]
            )
        else:
            parsed_h["distance"] = None
        parsed_hospitals.append(parsed_h)
        
    if latitude is not None and longitude is not None:
        parsed_hospitals.sort(key=lambda x: x["distance"] if x["distance"] is not None else float('inf'))
        
    return parsed_hospitals
