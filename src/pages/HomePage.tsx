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
  ChevronLeft,
  Medal,
  Music,
  Activity,
  Layers,
  Compass,
  Zap,
  Target
} from 'lucide-react';
import { store } from '../lib/store';
import { EventItem, Announcement, Sponsor, GalleryItem } from '../types/database';
import { EventCard } from '../components/events/EventCard';
import { useAuth } from '../context/AuthContext';
import { Category3DCarousel } from '../components/home/Category3DCarousel';
import { EventHighlightsStories } from '../components/home/EventHighlightsStories';
import { CinematicHero } from '../components/home/CinematicHero';
import { LiveHighlightsSection } from '../components/home/LiveHighlightsSection';
import { ScrollDrivenSection } from '../components/home/ScrollDrivenSection';

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
  const culturalEvents = events.filter(e => e.category === 'cultural');
  const sportsEvents = events.filter(e => e.category === 'sports');

  const featuredEvents = events.slice(0, 6);
  const pinnedAnnouncements = announcements.filter(a => a.is_published && (a.pinned || a.priority === 'Urgent')).slice(0, 3);

  return (
    <div className="space-y-16 pb-20 bg-[#05030D] text-[#F5F0FF] overflow-hidden">
      
      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO (MUST BE FIRST) */}
      {/* ========================================================================= */}
      <ScrollDrivenSection glowType="pink-violet">
        <CinematicHero onNavigate={onNavigate} />
      </ScrollDrivenSection>

      {/* ========================================================================= */}
      {/* 2. LIVE HIGHLIGHTS CARDS (3D Sports Carousel) */}
      {/* ========================================================================= */}
      <ScrollDrivenSection glowType="dragon-violet">
        <LiveHighlightsSection onNavigate={onNavigate} />
      </ScrollDrivenSection>

      {/* ========================================================================= */}
      {/* 3. SPORTS SECTION: "Compete. Perform. Win." */}
      {/* ========================================================================= */}
      <ScrollDrivenSection id="sports" glowType="electric-violet" className="scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(216,180,254,0.15)] pb-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#10051D] border border-[#FF1493]/35 text-[11px] font-bold text-[#FF2B9A] shadow-xs">
                <Trophy className="w-3.5 h-3.5 text-[#FF1493]" />
                <span>Championship Arena</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-[#F5F0FF] tracking-tight">
                SPORTS
              </h2>
              <p className="text-sm sm:text-lg font-bold gradient-text-hero">
                “Compete. Perform. Win.”
              </p>
              <p className="text-xs sm:text-sm text-[#B9A9D6] max-w-xl">
                High-intensity knockout tournaments across basketball, volleyball, table tennis, and athletics. Full-court collegiate rivalries under floodlit campus arenas.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('/events?category=sports')}
                className="btn-primary-neon text-xs px-5 py-2.5 rounded-xl font-bold flex items-center space-x-1.5"
              >
                <span>Explore All Sports</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sports Event Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(sportsEvents.length > 0 ? sportsEvents.slice(0, 3) : events.slice(0, 3)).map(event => (
              <EventCard
                key={event.event_id}
                event={event}
                onViewDetails={onViewEvent}
                onRegister={onRegisterEvent}
              />
            ))}
          </div>
        </div>
      </ScrollDrivenSection>

      {/* ========================================================================= */}
      {/* 4. CULTURE SECTION: "Celebrate Every Expression." */}
      {/* ========================================================================= */}
      <ScrollDrivenSection id="culture" glowType="pink-purple" className="scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(216,180,254,0.15)] pb-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#10051D] border border-[#7C3AED]/40 text-[11px] font-bold text-[#D8B4FE] shadow-xs">
                <Music className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>Performing Arts Enclave</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-[#F5F0FF] tracking-tight">
                CULTURE
              </h2>
              <p className="text-sm sm:text-lg font-bold gradient-text-hero">
                “Celebrate Every Expression.”
              </p>
              <p className="text-xs sm:text-sm text-[#B9A9D6] max-w-xl">
                10 premier disciplines from Battle of the Bands to classical choreographies, live canvas painting, and dramatic street plays.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('/events?category=cultural')}
                className="btn-secondary-neon text-xs px-5 py-2.5 rounded-xl font-bold flex items-center space-x-1.5"
              >
                <span>Explore Cultural Arts</span>
                <ArrowRight className="w-4 h-4 text-[#D8B4FE]" />
              </button>
            </div>
          </div>

          {/* Culture Event Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(culturalEvents.length > 0 ? culturalEvents.slice(0, 3) : events.slice(0, 3)).map(event => (
              <EventCard
                key={event.event_id}
                event={event}
                onViewDetails={onViewEvent}
                onRegister={onRegisterEvent}
              />
            ))}
          </div>
        </div>
      </ScrollDrivenSection>

      {/* ========================================================================= */}
      {/* 5. TALENT SECTION: "Discover What's Next." */}
      {/* ========================================================================= */}
      <ScrollDrivenSection id="talent" glowType="violet" className="scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(216,180,254,0.15)] pb-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#10051D] border border-[#5B21F5]/40 text-[11px] font-bold text-[#8B7CFF] shadow-xs">
                <Zap className="w-3.5 h-3.5 text-[#5B21F5]" />
                <span>Tekraft & Future Prodigies</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-[#F5F0FF] tracking-tight">
                TALENT
              </h2>
              <p className="text-sm sm:text-lg font-bold gradient-text-hero">
                “Discover What's Next.”
              </p>
              <p className="text-xs sm:text-sm text-[#B9A9D6] max-w-xl">
                Spotlighting emerging inventors, concert audio designers, rapid digital media creators, and short film auteurs taking center stage.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/events')}
              className="btn-secondary-neon text-xs px-5 py-2.5 rounded-xl font-bold flex items-center space-x-1.5"
            >
              <span>Browse All Talent Hubs</span>
              <ArrowRight className="w-4 h-4 text-[#D8B4FE]" />
            </button>
          </div>

          {/* Talent Feature Showcase Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-panel p-6 rounded-3xl border border-[rgba(216,180,254,0.18)] hover:border-[#FF1493]/50 transition-all duration-300 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FF1493]/20 flex items-center justify-center text-[#FF2B9A] border border-[#FF1493]/40">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">Tekraft Digital Innovation</h3>
              <p className="text-xs text-[#B9A9D6] leading-relaxed">
                Speed coding, UI/UX interactive prototyping, generative visuals, and live algorithmic challenges with industry mentors.
              </p>
              <button
                onClick={() => onNavigate('/events')}
                className="text-xs font-bold text-[#FF2B9A] hover:text-[#FF1493] flex items-center space-x-1 pt-2"
              >
                <span>Explore Tekraft</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-[rgba(216,180,254,0.18)] hover:border-[#7C3AED]/50 transition-all duration-300 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#7C3AED]/20 flex items-center justify-center text-[#D8B4FE] border border-[#7C3AED]/40">
                <Music className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">Stage Sound & Light Truss</h3>
              <p className="text-xs text-[#B9A9D6] leading-relaxed">
                Real-time arena lighting design, audio engineering, live DJ mixing sets, and acoustic production showcase.
              </p>
              <button
                onClick={() => onNavigate('/venues')}
                className="text-xs font-bold text-[#D8B4FE] hover:text-white flex items-center space-x-1 pt-2"
              >
                <span>View Stage Tech</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-[rgba(216,180,254,0.18)] hover:border-[#5B21F5]/50 transition-all duration-300 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#5B21F5]/20 flex items-center justify-center text-[#8B7CFF] border border-[#5B21F5]/40">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">Media & Short Film Expo</h3>
              <p className="text-xs text-[#B9A9D6] leading-relaxed">
                Original student docudramas, thematic photography galleries, and narrative micro-cinema screening at Kalam Auditorium.
              </p>
              <button
                onClick={() => onNavigate('/gallery')}
                className="text-xs font-bold text-[#8B7CFF] hover:text-[#D8B4FE] flex items-center space-x-1 pt-2"
              >
                <span>Explore Gallery</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </ScrollDrivenSection>

      {/* ========================================================================= */}
      {/* 6. DYNAMIC DATABASE-DRIVEN STATISTICS BAR + ANNOUNCEMENTS */}
      {/* ========================================================================= */}
      <ScrollDrivenSection glowType="pink-violet">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="glass-panel border border-[rgba(216,180,254,0.18)] rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(91,33,245,0.2)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF1493]/10 blur-[90px] rounded-full pointer-events-none" />

            <div className="text-center mb-8 relative z-10">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF2B9A] block">
                Live Festival Telemetry
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Real-Time Championship Statistics
              </h2>
              <p className="text-xs text-[#B9A9D6]">
                Calculated in real-time from active PostgreSQL database registration records
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[rgba(216,180,254,0.15)] relative z-10">
              {/* TOTAL EVENTS */}
              <div className="pt-4 md:pt-0">
                <span className="font-display font-black text-3xl sm:text-5xl text-white block drop-shadow-md">
                  {totalEvents}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#B9A9D6] mt-2 block">
                  Total Events
                </span>
                <span className="text-[10px] text-[#FF2B9A] font-semibold block mt-1">16 Disciplines</span>
              </div>

              {/* REGISTERED PARTICIPANTS */}
              <div className="pt-4 md:pt-0">
                <span className="font-display font-black text-3xl sm:text-5xl text-[#FF1493] block drop-shadow-[0_0_20px_rgba(255,20,147,0.5)]">
                  {totalParticipantsCount}+
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#B9A9D6] mt-2 block">
                  Registered Participants
                </span>
                <span className="text-[10px] text-[#D8B4FE] font-semibold block mt-1">Verified Slots</span>
              </div>

              {/* COLLEGES */}
              <div className="pt-4 md:pt-0">
                <span className="font-display font-black text-3xl sm:text-5xl text-[#7C3AED] block drop-shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                  {uniqueCollegesCount}+
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#B9A9D6] mt-2 block">
                  Colleges & Universities
                </span>
                <span className="text-[10px] text-[#D8B4FE] font-semibold block mt-1">Across 8 States</span>
              </div>

              {/* CULTURAL EVENTS */}
              <div className="pt-4 md:pt-0">
                <span className="font-display font-black text-3xl sm:text-5xl text-white block">
                  {culturalEvents.length}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#B9A9D6] mt-2 block">
                  Cultural Events
                </span>
                <span className="text-[10px] text-[#FF2B9A] font-semibold block mt-1">Music, Dance, Arts</span>
              </div>

              {/* SPORTS EVENTS */}
              <div className="pt-4 md:pt-0">
                <span className="font-display font-black text-3xl sm:text-5xl text-[#FF2B9A] block">
                  {sportsEvents.length}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#B9A9D6] mt-2 block">
                  Sports Events
                </span>
                <span className="text-[10px] text-[#7C3AED] font-semibold block mt-1">Boys & Girls Cups</span>
              </div>
            </div>
          </div>

          {pinnedAnnouncements.length > 0 && (
            <div className="glass-panel border border-[rgba(216,180,254,0.18)] rounded-2xl p-4 sm:p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[rgba(216,180,254,0.12)]">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-[#FF1493] animate-bounce" />
                  <span className="font-bold text-sm text-white uppercase tracking-wide">
                    Important Festival Notices
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('/announcements')}
                  className="text-xs text-[#D8B4FE] hover:text-[#FF2B9A] font-bold flex items-center transition-colors"
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
                    className="p-3.5 rounded-xl bg-[#080514]/70 hover:bg-[#10051D] border border-[rgba(216,180,254,0.15)] hover:border-[#FF1493]/40 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-[#FF1493]/20 text-[#FF2B9A] border border-[#FF1493]/30">
                        {ann.priority}
                      </span>
                      <span className="text-[10px] font-medium text-[#B9A9D6]">{ann.category}</span>
                    </div>
                    <h4 className="font-bold text-xs text-white line-clamp-1">{ann.title}</h4>
                    <p className="text-[11px] text-[#B9A9D6] line-clamp-2 mt-1 leading-snug">{ann.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollDrivenSection>

      {/* ========================================================================= */}
      {/* 7. FEATURED COMPETITION CHAMPIONSHIPS */}
      {/* ========================================================================= */}
      <ScrollDrivenSection id="events" glowType="pink-violet" className="scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-[rgba(216,180,254,0.15)] pb-4">
            <div>
              <span className="text-xs font-bold text-[#FF2B9A] uppercase tracking-widest">
                National Championship Bracket
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
                Featured Competition Championships
              </h2>
              <p className="text-xs sm:text-sm text-[#B9A9D6] mt-1">
                Explore highlighted cultural stages and athletic knockout tournaments across all 16 disciplines
              </p>
            </div>

            <button
              onClick={() => onNavigate('/events')}
              className="flex items-center space-x-2 text-xs font-bold text-[#D8B4FE] hover:text-[#FF2B9A] transition-colors self-start sm:self-auto"
            >
              <span>Browse All 16 Events</span>
              <ArrowRight className="w-4 h-4 text-[#FF1493]" />
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
        </div>
      </ScrollDrivenSection>

      {/* ========================================================================= */}
      {/* 8. 3D STACKED EVENT CATEGORIES CAROUSEL */}
      {/* ========================================================================= */}
      <ScrollDrivenSection glowType="pink-purple">
        <Category3DCarousel onNavigate={onNavigate} />
      </ScrollDrivenSection>

      {/* ========================================================================= */}
      {/* 9. EVENT HIGHLIGHTS — STORIES & FEATURED MOMENTS */}
      {/* ========================================================================= */}
      <ScrollDrivenSection glowType="dragon-violet">
        <EventHighlightsStories onNavigate={onNavigate} />
      </ScrollDrivenSection>

      {/* ========================================================================= */}
      {/* 10. OFFICIAL SPONSORS & REGISTRATION CALL TO ACTION */}
      {/* ========================================================================= */}
      <ScrollDrivenSection glowType="deep-violet">
        <div className="space-y-16">
          {/* Official Sponsors */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B9A9D6]">
                Proudly Supported By
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Official Festival Partners & Sponsors
              </h2>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 py-4">
              {sponsors.map(sponsor => (
                <div
                  key={sponsor.id}
                  onClick={() => onNavigate('/sponsors')}
                  className="flex items-center space-x-3 px-5 py-3 rounded-2xl bg-[#10051D] border border-[rgba(216,180,254,0.18)] hover:border-[#FF1493] cursor-pointer transition-all duration-300 hover:scale-105 shadow-md shadow-[rgba(91,33,245,0.1)]"
                >
                  <img
                    src={sponsor.logo_url}
                    alt={sponsor.name}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=300&q=80';
                    }}
                    className="w-8 h-8 rounded-lg object-cover bg-[#05030D]"
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">{sponsor.name}</p>
                    <span className="text-[9px] font-semibold text-[#D8B4FE] block">{sponsor.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Registration CTA */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl p-8 sm:p-14 text-center border border-[rgba(216,180,254,0.25)] shadow-[0_25px_70px_rgba(91,33,245,0.3)] bg-gradient-to-r from-[#24104F] via-[#10051D] to-[#5B21F5]/40">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF1493]/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-white border border-white/20">
                  Limited Institutional Slots
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  Ready to claim your place under the spotlight?
                </h2>
                <p className="text-xs sm:text-sm text-[#D8B4FE] leading-relaxed">
                  Registrations for all 16 disciplines are open. Generate your instant Digital Pass with verification QR code and secure your team's place on the national stage.
                </p>

                <div className="flex flex-wrap justify-center gap-4 pt-2">
                  <button
                    onClick={() => onNavigate('/register')}
                    className="btn-primary-neon px-8 py-3.5 rounded-xl font-extrabold text-sm shadow-xl hover:scale-105 transition-all"
                  >
                    Register Online Now &rarr;
                  </button>
                  <button
                    onClick={() => onNavigate('/events')}
                    className="btn-secondary-neon px-7 py-3.5 rounded-xl font-bold text-sm transition-all"
                  >
                    Explore Competition Rules
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollDrivenSection>

    </div>
  );
};
