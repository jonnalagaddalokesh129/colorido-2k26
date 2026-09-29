-- ==============================================================================
-- COLORIDO 2K26 — FULL-STACK EVENT MANAGEMENT PLATFORM SCHEMA
-- Target Database: PostgreSQL 14+ / Supabase
-- Description: Complete schema supporting authentication, participants, events,
--              schedules, clash detection, QR check-in, results, live leaderboard,
--              certificates, announcements, sponsors, gallery, and contact system.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. PROFILES TABLE (Supabase Auth linked profiles)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
    date_of_birth DATE,
    college TEXT NOT NULL,
    department TEXT,
    year TEXT,
    city TEXT,
    state TEXT,
    role TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('participant', 'coordinator', 'admin')),
    coordinator_status TEXT DEFAULT 'pending' CHECK (coordinator_status IN ('pending', 'approved', 'rejected', 'suspended')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. VENUES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS venues (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_code TEXT UNIQUE,
    location TEXT NOT NULL,
    capacity INT NOT NULL DEFAULT 500,
    facilities TEXT[] DEFAULT '{}',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. EVENT CATEGORIES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS event_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_name TEXT,
    display_order INT DEFAULT 0
);

-- ==============================================================================
-- 4. EVENTS TABLE (Contains all 16 required competition events + custom fields)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS events (
    event_id TEXT PRIMARY KEY,
    event_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('cultural', 'sports')),
    sub_category TEXT NOT NULL, -- e.g. 'solo', 'group', 'boys', 'girls', 'general'
    description TEXT NOT NULL,
    rules TEXT[] NOT NULL DEFAULT '{}',
    eligibility TEXT NOT NULL DEFAULT 'Open to all enrolled university/college students with valid ID',
    participation_type TEXT NOT NULL CHECK (participation_type IN ('individual', 'team')),
    team_size_min INT NOT NULL DEFAULT 1,
    team_size_max INT NOT NULL DEFAULT 1,
    registration_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    venue_id TEXT REFERENCES venues(id) ON DELETE SET NULL,
    venue TEXT NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    registration_deadline TIMESTAMPTZ NOT NULL,
    maximum_participants INT NOT NULL DEFAULT 100,
    current_participants INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'ongoing', 'completed')),
    event_image TEXT,
    coordinator_name TEXT NOT NULL,
    coordinator_contact TEXT NOT NULL,
    coordinator_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. SCHEDULES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id TEXT NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    day_number INT NOT NULL CHECK (day_number BETWEEN 1 AND 5),
    schedule_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    venue_id TEXT REFERENCES venues(id) ON DELETE SET NULL,
    venue_name TEXT NOT NULL,
    round_name TEXT NOT NULL DEFAULT 'Main Event',
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'delayed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. PARTICIPANTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(user_id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    college TEXT NOT NULL,
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    gender TEXT NOT NULL,
    city TEXT,
    state TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. REGISTRATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id TEXT UNIQUE NOT NULL, -- e.g. COL26-CUL-001245
    event_id TEXT NOT NULL REFERENCES events(event_id) ON DELETE RESTRICT,
    user_id UUID,
    participant_id UUID REFERENCES participants(id) ON DELETE SET NULL,
    participant_name TEXT NOT NULL,
    participant_email TEXT NOT NULL,
    participant_phone TEXT NOT NULL,
    participant_college TEXT NOT NULL,
    participation_type TEXT NOT NULL CHECK (participation_type IN ('individual', 'team')),
    team_name TEXT,
    team_size INT DEFAULT 1,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'waitlisted', 'checked_in', 'cancelled')),
    qr_code_data TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. TEAM MEMBERS TABLE (For group/team registrations)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id TEXT NOT NULL REFERENCES registrations(registration_id) ON DELETE CASCADE,
    member_name TEXT NOT NULL,
    member_email TEXT,
    member_phone TEXT,
    member_college TEXT,
    roll_number TEXT,
    role TEXT DEFAULT 'member' CHECK (role IN ('leader', 'member')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. FAVORITES / MY EVENTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    event_id TEXT NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);

