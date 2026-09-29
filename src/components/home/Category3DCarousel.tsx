import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Trophy, 
  Calendar, 
  MapPin,
  Compass
} from 'lucide-react';

export interface CategoryCardData {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  prize: string;
  description: string;
  image: string;
  filterTarget: string;
  disciplines: string[];
}

const CATEGORIES: CategoryCardData[] = [
  {
    id: 'cultural',
    title: 'Cultural Arts & Theatre',
    subtitle: '10 Prestigious Disciplines',
    badge: 'Flagship Arena',
    prize: '₹2,50,000 in Prizes',
    description: 'Electrifying music battles, solo & classical choreographies, explosive Nukkad Natak street theatre, and live canvas fine arts.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    filterTarget: '/events?category=cultural',
    disciplines: ['Battle of the Bands', 'Western & Classical Dance', 'Nukkad Natak', 'Fine Arts Canvas']
  },
  {
    id: 'sports_boys',
    title: "Boys' Athletic Championships",
    subtitle: '3 Inter-Collegiate Tournaments',
    badge: 'Championship Arena',
    prize: '₹1,25,000 in Prizes',
    description: 'Full-court collegiate FIBA Basketball knockout, high-flying outdoor Spikers Volleyball, and rapid-fire ITTF Table Tennis.',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
    filterTarget: '/events?category=boys',
    disciplines: ['FIBA Basketball Cup', 'Outdoor Spikers Volleyball', 'ITTF Table Tennis Singles/Doubles']
  },
  {
    id: 'sports_girls',
    title: "Girls' Athletic Championships",
    subtitle: '3 Inter-Collegiate Tournaments',
    badge: 'Championship Arena',
    prize: '₹1,25,000 in Prizes',
    description: 'High-energy Throwball championship league, precision Tennikoit singles & doubles, and lightning-fast Table Tennis duels.',
    image: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1200&q=80',
    filterTarget: '/events?category=girls',
    disciplines: ['Throwball League', 'Tennikoit Championship', 'Indoor Table Tennis Cup']
  },
  {
    id: 'technical',
    title: 'Tekraft & Digital Innovation',
    subtitle: 'Creative Media & Tech Labs',
    badge: 'Innovation Spotlight',
    prize: 'Special Merit Trophies',
    description: 'Hands-on creative installations, speed digital crafting, live concert sound design, and stage engineering showcases.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    filterTarget: '/events?category=cultural',
    disciplines: ['Tekraft Digital Craft', 'Stage Lighting & Sound Rig', 'Short Film & Media Expo']
  },
  {
    id: 'venues',
    title: 'Historic Campus Stages',
    subtitle: '6 Iconic Festival Venues',
    badge: 'Campus Enclave',
    prize: '6 Active Live Venues',
    description: 'From the 1,500-seat Dr. APJ Abdul Kalam Grand Auditorium to the stepped Open Air Amphitheatre by the university lake.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    filterTarget: '/venues',
    disciplines: ['Kalam Grand Auditorium', 'Open Air Amphitheatre', 'Major Dhyan Chand Arena']
  }
];

interface Props {
  onNavigate: (path: string) => void;
}

