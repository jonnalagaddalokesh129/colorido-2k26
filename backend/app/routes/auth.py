from fastapi import APIRouter, HTTPException, status
from app.database.connection import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.utils.security import get_password_hash, verify_password, create_access_token
from app.utils.helpers import parse_mongo_user

router = APIRouter(prefix="/auth", tags=["auth"])


# ── Register ──────────────────────────────────────────────────────────────────
@router.post("/register", response_model=TokenResponse)
async def register(req: RegisterRequest):
    db = get_db()
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available",
        )

    existing_user = await db.users.find_one({"email": req.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    hashed_password = get_password_hash(req.password)
    user_doc = {
        "name": req.name,
        "email": req.email,
        "phone": req.phone,
        "password": hashed_password,
        "blood_group": None,
        "allergies": None,
    }

    res = await db.users.insert_one(user_doc)
    user_doc["_id"] = res.inserted_id

    # parse_mongo_user converts _id → id AND strips password
    parsed_user = parse_mongo_user(user_doc)
    token = create_access_token(parsed_user["id"])

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": parsed_user,
    }


# ── Login ─────────────────────────────────────────────────────────────────────
@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    db = get_db()
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection not available",
        )

    user = await db.users.find_one({"email": req.email})
    if not user or not verify_password(req.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # parse_mongo_user converts _id → id AND strips password
    parsed_user = parse_mongo_user(user)
    token = create_access_token(parsed_user["id"])

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": parsed_user,
    }
