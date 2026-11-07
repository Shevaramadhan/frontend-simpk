import type { ApiResponse, User } from '../types';
import api from './apiConfig';

export async function login(email: string, password: string) {
  const { data } = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', { email, password });
  return data.data;
}

export async function me() {
  const { data } = await api.get<ApiResponse<User>>('/auth/me');
  return data.data;
}
