import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
} from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useAnimation,
  Variants,
} from 'framer-motion';
import {
  Play,
  Pause,
  ArrowLeft,
  Plus,
  Sun,
  Contrast,
  Droplets,
  Blend,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImageEffect {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  filter: string;
  accentColor: string;
  bgGradient: string;
}

interface ImagePreviewCardProps {
  effect: ImageEffect;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  imageUrl: string;
}

// ─── Effect definitions ───────────────────────────────────────────────────────

const EFFECTS: ImageEffect[] = [
  {
    id: 'original',
    label: 'Original',
    description: 'True-to-life colours',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    filter: 'none',
    accentColor: '#10B981',
    bgGradient: 'from-emerald-500/20 to-teal-500/10',
  },
  {
    id: 'grayscale',
    label: 'Grayscale',
    description: 'Classic monochrome',
    icon: <Contrast className="w-3.5 h-3.5" />,
    filter: 'grayscale(100%) contrast(1.1)',
    accentColor: '#94A3B8',
    bgGradient: 'from-slate-400/20 to-zinc-500/10',
  },
  {
    id: 'vivid',
    label: 'Vivid',
    description: 'Boosted saturation',
    icon: <Droplets className="w-3.5 h-3.5" />,
    filter: 'saturate(2.2) contrast(1.05) brightness(1.05)',
    accentColor: '#F59E0B',
    bgGradient: 'from-amber-500/20 to-orange-500/10',
  },
  {
    id: 'warm',
    label: 'Warm',
    description: 'Golden hour feel',
    icon: <Sun className="w-3.5 h-3.5" />,
    filter: 'sepia(0.45) saturate(1.6) brightness(1.08) contrast(1.05)',
    accentColor: '#D4AF37',
    bgGradient: 'from-yellow-500/20 to-amber-400/10',
  },
  {
    id: 'cool',
    label: 'Cool',
    description: 'Cinematic blue',
    icon: <Blend className="w-3.5 h-3.5" />,
    filter: 'hue-rotate(200deg) saturate(1.3) brightness(0.95)',
    accentColor: '#38BDF8',
    bgGradient: 'from-sky-400/20 to-blue-500/10',
  },
  {
    id: 'blur',
    label: 'Soft Focus',
    description: 'Dreamy bokeh',
    icon: <SlidersHorizontal className="w-3.5 h-3.5" />,
    filter: 'blur(1.5px) brightness(1.1) saturate(1.2)',
    accentColor: '#C084FC',
    bgGradient: 'from-purple-500/20 to-fuchsia-500/10',
  },
];

// Stable Unsplash images
const SHOWCASE_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80',
];

// ─── Animation Variants ───────────────────────────────────────────────────────

const bgVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.2, ease: 'easeOut' } },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.92 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
  },
};

const monitorVariants: Variants = {
  hidden: { opacity: 0, y: 120, scale: 0.9 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 90, damping: 18, delay: 0.6 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1, scale: 1, filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.9 + i * 0.12 },
  }),
};

const playButtonVariants: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1, opacity: 1,
    transition: { type: 'spring', stiffness: 200, damping: 16, delay: 1.6 },
  },
};

// ─── ImagePreviewCard ─────────────────────────────────────────────────────────

const ImagePreviewCard = memo<ImagePreviewCardProps>(
  ({ effect, index, isActive, isPlaying, imageUrl }) => (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`relative rounded-2xl overflow-hidden border shadow-xl
        ${isActive ? 'border-white/40 shadow-2xl ring-2 ring-white/20' : 'border-white/10'}`}
      style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}
    >
      <div className="relative overflow-hidden aspect-video">
        <motion.img
          src={imageUrl}
          alt={effect.label}
          loading="lazy"
          className="w-full h-full object-cover"
          animate={{ filter: isActive && isPlaying ? effect.filter : 'none' }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className={`absolute inset-0 bg-gradient-to-t ${effect.bgGradient} pointer-events-none`}
            />
          )}
        </AnimatePresence>
      </div>
      <div className="px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span style={{ color: effect.accentColor }}>{effect.icon}</span>
          <span className="text-xs font-bold text-white/90">{effect.label}</span>
        </div>
        <span className="text-[10px] text-white/40">{effect.description}</span>
      </div>
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ background: effect.accentColor }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
);
ImagePreviewCard.displayName = 'ImagePreviewCard';

// ─── FloatingPlayButton ───────────────────────────────────────────────────────

interface FloatingPlayButtonProps { isPlaying: boolean; onToggle: () => void; }

const FloatingPlayButton: React.FC<FloatingPlayButtonProps> = ({ isPlaying, onToggle }) => (
  <motion.button
    variants={playButtonVariants}
    initial="initial"
    animate="animate"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.93 }}
    onClick={onToggle}
    aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
    className="relative z-20 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
    style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.10))',
      border: '1.5px solid rgba(255,255,255,0.30)',
      backdropFilter: 'blur(20px)',
    }}
  >
    <AnimatePresence>
      {isPlaying && [0, 1].map((i) => (
        <motion.span
          key={i}
          className="absolute inset-0 rounded-full border border-white/20"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.8 + i * 0.4, opacity: 0 }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}
        />
      ))}
    </AnimatePresence>
    <AnimatePresence mode="wait">
      <motion.span
        key={isPlaying ? 'pause' : 'play'}
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 90 }}
        transition={{ duration: 0.2 }}
        className="text-white"
      >
        {isPlaying
          ? <Pause className="w-6 h-6" fill="white" />
          : <Play className="w-6 h-6 ml-0.5" fill="white" />}
      </motion.span>
    </AnimatePresence>
  </motion.button>
);

