import type { Bidang, OrderStatus, ProjectStatus, TaskStatus } from '../types';

export function rupiah(value: string | number | null): string {
  if (value === null) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value));
}

export function tanggal(value: string | null): string {
  if (!value) return '-';
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(value));
}

export function tanggalJam(value: string | null): string {
  if (!value) return '-';
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
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

/** Status pengajuan dari sisi Marketing (Figma Request Page). */
export const MARKETING_ORDER_STATUS: Record<OrderStatus, { label: string; className: string }> = {
  BARU: { label: 'Baru', className: 'border border-zinc-200 bg-zinc-100 text-zinc-700' },
  DITINJAU: { label: 'Diskusi Lanjut', className: 'border border-amber-200 bg-amber-50 text-amber-800' },
  DISETUJUI: { label: 'Diterima', className: 'border border-emerald-200 bg-emerald-50 text-emerald-700' },
  MENJADI_PROYEK: { label: 'Dikerjakan', className: 'border border-emerald-200 bg-emerald-50 text-emerald-700' },
  DITOLAK: { label: 'Ditolak', className: 'border border-red-200 bg-red-50 text-red-700' },
  DIBATALKAN: { label: 'Dibatalkan', className: 'border border-red-200 bg-red-50 text-red-700' },
};

/** Rupiah ringkas untuk kartu angka besar: 18 JT, 2,5 JT, 750 RB. */
export function rupiahRingkas(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} JT`;
  if (value >= 1_000) return `${Math.round(value / 1_000)} RB`;
  return String(value);
}

/** Status pengajuan yang dilihat klien (desain My Project). */
export const CLIENT_ORDER_STATUS: Record<OrderStatus, { label: string; className: string }> = {
  BARU: { label: 'Menunggu Persetujuan', className: 'border-zinc-200 bg-zinc-100 text-zinc-700' },
  DITINJAU: { label: 'Perlu Diskusi Lebih Lanjut', className: 'border-amber-200 bg-amber-50 text-amber-800' },
  DISETUJUI: { label: 'Disetujui', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  MENJADI_PROYEK: { label: 'Disetujui', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  DITOLAK: { label: 'Ditolak', className: 'border-red-200 bg-red-50 text-red-700' },
  DIBATALKAN: { label: 'Dibatalkan', className: 'border-red-200 bg-red-50 text-red-700' },
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
