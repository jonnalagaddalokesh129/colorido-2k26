import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from '../context/LocationContext';
import { Header } from '../components/ui/Header';
import { TelemetryGrid } from '../components/TelemetryGrid';
import { GuardianProfile } from '../components/GuardianProfile';
import { Card } from '../components/ui/Card';
import { Typography } from '../constants/typography';
import { Clock, ShieldCheck, MapPin, Compass, Navigation } from 'lucide-react-native';

export default function TrackRescueScreenWeb() {
  const { theme } = useTheme();
  const { location, loading: locLoading } = useLocation();
  const params = useLocalSearchParams();
  const destination = (params.destination as string) || 'Apollo Critical Care Unit';

  // Live Telemetry states
  const [eta, setEta] = useState(5.0);
  const [distance, setDistance] = useState(2.4);
  const [speed, setSpeed] = useState(54);
  
  // Responder mock position offset
  const [responderOffset, setResponderOffset] = useState({ x: 30, y: -40 });
  
  // Timeline log events
  const [logs, setLogs] = useState([
    { time: 'Just Now', text: 'Telemetry synchronization active', done: true },
    { time: '1 Min Ago', text: 'Responder dispatched & en-route', done: true },
    { time: '2 Min Ago', text: 'SOS broadcast handshake completed', done: true },
  ]);

  // Handle simulation loops
  useEffect(() => {
    if (!location) return;

    const interval = setInterval(() => {
      // Simulate responder getting closer visually
      setResponderOffset((prev) => {
        const nextX = prev.x - prev.x * 0.08;
        const nextY = prev.y - prev.y * 0.08;
        return { x: nextX, y: nextY };
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

        {/* Live Location Web Tactical Map */}
        <Card style={styles.mapCard}>
          <View style={[styles.radarBackdrop, { backgroundColor: '#0B0A09' }]}>
            {/* Grid layout */}
            <View style={[styles.gridLine, styles.gridH, { borderBottomColor: `${theme.border}45` }]} />
            <View style={[styles.gridLine, styles.gridV, { borderRightColor: `${theme.border}45` }]} />
            <View style={[styles.gridCircle, { borderColor: `${theme.secondary}15` }]} />

            {/* Target Beacon (Your Location) */}
            <View style={[styles.radarMarker, { left: '50%', top: '50%', transform: [{ translateX: -8 }, { translateY: -8 }] }]}>
              <View style={[styles.markerPulse, { backgroundColor: theme.destructive }]} />
              <View style={[styles.markerDot, { backgroundColor: theme.destructive }]} />
              <Text style={[styles.markerLabel, { color: theme.primary }]}>YOU</Text>
            </View>

            {/* Dispatch Operator Beacon (Approaching) */}
            <View
              style={[
                styles.radarMarker,
                {
                  left: `${50 + responderOffset.x * 0.3}%`,
                  top: `${50 + responderOffset.y * 0.3}%`,
                  transform: [{ translateX: -8 }, { translateY: -8 }],
                }
              ]}
            >
              <View style={[styles.markerPulse, { backgroundColor: theme.secondary }]} />
              <View style={[styles.markerDot, { backgroundColor: theme.secondary }]} />
              <Text style={[styles.markerLabel, { color: theme.secondary }]}>RESCUE</Text>
            </View>

            {/* Tactical overlay */}
            <View style={styles.scanningBadge}>
              <Clock size={10} color={theme.secondary} style={styles.scanIcon} />
              <Text style={[styles.scanningText, { color: theme.secondary }]}>TACTICAL TELEMETRY LOCK</Text>
            </View>
          </View>
          
          <View style={[styles.destinationBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MapPin size={16} color={theme.secondary} style={styles.destIcon} />
            <Text style={[styles.destinationText, { color: theme.primary }]} numberOfLines={1}>
              Routing Transit Vector to: {destination}
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
  radarBackdrop: {
    width: '100%',
    height: 220,
    position: 'relative',
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
  },
  gridH: {
    top: '50%',
    left: 0,
    right: 0,
    borderBottomWidth: 1,
  },
  gridV: {
    left: '50%',
    top: 0,
    bottom: 0,
    borderRightWidth: 1,
  },
  gridCircle: {
    position: 'absolute',
    left: '20%',
    right: '20%',
    top: '20%',
    bottom: '20%',
    borderRadius: 500,
    borderWidth: 1,
  },
  radarMarker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  markerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  markerPulse: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    opacity: 0.25,
  },
  markerLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 4,
    backgroundColor: '#1C1917',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  scanningBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C191795',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  scanIcon: {
    marginRight: 4,
  },
  scanningText: {
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 0.5,
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
