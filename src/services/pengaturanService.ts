import type { ApiResponse, Pengaturan } from '../types';
import api from './apiConfig';

export async function getPengaturan() {
  const { data } = await api.get<ApiResponse<Pengaturan>>('/pengaturan');
  return data.data;
}

export type PengaturanInput = Omit<Pengaturan, 'updatedAt' | 'contoh'>;

export async function savePengaturan(input: PengaturanInput) {
  const { data } = await api.put<ApiResponse<Pengaturan>>('/pengaturan', input);
  return data.data;
}
