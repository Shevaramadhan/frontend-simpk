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

export async function saveService(input: ServiceInput, id?: number) {
  if (id) await api.put(`/services/${id}`, input);
  else await api.post('/services', input);
}
