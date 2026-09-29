import React, { useState, useEffect, useCallback } from 'react';

/* ── Context Providers ── */
import { ToastProvider }        from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { FavoritesProvider }    from './context/FavoritesContext';

/* ── Shared Modals ── */
import { GlobalSearchModal }   from './components/common/GlobalSearchModal';
import { DatabaseStatusModal } from './components/common/DatabaseStatusModal';

/* ── Layout ── */
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

/* ── Public Pages ── */
import { HomePage }          from './pages/HomePage';
import { AboutPage }         from './pages/AboutPage';
import { EventsPage }        from './pages/EventsPage';
import { EventDetailPage }   from './pages/EventDetailPage';
import { SchedulePage }      from './pages/SchedulePage';
import { RegistrationPage }  from './pages/RegistrationPage';
import { DashboardPage }     from './pages/DashboardPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { ResultsPage }       from './pages/ResultsPage';
import { LeaderboardPage }   from './pages/LeaderboardPage';
import { GalleryPage }       from './pages/GalleryPage';
import { SponsorsPage }      from './pages/SponsorsPage';
import { VenuesPage }        from './pages/VenuesPage';
import { ContactPage }       from './pages/ContactPage';
import { DigitalPassPage }      from './pages/DigitalPassPage';
import { LoginPage }           from './pages/LoginPage';
import { RegisterAuthPage }  from './pages/RegisterAuthPage';

/* ── Admin Pages ── */
import { AdminLayout }            from './pages/admin/AdminLayout';
import { AdminDashboardPage }     from './pages/admin/AdminDashboardPage';
import { AdminEventsPage }        from './pages/admin/AdminEventsPage';
import { AdminParticipantsPage }  from './pages/admin/AdminParticipantsPage';
import { AdminCoordinatorsPage }  from './pages/admin/AdminCoordinatorsPage';
import { AdminCheckinPage }       from './pages/admin/AdminCheckinPage';
import { AdminResultsPage }       from './pages/admin/AdminResultsPage';
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage';
import { AdminGalleryPage }       from './pages/admin/AdminGalleryPage';
import { AdminSponsorsPage }      from './pages/admin/AdminSponsorsPage';
import { AdminMessagesPage }      from './pages/admin/AdminMessagesPage';

/* ── Coordinator Pages ── */
import { CoordinatorLayout }      from './pages/coordinator/CoordinatorLayout';
import { CoordinatorOverviewPage} from './pages/coordinator/CoordinatorOverviewPage';
import { CoordinatorPendingPage} from './pages/coordinator/CoordinatorPendingPage';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Simple client-side router — no external dependency needed                  */
/* ─────────────────────────────────────────────────────────────────────────── */

function getPath(): string {
  return window.location.pathname || '/';
}

