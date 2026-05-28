import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from '../context/LocationContext';
import { hospitalService } from '../services/hospitalService';
import { Hospital } from '../types';
import { Header } from '../components/ui/Header';
import { HospitalCard } from '../components/HospitalCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Typography } from '../constants/typography';
import { Hospital as HospitalIcon } from 'lucide-react-native';

export default function HospitalsScreen() {
  const { theme } = useTheme();
  const { location } = useLocation();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const lat = location?.coords.latitude;
      const lng = location?.coords.longitude;
      const data = await hospitalService.getHospitals(lat, lng);
      setHospitals(data);
    } catch (e) {
      console.log('Error fetching hospitals', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Trauma Centres" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>
          Nearby hospitals sorted by distance from your GPS coordinates.
        </Text>

        {loading ? (
          <LoadingSpinner message="Scanning nearby facilities..." />
        ) : hospitals.length === 0 ? (
          <EmptyState
            title="No Hospitals Found"
            description="Unable to fetch hospital data. Check your connection and try again."
            icon={<HospitalIcon size={36} color={theme.mutedForeground} />}
          />
        ) : (
          hospitals.map((h) => <HospitalCard key={h.id} hospital={h} />)
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
