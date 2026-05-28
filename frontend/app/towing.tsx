import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from '../context/LocationContext';
import { towingService } from '../services/towingService';
import { TowingService } from '../types';
import { Header } from '../components/ui/Header';
import { TowingCard } from '../components/TowingCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Typography } from '../constants/typography';
import { Truck } from 'lucide-react-native';

export default function TowingScreen() {
  const { theme } = useTheme();
  const { location } = useLocation();
  const [services, setServices] = useState<TowingService[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const lat = location?.coords.latitude;
      const lng = location?.coords.longitude;
      const data = await towingService.getTowingServices(lat, lng);
      setServices(data);
    } catch (e) {
      console.log('Error fetching towing services', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Vehicle Rescue" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>
          Towing and flatbed vehicle recovery services near your location.
        </Text>

        {loading ? (
          <LoadingSpinner message="Scanning recovery fleet..." />
        ) : services.length === 0 ? (
          <EmptyState
            title="No Services Found"
            description="No towing services available currently. Please try again later."
            icon={<Truck size={36} color={theme.mutedForeground} />}
          />
        ) : (
          services.map((s) => <TowingCard key={s.id} service={s} />)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    marginBottom: 20,
    lineHeight: 20,
  },
});
