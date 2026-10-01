import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Flame,
  Trophy,
  Music,
  Compass,
  Zap
} from 'lucide-react';
import { CountdownTimer } from '../common/CountdownTimer';

interface Props {
  onNavigate: (path: string) => void;
}

interface HeroSlide {
  id: string;
  taglineBadge: string;
  titleTop: string;
  titleHighlight: string;
  subtitle: string;
  description: string;
  categoryPills: string[];
  accentColor: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'colorido',
    taglineBadge: 'GRAND FINALE • Inter-University 2026',
    titleTop: 'COLORIDO',
    titleHighlight: '2K26',
    subtitle: 'Culture • Talent • Sports',
    description: '“Where Culture, Talent & Sport Come Alive” — The ultimate collegiate battleground for 5,000+ top artists, athletes, performers, and visionary innovators.',
    categoryPills: ['16 National Disciplines', '6 Iconic Stages', '₹5,00,000 Prize Pool'],
    accentColor: '#FF1493'
  },
  {
    id: 'sports',
    taglineBadge: 'Athletic Arena & Knockout Cups',
    titleTop: 'SPORTS',
    titleHighlight: 'ARENA',
    subtitle: 'Cricket • Football • Basketball',
    description: 'Speed, power, and championship glory under the floodlights. Feel the roar of full-court fast breaks, penalty shootouts, and photo finishes.',
    categoryPills: ['FIBA Basketball', 'Spikers Volleyball', 'Table Tennis Cup'],
    accentColor: '#FF2B9A'
  },
  {
    id: 'culture',
    taglineBadge: 'Mainstage Performing Arts',
    titleTop: 'CULTURE',
    titleHighlight: 'FEST',
    subtitle: 'Dance • Music • Art',
    description: 'Every stage an electric canvas, every performance an anthem. Experience thunderous guitar duels, classical dance fusions, and live canvas exhibitions.',
    categoryPills: ['Battle of the Bands', 'Western & Classical Dance', 'Nukkad Natak'],
    accentColor: '#7C3AED'
  },
  {
    id: 'talent',
    taglineBadge: 'Tekraft & Digital Innovation',
    titleTop: 'TALENT',
    titleHighlight: 'EXPO',
    subtitle: 'Innovation • Performance • Creativity',
    description: 'Where emerging prodigies take center stage. Hands-on creative showcases, live concert audio design, speed crafting, and short film expos.',
    categoryPills: ['Tekraft Labs', 'Digital Arts Showcase', 'Media & Stage Engineering'],
    accentColor: '#5B21F5'
  },
  {
    id: 'grand-finale',
    taglineBadge: 'Inter-University Championship',
    titleTop: 'GRAND',
    titleHighlight: 'FINALE',
    subtitle: 'COLORIDO 2K26',
    description: 'Three unmissable days of pure electric energy. Register your institutional contingent and stake your claim to national supremacy.',
    categoryPills: ['Oct 15 - 17, 2026', 'Instant QR Pass', 'Verified Certification'],
    accentColor: '#FF1493'
  }
];

