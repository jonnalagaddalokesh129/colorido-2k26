from fastapi import APIRouter, Depends, HTTPException, status, Response
from typing import List
from app.schemas.emergency_contact import (
    EmergencyContactCreate,
    EmergencyContactUpdate,
    EmergencyContactResponse
)
from app.middleware.auth import get_current_user
from app.database.connection import get_db
from app.utils.helpers import parse_mongo_id, parse_mongo_list
from bson import ObjectId

router = APIRouter(prefix="/emergency-contacts", tags=["emergency-contacts"])

@router.get("", response_model=List[EmergencyContactResponse])
async def list_contacts(current_user: dict = Depends(get_current_user)):
    db = get_db()
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available",
        )
        
    contacts = await db.emergency_contacts.find({"user_id": ObjectId(current_user["id"])}).to_list(length=50)
    return parse_mongo_list(contacts)

@router.post("", response_model=EmergencyContactResponse, status_code=status.HTTP_201_CREATED)
async def create_contact(req: EmergencyContactCreate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available",
        )
        
    contact_doc = req.model_dump()
    contact_doc["user_id"] = ObjectId(current_user["id"])
    
    res = await db.emergency_contacts.insert_one(contact_doc)
    contact_doc["_id"] = res.inserted_id
    
    return parse_mongo_id(contact_doc)

@router.put("/{contact_id}", response_model=EmergencyContactResponse)
async def update_contact(
    contact_id: str,
    req: EmergencyContactUpdate,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available",
        )
        
    try:
        obj_id = ObjectId(contact_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid contact ID format")
        
    update_dict = req.model_dump(exclude_unset=True)
    if not update_dict:
        contact = await db.emergency_contacts.find_one({
            "_id": obj_id,
            "user_id": ObjectId(current_user["id"])
        })
        if not contact:
            raise HTTPException(status_code=404, detail="Contact not found")
        return parse_mongo_id(contact)
        
    res = await db.emergency_contacts.update_one(
        {"_id": obj_id, "user_id": ObjectId(current_user["id"])},
        {"$set": update_dict}
    )
    
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
        
    updated_contact = await db.emergency_contacts.find_one({"_id": obj_id})
    return parse_mongo_id(updated_contact)

@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contact(contact_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available",
        )
        
    try:
        obj_id = ObjectId(contact_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid contact ID format")
        
    res = await db.emergency_contacts.delete_one({
        "_id": obj_id,
        "user_id": ObjectId(current_user["id"])
    })
    
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
        
    return Response(status_code=status.HTTP_204_NO_CONTENT)
