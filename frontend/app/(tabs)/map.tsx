import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTheme } from '../../context/ThemeContext';
import { useLocation } from '../../context/LocationContext';
import { hospitalService } from '../../services/hospitalService';
import { policeService } from '../../services/policeService';
import { towingService } from '../../services/towingService';
import { Hospital, PoliceStation, TowingService } from '../../types';
import { Typography } from '../../constants/typography';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Button } from '../../components/ui/Button';
import { MapPin, Navigation } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const { theme } = useTheme();
  const { location, refreshLocation, loading: locLoading } = useLocation();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [policeStations, setPoliceStations] = useState<PoliceStation[]>([]);
  const [towingServices, setTowingServices] = useState<TowingService[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMarkers = async () => {
    if (!location) return;
    setLoading(true);
    const lat = location.coords.latitude;
    const lng = location.coords.longitude;
    try {
      const [h, p, t] = await Promise.all([
        hospitalService.getHospitals(lat, lng).catch(() => []),
        policeService.getPoliceStations(lat, lng).catch(() => []),
        towingService.getTowingServices(lat, lng).catch(() => []),
      ]);
      setHospitals(h);
      setPoliceStations(p);
      setTowingServices(t);
    } catch (e) {
      console.log('Error fetching map data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) fetchMarkers();
  }, [location]);

  if (locLoading || !location) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <LoadingSpinner message="Acquiring GPS position..." fullScreen />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
        customMapStyle={darkMapStyle}
      >
        {/* User Location Marker */}
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Your Location"
          description="Current GPS position"
          pinColor="#F59E0B"
        />

        {/* Hospital Markers */}
        {hospitals.map((h) => (
          <Marker
            key={`h-${h.id}`}
            coordinate={{ latitude: h.latitude, longitude: h.longitude }}
            title={h.name}
            description={`⭐ ${h.rating} — ${h.address}`}
            pinColor="#EF4444"
          />
        ))}

        {/* Police Markers */}
        {policeStations.map((p) => (
          <Marker
            key={`p-${p.id}`}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            title={p.name}
            description={`⭐ ${p.rating} — ${p.address}`}
            pinColor="#3B82F6"
          />
        ))}

        {/* Towing Markers */}
        {towingServices.map((t) => (
          <Marker
            key={`t-${t.id}`}
            coordinate={{ latitude: t.latitude, longitude: t.longitude }}
            title={t.name}
            description={`⭐ ${t.rating} — ${t.available ? 'Available' : 'Busy'}`}
            pinColor="#10B981"
          />
        ))}
      </MapView>

      {/* Legend Overlay */}
      <View style={[styles.legendContainer]}>
        <Card style={styles.legend}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={[styles.legendText, { color: theme.primary }]}>You</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
            <Text style={[styles.legendText, { color: theme.primary }]}>Hospitals</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
            <Text style={[styles.legendText, { color: theme.primary }]}>Police</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={[styles.legendText, { color: theme.primary }]}>Towing</Text>
          </View>
        </Card>
      </View>

      {/* Relocate FAB */}
      <View style={styles.fabContainer}>
        <Button
          title=""
          variant="primary"
          onPress={refreshLocation}
          style={styles.fab}
          textStyle={{ fontSize: 0 }}
        />
        <View style={styles.fabIcon} pointerEvents="none">
          <Navigation size={22} color={theme.secondaryForeground} />
        </View>
      </View>
    </View>
  );
}

// Dark map styling to match app theme
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1C1917' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#A8A29E' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0C0A09' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#292524' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0C0A09' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#292524' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#292524' }] },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: width,
    height: height,
  },
  legendContainer: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 100,
    right: 20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 0,
  },
  fabIcon: {
    position: 'absolute',
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
