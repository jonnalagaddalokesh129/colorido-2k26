import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from './ui/Card';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../constants/typography';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
}) => {
  const { theme } = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${theme.border}50` }]}>
          {icon}
        </View>
        <Text style={[styles.title, { color: theme.primary, fontFamily: Typography.fontFamily.serif }]}>
          {title}
        </Text>
      </View>
      <Text style={[styles.desc, { color: theme.mutedForeground }]}>
        {description}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
  desc: {
    fontSize: 13,
    lineHeight: 18,
    paddingLeft: 48,
  },
});
