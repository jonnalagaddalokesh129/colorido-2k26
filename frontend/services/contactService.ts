import { apiClient } from './api';
import { EmergencyContact } from '../types';

export const contactService = {
  async getContacts(): Promise<EmergencyContact[]> {
    const response = await apiClient.get('/emergency-contacts');
    return response.data;
  },

  async createContact(name: string, phone: string, relationship: string): Promise<EmergencyContact> {
    const response = await apiClient.post('/emergency-contacts', { name, phone, relationship });
    return response.data;
  },

  async updateContact(id: string, name?: string, phone?: string, relationship?: string): Promise<EmergencyContact> {
    const response = await apiClient.put(`/emergency-contacts/${id}`, { name, phone, relationship });
    return response.data;
  },

  async deleteContact(id: string): Promise<void> {
    await apiClient.delete(`/emergency-contacts/${id}`);
  }
};
