import React from 'react';
import { Sparkles, Trophy, Users, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';

interface Props {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#20B2AA]/15 border border-[#20B2AA]/30 text-[#006D8F] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Legacy &amp; Vision</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-[#064E52] tracking-tight leading-tight">
          Where Talent Meets the Spotlight
        </h1>
        <p className="text-xs sm:text-base text-[#006D8F] max-w-2xl mx-auto leading-relaxed">
          Founded as an inter-university celebration of creative spirit and athletic vigor, COLORIDO 2K26 is now the country's hallmark annual stage for collegiate excellence.
        </p>
      </div>

      {/* Legacy & Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#12172F] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-fuchsia-600/20 text-fuchsia-400 flex items-center justify-center font-bold text-xl">
            🎭
          </div>
          <h3 className="font-bold text-lg text-white">Cultural Heritage</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            From classical Bharatnatyam to blazing modern rock bands and experimental digital tech art, COLORIDO nurtures the rich polyphony of collegiate artistic expression.
          </p>
        </div>

        <div className="bg-[#12172F] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-sky-600/20 text-sky-400 flex items-center justify-center font-bold text-xl">
            🏆
          </div>
          <h3 className="font-bold text-lg text-white">Athletic Integrity</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Professional federated referees, international-spec wooden and acrylic synthetic courts, and rigorous knockout fixtures upholding true sporting honor.
          </p>
        </div>

        <div className="bg-[#12172F] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xl">
            🤝
          </div>
          <h3 className="font-bold text-lg text-white">Youth Fellowship</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Forging lifelong bonds across 60+ universities and 8 states. A student-powered ecosystem designed by students, for students.
          </p>
        </div>
      </div>

      {/* Patron Messages */}
      <div className="bg-gradient-to-r from-[#12172F] via-[#1A2142] to-[#12172F] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-400">Patron's Address</span>
          <h2 className="text-2xl font-bold text-white">Message from the University Leadership</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10 text-xs text-slate-300">
          <div className="space-y-3 pr-0 md:pr-6">
            <p className="italic leading-relaxed">
              "COLORIDO is not merely an annual competition; it is a canvas of youth ambition. Here, technical rigor meets uninhibited creative soul. We invite every student contingent to bring their utmost brilliance and celebrate the unifying power of arts and sports."
            </p>
            <div>
              <strong className="text-white block font-bold text-sm">Dr. Arvind Sharma</strong>
              <span className="text-fuchsia-400">Festival Convener & Dean of Academic Initiatives</span>
            </div>
          </div>

          <div className="space-y-3 pt-6 md:pt-0 pl-0 md:pl-6">
            <p className="italic leading-relaxed">
              "To every dancer, singer, debater, and athlete traveling to our campus: our stage is your arena. Compete with fiercest determination, celebrate your peers, and carry back memories that inspire your entire academic voyage."
            </p>
            <div>
              <strong className="text-white block font-bold text-sm">Prof. Sunita Rao</strong>
              <span className="text-sky-400">Dean of Student Affairs & Patron</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white">Ready to join COLORIDO 2K26?</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => onNavigate('/events')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            Explore All 16 Events &rarr;
          </button>
          <button
            onClick={() => onNavigate('/schedule')}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-colors"
          >
            Check Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
