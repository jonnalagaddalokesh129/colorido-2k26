import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, ActivityIndicator, Vibration } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Typography } from '../constants/typography';
import { Button } from './ui/Button';

interface SOSButtonProps {
  onTriggerSOS: () => Promise<any>;
  loading?: boolean;
}

export const SOSButton: React.FC<SOSButtonProps> = ({
  onTriggerSOS,
  loading = false,
}) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [timerActive, setTimerActive] = useState(false);
  
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.4);

  // Pulse animation using Reanimated
  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.2, { duration: 1300 }),
      -1,
      true
    );
    opacity.value = withRepeat(
      withTiming(0.05, { duration: 1300 }),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  // Countdown timer for emergency cancellation window
  useEffect(() => {
    let interval: any;
    if (timerActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
        Vibration.vibrate(100); // Pulse haptic feedback during countdown
      }, 1000);
    } else if (timerActive && countdown === 0) {
      setTimerActive(false);
      setModalVisible(false);
      triggerEmergency();
    }
    return () => clearInterval(interval);
  }, [timerActive, countdown]);

  const handlePress = () => {
    Vibration.vibrate([0, 150, 50, 150]); // Initial alert haptic vibration
    setCountdown(5);
    setTimerActive(true);
    setModalVisible(true);
  };

  const cancelEmergency = () => {
    setTimerActive(false);
    setModalVisible(false);
    Vibration.vibrate(50);
  };

  const triggerEmergency = async () => {
    Vibration.vibrate([0, 500, 100, 500]); // Heavy emergency alert vibration
    try {
      await onTriggerSOS();
    } catch (err: any) {
      // Errors are handled inside hook
    }
  };

  return (
    <View style={styles.container}>
      {/* Pulse rings */}
      <Animated.View
        style={[
          styles.pulseRing,
          { borderColor: theme.destructive },
          pulseStyle,
        ]}
      />
      
      <TouchableOpacity
        disabled={loading}
        onPress={handlePress}
        activeOpacity={0.85}
        style={[styles.buttonWrapper, { borderColor: theme.secondary }]}
      >
        <LinearGradient
          colors={[theme.destructive, theme.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator size="large" color={theme.primary} />
          ) : (
            <View style={styles.textContainer}>
              <Text style={[styles.sosText, { color: theme.primary }]}>SOS</Text>
              <Text style={[styles.subText, { color: theme.primary }]}>PRESS TO TRIGGER</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* SOS Trigger Confirmation Countdown Overlay */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(12, 10, 9, 0.95)' }]}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: theme.destructive, fontFamily: Typography.fontFamily.serif }]}>
              DISPATCHING RESCUE
            </Text>
            
            <View style={[styles.countdownCircle, { borderColor: theme.destructive }]}>
              <Text style={[styles.countdownNumber, { color: theme.primary }]}>
                {countdown}
              </Text>
            </View>
            
            <Text style={[styles.modalSubtitle, { color: theme.mutedForeground }]}>
              A rescue operation will be initiated and dispatch teams will receive your coordinates in {countdown} seconds.
            </Text>
            
            <Button
              title="CANCEL DISPATCH"
              variant="outline"
              style={StyleSheet.flatten([styles.cancelBtn, { borderColor: theme.destructive }])}
              textStyle={{ color: theme.destructive }}
              onPress={cancelEmergency}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 220,
    height: 220,
  },
  pulseRing: {
    position: 'absolute',
    width: 196,
    height: 196,
    borderRadius: 98,
    borderWidth: 8,
  },
  buttonWrapper: {
    width: 176,
    height: 176,
    borderRadius: 88,
    borderWidth: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  sosText: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 2,
  },
  subText: {
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
    marginTop: 4,
    opacity: 0.9,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    alignItems: 'center',
    width: '100%',
  },
  modalTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 1.5,
  },
  countdownCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  countdownNumber: {
    fontSize: 48,
    fontWeight: '900',
  },
  modalSubtitle: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  cancelBtn: {
    width: '80%',
  },
});
