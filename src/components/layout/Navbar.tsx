import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Search, 
  Bell, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  Database, 
  LogOut, 
  ChevronDown, 
  CheckCircle2, 
  Calendar, 
  Trophy, 
  QrCode,
  Flame
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { isSupabaseConfigured } from '../../lib/supabase';
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
  onOpenDbStatus,
  onLogout
}) => {
  const { user, isAuthenticated, isAdmin, isCoordinator, logout, switchDemoUser } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);

  /* Close all dropdowns when clicking outside the navigation header */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
        setNotifDropdownOpen(false);
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryNavLinks = [
    { name: 'HOME', path: '/' },
    { name: 'EVENTS', path: '/events' },
    { name: 'SCHEDULE', path: '/schedule' },
    { name: 'REGISTRATION', path: '/register' },
    { name: 'RESULTS', path: '/results' },
    { name: 'GALLERY', path: '/gallery' },
  ];

  const moreNavLinks = [
    { name: 'ABOUT', path: '/about' },
    { name: 'ANNOUNCEMENTS', path: '/announcements' },
    { name: 'LEADERBOARD', path: '/leaderboard' },
    { name: 'SPONSORS', path: '/sponsors' },
    { name: 'VENUES', path: '/venues' },
    { name: 'CONTACT', path: '/contact' },
    { name: 'MY DASHBOARD', path: '/dashboard' },
  ];

  const allNavLinks = [...primaryNavLinks, ...moreNavLinks];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setNotifDropdownOpen(false);
    setMoreDropdownOpen(false);
  };

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/95 border-b border-[#006D8F]/15 shadow-xs transition-all duration-300">
        {/* Top Mini Bar for University Announcement & Active User Indicator */}
        <div className="bg-[#DDF3F0] border-b border-[#006D8F]/15 py-1.5 px-4 text-xs text-[#064E52]">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-2 min-w-0">
            <div className="flex items-center space-x-2 text-[#064E52] min-w-0 overflow-hidden font-medium">
              <span className="flex h-2 w-2 relative flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#20B2AA] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#20B2AA]"></span>
              </span>
              <span className="hidden sm:inline font-semibold truncate text-[#064E52]">
                National Level Cultural &amp; Sports Festival
              </span>
              <span className="text-[#006D8F] font-bold hidden md:inline truncate">
                “Where Talent Meets the Spotlight”
              </span>
            </div>

            <div className="flex items-center space-x-2 text-[11px] flex-shrink-0">
              {user && (
                <div className="flex items-center space-x-1.5 min-w-0">
                  <span className="text-[#4A6B6D] font-medium hidden sm:inline">Active User:</span>
                  <span className="font-bold text-[#064E52] truncate max-w-[70px] sm:max-w-none">{user.full_name.split(' ')[0]}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#20B2AA]/20 text-[#064E52] border border-[#20B2AA]/40 flex-shrink-0">
                    {user.role}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-24 gap-2 sm:gap-4 min-w-0">
            {/* Festival Logo & Brand */}
            <div
              onClick={() => handleLinkClick('/')}
              className="cursor-pointer group flex-shrink-0"
            >
              <ColoridoLogo variant="inline" size="md" />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {primaryNavLinks.map(link => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleLinkClick(link.path)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 relative whitespace-nowrap ${
                      isActive
                        ? 'text-[#006D8F] bg-[#DDF3F0] shadow-xs'
                        : 'text-[#064E52] hover:text-[#006D8F] hover:bg-[#DDF3F0]/60'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-[#20B2AA] to-[#006D8F] rounded-full" />
                    )}
                  </button>
                );
              })}

              {/* MORE Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    setMoreDropdownOpen(!moreDropdownOpen);
                    setUserDropdownOpen(false);
                    setNotifDropdownOpen(false);
                  }}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 ${
                    moreNavLinks.some(l => l.path === currentPath)
                      ? 'text-[#006D8F] bg-[#DDF3F0]'
                      : 'text-[#064E52] hover:text-[#006D8F] hover:bg-[#DDF3F0]/60'
                  }`}
                >
                  <span>MORE</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-52 rounded-2xl bg-white border border-[#006D8F]/20 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {moreNavLinks.map(link => (
                      <button
                        key={link.path}
                        onClick={() => handleLinkClick(link.path)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                          currentPath === link.path
                            ? 'bg-[#DDF3F0] text-[#006D8F] font-bold'
                            : 'text-[#064E52] hover:bg-[#DDF3F0]/50 hover:text-[#006D8F]'
                        }`}
                      >
                        <span>{link.name}</span>
                        {currentPath === link.path && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#20B2AA]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Action Tools: Search, Notification Bell, Auth Menu */}
            <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
              {/* Global Search Button — desktop/tablet only */}
              <button
                onClick={onOpenSearch}
                className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#DDF3F0]/70 hover:bg-[#DDF3F0] border border-[#006D8F]/20 text-[#064E52] transition-all text-xs font-medium"
                title="Search festival events, venues, results (Ctrl+K)"
              >
                <Search className="w-4 h-4 text-[#20B2AA]" />
                <span className="hidden md:inline">Search...</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-white rounded border border-[#006D8F]/20 text-[#4A6B6D]">
                  Ctrl K
                </kbd>
              </button>

              {/* Notification Bell with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifDropdownOpen(!notifDropdownOpen);
                    setUserDropdownOpen(false);
                  }}
                  className="relative p-2 rounded-xl bg-[#DDF3F0]/70 hover:bg-[#DDF3F0] border border-[#006D8F]/20 text-[#064E52] hover:text-[#006D8F] transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#064E52]" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#20B2AA] text-[10px] font-bold text-white shadow-md animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Popover */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white border border-[#006D8F]/20 shadow-2xl p-4 text-[#064E52] z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-3 border-b border-[#006D8F]/15">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4 text-[#20B2AA]" />
                        <span className="font-bold text-sm text-[#064E52]">Notifications &amp; Reminders</span>
                        <span className="text-xs px-2 py-0.5 bg-[#DDF3F0] rounded-full font-mono text-[#006D8F] font-bold">
                          {notifications.length}
                        </span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-[#006D8F] hover:text-[#20B2AA] font-semibold transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2 py-2 custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="text-center py-6 text-[#4A6B6D] text-xs">
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
                                ? 'bg-[#DDF3F0]/40 border-[#006D8F]/15 opacity-80'
                                : 'bg-white border-[#20B2AA]/50 shadow-sm'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-[#064E52]">{n.title}</span>
                              <span className="text-[10px] text-[#4A6B6D]">
                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[#4A6B6D] leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#006D8F]/15 text-center">
                      <button
                        onClick={() => handleLinkClick('/announcements')}
                        className="text-xs font-semibold text-[#006D8F] hover:text-[#20B2AA]"
                      >
                        View All Festival Announcements &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Portal Button */}
              {isAdmin && (
                <button
                  onClick={() => handleLinkClick('/admin')}
                  className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#006D8F] to-[#20B2AA] hover:from-[#20B2AA] hover:to-[#006D8F] text-white text-xs font-bold shadow-md shadow-[#20B2AA]/20 transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Hub</span>
                </button>
              )}

              {/* User Auth Dropdown */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                      setNotifDropdownOpen(false);
                    }}
                    className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-[#006D8F]/20 bg-[#DDF3F0]/70 hover:bg-[#DDF3F0] transition-colors"
                  >
                    <img
                      src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.full_name)}`}
                      alt={user.full_name}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border-2 border-[#20B2AA]"
                    />
                    <div className="hidden lg:block text-left text-xs leading-none">
                      <p className="font-bold text-[#064E52] truncate max-w-[100px]">{user.full_name.split(' ')[0]}</p>
                      <p className="text-[10px] capitalize font-semibold text-[#006D8F]">{user.role}</p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#4A6B6D] hidden sm:block" />
                  </button>

                  {/* Profile Popover Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-white border border-[#006D8F]/20 shadow-2xl p-3 z-50 text-[#064E52] animate-in fade-in zoom-in-95 duration-150">

                      {/* ── Profile Card ── */}
                      <div className="rounded-xl border border-[#20B2AA]/30 mb-2 bg-[#DDF3F0] p-3">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.full_name)}`}
                            alt={user.full_name}
                            className="w-9 h-9 rounded-full object-cover border-2 border-[#20B2AA]"
                          />
                          <div className="min-w-0">
                            <p className="font-extrabold text-sm text-[#064E52] truncate">{user.full_name}</p>
                            <p className="text-[10px] text-[#4A6B6D] truncate">{user.email}</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center space-x-1 mt-2 px-2 py-0.5 rounded-full bg-white border border-[#20B2AA]/40 text-[#006D8F] text-[10px] font-bold uppercase tracking-wider">
                          <ShieldCheck className="w-3 h-3 text-[#20B2AA]" />
                          <span>{user.role}</span>
                        </span>
                      </div>

                      {/* ── Menu Items (role-specific) ── */}
                      <div className="space-y-1">
                        {isAdmin ? (
                          /* Admin menu — all routes go to /admin/... */
                          <>
                            <button
                              onClick={() => handleLinkClick('/admin')}
                              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/20 transition-colors"
                            >
                              <ShieldCheck className="w-4 h-4 text-indigo-400" />
                              <span>Admin Hub</span>
                            </button>
                            <button
                              onClick={() => handleLinkClick('/admin/checkin')}
                              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:bg-white/5 hover:text-festival-cream transition-colors"
                            >
                              <QrCode className="w-4 h-4 text-violet-400" />
                              <span>QR Gate Check-In</span>
                            </button>
                            <button
                              onClick={() => handleLinkClick('/admin/results')}
                              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#064E52] hover:bg-[#DDF3F0] hover:text-[#006D8F] transition-colors"
                            >
                              <Trophy className="w-4 h-4 text-[#20B2AA]" />
                              <span>Results & Scoring</span>
                            </button>
                            <button
                              onClick={() => handleLinkClick('/admin/announcements')}
                              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#064E52] hover:bg-[#DDF3F0] hover:text-[#006D8F] transition-colors"
                            >
                              <Bell className="w-4 h-4 text-[#006D8F]" />
                              <span>Post Announcement</span>
                            </button>
                          </>
                        ) : isCoordinator ? (
                          /* Coordinator menu — portal + operational tools */
                          <>
                            <button
                              onClick={() => handleLinkClick('/coordinator')}
                              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#006D8F] bg-[#DDF3F0] hover:bg-[#DDF3F0]/80 border border-[#20B2AA]/30 transition-colors"
                            >
                              <ShieldCheck className="w-4 h-4 text-[#20B2AA]" />
                              <span>Coordinator Portal</span>
                            </button>
                            <button
                              onClick={() => handleLinkClick('/coordinator/checkin')}
                              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#064E52] hover:bg-[#DDF3F0] hover:text-[#006D8F] transition-colors"
                            >
                              <QrCode className="w-4 h-4 text-[#006D8F]" />
                              <span>QR Gate Check-In</span>
                            </button>
                            <button
                              onClick={() => handleLinkClick('/coordinator/results')}
                              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#064E52] hover:bg-[#DDF3F0] hover:text-[#006D8F] transition-colors"
                            >
                              <Trophy className="w-4 h-4 text-[#20B2AA]" />
                              <span>Results & Scoring</span>
                            </button>
                            <button
                              onClick={() => handleLinkClick('/coordinator/announcements')}
                              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#064E52] hover:bg-[#DDF3F0] hover:text-[#006D8F] transition-colors"
                            >
                              <Bell className="w-4 h-4 text-[#006D8F]" />
                              <span>Post Announcement</span>
                            </button>
                          </>
                        ) : (
                          /* Participant / Regular menu */
                          <>
                            <button
                              onClick={() => handleLinkClick('/dashboard')}
                              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#064E52] hover:bg-[#DDF3F0] hover:text-[#006D8F] transition-colors"
                            >
                              <User className="w-4 h-4 text-[#20B2AA]" />
                              <span>My Dashboard &amp; Passes</span>
                            </button>
                            <button
                              onClick={() => handleLinkClick('/schedule')}
                              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#064E52] hover:bg-[#DDF3F0] hover:text-[#006D8F] transition-colors"
                            >
                              <Calendar className="w-4 h-4 text-[#006D8F]" />
                              <span>Festival Schedule</span>
                            </button>
                            <button
                              onClick={() => handleLinkClick('/leaderboard')}
                              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#064E52] hover:bg-[#DDF3F0] hover:text-[#006D8F] transition-colors"
                            >
                              <Trophy className="w-4 h-4 text-[#20B2AA]" />
                              <span>Live Leaderboard</span>
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => handleLinkClick('/admin')}
                                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#006D8F] hover:bg-[#DDF3F0] transition-colors"
                              >
                                <ShieldCheck className="w-4 h-4 text-[#20B2AA]" />
                                <span>Administration Panel</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>

                      <div className="pt-2 mt-2 border-t border-[#006D8F]/15">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                            onLogout?.();
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleLinkClick('/login')}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#064E52] hover:text-[#006D8F] bg-white hover:bg-[#DDF3F0] border border-[#006D8F]/25 shadow-xs transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleLinkClick('/register-auth')}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-[#20B2AA] hover:bg-[#1CA099] shadow-md shadow-[#20B2AA]/25 transition-all"
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Mobile Drawer Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl bg-[#DDF3F0]/80 hover:bg-[#DDF3F0] border border-[#006D8F]/20 text-[#064E52] transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile-only Search Bar — sticky just below the navbar */}
      <div className="sm:hidden sticky top-[calc(var(--navbar-mobile-h,3.5rem)+1px)] z-30 w-full bg-[#DDF3F0] border-b border-[#006D8F]/15 px-3 py-2">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-white border border-[#006D8F]/20 text-[#4A6B6D] hover:text-[#064E52] shadow-xs transition-all text-sm"
        >
          <Search className="w-4 h-4 text-[#20B2AA] flex-shrink-0" />
          <span className="font-medium text-xs text-[#064E52]">Search events, results, venues…</span>
          <span className="ml-auto text-[10px] font-mono text-[#006D8F] bg-[#DDF3F0] px-1.5 py-0.5 rounded">⌘K</span>
        </button>
      </div>

      {/* Mobile Left Side-Panel Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden flex">

          {/* ── Left drawer panel ── */}
          <div className="relative flex flex-col w-[80vw] max-w-[320px] h-full bg-white border-r border-[#006D8F]/20 shadow-2xl overflow-hidden animate-in slide-in-from-left duration-200">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#006D8F]/15 bg-[#DDF3F0] flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#006D8F] to-[#20B2AA] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-display font-extrabold text-base text-[#064E52]">
                  COLORIDO 2K26
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-white/60 hover:bg-white text-[#064E52] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User mini card — shown when logged in */}
            {user && (
              <div className="flex items-center space-x-3 px-4 py-3 border-b border-[#006D8F]/15 bg-[#DDF3F0]/40 flex-shrink-0">
                <img
                  src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.full_name)}`}
                  alt={user.full_name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#20B2AA]"
                />
                <div className="min-w-0">
                  <p className="font-bold text-sm text-[#064E52] truncate">{user.full_name}</p>
                  <p className="text-[10px] font-semibold capitalize text-[#006D8F]">
                    {user.role}
                  </p>
                </div>
              </div>
            )}

            {/* Scrollable nav list */}
            <div className="flex-1 overflow-y-auto custom-scrollbar py-3 px-3 space-y-0.5">

              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => handleLinkClick('/register')}
                  className="py-2.5 px-3 rounded-xl bg-[#20B2AA] text-white font-bold text-xs text-center shadow-md shadow-[#20B2AA]/20"
                >
                  Register →
                </button>
                <button
                  onClick={() => handleLinkClick('/dashboard')}
                  className="py-2.5 px-3 rounded-xl bg-[#DDF3F0] border border-[#006D8F]/20 text-[#064E52] font-bold text-xs text-center"
                >
                  Dashboard
                </button>
              </div>

              {/* Divider */}
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#4A6B6D] px-2 pt-1 pb-1.5">Navigation</p>

              {allNavLinks.map(link => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleLinkClick(link.path)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-[#DDF3F0] text-[#006D8F] font-bold border border-[#20B2AA]/30'
                        : 'text-[#064E52] hover:bg-[#DDF3F0]/60'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#20B2AA] flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Bottom actions */}
            <div className="flex-shrink-0 px-3 py-3 border-t border-[#006D8F]/15 space-y-2 bg-[#DDF3F0]/50">
              {isAdmin && (
                <button
                  onClick={() => handleLinkClick('/admin')}
                  className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#006D8F]/30 text-[#006D8F] font-bold text-xs flex items-center justify-center space-x-2 shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-[#20B2AA]" />
                  <span>Admin Dashboard</span>
                </button>
              )}
              {isCoordinator && (
                <button
                  onClick={() => handleLinkClick('/coordinator')}
                  className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#20B2AA]/30 text-[#006D8F] font-bold text-xs flex items-center justify-center space-x-2 shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-[#20B2AA]" />
                  <span>Coordinator Portal</span>
                </button>
              )}
              {isAuthenticated && (
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); onLogout?.(); }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white border border-rose-200 text-rose-600 font-bold text-xs flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </div>

          {/* ── Right backdrop — click to close ── */}
          <div
            className="flex-1 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}
    </>
  );
};
