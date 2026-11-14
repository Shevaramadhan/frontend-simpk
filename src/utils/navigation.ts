import type { Role } from '../types';

// Label role. Menu tiap role ada di StaffLayout dan ClientLayout; pembatasan sebenarnya tetap di Backend.
export const ROLE_LABEL: Record<Role, string> = {
  MARKETING: 'Marketing',
  OPERASIONAL: 'Operasional',
  TIM: 'Tim',
  KLIEN: 'Klien',
};

export function homePath(role: Role): string {
  return role === 'KLIEN' ? '/portal' : '/app';
}

// Klien yang datang dari tombol pesan di katalog dilanjutkan ke form pesan dengan jasa pilihannya.
export function afterAuthPath(role: Role, jasa: string | null): string {
  return role === 'KLIEN' && jasa ? `/portal/pesan?jasa=${encodeURIComponent(jasa)}` : homePath(role);
}
