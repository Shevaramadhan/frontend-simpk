import type { ApiResponse, Order, OrderInput, OrderStatus } from '../types';
import api from './apiConfig';

export async function listOrders() {
  const { data } = await api.get<ApiResponse<Order[]>>('/orders');
  return data.data;
}

export async function createOrder(input: OrderInput) {
  const { data } = await api.post<ApiResponse<Order>>('/orders', input);
  return data.data;
}

export async function approveOrder(id: number, nilaiDisepakati: number) {
  await api.post(`/orders/${id}/approve`, { nilaiDisepakati });
}

export async function updateOrderStatus(id: number, status: OrderStatus, alasanDitolak?: string) {
  await api.patch(`/orders/${id}/status`, { status, alasanDitolak });
}
