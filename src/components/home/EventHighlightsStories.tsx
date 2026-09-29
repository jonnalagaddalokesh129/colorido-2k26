import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Eye, 
  Play, 
  Pause, 
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { store } from '../../lib/store';
import { GalleryItem } from '../../types/database';

export interface HighlightStory {
  id: string;
  title: string;
  shortTitle: string;
  category: 'CULTURAL' | 'SPORTS' | 'PERFORMANCES' | 'CAMPUS' | 'HIGHLIGHTS';
  imageUrl: string;
  caption: string;
  venue: string;
  date: string;
  stats?: string;
}

const HIGHLIGHT_STORIES: HighlightStory[] = [
  {
    id: 'story_01',
    title: 'Neon Night Amphitheatre Laser Launch',
    shortTitle: 'Neon Night',
    category: 'CAMPUS',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    caption: 'Over 5,000 university students gather at the central amphitheatre for the opening ceremony laser spectacle.',
    venue: 'Open Air Amphitheatre',
    date: 'Day 1 Evening',
    stats: '5,000+ Crowd'
  },
  {
    id: 'story_02',
    title: 'Battle of the Bands Guitar Duel',
    shortTitle: 'Band Finals',
    category: 'PERFORMANCES',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    caption: "The lead guitarist from St. Xavier's rock crew tearing down the stage during the explosive national finals.",
    venue: 'Dr. Kalam Grand Auditorium',
    date: 'Day 2 Night',
    stats: '14 Bands'
  },
  {
    id: 'story_03',
    title: 'Buzzer-Beater Championship Dunk',
    shortTitle: 'Boys Hoops',
    category: 'SPORTS',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
    caption: 'High-voltage fourth-quarter fast break and reverse dunk securing the collegiate basketball trophy.',
    venue: 'Indoor Sports Arena',
    date: 'Day 2 Afternoon',
    stats: 'Finals: 78 - 76'
  },
  {
    id: 'story_04',
    title: 'Contemporary Classical Fusion Duet',
    shortTitle: 'Dance Fusion',
    category: 'CULTURAL',
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    caption: 'Breathtaking mid-air synchronization and emotive expression during the Choreoday national showcase.',
    venue: 'Main Auditorium Stage',
    date: 'Day 3 Morning',
    stats: 'Standing Ovation'
  },
  {
    id: 'story_05',
    title: '3-Hour Live Canvas Fine Arts Marathon',
    shortTitle: 'Live Canvas',
    category: 'CULTURAL',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    caption: 'Fine arts champions painting surreal visual masterpieces on A2 canvases with spontaneous themes.',
    venue: 'Raja Ravi Varma Pavilion',
    date: 'Day 1 Morning',
    stats: '40 Artists'
  },
  {
    id: 'story_06',
    title: 'Futuristic Eco-Horizons Fashion Ramp',
    shortTitle: 'Haute Ramp',
    category: 'HIGHLIGHTS',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    caption: 'Sustainable textile designs and visionary avant-garde styling presented by college design delegations.',
    venue: 'Grand Runway Stage',
    date: 'Day 2 Evening',
    stats: '12 Colleges'
  },
  {
    id: 'story_07',
    title: 'Nukkad Natak Street Theatre Circle',
    shortTitle: 'Street Play',
    category: 'CULTURAL',
    imageUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1200&q=80',
    caption: 'Rousing drumbeats and vocal crescendos as drama troupes tackle vital societal questions in public quad.',
    venue: 'Central Quadrangle',
    date: 'Day 1 Afternoon',
    stats: '8 Ensembles'
  },
  {
    id: 'story_08',
    title: 'ITTF Championship Table Tennis Rally',
    shortTitle: 'TT Showdown',
    category: 'SPORTS',
    imageUrl: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=1200&q=80',
    caption: 'A 24-shot speed rally in the fifth deuce set of the Girls Inter-Collegiate singles championship.',
    venue: 'Sports Arena Table 1',
    date: 'Day 3 Finals',
    stats: 'Deuce 14 - 12'
  }
];

interface Props {
  onNavigate: (path: string) => void;
}

