import type { ReactNode } from 'react';

/** Bingkai dua garis untuk layar kecil, meniru tombol dan pil pada desain. */
export function Framed({ rounded = '', className = '', children }: { rounded?: string; className?: string; children: ReactNode }) {
  return (
    <span className={`block bg-coal p-[3px] ${rounded} ${className}`}>
      <span className={`block border-[3px] border-cream bg-coal ${rounded}`}>{children}</span>
    </span>
  );
}

export const SECTION = {
  home: 'home',
  latest: 'latest-project',
  projects: 'our-project',
  testi: 'testi',
  journey: 'journey',
} as const;

export const NAV_ITEMS = [
  { label: 'Home', id: SECTION.home },
  { label: 'latest project', id: SECTION.latest },
  { label: 'our project', id: SECTION.projects },
  { label: 'testi', id: SECTION.testi },
];

export const SIMPK_DESCRIPTION =
  'SIMPK Merupakan Website yang digunakan untuk memudahkan navigasi project dari tangan client hingga ke tangan pekerja dan kembali kepada client dengan sebuah hasil yang memuaskan';
