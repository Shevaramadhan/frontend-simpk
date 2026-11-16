import type { CSSProperties } from 'react';
import logoFooter from '../../assets/landing/footer-logo.webp';
import ikonCopyright from '../../assets/landing/ikon-copyright.svg';
import ikonFacebook from '../../assets/landing/ikon-facebook.svg';
import ikonInstagram from '../../assets/landing/ikon-instagram.svg';
import ikonSpotify from '../../assets/landing/ikon-spotify.svg';
import ikonX from '../../assets/landing/ikon-vector-a.svg';
import ikonYoutube from '../../assets/landing/ikon-vector-b.svg';
import ikonTiktok from '../../assets/landing/ikon-vector-c.svg';
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

const SOCIALS = [
  { src: ikonInstagram, alt: 'Instagram', style: ikon(55) },
  { src: ikonFacebook, alt: 'Facebook', style: ikon(50) },
  { src: ikonSpotify, alt: 'Spotify', style: ikon(55) },
  { src: ikonX, alt: 'X', style: ikon(45) },
  { src: ikonTiktok, alt: 'TikTok', style: ikon(45) },
  { src: ikonYoutube, alt: 'YouTube', style: ikon(55, 45) },
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
          <p className="mt-2 text-justify font-poppins leading-[normal]" style={{ fontSize: skala(22) }}>
            {SIMPK_DESCRIPTION}
          </p>
        </div>
        <div className="text-center">
          <p className="font-poppins font-bold leading-[normal]" style={{ fontSize: skala(24) }}>
            FOLLOW US
          </p>
          <div className="mx-auto mt-[clamp(14px,1.6vw,24px)] grid w-fit grid-cols-3 place-items-center gap-x-[clamp(14px,1.4vw,20px)] gap-y-[clamp(10px,1.6vw,24px)]">
            {SOCIALS.map((item) => (
              <img key={item.alt} alt={item.alt} className="block max-w-none" style={item.style} src={item.src} />
            ))}
          </div>
        </div>
        <div className="text-center font-poppins leading-[normal]" style={{ fontSize: skala(22) }}>
          <p className="font-spartan font-bold" style={{ fontSize: skala(27) }}>
            CONTACT US
          </p>
          <p className="mt-[clamp(10px,1.6vw,24px)] whitespace-pre">{CONTACT.phone}</p>
          <p>{CONTACT.email}</p>
          <div className="mt-[clamp(12px,1.6vw,24px)] flex flex-wrap items-center justify-center gap-x-[clamp(6px,0.6vw,10px)] gap-y-2">
            <img alt="Neo Telemetri" className="max-w-none object-cover" style={{ width: skala(200), height: skala(35) }} src={logoFooter} />
            <span className="flex items-center gap-1.5">
              <img alt="" className="block max-w-none" style={ikon(25)} src={ikonCopyright} />
              2026. All Rights Reserved
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
