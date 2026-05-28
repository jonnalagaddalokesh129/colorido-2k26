import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { Header } from '../components/ui/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Typography } from '../constants/typography';
import { ShieldAlert, Compass, Navigation2, CheckCircle2 } from 'lucide-react-native';

export default function BookRideScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  
  const [destination, setDestination] = useState('');
  const [vehicleType, setVehicleType] = useState<'2_wheeler' | '3_wheeler'>('2_wheeler');
  const [errors, setErrors] = useState<{ destination?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    if (!destination.trim()) {
      setErrors({ destination: 'Please specify a destination hospital or rescue zone.' });
      return;
    }
    setErrors({});
    setLoading(true);

    // Simulate booking API call
    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: '/track-rescue',
        params: {
          destination,
          vehicleType
        }
      });
    }, 1200);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Book Emergency Ride" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Stylized graphic element */}
        <Card style={[styles.heroCard, { borderColor: theme.border }]}>
          <View style={[styles.iconBg, { backgroundColor: `${theme.secondary}15` }]}>
            <Compass size={40} color={theme.secondary} />
          </View>
          <Text style={[styles.heroTitle, { color: theme.primary, fontFamily: Typography.fontFamily.serif }]}>
            Secure Urgent Transit
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.mutedForeground }]}>
            Dispatch specialized medical response vehicles to transport you safely to the nearest advanced trauma hub.
          </Text>
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.primary }]}>DISPATCH LOGISTICS</Text>

        <Input
          label="Destination Trauma Centre"
          placeholder="e.g. Apollo Hospital Critical Care Unit"
          value={destination}
          onChangeText={(text) => {
            setDestination(text);
            if (errors.destination) setErrors({});
          }}
          error={errors.destination}
        />

        <Text style={[styles.label, { color: theme.mutedForeground }]}>VEHICLE CLASS</Text>
        
        <View style={styles.selectorContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.selectorCard,
              {
                borderColor: vehicleType === '2_wheeler' ? theme.secondary : theme.border,
                backgroundColor: vehicleType === '2_wheeler' ? `${theme.secondary}10` : theme.card,
              }
            ]}
            onPress={() => setVehicleType('2_wheeler')}
          >
            <View style={styles.selectorHeader}>
              <Text style={[styles.vehicleTitle, { color: theme.primary }]}>Rapid 2-Wheeler</Text>
              {vehicleType === '2_wheeler' && <CheckCircle2 size={16} color={theme.secondary} />}
            </View>
            <Text style={[styles.vehicleDesc, { color: theme.mutedForeground }]}>
              First-response paramedic unit. Highly agile for congested city corridors.
            </Text>
            <View style={styles.etaContainer}>
              <Navigation2 size={12} color={theme.secondary} style={styles.etaIcon} />
              <Text style={[styles.etaText, { color: theme.secondary }]}>ETA: Under 3 Min</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.selectorCard,
              {
                borderColor: vehicleType === '3_wheeler' ? theme.secondary : theme.border,
                backgroundColor: vehicleType === '3_wheeler' ? `${theme.secondary}10` : theme.card,
              }
            ]}
            onPress={() => setVehicleType('3_wheeler')}
          >
            <View style={styles.selectorHeader}>
              <Text style={[styles.vehicleTitle, { color: theme.primary }]}>Heavy 3-Wheeler</Text>
              {vehicleType === '3_wheeler' && <CheckCircle2 size={16} color={theme.secondary} />}
            </View>
            <Text style={[styles.vehicleDesc, { color: theme.mutedForeground }]}>
              Fully equipped patient transporter / heavy flatbed recovery dispatch.
            </Text>
            <View style={styles.etaContainer}>
              <Navigation2 size={12} color={theme.secondary} style={styles.etaIcon} />
              <Text style={[styles.etaText, { color: theme.secondary }]}>ETA: Under 7 Min</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Button
          title="CONFIRM EMERGENCY DISPATCH"
          onPress={handleConfirm}
          loading={loading}
          variant="primary"
          style={styles.confirmBtn}
        />
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
  heroCard: {
    padding: 24,
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 28,
  },
  iconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: 8,
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  selectorCard: {
    width: '48.5%',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    justifyContent: 'space-between',
  },
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  vehicleTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: 'bold',
  },
  vehicleDesc: {
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 12,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  etaIcon: {
    marginRight: 4,
  },
  etaText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  confirmBtn: {
    width: '100%',
  },
});
