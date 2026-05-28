import { useState, useCallback } from 'react';
import { useLocation } from '../context/LocationContext';
import { sosService } from '../services/sosService';
import { SOSAlert } from '../types';
import { Alert } from 'react-native';

export function useSOS() {
  const { location, addressName } = useLocation();
  const [activeSOS, setActiveSOS] = useState<SOSAlert | null>(null);
  const [loading, setLoading] = useState(false);
  const [voiceSOS, setVoiceSOS] = useState(false);

  const toggleVoiceSOS = useCallback(() => {
    setVoiceSOS(prev => !prev);
  }, []);

  const triggerSOS = useCallback(async (): Promise<SOSAlert | null> => {
    if (!location) {
      Alert.alert('GPS Location Error', 'Unable to retrieve current coordinates. Please ensure location services are enabled.');
      return null;
    }
    
    setLoading(true);
    try {
      const alert = await sosService.createSOS(
        location.coords.latitude,
        location.coords.longitude,
        addressName || 'Current Location',
        voiceSOS
      );
      setActiveSOS(alert);
      return alert;
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Failed to dispatch SOS alert';
      Alert.alert('SOS Trigger Failed', msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [location, addressName, voiceSOS]);

  const resolveSOS = useCallback(() => {
    setActiveSOS(null);
  }, []);

  return {
    activeSOS,
    loading,
    voiceSOS,
    toggleVoiceSOS,
    triggerSOS,
    resolveSOS
  };
}
