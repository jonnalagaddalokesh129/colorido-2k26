# RoadSOS Backend — FastAPI & MongoDB

This is the FastAPI backend for the RoadSOS Emergency Roadside Assistance Mobile Application. It integrates with MongoDB for user management, SOS alerting, nearby emergency service lookups (hospitals, police, towing), and emergency contacts CRUD.

## Features

- **JWT Authentication & Security**: Secure endpoints using bcrypt for password hashing and pyjwt/python-jose for token management.
- **Async Database Connection**: Uses `motor` (async MongoDB client) for high performance.
- **Emergency Service Lookups**: Nearby hospitals, police stations, and towing services filtered and sorted using the Haversine formula based on the user's coordinates.
- **SOS Alerting**: Creating and tracking active emergency alerts.
- **Emergency Contacts**: Complete CRUD for saving trusted emergency contact details.
- **Indian City Seed Data**: Seeds realistic hospital, police, and towing data for Bangalore.

## Requirements

- Python 3.8 or higher
- MongoDB (Local instance or MongoDB Atlas connection string)

## Installation & Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   Copy `env.example` to `.env` and update details as needed:
   ```bash
   copy env.example .env
   ```
   *Note: By default, the database URL is set to `mongodb://localhost:27017/roadsos`. If you are using MongoDB Atlas, replace it with your Atlas connection string.*

5. **Seed the database**:
   Run the seed script to populate hospitals, police, and towing data:
   ```bash
   python app/database/seed.py
   ```

6. **Start the server**:
   ```bash
   python main.py
   ```
   Or:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

7. **API Documentation**:
   Once the server is running, visit:
   - Swagger Interactive Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
   - ReDoc Alternative Documentation: [http://localhost:8000/redoc](http://localhost:8000/redoc)
