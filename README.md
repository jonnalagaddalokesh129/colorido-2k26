# RoadSOS — Emergency Roadside Rescue Mobile Application

RoadSOS is a premium, high-fidelity, full-stack emergency roadside assistance and trauma recovery mobile platform. Developed using **React Native (Expo)** on the frontend and **FastAPI (Python)** on the backend, it serves as a robust system to coordinate real-time rescue operations for motorists in distress.

---

## 🌟 Core System Features

*   **Pulsing SOS Beacon**: A circular, high-impact emergency trigger utilizing Reanimated and Haptic feedback. One tap communicates your exact coordinates to the rescue operations database.
*   **Live Responder Telemetry Grid**: Coordinates real-time responder dispatches with fluctuating dispatch speed telemetry, live ETA countdown, and declining distance metrics.
*   **Geospatial Tracking Maps**: Full-screen, dark-styled maps loaded with custom Google Maps styling. Visualizes nearby trauma networks, police stations, towing zones, and tracks an active responder unit moving directly towards your GPS location.
*   **Automated Guardian Notifications**: Complete CRUD for trusted emergency contacts. Guardian contacts are automatically flagged and queued for notification broadcasts with live GPS tracking links when an SOS is triggered.
*   **Agile Dispatch Selectors**: Custom booking cards supporting choice between agile Rapid 2-Wheel response squads and heavy Patient ICU / flatbed recovery transporters.
*   **Comprehensive Rescue logs**: Persistent logs of past rescue incidents storing historical coordinate logs, timestamp markers, and Google Maps navigations.
*   **Secured Authentication & Medical Profiles**: JWT-secured signup/login with SecureStore tokens, letting users maintain personal demographics, emergency contact lists, and essential medical profile headers (blood group, allergies).

---

## 🛠️ Technology Stack

### Frontend Mobile Client
*   **Core**: React Native, Expo (SDK 51+), Expo Router (File-based navigation)
*   **TypeScript**: Complete type-safety across navigation states and API responses
*   **Styling**: Pure CSS stylesheets supporting custom dark palette tokens
*   **Animations**: React Native Reanimated for smooth custom gradient pulses
*   **Map API**: React Native Maps with customized Google Maps dark scheme styling
*   **Storage**: Expo SecureStore (JWT Tokens) & AsyncStorage (Theme/Config Cache)
*   **Validation**: React Hook Form with Zod schemas
*   **Location Services**: Expo Location (Permissions, coordinate tracking, reverse geocoding)
*   **Communication**: Axios client featuring token interceptors and auto-auth checkouts

### Backend Server
*   **Web Framework**: FastAPI (Asynchronous Python)
*   **Database**: MongoDB Atlas (Cloud NoSQL Storage) via Motor (Async MongoDB Driver)
*   **Security**: JWT Token cryptography (python-jose), bcrypt password-hash algorithms (passlib)
*   **Validation**: Pydantic v2 schemas for all payload validations
*   **Dummy Seeding**: Custom programmatic seeder populating realistic trauma hubs, towing networks, and police sectors around Bangalore GPS landmarks

---

## 📂 Project Directory Structure

```
d:\loki_pro\
├── frontend/                    # React Native Expo app
│   ├── app/                     # Expo Router file-based routing
│   │   ├── (auth)/              # JWT login & register forms
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── forgot-password.tsx
│   │   ├── (tabs)/              # Core tabbed navigation
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx        # SOS pulse dashboard
│   │   │   ├── services.tsx     # Services grid layout
│   │   │   ├── map.tsx          # Master locator Map
│   │   │   └── profile.tsx      # Personal & medical profiles
│   │   ├── hospitals.tsx        # Nearby Trauma Hub lists
│   │   ├── police.tsx           # Nearby Police Stations
│   │   ├── towing.tsx           # Vehicle Rescue partners
│   │   ├── book-ride.tsx        # Dispatch booking panel
│   │   ├── track-rescue.tsx     # Live telemetry tracking
│   │   ├── emergency-contacts.tsx # Guardian CRUD interface
│   │   ├── about.tsx            # Info prose screen
│   │   ├── sos-history.tsx      # Historical incident logs
│   │   └── _layout.tsx          # Base app router setup
│   ├── components/              # High-fidelity custom components
│   │   ├── ui/                  # Cards, buttons, loaders, empty-states, headers
│   │   ├── SOSButton.tsx        # Pulsing SOS gradient trigger
│   │   ├── GuardianProfile.tsx  # Call/Verify responder card
│   │   ├── TelemetryGrid.tsx    # Live speed/ETA mono tiles
│   │   └── ContactCard.tsx      # Slide-out CRUD contact tile
│   └── constants/               # Curated HSL dark colors & Inter typographies
│
└── backend/                     # FastAPI python server
    ├── app/
    │   ├── routes/              # Auth, users, SOS alerts, hospital, towing routers
    │   ├── models/              # MongoDB BSON schematics
    │   ├── schemas/             # Pydantic data modeling
    │   ├── database/            # Connection manager & Bangalore seeder script
    │   └── utils/               # Bcrypt & JWT verification pipelines
    ├── main.py                  # Server entry point
    └── requirements.txt         # Pip dependency manifest
```

---

## 🚀 Execution & Setup Guide

### 1. Prerequisites
*   Node.js (v18 or higher)
*   Python (v3.9 or higher)
*   MongoDB running locally on standard port `27017` (or MongoDB Atlas cluster)

### 2. Backend Installation & Run
Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment and activate it:
**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

Install python requirements:
```bash
pip install -r requirements.txt
```

Verify your `.env` configuration (a default local development setup is provided):
```env
MONGODB_URL=mongodb://localhost:27017/roadsos
JWT_SECRET_KEY=4a1c6a2db87d60ff312015df33b8a1c97a5d3f234bf999cb84e7232230230234
JWT_ALGORITHM=HS256
JWT_EXPIRY_MINUTES=1440
```

Seed the database with realistic Bangalore response unit datasets:
```bash
python app/database/seed.py
```

Start the async server:
```bash
uvicorn main:app --reload
```
Once started, the interactive API documentation will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend Installation & Run
Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
```

Install npm packages:
```bash
npm install
```

Start the Expo Development Server:
```bash
npx expo start
```
You can now open the app on your mobile device (via **Expo Go** by scanning the QR code) or boot it on an **iOS Simulator** or **Android Emulator**.

---

## 🛡️ Verification & Testing Checklists

1.  **Authentication**: Register a new user, log out, log back in, and verify that the JWT token is saved securely.
2.  **Emergency SOS Pulse**: Tap the large pulsating SOS button on the home tab, accept the prompt, and verify that the alarm registers and displays on your **Incident Log** (`sos-history.tsx`).
3.  **Transit Dispatch**: Go to the **Services** tab, select **Ambulance Dispatch** or **Vehicle Rescue**, specify a destination, choose your vehicle class, and verify that the system engages **Live Tracking** with active operator dispatches, dynamic speeds, and countdowns.
4.  **Guardian Contacts**: Add emergency contacts in the profile tab, perform edits, verify validation warnings trigger on incorrect formats, and confirm CRUD functionality works seamlessly.
