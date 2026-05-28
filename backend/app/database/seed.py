import asyncio
import os
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Add the parent directory to the path so we can import properly
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/roadsos")

hospitals_data = [
    {
        "name": "Apollo Hospitals",
        "address": "154/11, Bannerghatta Road, Opp. IIM, Bangalore, Karnataka 560076",
        "phone": "+91 80 2630 4050",
        "latitude": 12.8959,
        "longitude": 77.5997,
        "rating": 4.6,
        "specialties": ["Trauma Care", "Cardiology", "Neurology", "Emergency Surgery"]
    },
    {
        "name": "Manipal Hospital",
        "address": "98, HAL Old Airport Rd, Kodihalli, Bangalore, Karnataka 560017",
        "phone": "+91 80 2502 4444",
        "latitude": 12.9592,
        "longitude": 77.6433,
        "rating": 4.5,
        "specialties": ["Trauma & Orthopaedics", "Emergency Medicine", "Intensive Care"]
    },
    {
        "name": "Fortis Hospital",
        "address": "154/9, Bannerghatta Road, Opposite IIM-B, Bangalore, Karnataka 560076",
        "phone": "+91 96633 98899",
        "latitude": 12.8943,
        "longitude": 77.5991,
        "rating": 4.4,
        "specialties": ["Cardiac Emergency", "Accident & Trauma Care", "Neuro-trauma"]
    },
    {
        "name": "Narayana Health City",
        "address": "258/A, Bommasandra Industrial Area, Anekal Taluk, Bangalore, Karnataka 560099",
        "phone": "+91 80 7122 2222",
        "latitude": 12.8123,
        "longitude": 77.6897,
        "rating": 4.7,
        "specialties": ["Cardiac Care", "Emergency Trauma", "Paediatric Emergency"]
    },
    {
        "name": "Aster CMI Hospital",
        "address": "43/2, New Airport Road, NH.7, Sahakara Nagar, Hebbal, Bangalore, Karnataka 560092",
        "phone": "+91 80 4342 0100",
        "latitude": 13.0612,
        "longitude": 77.5959,
        "rating": 4.6,
        "specialties": ["Multi-specialty Trauma", "Critical Care", "Stroke Unit"]
    },
    {
        "name": "Columbia Asia Referral Hospital",
        "address": "26/4, Brigade Gateway, Beside Metro Cash and Carry, Yeshwanthpur, Bangalore, Karnataka 560055",
        "phone": "+91 80 3989 8969",
        "latitude": 13.0125,
        "longitude": 77.5552,
        "rating": 4.3,
        "specialties": ["General Emergency", "Orthopaedics", "Neurosurgery"]
    },
    {
        "name": "HBS Hospital",
        "address": "58, Cockburn Rd, Shivajinagar, Bangalore, Karnataka 560051",
        "phone": "+91 80 2554 1107",
        "latitude": 12.9892,
        "longitude": 77.6084,
        "rating": 4.2,
        "specialties": ["Dialysis & Emergency", "General Surgery", "Intensive Care"]
    },
    {
        "name": "Bangalore Baptist Hospital",
        "address": "Bellary Rd, Hebbal, Bangalore, Karnataka 560024",
        "phone": "+91 80 2202 4700",
        "latitude": 13.0275,
        "longitude": 77.5928,
        "rating": 4.4,
        "specialties": ["Accident Emergency Services", "General Medicine", "Pediatrics"]
    }
]

police_stations_data = [
    {
        "name": "Indiranagar Police Station",
        "address": "100 Feet Rd, Stage 2, Indiranagar, Bangalore, Karnataka 560038",
        "phone": "+91 80 2294 2514",
        "latitude": 12.9708,
        "longitude": 77.6385,
        "rating": 4.1,
        "jurisdiction": "Indiranagar and surrounding sectors"
    },
    {
        "name": "HAL Police Station",
        "address": "HAL Wind Tunnel Road, Murugeshpalya, Bangalore, Karnataka 560017",
        "phone": "+91 80 2294 2520",
        "latitude": 12.9554,
        "longitude": 77.6543,
        "rating": 4.0,
        "jurisdiction": "HAL, Murugeshpalya, and Old Airport Road"
    },
    {
        "name": "Electronic City Police Station",
        "address": "Electronic City Phase 1, Bangalore, Karnataka 560100",
        "phone": "+91 80 2294 3467",
        "latitude": 12.8465,
        "longitude": 77.6711,
        "rating": 4.3,
        "jurisdiction": "Electronic City Phase 1 & 2"
    },
    {
        "name": "Hebbal Police Station",
        "address": "Hebbal Flyover Junction, Bellary Rd, Bangalore, Karnataka 560024",
        "phone": "+91 80 2294 2531",
        "latitude": 13.0354,
        "longitude": 77.5977,
        "rating": 3.9,
        "jurisdiction": "Hebbal, RT Nagar, and parts of Outer Ring Road"
    },
    {
        "name": "Koramangala Police Station",
        "address": "80 Feet Rd, 6th Block, Koramangala, Bangalore, Karnataka 560095",
        "phone": "+91 80 2294 2577",
        "latitude": 12.9362,
        "longitude": 77.6241,
        "rating": 4.2,
        "jurisdiction": "Koramangala 1st to 8th Blocks"
    }
]

