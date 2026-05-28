from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from app.schemas.sos import SOSCreate, SOSResponse
from app.middleware.auth import get_current_user
from app.database.connection import get_db
from app.utils.helpers import parse_mongo_id, parse_mongo_list
from bson import ObjectId

router = APIRouter(prefix="/sos", tags=["sos"])

@router.post("/create", response_model=SOSResponse)
async def create_sos(req: SOSCreate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available",
        )
        
    sos_doc = {
        "user_id": ObjectId(current_user["id"]),
        "latitude": req.latitude,
        "longitude": req.longitude,
        "location_name": req.location_name,
        "voice_sos": req.voice_sos or False,
        "status": "pending",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    res = await db.sos_alerts.insert_one(sos_doc)
    sos_doc["_id"] = res.inserted_id
    
    return parse_mongo_id(sos_doc)

@router.get("/history", response_model=List[SOSResponse])
async def get_sos_history(current_user: dict = Depends(get_current_user)):
    db = get_db()
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available",
        )
        
    alerts = await db.sos_alerts.find({"user_id": ObjectId(current_user["id"])}).sort("created_at", -1).to_list(length=100)
    return parse_mongo_list(alerts)
