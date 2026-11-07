import type { Role } from '../types';

// Menu mengikuti matriks hak akses BRS 6.3. Pembatasan sebenarnya tetap dilakukan di Backend.
export const ROLE_LABEL: Record<Role, string> = {
  MARKETING: 'Marketing',
  OPERASIONAL: 'Operasional',
  TIM: 'Tim',
  KLIEN: 'Klien',
};

export const INTERNAL_MENU: Partial<Record<Role, { to: string; label: string }[]>> = {
  MARKETING: [
    { to: '/app', label: 'Ringkasan' },
    { to: '/app/katalog', label: 'Daftar Jasa' },
    { to: '/app/pesanan', label: 'Pesanan' },
    { to: '/app/klien', label: 'Klien' },
    { to: '/app/tagihan', label: 'Tagihan dan Pembayaran' },
  ],
  OPERASIONAL: [
    { to: '/app', label: 'Ringkasan' },
    { to: '/app/proyek', label: 'Proyek dan Tim' },
    { to: '/app/pengguna', label: 'Pengguna' },
  ],
  TIM: [
    { to: '/app', label: 'Tugas Saya' },
    { to: '/app/proyek', label: 'Proyek Saya' },
  ],
};

export function homePath(role: Role): string {
  return role === 'KLIEN' ? '/portal' : '/app';
}

// Klien yang datang dari tombol pesan di katalog dilanjutkan ke form pesan dengan jasa pilihannya.
export function afterAuthPath(role: Role, jasa: string | null): string {
  return role === 'KLIEN' && jasa ? `/portal/pesan?jasa=${encodeURIComponent(jasa)}` : homePath(role);
}
