import type { ApiResponse, AuthResult, RegisterInput, User } from '../types';
import api from './apiConfig';

export async function login(email: string, password: string) {
  const { data } = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', { email, password });
  return data.data;
}

export async function register(input: RegisterInput) {
  const { data } = await api.post<ApiResponse<AuthResult>>('/auth/register', input);
  return data.data;
}

export async function loginWithGoogle(credential: string) {
  const { data } = await api.post<ApiResponse<AuthResult>>('/auth/google', { credential });
  return data.data;
}

export async function forgotPassword(email: string) {
  await api.post('/auth/forgot-password', { email });
}

export async function resetPassword(token: string, passwordBaru: string) {
  await api.post('/auth/reset-password', { token, passwordBaru });
}

export async function changePassword(passwordLama: string, passwordBaru: string) {
  await api.post('/auth/change-password', { passwordLama, passwordBaru });
}

export async function me() {
  const { data } = await api.get<ApiResponse<User>>('/auth/me');
  return data.data;
}
