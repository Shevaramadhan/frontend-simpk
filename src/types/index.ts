export type Role = 'MARKETING' | 'OPERASIONAL' | 'TIM' | 'KLIEN';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export type OrderStatus = 'BARU' | 'DITINJAU' | 'DISETUJUI' | 'DITOLAK' | 'DIBATALKAN' | 'MENJADI_PROYEK';

// Nilai Decimal dikirim backend sebagai string.
export interface Service {
  id: number;
  nama: string;
  deskripsi: string;
  hargaMin: string;
  hargaMax: string;
  estimasiHari: number;
  isVisible: boolean;
}

export interface ServiceInput {
  nama: string;
  deskripsi: string;
  hargaMin: number;
  hargaMax: number;
  estimasiHari: number;
  isVisible: boolean;
}

export interface Portfolio {
  id: number;
  judul: string;
  deskripsi: string;
  tahun: number | null;
  service: { id: number; nama: string } | null;
}

export interface Client {
  id: number;
  namaInstansi: string;
  jenisKlien: string;
  noWhatsapp: string | null;
  alamat: string | null;
  isActive: boolean;
  user: { id: number; name: string; email: string };
}

export interface ClientInput {
  name: string;
  email: string;
  password: string;
  namaInstansi: string;
  jenisKlien: string;
  noWhatsapp: string;
  alamat: string;
}

export interface Order {
  id: number;
  nomor: string;
  kebutuhan: string;
  anggaran: string | null;
  tenggatDiharapkan: string | null;
  status: OrderStatus;
  alasanDitolak: string | null;
  createdAt: string;
  client: { id: number; namaInstansi: string };
  service: { id: number; nama: string } | null;
}

export interface OrderInput {
  serviceId: number | null;
  kebutuhan: string;
  anggaran: number | null;
  tenggatDiharapkan: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
