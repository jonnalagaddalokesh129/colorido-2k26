import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Search, 
  Bell, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut, 
  ChevronDown, 
  Calendar, 
  Trophy, 
  QrCode,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { ColoridoLogo } from '../common/ColoridoLogo';

interface Props {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  onOpenDbStatus: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentPath,
  onNavigate,
  onOpenSearch,
  onLogout
}) => {
  const { user, isAuthenticated, isAdmin, isCoordinator, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const navBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  /* Fixed Institutional Header + Navigation: dynamically measure and publish --header-height */
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.offsetHeight;
        if (height > 0) {
          document.documentElement.style.setProperty('--header-height', `${height}px`);
        }
      }
    };

    updateHeaderHeight();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(updateHeaderHeight);
      ro.observe(containerRef.current);
    }

    window.addEventListener('resize', updateHeaderHeight);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  /* Close all dropdowns when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
        setNotifDropdownOpen(false);
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Primary navigation links */
  const primaryNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Sports', path: '/sports' },
    { name: 'Culture', path: '/culture' },
    { name: 'Talent', path: '/talent' },
    { name: 'Events', path: '/events' },
    { name: 'Highlights', path: '/highlights' },
    { name: 'About', path: '/about' },
  ];

  /* Active route helper ensuring precise active states */
  const isLinkActive = (path: string, name: string) => {
    if (name === 'Home') return currentPath === '/';
    if (name === 'Highlights') return currentPath === '/highlights' || currentPath.startsWith('/highlights');
    if (name === 'Sports') return currentPath === '/sports' || currentPath.includes('category=sports') || currentPath.includes('category=SPORTS');
    if (name === 'Culture') return currentPath === '/culture' || currentPath.includes('category=cultural') || currentPath.includes('category=CULTURAL');
    if (name === 'Talent') return currentPath === '/talent';
    if (name === 'Events') return currentPath === '/events' && !currentPath.includes('category=');
    if (name === 'About') return currentPath === '/about';
    return currentPath === path;
  };

  const moreNavLinks = [
    { name: 'Schedule', path: '/schedule' },
    { name: 'Results', path: '/results' },
    { name: 'Announcements', path: '/announcements' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Venues', path: '/venues' },
    { name: 'Sponsors', path: '/sponsors' },
    { name: 'Contact', path: '/contact' },
    { name: 'My Dashboard', path: '/dashboard' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setNotifDropdownOpen(false);
    setMoreDropdownOpen(false);
  };

  return (
    <header 
      ref={containerRef} 
      className="w-full fixed top-0 left-0 right-0 z-40 bg-[#05030D]/95 backdrop-blur-md select-none border-b border-[rgba(216,180,254,0.12)] shadow-[0_10px_35px_rgba(5,3,13,0.85)]"
    >
      
      {/* ========================================================================= */}
      {/* 1. TOP INSTITUTIONAL HEADER: R.V.R. & J.C. COLLEGE OF ENGINEERING         */}
      {/* ========================================================================= */}
      <div className="relative w-full bg-[#05030D] border-b border-[rgba(216,180,254,0.08)] overflow-hidden py-3 px-3 sm:px-6">
        {/* Subtle Violet and Magenta Radial Background Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-28 bg-[#5B21F5]/10 blur-[80px] pointer-events-none rounded-full" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-28 bg-[#FF1493]/10 blur-[80px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 relative z-10">
          
          {/* Left: Official College Crest Logo */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="p-1.5 rounded-2xl bg-[#080514]/90 border border-[rgba(216,180,254,0.22)] shadow-[0_0_15px_rgba(91,33,245,0.2)] hover:border-[#FF1493]/50 transition-all duration-300">
              <img
                src="/rvrjc_crest_trans.png"
                alt="R.V.R. & J.C. College of Engineering Logo"
                className="h-14 sm:h-16 md:h-18 w-auto object-contain drop-shadow-[0_2px_8px_rgba(255,20,147,0.2)]"
              />
            </div>
            
            {/* Accreditation Badges on Left (Desktop) */}
            <div className="hidden xl:flex items-center p-1.5 rounded-xl bg-[#080514]/70 border border-[rgba(216,180,254,0.14)]">
              <img
                src="/rvrjc_acc_left_trans.png"
                alt="Accreditations: AICTE, NAAC A+, NBA"
                className="h-8 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>

          {/* Center: Institutional Typography & Sponsoring Information */}
          <div className="text-center space-y-1 flex-1 min-w-0 px-1 sm:px-4">
            {/* Main College Title */}
            <h1 className="font-display font-black text-lg sm:text-2xl md:text-2xl lg:text-3xl text-[#F5F0FF] tracking-tight leading-tight drop-shadow-[0_0_15px_rgba(255,20,147,0.25)]">
              R.V.R. &amp; J.C. COLLEGE OF ENGINEERING
            </h1>

            {/* Status & Autonomous Tag */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
              <span className="font-extrabold uppercase tracking-widest text-[#FF2B9A] drop-shadow-[0_0_8px_rgba(255,43,154,0.4)]">
                (AUTONOMOUS)
              </span>
              <span className="text-[#D8B4FE]/40">•</span>
              <span className="font-medium text-[#D8B4FE]">
                Sponsored by Nagarjuna Education Society
              </span>
            </div>

            {/* University Affiliation */}
            <p className="text-[10px] sm:text-[11px] text-[#B9A9D6] font-medium tracking-wide">
              Affiliated to Acharya Nagarjuna University
            </p>

            {/* Mobile/Tablet Accreditation Logos Strip */}
            <div className="flex xl:hidden items-center justify-center gap-2 pt-1">
              <img
                src="/rvrjc_acc_left_trans.png"
                alt="Accreditations"
                className="h-6 w-auto object-contain opacity-85"
              />
              <img
                src="/rvrjc_acc_right_trans.png"
                alt="Affiliations"
                className="h-6 w-auto object-contain opacity-85"
              />
            </div>
          </div>

          {/* Right: Accreditations, EAPCET Code Badge & 41 Years Celebration Logo */}
          <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
            {/* Right Accreditations (TUV SUD, ARIIA, IIC) - Desktop */}
            <div className="hidden xl:flex items-center p-1.5 rounded-xl bg-[#080514]/70 border border-[rgba(216,180,254,0.14)]">
              <img
                src="/rvrjc_acc_right_trans.png"
                alt="Accreditations: TUV SUD, ARIIA, IIC"
                className="h-8 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>

            {/* Official EAPCET Code RVJC Badge */}
            <div className="flex flex-col items-center">
              <div className="px-3 py-1 rounded-xl bg-[#10051D] border border-[#7C3AED]/50 shadow-[0_0_12px_rgba(124,58,237,0.3)] text-center">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#B9A9D6] block">Code</span>
                <span className="text-xs sm:text-sm font-black font-mono tracking-wider text-white block">
                  RVJC
                </span>
              </div>
            </div>

            {/* 41 Years Celebration Emblem */}
            <div className="p-1 rounded-2xl bg-[#080514]/90 border border-[rgba(216,180,254,0.22)] shadow-[0_0_20px_rgba(255,20,147,0.25)] hover:border-[#FF1493] transition-all duration-300">
              <img
                src="/rvrjc_41years_badge.png"
                alt="Celebrating 41 Years of Academic Excellence"
                className="h-12 sm:h-14 md:h-16 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]"
              />
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. SUBTLE NEON SEPARATOR: linear-gradient(90deg, transparent, #FF1493, #7C3AED, #FF1493, transparent) */}
        {/* ========================================================================= */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[1.5px] pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, #FF1493 20%, #7C3AED 50%, #FF1493 80%, transparent)'
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 3. COLORIDO 2K26 NAVIGATION BAR (Consistent Pill Across All Routes)        */}
      {/* ========================================================================= */}
      <div 
        ref={navBarRef}
        className="w-full relative py-2 sm:py-2.5 pointer-events-auto z-50"
        style={{ boxSizing: 'border-box' }}
      >
        <div 
          className="mx-auto rounded-[18px] transition-all duration-300"
          style={{
            width: 'min(1280px, calc(100% - 24px))',
            maxWidth: '1280px',
            margin: '0 auto',
            boxSizing: 'border-box',
            padding: '8px 14px',
            borderRadius: '18px',
            background: 'rgba(8, 5, 20, 0.82)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(255, 20, 147, 0.35)',
            boxShadow: '0 10px 40px rgba(91, 33, 245, 0.20)',
            overflow: 'visible'
          }}
        >
          {/* ── DESKTOP NAVIGATION BAR (xl:grid >= 1180px) ── */}
          <div 
            className="hidden xl:grid items-center w-full min-w-0"
            style={{
              gridTemplateColumns: 'auto 1fr auto',
              gap: 'clamp(8px, 1.2vw, 18px)'
            }}
          >
            {/* LEFT: COLORIDO LOGO */}
            <div
              onClick={() => handleLinkClick('/')}
              className="cursor-pointer group flex-shrink-0 flex items-center space-x-2 transition-transform duration-300 hover:scale-102"
            >
              <div className="relative">
                <ColoridoLogo variant="inline" size="sm" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF1493]/0 via-[#FF1493]/15 to-[#7C3AED]/0 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>

            {/* CENTER: PRIMARY NAVIGATION LINKS */}
            <nav 
              className="flex items-center justify-center min-w-0"
              style={{ gap: 'clamp(4px, 0.8vw, 14px)' }}
            >
              {primaryNavLinks.map(link => {
                const isActive = isLinkActive(link.path, link.name);
                return (
                  <button
                    key={link.name}
                    onClick={() => handleLinkClick(link.path)}
                    className={`relative px-2.5 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap flex-shrink-0 group ${
                      isActive
                        ? 'text-[#FF1493] bg-[#FF1493]/12 shadow-[0_0_12px_rgba(255,20,147,0.25)]'
                        : 'text-[#F5F0FF] hover:text-[#FF2B9A] hover:bg-[#7C3AED]/15'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <span 
                        className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full shadow-[0_0_8px_#FF1493]"
                        style={{ background: 'linear-gradient(90deg, #FF1493, #7C3AED)' }}
                      />
                    )}
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#FF1493] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
                  </button>
                );
              })}

              {/* More Dropdown */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => {
                    setMoreDropdownOpen(!moreDropdownOpen);
                    setUserDropdownOpen(false);
                    setNotifDropdownOpen(false);
                  }}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 ${
                    moreNavLinks.some(l => currentPath === l.path)
                      ? 'text-[#FF1493] bg-[#FF1493]/12'
                      : 'text-[#D8B4FE] hover:text-white hover:bg-[#7C3AED]/15'
                  }`}
                >
                  <span>More</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-52 rounded-2xl bg-[#10051D] border border-[rgba(216,180,254,0.2)] shadow-[0_20px_50px_rgba(91,33,245,0.35)] p-2 z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                    {moreNavLinks.map(link => (
                      <button
                        key={link.path}
                        onClick={() => handleLinkClick(link.path)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                          currentPath === link.path
                            ? 'bg-[#FF1493]/20 text-[#FF2B9A] font-bold border border-[#FF1493]/30'
                            : 'text-[#B9A9D6] hover:bg-[#7C3AED]/20 hover:text-white'
                        }`}
                      >
                        <span>{link.name}</span>
                        {currentPath === link.path && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF1493] shadow-[0_0_6px_#FF1493]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* RIGHT: UTILITY CONTROLS */}
            <div className="flex items-center justify-end gap-2 sm:gap-2.5 flex-shrink-0">
              {/* Search Shortcut */}
              <button
                onClick={onOpenSearch}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-[#10051D]/90 hover:bg-[#10051D] border border-[rgba(216,180,254,0.18)] hover:border-[#FF1493]/40 text-[#B9A9D6] hover:text-white transition-all text-xs flex-shrink-0"
                style={{ width: 'clamp(100px, 8.5vw, 135px)' }}
                title="Search festival events, venues, results (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-[#FF1493] flex-shrink-0" />
                <span className="truncate text-[11px]">Search...</span>
                <kbd className="ml-auto hidden 2xl:inline-block px-1 py-0.5 text-[8px] font-mono bg-black/40 rounded border border-[#D8B4FE]/20 text-[#B9A9D6]">
                  ⌘K
                </kbd>
              </button>

              {/* Notification Bell */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => {
                    setNotifDropdownOpen(!notifDropdownOpen);
                    setUserDropdownOpen(false);
                    setMoreDropdownOpen(false);
                  }}
                  className="relative w-8 h-8 rounded-xl bg-[#10051D]/90 hover:bg-[#10051D] border border-[rgba(216,180,254,0.18)] hover:border-[#FF1493]/40 text-[#B9A9D6] hover:text-[#FF1493] flex items-center justify-center transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="w-3.5 h-3.5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FF1493] text-[9px] font-bold text-white shadow-md shadow-[#FF1493]/50 animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Popover */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 max-w-[calc(100vw-32px)] rounded-2xl bg-[#10051D] border border-[rgba(216,180,254,0.2)] shadow-[0_20px_60px_rgba(91,33,245,0.4)] p-4 text-[#F5F0FF] z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-3 border-b border-[#D8B4FE]/15">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4 text-[#FF1493]" />
                        <span className="font-bold text-sm text-[#F5F0FF]">Notifications &amp; Reminders</span>
                        <span className="text-xs px-2 py-0.5 bg-[#FF1493]/20 rounded-full font-mono text-[#FF2B9A] font-bold border border-[#FF1493]/30">
                          {notifications.length}
                        </span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-[#D8B4FE] hover:text-[#FF2B9A] font-semibold transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2 py-2 custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="text-center py-6 text-[#B9A9D6] text-xs">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.slice(0, 6).map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markAsRead(n.id);
                              if (n.action_url) handleLinkClick(n.action_url);
                            }}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                              n.is_read
                                ? 'bg-[#080514]/60 border-[rgba(216,180,254,0.1)] opacity-70'
                                : 'bg-[#10051D] border-[#FF1493]/40 shadow-sm shadow-[#FF1493]/10'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-[#F5F0FF]">{n.title}</span>
                              <span className="text-[10px] text-[#B9A9D6]">
                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[#B9A9D6] leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown / Login */}
              {isAuthenticated && user ? (
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                      setNotifDropdownOpen(false);
                      setMoreDropdownOpen(false);
                    }}
                    className="flex items-center space-x-1.5 p-1 sm:px-2 sm:py-1 rounded-xl border border-[rgba(216,180,254,0.18)] hover:border-[#7C3AED]/50 bg-[#10051D]/80 hover:bg-[#10051D] transition-colors"
                  >
                    <img
                      src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.full_name)}`}
                      alt={user.full_name}
                      className="w-6 h-6 rounded-full object-cover border border-[#FF1493]"
                    />
                    <div className="hidden 2xl:block text-left text-xs leading-none">
                      <p className="font-bold text-[#F5F0FF] truncate max-w-[80px]">{user.full_name.split(' ')[0]}</p>
                      <p className="text-[9px] capitalize font-semibold text-[#D8B4FE]">{user.role}</p>
                    </div>
                    <ChevronDown className="w-3 h-3 text-[#B9A9D6]" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-72 max-w-[calc(100vw-32px)] rounded-2xl bg-[#10051D] border border-[rgba(216,180,254,0.2)] shadow-[0_20px_60px_rgba(91,33,245,0.4)] p-3 z-50 text-[#F5F0FF] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                      <div className="rounded-xl border border-[#FF1493]/30 mb-2 bg-[#080514] p-3">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.full_name)}`}
                            alt={user.full_name}
                            className="w-9 h-9 rounded-full object-cover border-2 border-[#FF1493]"
                          />
                          <div className="min-w-0">
                            <p className="font-extrabold text-sm text-[#F5F0FF] truncate">{user.full_name}</p>
                            <p className="text-[10px] text-[#B9A9D6] truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {isAdmin ? (
                          <button
                            onClick={() => handleLinkClick('/admin')}
                            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#D8B4FE] hover:bg-[#7C3AED]/20 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-[#FF1493]" />
                            <span>Admin Hub</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleLinkClick('/dashboard')}
                            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#B9A9D6] hover:bg-[#7C3AED]/20 hover:text-white transition-colors"
                          >
                            <User className="w-4 h-4 text-[#FF1493]" />
                            <span>My Dashboard &amp; Passes</span>
                          </button>
                        )}
                      </div>

                      <div className="pt-2 mt-2 border-t border-[#D8B4FE]/15">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                            onLogout?.();
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleLinkClick('/login')}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#D8B4FE] hover:text-white bg-[#7C3AED]/15 hover:bg-[#7C3AED]/30 border border-[#D8B4FE]/20 transition-colors flex-shrink-0"
                >
                  Login
                </button>
              )}

              {/* REGISTER NOW Button */}
              <button
                onClick={() => handleLinkClick('/register')}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-white transition-all duration-300 hover:scale-102 active:scale-98 flex items-center space-x-1.5 flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #FF1493, #7C3AED)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  boxShadow: '0 0 20px rgba(255, 20, 147, 0.35)'
                }}
              >
                <span>REGISTER NOW</span>
                <ArrowRight className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>

          {/* ── TABLET & MOBILE NAVIGATION BAR (xl:hidden < 1180px) ── */}
          <div className="flex xl:hidden items-center justify-between w-full min-w-0">
            {/* Left: COLORIDO 2K26 Logo */}
            <div 
              onClick={() => handleLinkClick('/')}
              className="cursor-pointer flex items-center space-x-2 flex-shrink-0 group"
            >
              <ColoridoLogo variant="inline" size="sm" />
            </div>

            {/* Right: Compact Search + Bell + Register + Hamburger */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={onOpenSearch}
                className="w-8 h-8 rounded-xl bg-[#10051D] border border-[rgba(216,180,254,0.18)] hover:border-[#FF1493]/40 text-[#B9A9D6] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Search festival"
              >
                <Search className="w-3.5 h-3.5 text-[#FF1493]" />
              </button>

              <button
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  setUserDropdownOpen(false);
                }}
                className="relative w-8 h-8 rounded-xl bg-[#10051D] border border-[rgba(216,180,254,0.18)] hover:border-[#FF1493]/40 text-[#B9A9D6] hover:text-[#FF1493] flex items-center justify-center transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FF1493] text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleLinkClick('/register')}
                className="hidden sm:inline-flex px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider text-white flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #FF1493, #7C3AED)',
                  border: '1px solid rgba(255, 255, 255, 0.25)'
                }}
              >
                Register
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-8 h-8 rounded-xl bg-[#10051D] border border-[rgba(216,180,254,0.25)] hover:border-[#FF1493] text-white hover:text-[#FF1493] flex items-center justify-center transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4 text-[#FF2B9A]" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MOBILE DRAWER NAVIGATION                                               */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden flex">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative flex flex-col w-[85vw] max-w-[340px] h-full bg-[#080514] border-r border-[rgba(216,180,254,0.2)] shadow-2xl z-10 overflow-hidden animate-in slide-in-from-left duration-250">
            {/* Drawer Header with College Crest & COLORIDO branding */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#D8B4FE]/15 bg-[#10051D] flex-shrink-0">
              <div className="flex items-center space-x-2">
                <img
                  src="/rvrjc_crest_trans.png"
                  alt="RVRJC"
                  className="h-8 w-auto object-contain"
                />
                <span className="font-display font-black text-sm text-white">
                  COLORIDO 2K26
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#F5F0FF] transition-colors"
              >
                <X className="w-5 h-5 text-[#FF2B9A]" />
              </button>
            </div>

            {/* Quick Actions in Drawer */}
            <div className="p-3 border-b border-[#D8B4FE]/10 grid grid-cols-2 gap-2">
              <button
                onClick={() => handleLinkClick('/register')}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-center text-white shadow-md shadow-[#FF1493]/30"
                style={{ background: 'linear-gradient(135deg, #FF1493, #7C3AED)' }}
              >
                Register Now
              </button>
              <button
                onClick={() => handleLinkClick('/events')}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-center text-[#F5F0FF] bg-[#10051D] border border-[rgba(216,180,254,0.25)]"
              >
                Explore Events
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#7A6A9A] px-2 mb-2">Navigation</p>
              {primaryNavLinks.map(link => {
                const isActive = isLinkActive(link.path, link.name);
                return (
                  <button
                    key={link.name}
                    onClick={() => handleLinkClick(link.path)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-[#FF1493]/20 text-[#FF2B9A] border border-[#FF1493]/40 font-bold'
                        : 'text-[#B9A9D6] hover:bg-[#7C3AED]/20 hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#FF1493] shadow-[0_0_8px_#FF1493]" />}
                  </button>
                );
              })}

              <div className="pt-3 border-t border-[#D8B4FE]/10 mt-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#7A6A9A] px-2 mb-2">Festival Features</p>
                {moreNavLinks.map(link => (
                  <button
                    key={link.name}
                    onClick={() => handleLinkClick(link.path)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#B9A9D6] hover:text-white hover:bg-white/5 transition-all"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-[#D8B4FE]/15 bg-[#10051D] flex-shrink-0">
              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); onLogout?.(); }}
                  className="w-full py-2 px-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-xs flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => handleLinkClick('/login')}
                  className="w-full py-2 px-3 rounded-xl bg-[#7C3AED]/20 text-[#D8B4FE] border border-[#7C3AED]/40 text-xs font-bold"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
