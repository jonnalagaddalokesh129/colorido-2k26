import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Heart, 
  Share2, 
  CalendarPlus, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  Info, 
  AlertCircle,
  CheckCircle2,
  FileText,
  Navigation,
  Compass,
  ExternalLink,
  X
} from 'lucide-react';
import { store } from '../lib/store';
import { EventItem, ScheduleItem, Registration } from '../types/database';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShareModal } from '../components/common/ShareModal';
import { ClashWarningModal } from '../components/events/ClashWarningModal';
import { checkEventClash } from '../lib/clashDetector';
import { generateGoogleCalendarUrl, downloadIcsCalendar } from '../lib/calendar';

interface Props {
  eventId: string;
  onBack: () => void;
  onRegister: (eventId: string) => void;
  onViewSchedule: () => void;
  onNavigate?: (path: string) => void;
}

export const EventDetailPage: React.FC<Props> = ({
  eventId,
  onBack,
  onRegister,
  onViewSchedule,
  onNavigate
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [event, setEvent] = useState<EventItem | undefined>(() => store.getEventById(eventId));
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'schedule' | 'participants' | 'coordinator'>('overview');

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [calendarMenuOpen, setCalendarMenuOpen] = useState(false);
  const [venueModalOpen, setVenueModalOpen] = useState(false);

  // Clash detector modal state
  const [clashModalOpen, setClashModalOpen] = useState(false);
  const [clashingEvent, setClashingEvent] = useState<EventItem | null>(null);

  const venue = event
    ? (store.getVenueById(event.venue_id) || store.getVenues().find(v => v.name.toLowerCase() === event.venue.toLowerCase()) || store.getVenues()[0])
    : undefined;

  useEffect(() => {
    const update = () => {
      const e = store.getEventById(eventId);
      setEvent(e);
      setSchedules(store.getSchedules().filter(s => s.event_id === eventId));
      setRegistrations(store.getRegistrations().filter(r => r.event_id === eventId));
    };
    update();
    const unsub = store.subscribe(update);
    return () => unsub();
  }, [eventId]);

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Event Not Found</h2>
        <p className="text-slate-400 text-sm">The event you requested could not be located in the festival registry.</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold text-xs transition-colors"
        >
          Return to Events
        </button>
      </div>
    );
  }

  const favorited = isFavorite(event.event_id);
  const isFull = event.current_participants >= event.maximum_participants;
  const isClosed = event.status === 'closed' || isFull;

  const handleRegisterClick = () => {
    // Run real-time smart clash detector against user's registered events
    const userRegs = store.getRegistrationsByUser(user?.id || 'guest');
    const clash = checkEventClash(event.event_id, userRegs);

    if (clash.hasClash && clash.conflictingEvent) {
      setClashingEvent(clash.conflictingEvent);
      setClashModalOpen(true);
      return;
    }

    onRegister(event.event_id);
  };

  const isCoordinator = user?.role === 'coordinator';
  const isAdmin = user?.role === 'admin';
  const isCoordinatorOrAdmin = !!(isCoordinator || isAdmin);

  // Tab Navigation System: Overview, Rules, Schedule, Participants (Coordinators only), Coordinator
  const tabs = [
    { id: 'overview' as const, label: 'Overview & Details' },
    { id: 'rules' as const, label: 'Rules & Regulations' },
    { id: 'schedule' as const, label: `Schedule & Timetable (${schedules.length})` },
    ...(isCoordinatorOrAdmin ? [{ id: 'participants' as const, label: `Registered Teams (${registrations.length})` }] : []),
    { id: 'coordinator' as const, label: 'Coordinator & Helplines' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation Row */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events Explorer</span>
      </button>

      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
        <div className="relative h-72 sm:h-96 w-full">
          <img
            src={event.event_image}
            alt={event.event_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D1B] via-[#0B0D1B]/60 to-transparent" />
        </div>

        {/* Floating Content Over Image */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider backdrop-blur-md shadow-md ${
                event.category === 'cultural'
                  ? 'bg-fuchsia-600 text-white'
                  : 'bg-sky-600 text-white'
              }`}>
                {event.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 text-slate-200 border border-white/10 backdrop-blur-md">
                {event.sub_category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isClosed
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {isClosed ? 'Closed' : 'Registration Open'}
              </span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight leading-tight">
              {event.event_name}
            </h1>

            <div className="flex flex-wrap gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-fuchsia-400" />
                <span>
                  {new Date(event.event_date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>{event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{event.venue}</span>
              </span>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {/* Favorite Button */}
            <button
              onClick={() => toggleFavorite(event.event_id, event.event_name)}
              className={`p-3 rounded-2xl backdrop-blur-md border transition-all ${
                favorited
                  ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-[#12172F]/80 border-white/10 text-slate-300 hover:text-white hover:bg-[#12172F]'
              }`}
              title={favorited ? 'Saved in My Events' : 'Add to My Events'}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
            </button>

            {/* Share Button */}
            <button
              onClick={() => setShareModalOpen(true)}
              className="p-3 rounded-2xl bg-[#12172F]/80 border border-white/10 text-slate-300 hover:text-white backdrop-blur-md transition-colors"
              title="Share event link"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* Add to Calendar Button */}
            <button
              onClick={() => setCalendarMenuOpen(!calendarMenuOpen)}
              className="p-3 rounded-2xl bg-[#12172F]/80 border border-white/10 text-slate-300 hover:text-white backdrop-blur-md transition-colors flex items-center space-x-2 text-xs font-semibold"
              title="Add to personal calendar"
            >
              <CalendarPlus className="w-5 h-5 text-fuchsia-400" />
              <span className="hidden sm:inline">Add to Calendar</span>
            </button>

            {/* Primary Register CTA */}
            <button
              onClick={handleRegisterClick}
              disabled={isClosed}
              className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold shadow-xl transition-all ${
                isClosed
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                  : 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white shadow-fuchsia-500/25 hover:scale-105'
              }`}
            >
              {isClosed ? 'Registration Closed' : 'REGISTER NOW &rarr;'}
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Modal — rendered outside overflow-hidden hero */}
      {calendarMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[40px]" onClick={() => setCalendarMenuOpen(false)}>
          <div
            className="bg-[#12172F] border border-fuchsia-500/40 rounded-2xl shadow-2xl p-3 w-56 space-y-1 text-xs animate-in fade-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 pb-1">Add Event to Calendar</p>
            <a
              href={generateGoogleCalendarUrl(event)}
              target="_blank"
              rel="noreferrer"
              onClick={() => setCalendarMenuOpen(false)}
              className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-slate-200 hover:bg-white/10 hover:text-white font-medium transition-colors"
            >
              <span className="text-base">📅</span>
              <span>Google Calendar</span>
            </a>
            <button
              onClick={() => {
                downloadIcsCalendar(event);
                setCalendarMenuOpen(false);
                showToast('Downloaded .ics calendar file for Apple / Outlook', 'success');
              }}
              className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-slate-200 hover:bg-white/10 hover:text-white font-medium transition-colors text-left"
            >
              <span className="text-base">🍎</span>
              <span>Apple / Outlook (.ics)</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation System */}
      <div className="border-b border-white/10">
        <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto custom-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-1 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'border-fuchsia-500 text-fuchsia-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Tab Dynamic View */}
        <div className="lg:col-span-2 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="bg-[#12172F] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Event Description</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{event.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="bg-[#1A2142] p-4 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Eligibility</span>
                  <p className="text-xs text-white font-medium">{event.eligibility}</p>
                </div>
                <div className="bg-[#1A2142] p-4 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Participation Format</span>
                  <p className="text-xs text-white font-medium">
                    {event.participation_type === 'team'
                      ? `Team Event (${event.team_size_min} to ${event.team_size_max} members)`
                      : 'Individual / Solo Entry'}
                  </p>
                </div>
              </div>

              <div className="bg-[#1A2142] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registration Fee</span>
                  <p className="text-base font-bold text-amber-300">
                    {event.registration_fee === 0 ? 'Free Entry' : `₹${event.registration_fee} per entry / team`}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registration Deadline</span>
                  <p className="text-xs font-bold text-rose-400">
                    {new Date(event.registration_deadline).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RULES */}
          {activeTab === 'rules' && (
            <div className="bg-[#12172F] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Official Tournament Regulations</h3>
                <p className="text-xs text-slate-400">Enforced by external adjudicators and federation certified referees</p>
              </div>

              <ul className="space-y-3">
                {event.rules.map((rule, idx) => (
                  <li
                    key={idx}
                    className="flex items-start space-x-3 p-3.5 rounded-xl bg-[#1A2142] border border-white/5 text-xs text-slate-200"
                  >
                    <span className="w-5 h-5 rounded-full bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  All participants must present original student photo identification cards issued by their respective universities at the verification desk prior to performance / match.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="bg-[#12172F] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">Event Timetable & Heats</h3>
                  <p className="text-xs text-slate-400">Scheduled rounds across festival days</p>
                </div>
                <button
                  onClick={onViewSchedule}
                  className="text-xs font-bold text-fuchsia-400 hover:text-fuchsia-300"
                >
                  View Festival Master Schedule &rarr;
                </button>
              </div>

              {schedules.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Single slot scheduled on {event.event_date} from {event.start_time.slice(0, 5)} to {event.end_time.slice(0, 5)} at {event.venue}.
                </div>
              ) : (
                <div className="space-y-3">
                  {schedules.map(sch => (
                    <div
                      key={sch.id}
                      className="p-4 rounded-2xl bg-[#1A2142] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="px-2 py-0.5 rounded bg-fuchsia-600/30 text-fuchsia-300 font-bold text-[10px] uppercase">
                            Day {sch.day_number}
                          </span>
                          <span className="font-bold text-white text-sm">{sch.round_name}</span>
                        </div>
                        <p className="text-slate-400">{sch.venue_name}</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-slate-300">
                          {sch.start_time.slice(0, 5)} - {sch.end_time.slice(0, 5)}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300">
                          {sch.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PARTICIPANTS */}
          {activeTab === 'participants' && (
            <div className="bg-[#12172F] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">Registered Contingents</h3>
                  <p className="text-xs text-slate-400">
                    {event.current_participants} of {event.maximum_participants} maximum slots filled
                  </p>
                </div>
              </div>

              {registrations.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No public registrations recorded yet. Be the first to register for {event.event_name}!
                </div>
              ) : (
                <div className="space-y-2">
                  {registrations.map(r => (
                    <div
                      key={r.id}
                      className="p-3.5 rounded-xl bg-[#1A2142] border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 flex items-center justify-center font-bold text-white">
                          {r.participant_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white">{r.team_name || r.participant_name}</p>
                          <p className="text-slate-400 text-[11px]">{r.participant_college}</p>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300">
                        {r.registration_id}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: COORDINATOR */}
          {activeTab === 'coordinator' && (
            <div className="bg-[#12172F] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Event Coordinator Details</h3>
                <p className="text-xs text-slate-400">Direct contact for rule interpretations, reporting schedules, and stage logistics</p>
              </div>

              <div className="bg-[#1A2142] p-5 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-fuchsia-600/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 font-bold text-lg">
                    {event.coordinator_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">{event.coordinator_name}</h4>
                    <p className="text-xs text-fuchsia-400">Discipline Lead & Stage Coordinator</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/5 text-xs text-slate-300">
                  <a
                    href={`tel:${event.coordinator_contact}`}
                    className="flex items-center space-x-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>{event.coordinator_contact}</span>
                  </a>
                  <a
                    href={`mailto:${event.coordinator_email || 'secretariat@colorido2k26.edu'}`}
                    className="flex items-center space-x-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-sky-400" />
                    <span className="truncate">{event.coordinator_email || 'secretariat@colorido2k26.edu'}</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Venue & Fast Info Card */}
        <div className="space-y-6">
          {/* Quick Register Card */}
          <div className="bg-[#12172F] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-white">Participation Summary</h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-slate-400">Slots Filled:</span>
                <span className="font-bold text-white">
                  {event.current_participants} / {event.maximum_participants}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-fuchsia-500 to-indigo-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, (event.current_participants / event.maximum_participants) * 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-slate-400">Team Size:</span>
                <span className="font-bold text-white">
                  {event.participation_type === 'team' ? `${event.team_size_min}-${event.team_size_max} Members` : 'Solo'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-slate-400">Registration Fee:</span>
                <span className="font-bold text-amber-300">
                  {event.registration_fee === 0 ? 'Free' : `₹${event.registration_fee}`}
                </span>
              </div>
            </div>

            <button
              onClick={handleRegisterClick}
              disabled={isClosed}
              className={`w-full py-3.5 rounded-xl text-xs font-bold text-center transition-all ${
                isClosed
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                  : 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white shadow-lg shadow-fuchsia-500/20'
              }`}
            >
              {isClosed ? 'Slots Closed' : 'Proceed to Registration'}
            </button>
          </div>

          {/* Venue Card */}
          <div className="bg-[#12172F] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Venue Information</span>
              </h3>
              {venue?.short_code && (
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {venue.short_code}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-sm text-white">{event.venue}</h4>
              <p className="text-xs text-slate-300 flex items-start space-x-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>{venue?.location || 'Central Campus Sports & Cultural Complex'}</span>
              </p>
              {venue?.capacity && (
                <p className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  <span>Seating Capacity: <strong className="text-white font-medium">{venue.capacity.toLocaleString()} Seats</strong></span>
                </p>
              )}
            </div>

            {venue?.facilities && venue.facilities.length > 0 && (
              <div className="pt-2 border-t border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Facilities</p>
                <div className="flex flex-wrap gap-1.5">
                  {venue.facilities.slice(0, 3).map((f, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                      {f}
                    </span>
                  ))}
                  {venue.facilities.length > 3 && (
                    <span className="text-[10px] px-1 py-0.5 text-slate-400">
                      +{venue.facilities.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => setVenueModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors flex items-center justify-center space-x-2 text-center"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Inspect Campus Map & Directions</span>
              </button>

              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate(`/venues?id=${venue?.id || ''}`)}
                  className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-medium text-slate-400 hover:text-white transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Explore All Campus Venues</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        event={event}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      {/* Clash Warning Modal */}
      {clashingEvent && (
        <ClashWarningModal
          isOpen={clashModalOpen}
          onClose={() => setClashModalOpen(false)}
          targetEvent={event}
          conflictingEvent={clashingEvent}
          onViewSchedule={onViewSchedule}
          onProceedAnyway={() => onRegister(event.event_id)}
        />
      )}

      {/* Interactive Venue & Directions Modal */}
      {venueModalOpen && (
        <div
          onClick={() => setVenueModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#12172F] border border-white/10 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{event.venue}</h3>
                  <p className="text-xs text-slate-400 flex items-center space-x-1.5 mt-0.5">
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{venue?.location || 'Central Campus Sports & Cultural Complex'}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setVenueModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Venue Preview Image */}
              {venue?.image_url && (
                <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/10">
                  <img
                    src={venue.image_url}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4 justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-black/60 text-emerald-400 border border-emerald-500/30">
                        {venue.short_code}
                      </span>
                    </div>
                    {venue.capacity && (
                      <span className="text-xs font-bold text-white bg-black/60 px-2.5 py-1 rounded-md border border-white/10 flex items-center space-x-1.5">
                        <Users className="w-3.5 h-3.5 text-sky-400" />
                        <span>{venue.capacity.toLocaleString()} Seats</span>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Campus Walking Directions */}
              <div className="bg-[#1A2142] p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Walking Directions & Campus Access</span>
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    ~3-5 mins from Gate 1
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">1</span>
                    <p>Enter via <strong>Main Campus Gate 1 (University Boulevard)</strong> and pass the welcome registration arch.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">2</span>
                    <p>Follow the illuminated COLORIDO festival signage straight past the central campus water pavilion.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">3</span>
                    <p>Proceed to <strong>{venue?.location || event.venue}</strong>. Volunteer stewards are stationed at entrance doors for pass scanning.</p>
                  </div>
                </div>
              </div>

              {/* Venue Specifications & Facilities */}
              {venue?.facilities && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Arena Facilities & Equipment</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {venue.facilities.map((fac, i) => (
                      <div key={i} className="flex items-center space-x-2 p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  const query = encodeURIComponent(`${event.venue} ${venue?.location || ''} Chennai`);
                  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-emerald-400" />
                <span>Open in Google Maps</span>
              </button>

              {onNavigate && venue?.id && (
                <button
                  type="button"
                  onClick={() => {
                    setVenueModalOpen(false);
                    onNavigate(`/venues?id=${venue.id}`);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all"
                >
                  <Compass className="w-4 h-4" />
                  <span>Full Campus Map Page</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
