import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from '../context/LocationContext';
import { policeService } from '../services/policeService';
import { PoliceStation } from '../types';
import { Header } from '../components/ui/Header';
import { PoliceCard } from '../components/PoliceCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Typography } from '../constants/typography';
import { Shield } from 'lucide-react-native';

export default function PoliceScreen() {
  const { theme } = useTheme();
  const { location } = useLocation();
  const [stations, setStations] = useState<PoliceStation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStations = async () => {
    setLoading(true);
    try {
      const lat = location?.coords.latitude;
      const lng = location?.coords.longitude;
      const data = await policeService.getPoliceStations(lat, lng);
      setStations(data);
    } catch (e) {
      console.log('Error fetching police stations', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Police Support" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>
          Nearest police stations and emergency law-enforcement precincts.
        </Text>

        {loading ? (
          <LoadingSpinner message="Locating nearest precincts..." />
        ) : stations.length === 0 ? (
          <EmptyState
            title="No Stations Found"
            description="Unable to locate police stations. Verify your network connection."
            icon={<Shield size={36} color={theme.mutedForeground} />}
          />
        ) : (
          stations.map((s) => <PoliceCard key={s.id} station={s} />)
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
