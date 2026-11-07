import type { ApiResponse, Client, ClientInput } from '../types';
import api from './apiConfig';

export async function listClients() {
  const { data } = await api.get<ApiResponse<Client[]>>('/clients');
  return data.data;
}

export async function createClient(input: ClientInput) {
  await api.post('/clients', input);
}

export async function setClientActive(id: number, isActive: boolean) {
  await api.patch(`/clients/${id}`, { isActive });
}
