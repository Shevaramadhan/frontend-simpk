import type { ApiResponse, InternalRole, InternalUser } from '../types';
import api from './apiConfig';

export async function listUsers() {
  const { data } = await api.get<ApiResponse<InternalUser[]>>('/users');
  return data.data;
}

export async function createUser(input: { name: string; email: string; password: string; role: InternalRole; keahlian?: string }) {
  await api.post('/users', input);
}

export async function listWorkers() {
  return (await listUsers()).filter((user) => user.role === 'TIM' && user.isActive);
}

/** Daftar keahlian yang sudah dipakai, untuk saran isian dan saringan Pilih Worker. */
export function keahlianList(users: { keahlian: string | null }[]) {
  const seen = new Map<string, string>();
  for (const { keahlian } of users) if (keahlian && !seen.has(keahlian.toLowerCase())) seen.set(keahlian.toLowerCase(), keahlian);
  return [...seen.values()].sort((a, b) => a.localeCompare(b, 'id'));
}

export async function updateUser(id: number, input: { email?: string; isActive?: boolean; keahlian?: string }) {
  await api.patch(`/users/${id}`, input);
}