-- ==============================================================================
-- 10. NOTIFICATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT, -- NULL denotes broadcast to all users
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('reminder', 'announcement', 'result', 'system', 'checkin')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'important', 'urgent')),
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 11. ANNOUNCEMENTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('IMPORTANT', 'GENERAL', 'CULTURAL', 'SPORTS', 'SCHEDULE', 'RESULTS')),
    priority TEXT NOT NULL DEFAULT 'Normal' CHECK (priority IN ('Normal', 'Important', 'Urgent')),
    is_published BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    author TEXT DEFAULT 'Festival Secretariat',
    pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 12. RESULTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id TEXT NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    position TEXT NOT NULL CHECK (position IN ('1st Place', '2nd Place', '3rd Place', 'Special Mention')),
    winner_type TEXT CHECK (winner_type IN ('Winner', 'Runner-up', 'Second Runner-up', 'Special Mention')),
    participant_name TEXT NOT NULL,
    team_name TEXT,
    college TEXT NOT NULL,
    score TEXT NOT NULL, -- e.g. '98.5 pts' or '21-18, 21-19'
    points_awarded INT NOT NULL DEFAULT 0, -- 10 for 1st, 7 for 2nd, 5 for 3rd
    is_published BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 13. LEADERBOARD TABLE (Dynamic college points calculation)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS leaderboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_name TEXT UNIQUE NOT NULL,
    cultural_points INT NOT NULL DEFAULT 0,
    sports_points INT NOT NULL DEFAULT 0,
    total_points INT NOT NULL DEFAULT 0,
    gold_count INT NOT NULL DEFAULT 0,
    silver_count INT NOT NULL DEFAULT 0,
    bronze_count INT NOT NULL DEFAULT 0,
    rank INT DEFAULT 1,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 14. CHECKINS TABLE (QR Verification & Attendance)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id TEXT UNIQUE NOT NULL REFERENCES registrations(registration_id) ON DELETE CASCADE,
    event_id TEXT NOT NULL REFERENCES events(event_id),
    participant_name TEXT NOT NULL,
    college TEXT NOT NULL,
    checked_in_by TEXT DEFAULT 'Gate Coordinator',
    checked_in_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

-- ==============================================================================
-- 15. CERTIFICATES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_id TEXT UNIQUE NOT NULL, -- e.g. CERT-COL26-8921
    registration_id TEXT REFERENCES registrations(registration_id) ON DELETE SET NULL,
    event_id TEXT NOT NULL REFERENCES events(event_id),
    user_id TEXT,
    participant_name TEXT NOT NULL,
    college TEXT NOT NULL,
    certificate_type TEXT NOT NULL CHECK (certificate_type IN ('Participation Certificate', 'Winner Certificate', 'Runner-up Certificate', 'Special Recognition')),
    achievement TEXT NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    authorized_signatory_1 TEXT DEFAULT 'Dr. Arvind Sharma (Festival Convener)',
    authorized_signatory_2 TEXT DEFAULT 'Prof. Sunita Rao (Dean Student Affairs)',
    verification_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 16. GALLERY TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('CULTURAL', 'SPORTS', 'PERFORMANCES', 'CAMPUS', 'PARTICIPANTS', 'HIGHLIGHTS')),
    event_id TEXT REFERENCES events(event_id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT FALSE,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 17. SPONSORS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS sponsors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('TITLE SPONSOR', 'GOLD SPONSOR', 'SILVER SPONSOR', 'EVENT PARTNER', 'MEDIA PARTNER')),
    logo_url TEXT NOT NULL,
    description TEXT,
    website_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 18. CONTACT MESSAGES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    category TEXT DEFAULT 'General Inquiry',
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_sub_category ON events(sub_category);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_day ON schedules(day_number);
CREATE INDEX IF NOT EXISTS idx_announcements_cat ON announcements(category);
CREATE INDEX IF NOT EXISTS idx_results_event ON results(event_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON leaderboard(rank);
CREATE INDEX IF NOT EXISTS idx_checkins_reg ON checkins(registration_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read policies for open public festival content
CREATE POLICY "Public can view published events" ON events FOR SELECT USING (true);
CREATE POLICY "Public can view schedules" ON schedules FOR SELECT USING (true);
CREATE POLICY "Public can view published announcements" ON announcements FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published results" ON results FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view leaderboard" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Public can view gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public can view sponsors" ON sponsors FOR SELECT USING (true);
CREATE POLICY "Public can view venues" ON venues FOR SELECT USING (true);

-- User-scoped policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own registrations" ON registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own registrations" ON registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id IS NULL OR auth.uid()::text = user_id);
CREATE POLICY "Users can view own certificates" ON certificates FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Anyone can submit contact message" ON contact_messages FOR INSERT WITH CHECK (true);
