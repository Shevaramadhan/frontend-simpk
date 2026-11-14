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

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  noWhatsapp: string;
}

export interface AuthResult {
  token: string;
  user: User;
}

export type InternalRole = Exclude<Role, 'KLIEN'>;

export interface InternalUser {
  id: number;
  name: string;
  email: string;
  role: InternalRole;
  isActive: boolean;
  /** Jumlah project yang pernah diikuti (kartu worker). */
  jumlahProject: number;
}

export interface Member {
  userId: number;
  name: string;
  posisi: string;
  isPm: boolean;
}

export interface ProjectSummary {
  id: number;
  kode: string;
  nama: string;
  status: ProjectStatus;
  tglMulai: string | null;
  targetSelesai: string | null;
  klien: string;
  nomorPesanan: string;
  kebutuhan: string;
  tenggatDiharapkan: string | null;
  progres: number;
  progresBidang: Record<Bidang, number | null>;
  nilai?: string;
  isPm: boolean;
}

export interface ProjectDetail extends ProjectSummary {
  documents: OrderDocument[];
  members?: Member[];
}

export interface Task {
  id: number;
  judul: string;
  status: TaskStatus;
  persentase: number;
  bidang: Bidang;
  bobot: number;
  deskripsi: string | null;
  tenggat: string | null;
  assignee: { id: number; name: string } | null;
}

export interface TeamUpdate {
  id: number;
  persentase: number;
  catatanTeknis: string | null;
  catatanKlien: string | null;
  createdAt: string;
  task: { id: number; judul: string };
  author: { name: string };
}

export interface Order {
  id: number;
  nomor: string;
  judul: string;
  kebutuhan: string;
  anggaran: string | null;
  nilaiDisepakati: string | null;
  tenggatDiharapkan: string | null;
  status: OrderStatus;
  alasanDitolak: string | null;
  createdAt: string;
  client: { id: number; namaInstansi: string };
  service: { id: number; nama: string } | null;
  projects: { id: number; status: ProjectStatus; _count?: { members: number } }[];
}

export type ProjectStatus = 'PERSIAPAN' | 'BERJALAN' | 'DITUNDA' | 'SELESAI' | 'DIBATALKAN';
export type TaskStatus = 'BELUM_DIKERJAKAN' | 'DIKERJAKAN' | 'REVIEW' | 'SELESAI';
export type Bidang = 'UI_UX' | 'FRONTEND' | 'BACKEND' | 'INTEGRASI';
export type InvoiceStatus = 'DRAF' | 'DITERBITKAN' | 'LUNAS';
export type PaymentStatus = 'MENUNGGU_VERIFIKASI' | 'DITERIMA' | 'DITOLAK';

export interface Payment {
  id: number;
  jumlah: string;
  tglTransfer: string;
  statusVerifikasi: PaymentStatus;
  alasanDitolak: string | null;
  verifiedAt: string | null;
  createdAt: string;
}

export interface Invoice {
  id: number;
  nomor: string;
  keterangan: string;
  total: string;
  tglTerbit: string;
  jatuhTempo: string | null;
  status: InvoiceStatus;
  payments: Payment[];
}

export interface InvoiceWithOrder extends Invoice {
  order: { id: number; nomor: string; judul: string; client: { namaInstansi: string } };
}

export interface OrderDocument {
  id: number;
  namaFile: string;
  mime: string;
  ukuran: number;
}

/** Isi halaman Payment dan Detail klien. Catatan teknis tidak pernah ikut. */
export interface OrderDetail extends Omit<Order, 'projects'> {
  documents: OrderDocument[];
  invoices: Invoice[];
  project: {
    id: number;
    kode: string;
    status: ProjectStatus;
    progres: number;
    progresBidang: Record<Bidang, number | null>;
  } | null;
}

export interface ClientUpdate {
  id: number;
  persentase: number;
  catatanKlien: string;
  createdAt: string;
  task: { id: number; judul: string };
}

export interface OrderInput {
  judul: string;
  kebutuhan: string;
  anggaran: number | null;
  tenggatDiharapkan: string | null;
  dokumen: File[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
