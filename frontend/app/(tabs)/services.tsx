import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { ServiceCard } from '../../components/ServiceCard';
import { Typography } from '../../constants/typography';
import { Siren, Hospital, Truck, Shield, HeartPulse, Phone } from 'lucide-react-native';

export default function ServicesScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const services = [
    {
      title: 'Ambulance Dispatch',
      description: 'Emergency medical vehicle dispatch to your live GPS coordinates.',
      icon: <Siren size={22} color={theme.secondary} />,
      route: '/hospitals' as const,
    },
    {
      title: 'Trauma Centres',
      description: 'Browse nearby hospitals with trauma specialties and ratings.',
      icon: <Hospital size={22} color={theme.secondary} />,
      route: '/hospitals' as const,
    },
    {
      title: 'Vehicle Rescue',
      description: 'Towing and flatbed recovery for all vehicle types.',
      icon: <Truck size={22} color={theme.secondary} />,
      route: '/towing' as const,
    },
    {
      title: 'Police Support',
      description: 'Connect with nearest law enforcement for accident reports.',
      icon: <Shield size={22} color={theme.secondary} />,
      route: '/police' as const,
    },
    {
      title: 'First-Aid Coaching',
      description: 'Real-time step-by-step first aid guidance during emergencies.',
      icon: <HeartPulse size={22} color={theme.secondary} />,
      route: '/about' as const,
    },
    {
      title: 'Emergency Contacts',
      description: 'Manage trusted contacts notified instantly during SOS alerts.',
      icon: <Phone size={22} color={theme.secondary} />,
      route: '/emergency-contacts' as const,
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.primary, fontFamily: Typography.fontFamily.serif }]}>
          Emergency Services
        </Text>
        <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>
          Access our comprehensive suite of roadside emergency operations.
        </Text>
      </View>

      <View style={styles.grid}>
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            title={service.title}
            description={service.description}
            icon={service.icon}
            onPress={() => router.push(service.route)}
          />
        ))}
      </View>
      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 12,
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  bottomSpace: {
    height: 40,
  },
});
