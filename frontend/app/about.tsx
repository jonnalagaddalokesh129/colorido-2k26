import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Header } from '../components/ui/Header';
import { Card } from '../components/ui/Card';
import { Typography } from '../constants/typography';
import { Info, Shield, MapPin, PhoneCall, Zap, Clock } from 'lucide-react-native';

export default function AboutScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="About RoadSOS" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroSection}>
          <Text style={[styles.heroTitle, { color: theme.primary, fontFamily: Typography.fontFamily.serif }]}>
            Seconds Save Lives
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.mutedForeground }]}>
            RoadSOS is a premium, real-time emergency responder network designed to coordinate immediate assistance for motorists in distress.
          </Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Zap size={20} color={theme.secondary} />
            <Text style={[styles.cardTitle, { color: theme.primary }]}>Our Mission</Text>
          </View>
          <Text style={[styles.cardBody, { color: theme.mutedForeground }]}>
            To bridge the gap between incident and assistance. By integrating advanced GPS mapping, automated notifications, and specialized trauma networks, RoadSOS ensures that help arrives when every second counts.
          </Text>
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.primary, fontFamily: Typography.fontFamily.serif }]}>
          Core System Features
        </Text>

        <View style={styles.featureGrid}>
          <View style={[styles.featureCol, { borderColor: theme.border }]}>
            <MapPin size={24} color={theme.secondary} />
            <Text style={[styles.featureLabel, { color: theme.primary }]}>Live GPS Telemetry</Text>
            <Text style={[styles.featureDesc, { color: theme.mutedForeground }]}>
              Pinpoint-accurate locator broadcasts your exact location to responder networks.
            </Text>
          </View>

          <View style={[styles.featureCol, { borderColor: theme.border }]}>
            <Shield size={24} color={theme.secondary} />
            <Text style={[styles.featureLabel, { color: theme.primary }]}>Trauma Network</Text>
            <Text style={[styles.featureDesc, { color: theme.mutedForeground }]}>
              Immediate dispatch of specialized ICU ambulances and emergency crews.
            </Text>
          </View>

          <View style={[styles.featureCol, { borderColor: theme.border }]}>
            <Clock size={24} color={theme.secondary} />
            <Text style={[styles.featureLabel, { color: theme.primary }]}>Under 3 Min ETA</Text>
            <Text style={[styles.featureDesc, { color: theme.mutedForeground }]}>
              Fastest response windows supported by live routing and traffic bypass.
            </Text>
          </View>

          <View style={[styles.featureCol, { borderColor: theme.border }]}>
            <PhoneCall size={24} color={theme.secondary} />
            <Text style={[styles.featureLabel, { color: theme.primary }]}>Guardian Contacts</Text>
            <Text style={[styles.featureDesc, { color: theme.mutedForeground }]}>
              Automated notifications with your live status dispatched to your emergency contacts.
            </Text>
          </View>
        </View>

        <Card style={[styles.card, styles.teamCard]}>
          <View style={styles.cardHeader}>
            <Info size={20} color={theme.secondary} />
            <Text style={[styles.cardTitle, { color: theme.primary }]}>System Operations</Text>
          </View>
          <Text style={[styles.cardBody, { color: theme.mutedForeground }]}>
            RoadSOS operates 24/7/365. This application is a fully integrated proof of concept featuring modern API capabilities, robust MongoDB Atlas database architecture, and native mobile client responsiveness.
          </Text>
          <Text style={[styles.versionText, { color: theme.mutedForeground }]}>
            Version 1.0.0 (Production Build)
          </Text>
        </Card>
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
  heroSection: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 24,
    paddingVertical: 10,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: Typography.fontSize.sm,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  card: {
    padding: 20,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cardBody: {
    fontSize: Typography.fontSize.sm,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingLeft: 4,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  featureCol: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  featureLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  featureDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  teamCard: {
    marginTop: 8,
  },
  versionText: {
    fontSize: 11,
    marginTop: 16,
    textAlign: 'right',
  },
});
