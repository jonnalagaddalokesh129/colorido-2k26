import { apiClient } from './api';
import { PoliceStation } from '../types';

export const policeService = {
  async getPoliceStations(latitude?: number | null, longitude?: number | null): Promise<PoliceStation[]> {
    const params: Record<string, number> = {};
    if (latitude !== undefined && latitude !== null) params.latitude = latitude;
    if (longitude !== undefined && longitude !== null) params.longitude = longitude;
    
    const response = await apiClient.get('/police', { params });
    return response.data;
  }
};
