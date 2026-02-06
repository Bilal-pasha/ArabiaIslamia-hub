import axios, { type AxiosError } from 'axios';
import { MAIN_WEBSITE_API_URL } from '@/constants/env';
import { adminRoutes } from '@/constants/route';

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
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname || '';
      if (path.startsWith('/admin') && path !== adminRoutes.login) {
        const redirect = encodeURIComponent(path);
        window.location.href = `${adminRoutes.login}?redirect=${redirect}`;
        return Promise.reject(new Error('Unauthorized'));
      }
    }
    const data = error.response?.data as { message?: string; errors?: Array<{ property: string; constraints: string[] }> } | undefined;
    let message = data?.message || (typeof error.response?.data === 'string' ? error.response.data : null) || error.message || 'Request failed';
    if (data?.errors?.length) {
      const details = data.errors.map((e) => `${e.property}: ${e.constraints?.join(', ') || ''}`).join('; ');
      message = `${message} (${details})`;
    }
    return Promise.reject(new Error(message));
  }
);
