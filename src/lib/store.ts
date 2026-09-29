import {
  EventItem,
  Venue,
  ScheduleItem,
  Announcement,
  ResultItem,
  LeaderboardEntry,
  Sponsor,
  GalleryItem,
  Registration,
  Participant,
  NotificationItem,
  CertificateItem,
  CheckinRecord,
  ContactMessage
} from '../types/database';

import {
  INITIAL_EVENTS,
  INITIAL_VENUES,
  INITIAL_SCHEDULES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_RESULTS,
  INITIAL_LEADERBOARD,
  INITIAL_SPONSORS,
  INITIAL_GALLERY,
  INITIAL_REGISTRATIONS,
  INITIAL_PARTICIPANTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CERTIFICATES
} from './initialData';

const STORAGE_KEYS = {
  EVENTS: 'colorido_events_v1',
  VENUES: 'colorido_venues_v1',
  SCHEDULES: 'colorido_schedules_v1',
  ANNOUNCEMENTS: 'colorido_announcements_v1',
  RESULTS: 'colorido_results_v1',
  LEADERBOARD: 'colorido_leaderboard_v1',
  SPONSORS: 'colorido_sponsors_v1',
  GALLERY: 'colorido_gallery_v1',
  REGISTRATIONS: 'colorido_registrations_v1',
  PARTICIPANTS: 'colorido_participants_v1',
  NOTIFICATIONS: 'colorido_notifications_v1',
  CERTIFICATES: 'colorido_certificates_v1',
  CHECKINS: 'colorido_checkins_v1',
  MESSAGES: 'colorido_contact_messages_v1',
  FAVORITES: 'colorido_favorites_v1',
  SCORING_CONFIG: 'colorido_scoring_config_v1'
};

export interface ScoringConfig {
  first: number;
  second: number;
  third: number;
  special: number;
}

const DEFAULT_SCORING: ScoringConfig = {
  first: 10,
  second: 7,
  third: 5,
  special: 2
};

class ColoridoStore {
  private listeners: Set<() => void> = new Set();

