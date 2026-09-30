import React, { useRef, useState, useEffect } from 'react';

interface Props {
  id?: string;
  glowType?: 'pink-violet' | 'dragon-violet' | 'electric-violet' | 'pink-purple' | 'violet' | 'deep-violet';
  children: React.ReactNode;
  className?: string;
}

export const ScrollDrivenSection: React.FC<Props> = ({
  id,
  glowType = 'pink-violet',
  children,
  className = ''
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Section becomes active when ~25% or more is visible in the viewport
          if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
            setIsActive(true);
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.1) {
            setIsActive(false);
          }
        });
      },
      {
        threshold: [0.1, 0.2, 0.35, 0.5, 0.7],
        rootMargin: '-5% 0px -5% 0px'
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Glow gradients matching Section 20 of specification
  const getGlowStyle = () => {
    switch (glowType) {
      case 'dragon-violet': // LIVE HIGHLIGHTS: Dragon Fruit + Violet
        return 'from-[#FF1493]/14 via-[#5B21F5]/14 to-transparent';
      case 'electric-violet': // SPORTS: Electric Violet
        return 'from-[#7C3AED]/18 via-[#5B21F5]/12 to-transparent';
      case 'pink-purple': // CULTURE: pink + purple
        return 'from-[#FF1493]/14 via-[#7C3AED]/14 to-transparent';
      case 'violet': // TALENT: violet
        return 'from-[#5B21F5]/18 via-[#24104F]/25 to-transparent';
      case 'deep-violet': // CTA / FOOTER
        return 'from-[#24104F]/30 via-[#5B21F5]/15 to-transparent';
      case 'pink-violet': // HOME / EVENTS: pink + violet
      default:
        return 'from-[#FF1493]/15 via-[#5B21F5]/15 to-transparent';
    }
  };

  return (
    <div
      ref={sectionRef}
      id={id}
      className={`relative w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${className}`}
      style={
        prefersReducedMotion
          ? { opacity: 1, transform: 'none', filter: 'none' }
          : {
              opacity: isActive ? 1 : 0.52,
              transform: isActive ? 'scale(1.0)' : 'scale(0.985)',
              filter: isActive ? 'brightness(1) blur(0px)' : 'brightness(0.78) blur(0.4px)',
              transition: 'opacity 800ms cubic-bezier(0.22, 1, 0.36, 1), transform 800ms cubic-bezier(0.22, 1, 0.36, 1), filter 800ms cubic-bezier(0.22, 1, 0.36, 1)'
            }
      }
    >
      {/* Active Section Ambient Glow Overlay */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-5xl h-[60%] bg-gradient-to-r ${getGlowStyle()} blur-[140px] rounded-full pointer-events-none transition-opacity duration-1000 ${
          isActive ? 'opacity-100' : 'opacity-20'
        }`}
      />

      {/* Section Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
