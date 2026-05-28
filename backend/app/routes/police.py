from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
from app.schemas.police import PoliceStationResponse
from app.middleware.auth import get_current_user
from app.database.connection import get_db
from app.utils.helpers import parse_mongo_id, calculate_distance

router = APIRouter(prefix="/police", tags=["police"])

@router.get("", response_model=List[PoliceStationResponse])
async def list_police_stations(
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
        
    police_cursor = db.police_stations.find()
    police_stations = await police_cursor.to_list(length=100)
    
    parsed_stations = []
    for p in police_stations:
        parsed_p = parse_mongo_id(p)
        if latitude is not None and longitude is not None:
            parsed_p["distance"] = calculate_distance(
                latitude, longitude, parsed_p["latitude"], parsed_p["longitude"]
            )
        else:
            parsed_p["distance"] = None
        parsed_stations.append(parsed_p)
        
    if latitude is not None and longitude is not None:
        parsed_stations.sort(key=lambda x: x["distance"] if x["distance"] is not None else float('inf'))
        
    return parsed_stations
