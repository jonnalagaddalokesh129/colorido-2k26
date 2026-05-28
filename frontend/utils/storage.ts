import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Web-safe secure storage: uses localStorage on Web, SecureStore on native
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'cached_user';

// Dynamically import SecureStore only on native platforms
let SecureStore: any = null;
if (Platform.OS !== 'web') {
  try {
    SecureStore = require('expo-secure-store');
  } catch (e) {
    console.warn('expo-secure-store not available, falling back to AsyncStorage');
  }
}

// Web localStorage helpers
const webStorage = {
  setItem: (key: string, value: string) => {
    try { localStorage.setItem(key, value); } catch (e) {}
  },
  getItem: (key: string): string | null => {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  },
  removeItem: (key: string) => {
    try { localStorage.removeItem(key); } catch (e) {}
  },
};

export const Storage = {
  // ── Token (auth JWT) ─────────────────────────────────────────────────────
  async saveToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web' || !SecureStore) {
        webStorage.setItem(TOKEN_KEY, token);
      } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      }
    } catch (e) {
      console.error('Error saving secure token', e);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web' || !SecureStore) {
        return webStorage.getItem(TOKEN_KEY);
      }
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (e) {
      console.error('Error reading secure token', e);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      if (Platform.OS === 'web' || !SecureStore) {
        webStorage.removeItem(TOKEN_KEY);
      } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch (e) {
      console.error('Error deleting secure token', e);
    }
  },

  // ── User Profile Cache ────────────────────────────────────────────────────
  async saveUser(user: any): Promise<void> {
    try {
      const value = JSON.stringify(user);
      if (Platform.OS === 'web') {
        webStorage.setItem(USER_KEY, value);
      } else {
        await AsyncStorage.setItem(USER_KEY, value);
      }
    } catch (e) {
      console.error('Error saving user cache', e);
    }
  },

  async getUser(): Promise<any | null> {
    try {
      let userStr: string | null = null;
      if (Platform.OS === 'web') {
        userStr = webStorage.getItem(USER_KEY);
      } else {
        userStr = await AsyncStorage.getItem(USER_KEY);
      }
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.error('Error reading user cache', e);
      return null;
    }
  },

  async removeUser(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        webStorage.removeItem(USER_KEY);
      } else {
        await AsyncStorage.removeItem(USER_KEY);
      }
    } catch (e) {
      console.error('Error deleting user cache', e);
    }
  },

  // ── Clear Everything ──────────────────────────────────────────────────────
  async clearAll(): Promise<void> {
    try {
      await this.removeToken();
      await this.removeUser();
    } catch (e) {
      console.error('Error clearing storage', e);
    }
  },
};
