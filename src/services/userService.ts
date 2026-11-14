import type { ApiResponse, InternalRole, InternalUser } from '../types';
import api from './apiConfig';

export async function listUsers() {
  const { data } = await api.get<ApiResponse<InternalUser[]>>('/users');
  return data.data;
}

export async function createUser(input: { name: string; email: string; password: string; role: InternalRole }) {
  await api.post('/users', input);
}

export async function listWorkers() {
  return (await listUsers()).filter((user) => user.role === 'TIM' && user.isActive);
}

export async function updateUser(id: number, input: { email?: string; isActive?: boolean }) {
  await api.patch(`/users/${id}`, input);
}
