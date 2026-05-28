import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, ScrollView, View, Text, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from '../context/LocationContext';
import { Header } from '../components/ui/Header';
import { TelemetryGrid } from '../components/TelemetryGrid';
import { GuardianProfile } from '../components/GuardianProfile';
import { Card } from '../components/ui/Card';
import { Typography } from '../constants/typography';
import { Clock, ShieldCheck, MapPin } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function TrackRescueScreen() {
  const { theme } = useTheme();
  const { location, loading: locLoading } = useLocation();
  const params = useLocalSearchParams();
  const destination = (params.destination as string) || 'Apollo Critical Care Unit';

  // Live Telemetry states
  const [eta, setEta] = useState(5.0);
  const [distance, setDistance] = useState(2.4);
  const [speed, setSpeed] = useState(54);
  
  // Moving Responder coordinates state
  const [responderCoords, setResponderCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  
  // Timeline log events
  const [logs, setLogs] = useState([
    { time: 'Just Now', text: 'Telemetry synchronization active', done: true },
    { time: '1 Min Ago', text: 'Responder dispatched & en-route', done: true },
    { time: '2 Min Ago', text: 'SOS broadcast handshake completed', done: true },
  ]);

  // Handle simulation loops
  useEffect(() => {
    if (!location) return;

    // Start operator a bit offset
    const userLat = location.coords.latitude;
    const userLng = location.coords.longitude;
    setResponderCoords({
      latitude: userLat + 0.015,
      longitude: userLng + 0.015
    });

    const interval = setInterval(() => {
      // Simulate responder getting closer
      setResponderCoords((prev) => {
        if (!prev) return null;
        const diffLat = userLat - prev.latitude;
        const diffLng = userLng - prev.longitude;
        
        // Advance 8% closer
        const nextLat = prev.latitude + diffLat * 0.08;
        const nextLng = prev.longitude + diffLng * 0.08;
        
        return { latitude: nextLat, longitude: nextLng };
      });

      // Fluctuate speed, decrease distance & ETA
      setSpeed(() => Math.floor(45 + Math.random() * 20));
      setDistance((prev) => {
        const next = prev - 0.12;
        return next > 0.1 ? parseFloat(next.toFixed(2)) : 0.1;
      });
      setEta((prev) => {
        const next = prev - 0.25;
        return next > 1.0 ? parseFloat(next.toFixed(1)) : 1.0;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [location]);

  if (locLoading || !location) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.secondary} />
        <Text style={[styles.loadingText, { color: theme.primary }]}>Calibrating telemetry coordinates...</Text>
      </View>
    );
  }

  // Dark Map Style to keep consistency
  const darkMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#1C1917' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#A8A29E' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#0C0A09' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#292524' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0C0A09' }] },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Tracking Live Rescue" />
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Dynamic Telemetry Display */}
        <TelemetryGrid
          eta={eta.toString()}
          distance={distance.toString()}
          speed={speed.toString()}
        />

        {/* Live Location Map */}
        <Card style={styles.mapCard}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude + 0.007,
              longitude: location.coords.longitude + 0.007,
              latitudeDelta: 0.04,
              longitudeDelta: 0.04,
            }}
            customMapStyle={darkMapStyle}
            scrollEnabled={true}
            zoomEnabled={true}
          >
            {/* User marker */}
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Incident Coordinate"
              pinColor="#EF4444"
            />

            {/* Responder marker */}
            {responderCoords && (
              <Marker
                coordinate={responderCoords}
                title="Rescue Ambulance"
                description="Fast-response medical unit"
                pinColor="#F59E0B"
              />
            )}

            {/* Simulated route line */}
            {responderCoords && (
              <Polyline
                coordinates={[
                  responderCoords,
                  { latitude: location.coords.latitude, longitude: location.coords.longitude }
                ]}
                strokeColor={theme.secondary}
                strokeWidth={3}
                lineDashPattern={[5, 5]}
              />
            )}
          </MapView>
          <View style={[styles.destinationBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MapPin size={16} color={theme.secondary} style={styles.destIcon} />
            <Text style={[styles.destinationText, { color: theme.primary }]} numberOfLines={1}>
              Routing to: {destination}
            </Text>
          </View>
        </Card>

        {/* Guardian Profile */}
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>ASSIGNED EMERGENCY GUARDIAN</Text>
        <GuardianProfile
          name="Inspector Vikram Singh"
          rating={4.9}
          vehicle={params.vehicleType === '2_wheeler' ? 'Agile Response Interceptor' : 'Heavy Patient ICU Ambulance'}
          plate="DL 3C AM 4423"
          phone="+91 98765 43210"
        />

        {/* Live Timeline logs */}
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>LIVE TELEMETRY TIMELINE</Text>
        <Card style={styles.timelineCard}>
          {logs.map((log, index) => (
            <View key={index} style={styles.timelineRow}>
              <View style={styles.timelineIndicator}>
                <View style={[styles.timelineDot, { backgroundColor: theme.secondary }]} />
                {index < logs.length - 1 && <View style={[styles.timelineLine, { backgroundColor: theme.border }]} />}
              </View>
              <View style={styles.timelineDetails}>
                <View style={styles.logHeader}>
                  <Text style={[styles.logText, { color: theme.primary }]}>{log.text}</Text>
                  <Text style={[styles.logTime, { color: theme.mutedForeground }]}>{log.time}</Text>
                </View>
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: 'bold',
    marginTop: 16,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  mapCard: {
    padding: 0,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
  },
  map: {
    width: '100%',
    height: 220,
  },
  destinationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderTopWidth: 1,
  },
  destIcon: {
    marginRight: 8,
  },
  destinationText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: 'bold',
    flex: 1,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 12,
    paddingLeft: 2,
  },
  timelineCard: {
    padding: 20,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 52,
  },
  timelineIndicator: {
    width: 24,
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    marginVertical: 4,
  },
  timelineDetails: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 16,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    flex: 0.8,
  },
  logTime: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});
