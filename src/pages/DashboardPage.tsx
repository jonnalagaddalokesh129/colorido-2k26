import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  Award, 
  QrCode, 
  Heart, 
  Bell, 
  Trophy, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Lock,
  UserPlus,
  LogIn,
  Pencil
} from 'lucide-react';
import { store } from '../lib/store';
import { Registration, EventItem, CertificateItem, ResultItem, NotificationItem } from '../types/database';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { DigitalPassModal } from '../components/dashboard/DigitalPassModal';
import { CertificateModal } from '../components/dashboard/CertificateModal';
import { EditProfileModal } from '../components/dashboard/EditProfileModal';

interface Props {
  onNavigate: (path: string) => void;
  onViewEvent: (eventId: string) => void;
}

export const DashboardPage: React.FC<Props> = ({ onNavigate, onViewEvent }) => {
  const { user, switchDemoUser, updateProfile } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Modals state
  const [selectedPassReg, setSelectedPassReg] = useState<Registration | null>(null);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    const update = () => {
      setAllEvents(store.getEvents());
      if (user && user.id) {
        const uId = user.id;
        const uName = user.full_name || '';
        const uCollege = user.college || '';

        const userRegs = store.getRegistrationsByUser(uId);
        setRegistrations(userRegs);
        setCertificates(store.getCertificatesForUser(uName || uCollege));
        setResults(store.getResults().filter(r => 
          (uName && r.participant_name.toLowerCase().includes(uName.toLowerCase())) ||
          (uCollege && r.college.toLowerCase().includes(uCollege.toLowerCase()))
        ));
        setNotifications(store.getNotifications(uId).slice(0, 5));
      } else {
        // Unauthenticated Guest: Do NOT show user registrations or personal fixtures
        setRegistrations([]);
        setCertificates([]);
        setResults([]);
        setNotifications([]);
      }
    };

    update();
    const unsub = store.subscribe(update);
    return () => unsub();
  }, [user]);

  // Determine user's next upcoming event prominently (only for logged-in users)
  const upcomingReg = user ? registrations[0] : undefined;
  const upcomingEvent = (user && upcomingReg) ? allEvents.find(e => e.event_id === upcomingReg.event_id) : undefined;

  const savedEvents = allEvents.filter(e => favorites.includes(e.event_id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Personalized Greeting Header */}
      <div className="bg-white border border-[#006D8F]/15 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#20B2AA]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-4">
            <img
              src={user?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.full_name || 'Guest')}`}
              alt={user?.full_name || 'Guest Participant'}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#20B2AA] shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  user ? 'bg-[#20B2AA]/20 text-[#064E52] border border-[#20B2AA]/30' : 'bg-[#006D8F]/15 text-[#006D8F] border border-[#006D8F]/25'
                }`}>
                  {user ? (user.role?.toUpperCase() || 'STUDENT PARTICIPANT') : 'GUEST VISITOR'}
                </span>
                <span className="text-xs text-[#006D8F] font-semibold">COLORIDO 2K26 PORTAL</span>
              </div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#064E52]">
                {user ? `Welcome back, ${user.full_name}! 👋` : 'Guest Visitor Portal'}
              </h1>
              <p className="text-xs text-[#006D8F] font-medium">
                {user ? (
                  `${user.college || 'University Participant'} • ${user.department || 'Department'} (${user.year || 'Student'})`
                ) : (
                  'Create an account or log in to link official registrations, view digital passes, and track fixtures.'
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {!user ? (
              <>
                <button
                  onClick={() => onNavigate('/login')}
                  className="px-5 py-2.5 rounded-xl bg-[#20B2AA] hover:bg-[#1CA099] text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In to Account</span>
                </button>
                <button
                  onClick={() => onNavigate('/register-auth')}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#DDF3F0] border border-[#006D8F]/30 text-[#006D8F] font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register Account</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#DDF3F0] text-[#064E52] font-bold text-xs border border-[#006D8F]/25 shadow-xs transition-all flex items-center space-x-1.5"
                >
                  <Pencil className="w-3.5 h-3.5 text-[#006D8F]" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => onNavigate('/events')}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#DDF3F0] text-[#006D8F] font-bold text-xs border border-[#006D8F]/25 shadow-xs transition-colors"
                >
                  Browse Events
                </button>
                <button
                  onClick={() => onNavigate('/register')}
                  className="px-5 py-2.5 rounded-xl bg-[#20B2AA] hover:bg-[#1CA099] text-white font-bold text-xs shadow-md transition-all"
                >
                  + Register New Event
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* GUEST NOTICE / AUTHENTICATION GATE (IF NOT LOGGED IN) */}
      {!user && (
        <div className="bg-white border-2 border-[#006D8F]/20 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#006D8F]/15 text-[#006D8F] flex items-center justify-center font-bold flex-shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-[#064E52]">Student Account Registration Required</h3>
                <p className="text-xs text-[#006D8F] max-w-2xl leading-relaxed">
                  You are browsing as an unauthenticated guest. To register for events, confirm schedule fixture timings, view your personalized upcoming timetable, and download authentic Digital QR passes, please register or log in.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto flex-shrink-0">
              <button
                onClick={() => switchDemoUser('participant')}
                className="px-4 py-2 rounded-xl bg-[#DDF3F0] hover:bg-white border border-[#20B2AA] text-[#064E52] font-bold text-xs transition-all shadow-xs"
              >
                👤 Quick Login as Student
              </button>
              <button
                onClick={() => onNavigate('/register-auth')}
                className="px-4 py-2 rounded-xl bg-[#20B2AA] hover:bg-[#1CA099] text-white font-bold text-xs transition-all shadow-md"
              >
                Register Now &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROMINENT NEXT UPCOMING EVENT CARD (ONLY FOR LOGGED-IN USERS WITH REGISTRATIONS) */}
      {user && upcomingEvent && (
        <section className="bg-white border-2 border-[#20B2AA]/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden animate-in fade-in duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#20B2AA]/20 text-[#064E52] text-xs font-bold border border-[#20B2AA]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#20B2AA]" />
                <span>Your Next Upcoming Fixture</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#064E52]">
                {upcomingEvent.event_name}
              </h2>
              <div className="flex flex-wrap gap-4 text-xs text-[#006D8F] font-semibold">
                <span className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-[#20B2AA]" />
                  <span>
                    {new Date(upcomingEvent.event_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-[#006D8F]" />
                  <span>{upcomingEvent.start_time.slice(0, 5)} - {upcomingEvent.end_time.slice(0, 5)}</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-[#20B2AA]" />
                  <span>{upcomingEvent.venue}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {upcomingReg && (
                <button
                  onClick={() => setSelectedPassReg(upcomingReg)}
                  className="px-6 py-3 rounded-xl bg-[#20B2AA] hover:bg-[#1CA099] text-white font-bold text-xs shadow-md shadow-[#20B2AA]/20 flex items-center space-x-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>SHOW DIGITAL PASS</span>
                </button>
              )}
              <button
                onClick={() => onViewEvent(upcomingEvent.event_id)}
                className="px-5 py-3 rounded-xl bg-white hover:bg-[#DDF3F0] text-[#064E52] font-bold text-xs border border-[#006D8F]/25 shadow-xs transition-colors"
              >
                View Rules &amp; Stage Details
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Grid: Left 2 Cols (Registered Events & Certificates), Right 1 Col (Saved Events & Reminders) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. MY REGISTERED EVENTS */}
          <section className="bg-white border border-[#006D8F]/15 rounded-3xl p-6 sm:p-8 space-y-5 shadow-lg">
            <div className="flex justify-between items-center border-b border-[#006D8F]/15 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-[#DDF3F0] text-[#006D8F] rounded-xl border border-[#006D8F]/20">
                  <Calendar className="w-5 h-5 text-[#20B2AA]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#064E52]">My Registered Events</h3>
                  <p className="text-xs text-[#006D8F] font-medium">All active tournament registrations</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[#064E52] bg-[#DDF3F0] border border-[#006D8F]/20 px-3 py-1 rounded-full">
                {registrations.length} Events
              </span>
            </div>

            {!user ? (
              <div className="text-center py-8 text-[#006D8F] text-xs space-y-3">
                <p>You must be signed in with a student participant account to view your registered events.</p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => onNavigate('/login')}
                    className="px-4 py-2 bg-[#20B2AA] hover:bg-[#1CA099] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Log In First
                  </button>
                  <button
                    onClick={() => onNavigate('/register-auth')}
                    className="px-4 py-2 bg-white hover:bg-[#DDF3F0] border border-[#006D8F]/25 text-[#006D8F] rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            ) : registrations.length === 0 ? (
              <div className="text-center py-8 text-[#006D8F] text-xs space-y-3">
                <p>You have not registered for any events yet.</p>
                <button
                  onClick={() => onNavigate('/events')}
                  className="px-5 py-2.5 bg-[#20B2AA] hover:bg-[#1CA099] text-white rounded-xl text-xs font-bold shadow-md shadow-[#20B2AA]/20"
                >
                  Explore &amp; Register &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {registrations.map(reg => {
                  const evt = allEvents.find(e => e.event_id === reg.event_id);
                  return (
                    <div
                      key={reg.id}
                      className="p-4 rounded-2xl bg-[#DDF3F0]/40 border border-[#006D8F]/15 hover:border-[#20B2AA] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-white border border-[#006D8F]/25 text-[#064E52]">
                            {reg.registration_id}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                            reg.status === 'checked_in'
                              ? 'bg-[#006D8F]/15 text-[#006D8F] border border-[#006D8F]/30'
                              : 'bg-[#20B2AA]/20 text-[#064E52] border border-[#20B2AA]/40'
                          }`}>
                            {reg.status.replace('_', ' ')}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            reg.payment_status === 'free'
                              ? 'bg-white text-[#064E52] border border-[#006D8F]/20'
                              : 'bg-[#20B2AA]/20 text-[#064E52] border border-[#20B2AA]/30'
                          }`}>
                            {reg.payment_status === 'free' ? 'FREE ENTRY' : `PAID (₹${reg.payment_amount ?? (evt?.registration_fee || 0)})`}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-[#064E52]">{evt?.event_name || reg.event_id}</h4>
                        <p className="text-xs text-[#006D8F] font-medium flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#20B2AA]" />
                          <span>{evt?.venue}</span>
                          <span>•</span>
                          <Calendar className="w-3.5 h-3.5 text-[#006D8F]" />
                          <span>{evt ? new Date(evt.event_date).toLocaleDateString() : 'Festival'} ({evt?.start_time.slice(0, 5)})</span>
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 self-start sm:self-auto">
                        <button
                          onClick={() => setSelectedPassReg(reg)}
                          className="px-4 py-2 rounded-xl bg-[#20B2AA] hover:bg-[#1CA099] text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm shadow-[#20B2AA]/25 transition-all active:scale-95"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Digital Pass</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* 2. MY CERTIFICATES */}
          <section className="bg-white border border-[#006D8F]/15 rounded-3xl p-6 sm:p-8 space-y-5 shadow-lg">
            <div className="flex justify-between items-center border-b border-[#006D8F]/15 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-[#DDF3F0] text-[#006D8F] rounded-xl border border-[#006D8F]/20">
                  <Award className="w-5 h-5 text-[#20B2AA]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#064E52]">My Digital Certificates</h3>
                  <p className="text-xs text-[#006D8F] font-medium">Official verified credentials and merit awards</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[#064E52] bg-[#DDF3F0] border border-[#006D8F]/20 px-3 py-1 rounded-full">
                {certificates.length} Issued
              </span>
            </div>

            {!user ? (
              <div className="text-center py-6 text-[#006D8F] text-xs">
                Log in to access your verified festival participation and merit certificates.
              </div>
            ) : certificates.length === 0 ? (
              <div className="text-center py-8 text-[#006D8F] text-xs">
                Certificates become automatically accessible in your portal once event adjudicators publish verified tournament results.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates.map(cert => (
                  <div
                    key={cert.id}
                    onClick={() => setSelectedCert(cert)}
                    className="p-4 rounded-2xl bg-[#DDF3F0]/40 border border-[#006D8F]/15 hover:border-[#20B2AA] cursor-pointer transition-all space-y-3 group"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#006D8F]/15 text-[#006D8F] border border-[#006D8F]/25">
                        {cert.certificate_type}
                      </span>
                      <span className="text-[10px] font-mono text-[#064E52]/70 font-bold">{cert.certificate_id}</span>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-[#064E52] group-hover:text-[#20B2AA] transition-colors">
                        {cert.event_name}
                      </h4>
                      <p className="text-[11px] text-[#006D8F] mt-1 font-medium">{cert.achievement}</p>
                    </div>

                    <div className="pt-2 border-t border-[#006D8F]/10 flex items-center justify-between text-xs text-[#006D8F] group-hover:text-[#20B2AA] font-bold">
                      <span>View &amp; Download</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 3. MY RESULTS */}
          {user && results.length > 0 && (
            <section className="bg-white border border-[#006D8F]/15 rounded-3xl p-6 sm:p-8 space-y-5 shadow-lg">
              <div className="flex items-center space-x-3 border-b border-[#006D8F]/15 pb-4">
                <div className="p-2.5 bg-[#DDF3F0] text-[#006D8F] rounded-xl border border-[#006D8F]/20">
                  <Trophy className="w-5 h-5 text-[#20B2AA]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#064E52]">My Tournament Results</h3>
                  <p className="text-xs text-[#006D8F] font-medium">Podium finishes and championship points contributed</p>
                </div>
              </div>

              <div className="space-y-3">
                {results.map(res => (
                  <div
                    key={res.id}
                    className="p-4 rounded-2xl bg-[#DDF3F0]/40 border border-[#006D8F]/15 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#20B2AA]/20 text-[#064E52] border border-[#20B2AA]/30 uppercase">
                        {res.position}
                      </span>
                      <h4 className="font-bold text-sm text-[#064E52] mt-1">{res.event_name}</h4>
                      <p className="text-[#006D8F] font-medium">Score: {res.score}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-[#064E52]">+{res.points_awarded} pts</span>
                      <p className="text-[10px] text-[#006D8F]">College Standings</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Saved Events & Reminders Feed */}
        <div className="space-y-8">
          {/* SAVED EVENTS (FAVORITES) */}
          <section className="bg-white border border-[#006D8F]/15 rounded-3xl p-6 space-y-4 shadow-lg">
            <div className="flex justify-between items-center border-b border-[#006D8F]/15 pb-3">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-rose-500 fill-current" />
                <h3 className="font-bold text-sm text-[#064E52]">Saved Events ({savedEvents.length})</h3>
              </div>
              <button
                onClick={() => onNavigate('/events')}
                className="text-xs text-[#006D8F] hover:text-[#20B2AA] font-bold"
              >
                Browse &rarr;
              </button>
            </div>

            {savedEvents.length === 0 ? (
              <p className="text-xs text-[#006D8F] py-4 text-center font-medium">
                No events bookmarked. Tap the heart icon on any event card to save it here!
              </p>
            ) : (
              <div className="space-y-3">
                {savedEvents.map(evt => (
                  <div
                    key={evt.event_id}
                    className="p-3.5 rounded-xl bg-[#DDF3F0]/40 border border-[#006D8F]/15 space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <h4
                        onClick={() => onViewEvent(evt.event_id)}
                        className="font-bold text-[#064E52] hover:text-[#20B2AA] cursor-pointer line-clamp-1"
                      >
                        {evt.event_name}
                      </h4>
                      <button
                        onClick={() => toggleFavorite(evt.event_id, evt.event_name)}
                        className="text-[#006D8F] hover:text-rose-500 font-bold"
                      >
                        &times;
                      </button>
                    </div>
                    <p className="text-[11px] text-[#006D8F] font-medium">
                      {evt.venue} • {evt.start_time.slice(0, 5)}
                    </p>
                    <button
                      onClick={() => onNavigate(`/register?event=${evt.event_id}`)}
                      className="w-full py-2 rounded-lg bg-[#20B2AA] hover:bg-[#1CA099] text-white font-bold text-[11px] shadow-sm transition-all"
                    >
                      Register Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* EVENT REMINDERS & NOTIFICATION FEED */}
          {user && notifications.length > 0 && (
            <section className="bg-white border border-[#006D8F]/15 rounded-3xl p-6 space-y-4 shadow-lg">
              <div className="flex justify-between items-center border-b border-[#006D8F]/15 pb-3">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-[#20B2AA]" />
                  <h3 className="font-bold text-sm text-[#064E52]">Event Reminders</h3>
                </div>
                <button
                  onClick={() => onNavigate('/announcements')}
                  className="text-xs text-[#006D8F] hover:text-[#20B2AA] font-bold"
                >
                  Notices &rarr;
                </button>
              </div>

              <div className="space-y-2">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className="p-3 rounded-xl bg-[#DDF3F0]/40 border border-[#006D8F]/15 text-xs space-y-1"
                  >
                    <p className="font-bold text-[#064E52] leading-snug">{n.title}</p>
                    <p className="text-[#006D8F] text-[11px] leading-relaxed font-medium">{n.message}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Digital Pass Modal */}
      {selectedPassReg && (
        <DigitalPassModal
          registration={selectedPassReg}
          isOpen={!!selectedPassReg}
          onClose={() => setSelectedPassReg(null)}
        />
      )}

      {/* Certificate Modal */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        user={user}
        onSave={updateProfile}
      />
    </div>
  );
};
