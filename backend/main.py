import os
import traceback
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from app.database.connection import connect_to_mongo, close_mongo_connection
from app.routes import auth, users, sos, hospitals, police, towing, emergency_contacts

load_dotenv()

app = FastAPI(
    title="RoadSOS API",
    description="Emergency Road Rescue Backend Services",
    version="1.0.0"
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# NOTE: allow_credentials=True is INCOMPATIBLE with allow_origins=["*"].
# Use an explicit allow_origins list instead.
ALLOWED_ORIGINS = [
    "http://localhost:8081",   # Expo web dev server
    "http://localhost:3000",   # Optional: Next.js / web
    "http://127.0.0.1:8081",
    "http://127.0.0.1:3000",
    "exp://localhost:8081",    # Expo Go deep link
    "exp://127.0.0.1:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# ── Global Exception Handler ──────────────────────────────────────────────────
# Ensures CORS headers are always present, even when the server crashes with 500
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    origin = request.headers.get("origin", "")
    allowed = origin in ALLOWED_ORIGINS or not origin

    headers = {}
    if allowed and origin:
        headers["Access-Control-Allow-Origin"] = origin
        headers["Access-Control-Allow-Credentials"] = "true"

    # Log the full traceback server-side for debugging
    traceback.print_exc()

    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"},
        headers=headers,
    )

# ── Lifecycle ─────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

# ── Root ──────────────────────────────────────────────────────────────────────
@app.get("/")
def read_root():
    return {
        "app": "RoadSOS Emergency API",
        "status": "online",
        "docs_url": "/docs"
    }

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(sos.router)
app.include_router(hospitals.router)
app.include_router(police.router)
app.include_router(towing.router)
app.include_router(emergency_contacts.router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
