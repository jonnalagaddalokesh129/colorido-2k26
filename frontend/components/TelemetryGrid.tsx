import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from './ui/Card';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../constants/typography';

interface TelemetryGridProps {
  eta: string;
  distance: string;
  speed: string;
}

export const TelemetryGrid: React.FC<TelemetryGridProps> = ({
  eta,
  distance,
  speed,
}) => {
  const { theme } = useTheme();

  const items = [
    { label: 'EST. ARRIVAL', value: eta, unit: 'MIN' },
    { label: 'DISTANCE', value: distance, unit: 'KM' },
    { label: 'DISPATCH SPEED', value: speed, unit: 'KM/H' },
  ];

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <Card key={index} style={styles.card}>
          <Text style={[styles.label, { color: theme.mutedForeground }]} numberOfLines={1}>
            {item.label}
          </Text>
          <View style={styles.valueRow}>
            <Text style={[styles.value, { color: theme.primary, fontFamily: Typography.fontFamily.mono }]}>
              {item.value}
            </Text>
            <Text style={[styles.unit, { color: theme.secondary }]}>
              {item.unit}
            </Text>
          </View>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  card: {
    width: '31.5%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 96,
  },
  label: {
    fontSize: 9,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '900',
  },
  unit: {
    fontSize: 9,
    fontWeight: Typography.fontWeight.bold,
    marginLeft: 2,
  },
});
