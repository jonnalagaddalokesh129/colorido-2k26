import { apiClient } from './api';
import { SOSAlert } from '../types';

export const sosService = {
  async createSOS(latitude: number, longitude: number, locationName?: string | null, voiceSOS?: boolean): Promise<SOSAlert> {
    const response = await apiClient.post('/sos/create', {
      latitude,
      longitude,
      location_name: locationName,
      voice_sos: voiceSOS || false
    });
    return response.data;
  },

  async getSOSHistory(): Promise<SOSAlert[]> {
    const response = await apiClient.get('/sos/history');
    return response.data;
  }
};
