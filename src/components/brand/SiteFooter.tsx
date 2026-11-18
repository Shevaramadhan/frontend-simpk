import type { CSSProperties } from 'react';
import logoFooter from '../../assets/landing/footer-logo.webp';
import IkonSosial, { type NamaSosial } from '../landing/IkonSosial';
import { SIMPK_DESCRIPTION } from '../landing/Parts';

// Footer halaman klien dan Daftar Jasa publik, mengikuti footer landing page (Figma "Group 97"):
// membentang selebar layar; kolom kiri menempel tepi kiri, FOLLOW US di tengah, CONTACT US dekat tepi kanan
// (proporsi 28 : 40 : 30 agar posisinya sama dengan landing page), bukan kotak di tengah.
// Ukuran mengikuti lebar layar seperti landing page. Kontak masih dari desain, menunggu kontak resmi Neo Telemetri.
export const CONTACT = { phone: '+62 897  1504 300', email: 'baktiunand2025@gmail.com' };

/**
 * Ukuran px pada artboard 1440 diubah menjadi ukuran yang ikut lebar layar, dengan batas bawah untuk layar kecil.
 * Batas atas 90% karena artboard landing page juga diperkecil menyesuaikan tinggi layar.
 */
const skala = (px: number) => `clamp(${Math.round(px * 0.7)}px, ${(px / 16).toFixed(2)}vw, ${Math.round(px * 0.9)}px)`;
const ikon = (w: number, h = w): CSSProperties => ({ width: skala(w), height: skala(h) });

const SOCIALS: { nama: NamaSosial; style: CSSProperties }[] = [
  { nama: 'Instagram', style: ikon(55) },
  { nama: 'Facebook', style: ikon(50) },
  { nama: 'Spotify', style: ikon(55) },
  { nama: 'X', style: ikon(45) },
  { nama: 'TikTok', style: ikon(45) },
  { nama: 'YouTube', style: ikon(55, 45) },
];

export default function SiteFooter() {
  return (
    <footer className="bg-coal px-5 py-8 text-cream md:px-[2vw] md:py-[clamp(20px,2.2vw,32px)]">
      <div className="grid gap-8 md:grid-cols-[minmax(0,28fr)_minmax(0,40fr)_minmax(0,30fr)] md:items-start md:gap-0">
        <div>
          <p
            className="text-center font-magic uppercase leading-[normal] text-sand [text-shadow:0px_4px_5px_rgba(0,0,0,0.25)]"
            style={{ fontSize: skala(48) }}
          >
            SIMPK NEOTELEMETRI
          </p>
          <p className="mt-2 text-justify font-body leading-[normal]" style={{ fontSize: skala(22) }}>
            {SIMPK_DESCRIPTION}
          </p>
        </div>
        <div className="text-center">
          <p className="font-body font-bold leading-[normal]" style={{ fontSize: skala(24) }}>
            FOLLOW US
          </p>
          <div className="mx-auto mt-[clamp(14px,1.6vw,24px)] grid w-fit grid-cols-3 place-items-center gap-x-[clamp(14px,1.4vw,20px)] gap-y-[clamp(10px,1.6vw,24px)]">
            {SOCIALS.map((item) => (
              <IkonSosial key={item.nama} nama={item.nama} className="text-cream" style={item.style} />
            ))}
          </div>
        </div>
        <div className="text-center font-body leading-[normal]" style={{ fontSize: skala(22) }}>
          <p className="font-body font-bold" style={{ fontSize: skala(27) }}>
            CONTACT US
          </p>
          <p className="mt-[clamp(10px,1.6vw,24px)] whitespace-pre">{CONTACT.phone}</p>
          <p>{CONTACT.email}</p>
          <div className="mt-[clamp(12px,1.6vw,24px)] flex flex-wrap items-center justify-center gap-x-[clamp(6px,0.6vw,10px)] gap-y-2">
            <img alt="Neo Telemetri" className="max-w-none object-cover" style={{ width: skala(200), height: skala(35) }} src={logoFooter} />
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true">©</span>
              2026. All Rights Reserved
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
