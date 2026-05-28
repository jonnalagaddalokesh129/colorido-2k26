import React from 'react';
import { StyleSheet, Text, View, Linking, Platform } from 'react-native';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../constants/typography';
import { TowingService } from '../types';
import { Star } from 'lucide-react-native';

interface TowingCardProps {
  service: TowingService;
}

export const TowingCard: React.FC<TowingCardProps> = ({ service }) => {
  const { theme } = useTheme();

  const handleCall = () => {
    Linking.openURL(`tel:${service.phone.replace(/\s+/g, '')}`);
  };

  const handleDirections = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${service.latitude},${service.longitude}`;
    const label = encodeURIComponent(service.name);
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
      default: `https://www.google.com/maps/search/?api=1&query=${service.latitude},${service.longitude}`
    });
    Linking.openURL(url || '');
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <Text style={[styles.name, { color: theme.primary, fontFamily: Typography.fontFamily.serif }]} numberOfLines={2}>
            {service.name}
          </Text>
          <Badge
            label={service.available ? "AVAILABLE" : "UNAVAILABLE"}
            variant={service.available ? "success" : "destructive"}
            style={styles.badge}
          />
        </View>
        <View style={styles.ratingContainer}>
          <Star size={16} color={theme.secondary} fill={theme.secondary} />
          <Text style={[styles.rating, { color: theme.secondary }]}>{service.rating}</Text>
        </View>
      </View>
      
      <Text style={[styles.address, { color: theme.mutedForeground }]} numberOfLines={2}>{service.address}</Text>
      
      {service.distance !== undefined && service.distance !== null && (
        <Text style={[styles.distance, { color: theme.secondary }]}>
          Distance: {service.distance} km away
        </Text>
      )}

      <View style={styles.pillsContainer}>
        {service.vehicle_types.map((type, index) => (
          <View key={index} style={[styles.pill, { backgroundColor: `${theme.border}40`, borderColor: theme.border }]}>
            <Text style={[styles.pillText, { color: theme.mutedForeground }]}>{type}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Button
          title="DISPATCH TOW"
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
  titleArea: {
    flex: 1,
    paddingRight: 8,
  },
  name: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 6,
  },
  badge: {
    marginTop: 4,
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
    marginBottom: 12,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 6,
    marginBottom: 6,
  },
  pillText: {
    fontSize: 10,
    fontWeight: Typography.fontWeight.semibold,
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
