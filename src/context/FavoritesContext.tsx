import React, { createContext, useContext, useState, useEffect } from 'react';
import { store } from '../lib/store';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (eventId: string) => boolean;
  toggleFavorite: (eventId: string, eventName?: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const userId = user?.id || 'guest';

  const [favorites, setFavorites] = useState<string[]>(() => store.getFavorites(userId));

  useEffect(() => {
    const update = () => {
      setFavorites(store.getFavorites(userId));
    };
    update();
    const unsub = store.subscribe(update);
    return () => unsub();
  }, [userId]);

  const isFavorite = (eventId: string): boolean => {
    return favorites.includes(eventId);
  };

  const toggleFavorite = (eventId: string, eventName?: string) => {
    const isNowFav = store.toggleFavorite(userId, eventId);
    setFavorites(store.getFavorites(userId));
    if (isNowFav) {
      showToast(`Added ${eventName || 'event'} to My Events ❤️`, 'success');
    } else {
      showToast(`Removed from My Events 💔`, 'info');
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
