import type { OrderStatus } from '../types';

export function rupiah(value: string | number | null): string {
  if (value === null) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value));
}

export function tanggal(value: string | null): string {
  if (!value) return '-';
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(value));
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  BARU: 'Baru',
  DITINJAU: 'Ditinjau',
  DISETUJUI: 'Disetujui',
  DITOLAK: 'Ditolak',
  DIBATALKAN: 'Dibatalkan',
  MENJADI_PROYEK: 'Menjadi Proyek',
};