  private load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  }

  private save<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Failed to persist to localStorage', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(fn => fn());
  }

  // --- EVENTS ---
  public getEvents(): EventItem[] {
    return this.load<EventItem[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  }

  public getEventById(id: string): EventItem | undefined {
    return this.getEvents().find(e => e.event_id === id);
  }

  public addEvent(event: EventItem): void {
    const list = this.getEvents();
    list.unshift(event);
    this.save(STORAGE_KEYS.EVENTS, list);
  }

  public updateEvent(id: string, updates: Partial<EventItem>): void {
    const list = this.getEvents().map(e => e.event_id === id ? { ...e, ...updates } : e);
    this.save(STORAGE_KEYS.EVENTS, list);
  }

  public deleteEvent(id: string): void {
    const list = this.getEvents().filter(e => e.event_id !== id);
    this.save(STORAGE_KEYS.EVENTS, list);
  }

  // --- VENUES ---
  public getVenues(): Venue[] {
    return this.load<Venue[]>(STORAGE_KEYS.VENUES, INITIAL_VENUES);
  }

  public getVenueById(id: string): Venue | undefined {
    return this.getVenues().find(v => v.id === id);
  }

  // --- SCHEDULES ---
  public getSchedules(): ScheduleItem[] {
    return this.load<ScheduleItem[]>(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
  }

  public addSchedule(schedule: ScheduleItem): void {
    const list = this.getSchedules();
    list.push(schedule);
    this.save(STORAGE_KEYS.SCHEDULES, list);
  }

  public updateSchedule(id: string, updates: Partial<ScheduleItem>): void {
    const list = this.getSchedules().map(s => s.id === id ? { ...s, ...updates } : s);
    this.save(STORAGE_KEYS.SCHEDULES, list);
  }

  public deleteSchedule(id: string): void {
    const list = this.getSchedules().filter(s => s.id !== id);
    this.save(STORAGE_KEYS.SCHEDULES, list);
  }

  // --- REGISTRATIONS & PARTICIPANTS ---
  public getRegistrations(): Registration[] {
    return this.load<Registration[]>(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
  }

  public getRegistrationById(id: string): Registration | undefined {
    return this.getRegistrations().find(r => r.id === id || r.registration_id === id);
  }

  public getRegistrationsByUser(userId: string): Registration[] {
    return this.getRegistrations().filter(r => r.user_id === userId);
  }

  public addRegistration(registration: Registration): void {
    const list = this.getRegistrations();
    list.unshift(registration);
    this.save(STORAGE_KEYS.REGISTRATIONS, list);

    // Increment current participants in the event
    const event = this.getEventById(registration.event_id);
    if (event) {
      this.updateEvent(event.event_id, {
        current_participants: (event.current_participants || 0) + (registration.team_size || 1)
      });
    }

    // Add automatic confirmation notification
    this.addNotification({
      id: `notif_${Date.now()}`,
      user_id: registration.user_id,
      title: `Registration Confirmed: ${event?.event_name || 'Event'}`,
      message: `Your registration ID is ${registration.registration_id}. Digital Pass is ready for download in My Dashboard.`,
      category: 'checkin',
      priority: 'important',
      is_read: false,
      action_url: `/dashboard`,
      created_at: new Date().toISOString()
    });
  }

  public updateRegistration(id: string, updates: Partial<Registration>): void {
    const list = this.getRegistrations().map(r => (r.id === id || r.registration_id === id) ? { ...r, ...updates } : r);
    this.save(STORAGE_KEYS.REGISTRATIONS, list);
  }

  public getParticipants(): Participant[] {
    return this.load<Participant[]>(STORAGE_KEYS.PARTICIPANTS, INITIAL_PARTICIPANTS);
  }

  // --- CHECK-INS ---
  public getCheckins(): CheckinRecord[] {
    const initialCheckins: CheckinRecord[] = [
      {
        id: 'chk_01',
        registration_id: 'COL26-SPT-001001',
        event_id: 'evt_spt_b_11',
        participant_name: 'Aarav Sharma',
        college: "St. Xavier's College, Mumbai",
        checked_in_by: 'Coordinator Suresh (Stadium Gate 1)',
        checked_in_at: '2026-10-15T08:15:00Z',
        notes: 'Full squad verified with university ID cards.'
      },
      {
        id: 'chk_02',
        registration_id: 'COL26-SPT-001004',
        event_id: 'evt_spt_g_14',
        participant_name: 'Ananya Deshmukh',
        college: 'IIT Madras',
        checked_in_by: 'Coordinator Kavitha (Court B Desk)',
        checked_in_at: '2026-10-15T08:45:00Z',
        notes: 'Team roster stamped, jerseys inspected.'
      }
    ];
    return this.load<CheckinRecord[]>(STORAGE_KEYS.CHECKINS, initialCheckins);
  }

  public isCheckedIn(registrationId: string): boolean {
    return this.getCheckins().some(c => c.registration_id === registrationId);
  }

  public checkInParticipant(registrationId: string, checkedBy: string = 'Authorized Coordinator', notes?: string): { success: boolean; message: string; record?: CheckinRecord } {
    const reg = this.getRegistrationById(registrationId);
    if (!reg) {
      return { success: false, message: `Registration ID "${registrationId}" not found in system records.` };
    }

    if (this.isCheckedIn(registrationId)) {
      const existing = this.getCheckins().find(c => c.registration_id === registrationId);
      return { 
        success: false, 
        message: `Already checked in at ${new Date(existing?.checked_in_at || '').toLocaleTimeString()} by ${existing?.checked_in_by}. Duplicate entry blocked.` 
      };
    }

    const newRecord: CheckinRecord = {
      id: `chk_${Date.now()}`,
      registration_id: reg.registration_id,
      event_id: reg.event_id,
      participant_name: reg.participant_name,
      college: reg.participant_college,
      checked_in_by: checkedBy,
      checked_in_at: new Date().toISOString(),
      notes: notes || 'Verified with official digital QR pass.'
    };

    const list = this.getCheckins();
    list.unshift(newRecord);
    this.save(STORAGE_KEYS.CHECKINS, list);

    // Update registration status
    this.updateRegistration(reg.registration_id, { status: 'checked_in' });

    // Send checkin notification
    if (reg.user_id) {
      this.addNotification({
        id: `notif_${Date.now()}`,
        user_id: reg.user_id,
        title: 'Check-in Verified ✅',
        message: `You have successfully checked in for ${reg.team_name || reg.participant_name} at ${newRecord.checked_in_at}. Good luck!`,
        category: 'checkin',
        priority: 'normal',
        is_read: false,
        action_url: `/dashboard`,
        created_at: new Date().toISOString()
      });
    }

    return { success: true, message: 'Check-in verified successfully!', record: newRecord };
  }

  // --- ANNOUNCEMENTS ---
  public getAnnouncements(): Announcement[] {
    return this.load<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  }

  public addAnnouncement(announcement: Announcement): void {
    const list = this.getAnnouncements();
    list.unshift(announcement);
    this.save(STORAGE_KEYS.ANNOUNCEMENTS, list);

    // Broadcast notification
    this.addNotification({
      id: `notif_${Date.now()}`,
      title: announcement.title,
      message: announcement.description.slice(0, 100) + '...',
      category: 'announcement',
      priority: announcement.priority === 'Urgent' ? 'urgent' : announcement.priority === 'Important' ? 'important' : 'normal',
      is_read: false,
      action_url: '/announcements',
      created_at: new Date().toISOString()
    });
  }

  public updateAnnouncement(id: string, updates: Partial<Announcement>): void {
    const list = this.getAnnouncements().map(a => a.id === id ? { ...a, ...updates } : a);
    this.save(STORAGE_KEYS.ANNOUNCEMENTS, list);
  }

  public deleteAnnouncement(id: string): void {
    const list = this.getAnnouncements().filter(a => a.id !== id);
    this.save(STORAGE_KEYS.ANNOUNCEMENTS, list);
  }

  // --- RESULTS & LEADERBOARD ---
  public getResults(): ResultItem[] {
    return this.load<ResultItem[]>(STORAGE_KEYS.RESULTS, INITIAL_RESULTS);
  }

  public getScoringConfig(): ScoringConfig {
    return this.load<ScoringConfig>(STORAGE_KEYS.SCORING_CONFIG, DEFAULT_SCORING);
  }

  public updateScoringConfig(config: ScoringConfig): void {
    this.save(STORAGE_KEYS.SCORING_CONFIG, config);
    this.recalculateLeaderboard();
  }

  public addResult(result: ResultItem): void {
    const list = this.getResults();
    list.unshift(result);
    this.save(STORAGE_KEYS.RESULTS, list);
    this.recalculateLeaderboard();

    // Automatically issue certificate if winner or runner-up
    this.generateCertificateForResult(result);

    // Broadcast notification
    this.addNotification({
      id: `notif_${Date.now()}`,
      title: `Results Declared: ${result.event_name || 'Event'}`,
      message: `${result.position} secured by ${result.participant_name} (${result.college}) with score ${result.score}!`,
      category: 'result',
      priority: 'important',
      is_read: false,
      action_url: '/results',
      created_at: new Date().toISOString()
    });
  }

  public updateResult(id: string, updates: Partial<ResultItem>): void {
    const list = this.getResults().map(r => r.id === id ? { ...r, ...updates } : r);
    this.save(STORAGE_KEYS.RESULTS, list);
    this.recalculateLeaderboard();
  }

  public deleteResult(id: string): void {
    const list = this.getResults().filter(r => r.id !== id);
    this.save(STORAGE_KEYS.RESULTS, list);
    this.recalculateLeaderboard();
  }

  public recalculateLeaderboard(): void {
    const results = this.getResults().filter(r => r.is_published);
    const scoring = this.getScoringConfig();
    const events = this.getEvents();

    const collegeMap: Record<string, { cultural: number; sports: number; gold: number; silver: number; bronze: number }> = {};

    results.forEach(res => {
      if (!collegeMap[res.college]) {
        collegeMap[res.college] = { cultural: 0, sports: 0, gold: 0, silver: 0, bronze: 0 };
      }

      const evt = events.find(e => e.event_id === res.event_id);
      const isSports = evt?.category === 'sports';

      let points = 0;
      if (res.position === '1st Place') {
        points = scoring.first;
        collegeMap[res.college].gold += 1;
      } else if (res.position === '2nd Place') {
        points = scoring.second;
        collegeMap[res.college].silver += 1;
      } else if (res.position === '3rd Place') {
        points = scoring.third;
        collegeMap[res.college].bronze += 1;
      } else {
        points = scoring.special;
      }

      if (isSports) {
        collegeMap[res.college].sports += points;
      } else {
        collegeMap[res.college].cultural += points;
      }
    });

    const entries: LeaderboardEntry[] = Object.keys(collegeMap).map((college, idx) => {
      const item = collegeMap[college];
      return {
        id: `lead_${idx + 1}`,
        college_name: college,
        cultural_points: item.cultural,
        sports_points: item.sports,
        total_points: item.cultural + item.sports,
        gold_count: item.gold,
        silver_count: item.silver,
        bronze_count: item.bronze,
        rank: 1
      };
    });

    // Sort by total_points desc, then gold desc, silver desc
    entries.sort((a, b) => {
      if (b.total_points !== a.total_points) return b.total_points - a.total_points;
      if (b.gold_count !== a.gold_count) return b.gold_count - a.gold_count;
      return b.silver_count - a.silver_count;
    });

    entries.forEach((e, idx) => {
      e.rank = idx + 1;
    });

    this.save(STORAGE_KEYS.LEADERBOARD, entries.length > 0 ? entries : INITIAL_LEADERBOARD);
  }

  public getLeaderboard(): LeaderboardEntry[] {
    return this.load<LeaderboardEntry[]>(STORAGE_KEYS.LEADERBOARD, INITIAL_LEADERBOARD);
  }

  // --- CERTIFICATES ---
  public getCertificates(): CertificateItem[] {
    return this.load<CertificateItem[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
  }

  public getCertificatesForUser(userNameOrEmail: string): CertificateItem[] {
    const term = userNameOrEmail.toLowerCase();
    return this.getCertificates().filter(c => 
      c.participant_name.toLowerCase().includes(term) ||
      (c.college && c.college.toLowerCase().includes(term))
    );
  }

  public addCertificate(cert: CertificateItem): void {
    const list = this.getCertificates();
    list.unshift(cert);
    this.save(STORAGE_KEYS.CERTIFICATES, list);
  }

  private generateCertificateForResult(result: ResultItem): void {
    const certType = result.position === '1st Place' 
      ? 'Winner Certificate' 
      : result.position === '2nd Place' 
      ? 'Runner-up Certificate' 
      : 'Special Recognition';

    const newCert: CertificateItem = {
      id: `cert_${Date.now()}`,
      certificate_id: `CERT-COL26-${Math.floor(1000 + Math.random() * 9000)}`,
      event_id: result.event_id,
      event_name: result.event_name || 'Festival Discipline',
      participant_name: result.participant_name,
      college: result.college,
      certificate_type: certType,
      achievement: `${result.position} — Score: ${result.score}`,
      issue_date: new Date().toISOString().split('T')[0],
      authorized_signatory_1: 'Dr. Arvind Sharma (Festival Convener)',
      authorized_signatory_2: 'Prof. Sunita Rao (Dean Student Affairs)',
      verification_hash: `SHA256-COL26-${result.event_id}-${Date.now().toString(36).toUpperCase()}`
    };

    this.addCertificate(newCert);
  }

  // --- SPONSORS ---
  public getSponsors(): Sponsor[] {
    return this.load<Sponsor[]>(STORAGE_KEYS.SPONSORS, INITIAL_SPONSORS);
  }

  public addSponsor(sponsor: Sponsor): void {
    const list = this.getSponsors();
    list.push(sponsor);
    this.save(STORAGE_KEYS.SPONSORS, list);
  }

  public updateSponsor(id: string, updates: Partial<Sponsor>): void {
    const list = this.getSponsors().map(s => s.id === id ? { ...s, ...updates } : s);
    this.save(STORAGE_KEYS.SPONSORS, list);
  }

  public deleteSponsor(id: string): void {
    const list = this.getSponsors().filter(s => s.id !== id);
    this.save(STORAGE_KEYS.SPONSORS, list);
  }

  // --- GALLERY ---
  public getGallery(): GalleryItem[] {
    return this.load<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
  }

  public addGalleryItem(item: GalleryItem): void {
    const list = this.getGallery();
    list.unshift(item);
    this.save(STORAGE_KEYS.GALLERY, list);
  }

  public deleteGalleryItem(id: string): void {
    const list = this.getGallery().filter(g => g.id !== id);
    this.save(STORAGE_KEYS.GALLERY, list);
  }

  // --- NOTIFICATIONS ---
  public getNotifications(userId?: string): NotificationItem[] {
    const list = this.load<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    if (!userId) return list;
    return list.filter(n => !n.user_id || n.user_id === userId);
  }

  public addNotification(notif: NotificationItem): void {
    const list = this.load<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    list.unshift(notif);
    this.save(STORAGE_KEYS.NOTIFICATIONS, list);
  }

  public markNotificationAsRead(id: string): void {
    const list = this.load<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = list.map(n => n.id === id ? { ...n, is_read: true } : n);
    this.save(STORAGE_KEYS.NOTIFICATIONS, updated);
  }

  public markAllNotificationsAsRead(userId?: string): void {
    const list = this.load<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = list.map(n => (!userId || !n.user_id || n.user_id === userId) ? { ...n, is_read: true } : n);
    this.save(STORAGE_KEYS.NOTIFICATIONS, updated);
  }

  // --- FAVORITES / MY EVENTS ---
  public getFavorites(userId: string = 'guest'): string[] {
    const map = this.load<Record<string, string[]>>(STORAGE_KEYS.FAVORITES, {
      guest: ['evt_cul_04', 'evt_spt_b_11'],
      usr_part_01: ['evt_spt_b_11', 'evt_cul_03', 'evt_cul_10']
    });
    return map[userId] || [];
  }

  public toggleFavorite(userId: string = 'guest', eventId: string): boolean {
    const map = this.load<Record<string, string[]>>(STORAGE_KEYS.FAVORITES, {});
    const userList = map[userId] || [];
    const exists = userList.includes(eventId);
    let updated: string[];

    if (exists) {
      updated = userList.filter(id => id !== eventId);
    } else {
      updated = [...userList, eventId];
    }

    map[userId] = updated;
    this.save(STORAGE_KEYS.FAVORITES, map);
    return !exists;
  }

  // --- CONTACT MESSAGES ---
  public getContactMessages(): ContactMessage[] {
    const initialMessages: ContactMessage[] = [
      {
        id: 'msg_01',
        name: 'Prof. Raghavan V.',
        email: 'dean.sports@annauniv.edu',
        phone: '+91 94440 12345',
        subject: 'Inter-College Contingent Accommodation Query',
        category: 'Accommodations & Logistics',
        message: 'We are sending a 35-member contingent for Basketball and Dance. Could you confirm hostel block allocation dates?',
        status: 'unread',
        created_at: '2026-10-12T14:30:00Z'
      },
      {
        id: 'msg_02',
        name: 'Tanvi Saxena',
        email: 'tanvi.saxena@delhiart.edu',
        phone: '+91 98112 99887',
        subject: 'Fine Arts Canvas Easel Dimensions',
        category: 'Event Guidelines',
        message: 'Could you please confirm if mixed media artists can bring their own specialized wooden easels?',
        status: 'read',
        created_at: '2026-10-11T11:20:00Z'
      }
    ];
    return this.load<ContactMessage[]>(STORAGE_KEYS.MESSAGES, initialMessages);
  }

  public addContactMessage(msg: ContactMessage): void {
    const list = this.getContactMessages();
    list.unshift(msg);
    this.save(STORAGE_KEYS.MESSAGES, list);
  }

  public updateContactMessage(id: string, updates: Partial<ContactMessage>): void {
    const list = this.getContactMessages().map(m => m.id === id ? { ...m, ...updates } : m);
    this.save(STORAGE_KEYS.MESSAGES, list);
  }

  // --- HARD RESET / SEED RESTORE ---
  public resetToDefaultSeed(): void {
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.VENUES);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULES);
    localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
    localStorage.removeItem(STORAGE_KEYS.RESULTS);
    localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
    localStorage.removeItem(STORAGE_KEYS.SPONSORS);
    localStorage.removeItem(STORAGE_KEYS.GALLERY);
    localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
    localStorage.removeItem(STORAGE_KEYS.PARTICIPANTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.CERTIFICATES);
    localStorage.removeItem(STORAGE_KEYS.CHECKINS);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
    localStorage.removeItem(STORAGE_KEYS.SCORING_CONFIG);
    this.notify();
  }
}

export const store = new ColoridoStore();
