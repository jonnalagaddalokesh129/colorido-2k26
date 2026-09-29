import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Users, 
  Trophy, 
  Flame, 
  CheckCircle2, 
  Bell, 
  ShieldCheck, 
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { store } from '../lib/store';
import { EventItem, Announcement, Sponsor, GalleryItem } from '../types/database';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { EventCard } from '../components/events/EventCard';
import { useAuth } from '../context/AuthContext';
import { Category3DCarousel } from '../components/home/Category3DCarousel';
import { EventHighlightsStories } from '../components/home/EventHighlightsStories';

interface Props {
  onNavigate: (path: string) => void;
  onViewEvent: (eventId: string) => void;
  onRegisterEvent: (eventId: string) => void;
}

export const HomePage: React.FC<Props> = ({ onNavigate, onViewEvent, onRegisterEvent }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>(() => store.getEvents());
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => store.getAnnouncements());
  const [sponsors, setSponsors] = useState<Sponsor[]>(() => store.getSponsors());
  const [gallery, setGallery] = useState<GalleryItem[]>(() => store.getGallery());

  useEffect(() => {
    const update = () => {
      setEvents(store.getEvents());
      setAnnouncements(store.getAnnouncements());
      setSponsors(store.getSponsors());
      setGallery(store.getGallery());
    };
    update();
    const unsub = store.subscribe(update);
    return () => unsub();
  }, []);

  // Compute dynamic database-driven statistics (do NOT hardcode)
  const totalEvents = events.length;
  const registrations = store.getRegistrations();
  const totalParticipantsCount = registrations.reduce((acc, r) => acc + (r.team_size || 1), 0);
  const uniqueCollegesCount = new Set(registrations.map(r => r.participant_college)).size;
  const culturalEventsCount = events.filter(e => e.category === 'cultural').length;
  const sportsEventsCount = events.filter(e => e.category === 'sports').length;

  const featuredEvents = events.slice(0, 6);
  const pinnedAnnouncements = announcements.filter(a => a.is_published && (a.pinned || a.priority === 'Urgent')).slice(0, 3);

  return (
    <div className="space-y-16 pb-16 bg-[#DDF3F0]">
      {/* ========================================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden text-center">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#20B2AA]/15 via-[#006D8F]/10 to-[#DDF3F0] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-[#20B2AA]/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
          {/* Top National Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#006D8F]/20 text-xs font-bold text-[#006D8F] shadow-sm backdrop-blur-md animate-in fade-in duration-700">
            <Sparkles className="w-4 h-4 text-[#20B2AA]" />
            <span>National Level Cultural &amp; Sports Festival</span>
            <span className="text-[#064E52]/30">•</span>
            <span className="text-[#20B2AA] font-extrabold">Inter-University 2026</span>
          </div>

          {/* Main Title & Tagline */}
          <div className="space-y-4">
            <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#064E52] leading-none">
              COLORIDO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#20B2AA] to-[#006D8F]">2K26</span>
            </h1>
            <p className="text-lg sm:text-2xl font-bold uppercase tracking-widest text-[#006D8F]">
              Culture • Talent • Sports
            </p>
            <p className="text-sm sm:text-lg italic text-[#20B2AA] font-semibold">
              “Where Talent Meets the Spotlight”
            </p>
          </div>

          <p className="text-xs sm:text-base text-[#4A6B6D] max-w-2xl mx-auto leading-relaxed">
            The grandest inter-collegiate arena for 5,000+ top performers, athletes, bands, choreographers, and creative thinkers. 16 national championships, 6 iconic campus stages, and ₹5,00,000 in grand prizes.
          </p>

          {/* Key Event Badges: Date, Location, Deadline */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs text-[#064E52]">
            <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-[#006D8F]/15 shadow-sm backdrop-blur-md">
              <Calendar className="w-4 h-4 text-[#006D8F]" />
              <span className="font-medium">Oct 15 - 17, 2026</span>
            </div>
            <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-[#006D8F]/15 shadow-sm backdrop-blur-md">
              <MapPin className="w-4 h-4 text-[#20B2AA]" />
              <span className="font-medium">Central University Campus Enclave</span>
            </div>
            <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-[#006D8F]/15 shadow-sm backdrop-blur-md">
              <Clock className="w-4 h-4 text-[#006D8F]" />
              <span className="font-medium">Deadline: Oct 14, 2026 (18:00 hrs)</span>
            </div>
          </div>

          {/* Live Countdown Timer */}
          <div className="pt-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#4A6B6D] mb-3">Festival Commences In</p>
            <CountdownTimer targetDate="2026-10-15T09:00:00" />
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('/register')}
              className="px-8 py-4 rounded-2xl bg-[#20B2AA] hover:bg-[#1CA099] text-white font-extrabold text-sm sm:text-base shadow-xl shadow-[#20B2AA]/30 hover:scale-105 transition-all flex items-center space-x-2"
            >
              <span>REGISTER NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/events')}
              className="px-7 py-4 rounded-2xl bg-white hover:bg-[#DDF3F0] border border-[#006D8F]/25 text-[#006D8F] font-bold text-sm sm:text-base shadow-sm transition-all flex items-center space-x-2"
            >
              <span>EXPLORE EVENTS</span>
            </button>
            <button
              onClick={() => onNavigate('/schedule')}
              className="px-7 py-4 rounded-2xl bg-[#DDF3F0] hover:bg-white border border-[#006D8F]/20 text-[#064E52] font-bold text-sm sm:text-base transition-all"
            >
              <span>VIEW SCHEDULE</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DYNAMIC DATABASE-DRIVEN STATISTICS BAR */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#006D8F]/15 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#20B2AA]">Live Telemetry</span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#064E52] mt-1">Festival Registration Statistics</h2>
            <p className="text-xs text-[#4A6B6D]">Calculated in real-time from active PostgreSQL database records</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#006D8F]/15">
            {/* TOTAL EVENTS */}
            <div className="pt-4 md:pt-0">
              <span className="font-display font-black text-3xl sm:text-5xl text-[#064E52] block">
                {totalEvents}
              </span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#4A6B6D] mt-2 block">
                Total Events
              </span>
              <span className="text-[10px] text-[#006D8F] font-semibold block mt-1">16 Disciplines</span>
            </div>

            {/* REGISTERED PARTICIPANTS */}
            <div className="pt-4 md:pt-0">
              <span className="font-display font-black text-3xl sm:text-5xl text-[#20B2AA] block">
                {totalParticipantsCount}+
              </span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#4A6B6D] mt-2 block">
                Registered Participants
              </span>
              <span className="text-[10px] text-[#006D8F] font-semibold block mt-1">Verified Slots</span>
            </div>

            {/* COLLEGES */}
            <div className="pt-4 md:pt-0">
              <span className="font-display font-black text-3xl sm:text-5xl text-[#006D8F] block">
                {uniqueCollegesCount}+
              </span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#4A6B6D] mt-2 block">
                Colleges &amp; Universities
              </span>
              <span className="text-[10px] text-[#006D8F] font-semibold block mt-1">Across 8 States</span>
            </div>

            {/* CULTURAL EVENTS */}
            <div className="pt-4 md:pt-0">
              <span className="font-display font-black text-3xl sm:text-5xl text-[#064E52] block">
                {culturalEventsCount}
              </span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#4A6B6D] mt-2 block">
                Cultural Events
              </span>
              <span className="text-[10px] text-[#20B2AA] font-semibold block mt-1">Music, Dance, Arts</span>
            </div>

            {/* SPORTS EVENTS */}
            <div className="pt-4 md:pt-0">
              <span className="font-display font-black text-3xl sm:text-5xl text-[#20B2AA] block">
                {sportsEventsCount}
              </span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#4A6B6D] mt-2 block">
                Sports Events
              </span>
              <span className="text-[10px] text-[#20B2AA] font-semibold block mt-1">Boys &amp; Girls Champs</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PINNED ANNOUNCEMENTS BANNER */}
      {/* ========================================================================= */}
      {pinnedAnnouncements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[#006D8F]/20 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#006D8F]/15">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-[#20B2AA] animate-bounce" />
                <span className="font-bold text-sm text-[#064E52] uppercase tracking-wide">Important Festival Notices</span>
              </div>
              <button
                onClick={() => onNavigate('/announcements')}
                className="text-xs text-[#006D8F] hover:text-[#20B2AA] font-bold flex items-center"
              >
                <span>View All ({announcements.length})</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {pinnedAnnouncements.map(ann => (
                <div
                  key={ann.id}
                  onClick={() => onNavigate('/announcements')}
                  className="p-3 rounded-xl bg-[#DDF3F0]/60 hover:bg-[#DDF3F0] border border-[#006D8F]/15 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-[#20B2AA]/20 text-[#064E52] border border-[#20B2AA]/30">
                      {ann.priority}
                    </span>
                    <span className="text-[10px] font-medium text-[#4A6B6D]">{ann.category}</span>
                  </div>
                  <h4 className="font-bold text-xs text-[#064E52] line-clamp-1">{ann.title}</h4>
                  <p className="text-[11px] text-[#4A6B6D] line-clamp-2 mt-1 leading-snug">{ann.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* FEATURED COMPETITION EVENTS */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-[#006D8F]/15 pb-4">
          <div>
            <span className="text-xs font-bold text-[#20B2AA] uppercase tracking-widest">Compete &amp; Shine</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#064E52] mt-1">Featured Festival Championships</h2>
            <p className="text-xs sm:text-sm text-[#4A6B6D] mt-1">
              Explore highlighted cultural stages and athletic knockout tournaments
            </p>
          </div>

          <button
            onClick={() => onNavigate('/events')}
            className="flex items-center space-x-2 text-xs font-bold text-[#006D8F] hover:text-[#20B2AA] transition-colors self-start sm:self-auto"
          >
            <span>Browse All 16 Events</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map(event => (
            <EventCard
              key={event.event_id}
              event={event}
              onViewDetails={onViewEvent}
              onRegister={onRegisterEvent}
            />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3D STACKED EVENT CATEGORIES CAROUSEL */}
      {/* ========================================================================= */}
      <Category3DCarousel onNavigate={onNavigate} />

      {/* ========================================================================= */}
      {/* EVENT HIGHLIGHTS — STORIES & FEATURED MOMENTS */}
      {/* ========================================================================= */}
      <EventHighlightsStories onNavigate={onNavigate} />

      {/* ========================================================================= */}
      {/* OFFICIAL SPONSORS SECTION */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#4A6B6D]">Proudly Supported By</span>
          <h2 className="text-lg sm:text-xl font-bold text-[#064E52] mt-1">Official Festival Partners &amp; Sponsors</h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 py-4">
          {sponsors.map(sponsor => (
            <div
              key={sponsor.id}
              onClick={() => onNavigate('/sponsors')}
              className="flex items-center space-x-3 px-5 py-3 rounded-2xl bg-white border border-[#006D8F]/15 hover:border-[#20B2AA] cursor-pointer transition-all hover:scale-105 shadow-xs"
            >
              <img
                src={sponsor.logo_url}
                alt={sponsor.name}
                className="w-8 h-8 rounded-lg object-cover"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-[#064E52]">{sponsor.name}</p>
                <span className="text-[9px] font-semibold text-[#006D8F] block">{sponsor.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* QUICK REGISTRATION CALL TO ACTION BANNER */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#064E52] via-[#043B3E] to-[#006D8F] border border-[#20B2AA]/30 rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#20B2AA]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-white border border-white/20">
              Limited Institutional Slots
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              Ready to claim your place under the spotlight?
            </h2>
            <p className="text-xs sm:text-sm text-[#DDF3F0] leading-relaxed">
              Registrations for all 16 disciplines are open. Generate your instant Digital Pass with verification QR code and secure your team's place on the national stage.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('/register')}
                className="px-8 py-3.5 rounded-xl bg-[#20B2AA] hover:bg-[#1CA099] text-white font-extrabold text-sm shadow-xl hover:scale-105 transition-all"
              >
                Register Online Now &rarr;
              </button>
              <button
                onClick={() => onNavigate('/events')}
                className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm transition-all"
              >
                Explore Competition Rules
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