function useRouter() {
  const [path, setPath] = useState<string>(getPath);

  useEffect(() => {
    const onPop = () => setPath(getPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    if (to !== getPath()) {
      window.history.pushState(null, '', to);
      setPath(to);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return { path, navigate };
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Admin tab from path                                                         */
/* ─────────────────────────────────────────────────────────────────────────── */

function adminTabFromPath(path: string): string {
  const seg = path.replace('/admin', '').replace(/^\//, '');
  return seg || 'dashboard';
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Public page renderer                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */

function renderPublicPage(path: string, navigate: (to: string) => void): React.ReactNode {
  /* Convenience helpers that satisfy specific prop shapes */
  const toEvent  = (id: string) => navigate(`/events/${id}`);
  const toReg    = (id: string) => navigate(`/register?event=${id}`);
  const toSched  = ()           => navigate('/schedule');

  /* ── Home ── */
  if (path === '/') return (
    <HomePage
      onNavigate={navigate}
      onViewEvent={toEvent}
      onRegisterEvent={toReg}
    />
  );

  /* ── Static info ── */
  if (path === '/about')   return <AboutPage   onNavigate={navigate} />;
  if (path === '/contact') return <ContactPage />;
  if (path === '/gallery') return <GalleryPage />;
  if (path === '/sponsors')return <SponsorsPage />;
  if (path === '/venues' || path.startsWith('/venues?')) {
    const params = new URLSearchParams(path.includes('?') ? path.split('?')[1] : '');
    return <VenuesPage initialVenueId={params.get('id') || params.get('venue') || undefined} onViewEvent={toEvent} />;
  }

  /* ── Events explorer ── */
  if (path === '/events') return (
    <EventsPage
      onViewEvent={toEvent}
      onRegisterEvent={toReg}
    />
  );
  if (path.startsWith('/events/')) {
    const id = path.replace('/events/', '');
    return (
      <EventDetailPage
        eventId={id}
        onBack={() => navigate('/events')}
        onRegister={toReg}
        onViewSchedule={toSched}
        onNavigate={navigate}
      />
    );
  }

  /* ── Schedule ── */
  if (path === '/schedule') return (
    <SchedulePage
      onViewEvent={toEvent}
      onRegisterEvent={toReg}
    />
  );

  /* ── Announcements ── */
  if (path === '/announcements') return <AnnouncementsPage />;

  /* ── Registration flow ── */
  if (path === '/register' || path.startsWith('/register?')) {
    const params = new URLSearchParams(path.includes('?') ? path.split('?')[1] : '');
    return (
      <RegistrationPage
        preselectedEventId={params.get('event') ?? undefined}
        onNavigate={navigate}
        onViewSchedule={toSched}
      />
    );
  }

  /* ── Participant dashboard ── */
  if (path === '/dashboard') return (
    <DashboardPage
      onNavigate={navigate}
      onViewEvent={toEvent}
    />
  );

  /* ── Results & standings ── */
  if (path === '/results')     return <ResultsPage    onViewEvent={toEvent} />;
  if (path === '/leaderboard') return <LeaderboardPage onNavigate={navigate} />;

  /* ── Digital pass lookup ── */
  if (path === '/pass' || path.startsWith('/pass/')) {
    const rawId = path.startsWith('/pass/') ? path.replace('/pass/', '') : undefined;
    return <DigitalPassPage initialRegId={rawId} onBack={() => navigate('/dashboard')} />;
  }

  /* ── Redirect /image-effects to Gallery ── */
  if (path === '/image-effects') return <GalleryPage />;

  /* ── Coordinator Pending ── */
  if (path === '/coordinator-pending') return <CoordinatorPendingPage onNavigate={navigate} />;

  /* ── Auth ── */
  if (path === '/login' || path === '/register-auth') {
    return (
      <LoginPage
        key="auth-page-container"
        initialMode={path === '/register-auth' ? 'register' : 'login'}
        onNavigate={navigate}
      />
    );
  }

  /* ── 404 ── */
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-24">
      <p
        className="text-8xl font-black text-transparent bg-clip-text"
        style={{ backgroundImage: 'linear-gradient(135deg, #10B981, #D4AF37)' }}
      >
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold" style={{ color: 'var(--col-cream)' }}>
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md" style={{ color: 'var(--col-muted)' }}>
        The page you're looking for doesn't exist or may have moved. Let's get you back to the festival!
      </p>
      <button
        onClick={() => navigate('/')}
        className="btn-emerald mt-8"
      >
        Back to Home
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  App Shell                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

function AppShell() {
  const { path, navigate } = useRouter();
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [dbStatusOpen, setDbStatusOpen] = useState(false);

  // Auth guard — redirect unauthenticated users away from protected routes
  const { user } = useAuth();
  const PROTECTED_PATHS = ['/dashboard', '/register', '/pass', '/coordinator', '/coordinator-pending'];
  const isProtected = PROTECTED_PATHS.some(p => path === p || path.startsWith(p + '?') || path.startsWith(p + '/')) || path.startsWith('/admin');

  useEffect(() => {
    if (!user && isProtected) {
      // Not logged in → send to login
      navigate('/login');
    } else if (user && path.startsWith('/admin') && user.role !== 'admin') {
      // Coordinators trying /admin → redirect to their own portal
      if (user.role === 'coordinator') navigate('/coordinator');
      else navigate('/');
    } else if (user && path.startsWith('/coordinator') && path !== '/coordinator-pending' && user.role !== 'coordinator') {
      // Non-coordinators trying /coordinator → redirect appropriately
      if (user.role === 'admin') navigate('/admin');
      else navigate('/');
    } else if (user && user.role === 'coordinator' && user.coordinator_status !== 'approved' && path.startsWith('/coordinator') && path !== '/coordinator-pending') {
      navigate('/coordinator-pending');
    }
  }, [user, isProtected, path, navigate]);


  /* Global keyboard shortcuts */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setDbStatusOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const isAdminRoute       = path.startsWith('/admin');
  const isCoordinatorRoute = path.startsWith('/coordinator') && path !== '/coordinator-pending';
  const isAuthRoute        = path === '/login' || path === '/register-auth';
  const isSpecialRoute     = isAdminRoute || isCoordinatorRoute;

  /* Admin sub-tab from URL */
  const adminTab    = adminTabFromPath(path);
  const setAdminTab = (tab: string) => navigate(tab === 'dashboard' ? '/admin' : `/admin/${tab}`);

  /* Coordinator sub-tab from URL */
  const coordTabFromPath = (p: string) => p.replace('/coordinator', '').replace(/^\//, '') || 'overview';
  const coordTab    = coordTabFromPath(path);
  const setCoordTab = (tab: string) => navigate(tab === 'overview' ? '/coordinator' : `/coordinator/${tab}`);

  return (
    <div className="min-h-screen flex flex-col bg-[#DDF3F0] text-[#064E52]">

      {/* ── Sticky Navbar (hidden on auth & portal pages) ── */}
      {!isAuthRoute && !isSpecialRoute && (
        <Navbar
          currentPath={path}
          onNavigate={navigate}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenDbStatus={() => setDbStatusOpen(true)}
          onLogout={() => navigate('/login')}
        />
      )}

      {/* ── Main Content ── */}
      <main className="flex-1">
        {isAdminRoute ? (
          <AdminLayout
            currentTab={adminTab}
            onSelectTab={setAdminTab}
            onExitAdmin={() => navigate('/')}
            onLogout={() => navigate('/login')}
          >
            {adminTab === 'dashboard'     && <AdminDashboardPage onSelectTab={setAdminTab} />}
            {adminTab === 'events'        && <AdminEventsPage       />}
            {adminTab === 'participants'  && <AdminParticipantsPage />}
            {adminTab === 'coordinators'  && <AdminCoordinatorsPage />}
            {adminTab === 'checkin'       && <AdminCheckinPage      />}
            {adminTab === 'results'       && <AdminResultsPage      />}
            {adminTab === 'announcements' && <AdminAnnouncementsPage />}
            {adminTab === 'gallery'       && <AdminGalleryPage      />}
            {adminTab === 'sponsors'      && <AdminSponsorsPage     />}
            {adminTab === 'messages'      && <AdminMessagesPage     />}
            {!['dashboard','events','participants','coordinators','checkin','results','announcements','gallery','sponsors','messages'].includes(adminTab) && (
              <AdminDashboardPage onSelectTab={setAdminTab} />
            )}
          </AdminLayout>
        ) : isCoordinatorRoute ? (
          <CoordinatorLayout
            currentTab={coordTab}
            onSelectTab={setCoordTab}
            onExit={() => navigate('/')}
            onLogout={() => navigate('/login')}
          >
            {coordTab === 'overview'      && <CoordinatorOverviewPage onSelectTab={setCoordTab} />}
            {coordTab === 'events'        && <AdminEventsPage />}
            {coordTab === 'checkin'       && <AdminCheckinPage />}
            {coordTab === 'results'       && <AdminResultsPage />}
            {coordTab === 'announcements' && <AdminAnnouncementsPage />}
            {coordTab === 'gallery'       && <AdminGalleryPage />}
            {!['overview','events','checkin','results','announcements','gallery'].includes(coordTab) && (
              <CoordinatorOverviewPage onSelectTab={setCoordTab} />
            )}
          </CoordinatorLayout>
        ) : (
          renderPublicPage(path, navigate)
        )}
      </main>

      {/* ── Footer (hidden on admin, coordinator & auth pages) ── */}
      {!isSpecialRoute && !isAuthRoute && (
        <Footer onNavigate={navigate} />
      )}

      {/* ── Global Search Modal (Ctrl+K) ── */}
      {searchOpen && (
        <GlobalSearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onNavigate={(to) => { navigate(to); setSearchOpen(false); }}
        />
      )}

      {/* ── Database Status / Schema Inspector ── */}
      {dbStatusOpen && (
        <DatabaseStatusModal
          isOpen={dbStatusOpen}
          onClose={() => setDbStatusOpen(false)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Root App — wraps everything in context providers                            */
/* ─────────────────────────────────────────────────────────────────────────── */

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <NotificationProvider>
          <FavoritesProvider>
            <AppShell />
          </FavoritesProvider>
        </NotificationProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
