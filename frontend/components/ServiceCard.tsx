import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from './ui/Card';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../constants/typography';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onPress: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  onPress,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: `${theme.border}60` }]}>
            {icon}
          </View>
          <Text style={[styles.title, { color: theme.primary, fontFamily: Typography.fontFamily.serif }]} numberOfLines={2}>
            {title}
          </Text>
          <Text style={[styles.desc, { color: theme.mutedForeground }]} numberOfLines={3}>
            {description}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: 14,
  },
  card: {
    padding: 16,
    height: 180,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 6,
  },
  desc: {
    fontSize: 11,
    lineHeight: 15,
  },
});
