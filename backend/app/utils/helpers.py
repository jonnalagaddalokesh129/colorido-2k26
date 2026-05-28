from bson import ObjectId
import math

# Fields that must never be returned in API responses
_SENSITIVE_FIELDS = {"password", "hashed_password"}

def parse_mongo_id(doc: dict) -> dict:
    if not doc:
        return doc
    new_doc = doc.copy()
    if "_id" in new_doc:
        new_doc["id"] = str(new_doc["_id"])
        del new_doc["_id"]
    
    # Process nested lists and dicts if necessary
    for k, v in new_doc.items():
        if isinstance(v, ObjectId):
            new_doc[k] = str(v)
        elif isinstance(v, dict):
            new_doc[k] = parse_mongo_id(v)
        elif isinstance(v, list):
            new_list = []
            for item in v:
                if isinstance(item, ObjectId):
                    new_list.append(str(item))
                elif isinstance(item, dict):
                    new_list.append(parse_mongo_id(item))
                else:
                    new_list.append(item)
            new_doc[k] = new_list
            
    return new_doc

def parse_mongo_list(docs: list) -> list:
    return [parse_mongo_id(doc) for doc in docs]

def parse_mongo_user(doc: dict) -> dict:
    """Like parse_mongo_id but also strips sensitive fields (password, etc.)."""
    parsed = parse_mongo_id(doc)
    return {k: v for k, v in parsed.items() if k not in _SENSITIVE_FIELDS}


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    # Haversine formula to calculate distance in km between two points
    R = 6371.0  # Earth radius in kilometers
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    distance = R * c
    return round(distance, 2)
