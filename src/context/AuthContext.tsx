import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types/database';
import { DEMO_USERS } from '../lib/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { addPendingCoordinator, isCoordinatorApproved } from '../lib/coordinatorStore';
import { useToast } from './ToastContext';

// Supabase supported OAuth providers we expose
export type SocialProvider = 'google' | 'github' | 'twitter' | 'linkedin_oidc';

// Human-readable display info per provider
const PROVIDER_META: Record<SocialProvider, { label: string; emoji: string }> = {
  google:        { label: 'Google',   emoji: '🔵' },
  github:        { label: 'GitHub',   emoji: '⚫' },
  twitter:       { label: 'X (Twitter)', emoji: '🐦' },
  linkedin_oidc: { label: 'LinkedIn', emoji: '💼' },
};

// Demo profile seeds per provider for demo/offline mode
const DEMO_SOCIAL_PROFILES: Record<SocialProvider, Partial<UserProfile>> = {
  google: {
    full_name: 'Alex Kumar (Google)',
    email: 'alex.kumar@gmail.com',
    college: 'IIT Bombay',
    department: 'Computer Science',
    avatar_url: 'https://api.dicebear.com/7.x/notionists/svg?seed=google-user',
  },
  github: {
    full_name: 'Dev Sharma (GitHub)',
    email: 'dev.sharma@github.com',
    college: 'BITS Pilani',
    department: 'Electronics',
    avatar_url: 'https://api.dicebear.com/7.x/notionists/svg?seed=github-user',
  },
  twitter: {
    full_name: 'Priya Nair (X)',
    email: 'priya.nair@x.com',
    college: 'NIT Trichy',
    department: 'Information Technology',
    avatar_url: 'https://api.dicebear.com/7.x/notionists/svg?seed=twitter-user',
  },
  linkedin_oidc: {
    full_name: 'Rahul Mehta (LinkedIn)',
    email: 'rahul.mehta@linkedin.com',
    college: 'Symbiosis Institute',
    department: 'Management',
    avatar_url: 'https://api.dicebear.com/7.x/notionists/svg?seed=linkedin-user',
  },
};

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCoordinator: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string; user?: UserProfile }>;
  loginWithGoogle: () => Promise<{ success: boolean; message?: string; user?: UserProfile }>;
  loginWithProvider: (provider: SocialProvider) => Promise<{ success: boolean; message?: string; user?: UserProfile }>;
  register: (profile: Partial<UserProfile>) => Promise<{ success: boolean; message?: string; user?: UserProfile }>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  logout: () => void;
  switchDemoUser: (role: UserRole) => void;
}

