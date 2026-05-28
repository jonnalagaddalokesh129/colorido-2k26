import { apiClient } from './api';
import { Storage } from '../utils/storage';
import { User } from '../types';

export const authService = {
  async register(name: string, email: string, phone: string, password: string): Promise<any> {
    const response = await apiClient.post('/auth/register', { name, email, phone, password });
    if (response.data.access_token) {
      await Storage.saveToken(response.data.access_token);
      await Storage.saveUser(response.data.user);
    }
    return response.data;
  },

  async login(email: string, password: string): Promise<any> {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data.access_token) {
      await Storage.saveToken(response.data.access_token);
      await Storage.saveUser(response.data.user);
    }
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get('/users/profile');
    await Storage.saveUser(response.data);
    return response.data;
  },

  async updateProfile(data: { name?: string; phone?: string; blood_group?: string | null; allergies?: string | null }): Promise<User> {
    const response = await apiClient.put('/users/profile', data);
    await Storage.saveUser(response.data);
    return response.data;
  },

  async logout(): Promise<void> {
    await Storage.clearAll();
  }
};
