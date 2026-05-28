import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, RefreshControl, Linking, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { sosService } from '../services/sosService';
import { SOSAlert } from '../types';
import { Header } from '../components/ui/Header';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Typography } from '../constants/typography';
import { AlertOctagon, Calendar, MapPin, Mic, Navigation2, ShieldAlert } from 'lucide-react-native';

export default function SOSHistoryScreen() {
  const { theme } = useTheme();
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const data = await sosService.getSOSHistory();
      setAlerts(data);
    } catch (e) {
      console.log('Error fetching SOS history', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory(false);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateStr;
    }
  };

  const getStatusColor = (status: SOSAlert['status']) => {
    switch (status) {
      case 'resolved':
        return { bg: '#065F46', text: '#34D399', label: 'RESOLVED' }; // Dark green
      case 'in_progress':
        return { bg: '#92400E', text: '#FBBF24', label: 'IN PROGRESS' }; // Dark amber
      case 'active':
        return { bg: '#991B1B', text: '#FCA5A5', label: 'ACTIVE DISPATCH' }; // Dark red
      case 'pending':
      default:
        return { bg: '#1E293B', text: '#94A3B8', label: 'PENDING' }; // Slate
    }
  };

  const openMap = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Rescue Incidents Log" />
      
      {loading ? (
        <LoadingSpinner message="Loading emergency archives..." />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.secondary}
              colors={[theme.secondary]}
            />
          }
        >
          <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>
            A comprehensive historic record of SOS alert broadcasts triggered from this device. Pull down to refresh log.
          </Text>

          {alerts.length === 0 ? (
            <EmptyState
              title="No SOS History"
              description="You have not triggered any SOS alarms. In case of an emergency, use the primary SOS broadcast on the home dashboard."
              icon={<ShieldAlert size={36} color={theme.mutedForeground} />}
            />
          ) : (
            alerts.map((alert) => {
              const statusCfg = getStatusColor(alert.status);
              return (
                <Card key={alert.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.badgeRow}>
                      <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                        <Text style={[styles.statusText, { color: statusCfg.text }]}>
                          {statusCfg.label}
                        </Text>
                      </View>
                      {alert.voice_sos && (
                        <View style={[styles.voiceBadge, { borderColor: theme.border }]}>
                          <Mic size={11} color={theme.secondary} style={styles.micIcon} />
                          <Text style={[styles.voiceText, { color: theme.secondary }]}>VOICE</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.date, { color: theme.mutedForeground }]}>
                      {formatDate(alert.created_at)}
                    </Text>
                  </View>

                  <View style={styles.locationContainer}>
                    <MapPin size={16} color={theme.secondary} style={styles.locIcon} />
                    <Text style={[styles.locationName, { color: theme.primary }]} numberOfLines={2}>
                      {alert.location_name || 'Coordinates Registered'}
                    </Text>
                  </View>

                  <View style={[styles.coordsRow, { borderColor: theme.border }]}>
                    <View>
                      <Text style={[styles.coordsLabel, { color: theme.mutedForeground }]}>COORDINATES</Text>
                      <Text style={[styles.coordsVal, { color: theme.primary }]}>
                        {alert.latitude.toFixed(6)}, {alert.longitude.toFixed(6)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[styles.mapBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
                      onPress={() => openMap(alert.latitude, alert.longitude)}
                    >
                      <Navigation2 size={14} color={theme.secondary} />
                      <Text style={[styles.mapBtnText, { color: theme.secondary }]}>View Map</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              );
            })
          )}
        </ScrollView>
      )}
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
  card: {
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  voiceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  micIcon: {
    marginRight: 3,
  },
  voiceText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 11,
    fontWeight: Typography.fontWeight.medium,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  locIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  locationName: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: 18,
  },
  coordsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  coordsLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  coordsVal: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  mapBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});