const AUTH_STORAGE_KEY = 'colorido_auth_user_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!stored || stored === 'logged_out') return null;
      let parsed = JSON.parse(stored) as UserProfile;
      if (parsed && (isCoordinatorApproved(parsed.email) || isCoordinatorApproved(parsed.id))) {
        parsed = { ...parsed, role: 'coordinator', coordinator_status: 'approved' };
      }
      return parsed;
    } catch (e) {
      console.error('Error loading stored auth user', e);
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.setItem(AUTH_STORAGE_KEY, 'logged_out');
    }
  }, [user]);

  // Sync state when admin approves coordinator in another component or tab
  useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!stored || stored === 'logged_out') return;
        let parsed = JSON.parse(stored) as UserProfile;
        if (parsed && (isCoordinatorApproved(parsed.email) || isCoordinatorApproved(parsed.id))) {
          parsed = { ...parsed, role: 'coordinator', coordinator_status: 'approved' };
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(parsed));
        }
        setUser(parsed);
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener('colorido_auth_changed', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('colorido_auth_changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const login = async (email: string, _pass: string): Promise<{ success: boolean; message?: string; user?: UserProfile }> => {
    // Match demo users first
    const matched = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      const finalUser = isCoordinatorApproved(matched.email)
        ? { ...matched, role: 'coordinator' as UserRole, coordinator_status: 'approved' as const }
        : matched;
      setUser(finalUser);
      showToast(`Welcome back, ${finalUser.full_name}! 👋`, 'success');
      return { success: true, user: finalUser };
    }

    // Supabase auth if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: _pass });
        if (error) throw error;
        if (data.user) {
          const isApproved = isCoordinatorApproved(data.user.email || email);
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: data.user.user_metadata?.full_name || email.split('@')[0],
            college: data.user.user_metadata?.college || 'Registered University',
            role: isApproved ? 'coordinator' : (data.user.user_metadata?.role as UserRole) || 'participant',
            coordinator_status: isApproved ? 'approved' : data.user.user_metadata?.coordinator_status,
          };
          setUser(profile);
          showToast(`Welcome back, ${profile.full_name}! 👋`, 'success');
          return { success: true, user: profile };
        }
      } catch (err: any) {
        return { success: false, message: err.message || 'Login failed' };
      }
    }

    // Fallback: dynamic profile
    const isApproved = isCoordinatorApproved(email);
    const fallbackProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      email,
      full_name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      college: 'National University of Technology',
      department: 'Computer Applications',
      year: '3rd Year',
      role: isApproved ? 'coordinator' : email.includes('admin') ? 'admin' : email.includes('coord') ? 'coordinator' : 'participant',
      coordinator_status: isApproved || email.includes('coord') ? 'approved' : undefined,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
    };
    setUser(fallbackProfile);
    showToast(`Signed in successfully as ${fallbackProfile.full_name}`, 'success');
    return { success: true, user: fallbackProfile };
  };

  /** Unified social/OAuth login — supports Google, GitHub, Twitter (X), LinkedIn */
  const loginWithProvider = async (provider: SocialProvider): Promise<{ success: boolean; message?: string; user?: UserProfile }> => {
    const meta = PROVIDER_META[provider];

    // Real Supabase OAuth flow
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: { redirectTo: window.location.origin + '/dashboard' },
        });
        if (error) throw error;
        return { success: true };
      } catch (err: any) {
        showToast(`${meta.label} login failed: ${err.message}`, 'error');
        return { success: false, message: err.message };
      }
    }

    // Demo / offline fallback — simulate a successful social login
    const seed = DEMO_SOCIAL_PROFILES[provider];
    const email = seed.email || `${provider}.user@demo.com`;
    const isApproved = isCoordinatorApproved(email);
    const demoUser: UserProfile = {
      id: `usr_social_${provider}_${Date.now()}`,
      email,
      full_name: seed.full_name || `${meta.label} User`,
      college: seed.college || 'Demo University',
      department: seed.department,
      year: '2nd Year',
      role: isApproved ? 'coordinator' : 'participant',
      coordinator_status: isApproved ? 'approved' : undefined,
      avatar_url: seed.avatar_url,
    };

    setUser(demoUser);
    showToast(
      `${meta.emoji} Signed in with ${meta.label} — Welcome, ${demoUser.full_name}! 🎉`,
      'success'
    );
    return { success: true, user: demoUser };
  };

  /** Legacy wrapper — kept for backward compat */
  const loginWithGoogle = async () => loginWithProvider('google');

  const register = async (profileData: Partial<UserProfile>): Promise<{ success: boolean; message?: string; user?: UserProfile }> => {
    const isCoordinator = profileData.role === 'coordinator';
    const isApproved = profileData.email ? isCoordinatorApproved(profileData.email) : false;
    
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email: profileData.email || 'user@example.com',
      full_name: profileData.full_name || 'Participant',
      phone: profileData.phone,
      gender: profileData.gender,
      college: profileData.college || 'Partner College',
      department: profileData.department,
      year: profileData.year,
      role: profileData.role || 'participant',
      coordinator_status: isApproved ? 'approved' : isCoordinator ? 'pending' : undefined,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileData.full_name || 'Student')}`,
    };

    setUser(newUser);
    if (isCoordinator && !isApproved) {
      addPendingCoordinator(newUser);
      showToast(`Coordinator request submitted! Pending admin approval.`, 'info');
    } else {
      showToast(`Account created successfully! Welcome, ${newUser.full_name}! 🎉`, 'success');
    }
    return { success: true, user: newUser };
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    showToast('Profile updated successfully! 🎉', 'success');
  };

  const logout = () => {
    setUser(null);
    showToast('You have been logged out.', 'info');
  };

  const switchDemoUser = (role: UserRole) => {
    const target = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    setUser(target);
    showToast(`Switched active profile to: ${target.full_name} (${target.role.toUpperCase()})`, 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isCoordinator: (user?.role === 'coordinator' && user?.coordinator_status === 'approved') || user?.role === 'admin',
        login,
        loginWithGoogle,
        loginWithProvider,
        register,
        updateProfile,
        logout,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
