import React from 'react';
import { MapPin, Mail, Phone, ShieldCheck, Sparkles, Heart } from 'lucide-react';
import { ColoridoLogo } from '../common/ColoridoLogo';

interface Props {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<Props> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#05030D] border-t border-[rgba(216,180,254,0.15)] text-[#B9A9D6] text-sm mt-16 relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-[#FF1493]/15 via-[#5B21F5]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-64 h-64 bg-[#7C3AED]/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-64 h-64 bg-[#FF1493]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Festival Info */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('/')}
              className="cursor-pointer group w-fit"
            >
              <ColoridoLogo variant="inline" theme="dark" size="md" />
            </div>

            <p className="text-[#F5F0FF] font-semibold text-sm">
              CULTURE • TALENT • SPORTS — <span className="gradient-text-hero font-bold">“Where Culture, Talent &amp; Sport Come Alive”</span>
            </p>
            <p className="text-xs text-[#B9A9D6] leading-relaxed max-w-sm">
              The premier national-level inter-university festival bringing together 5,000+ collegiate artists, athletes, performers, and visionary minds across 16 prestigious championships.
            </p>

            <div className="pt-2 flex flex-col space-y-2 text-xs text-[#B9A9D6]">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#FF1493] flex-shrink-0" />
                <span>Central Campus Arena, University Enclave, Tech City</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#D8B4FE] flex-shrink-0" />
                <span>secretariat@colorido2k26.edu</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#FF2B9A] flex-shrink-0" />
                <span>Emergency Control Room: +91 80 2345 6789 / 6790</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF1493]" />
              <span>Navigation</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-[#FF2B9A] transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-[#FF2B9A] transition-colors">
                  About Festival
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/events')} className="hover:text-[#FF2B9A] transition-colors">
                  All 16 Events
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/schedule')} className="hover:text-[#FF2B9A] transition-colors">
                  Smart Schedule &amp; Conflicts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/register')} className="hover:text-[#FF2B9A] transition-colors">
                  Event Registration
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/dashboard')} className="hover:text-[#FF2B9A] transition-colors">
                  My Dashboard &amp; Passes
                </button>
              </li>
            </ul>
          </div>

          {/* Festival Highlights */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
              <span>Festival Central</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/announcements')} className="hover:text-[#D8B4FE] transition-colors">
                  Announcements &amp; Notices
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/results')} className="hover:text-[#D8B4FE] transition-colors">
                  Live Results &amp; Medals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/leaderboard')} className="hover:text-[#D8B4FE] transition-colors">
                  Championship Leaderboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/gallery')} className="hover:text-[#D8B4FE] transition-colors">
                  Festival Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/venues')} className="hover:text-[#D8B4FE] transition-colors">
                  Campus Venues &amp; Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/sponsors')} className="hover:text-[#D8B4FE] transition-colors">
                  Sponsors &amp; Partners
                </button>
              </li>
            </ul>
          </div>

          {/* Portals & Admin */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B21F5]" />
              <span>Portals &amp; Staff</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/admin')} className="text-[#D8B4FE] hover:text-[#FF2B9A] font-semibold flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#FF1493]" /> Admin Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin/checkin')} className="hover:text-[#D8B4FE] transition-colors">
                  QR Gate Check-in
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-[#D8B4FE] transition-colors">
                  Help Desk &amp; Contact Form
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/login')} className="hover:text-[#D8B4FE] transition-colors">
                  Participant Sign In
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-10 border-t border-[rgba(216,180,254,0.12)] flex flex-col sm:flex-row justify-between items-center text-xs text-[#7A6A9A] gap-4">
          <p>© 2026 COLORIDO 2K26 Festival Committee. All rights reserved.</p>
          <p className="flex items-center space-x-1 text-[#B9A9D6]">
            <span>Crafted for national-level sporting and cultural excellence</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
