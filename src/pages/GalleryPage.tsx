import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Sparkles, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Tag, 
  Calendar, 
  MapPin, 
  Eye,
  Info
} from 'lucide-react';
import { store } from '../lib/store';
import { GalleryItem } from '../types/database';

/* Fallback image in case an external image URL fails */
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80';

export const GalleryPage: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>(() => store.getGallery());
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  const [windowWidth, setWindowWidth] = useState<number>(() => typeof window !== 'undefined' ? window.innerWidth : 1200);

  /* Real-time subscription to store gallery data */
  useEffect(() => {
    const update = () => {
      const items = store.getGallery();
      setGallery(items);
    };
    update();
    const unsub = store.subscribe(update);
    return () => unsub();
  }, []);

  /* Window resize listener for responsive radius & card sizing */
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = [
    'ALL',
    'CULTURAL',
    'SPORTS',
    'PERFORMANCES',
    'CAMPUS',
    'PARTICIPANTS',
    'HIGHLIGHTS'
  ];

  const filteredItems = gallery.filter(item => {
    if (activeCategory === 'ALL') return true;
    return item.category?.toUpperCase() === activeCategory;
  });

  /* Keep activeIndex within bounds when filter changes */
  useEffect(() => {
    setActiveIndex(0);
  }, [activeCategory]);

  const totalItems = filteredItems.length;

  /* Safe navigation helpers */
  const goToNext = useCallback(() => {
    if (totalItems <= 1) return;
    setActiveIndex(prev => (prev + 1) % totalItems);
  }, [totalItems]);

  const goToPrev = useCallback(() => {
    if (totalItems <= 1) return;
    setActiveIndex(prev => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  /* Keyboard arrow navigation */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === 'ArrowRight') goToNext();
        else if (e.key === 'ArrowLeft') goToPrev();
        else if (e.key === 'Escape') setLightboxOpen(false);
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, lightboxOpen]);

  /* Semicircular 3D Geometry configuration */
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  
  // Radius of the 180-degree semicircular front-facing cylinder
  const radius = isMobile ? 260 : isTablet ? 380 : 480;
  // Angular separation between adjacent cards (degrees)
  const angleStep = isMobile ? 32 : isTablet ? 25 : 21;
  // Maximum visible angle span (half-angle for front semicircle: 80° ensures strictly front half)
  const maxAngle = 80;

  // Active focused item
  const currentItem = filteredItems[activeIndex] || null;

  return (
    <div className="min-h-screen bg-[#DDF3F0] text-[#064E52] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-8 overflow-hidden select-none">
      
      {/* ── Section Header ── */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center max-w-3xl mx-auto space-y-3"
      >
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#006D8F]/20 text-[#006D8F] text-xs font-bold shadow-xs backdrop-blur-md">
          <Camera className="w-3.5 h-3.5 text-[#20B2AA]" />
          <span>COLORIDO Visual Archives</span>
          <span className="text-[#064E52]/30">•</span>
          <span className="text-[#20B2AA] font-extrabold">3D Stage Arc</span>
        </div>

        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#064E52] tracking-tight">
          Festival Gallery
        </h1>

        <p className="text-xs sm:text-base text-[#4A6B6D] max-w-xl mx-auto leading-relaxed">
          Relive the energy, creativity, and unforgettable moments of COLORIDO 2K26.
        </p>


      </motion.div>

      {/* ── Category Filter Pills ── */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto"
      >
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-[#20B2AA] text-white shadow-md shadow-[#20B2AA]/30 scale-105'
                : 'bg-white/80 border border-[#006D8F]/15 text-[#064E52] hover:bg-white hover:text-[#006D8F]'
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* ── Empty State ── */}
      {filteredItems.length === 0 && (
        <div className="py-20 text-center space-y-3">
          <Info className="w-10 h-10 text-[#20B2AA] mx-auto opacity-70" />
          <h3 className="font-bold text-lg text-[#064E52]">No photographs in this category yet</h3>
          <p className="text-xs text-[#4A6B6D]">Try selecting "ALL" to explore the complete festival archives.</p>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* 180-DEGREE FRONT-FACING SEMICIRCULAR 3D Y-AXIS CAROUSEL                  */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {filteredItems.length > 0 && (
        <div className="space-y-6">
          {/* 3D Carousel Stage */}
          <div 
            className="relative w-full max-w-6xl mx-auto flex items-center justify-center overflow-visible"
            style={{ 
              height: isMobile ? '380px' : isTablet ? '440px' : '520px',
              perspective: '1100px',
              perspectiveOrigin: '50% 50%'
            }}
          >
            {/* Ambient subtle glow beneath center position */}
            <div 
              className="absolute w-[340px] sm:w-[500px] h-[120px] rounded-full pointer-events-none -bottom-8"
              style={{
                background: 'radial-gradient(circle, rgba(32, 178, 170, 0.28) 0%, rgba(0, 109, 143, 0.10) 50%, transparent 75%)',
                filter: 'blur(25px)'
              }}
            />

            {/* Left Nav Arrow */}
            <button
              onClick={goToPrev}
              aria-label="Previous photograph"
              className="absolute left-2 sm:left-4 z-40 p-3 sm:p-3.5 rounded-full bg-white/90 hover:bg-white border border-[#006D8F]/20 text-[#064E52] hover:text-[#20B2AA] shadow-lg hover:shadow-xl transition-all transform hover:-translate-x-0.5 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Right Nav Arrow */}
            <button
              onClick={goToNext}
              aria-label="Next photograph"
              className="absolute right-2 sm:right-4 z-40 p-3 sm:p-3.5 rounded-full bg-white/90 hover:bg-white border border-[#006D8F]/20 text-[#064E52] hover:text-[#20B2AA] shadow-lg hover:shadow-xl transition-all transform hover:translate-x-0.5 active:scale-95"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* 3D Curved Arc Container */}
            <div 
              className="relative w-full h-full flex items-center justify-center"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {filteredItems.map((item, idx) => {
                const offset = idx - activeIndex;
                const angleDeg = offset * angleStep;
                const isVisible = Math.abs(angleDeg) <= maxAngle;

                // Semicircular trigonometric calculation
                const angleRad = (angleDeg * Math.PI) / 180;
                const posX = radius * Math.sin(angleRad);
                // Center item at Z = 0; side items recede into negative Z
                const posZ = radius * (Math.cos(angleRad) - 1);
                // Rotate around vertical Y-axis: center faces 0° directly forward
                // Side items face along the concave arc normal toward center/viewer
                const rotY = -angleDeg * 0.85;

                const isCenter = offset === 0;
                const scale = isCenter 
                  ? 1.05 
                  : Math.max(0.70, 1 - Math.abs(offset) * 0.10);
                const opacity = isCenter 
                  ? 1.0 
                  : Math.max(0.25, 1 - Math.abs(offset) * 0.22);
                const zIndex = 50 - Math.abs(offset) * 5;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      x: posX,
                      z: posZ,
                      rotateY: rotY,
                      scale: isVisible ? scale : 0.6,
                      opacity: isVisible ? opacity : 0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 220,
                      damping: 24,
                      mass: 0.85
                    }}
                    onClick={() => {
                      if (isCenter) {
                        setLightboxOpen(true);
                      } else {
                        setActiveIndex(idx);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      width: isMobile ? '230px' : isTablet ? '290px' : '350px',
                      height: isMobile ? '310px' : isTablet ? '380px' : '450px',
                      zIndex,
                      cursor: isCenter ? 'zoom-in' : 'pointer',
                      pointerEvents: isVisible ? 'auto' : 'none',
                      transformStyle: 'preserve-3d',
                    }}
                    className="group"
                  >
                    <div 
                      className={`relative w-full h-full rounded-3xl overflow-hidden transition-all duration-300 ${
                        isCenter 
                          ? 'border-2 border-[#20B2AA] shadow-2xl shadow-[#20B2AA]/35 ring-4 ring-[#20B2AA]/20 bg-white' 
                          : 'border border-[#006D8F]/25 shadow-lg bg-white/95 hover:border-[#20B2AA]/60'
                      }`}
                      style={{
                        filter: isCenter ? 'none' : `brightness(${Math.max(0.75, 1 - Math.abs(offset) * 0.12)})`,
                      }}
                    >
                      {/* Image */}
                      <img
                        src={item.image_url}
                        alt={item.title}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = FALLBACK_IMAGE;
                        }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Gentle bottom gradient for text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#064E52]/90 via-[#064E52]/30 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3.5 left-3.5 right-3.5 flex justify-between items-center z-10">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-[#064E52] border border-[#006D8F]/20 backdrop-blur-md shadow-sm">
                          {item.category}
                        </span>

                        {isCenter && (
                          <div className="p-1.5 rounded-full bg-[#20B2AA] text-white shadow-md animate-pulse">
                            <Maximize2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      {/* Details on Bottom */}
                      <div className="absolute bottom-4 left-4 right-4 space-y-1.5 text-white z-10">
                        <h3 className="font-display font-extrabold text-sm sm:text-base leading-snug line-clamp-2 drop-shadow-md">
                          {item.title}
                        </h3>

                        {item.caption && isCenter && (
                          <p className="text-[11px] text-[#DDF3F0] line-clamp-2 leading-relaxed drop-shadow-xs">
                            {item.caption}
                          </p>
                        )}

                        {item.tags && item.tags.length > 0 && isCenter && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {item.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-white/20 text-[#DDF3F0] backdrop-blur-xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Center Focus Badge Overlay */}
                      {isCenter && (
                        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#20B2AA]/90 text-white text-[9px] font-bold uppercase tracking-widest shadow-sm">
                          90° Front Focus
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ── Carousel Info Card & Controls ── */}
          {currentItem && (
            <motion.div 
              key={currentItem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md border border-[#006D8F]/20 rounded-2xl p-5 shadow-lg space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#006D8F]/15 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-[#006D8F] bg-[#DDF3F0] px-2.5 py-0.5 rounded-lg border border-[#006D8F]/20">
                    {activeIndex + 1} / {totalItems}
                  </span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#20B2AA]">
                    {currentItem.category}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#20B2AA] hover:bg-[#1CA099] text-white text-xs font-bold shadow-md shadow-[#20B2AA]/25 transition-all"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View High-Res Lightbox</span>
                  </button>
                </div>
              </div>

              <div>
                <h2 className="font-display font-black text-lg sm:text-xl text-[#064E52]">
                  {currentItem.title}
                </h2>
                {currentItem.caption && (
                  <p className="text-xs sm:text-sm text-[#4A6B6D] mt-1 leading-relaxed">
                    {currentItem.caption}
                  </p>
                )}
              </div>

              {/* Filmstrip Jump Indicators */}
              <div className="pt-2 flex items-center justify-center gap-1.5 overflow-x-auto py-1">
                {filteredItems.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setActiveIndex(dotIdx)}
                    aria-label={`Jump to photograph ${dotIdx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      dotIdx === activeIndex
                        ? 'w-7 bg-[#20B2AA]'
                        : 'w-2 bg-[#006D8F]/30 hover:bg-[#006D8F]/60'
                    }`}
                  />
                ))}
              </div>

              <div className="text-center text-[11px] text-[#4A6B6D] font-medium flex items-center justify-center space-x-3 pt-1">
                <span>Tip: Click side images to rotate arc to front</span>
                <span>•</span>
                <span>Use ← and → arrow keys</span>
              </div>
            </motion.div>
          )}
        </div>
      )}



      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* ACCESSIBLE FULLSCREEN LIGHTBOX                                           */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {lightboxOpen && currentItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#064E52]/90 backdrop-blur-md p-4"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-5 right-5 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
              aria-label="Close fullscreen lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Nav Arrow */}
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Nav Arrow */}
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image & Caption Display */}
            <motion.div
              key={currentItem.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl w-full flex flex-col items-center"
            >
              <div className="max-h-[70vh] rounded-2xl overflow-hidden border border-white/25 shadow-2xl bg-black/40">
                <img
                  src={currentItem.image_url}
                  alt={currentItem.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = FALLBACK_IMAGE;
                  }}
                  className="max-h-[70vh] w-auto object-contain mx-auto"
                />
              </div>

              <div className="mt-4 text-center space-y-1.5 max-w-xl text-white">
                <div className="inline-flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#38C7BF] bg-white/10 px-2.5 py-0.5 rounded-full">
                    {currentItem.category}
                  </span>
                  <span className="text-xs text-[#DDF3F0]/80">
                    {activeIndex + 1} of {filteredItems.length}
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-white">
                  {currentItem.title}
                </h3>
                {currentItem.caption && (
                  <p className="text-xs sm:text-sm text-[#DDF3F0]/90 leading-relaxed">
                    {currentItem.caption}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
