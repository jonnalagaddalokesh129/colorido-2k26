import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../constants/api';
import { Storage } from '../utils/storage';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically add authorization token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await Storage.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Error attaching auth token to request', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Callback to trigger AuthContext logout on 401 unauthorized
let logoutCallback: (() => void) | null = null;

export const setOnUnauthorizedCallback = (callback: () => void) => {
  logoutCallback = callback;
};

// Response interceptor to handle session expiration (401)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Session expired or unauthorized - logging out...');
      await Storage.clearAll();
      if (logoutCallback) {
        logoutCallback();
      }
    }
    return Promise.reject(error);
  }
);
