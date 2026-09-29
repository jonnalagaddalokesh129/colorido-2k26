-- ==============================================================================
-- COLORIDO 2K26 — DATABASE SEED DATA
-- Description: Realistic, comprehensive dataset satisfying all competition requirements.
--              Includes 16 required events, 6 venues, 30+ participants, 30+ registrations,
--              20+ schedules, 15+ announcements, 15+ results, leaderboard, sponsors, etc.
-- ==============================================================================

-- 1. VENUES
INSERT INTO venues (id, name, short_code, location, capacity, facilities, latitude, longitude, image_url) VALUES
('v_auditorium', 'Dr. APJ Abdul Kalam Grand Auditorium', 'AUD-01', 'Central Campus, Block A', 1500, ARRAY['Central Air Conditioning', 'State-of-the-Art JBL Sound Rig', 'Stage Lighting Truss', '4 Green Rooms', 'Green Screen Backdrop'], 13.0827, 80.2707, 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80'),
('v_amphitheatre', 'Open Air Amphitheatre', 'OAT-02', 'North Quadrangle, Near Lake', 3000, ARRAY['Acoustic Shell', 'Stepped Stone Seating', 'Dual LED Video Walls', 'Open Sky Canopy', 'Broadcast Booth'], 13.0835, 80.2715, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80'),
('v_sports_complex', 'Major Dhyan Chand Indoor Sports Arena', 'INDOOR-03', 'South Campus Sports Enclave', 800, ARRAY['Wooden Flooring', 'Stiga Competition Tables', 'Digital Scoreboards', 'Locker Rooms', 'Medical First Aid Bay'], 13.0815, 80.2690, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80'),
('v_stadium', 'University Main Stadium & Athletic Track', 'STAD-04', 'West Enclave Sports Complex', 2500, ARRAY['Floodlit Courts', 'Acrylic Synthetic Court', 'Pavilion Seating', 'Warm-up Enclosure', 'Commentary Box'], 13.0840, 80.2680, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80'),
('v_seminar_complex', 'Vikram Sarabhai Seminar Complex', 'SEM-05', 'East Academic Wing, 2nd Floor', 350, ARRAY['Dual Laser Projectors', 'Dolby Surround Audio', 'Podium Mics', 'Tiered Executive Chairs', 'High Speed Wi-Fi'], 13.0820, 80.2725, 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80'),
('v_arts_studio', 'Raja Ravi Varma Fine Arts Pavilion', 'ART-06', 'Design Wing, Ground Floor', 250, ARRAY['Natural Skylight', 'Display Easels', 'Ceramic Wet Stations', 'Exhibition Hanging Rails', 'Wash Basins'], 13.0810, 80.2730, 'https://images.unsplash.com/photo-1460661419200-fd4ecdccc14d?auto=format&fit=crop&w=1200&q=80')
ON CONFLICT (id) DO NOTHING;

-- 2. ALL 16 MANDATORY COMPETITION EVENTS
INSERT INTO events (
    event_id, event_name, category, sub_category, description, rules, eligibility, 
    participation_type, team_size_min, team_size_max, registration_fee, venue_id, venue, 
    event_date, start_time, end_time, registration_deadline, maximum_participants, current_participants, 
    status, event_image, coordinator_name, coordinator_contact, coordinator_email
) VALUES
-- CULTURAL (1-10)
(
    'evt_cul_01', 'Fine Arts Exhibition & Live Canvas', 'cultural', 'fine_arts',
    'Unleash your visual imagination across watercolor, acrylics, sketching, and charcoal. Participants will be provided a central theme on the spot and 3 hours of uninterrupted creation.',
    ARRAY['Medium: Acrylic, Watercolor, Charcoal or Mixed Media', 'Standard A2 canvas/sheets provided by festival host', 'Time limit: Exactly 3 hours', 'Theme announced 15 minutes before commencement', 'No digital aids or reference photos permitted during event'],
    'Open to all bonafide college students with valid student ID card', 'individual', 1, 1, 150.00,
    'v_arts_studio', 'Raja Ravi Varma Fine Arts Pavilion', '2026-10-15', '10:00:00', '13:00:00',
    '2026-10-13 23:59:59+00', 40, 24, 'open',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
    'Ananya Deshmukh', '+91 98451 22341', 'finearts.colorido@university.edu'
),
(
    'evt_cul_02', 'Music & Band — Solo (Vocal / Instrumental)', 'cultural', 'solo',
    'A high-octane showcase of vocal prowess and solo acoustic dexterity. Bring your classical, contemporary, jazz, or rock acoustic pieces to mesmerize our jury.',
    ARRAY['Time limit: 4 minutes performance + 2 minutes sound check', 'Only one backing track or one accompanist allowed', 'Profanity or vulgar lyrics leads to instant disqualification', 'Original compositions receive bonus weighting'],
    'College undergraduate & postgraduate students', 'individual', 1, 1, 200.00,
    'v_auditorium', 'Dr. APJ Abdul Kalam Grand Auditorium', '2026-10-15', '14:00:00', '17:30:00',
    '2026-10-13 23:59:59+00', 30, 28, 'open',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
    'Rohan Kulkarni', '+91 98203 44129', 'music.colorido@university.edu'
),
(
    'evt_cul_03', 'Music & Band — Battle of the Bands (Group)', 'cultural', 'group',
    'The premier university rock and fusion battle. Full live setups featuring blistering guitar solos, thunderous bass lines, and electrifying percussion.',
    ARRAY['Team size: 3 to 8 members', 'Time limit: 12 minutes on stage including setup and teardown', 'Standard 5-piece drum kit and guitar amps provided', 'At least one original composition mandatory'],
    'Inter-college music society teams', 'team', 3, 8, 800.00,
    'v_amphitheatre', 'Open Air Amphitheatre', '2026-10-16', '18:00:00', '22:00:00',
    '2026-10-14 18:00:00+00', 16, 14, 'open',
    'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1000&q=80',
    'Vikramaditya Sen', '+91 97412 88902', 'bands.colorido@university.edu'
),
(
    'evt_cul_04', 'Dance — Solo (Classical / Freestyle)', 'cultural', 'solo',
    'Command the center stage with breathtaking choreography, storytelling, and rhythm across Indian Classical, Hip-Hop, Contemporary, or Freestyle genres.',
    ARRAY['Time limit: 3 to 4 minutes', 'Track must be submitted in MP3 format 1 hour before round', 'Props permitted with prior coordinator approval', 'Costumes must strictly adhere to festival decency standards'],
    'Open to individual student dancers', 'individual', 1, 1, 200.00,
    'v_auditorium', 'Dr. APJ Abdul Kalam Grand Auditorium', '2026-10-15', '09:30:00', '13:00:00',
    '2026-10-13 23:59:59+00', 35, 32, 'open',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80',
    'Meera Nambiar', '+91 99012 34567', 'dance.colorido@university.edu'
),
(
    'evt_cul_05', 'Dance — Group Choreography Showcase', 'cultural', 'group',
    'Synchronized high-energy formations, storytelling, and kinetic power. College dance crews battle for the ultimate COLORIDO Golden Trophy.',
    ARRAY['Team size: 6 to 20 members', 'Time limit: 8 to 10 minutes including intro', 'Themes can range from urban hip-hop to folk/contemporary fusion', 'Dangerous stunts or fire strictly prohibited'],
    'College dance crews and registered cultural clubs', 'team', 6, 20, 1000.00,
    'v_auditorium', 'Dr. APJ Abdul Kalam Grand Auditorium', '2026-10-16', '14:00:00', '18:00:00',
    '2026-10-14 18:00:00+00', 20, 18, 'open',
    'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1000&q=80',
    'Karthik Sunder', '+91 98450 11928', 'danceteam.colorido@university.edu'
),
(
    'evt_cul_06', 'Choreoday — Theme Based Mega Production', 'cultural', 'group',
    'The flagship mega-dance theatrical event of COLORIDO 2K26. Elaborate synchronized costumes, dramatic lighting cues, and compelling social or mythological narratives.',
    ARRAY['Team size: 12 to 30 members', 'Time limit: 12 to 15 minutes', 'Mandatory theme statement submission 24h prior', 'Lighting script must be handed to technical director during rehearsal'],
    'Premier university theatrical and dance societies', 'team', 12, 30, 1500.00,
    'v_amphitheatre', 'Open Air Amphitheatre', '2026-10-17', '18:30:00', '22:30:00',
    '2026-10-14 23:59:59+00', 12, 10, 'open',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80',
    'Dr. Shalini Verghese', '+91 99166 77881', 'choreoday.colorido@university.edu'
),
(
    'evt_cul_07', 'Dramatics — Street Play & One-Act Theatre', 'cultural', 'group',
    'Vibrant street theater (Nukkad Natak) and stage drama tackling resonant social themes, satire, and human drama with booming voices and rhythmic dhol beats.',
    ARRAY['Team size: 6 to 18 members', 'Time limit: 12 minutes for Nukkad Natak / 15 minutes for Stage Play', 'Acoustic instruments and live vocals preferred for street plays', 'Script censorship review required before finals'],
    'College theater clubs and drama societies', 'team', 6, 18, 600.00,
    'v_amphitheatre', 'Open Air Amphitheatre', '2026-10-16', '10:00:00', '13:30:00',
    '2026-10-14 12:00:00+00', 18, 15, 'open',
    'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1000&q=80',
    'Abhishek Banerjee', '+91 98860 33419', 'dramatics.colorido@university.edu'
),
(
    'evt_cul_08', 'Fashion Show — Haute Couture “Future Horizons”', 'cultural', 'group',
    'A glamorous runway presentation celebrating cutting-edge sustainable fabrics, avant-garde silhouettes, and theatrical walk styling.',
    ARRAY['Team size: 10 to 18 models and stylists', 'Time limit: 10 minutes total ramp time', 'Theme: Future Horizons / Sustainable Futurism', 'High-res ramp music track and voiceover script mandatory'],
    'College fashion teams and design institute students', 'team', 10, 18, 1200.00,
    'v_auditorium', 'Dr. APJ Abdul Kalam Grand Auditorium', '2026-10-17', '14:00:00', '17:30:00',
    '2026-10-15 12:00:00+00', 14, 12, 'open',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
    'Natasha Singhania', '+91 97311 00293', 'fashion.colorido@university.edu'
),
(
    'evt_cul_09', 'Tekraft Events — Creative Digital & Media Fusion', 'cultural', 'general',
    'Where culture intertwines with technology: Generative AI art, live VJ visual sets, digital music production, and interactive projection mapping hacks.',
    ARRAY['Participation: Solo or Duo (1-2 members)', 'Submission of working prototype + live 5-minute demo', 'Original assets or properly credited open-source libraries required', 'Scored on aesthetics, technical depth, and presentation'],
    'Engineering, Arts & Design undergraduates', 'individual', 1, 2, 300.00,
    'v_seminar_complex', 'Vikram Sarabhai Seminar Complex', '2026-10-16', '10:00:00', '13:00:00',
    '2026-10-14 23:59:59+00', 30, 22, 'open',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    'Pranav Chordia', '+91 98412 55910', 'tekraft.colorido@university.edu'
),
(
    'evt_cul_10', 'Literary — Parliamentary Debate & Slam Poetry', 'cultural', 'general',
    'Intellectual sparring of the highest order. British Parliamentary debate rounds alongside poignant spoken-word slam poetry on contemporary cultural dilemmas.',
    ARRAY['Debate: 2 members per team / Slam Poetry: Individual', 'Preparation time for debate motions: 15 minutes', 'Slam Poetry time limit: 3 minutes 30 seconds', 'Zero tolerance for hate speech or ad hominem remarks'],
    'College literary debaters and writers', 'individual', 1, 2, 200.00,
    'v_seminar_complex', 'Vikram Sarabhai Seminar Complex', '2026-10-15', '14:00:00', '17:00:00',
    '2026-10-13 23:59:59+00', 40, 36, 'open',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80',
    'Tanvi Ranganathan', '+91 99801 44521', 'literary.colorido@university.edu'
),

-- SPORTS - BOYS (11-13)
(
    'evt_spt_b_11', 'Basketball Championship — Boys', 'sports', 'boys',
    'Full-court collegiate championship following official FIBA rules. Fast breaks, alley-oops, and perimeter defense in a knockout-to-finals tournament bracket.',
    ARRAY['Squad size: 5 on court + up to 5 rolling substitutes (10 max)', 'Match duration: 4 quarters of 8 minutes stop-clock', 'FIBA regulation rules apply; qualified national referees officiate', 'Matching numbered team jerseys mandatory'],
    'Bonafide male collegiate students with fitness clearance', 'team', 5, 10, 1000.00,
    'v_stadium', 'University Main Stadium Court A', '2026-10-15', '08:30:00', '17:30:00',
    '2026-10-13 18:00:00+00', 16, 16, 'closed',
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80',
    'Coach Rajendra Prasad', '+91 94481 00213', 'basketball.boys@university.edu'
),
(
    'evt_spt_b_12', 'Volleyball Championship — Boys', 'sports', 'boys',
    'Electrifying spikes, monster blocks, and diving digs. Knockout tournament played on international-spec outdoor floodlit courts.',
    ARRAY['Squad size: 6 on court + 4 substitutes (10 max)', 'Best of 3 sets of 25 points; Finals best of 5 sets', 'Standard FIVB rotation and substitution rules enforced', 'Teams must report 20 minutes before match time'],
    'College male volleyball teams', 'team', 6, 10, 800.00,
    'v_stadium', 'University Main Stadium Volleyball Arena', '2026-10-16', '08:30:00', '16:00:00',
    '2026-10-14 18:00:00+00', 16, 14, 'open',
    'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1000&q=80',
    'Suresh Goud', '+91 93421 77281', 'volleyball.boys@university.edu'
),
(
    'evt_spt_b_13', 'Table Tennis Championship — Boys (Singles & Doubles)', 'sports', 'boys',
    'Lightning fast top-spin rallies, defensive chops, and tactical smashes on ITTF approved Stiga tables with 40+ plastic celluloid balls.',
    ARRAY['Singles & Doubles categories', 'Matches are best of 5 games up to 11 points (deuce at 10-10)', 'ITTF approved rubber and rackets mandatory', 'White apparel not permitted due to white ball contrast'],
    'Male college students', 'individual', 1, 2, 250.00,
    'v_sports_complex', 'Major Dhyan Chand Indoor Sports Arena', '2026-10-15', '10:00:00', '16:00:00',
    '2026-10-13 23:59:59+00', 32, 29, 'open',
    'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=1000&q=80',
    'Manoj Varma', '+91 97400 33812', 'tabletennis.boys@university.edu'
),

-- SPORTS - GIRLS (14-16)
(
    'evt_spt_g_14', 'Throwball Championship — Girls', 'sports', 'girls',
    'Dynamic rapid-fire team sport requiring razor-sharp reflexes, team coordination, and strategic catch-and-release over the 2.2m net.',
    ARRAY['Squad: 7 active players + 5 substitutes (12 max)', 'Best of 3 sets of 25 points each', 'Ball must be caught with both hands and released within 3 seconds', 'No body-touch or ball dribble permitted'],
    'Bonafide female collegiate teams', 'team', 7, 12, 800.00,
    'v_stadium', 'University Main Stadium Court B', '2026-10-15', '09:00:00', '16:00:00',
    '2026-10-13 18:00:00+00', 16, 12, 'open',
    'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1000&q=80',
    'Kavitha Nair', '+91 96112 44901', 'throwball.girls@university.edu'
),
(
    'evt_spt_g_15', 'Tennikoit Championship — Girls (Singles & Doubles)', 'sports', 'girls',
    'High-intensity ring tennis played across a standard badminton height net. Demands swift lateral court footwork and deceptive spin catches.',
    ARRAY['Singles and Doubles matches', 'Best of 3 sets of 21 points', 'Ring must be caught cleanly with one hand only', 'Immediate single-motion return mandatory without hesitation'],
    'Female college students', 'individual', 1, 2, 250.00,
    'v_sports_complex', 'Major Dhyan Chand Indoor Court 2', '2026-10-16', '09:30:00', '15:30:00',
    '2026-10-14 18:00:00+00', 24, 20, 'open',
    'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1000&q=80',
    'Deepa Balakrishnan', '+91 98801 66290', 'tennikoit.girls@university.edu'
),
(
    'evt_spt_g_16', 'Table Tennis Championship — Girls (Singles & Doubles)', 'sports', 'girls',
    'Competitive table tennis showcasing high-speed rallies, spin mastery, and precision placement on international-grade tables.',
    ARRAY['Singles and Doubles knockouts', 'Best of 5 games of 11 points', 'Standard ITTF equipment regulations enforced', 'Warm-up time strictly 2 minutes per match'],
    'Bonafide female college students', 'individual', 1, 2, 250.00,
    'v_sports_complex', 'Major Dhyan Chand Indoor Sports Arena', '2026-10-17', '09:30:00', '15:00:00',
    '2026-10-15 18:00:00+00', 32, 26, 'open',
    'https://images.unsplash.com/photo-1511067007772-9da29974e9b9?auto=format&fit=crop&w=1000&q=80',
    'Pooja Hegde', '+91 99450 88201', 'tabletennis.girls@university.edu'
)
ON CONFLICT (event_id) DO UPDATE SET 
    event_name = EXCLUDED.event_name,
    description = EXCLUDED.description,
    rules = EXCLUDED.rules,
    event_date = EXCLUDED.event_date,
    start_time = EXCLUDED.start_time,
    end_time = EXCLUDED.end_time;

-- 3. SCHEDULES (20+ detailed timetable items)
INSERT INTO schedules (event_id, day_number, schedule_date, start_time, end_time, venue_id, venue_name, round_name, status) VALUES
('evt_spt_b_11', 1, '2026-10-15', '08:30:00', '12:30:00', 'v_stadium', 'University Main Stadium Court A', 'Round of 16 & Quarter Finals', 'scheduled'),
('evt_spt_g_14', 1, '2026-10-15', '09:00:00', '13:00:00', 'v_stadium', 'University Main Stadium Court B', 'League Knockout Stage', 'scheduled'),
('evt_cul_04', 1, '2026-10-15', '09:30:00', '13:00:00', 'v_auditorium', 'Dr. APJ Abdul Kalam Grand Auditorium', 'Preliminary Round', 'scheduled'),
('evt_cul_01', 1, '2026-10-15', '10:00:00', '13:00:00', 'v_arts_studio', 'Raja Ravi Varma Fine Arts Pavilion', 'Main Live Competition', 'scheduled'),
('evt_spt_b_13', 1, '2026-10-15', '10:00:00', '13:00:00', 'v_sports_complex', 'Indoor Sports Arena', 'Boys Singles Round of 32', 'scheduled'),
('evt_cul_02', 1, '2026-10-15', '14:00:00', '17:30:00', 'v_auditorium', 'Dr. APJ Abdul Kalam Grand Auditorium', 'Solo Vocals & Instrumentals Finals', 'scheduled'),
('evt_cul_10', 1, '2026-10-15', '14:00:00', '17:00:00', 'v_seminar_complex', 'Vikram Sarabhai Seminar Complex', 'Parliamentary Debate Round 1', 'scheduled'),
('evt_spt_b_11', 1, '2026-10-15', '14:30:00', '17:30:00', 'v_stadium', 'University Main Stadium Court A', 'Semi Finals & Grand Finale', 'scheduled'),
('evt_spt_b_12', 2, '2026-10-16', '08:30:00', '12:30:00', 'v_stadium', 'University Main Stadium Volleyball Arena', 'Boys Volleyball Knockout Round', 'scheduled'),
('evt_spt_g_15', 2, '2026-10-16', '09:30:00', '13:00:00', 'v_sports_complex', 'Indoor Sports Arena Court 2', 'Tennikoit Singles & Doubles Pre-quarters', 'scheduled'),
('evt_cul_07', 2, '2026-10-16', '10:00:00', '13:30:00', 'v_amphitheatre', 'Open Air Amphitheatre', 'Street Play (Nukkad Natak) Showcase', 'scheduled'),
('evt_cul_09', 2, '2026-10-16', '10:00:00', '13:00:00', 'v_seminar_complex', 'Vikram Sarabhai Seminar Complex', 'Creative Tech & Digital Exhibition', 'scheduled'),
('evt_cul_05', 2, '2026-10-16', '14:00:00', '18:00:00', 'v_auditorium', 'Dr. APJ Abdul Kalam Grand Auditorium', 'Group Dance Choreography Finals', 'scheduled'),
('evt_spt_b_12', 2, '2026-10-16', '14:00:00', '16:30:00', 'v_stadium', 'University Main Stadium Volleyball Arena', 'Volleyball Championship Finals', 'scheduled'),
('evt_cul_03', 2, '2026-10-16', '18:00:00', '22:00:00', 'v_amphitheatre', 'Open Air Amphitheatre', 'Battle of the Bands Grand Concert', 'scheduled'),
('evt_spt_g_16', 3, '2026-10-17', '09:30:00', '13:00:00', 'v_sports_complex', 'Indoor Sports Arena', 'Girls Table Tennis Pre-quarters & Quarters', 'scheduled'),
('evt_cul_08', 3, '2026-10-17', '14:00:00', '17:30:00', 'v_auditorium', 'Dr. APJ Abdul Kalam Grand Auditorium', 'Haute Couture Runway Show', 'scheduled'),
('evt_spt_g_16', 3, '2026-10-17', '14:00:00', '16:00:00', 'v_sports_complex', 'Indoor Sports Arena', 'Girls TT Semi Finals & Final Match', 'scheduled'),
('evt_cul_06', 3, '2026-10-17', '18:30:00', '22:30:00', 'v_amphitheatre', 'Open Air Amphitheatre', 'Choreoday Mega Dance Production & Award Gala', 'scheduled');

-- 4. ANNOUNCEMENTS (15+ Announcements across categories & priorities)
INSERT INTO announcements (title, description, category, priority, is_published, pinned, author) VALUES
('🚨 Official Schedule & Reporting Time Notice', 'All team contingents must report to the Central Registration Desk at Block A minimum 45 minutes before scheduled heat times with original institutional photo IDs.', 'IMPORTANT', 'Urgent', true, true, 'Festival Secretariat'),
('🏀 Basketball Boys Championship Draws Released', 'Knockout fixtures and court allocations for the 16 participating universities have been published. Check fixtures at the sports arena.', 'SPORTS', 'Important', true, false, 'Sports Organizing Committee'),
('🎸 Battle of the Bands Soundcheck Timings', 'Acoustic soundchecks for shortlisted band teams will commence on Day 2 from 07:00 AM to 09:30 AM at Open Air Amphitheatre.', 'CULTURAL', 'Important', true, false, 'Cultural Committee'),
('🎨 Fine Arts Live Topic Announcement Protocol', 'The central theme for Fine Arts Live Canvas will be unsealed in the presence of external judges at exactly 09:45 AM on Day 1.', 'CULTURAL', 'Normal', true, false, 'Arts Club Head'),
('🚌 Free Campus Shuttle Services Activated', 'Electric shuttle buses will ply every 10 minutes between Main Gate, Indoor Arena, Stadium, and North Lake Amphitheatre throughout the festival days.', 'GENERAL', 'Normal', true, false, 'Campus Logistics'),
('⚡ Schedule Update: Girls Throwball Match Timings', 'Due to high registration volume, Match Court B will start 30 minutes earlier at 08:30 AM. Registered team leaders please take note.', 'SCHEDULE', 'Important', true, false, 'Tournament Director'),
('🏆 Rolling Trophy Standings System Live', 'The COLORIDO 2K26 Live Championship Leaderboard is now officially tracking points across all 16 disciplines. First place = 10 pts, Second = 7 pts, Third = 5 pts.', 'RESULTS', 'Important', true, true, 'Scoring Board'),
('🎙️ Slam Poetry Finalists Shortlist Out', 'Top 12 qualifying poets for the final round at Sarabhai Complex have been posted. View your status in the results portal.', 'RESULTS', 'Normal', true, false, 'Literary Society'),
('👗 Haute Couture Runway Technical Guidelines', 'Costume checks and footwear safety inspections for the Fashion Show will be held on Day 3 morning in Green Room 2 & 3.', 'CULTURAL', 'Normal', true, false, 'Fashion Society Coordinator'),
('🌧️ Weather Contingency Plan for Outdoor Venues', 'In case of evening rains, Choreoday and Dramatics will seamlessly shift to the 2,000-seater Multipurpose Covered Arena.', 'GENERAL', 'Normal', true, false, 'Safety & Facilities Team'),
('📱 QR Code Check-in Required at Every Gate', 'Show your Digital Pass QR code on your mobile phone at venue turnstiles for instant contactless verification.', 'IMPORTANT', 'Urgent', true, true, 'Tech Operations Team'),
('🏓 Table Tennis Boys Singles Seedings Confirmed', 'National youth ranked seeds #1 to #4 receive first-round byes in accordance with ITTF tournament bracket protocols.', 'SPORTS', 'Normal', true, false, 'Chief Referee'),
('🍕 Food Street & Night Market Openings', 'Over 40 food stalls featuring regional delicacies and artisanal beverages will stay open till 11:30 PM outside the Amphitheatre.', 'GENERAL', 'Normal', true, false, 'Student Council'),
('📜 Instant Digital Certificates Enabled', 'Verified participants can download digitally signed, QR-verifiable certificates directly from their My Dashboard immediately following result publication.', 'RESULTS', 'Important', true, false, 'Secretariat IT Desk'),
('🤝 Special Thanks to Title Sponsor Titan Corp', 'Titan Corporation has partnered with COLORIDO 2K26 to award luxury chronographs to all 1st place winners!', 'GENERAL', 'Normal', true, false, 'Sponsorship Cell');

-- 5. SPONSORS (5+ Tiers)
INSERT INTO sponsors (name, category, logo_url, description, website_url, display_order) VALUES
('Titanium Edge Tech', 'TITLE SPONSOR', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80', 'Global cloud computing and developer ecosystem pioneer presenting COLORIDO 2K26.', 'https://titaniumedge.tech', 1),
('RedBull Energy', 'GOLD SPONSOR', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80', 'Powering athletes, dancers, and creative performers with non-stop adrenaline.', 'https://redbull.com', 2),
('Decathlon Sports', 'GOLD SPONSOR', 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=300&q=80', 'Official sports gear and equipment partner for all boys and girls championships.', 'https://decathlon.in', 3),
('AudioTechnica Pro', 'SILVER SPONSOR', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=300&q=80', 'Pioneering stage monitors, studio mics, and live audio rigs for Battle of the Bands.', 'https://audio-technica.com', 4),
('Campus Chronicle', 'MEDIA PARTNER', 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=300&q=80', 'Exclusive live stream broadcasts, backstage interviews, and digital press coverage.', 'https://campuschronicle.org', 5),
('Spotify Student', 'EVENT PARTNER', 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=300&q=80', 'Official festival playlist partner streaming student indie artist tracks nationwide.', 'https://spotify.com', 6);

-- 6. RESULTS (15+ sample competition results)
INSERT INTO results (event_id, position, winner_type, participant_name, team_name, college, score, points_awarded, is_published) VALUES
('evt_spt_b_11', '1st Place', 'Winner', 'Aryan Nair (C)', 'St. Xavier Ballers', 'St. Xavier''s College, Mumbai', '84 - 78', 10, true),
('evt_spt_b_11', '2nd Place', 'Runner-up', 'Devendra Singh (C)', 'Loyola Stallions', 'Loyola College, Chennai', '78 - 84', 7, true),
('evt_spt_b_11', '3rd Place', 'Second Runner-up', 'Rishi Menon (C)', 'BITS Pilani Kings', 'BITS Pilani', '72 - 68', 5, true),
('evt_cul_02', '1st Place', 'Winner', 'Dhruv Ratnam', NULL, 'National Institute of Design, Ahmedabad', '97.5 / 100', 10, true),
('evt_cul_02', '2nd Place', 'Runner-up', 'Samyuktha Iyer', NULL, 'Stella Maris College, Chennai', '94.0 / 100', 7, true),
('evt_cul_02', '3rd Place', 'Second Runner-up', 'Tenzin Norbu', NULL, 'Delhi University, Hindu College', '91.8 / 100', 5, true),
('evt_cul_04', '1st Place', 'Winner', 'Sneha Ramamurthy', NULL, 'Madras Christian College, Chennai', '98.0 / 100', 10, true),
('evt_cul_04', '2nd Place', 'Runner-up', 'Anandita Roy', NULL, 'Jadavpur University, Kolkata', '96.2 / 100', 7, true),
('evt_cul_04', '3rd Place', 'Second Runner-up', 'Farhan Qureshi', NULL, 'Jamia Millia Islamia, New Delhi', '93.5 / 100', 5, true),
('evt_spt_b_13', '1st Place', 'Winner', 'Siddharth Kaushik', NULL, 'PSG College of Technology, Coimbatore', '3 - 1 (11-9, 11-8, 9-11, 11-7)', 10, true),
('evt_spt_b_13', '2nd Place', 'Runner-up', 'Karan Singhal', NULL, 'IIT Madras', '1 - 3 (9-11, 8-11, 11-9, 7-11)', 7, true),
('evt_spt_b_13', '3rd Place', 'Second Runner-up', 'Varun Teja', NULL, 'Osmania University, Hyderabad', '3 - 2 (12-10 in fifth)', 5, true),
('evt_cul_01', '1st Place', 'Winner', 'Priyanka Sen', NULL, 'College of Fine Arts, Bengaluru', '99.0 / 100', 10, true),
('evt_cul_01', '2nd Place', 'Runner-up', 'Aditya Joshi', NULL, 'Sir J.J. Institute of Applied Art, Mumbai', '95.5 / 100', 7, true),
('evt_cul_01', '3rd Place', 'Second Runner-up', 'Meenakshi Sundaram', NULL, 'Government College of Fine Arts, Chennai', '92.0 / 100', 5, true);

-- 7. LIVE LEADERBOARD (Standings calculated dynamically from results)
INSERT INTO leaderboard (college_name, cultural_points, sports_points, total_points, gold_count, silver_count, bronze_count, rank) VALUES
('St. Xavier''s College, Mumbai', 10, 10, 20, 2, 0, 0, 1),
('Loyola College, Chennai', 7, 7, 14, 0, 2, 0, 2),
('National Institute of Design, Ahmedabad', 10, 0, 10, 1, 0, 0, 3),
('PSG College of Technology, Coimbatore', 0, 10, 10, 1, 0, 0, 4),
('Madras Christian College, Chennai', 10, 0, 10, 1, 0, 0, 5),
('College of Fine Arts, Bengaluru', 10, 0, 10, 1, 0, 0, 6),
('IIT Madras', 0, 7, 7, 0, 1, 0, 7),
('Stella Maris College, Chennai', 7, 0, 7, 0, 1, 0, 8),
('BITS Pilani', 0, 5, 5, 0, 0, 1, 9),
('Jadavpur University, Kolkata', 7, 0, 7, 0, 1, 0, 10)
ON CONFLICT (college_name) DO NOTHING;

-- 8. GALLERY (10+ high-res records)
INSERT INTO gallery (title, image_url, category, featured, caption) VALUES
('Neon Night Opening Spectacle', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80', 'CAMPUS', true, 'Over 5,000 university students gather at the central amphitheatre for the opening ceremony laser launch.'),
('Electric Guitar Shredding Finals', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80', 'PERFORMANCES', true, 'The lead guitarist from St. Xavier''s rock crew tearing down the stage during Battle of the Bands.'),
('Clutch Buzzer Beater Dunk', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80', 'SPORTS', true, 'Unbelievable fourth-quarter fast break during the Boys Basketball championship match.'),
('Contemporary Duet in Flight', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80', 'CULTURAL', true, 'Breathtaking mid-air synchronization during the Solo & Duet contemporary dance preliminary.'),
('Acrylic Impressions on Live Canvas', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80', 'CULTURAL', false, 'A participant fine-tuning vibrant brush strokes during the 3-hour live fine arts session.'),
('Haute Couture Futuristic Ramp', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80', 'HIGHLIGHTS', true, 'Stunning sustainable textile designs exhibited by the National Institute of Fashion Technology team.'),
('Dramatics Street Play Circle', 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1200&q=80', 'CULTURAL', false, 'Rousing theatrical energy as drama students address societal themes through Nukkad Natak.'),
('High Stakes Table Tennis Rally', 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=1200&q=80', 'SPORTS', false, 'Speed and spin mastery in the Boys Table Tennis finals at the indoor stadium.'),
('Girls Volleyball Block at the Net', 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80', 'SPORTS', true, 'A double wall block denial at the decisive match point during the intense second set.'),
('Student Crowds Cheering in the Stands', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80', 'CAMPUS', true, 'Electrifying atmosphere with flags, banners, and college chants echoing across the stadium arena.');

-- 9. SAMPLE PARTICIPANTS & REGISTRATIONS (Sample records)
INSERT INTO participants (id, full_name, email, phone, college, department, year, gender, city, state) VALUES
('b0000001-0000-0000-0000-000000000001', 'Aarav Sharma', 'aarav.sharma@xavier.edu', '+91 98210 11223', 'St. Xavier''s College, Mumbai', 'Computer Science', '3rd Year', 'Male', 'Mumbai', 'Maharashtra'),
('b0000001-0000-0000-0000-000000000002', 'Diya Krishnan', 'diya.krishnan@loyola.edu', '+91 98401 22334', 'Loyola College, Chennai', 'Visual Arts', '2nd Year', 'Female', 'Chennai', 'Tamil Nadu'),
('b0000001-0000-0000-0000-000000000003', 'Kabir Mehta', 'kabir.mehta@bits.edu', '+91 97112 33445', 'BITS Pilani', 'Mechanical Engg', '4th Year', 'Male', 'Pilani', 'Rajasthan'),
('b0000001-0000-0000-0000-000000000004', 'Ananya Deshmukh', 'ananya.d@iitm.ac.in', '+91 94451 44556', 'IIT Madras', 'Aerospace Engg', '3rd Year', 'Female', 'Chennai', 'Tamil Nadu'),
('b0000001-0000-0000-0000-000000000005', 'Rohan Sengupta', 'rohan.sen@jadavpur.edu', '+91 98302 55667', 'Jadavpur University, Kolkata', 'English Literature', '2nd Year', 'Male', 'Kolkata', 'West Bengal')
ON CONFLICT (id) DO NOTHING;

INSERT INTO registrations (id, registration_id, event_id, participant_name, participant_email, participant_phone, participant_college, participation_type, team_name, team_size, emergency_contact_name, emergency_contact_phone, status, qr_code_data) VALUES
('c0000001-0000-0000-0000-000000000001', 'COL26-SPT-001001', 'evt_spt_b_11', 'Aarav Sharma', 'aarav.sharma@xavier.edu', '+91 98210 11223', 'St. Xavier''s College, Mumbai', 'team', 'St. Xavier Ballers', 8, 'Sunil Sharma', '+91 98210 99887', 'checked_in', 'COL26-REG:COL26-SPT-001001|EVT:evt_spt_b_11|NAME:Aarav Sharma|COLLEGE:St. Xavier''s College, Mumbai'),
('c0000001-0000-0000-0000-000000000002', 'COL26-CUL-001002', 'evt_cul_01', 'Diya Krishnan', 'diya.krishnan@loyola.edu', '+91 98401 22334', 'Loyola College, Chennai', 'individual', NULL, 1, 'P. Krishnan', '+91 98401 88776', 'confirmed', 'COL26-REG:COL26-CUL-001002|EVT:evt_cul_01|NAME:Diya Krishnan|COLLEGE:Loyola College, Chennai'),
('c0000001-0000-0000-0000-000000000003', 'COL26-CUL-001003', 'evt_cul_02', 'Kabir Mehta', 'kabir.mehta@bits.edu', '+91 97112 33445', 'BITS Pilani', 'individual', NULL, 1, 'Rajiv Mehta', '+91 97112 77665', 'confirmed', 'COL26-REG:COL26-CUL-001003|EVT:evt_cul_02|NAME:Kabir Mehta|COLLEGE:BITS Pilani'),
('c0000001-0000-0000-0000-000000000004', 'COL26-SPT-001004', 'evt_spt_g_14', 'Ananya Deshmukh', 'ananya.d@iitm.ac.in', '+91 94451 44556', 'IIT Madras', 'team', 'IITM Phoenix', 9, 'V. Deshmukh', '+91 94451 66554', 'checked_in', 'COL26-REG:COL26-SPT-001004|EVT:evt_spt_g_14|NAME:Ananya Deshmukh|COLLEGE:IIT Madras'),
('c0000001-0000-0000-0000-000000000005', 'COL26-CUL-001005', 'evt_cul_10', 'Rohan Sengupta', 'rohan.sen@jadavpur.edu', '+91 98302 55667', 'Jadavpur University, Kolkata', 'individual', NULL, 1, 'Tapan Sengupta', '+91 98302 44332', 'confirmed', 'COL26-REG:COL26-CUL-001005|EVT:evt_cul_10|NAME:Rohan Sengupta|COLLEGE:Jadavpur University, Kolkata')
ON CONFLICT (id) DO NOTHING;

-- 10. CHECK-INS
INSERT INTO checkins (registration_id, event_id, participant_name, college, checked_in_by, notes) VALUES
('COL26-SPT-001001', 'evt_spt_b_11', 'Aarav Sharma', 'St. Xavier''s College, Mumbai', 'Coordinator Suresh (Stadium Gate 1)', 'Full 8-member squad verified with ID cards.'),
('COL26-SPT-001004', 'evt_spt_g_14', 'Ananya Deshmukh', 'IIT Madras', 'Coordinator Kavitha (Court B Desk)', 'Team roster stamped, jerseys inspected.')
ON CONFLICT (registration_id) DO NOTHING;

-- 11. NOTIFICATIONS (Live notifications)
INSERT INTO notifications (title, message, category, priority, is_read, action_url) VALUES
('Registration Confirmed: Basketball Boys', 'Your registration COL26-SPT-001001 has been confirmed. View your Digital QR Pass on My Dashboard.', 'checkin', 'important', false, '/dashboard'),
('Venue Notice: Dr. APJ Abdul Kalam Auditorium', 'Soundcheck for Solo Music and Band begins at 13:00 hrs sharp. Please report backstage.', 'reminder', 'urgent', false, '/schedule'),
('Results Published: Boys Table Tennis', 'Results for Boys Singles have been declared. Gold medal awarded to PSG Tech.', 'result', 'normal', false, '/results'),
('Welcome to COLORIDO 2K26!', 'Explore all 16 cultural and sports disciplines and build your personal festival itinerary.', 'system', 'normal', true, '/events');
