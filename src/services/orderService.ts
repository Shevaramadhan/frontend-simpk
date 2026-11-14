import type { ApiResponse, ClientUpdate, Invoice, InvoiceWithOrder, Order, OrderDetail, OrderInput, OrderStatus, Payment } from '../types';
import api from './apiConfig';

export async function listOrders() {
  const { data } = await api.get<ApiResponse<Order[]>>('/orders');
  return data.data;
}

export async function getOrder(id: number) {
  const { data } = await api.get<ApiResponse<OrderDetail>>(`/orders/${id}`);
  return data.data;
}

/** Form pengajuan dikirim sebagai multipart karena membawa dokumen pendukung. */
export async function createOrder(input: OrderInput) {
  const form = new FormData();
  form.append('judul', input.judul);
  form.append('kebutuhan', input.kebutuhan);
  if (input.anggaran !== null) form.append('anggaran', String(input.anggaran));
  if (input.tenggatDiharapkan) form.append('tenggatDiharapkan', input.tenggatDiharapkan);
  if (input.serviceId) form.append('serviceId', String(input.serviceId));
  input.dokumen.forEach((file) => form.append('dokumen', file));
  const { data } = await api.post<ApiResponse<Order>>('/orders', form);
  return data.data;
}

export async function approveOrder(id: number, nilaiDisepakati: number) {
  await api.post(`/orders/${id}/approve`, { nilaiDisepakati });
}

export async function updateOrderStatus(id: number, status: OrderStatus, alasanDitolak?: string) {
  await api.patch(`/orders/${id}/status`, { status, alasanDitolak });
}

export async function createInvoice(orderId: number, input: { keterangan: string; total: number; jatuhTempo: string | null }) {
  const { data } = await api.post<ApiResponse<Invoice>>(`/orders/${orderId}/invoices`, input);
  return data.data;
}

export async function listInvoices() {
  const { data } = await api.get<ApiResponse<InvoiceWithOrder[]>>('/invoices');
  return data.data;
}

export async function payInvoice(invoiceId: number, input: { jumlah: number; tglTransfer: string; bukti: File }) {
  const form = new FormData();
  form.append('jumlah', String(input.jumlah));
  form.append('tglTransfer', input.tglTransfer);
  form.append('bukti', input.bukti);
  const { data } = await api.post<ApiResponse<Payment>>(`/invoices/${invoiceId}/payments`, form);
  return data.data;
}

export async function verifyPayment(paymentId: number, status: 'DITERIMA' | 'DITOLAK', alasanDitolak?: string) {
  await api.patch(`/payments/${paymentId}`, { status, alasanDitolak });
}

export async function listClientUpdates(projectId: number) {
  const { data } = await api.get<ApiResponse<ClientUpdate[]>>(`/projects/${projectId}/updates`);
  return data.data;
}
