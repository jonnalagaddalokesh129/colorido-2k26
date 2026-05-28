import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLocation } from '../../context/LocationContext';
import { useSOS } from '../../hooks/useSOS';
import { sosService } from '../../services/sosService';
import { SOSAlert } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { SOSButton } from '../../components/SOSButton';
import { StatsBar } from '../../components/StatsBar';
import { FeatureCard } from '../../components/FeatureCard';
import { Card } from '../../components/ui/Card';
import { Typography } from '../../constants/typography';
import { Shield, MapPin, Mic, Radio, Network, WifiOff, ChevronRight } from 'lucide-react-native';

export default function HomeScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const { addressName, refreshLocation } = useLocation();
  const { voiceSOS, toggleVoiceSOS, triggerSOS, loading } = useSOS();
  const [recentSOS, setRecentSOS] = useState<SOSAlert[]>([]);

  const fetchHistory = async () => {
    try {
      const history = await sosService.getSOSHistory();
      setRecentSOS(history.slice(0, 3)); // show top 3
    } catch (e) {
      console.log('Failed to fetch local history', e);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleTriggerSOS = async () => {
    const alert = await triggerSOS();
    if (alert) {
      fetchHistory();
      router.push('/track-rescue');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Banner Area */}
      <View style={styles.topHeader}>
        <View style={styles.badgeRow}>
          <Badge label="System Active 24/7" variant="success" pulse />
          <Text style={[styles.welcome, { color: theme.mutedForeground }]}>
            Welcome, {user?.name ? user.name.split(' ')[0] : 'Rescuee'}
          </Text>
        </View>
        
        <Text style={[styles.title, { color: theme.primary, fontFamily: Typography.fontFamily.serif }]}>
          RoadSOS
        </Text>
      </View>

      {/* Main SOS Trigger Circle Section */}
      <View style={styles.sosSection}>
        <SOSButton onTriggerSOS={handleTriggerSOS} loading={loading} />
        
        <TouchableOpacity activeOpacity={0.8} onPress={refreshLocation} style={styles.locationContainer}>
          <MapPin size={16} color={theme.secondary} style={styles.locIcon} />
          <Text style={[styles.locationText, { color: theme.mutedForeground }]} numberOfLines={1}>
            {addressName || 'Retrieving GPS Coordinates...'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Voice SOS Toggle Card */}
      <View style={styles.padded}>
        <Card style={[styles.voiceCard, { borderColor: theme.border }]}>
          <View style={styles.voiceLeft}>
            <View style={[styles.voiceIconContainer, { backgroundColor: `${theme.secondary}15` }]}>
              <Mic size={20} color={theme.secondary} />
            </View>
            <View style={styles.voiceText}>
              <Text style={[styles.voiceTitle, { color: theme.primary }]}>Voice SOS Trigger</Text>
              <Text style={[styles.voiceDesc, { color: theme.mutedForeground }]}>
                Speak "HELP" repeatedly in danger
              </Text>
            </View>
          </View>
          <Switch
            value={voiceSOS}
            onValueChange={toggleVoiceSOS}
            trackColor={{ false: theme.border, true: theme.secondary }}
            thumbColor={theme.primary}
          />
        </Card>

        {/* Stats Bar */}
        <StatsBar />

        {/* Feature Cards Grid */}
        <Text style={[styles.sectionTitle, { color: theme.primary, fontFamily: Typography.fontFamily.serif }]}>
          Emergency Infrastructure
        </Text>
        
        <FeatureCard
          title="Trauma Network"
          description="Connected to 8 emergency trauma hospitals across Bangalore for instant critical admission."
          icon={<Network size={20} color={theme.secondary} />}
        />
        
        <FeatureCard
          title="GPS Routing"
          description="Smart route optimization ensures the nearest vehicle is dispatched, getting help to you faster."
          icon={<Radio size={20} color={theme.secondary} />}
        />
        
        <FeatureCard
          title="Offline-First Mode"
          description="Alerts are backed up and automatically broadcast via emergency SMS in weak coverage areas."
          icon={<WifiOff size={20} color={theme.secondary} />}
        />

        {/* Recent SOS Alert History Section */}
        {recentSOS.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={[styles.sectionTitle, { color: theme.primary, fontFamily: Typography.fontFamily.serif }]}>
                Recent Dispatches
              </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/sos-history')} style={styles.viewAll}>
                <Text style={{ color: theme.secondary, fontSize: 13, fontWeight: '600' }}>View All</Text>
                <ChevronRight size={14} color={theme.secondary} />
              </TouchableOpacity>
            </View>
            
            {recentSOS.map((alert, index) => (
              <Card key={alert.id || index} style={styles.historyCard}>
                <View style={styles.historyLeft}>
                  <View style={[styles.historyIcon, { backgroundColor: alert.status === 'resolved' ? `${theme.success}15` : `${theme.destructive}15` }]}>
                    <Shield size={16} color={alert.status === 'resolved' ? theme.success : theme.destructive} />
                  </View>
                  <View>
                    <Text style={[styles.historyStatus, { color: theme.primary }]}>
                      Emergency SOS {alert.status.toUpperCase()}
                    </Text>
                    <Text style={[styles.historyDate, { color: theme.mutedForeground }]}>
                      {new Date(alert.created_at).toLocaleDateString()} at {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.historyLoc, { color: theme.mutedForeground }]} numberOfLines={1}>
                  {alert.location_name || 'Coordinates Registered'}
                </Text>
              </Card>
            ))}
          </View>
        )}
      </View>
      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  welcome: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  title: {
    fontSize: Typography.fontSize.title,
    fontWeight: '900',
  },
  sosSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 16,
    maxWidth: '90%',
  },
  locIcon: {
    marginRight: 6,
  },
  locationText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  padded: {
    paddingHorizontal: 24,
  },
  voiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 20,
  },
  voiceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  voiceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  voiceText: {
    flex: 1,
  },
  voiceTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 2,
  },
  voiceDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 14,
    marginTop: 12,
  },
  historySection: {
    marginTop: 24,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyCard: {
    padding: 14,
    marginBottom: 10,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  historyStatus: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  historyDate: {
    fontSize: 10,
    marginTop: 2,
  },
  historyLoc: {
    fontSize: 12,
    paddingLeft: 42,
  },
  bottomSpace: {
    height: 40,
  },
});
