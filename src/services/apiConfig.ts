import axios, { isAxiosError } from 'axios';
import { tokenAuth } from './tokenAuth';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((config) => {
  const token = tokenAuth.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLogin = error.config?.url === '/auth/login';
    if (error.response?.status === 401 && !isLogin && tokenAuth.get()) {
      tokenAuth.clear();
      window.location.assign('/login');
    }
    return Promise.reject(error);
  },
);

export function errorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string; errors?: Record<string, string[]> }>(error) && error.response?.data) {
    const { message, errors } = error.response.data;
    const firstField = errors ? Object.values(errors)[0]?.[0] : undefined;
    if (firstField || message) return firstField ?? (message as string);
  }
  return 'Tidak dapat terhubung ke server.';
}

export default api;
