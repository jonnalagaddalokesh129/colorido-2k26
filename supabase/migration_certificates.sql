-- ==============================================================================
-- COLORIDO 2K26 — Certificates & Winner Management Migration
-- ==============================================================================

-- 1. Ensure cert_available flag exists on events
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS cert_available BOOLEAN DEFAULT FALSE;

-- 2. Enhance certificates table with lifecycle and winner metadata
ALTER TABLE certificates 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'issued' CHECK (status IN ('pending', 'issued', 'revoked')),
ADD COLUMN IF NOT EXISTS winner_position TEXT CHECK (winner_position IN ('1st Place', '2nd Place', '3rd Place')),
ADD COLUMN IF NOT EXISTS assigned_by TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS revoke_reason TEXT;

-- Enforce uniqueness: one participation cert per registration, and one valid winner per event + position
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_participation_cert 
ON certificates (registration_id, certificate_type) 
WHERE certificate_type = 'Participation Certificate' AND status != 'revoked';

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_winner_position_cert 
ON certificates (event_id, winner_position) 
WHERE winner_position IS NOT NULL AND status != 'revoked';

-- 3. Winner Assignments table (for admin draft & staging before confirmation)
CREATE TABLE IF NOT EXISTS winner_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id TEXT NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    registration_id TEXT NOT NULL REFERENCES registrations(registration_id) ON DELETE CASCADE,
    user_id TEXT,
    participant_name TEXT NOT NULL,
    college TEXT NOT NULL,
    position TEXT NOT NULL CHECK (position IN ('1st Place', '2nd Place', '3rd Place')),
    assigned_by TEXT NOT NULL,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed BOOLEAN DEFAULT FALSE,
    certificate_id TEXT,
    CONSTRAINT unique_event_winner_position UNIQUE (event_id, position)
);

-- 4. Enable RLS on winner_assignments
ALTER TABLE winner_assignments ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Admins can do all operations
CREATE POLICY "Admins full access to certificates" 
ON certificates FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Public can verify issued certificates by certificate_id (non-sensitive fields)
CREATE POLICY "Public can verify issued certificates" 
ON certificates FOR SELECT 
USING (true);

-- Admins full access to winner_assignments
CREATE POLICY "Admins full access to winner assignments" 
ON winner_assignments FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