export const EventHighlightsStories: React.FC<Props> = ({ onNavigate }) => {
  const [stories] = useState<HighlightStory[]>(HIGHLIGHT_STORIES);
  const [viewedStories, setViewedStories] = useState<Set<string>>(() => new Set(['story_01']));
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-advancing story timer
  useEffect(() => {
    if (activeStoryIndex === null) {
      setProgress(0);
      return;
    }

    const currentStory = stories[activeStoryIndex];
    if (currentStory) {
      setViewedStories(prev => new Set(prev).add(currentStory.id));
    }

    if (isPaused) return;

    const DURATION_MS = 5000;
    const INTERVAL_MS = 50;
    const step = (INTERVAL_MS / DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (activeStoryIndex < stories.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1);
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + step;
      });
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [activeStoryIndex, isPaused, stories]);

  // Keyboard navigation for story viewer
  useEffect(() => {
    if (activeStoryIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveStoryIndex(null);
      if (e.key === 'ArrowRight') handleNextStory();
      if (e.key === 'ArrowLeft') handlePrevStory();
      if (e.key === ' ') setIsPaused(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStoryIndex]);

  const handleNextStory = () => {
    setProgress(0);
    if (activeStoryIndex !== null && activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const handlePrevStory = () => {
    setProgress(0);
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    }
  };

  const scrollStories = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Featured highlight cards (3 representative moments)
  const featuredHighlights = stories.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* ========================================================================= */}
      {/* SECTION HEADER */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#006D8F]/15 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-[#006D8F]/20 text-[11px] font-bold text-[#006D8F] shadow-xs mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#20B2AA]" />
            <span>Festival Highlights &amp; Stories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#064E52]">
            Memories in Motion
          </h2>
          <p className="text-xs sm:text-sm text-[#4A6B6D] mt-1">
            Tap any story circle to view fullscreen moments, or explore previous championship highlights below.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/gallery')}
          className="text-xs font-bold text-[#006D8F] hover:text-[#20B2AA] flex items-center space-x-1.5 self-start sm:self-auto transition-colors"
        >
          <span>Open Full 3D Gallery</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* PART A: CIRCULAR STORIES ROW */}
      {/* ========================================================================= */}
      <div className="relative group/stories">
        {/* Left Scroll Arrow */}
        <button
          onClick={() => scrollStories('left')}
          aria-label="Scroll stories left"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-9 h-9 rounded-full bg-white/95 border border-[#006D8F]/25 text-[#064E52] shadow-md flex items-center justify-center opacity-0 group-hover/stories:opacity-100 transition-opacity hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Story Thumbnails */}
        <div 
          ref={scrollContainerRef}
          className="flex items-center space-x-5 sm:space-x-7 overflow-x-auto py-3 px-2 no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {stories.map((story, index) => {
            const isViewed = viewedStories.has(story.id);

            return (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveStoryIndex(index);
                  setProgress(0);
                }}
                className="flex flex-col items-center space-y-2 cursor-pointer shrink-0 focus:outline-none"
              >
                {/* Story Circular Ring */}
                <div 
                  className={`p-[3px] rounded-full transition-all duration-300 ${
                    isViewed
                      ? 'border-2 border-[#006D8F]/30 bg-transparent'
                      : 'bg-gradient-to-tr from-[#20B2AA] via-[#006D8F] to-[#20B2AA] shadow-md shadow-[#20B2AA]/20 animate-pulse-slow'
                  }`}
                >
                  <div className="p-[2.5px] bg-[#DDF3F0] rounded-full">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden relative group">
                      <img
                        src={story.imageUrl}
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-115"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Short Title */}
                <span className="text-[11px] sm:text-xs font-semibold text-[#064E52] max-w-[80px] text-center truncate">
                  {story.shortTitle}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Right Scroll Arrow */}
        <button
          onClick={() => scrollStories('right')}
          aria-label="Scroll stories right"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-9 h-9 rounded-full bg-white/95 border border-[#006D8F]/25 text-[#064E52] shadow-md flex items-center justify-center opacity-0 group-hover/stories:opacity-100 transition-opacity hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* PART B: FEATURED EVENT HIGHLIGHT CARDS */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-[#064E52]">
            Iconic Championship Highlights
          </h3>
          <span className="text-xs text-[#4A6B6D] font-medium">Curated Festival Moments</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredHighlights.map((hl, i) => (
            <motion.div
              key={hl.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => {
                setActiveStoryIndex(i);
                setProgress(0);
              }}
              className="group bg-white border border-[#006D8F]/15 hover:border-[#20B2AA] rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Image Container with Zoom */}
              <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-100">
                <img
                  src={hl.imageUrl}
                  alt={hl.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#064E52]/90 via-[#064E52]/20 to-transparent" />

                {/* Category & Stats Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#20B2AA] text-white shadow-xs">
                    {hl.category}
                  </span>
                  {hl.stats && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[#DDF3F0] border border-white/20">
                      {hl.stats}
                    </span>
                  )}
                </div>

                {/* Bottom Overlay Text */}
                <div className="absolute bottom-3 left-4 right-4 z-10 text-white">
                  <p className="text-[11px] font-medium text-[#DDF3F0]/90 flex items-center space-x-1 mb-1">
                    <MapPin className="w-3 h-3 text-[#20B2AA]" />
                    <span>{hl.venue}</span>
                  </p>
                  <h4 className="font-bold text-base sm:text-lg text-white leading-tight line-clamp-1 group-hover:text-[#DDF3F0] transition-colors">
                    {hl.title}
                  </h4>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-[#4A6B6D] leading-relaxed line-clamp-2">
                  {hl.caption}
                </p>

                <div className="pt-2 border-t border-[#006D8F]/10 flex items-center justify-between text-xs">
                  <span className="text-[#006D8F] font-semibold flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{hl.date}</span>
                  </span>

                  <span className="text-[#20B2AA] font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>Watch Moment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULLSCREEN SOCIAL STORY VIEWER OVERLAY */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeStoryIndex !== null && stories[activeStoryIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#064E52]/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none"
            onClick={() => setActiveStoryIndex(null)}
          >
            {/* Story Viewer Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md h-[88vh] max-h-[780px] bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Multi-segment Story Progress Bars */}
              <div className="absolute top-3 left-3 right-3 z-30 flex items-center space-x-1.5">
                {stories.map((s, idx) => {
                  let fill = 0;
                  if (idx < activeStoryIndex) fill = 100;
                  else if (idx === activeStoryIndex) fill = progress;

                  return (
                    <div 
                      key={s.id} 
                      className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                    >
                      <div 
                        className="h-full bg-white transition-all duration-75 rounded-full"
                        style={{ width: `${fill}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Story Top Header */}
              <div className="absolute top-6 left-3 right-3 z-30 flex items-center justify-between text-white">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-white/50">
                    <img 
                      src={stories[activeStoryIndex].imageUrl} 
                      alt="" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs font-bold leading-none">{stories[activeStoryIndex].shortTitle}</p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#20B2AA] text-white font-extrabold uppercase">
                        {stories[activeStoryIndex].category}
                      </span>
                    </div>
                    <span className="text-[10px] text-white/70">{stories[activeStoryIndex].venue}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPaused(prev => !prev)}
                    className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setActiveStoryIndex(null)}
                    className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Photograph */}
              <div className="relative flex-1 w-full h-full overflow-hidden">
                <img
                  src={stories[activeStoryIndex].imageUrl}
                  alt={stories[activeStoryIndex].title}
                  className="w-full h-full object-cover select-none"
                />

                {/* Subtle top & bottom readability gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none" />

                {/* Left & Right Tap Zones for Navigation */}
                <div
                  onClick={handlePrevStory}
                  className="absolute inset-y-0 left-0 w-1/3 cursor-pointer z-20"
                  aria-label="Previous story"
                />
                <div
                  onClick={handleNextStory}
                  className="absolute inset-y-0 right-0 w-1/3 cursor-pointer z-20"
                  aria-label="Next story"
                />
              </div>

              {/* Bottom Story Caption & Venue Info */}
              <div className="absolute bottom-0 left-0 right-0 p-5 z-30 text-white space-y-2 pointer-events-none">
                <div className="flex items-center space-x-3 text-xs text-[#DDF3F0]/90">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-[#20B2AA]" />
                    <span>{stories[activeStoryIndex].date}</span>
                  </span>
                  <span>•</span>
                  <span className="text-[#20B2AA] font-bold">{stories[activeStoryIndex].stats}</span>
                </div>

                <h3 className="font-bold text-lg text-white leading-snug">
                  {stories[activeStoryIndex].title}
                </h3>

                <p className="text-xs text-white/90 leading-relaxed">
                  {stories[activeStoryIndex].caption}
                </p>

                <div className="pt-2 pointer-events-auto flex items-center justify-between">
                  <button
                    onClick={() => {
                      setActiveStoryIndex(null);
                      onNavigate('/gallery');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#20B2AA] hover:bg-[#1CA099] text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-[#20B2AA]/30 transition-all"
                  >
                    <span>View in 3D Gallery</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-white/60">Tap sides to navigate</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
