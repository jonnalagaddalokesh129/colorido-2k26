import React from 'react';
import { StyleSheet, Text, View, Linking, Platform } from 'react-native';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../constants/typography';
import { PoliceStation } from '../types';
import { Star } from 'lucide-react-native';

interface PoliceCardProps {
  station: PoliceStation;
}

export const PoliceCard: React.FC<PoliceCardProps> = ({ station }) => {
  const { theme } = useTheme();

  const handleCall = () => {
    Linking.openURL(`tel:${station.phone.replace(/\s+/g, '')}`);
  };

  const handleDirections = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${station.latitude},${station.longitude}`;
    const label = encodeURIComponent(station.name);
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
      default: `https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`
    });
    Linking.openURL(url || '');
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.name, { color: theme.primary, fontFamily: Typography.fontFamily.serif }]} numberOfLines={2}>
          {station.name}
        </Text>
        <View style={styles.ratingContainer}>
          <Star size={16} color={theme.secondary} fill={theme.secondary} />
          <Text style={[styles.rating, { color: theme.secondary }]}>{station.rating}</Text>
        </View>
      </View>
      
      <Text style={[styles.address, { color: theme.mutedForeground }]} numberOfLines={2}>{station.address}</Text>
      
      {station.distance !== undefined && station.distance !== null && (
        <Text style={[styles.distance, { color: theme.secondary }]}>
          Distance: {station.distance} km away
        </Text>
      )}

      {station.jurisdiction && (
        <Text style={[styles.jurisdiction, { color: theme.mutedForeground }]}>
          Jurisdiction: {station.jurisdiction}
        </Text>
      )}

      <View style={styles.actions}>
        <Button
          title="CALL PRECINCT"
          variant="secondary"
          onPress={handleCall}
          style={styles.actionBtn}
          textStyle={styles.btnText}
        />
        <Button
          title="DIRECTIONS"
          variant="primary"
          onPress={handleDirections}
          style={styles.actionBtn}
          textStyle={styles.btnText}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    flex: 1,
    paddingRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rating: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    marginLeft: 4,
  },
  address: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  distance: {
    fontSize: 13,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: 8,
  },
  jurisdiction: {
    fontSize: 12,
    marginBottom: 16,
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
    fontSize: Typography.fontSize.sm,
  },
});
