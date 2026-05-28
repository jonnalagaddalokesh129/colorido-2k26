import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/roadsos")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    db_instance.client = AsyncIOMotorClient(MONGODB_URL)
    # Get database name from connection string if exists, otherwise fallback to roadsos
    db_name = "roadsos"
    try:
        # Check if default database is part of URL
        temp_client = AsyncIOMotorClient(MONGODB_URL)
        default_db = temp_client.get_default_database()
        if default_db is not None and default_db.name != "admin" and default_db.name != "local":
            db_name = default_db.name
    except Exception:
        pass
    
    db_instance.db = db_instance.client[db_name]
    print(f"Connected to MongoDB database: {db_name}")

async def close_mongo_connection():
    if db_instance.client is not None:
        db_instance.client.close()
        print("Closed connection to MongoDB")

def get_db():
    return db_instance.db
