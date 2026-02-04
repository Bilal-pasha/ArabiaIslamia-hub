import axios from 'axios';
import { SECONDARY_API_URL } from '@/constants/env';

export const apiClient = axios.create({
  baseURL: SECONDARY_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      const path = window.location.pathname + window.location.search;
      if (!path.includes('/registration/admin/signin')) {
        const redirect = encodeURIComponent(path);
        window.location.href = `/registration/admin/signin?redirect=${redirect}`;
      }
      return Promise.reject(new Error('Unauthorized'));
    }
    const message =
      error.response?.data?.message ||
      (typeof error.response?.data === 'string' ? error.response.data : null) ||
      error.message ||
      'Request failed';
    return Promise.reject(new Error(message));
  }
);