export const CinematicHero: React.FC<Props> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto slide rotation every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section 
      className="relative w-full min-h-[85vh] sm:min-h-[90vh] lg:min-h-[96vh] flex items-center justify-center overflow-hidden text-center bg-[#05030D] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Layer 1: Background Hero Artwork with Intelligent Responsive Positioning ── */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center sm:bg-[center_top] transition-transform duration-1000 scale-105"
        style={{ 
          backgroundImage: "url('/colorido_hero.jpg')",
          backgroundPosition: 'center 40%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* ── Layer 2: Deep Violet / Dark Vignettes & Atmospheric Lighting ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#05030D]/75 via-[#05030D]/55 to-[#05030D] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#05030D]/40 to-[#05030D]/90 pointer-events-none" />
      
      {/* Dynamic Colored Ambient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#FF1493]/20 via-[#5B21F5]/25 to-transparent blur-[120px] rounded-full pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#7C3AED]/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-[#FF1493]/15 blur-[100px] rounded-full pointer-events-none" />

      {/* ── Layer 2.5: Oversized 3D COLORIDO Background Typography ── */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl pointer-events-none select-none z-10 overflow-hidden flex items-center justify-center px-4"
        aria-hidden="true"
      >
        <div className="hero-3d-colorido-text text-center">
          COLORIDO
        </div>
      </div>

      {/* ── Layer 3: Neon Glowing Orbital Rings Simulation ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] lg:w-[1050px] h-[260px] sm:h-[340px] lg:h-[420px] pointer-events-none opacity-30 sm:opacity-40">
        <div className="w-full h-full rounded-[50%] border border-[#FF1493] shadow-[0_0_30px_#FF1493] animate-orbit" style={{ transform: 'rotate(-12deg)' }} />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[700px] lg:w-[900px] h-[200px] sm:h-[280px] lg:h-[350px] pointer-events-none opacity-25 sm:opacity-35">
        <div className="w-full h-full rounded-[50%] border border-[#7C3AED] shadow-[0_0_25px_#7C3AED] animate-orbit-reverse" style={{ transform: 'rotate(15deg)' }} />
      </div>

      {/* ── Layer 4: Floating Soft Lavender Particles & Cosmic Dust ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 rounded-full bg-[#D8B4FE] shadow-[0_0_10px_#D8B4FE] animate-float-slow" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[35%] right-[20%] w-2 h-2 rounded-full bg-[#FF2B9A] shadow-[0_0_12px_#FF2B9A] animate-float-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-[30%] left-[25%] w-1.5 h-1.5 rounded-full bg-[#8B7CFF] shadow-[0_0_10px_#8B7CFF] animate-float-slow" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[60%] right-[15%] w-2 h-2 rounded-full bg-[#D8B4FE] shadow-[0_0_10px_#D8B4FE] animate-float-slow" style={{ animationDelay: '4.5s' }} />
      </div>

      {/* ── Layer 5: Hero Content & Interactive Carousel ── */}
      <div className="relative z-20 max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 md:pt-14 pb-8 sm:pb-12 md:pb-16 space-y-3.5 sm:space-y-5 md:space-y-7">
        
        {/* Top Floating Badge */}
        <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#10051D]/85 border border-[#FF1493]/35 text-[10px] sm:text-xs font-bold text-[#F5F0FF] shadow-[0_0_20px_rgba(255,20,147,0.25)] backdrop-blur-xl">
          <Sparkles className="w-3.5 h-3.5 text-[#FF1493] animate-pulse flex-shrink-0" />
          <span className="text-[#FF2B9A] truncate">{slide.taglineBadge}</span>
          <span className="text-[#B9A9D6]/40 hidden sm:inline">•</span>
          <span className="text-[#D8B4FE] font-medium hidden sm:inline">Oct 15 - 17, 2026</span>
        </div>

        {/* Dynamic Transition Slide Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2.5 sm:space-y-4"
          >
            {/* Prominent GRAND FINALE Identifier */}
            {slide.id === 'colorido' && (
              <div className="font-display font-black tracking-[0.2em] sm:tracking-[0.25em] text-[10px] sm:text-base md:text-lg text-[#FF2B9A] uppercase mb-0.5 sm:mb-1 drop-shadow-[0_0_15px_rgba(255,20,147,0.6)] flex items-center justify-center space-x-2">
                <span className="w-6 sm:w-8 h-[2px] bg-gradient-to-r from-transparent to-[#FF1493]" />
                <span>GRAND FINALE</span>
                <span className="w-6 sm:w-8 h-[2px] bg-gradient-to-l from-transparent to-[#FF1493]" />
              </div>
            )}

            {/* Cinematic 3D Glowing Headline */}
            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-9xl tracking-tight leading-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
              <span className="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                {slide.titleTop}
              </span>{' '}
              <span 
                className="gradient-text-hero drop-shadow-[0_0_35px_rgba(255,20,147,0.6)]"
                style={{
                  background: 'linear-gradient(90deg, #FF1493 0%, #D8B4FE 50%, #7C3AED 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {slide.titleHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-extrabold uppercase tracking-wider sm:tracking-widest text-[#D8B4FE] drop-shadow-[0_0_15px_rgba(216,180,254,0.4)]">
              {slide.subtitle}
            </p>

            {/* Short Supporting Line */}
            <p className="text-xs sm:text-sm md:text-base text-[#B9A9D6] max-w-xl mx-auto leading-relaxed font-normal px-2">
              {slide.description}
            </p>

            {/* Key feature pills for this slide */}
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 pt-1">
              {slide.categoryPills.map((pill) => (
                <span 
                  key={pill}
                  className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-[#24104F]/60 border border-[rgba(216,180,254,0.2)] text-[#F5F0FF] backdrop-blur-md shadow-xs"
                >
                  {pill}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Key Event Badges: Date, Location, Deadline */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-[#F5F0FF] pt-1">
          <div className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#10051D]/80 border border-[rgba(216,180,254,0.18)] shadow-md backdrop-blur-md">
            <Calendar className="w-3.5 h-3.5 text-[#FF1493] flex-shrink-0" />
            <span className="font-semibold whitespace-nowrap">Oct 15 - 17, 2026</span>
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#10051D]/80 border border-[rgba(216,180,254,0.18)] shadow-md backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-[#7C3AED] flex-shrink-0" />
            <span className="font-semibold whitespace-nowrap">Central University Campus</span>
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#10051D]/80 border border-[rgba(216,180,254,0.18)] shadow-md backdrop-blur-md">
            <Clock className="w-3.5 h-3.5 text-[#FF2B9A] flex-shrink-0" />
            <span className="font-semibold whitespace-nowrap">Deadline: Oct 14, 2026</span>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div className="pt-1 sm:pt-2">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#B9A9D6] mb-2 sm:mb-3">
            Championship Commences In
          </p>
          <CountdownTimer targetDate="2026-10-15T09:00:00" />
        </div>

        {/* ── Call To Action Buttons (Mobile-first Responsive Cluster) ── */}
        <div className="pt-2 sm:pt-4 max-w-lg mx-auto w-full space-y-2 sm:space-y-3 px-2 sm:px-0">
          {/* Primary CTA: Full width on mobile, centered pill on desktop */}
          <button
            onClick={() => onNavigate('/register')}
            className="btn-primary-neon w-full sm:w-auto px-7 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm md:text-base font-extrabold shadow-[0_0_25px_rgba(255,20,147,0.4)] hover:shadow-[0_0_40px_rgba(255,43,154,0.65)] flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-102 active:scale-98 mx-auto"
          >
            <span>REGISTER NOW</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>

          {/* Secondary CTAs: 2-column grid on mobile, flex row on tablet/desktop */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full sm:flex sm:justify-center">
            <button
              onClick={() => onNavigate('/events')}
              className="btn-secondary-neon px-3 py-2.5 sm:px-5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-102 active:scale-98 flex items-center justify-center space-x-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-[#D8B4FE] flex-shrink-0" />
              <span>Explore Events</span>
            </button>

            <button
              onClick={() => onNavigate('/schedule')}
              className="px-3 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-[#10051D]/80 hover:bg-[#10051D] border border-[rgba(216,180,254,0.22)] hover:border-[#FF1493]/50 text-[#D8B4FE] hover:text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-1.5 active:scale-98"
            >
              <Calendar className="w-3.5 h-3.5 text-[#FF2B9A] flex-shrink-0" />
              <span>View Schedule</span>
            </button>
          </div>
        </div>

        {/* ── Subtle Pagination Indicators & Slide Nav ── */}
        <div className="flex items-center justify-center space-x-3 pt-6">
          <button
            onClick={() => setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[#B9A9D6] hover:text-white transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentSlide
                    ? 'w-8 h-2 bg-gradient-to-r from-[#FF1493] to-[#7C3AED] shadow-[0_0_10px_#FF1493]'
                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length)}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[#B9A9D6] hover:text-white transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
