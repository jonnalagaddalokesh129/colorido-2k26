import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Activity, 
  ArrowRight,
  Flame,
  Trophy
} from 'lucide-react';

interface SportHighlight {
  id: string;
  sport: string;
  badge: string;
  title: string;
  highlightText: string;
  metric: string;
  image: string;
  backupImage: string;
  localFallback: string;
  category: string;
  targetPath: string;
}

const SPORTS_HIGHLIGHTS: SportHighlight[] = [
  {
    id: 'cricket',
    sport: 'CRICKET',
    badge: 'Powerplay',
    title: 'Super League T20 Knockout',
    highlightText: 'Explosive boundary hitting, toe-crushing yorkers, and roaring stadium bleachers.',
    metric: '184 S/R Max',
    image: '/sports/cricket.jpg',
    backupImage: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&w=1000&q=80',
    localFallback: '/sports/cricket_stadium.jpg',
    category: 'SPORTS',
    targetPath: '/events?category=sports'
  },
  {
    id: 'football',
    sport: 'FOOTBALL',
    badge: 'Last-Minute Goal',
    title: 'Inter-Collegiate Championship',
    highlightText: 'Stoppage-time penalty drama, curled free-kicks, and relentless 90-minute end-to-end pace.',
    metric: '90+4’ Decider',
    image: '/sports/football.jpg',
    backupImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1000&q=80',
    localFallback: '/sports/football_ball.jpg',
    category: 'SPORTS',
    targetPath: '/events?category=sports'
  },
  {
    id: 'basketball',
    sport: 'BASKETBALL',
    badge: 'Game Winner',
    title: 'FIBA Hardwood Trophy',
    highlightText: 'High-flying fast breaks, baseline three-pointers, and heart-stopping buzzer-beater finishes.',
    metric: '78 - 76 Final',
    image: '/sports/basketball.jpg',
    backupImage: 'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?auto=format&fit=crop&w=1000&q=80',
    localFallback: '/sports/basketball_hoop.jpg',
    category: 'SPORTS',
    targetPath: '/events?category=boys'
  },
  {
    id: 'badminton',
    sport: 'BADMINTON',
    badge: 'Smash',
    title: 'Indoor Open Masters',
    highlightText: 'Lightning jump smashes, deceptive cross-court net drops, and 30-shot stamina battles.',
    metric: '380 km/h Jump',
    image: '/sports/badminton.jpg',
    backupImage: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=80',
    localFallback: '/sports/badminton.jpg',
    category: 'SPORTS',
    targetPath: '/events?category=sports'
  },
  {
    id: 'athletics',
    sport: 'ATHLETICS',
    badge: 'Photo Finish',
    title: '100m National Dash',
    highlightText: 'Sub-11-second explosions off the starting blocks and millisecond deciders across the line.',
    metric: '10.42s Record',
    image: '/sports/athletics.jpg',
    backupImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80',
    localFallback: '/sports/athletics.jpg',
    category: 'SPORTS',
    targetPath: '/events?category=sports'
  }
];

interface SportImageProps {
  primarySrc: string;
  backupSrc: string;
  localFallback: string;
  alt: string;
  className?: string;
}

