import type { ApiResponse, Client } from '../types';
import api from './apiConfig';

export async function listClients() {
  const { data } = await api.get<ApiResponse<Client[]>>('/clients');
  return data.data;
}

export async function updateClientEmail(id: number, email: string) {
  await api.patch(`/clients/${id}/email`, { email });
}

export async function setClientActive(id: number, isActive: boolean) {
  await api.patch(`/clients/${id}`, { isActive });
}
