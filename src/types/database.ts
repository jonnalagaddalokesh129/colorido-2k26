export type EventCategory = 'cultural' | 'sports';
export type SubCategory = 'solo' | 'group' | 'boys' | 'girls' | 'general' | 'fine_arts';
export type ParticipationType = 'individual' | 'team';
export type EventStatus = 'open' | 'closed' | 'ongoing' | 'completed';
export type UserRole = 'participant' | 'coordinator' | 'admin';

export interface EventItem {
  event_id: string;
  event_name: string;
  category: EventCategory;
  sub_category: SubCategory | string;
  description: string;
  rules: string[];
  eligibility: string;
  participation_type: ParticipationType;
  team_size_min: number;
  team_size_max: number;
  registration_fee: number;
  venue_id: string;
  venue: string;
  event_date: string;
  start_time: string;
  end_time: string;
  registration_deadline: string;
  maximum_participants: number;
  current_participants: number;
  status: EventStatus;
  event_image: string;
  coordinator_name: string;
  coordinator_contact: string;
  coordinator_email?: string;
  created_at?: string;
  /** Admin-controlled flag: whether participation certificates are available for download */
  cert_available?: boolean;
}

export interface ScheduleItem {
  id: string;
  event_id: string;
  day_number: number;
  schedule_date: string;
  start_time: string;
  end_time: string;
  venue_id: string;
  venue_name: string;
  round_name: string;
  status: 'scheduled' | 'live' | 'completed' | 'delayed';
  event?: EventItem;
}

export interface TeamMember {
  id: string;
  registration_id?: string;
  member_name: string;
  email?: string;
  phone?: string;
  college?: string;
  roll_number?: string;
  role: 'leader' | 'member';
}

export interface Registration {
  id: string;
  registration_id: string;
  event_id: string;
  user_id?: string;
  participant_id?: string;
  participant_name: string;
  participant_email: string;
  participant_phone: string;
  participant_college: string;
  participation_type: ParticipationType;
  team_name?: string;
  team_size: number;
  team_members?: TeamMember[];
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  status: 'confirmed' | 'waitlisted' | 'checked_in' | 'cancelled';
  qr_code_data: string;
  created_at: string;
  event?: EventItem;
  payment_status?: 'paid' | 'pending' | 'free' | 'refunded';
  payment_amount?: number;
  payment_method?: 'upi' | 'card' | 'netbanking' | 'free' | 'cash';
  payment_transaction_id?: string;
  payment_upi_app?: string;
  paid_at?: string;
}

export interface Participant {
  id: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  gender: string;
  city?: string;
  state?: string;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  gender?: string;
  college: string;
  department?: string;
  year?: string;
  city?: string;
  state?: string;
  role: UserRole;
  coordinator_status?: 'pending' | 'approved' | 'rejected' | 'suspended';
  avatar_url?: string;
  created_at?: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  category: 'IMPORTANT' | 'GENERAL' | 'CULTURAL' | 'SPORTS' | 'SCHEDULE' | 'RESULTS';
  priority: 'Normal' | 'Important' | 'Urgent';
  is_published: boolean;
  published_at: string;
  author: string;
  pinned: boolean;
  created_at?: string;
}

export interface ResultItem {
  id: string;
  event_id: string;
  event_name?: string;
  position: '1st Place' | '2nd Place' | '3rd Place' | 'Special Mention';
  winner_type: 'Winner' | 'Runner-up' | 'Second Runner-up' | 'Special Mention';
  participant_name: string;
  team_name?: string;
  college: string;
  score: string;
  points_awarded: number;
  is_published: boolean;
  published_at: string;
  created_at?: string;
}

export interface LeaderboardEntry {
  id: string;
  college_name: string;
  cultural_points: number;
  sports_points: number;
  total_points: number;
  gold_count: number;
  silver_count: number;
  bronze_count: number;
  rank: number;
  updated_at?: string;
}

export interface Venue {
  id: string;
  name: string;
  short_code: string;
  location: string;
  capacity: number;
  facilities: string[];
  latitude: number;
  longitude: number;
  image_url: string;
}

export interface Sponsor {
  id: string;
  name: string;
  category: 'TITLE SPONSOR' | 'GOLD SPONSOR' | 'SILVER SPONSOR' | 'EVENT PARTNER' | 'MEDIA PARTNER';
  logo_url: string;
  description: string;
  website_url: string;
  display_order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: 'CULTURAL' | 'SPORTS' | 'PERFORMANCES' | 'CAMPUS' | 'PARTICIPANTS' | 'HIGHLIGHTS';
  tags: string[];
  featured: boolean;
  caption?: string;
  event_id?: string;
}

export interface NotificationItem {
  id: string;
  user_id?: string;
  title: string;
  message: string;
  category: 'reminder' | 'announcement' | 'result' | 'system' | 'checkin';
  priority: 'normal' | 'important' | 'urgent';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface CheckinRecord {
  id: string;
  registration_id: string;
  event_id: string;
  participant_name: string;
  college: string;
  checked_in_by: string;
  checked_in_at: string;
  notes?: string;
}

export type CertificateStatus = 'pending' | 'issued' | 'revoked';
export type WinnerPosition = '1st Place' | '2nd Place' | '3rd Place';

export interface CertificateItem {
  id: string;
  certificate_id: string;
  registration_id?: string;
  event_id: string;
  event_name: string;
  user_id?: string;
  participant_name: string;
  college: string;
  certificate_type: 'Participation Certificate' | 'Winner Certificate' | 'Runner-up Certificate' | 'Special Recognition';
  achievement: string;
  issue_date: string;
  authorized_signatory_1: string;
  authorized_signatory_2: string;
  verification_hash: string;
  /** Lifecycle status of certificate */
  status?: CertificateStatus;
  /** For winner certificates only */
  winner_position?: WinnerPosition;
  /** Admin user_id who assigned/issued this certificate */
  assigned_by?: string;
  /** Timestamp of last status change */
  updated_at?: string;
  /** Revocation reason if revoked */
  revoke_reason?: string;
}

/** Represents a winner assignment before certificate issuance */
export interface WinnerAssignment {
  id: string;
  event_id: string;
  event_name: string;
  registration_id: string;
  user_id?: string;
  participant_name: string;
  college: string;
  position: WinnerPosition;
  assigned_by: string;
  assigned_at: string;
  confirmed: boolean;
  certificate_id?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  category: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
}
