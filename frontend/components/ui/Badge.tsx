import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { Typography } from '../../constants/typography';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'destructive' | 'info';
  pulse?: boolean;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'info',
  pulse = false,
  style,
}) => {
  const { theme } = useTheme();
  
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (pulse) {
      opacity.value = withRepeat(
        withTiming(0.3, { duration: 1000 }),
        -1,
        true
      );
    } else {
      opacity.value = 1;
    }
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: `${theme.success}15`, border: theme.success, text: theme.success };
      case 'warning':
        return { bg: `${theme.secondary}15`, border: theme.secondary, text: theme.secondary };
      case 'destructive':
        return { bg: `${theme.destructive}15`, border: theme.destructive, text: theme.destructive };
      case 'info':
      default:
        return { bg: `${theme.info}15`, border: theme.info, text: theme.info };
    }
  };

  const { bg, border, text } = getColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          borderColor: border,
        },
        style,
      ]}
    >
      {pulse && (
        <Animated.View
          style={[
            styles.dot,
            { backgroundColor: border },
            animatedStyle,
          ]}
        />
      )}
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 99,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  text: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
