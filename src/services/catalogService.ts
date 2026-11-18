import type { ApiResponse, Portfolio, Service, ServiceInput } from '../types';
import api from './apiConfig';

export async function listServices() {
  const { data } = await api.get<ApiResponse<Service[]>>('/services');
  return data.data;
}

export async function listAllServices() {
  const { data } = await api.get<ApiResponse<Service[]>>('/services/all');
  return data.data;
}

export async function listPortfolios() {
  const { data } = await api.get<ApiResponse<Portfolio[]>>('/portfolios');
  return data.data;
}

/** Semua portofolio, untuk dikelola Marketing (REQ-F01). */
export async function listAllPortfolios() {
  const { data } = await api.get<ApiResponse<Portfolio[]>>('/portfolios/all');
  return data.data;
}

export interface PortfolioInput {
  judul: string;
  deskripsi: string;
  serviceId: number | null;
  tahun: number | null;
}

export async function savePortfolio(input: PortfolioInput, id?: number) {
  if (id) await api.put(`/portfolios/${id}`, input);
  else await api.post('/portfolios', input);
}

export async function deletePortfolio(id: number) {
  await api.delete(`/portfolios/${id}`);
}

export async function saveService(input: ServiceInput, id?: number) {
  if (id) await api.put(`/services/${id}`, input);
  else await api.post('/services', input);
}
