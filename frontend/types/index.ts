export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  blood_group?: string | null;
  allergies?: string | null;
}

export interface SOSAlert {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  location_name?: string | null;
  voice_sos: boolean;
  status: 'pending' | 'active' | 'resolved' | 'in_progress';
  created_at: string;
  updated_at: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  distance?: number | null;
  rating: number;
  specialties: string[];
}

export interface PoliceStation {
  id: string;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  distance?: number | null;
  rating: number;
  jurisdiction?: string | null;
}

export interface TowingService {
  id: string;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  distance?: number | null;
  rating: number;
  available: boolean;
  vehicle_types: string[];
}

export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  relationship: string;
}
