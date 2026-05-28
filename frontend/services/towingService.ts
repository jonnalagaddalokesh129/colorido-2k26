import { apiClient } from './api';
import { TowingService } from '../types';

export const towingService = {
  async getTowingServices(latitude?: number | null, longitude?: number | null): Promise<TowingService[]> {
    const params: Record<string, number> = {};
    if (latitude !== undefined && latitude !== null) params.latitude = latitude;
    if (longitude !== undefined && longitude !== null) params.longitude = longitude;
    
    const response = await apiClient.get('/towing', { params });
    return response.data;
  }
};
