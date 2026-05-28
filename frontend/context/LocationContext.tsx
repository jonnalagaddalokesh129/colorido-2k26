import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationContextType {
  location: Location.LocationObject | null;
  errorMsg: string | null;
  loading: boolean;
  requestPermission: () => Promise<boolean>;
  refreshLocation: () => Promise<void>;
  addressName: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [addressName, setAddressName] = useState<string | null>(null);

  const requestPermission = async (): Promise<boolean> => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return false;
      }
      return true;
    } catch (e) {
      setErrorMsg('Failed to request location permissions');
      setLoading(false);
      return false;
    }
  };

  const refreshLocation = async () => {
    setLoading(true);
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        // Fallback placeholder location in Bangalore center for simulation purposes
        setLocation({
          coords: {
            latitude: 12.9716,
            longitude: 77.5946,
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        });
        setAddressName('Vidhana Soudha, Bangalore (Simulation)');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(loc);
      setErrorMsg(null);

      // Perform reverse geocoding to get location name
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const place = reverseGeocode[0];
        const parts = [
          place.name || place.street,
          place.district || place.subregion,
          place.city,
        ].filter(Boolean);
        setAddressName(parts.join(', ') || 'Unknown Location');
      } else {
        setAddressName('Unknown Location');
      }
    } catch (error: any) {
      console.warn('Failed to fetch GPS coordinates:', error);
      setErrorMsg(error.message || 'Failed to get location');
      
      // Standby local coordinate fallback
      setLocation({
        coords: {
          latitude: 12.9716,
          longitude: 77.5946,
          altitude: null,
          accuracy: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      });
      setAddressName('Vidhana Soudha, Bangalore (Simulation Fallback)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        errorMsg,
        loading,
        requestPermission,
        refreshLocation,
        addressName,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
