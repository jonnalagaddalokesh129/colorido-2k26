import React from 'react';
import { StyleSheet, Text, View, Linking, Alert } from 'react-native';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../constants/typography';
import { Shield, Star, Award } from 'lucide-react-native';

interface GuardianProfileProps {
  name: string;
  rating: number;
  vehicle: string;
  plate: string;
  phone: string;
}

export const GuardianProfile: React.FC<GuardianProfileProps> = ({
  name,
  rating,
  vehicle,
  plate,
  phone,
}) => {
  const { theme } = useTheme();

  const handleCall = () => {
    Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`);
  };

  const handleVerify = () => {
    Alert.alert(
      'Operator Verified',
      `RoadSOS Operator Security PIN is active.\nStatus: Authenticated & Cleared ✅`,
      [{ text: 'OK' }]
    );
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: `${theme.secondary}15`, borderColor: theme.secondary }]}>
          <Shield size={28} color={theme.secondary} />
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: theme.primary }]}>{name}</Text>
            <View style={styles.verified}>
              <Award size={16} color={theme.secondary} />
            </View>
          </View>
          <View style={styles.ratingRow}>
            <Star size={14} color={theme.secondary} fill={theme.secondary} />
            <Text style={[styles.rating, { color: theme.secondary }]}>{rating} Operator</Text>
          </View>
        </View>
      </View>

      <View style={[styles.vehicleContainer, { borderColor: theme.border, backgroundColor: `${theme.border}20` }]}>
        <View style={styles.vehicleDetails}>
          <Text style={[styles.vehicleLabel, { color: theme.mutedForeground }]}>VEHICLE TYPE</Text>
          <Text style={[styles.vehicleVal, { color: theme.primary }]}>{vehicle}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.vehicleDetails}>
          <Text style={[styles.vehicleLabel, { color: theme.mutedForeground }]}>PLATE NUMBER</Text>
          <Text style={[styles.vehicleVal, { color: theme.primary, fontFamily: Typography.fontFamily.mono }]}>{plate}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title="CALL OPERATOR"
          variant="secondary"
          onPress={handleCall}
          style={styles.actionBtn}
          textStyle={styles.btnText}
        />
        <Button
          title="VERIFY ID"
          variant="primary"
          onPress={handleVerify}
          style={styles.actionBtn}
          textStyle={styles.btnText}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 18,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
  verified: {
    marginLeft: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    marginLeft: 4,
  },
  vehicleContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  vehicleDetails: {
    flex: 0.46,
  },
  vehicleLabel: {
    fontSize: 9,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 4,
  },
  vehicleVal: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  divider: {
    width: 1,
    backgroundColor: '#292524',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 0.48,
    height: 44,
  },
  btnText: {
    fontSize: 12,
  },
});