towing_services_data = [
    {
        "name": "Bangalore 24/7 Towing Service",
        "address": "Metro Station Road, Indiranagar, Bangalore, Karnataka 560038",
        "phone": "+91 99000 88888",
        "latitude": 12.9719,
        "longitude": 77.6412,
        "rating": 4.7,
        "available": True,
        "vehicle_types": ["2-wheeler", "3-wheeler", "4-wheeler"]
    },
    {
        "name": "Quick Rescue Towing & Flatbed",
        "address": "Near Silk Board Junction, Hosur Road, Bangalore, Karnataka 560068",
        "phone": "+91 98450 12345",
        "latitude": 12.9172,
        "longitude": 77.6228,
        "rating": 4.8,
        "available": True,
        "vehicle_types": ["4-wheeler", "Heavy Commercial"]
    },
    {
        "name": "Express Vehicle Recovery",
        "address": "Outer Ring Road, Marathahalli, Bangalore, Karnataka 560037",
        "phone": "+91 98800 77777",
        "latitude": 12.9562,
        "longitude": 77.7011,
        "rating": 4.5,
        "available": True,
        "vehicle_types": ["2-wheeler", "4-wheeler"]
    },
    {
        "name": "Highway Towing Services Bangalore",
        "address": "Tumkur Road, Peenya, Bangalore, Karnataka 560058",
        "phone": "+91 97411 99999",
        "latitude": 13.0298,
        "longitude": 77.5188,
        "rating": 4.6,
        "available": False,
        "vehicle_types": ["4-wheeler", "Heavy Commercial"]
    },
    {
        "name": "Apex Roadside Towing",
        "address": "Bannerghatta Main Rd, Bangalore, Karnataka 560076",
        "phone": "+91 91234 56789",
        "latitude": 12.8988,
        "longitude": 77.6015,
        "rating": 4.4,
        "available": True,
        "vehicle_types": ["2-wheeler", "3-wheeler", "4-wheeler"]
    },
    {
        "name": "Safe Ride Towing Solutions",
        "address": "Bellary Road, Hebbal, Bangalore, Karnataka 560024",
        "phone": "+91 90088 11223",
        "latitude": 13.0411,
        "longitude": 77.5912,
        "rating": 4.9,
        "available": True,
        "vehicle_types": ["2-wheeler", "4-wheeler"]
    }
]

async def seed_data():
    print(f"Connecting to MongoDB at {MONGODB_URL}...")
    client = AsyncIOMotorClient(MONGODB_URL)
    
    # Get default database
    db_name = "roadsos"
    try:
        default_db = client.get_default_database()
        if default_db is not None and default_db.name != "admin" and default_db.name != "local":
            db_name = default_db.name
    except Exception:
        pass
        
    db = client[db_name]
    print(f"Target Database: {db_name}")
    
    # Clear existing data
    print("Clearing existing seed collections...")
    await db.hospitals.delete_many({})
    await db.police_stations.delete_many({})
    await db.towing_services.delete_many({})
    
    # Insert Hospitals
    print(f"Seeding {len(hospitals_data)} hospitals...")
    await db.hospitals.insert_many(hospitals_data)
    
    # Insert Police Stations
    print(f"Seeding {len(police_stations_data)} police stations...")
    await db.police_stations.insert_many(police_stations_data)
    
    # Insert Towing Services
    print(f"Seeding {len(towing_services_data)} towing services...")
    await db.towing_services.insert_many(towing_services_data)
    
    # Create indexes for geospatial queries (optional but good practice)
    print("Creating indexes...")
    await db.hospitals.create_index([("latitude", 1), ("longitude", 1)])
    await db.police_stations.create_index([("latitude", 1), ("longitude", 1)])
    await db.towing_services.create_index([("latitude", 1), ("longitude", 1)])
    
    print("Database seeding completed successfully! [OK]")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