const SportCardImage: React.FC<SportImageProps> = ({
  primarySrc,
  backupSrc,
  localFallback,
  alt,
  className
}) => {
  const [currentSrc, setCurrentSrc] = useState(primarySrc || localFallback);
  const [stage, setStage] = useState(0);

  const handleError = () => {
    if (stage === 0 && backupSrc && backupSrc !== currentSrc) {
      setStage(1);
      setCurrentSrc(backupSrc);
    } else if (stage <= 1 && localFallback && localFallback !== currentSrc) {
      setStage(2);
      setCurrentSrc(localFallback);
    } else {
      setStage(3);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      className={className}
      style={{
        objectFit: 'cover',
        objectPosition: 'center',
        width: '100%',
        height: '100%',
        display: 'block'
      }}
      loading="eager"
    />
  );
};

interface Props {
  onNavigate: (path: string) => void;
}

export const LiveHighlightsSection: React.FC<Props> = ({ onNavigate }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const total = SPORTS_HIGHLIGHTS.length;

  const nextCard = () => {
    setActiveIndex(prev => (prev + 1) % total);
  };

  const prevCard = () => {
    setActiveIndex(prev => (prev - 1 + total) % total);
  };

  // Automatic transition every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextCard, 4000);
    return () => clearInterval(interval);
  }, [isPaused, activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') nextCard();
      if (e.key === 'ArrowLeft') prevCard();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section 
      id="highlights" 
      className="relative py-12 sm:py-16 select-none overflow-hidden scroll-mt-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Ambient Background Glow for Highlights Section (Dragon Fruit + Violet) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-r from-[#FF1493]/15 via-[#5B21F5]/18 to-transparent blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Heading & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(216,180,254,0.15)] pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#10051D] border border-[#FF1493]/35 text-[11px] font-bold text-[#FF2B9A] shadow-xs">
              <Activity className="w-3.5 h-3.5 text-[#FF1493] animate-pulse" />
              <span>Championship Pulse</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#F5F0FF] tracking-tight">
              LIVE <span className="gradient-text-hero">HIGHLIGHTS</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#B9A9D6] max-w-xl">
              “Experience the moments that define COLORIDO 2K26” — High-stakes powerplays, buzzer-beaters, and photo finishes on the national stage.
            </p>
          </div>

          {/* Quick Filter CTA */}
          <button
            onClick={() => onNavigate('/events?category=sports')}
            className="flex items-center space-x-2 text-xs font-bold text-[#D8B4FE] hover:text-[#FF2B9A] transition-colors self-start md:self-auto py-2.5 px-4 rounded-xl bg-[#10051D] border border-[rgba(216,180,254,0.2)] hover:border-[#FF1493]/50 shadow-xs"
          >
            <span>All 16 Arenas</span>
            <ArrowRight className="w-4 h-4 text-[#FF1493]" />
          </button>
        </div>

        {/* 3D ROTATING SPORTS CAROUSEL STAGE (perspective: 1400px; transform-style: preserve-3d) */}
        <div 
          className="relative w-full h-[470px] sm:h-[510px] md:h-[530px] flex items-center justify-center"
          style={{ perspective: '1400px' }}
          onTouchStart={(e) => setDragStartX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (dragStartX === null) return;
            const diff = e.changedTouches[0].clientX - dragStartX;
            if (diff > 50) prevCard();
            else if (diff < -50) nextCard();
            setDragStartX(null);
          }}
        >
          <div 
            className="relative w-full max-w-5xl h-full flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {SPORTS_HIGHLIGHTS.map((item, idx) => {
              // Calculate cyclic offset (-2 to +2)
              let diff = idx - activeIndex;
              if (diff > total / 2) diff -= total;
              if (diff < -total / 2) diff += total;

              const isCenter = diff === 0;
              const absDiff = Math.abs(diff);

              // 3D Matrix Transforms specified in user requirements
              // CENTER: translate3d(0, 0, 80px) rotateY(0deg) scale(1.08)
              // LEFT: translate3d(-280px, 0, -80px) rotateY(28deg) scale(.88)
              // RIGHT: translate3d(280px, 0, -80px) rotateY(-28deg) scale(.88)
              // FAR LEFT: translate3d(-500px, 0, -220px) rotateY(42deg) scale(.72)
              // FAR RIGHT: translate3d(500px, 0, -220px) rotateY(-42deg) scale(.72)
              
              let xPos = 0;
              let zPos = 80;
              let rotY = 0;
              let scale = 1.08;
              let opacity = 1.0;
              let brightness = 1.0;
              let zIndex = 30;

              // Responsive scaling factors for mobile & tablet
              const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
              const isTablet = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 1024;

              if (diff === -1) {
                xPos = isMobile ? -140 : isTablet ? -220 : -280;
                zPos = -80;
                rotY = isMobile ? 18 : 28;
                scale = 0.88;
                opacity = 0.65;
                brightness = 0.75;
                zIndex = 20;
              } else if (diff === 1) {
                xPos = isMobile ? 140 : isTablet ? 220 : 280;
                zPos = -80;
                rotY = isMobile ? -18 : -28;
                scale = 0.88;
                opacity = 0.65;
                brightness = 0.75;
                zIndex = 20;
              } else if (diff === -2) {
                xPos = isMobile ? -240 : isTablet ? -380 : -500;
                zPos = -220;
                rotY = isMobile ? 26 : 42;
                scale = 0.72;
                opacity = isMobile ? 0 : 0.35;
                brightness = 0.55;
                zIndex = 10;
              } else if (diff === 2) {
                xPos = isMobile ? 240 : isTablet ? 380 : 500;
                zPos = -220;
                rotY = isMobile ? -26 : -42;
                scale = 0.72;
                opacity = isMobile ? 0 : 0.35;
                brightness = 0.55;
                zIndex = 10;
              } else if (absDiff > 2) {
                opacity = 0;
                zIndex = 0;
              }

              return (
                <motion.div
                  key={item.id}
                  animate={{
                    x: xPos,
                    z: zPos,
                    rotateY: rotY,
                    scale: scale,
                    opacity: opacity,
                    filter: `brightness(${brightness})`,
                    transition: {
                      duration: 1.35,
                      ease: [0.22, 1, 0.36, 1]
                    }
                  }}
                  onClick={() => {
                    if (isCenter) {
                      onNavigate(item.targetPath);
                    } else {
                      setActiveIndex(idx);
                    }
                  }}
                  className={`absolute w-[300px] sm:w-[350px] md:w-[380px] h-[430px] sm:h-[460px] rounded-3xl overflow-hidden cursor-pointer select-none transition-shadow duration-500 flex flex-col justify-between ${
                    isCenter 
                      ? 'border-2 border-[#FF1493] shadow-[0_0_40px_rgba(255,20,147,0.45),0_20px_50px_rgba(91,33,245,0.35)]' 
                      : 'border border-[rgba(216,180,254,0.2)] shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                  }`}
                  style={{
                    background: 'rgba(20, 8, 40, 0.78)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    zIndex,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Sports Image: 55-65% of Card, Clear Visibility, Opacity 0.85-1.0 */}
                  <div className="relative h-[60%] w-full overflow-hidden bg-[#080514]">
                    <SportCardImage
                      primarySrc={item.image}
                      backupSrc={item.backupImage}
                      localFallback={item.localFallback}
                      alt={item.title}
                      className={`w-full h-full object-cover object-center transition-transform duration-700 ${
                        isCenter ? 'group-hover:scale-105 opacity-100' : 'opacity-85'
                      }`}
                    />

                    {/* Subtle bottom gradient only for clean typography readability — NO heavy black overlays! */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#140828] to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FF1493] text-white shadow-[0_0_12px_#FF1493]">
                        {item.badge}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-white bg-black/60 px-2 py-0.5 rounded-md border border-[rgba(216,180,254,0.25)]">
                        {item.metric}
                      </span>
                    </div>
                  </div>

                  {/* Card Content (Lower 40%) */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2 text-left relative z-10">
                    <div>
                      <div className="flex items-center space-x-1.5 mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF2B9A]">
                          {item.category}
                        </span>
                        <span className="text-[#D8B4FE]/40">•</span>
                        <span className="text-[10px] font-bold text-[#D8B4FE]">Official Arena</span>
                      </div>

                      <h3 className="font-display font-black text-xl sm:text-2xl text-white leading-tight drop-shadow-xs">
                        {item.sport}
                      </h3>
                      <p className="text-xs font-semibold text-[#D8B4FE] line-clamp-1 mt-0.5">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-[#B9A9D6] line-clamp-2 mt-1 leading-snug">
                        {item.highlightText}
                      </p>
                    </div>

                    {/* Interactive CTA Link */}
                    <div className="pt-2 flex items-center justify-between border-t border-[rgba(216,180,254,0.12)]">
                      <span className="text-xs font-bold text-[#FF1493] flex items-center space-x-1">
                        <span>{isCenter ? 'Explore Arena Details' : 'Select Card'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[10px] text-[#B9A9D6] font-mono">
                        0{idx + 1} / 0{total}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 3D CAROUSEL CONTROLS: Left Arrow, 5 Interactive Dots, Right Arrow */}
        <div className="flex items-center justify-center space-x-4 pt-4">
          {/* Previous Arrow */}
          <button
            onClick={prevCard}
            aria-label="Previous sport"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#10051D] border border-[rgba(216,180,254,0.25)] hover:border-[#FF1493] text-[#B9A9D6] hover:text-white shadow-md transition-all flex items-center justify-center active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-[#D8B4FE]" />
          </button>

          {/* 5 Dots Representing: Cricket, Football, Basketball, Badminton, Athletics */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {SPORTS_HIGHLIGHTS.map((item, dotIdx) => {
              const isActive = dotIdx === activeIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(dotIdx)}
                  aria-label={`Jump to ${item.sport}`}
                  className="flex items-center space-x-1.5 focus:outline-none group"
                >
                  <span 
                    className={`transition-all duration-300 rounded-full ${
                      isActive
                        ? 'w-7 sm:w-8 h-2.5 bg-[#FF1493] shadow-[0_0_12px_#FF1493]'
                        : 'w-2.5 h-2.5 bg-[#7C3AED]/40 hover:bg-[#7C3AED] group-hover:scale-125'
                    }`}
                  />
                  {isActive && (
                    <span className="hidden sm:inline text-[11px] font-bold text-[#FF2B9A] uppercase tracking-wider pl-1">
                      {item.sport}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Arrow */}
          <button
            onClick={nextCard}
            aria-label="Next sport"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#10051D] border border-[rgba(216,180,254,0.25)] hover:border-[#FF1493] text-[#B9A9D6] hover:text-white shadow-md transition-all flex items-center justify-center active:scale-95"
          >
            <ChevronRight className="w-5 h-5 text-[#D8B4FE]" />
          </button>
        </div>

      </div>
    </section>
  );
};
