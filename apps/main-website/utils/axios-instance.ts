import axios from 'axios';
import { MAIN_WEBSITE_API_URL } from '@/constants/env';

export const apiClient = axios.create({
  baseURL: MAIN_WEBSITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      (typeof error.response?.data === 'string' ? error.response.data : null) ||
      error.message ||
      'Request failed';
    return Promise.reject(new Error(message));
  }
);
