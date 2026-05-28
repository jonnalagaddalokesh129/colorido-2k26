import { apiClient } from './api';
import { Hospital } from '../types';

export const hospitalService = {
  async getHospitals(latitude?: number | null, longitude?: number | null): Promise<Hospital[]> {
    const params: Record<string, number> = {};
    if (latitude !== undefined && latitude !== null) params.latitude = latitude;
    if (longitude !== undefined && longitude !== null) params.longitude = longitude;
    
    const response = await apiClient.get('/hospitals', { params });
    return response.data;
  }
};
