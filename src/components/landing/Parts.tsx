import type { ReactNode } from 'react';
import garis from '../../assets/landing/garis-menu.svg';
import { box } from './Stage';

/** Garis pemisah tegak pada pil menu, strukturnya mengikuti Figma. */
export function Separator({ left, top }: { left: number; top: number }) {
  return (
    <div className="pointer-events-none absolute flex h-[35px] w-0 items-center justify-center" style={{ left, top }}>
      <div className="flex-none rotate-90">
        <div className="relative h-0 w-[35px]">
          <div className="absolute inset-[-2px_0_0_0]">
            <img alt="" className="block size-full max-w-none" src={garis} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Tiga lapis kotak pil menu (708 x 85) seperti di Figma: gelap, garis krem, gelap. */
export function PillLayers() {
  return (
    <>
      <div className="absolute rounded-[30px] border-5 border-coal bg-coal" style={box(0, 0, 708, 85)} />
      <div className="absolute rounded-[30px] border-5 border-cream bg-coal" style={box(10, 3, 688, 78)} />
      <div className="absolute rounded-[30px] border-5 border-coal bg-coal" style={box(23, 8, 664, 69)} />
    </>
  );
}

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
} as const;

export const NAV_ITEMS = [
  { label: 'Home', id: SECTION.home },
  { label: 'latest project', id: SECTION.latest },
  { label: 'our project', id: SECTION.projects },
  { label: 'testi', id: SECTION.testi },
];

export const SIMPK_DESCRIPTION =
  'SIMPK Merupakan Website yang digunakan untuk memudahkan navigasi project dari tangan client hingga ke tangan pekerja dan kembali kepada client dengan sebuah hasil yang memuaskan';
