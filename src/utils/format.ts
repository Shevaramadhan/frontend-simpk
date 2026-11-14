import type { Bidang, OrderStatus, ProjectStatus, TaskStatus } from '../types';

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

/** Tanggal pendek seperti di desain: 07-08-2027. */
export function tanggalPendek(value: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
}

/** Rupiah seperti di desain: Rp.8.000.000. */
export function rupiahPendek(value: string | number | null): string {
  if (value === null) return '-';
  return `Rp.${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Number(value))}`;
}

/** Status pengajuan yang dilihat klien (desain My Project). */
export const CLIENT_ORDER_STATUS: Record<OrderStatus, { label: string; className: string }> = {
  BARU: { label: 'Menunggu Persetujuan', className: 'bg-[#bdbdbd] text-coal-deep border-[#5c5c5c]' },
  DITINJAU: { label: 'Perlu Diskusi Lebih Lanjut', className: 'bg-[#ffd27a] text-coal-deep border-[#a0701a]' },
  DISETUJUI: { label: 'Disetujui', className: 'bg-[#8fd694] text-coal-deep border-[#2f7d35]' },
  MENJADI_PROYEK: { label: 'Disetujui', className: 'bg-[#8fd694] text-coal-deep border-[#2f7d35]' },
  DITOLAK: { label: 'Ditolak', className: 'bg-[#f19b9b] text-coal-deep border-[#9c2b2b]' },
  DIBATALKAN: { label: 'Dibatalkan', className: 'bg-[#f19b9b] text-coal-deep border-[#9c2b2b]' },
};

export const BIDANG_LABEL: Record<Bidang, string> = {
  UI_UX: 'UI/UX',
  FRONTEND: 'FrontEnd',
  BACKEND: 'BackEnd',
  INTEGRASI: 'Integrasi',
};

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  PERSIAPAN: 'Persiapan',
  BERJALAN: 'Berjalan',
  DITUNDA: 'Ditunda',
  SELESAI: 'Selesai',
  DIBATALKAN: 'Dibatalkan',
};

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  BELUM_DIKERJAKAN: 'Belum dikerjakan',
  DIKERJAKAN: 'Dikerjakan',
  REVIEW: 'Review',
  SELESAI: 'Selesai',
};