export const Category3DCarousel: React.FC<Props> = ({ onNavigate }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = CATEGORIES.length;

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % total);
  };

  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + total) % total);
  };

  // Keyboard navigation when carousel is focused or user navigates
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 select-none">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#006D8F]/15 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-[#006D8F]/20 text-[11px] font-bold text-[#006D8F] shadow-xs mb-2">
            <Layers className="w-3.5 h-3.5 text-[#20B2AA]" />
            <span>Interactive 3D Arenas</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#064E52] tracking-tight">
            Explore By Festival Pillar
          </h2>
          <p className="text-xs sm:text-sm text-[#4A6B6D] mt-1 max-w-xl">
            Swipe or select a category card to bring it forward in 3D space and discover events across music, sports, drama, and campus stages.
          </p>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center space-x-3 self-start md:self-auto">
          <button
            onClick={handlePrev}
            aria-label="Previous category"
            className="w-11 h-11 rounded-2xl bg-white border border-[#006D8F]/25 hover:border-[#20B2AA] text-[#064E52] hover:text-[#20B2AA] shadow-sm hover:shadow-md transition-all flex items-center justify-center active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-[#064E52] min-w-[50px] text-center font-mono">
            {activeIndex + 1} / {total}
          </span>
          <button
            onClick={handleNext}
            aria-label="Next category"
            className="w-11 h-11 rounded-2xl bg-[#20B2AA] hover:bg-[#1CA099] text-white shadow-md shadow-[#20B2AA]/25 transition-all flex items-center justify-center active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3D Stacked Card Stage */}
      <div 
        ref={containerRef}
        className="relative w-full h-[520px] sm:h-[560px] flex items-center justify-center py-4"
        style={{ perspective: '1400px' }}
      >
        {/* Soft background ambient halo */}
        <div className="absolute w-[500px] h-[300px] bg-gradient-to-r from-[#20B2AA]/15 via-[#006D8F]/10 to-[#DDF3F0] blur-[90px] rounded-full pointer-events-none" />

        <div 
          className="relative w-full max-w-5xl h-full flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {CATEGORIES.map((cat, idx) => {
            // Calculate relative offset from active card
            let diff = idx - activeIndex;
            // Support cyclic wrap-around so cards flow smoothly in both directions
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            const isCenter = diff === 0;
            const absDiff = Math.abs(diff);

            // Bounded visible stack: hide cards beyond 2 steps away
            const isVisible = absDiff <= 2;

            // Geometry calculations for 3D stacked layered deck
            // Active card: x=0, z=0, rotY=0, scale=1
            // Left cards (diff < 0): offset to left, pushed back in z, angled slightly to face center
            // Right cards (diff > 0): offset to right, pushed back in z, angled slightly to face center
            const xOffset = diff * (window.innerWidth < 640 ? 60 : 130);
            const zOffset = -absDiff * 120;
            const rotateY = diff * -14;
            const rotateZ = diff * 1.5;
            const scale = 1 - absDiff * 0.09;
            const opacity = isVisible ? (isCenter ? 1 : Math.max(0.45, 1 - absDiff * 0.32)) : 0;
            const zIndex = 30 - absDiff * 5;

            return (
              <motion.div
                key={cat.id}
                animate={{
                  x: xOffset,
                  z: zOffset,
                  scale,
                  rotateY,
                  rotateZ,
                  opacity,
                  transition: {
                    type: 'spring',
                    stiffness: 260,
                    damping: 26,
                    mass: 0.9
                  }
                }}
                drag={isCenter ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(_, info) => {
                  setTimeout(() => setIsDragging(false), 50);
                  if (info.offset.x > 60) handlePrev();
                  else if (info.offset.x < -60) handleNext();
                }}
                onTap={() => {
                  if (isDragging) return;
                  if (!isCenter) {
                    setActiveIndex(idx);
                  }
                }}
                className={`absolute w-[290px] sm:w-[360px] md:w-[410px] h-[460px] sm:h-[500px] rounded-3xl overflow-hidden cursor-pointer shadow-xl transition-shadow duration-300 ${
                  isCenter 
                    ? 'ring-2 ring-[#20B2AA] shadow-2xl shadow-[#20B2AA]/20' 
                    : 'hover:shadow-2xl'
                }`}
                style={{
                  zIndex,
                  pointerEvents: isVisible ? 'auto' : 'none',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Full-bleed category photo */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />

                {/* Dark gradient overlay for text readability with Deep Teal tint */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#064E52] via-[#064E52]/65 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-[#20B2AA] text-white shadow-sm flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{cat.badge}</span>
                  </span>

                  <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[#DDF3F0] border border-white/20">
                    {cat.prize}
                  </span>
                </div>

                {/* Card Content & Action Area */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 space-y-3 z-10 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#20B2AA] block">
                    {cat.subtitle}
                  </span>

                  <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white leading-tight">
                    {cat.title}
                  </h3>

                  <p className="text-xs text-[#DDF3F0]/90 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>

                  {/* Discipline Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cat.disciplines.slice(0, 3).map((disc) => (
                      <span 
                        key={disc}
                        className="text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-xs text-[#DDF3F0] border border-white/10"
                      >
                        {disc}
                      </span>
                    ))}
                  </div>

                  {/* Action CTA for Active Card */}
                  <div className="pt-2">
                    {isCenter ? (
                      <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(cat.filterTarget);
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-[#20B2AA] hover:bg-[#1CA099] text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-[#20B2AA]/30 transition-all flex items-center justify-center space-x-2 active:scale-98"
                      >
                        <span>Explore {cat.title.split(' ')[0]} Events</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex items-center justify-center space-x-1.5 py-2 text-xs font-bold text-[#20B2AA] opacity-80 group-hover:opacity-100">
                        <span>Click to View Pillar</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Category Selection Tabs / Pagination Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        {CATEGORIES.map((cat, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                isActive
                  ? 'bg-[#20B2AA] text-white shadow-md shadow-[#20B2AA]/20 scale-105'
                  : 'bg-white hover:bg-[#DDF3F0] border border-[#006D8F]/20 text-[#064E52]'
              }`}
            >
              <span>{cat.title}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            </button>
          );
        })}
      </div>
    </section>
  );
};
