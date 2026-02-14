import axios from 'axios';

const baseURL =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_LIBRARY_API_URL || 'http://localhost:8004')
    : '';

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);
