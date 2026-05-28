import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { Typography } from '../../constants/typography';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onDismiss: () => void;
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onDismiss,
  visible,
}) => {
  const { theme } = useTheme();
  const translateY = useSharedValue(-120);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(40, { damping: 15 });
      const timer = setTimeout(() => {
        translateY.value = withTiming(-120, { duration: 300 }, (finished) => {
          if (finished) {
            runOnJS(onDismiss)();
          }
        });
      }, 3500);
      return () => clearTimeout(timer);
    } else {
      translateY.value = withTiming(-120);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  if (!visible) return null;

  const getColors = () => {
    switch (type) {
      case 'success':
        return theme.success;
      case 'error':
        return theme.destructive;
      case 'info':
      default:
        return theme.secondary;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: getColors(),
        },
        animatedStyle,
      ]}
    >
      <View style={[styles.indicator, { backgroundColor: getColors() }]} />
      <Text style={[styles.text, { color: theme.primary }]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  indicator: {
    width: 6,
    height: 24,
    borderRadius: 3,
    marginRight: 12,
  },
  text: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    flex: 1,
  },
});
