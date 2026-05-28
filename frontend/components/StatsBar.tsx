import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from './ui/Card';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../constants/typography';

export const StatsBar: React.FC = () => {
  const { theme } = useTheme();

  const stats = [
    { label: 'RESP. TIME', value: '<3 MIN' },
    { label: 'RANGE', value: '50 KM' },
    { label: 'SERVICE', value: '24/7' },
  ];

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        {stats.map((stat, index) => (
          <React.Fragment key={index}>
            <View style={styles.stat}>
              <Text style={[styles.val, { color: theme.secondary, fontFamily: Typography.fontFamily.serif }]}>
                {stat.value}
              </Text>
              <Text style={[styles.lbl, { color: theme.mutedForeground }]}>
                {stat.label}
              </Text>
            </View>
            {index < stats.length - 1 && <View style={[styles.divider, { backgroundColor: theme.border }]} />}
          </React.Fragment>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 20,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  val: {
    fontSize: Typography.fontSize.base,
    fontWeight: '900',
    marginBottom: 4,
  },
  lbl: {
    fontSize: 8,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: 32,
  },
});
