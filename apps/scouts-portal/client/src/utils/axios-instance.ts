import axios from 'axios';

const API_BASE =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_SCOUTS_API_URL || 'http://localhost:8003')
    : process.env.SCOUTS_API_URL || process.env.NEXT_PUBLIC_SCOUTS_API_URL || 'http://localhost:8003';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      const path = window.location.pathname + window.location.search;
      if (!path.includes('/login') && !path.includes('/signup') && !path.includes('/forgot-password')) {
        const redirect = encodeURIComponent(path);
        window.location.href = `/login${redirect ? `?redirect=${redirect}` : ''}`;
      }
      return Promise.reject(new Error('Unauthorized'));
    }
    const message =
      error.response?.data?.message ||
      (typeof error.response?.data === 'string' ? error.response.data : null) ||
      error.message ||
      'Request failed';
    return Promise.reject(new Error(message));
  },
);
