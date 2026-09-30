import React from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Trophy, 
  Activity, 
  Flame, 
  Calendar,
  Share2
} from 'lucide-react';
import { LiveHighlightsSection } from '../components/home/LiveHighlightsSection';
import { EventHighlightsStories } from '../components/home/EventHighlightsStories';

interface Props {
  onNavigate: (path: string) => void;
}

export const HighlightsPage: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#05030D] text-[#F5F0FF] overflow-hidden pb-24 selection:bg-[#FF1493]/30 selection:text-white">
      
      {/* ── Page Atmospheric Background Gradients ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute top-0 left-1/4 w-[600px] h-[400px] blur-[140px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #FF1493 0%, transparent 70%)' }}
        />
        <div 
          className="absolute top-1/3 right-10 w-[600px] h-[500px] blur-[150px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #5B21F5 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-10 left-1/3 w-[500px] h-[400px] blur-[130px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 space-y-16">
        
        {/* ── Page Header / Hero Banner ── */}
        <section className="relative pt-12 sm:pt-16 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
          
          {/* Breadcrumb / Back button */}
          <div className="flex items-center justify-between border-b border-[rgba(216,180,254,0.12)] pb-4">
            <button
              onClick={() => onNavigate('/')}
              className="inline-flex items-center space-x-2 text-xs font-bold text-[#D8B4FE] hover:text-[#FF2B9A] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </button>

            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#10051D] border border-[#FF1493]/35 text-[11px] font-bold text-[#FF2B9A] shadow-xs">
              <Activity className="w-3.5 h-3.5 text-[#FF1493] animate-pulse" />
              <span>Live Festival Telemetry</span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#10051D]/90 border border-[#7C3AED]/40 text-xs font-bold text-[#D8B4FE] backdrop-blur-md">
              <Trophy className="w-3.5 h-3.5 text-[#FF1493]" />
              <span>National Championship Highlights</span>
            </div>
            
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-[#F5F0FF] tracking-tight leading-tight">
              COLORIDO <span className="gradient-text-hero">HIGHLIGHTS</span>
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-[#B9A9D6] leading-relaxed max-w-2xl mx-auto font-normal">
              Experience the pulse of COLORIDO 2K26. From explosive super-league powerplays to thunderous cultural stages, explore the defining moments of inter-university supremacy.
            </p>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/events?category=sports')}
              className="btn-primary-neon text-xs px-5 py-2.5 rounded-xl font-bold flex items-center space-x-1.5"
            >
              <span>Explore All Sports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('/events?category=cultural')}
              className="btn-secondary-neon text-xs px-5 py-2.5 rounded-xl font-bold flex items-center space-x-1.5"
            >
              <span>Cultural Arts Enclave</span>
            </button>
            <button
              onClick={() => onNavigate('/gallery')}
              className="px-4 py-2.5 rounded-xl bg-[#10051D] hover:bg-[#10051D]/80 border border-[rgba(216,180,254,0.2)] text-xs font-bold text-[#D8B4FE] hover:text-white transition-all"
            >
              <span>Photo Gallery</span>
            </button>
          </div>
        </section>

        {/* ── 3D Rotating Sports Carousel: Cricket -> Football -> Basketball -> Badminton -> Athletics ── */}
        <section className="relative">
          <LiveHighlightsSection onNavigate={onNavigate} />
        </section>

        {/* ── Stories & Highlights Grid ── */}
        <section className="relative">
          <EventHighlightsStories onNavigate={onNavigate} />
        </section>

        {/* ── Bottom Call To Action ── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="p-8 sm:p-12 rounded-3xl text-center relative overflow-hidden border border-[rgba(216,180,254,0.25)] shadow-[0_20px_60px_rgba(91,33,245,0.3)]"
            style={{
              background: 'linear-gradient(135deg, rgba(36, 16, 79, 0.85) 0%, rgba(16, 5, 29, 0.95) 50%, rgba(91, 33, 245, 0.3) 100%)',
              backdropFilter: 'blur(20px)'
            }}
          >
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#FF1493]/15 blur-3xl pointer-events-none rounded-full" />
            
            <div className="relative z-10 space-y-4 max-w-xl mx-auto">
              <span className="text-xs font-black uppercase tracking-widest text-[#FF2B9A] px-3 py-1 rounded-full bg-[#FF1493]/10 border border-[#FF1493]/30">
                Join the Action
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
                Ready to make your own championship highlights?
              </h2>
              <p className="text-xs sm:text-sm text-[#D8B4FE] leading-relaxed">
                Registrations are currently open for all 16 sports and cultural disciplines. Secure your institutional pass today.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => onNavigate('/register')}
                  className="btn-primary-neon px-6 py-3 rounded-xl font-extrabold text-xs shadow-lg"
                >
                  Register Online Now &rarr;
                </button>
                <button
                  onClick={() => window.open('/certificate.html', '_blank')}
                  className="px-6 py-3 rounded-xl font-extrabold text-xs shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105"
                >
                  Download Certificate 🎓
                </button>
                <button
                  onClick={() => onNavigate('/')}
                  className="btn-secondary-neon px-5 py-3 rounded-xl font-bold text-xs"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
