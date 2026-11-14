import type { ApiResponse, Client } from '../types';
import api from './apiConfig';

export async function listClients() {
  const { data } = await api.get<ApiResponse<Client[]>>('/clients');
  return data.data;
}

/** Profil milik klien yang sedang masuk. */
export async function getMyProfile() {
  const { data } = await api.get<ApiResponse<Client>>('/clients/me');
  return data.data;
}

export async function updateMyProfile(input: { name: string; namaInstansi: string; jenisKlien: string; noWhatsapp: string; alamat: string }) {
  const { data } = await api.patch<ApiResponse<Client>>('/clients/me', input);
  return data.data;
}

export async function updateClientEmail(id: number, email: string) {
  await api.patch(`/clients/${id}/email`, { email });
}

export async function setClientActive(id: number, isActive: boolean) {
  await api.patch(`/clients/${id}`, { isActive });
}
