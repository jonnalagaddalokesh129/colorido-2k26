import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
import { LocationProvider } from '../context/LocationContext';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LocationProvider>
          <ToastProvider>
            <AuthProvider>
              <StatusBar style="light" />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="hospitals" />
                <Stack.Screen name="police" />
                <Stack.Screen name="towing" />
                <Stack.Screen name="book-ride" />
                <Stack.Screen name="track-rescue" />
                <Stack.Screen name="about" />
                <Stack.Screen name="emergency-contacts" />
                <Stack.Screen name="sos-history" />
              </Stack>
            </AuthProvider>
          </ToastProvider>
        </LocationProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
