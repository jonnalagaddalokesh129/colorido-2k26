import { Platform } from 'react-native';

// For local testing:
// Android Emulator uses 10.0.2.2, iOS Simulator uses localhost.
// IMPORTANT: If testing on a physical device via Expo Go, replace this with your machine's local IP address (e.g., 'http://192.168.1.10:8000').
export const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8000',
  default: 'http://localhost:8000',
});

export const API_TIMEOUT = 10000;
