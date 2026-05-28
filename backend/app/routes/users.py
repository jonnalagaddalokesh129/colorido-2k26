from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UserResponse, UserUpdate
from app.middleware.auth import get_current_user
from app.database.connection import get_db
from app.utils.helpers import parse_mongo_user
from bson import ObjectId

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    # current_user already has password stripped by get_current_user
    return current_user


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    update_data: UserUpdate,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available",
        )

    update_dict = update_data.model_dump(exclude_unset=True)
    if not update_dict:
        return current_user

    await db.users.update_one(
        {"_id": ObjectId(current_user["id"])},
        {"$set": update_dict},
    )

    updated_user = await db.users.find_one({"_id": ObjectId(current_user["id"])})
    # parse_mongo_user strips password before Pydantic validates the response
    return parse_mongo_user(updated_user)
