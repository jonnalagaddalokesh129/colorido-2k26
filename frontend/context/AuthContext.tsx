import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { User } from '../types';
import { authService } from '../services/authService';
import { Storage } from '../utils/storage';
import { setOnUnauthorizedCallback } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const segments = useSegments();

  // Routing Guard based on Auth State
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!token && !inAuthGroup) {
      // Redirect to login if not authenticated and not in auth screens
      router.replace('/(auth)/login');
    } else if (token && inAuthGroup) {
      // Redirect to main app tabs if authenticated and trying to access auth screens
      router.replace('/(tabs)');
    }
  }, [token, segments, loading]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = await Storage.getToken();
        const storedUser = await Storage.getUser();
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
          
          // Verify and refresh user profile from server in background
          authService.getProfile()
            .then(updatedUser => setUser(updatedUser))
            .catch(err => {
              console.log('Error updating profile in background:', err);
              // Handle expired or invalid cached token gracefully
              if (err.response && err.response.status === 401) {
                setToken(null);
                setUser(null);
              }
            });
        }
      } catch (err) {
        console.error('Failed to load auth state', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Register callback for API 401 unauthorized errors
    setOnUnauthorizedCallback(() => {
      setToken(null);
      setUser(null);
    });
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      setToken(data.access_token);
      setUser(data.user);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    setLoading(true);
    try {
      const data = await authService.register(name, email, phone, password);
      setToken(data.access_token);
      setUser(data.user);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setToken(null);
      setUser(null);
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const updatedUser = await authService.getProfile();
      setUser(updatedUser);
    } catch (err) {
      console.error('Failed to refresh profile', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshProfile }}>
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
