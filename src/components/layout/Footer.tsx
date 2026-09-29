import React from 'react';
import { MapPin, Mail, Phone, ShieldCheck } from 'lucide-react';
import { ColoridoLogo } from '../common/ColoridoLogo';

interface Props {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<Props> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#064E52] border-t border-[#20B2AA]/20 text-[#DDF3F0]/80 text-sm mt-16 relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#20B2AA]/15 via-[#006D8F]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Festival Info */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('/')}
              className="cursor-pointer group w-fit"
            >
              <ColoridoLogo variant="inline" theme="dark" size="md" />
            </div>

            <p className="text-[#DDF3F0] font-medium text-sm">
              CULTURE • TALENT • SPORTS — <span className="text-[#20B2AA] font-semibold">“Where Talent Meets the Spotlight”</span>
            </p>
            <p className="text-xs text-[#DDF3F0]/70 leading-relaxed max-w-sm">
              The premier national-level inter-university festival bringing together 5,000+ collegiate artists, athletes, performers, and visionary minds across 16 prestigious championships.
            </p>

            <div className="pt-2 flex flex-col space-y-1.5 text-xs text-[#DDF3F0]/80">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#20B2AA] flex-shrink-0" />
                <span>Central Campus Arena, University Enclave, Tech City</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#38C7BF] flex-shrink-0" />
                <span>secretariat@colorido2k26.edu</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#20B2AA] flex-shrink-0" />
                <span>Emergency Control Room: +91 80 2345 6789 / 6790</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-[#20B2AA] transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-[#20B2AA] transition-colors">
                  About Festival
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/events')} className="hover:text-[#20B2AA] transition-colors">
                  All 16 Events
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/schedule')} className="hover:text-[#20B2AA] transition-colors">
                  Smart Schedule & Conflicts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/register')} className="hover:text-[#20B2AA] transition-colors">
                  Event Registration
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/dashboard')} className="hover:text-[#20B2AA] transition-colors">
                  My Dashboard & Passes
                </button>
              </li>
            </ul>
          </div>

          {/* Festival Highlights */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Festival Central</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/announcements')} className="hover:text-[#20B2AA] transition-colors">
                  Announcements & Notices
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/results')} className="hover:text-[#20B2AA] transition-colors">
                  Live Results & Medals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/leaderboard')} className="hover:text-[#20B2AA] transition-colors">
                  Championship Leaderboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/gallery')} className="hover:text-[#20B2AA] transition-colors">
                  Festival Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/venues')} className="hover:text-[#20B2AA] transition-colors">
                  Campus Venues & Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/sponsors')} className="hover:text-[#20B2AA] transition-colors">
                  Sponsors & Partners
                </button>
              </li>
            </ul>
          </div>

          {/* Administration & Legal */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Portals & Admin</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/admin')} className="text-[#38C7BF] hover:text-[#20B2AA] font-semibold flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#20B2AA]" /> Admin Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin/checkin')} className="hover:text-[#20B2AA] transition-colors">
                  QR Gate Check-in
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-[#20B2AA] transition-colors">
                  Help Desk & Contact Form
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/login')} className="hover:text-[#20B2AA] transition-colors">
                  Participant Sign In
                </button>
              </li>
            </ul>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-10 border-t border-[#20B2AA]/20 flex flex-col sm:flex-row justify-between items-center text-xs text-[#DDF3F0]/60 gap-4">
          <p>© 2026 COLORIDO 2K26 Festival Committee. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Engineered with passion for university excellence</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