// ─── DesktopMonitor ───────────────────────────────────────────────────────────

interface DesktopMonitorProps {
  isPlaying: boolean;
  activeEffectIndex: number;
  onTogglePlay: () => void;
}

const DesktopMonitor: React.FC<DesktopMonitorProps> = ({ isPlaying, activeEffectIndex, onTogglePlay }) => {
  const getImage = (idx: number) => SHOWCASE_IMAGES[idx % SHOWCASE_IMAGES.length];

  return (
    <motion.div
      variants={monitorVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full max-w-4xl mx-auto select-none"
    >
      {/* Bezel */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #1a1e26 0%, #0d1117 100%)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 40px 100px rgba(0,0,0,0.7), 0 8px 30px rgba(16,185,129,0.08)',
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <div className="flex gap-1.5">
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c, i) => (
              <div key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <span className="mx-auto text-[11px] font-semibold text-white/30 tracking-wide">
            Image Effects — Preview Studio
          </span>
          <SlidersHorizontal className="w-3.5 h-3.5 text-white/20" />
        </div>

        {/* Dashboard */}
        <div className="p-4 sm:p-5">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-emerald-400"
                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}
              >
                ● LIVE
              </div>
              <span className="text-[10px] text-white/30 font-mono">
                Effect {activeEffectIndex + 1} / {EFFECTS.length}
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={EFFECTS[activeEffectIndex].id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold"
                style={{
                  background: `${EFFECTS[activeEffectIndex].accentColor}22`,
                  border: `1px solid ${EFFECTS[activeEffectIndex].accentColor}44`,
                  color: EFFECTS[activeEffectIndex].accentColor,
                }}
              >
                {EFFECTS[activeEffectIndex].icon}
                {EFFECTS[activeEffectIndex].label}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {EFFECTS.map((effect, idx) => (
              <ImagePreviewCard
                key={effect.id}
                effect={effect}
                index={idx}
                isActive={idx === activeEffectIndex}
                isPlaying={isPlaying}
                imageUrl={getImage(idx)}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[10px] text-white/20 font-mono w-16 shrink-0">
              {EFFECTS[activeEffectIndex].label}
            </span>
            <div className="flex-1 h-0.5 rounded-full overflow-hidden bg-white/5">
              <motion.div
                className="h-full rounded-full"
                style={{ background: EFFECTS[activeEffectIndex].accentColor }}
                animate={{ width: isPlaying ? '100%' : `${((activeEffectIndex + 1) / EFFECTS.length) * 100}%` }}
                transition={isPlaying ? { duration: 3, ease: 'linear' } : { duration: 0.4 }}
              />
            </div>
            <span className="text-[10px] text-white/20 font-mono w-10 text-right shrink-0">
              {Math.round(((activeEffectIndex + 1) / EFFECTS.length) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Stand */}
      <div className="flex flex-col items-center">
        <div
          className="w-16 h-8"
          style={{
            background: 'linear-gradient(to bottom, #1a1e26, #111418)',
            clipPath: 'polygon(20% 0%, 80% 0%, 95% 100%, 5% 100%)',
          }}
        />
        <div
          className="w-36 h-2.5 rounded-full"
          style={{
            background: 'linear-gradient(to right, transparent, #1e232e, transparent)',
            boxShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}
        />
      </div>

      {/* Floating play button */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20">
        <FloatingPlayButton isPlaying={isPlaying} onToggle={onTogglePlay} />
      </div>

      {/* Ground shadow */}
      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-6 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, transparent 70%)' }}
      />
    </motion.div>
  );
};

// ─── EffectControls ───────────────────────────────────────────────────────────

interface EffectControlsProps { activeIndex: number; onSelect: (i: number) => void; }

const EffectControls: React.FC<EffectControlsProps> = ({ activeIndex, onSelect }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.8, duration: 0.5 }}
    className="flex flex-wrap justify-center gap-2 mt-8"
  >
    {EFFECTS.map((effect, i) => (
      <motion.button
        key={effect.id}
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect(i)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
          transition-all duration-300 border backdrop-blur-sm
          ${activeIndex === i ? 'text-white shadow-lg' : 'text-neutral-500 border-black/10 hover:text-neutral-700 hover:border-black/20'}`}
        style={activeIndex === i ? {
          background: `${effect.accentColor}18`,
          border: `1px solid ${effect.accentColor}55`,
          color: effect.accentColor,
          boxShadow: `0 4px 20px ${effect.accentColor}33`,
        } : {}}
      >
        <span style={activeIndex === i ? { color: effect.accentColor } : { color: '#94A3B8' }}>
          {effect.icon}
        </span>
        {effect.label}
      </motion.button>
    ))}
  </motion.div>
);

// ─── Decorative Plant ─────────────────────────────────────────────────────────

const DecorativePlant: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 1.4, duration: 0.6, type: 'spring' }}
    className="absolute bottom-0 right-6 md:right-10 pointer-events-none hidden sm:block"
    style={{ width: 60, zIndex: 2 }}
  >
    <svg viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="80" width="24" height="18" rx="3" fill="#3D2B1F" />
      <ellipse cx="30" cy="80" rx="13" ry="4" fill="#5C3D2E" />
      <ellipse cx="30" cy="79" rx="11" ry="3" fill="#2D1B0E" />
      <line x1="30" y1="78" x2="30" y2="45" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="22" cy="60" rx="10" ry="5" fill="#388E3C" transform="rotate(-30 22 60)" />
      <ellipse cx="38" cy="55" rx="10" ry="5" fill="#43A047" transform="rotate(30 38 55)" />
      <ellipse cx="24" cy="48" rx="9" ry="4.5" fill="#66BB6A" transform="rotate(-20 24 48)" />
      <ellipse cx="36" cy="44" rx="9" ry="4.5" fill="#4CAF50" transform="rotate(20 36 44)" />
      <ellipse cx="30" cy="40" rx="7" ry="12" fill="#81C784" />
    </svg>
  </motion.div>
);

// ─── Light Sweep ──────────────────────────────────────────────────────────────

const LightSweep: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <motion.div
      className="absolute top-0 w-[60%] h-full"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.035), transparent)',
        transform: 'skewX(-12deg)',
      }}
      animate={{ left: ['-60%', '160%'] }}
      transition={{ duration: 3.5, delay: 0.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 5 }}
    />
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

interface ImageEffectsSectionProps { onBack?: () => void; }

export const ImageEffectsSection: React.FC<ImageEffectsSectionProps> = ({ onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeEffectIndex, setActiveEffectIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-10%' });
  const controls = useAnimation();

  const startCycle = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setActiveEffectIndex((prev) => (prev + 1) % EFFECTS.length);
    }, 3200);
  }, []);

  const stopCycle = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => { if (!prev) startCycle(); else stopCycle(); return !prev; });
  }, [startCycle, stopCycle]);

  const handleSelectEffect = useCallback((i: number) => {
    setActiveEffectIndex(i);
    if (isPlaying) { stopCycle(); startCycle(); }
  }, [isPlaying, startCycle, stopCycle]);

  useEffect(() => { if (isInView) controls.start('visible'); }, [isInView, controls]);
  useEffect(() => () => stopCycle(), [stopCycle]);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.section
      ref={sectionRef}
      variants={bgVariants}
      initial="hidden"
      animate={prefersReducedMotion ? 'visible' : controls}
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(160deg, #F0F2F5 0%, #E8EDF2 40%, #F5F7FA 70%, #EEF0F5 100%)' }}
    >
      <LightSweep />

      {/* Nav bar */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-8 pt-5 pb-3">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/5 hover:bg-black/10 border border-black/10 text-neutral-600 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </motion.button>
        <motion.span
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xs font-bold tracking-widest uppercase text-neutral-400"
        >
          Visual Studio
        </motion.span>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ scale: 1.08, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl bg-black/5 hover:bg-black/10 border border-black/10 text-neutral-600 transition-colors"
          aria-label="Add new effect"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Heading */}
      <div className="relative z-10 text-center px-4 pt-4 pb-8">
        <motion.h1
          variants={headingVariants}
          initial="hidden"
          animate={prefersReducedMotion ? 'visible' : controls}
          className="font-black tracking-tight text-neutral-900 leading-none"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', letterSpacing: '-0.03em' }}
        >
          Image{' '}
          <span
            className="inline-block"
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #D4AF37 50%, #10B981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% auto',
              animation: 'shimmer 3s linear infinite',
            }}
          >
            Effects
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="mt-3 text-sm sm:text-base text-neutral-500 max-w-md mx-auto font-medium"
        >
          Apply cinematic CSS filters in real-time. Click play to begin the showcase.
        </motion.p>
      </div>

      {/* Monitor scene */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 pb-4">
        {/* Ambient glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: '70%', height: '40%',
            background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.08) 0%, rgba(212,175,55,0.05) 50%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="relative w-full max-w-5xl">
          <DesktopMonitor
            isPlaying={isPlaying}
            activeEffectIndex={activeEffectIndex}
            onTogglePlay={handleTogglePlay}
          />
          <DecorativePlant />
        </div>

        <EffectControls activeIndex={activeEffectIndex} onSelect={handleSelectEffect} />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="mt-5 text-[11px] text-neutral-400 text-center"
        >
          {isPlaying
            ? `Now showing: ${EFFECTS[activeEffectIndex].label} — ${EFFECTS[activeEffectIndex].description}`
            : 'Press ▶ to auto-cycle through all effects, or tap a filter above'}
        </motion.p>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(238,240,245,0.9), transparent)' }}
      />
    </motion.section>
  );
};

export default ImageEffectsSection;
