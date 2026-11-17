import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

// Unsur tampilan desain Figma "SIMPK By Neotelemetri" untuk halaman klien dan halaman masuk.
// Ukuran huruf sekitar 70% dari Figma: artboard 1440 px terasa terlalu besar bila ditampilkan apa adanya.
// Batas ukuran ditulis dalam rem agar ikut mengecil di halaman setelah login (lihat data-app-shell di index.css).

/** Kotak berlapis: gelap, garis krem, gelap. Dipakai untuk tombol utama seperti LETS MAKE A PROJECT. */
export function Framed({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <span className={`block bg-coal p-[4px] ${className}`}>
      <span className="block border-[4px] border-cream bg-coal">{children}</span>
    </span>
  );
}

const FRAMED_TEXT = 'block px-6 py-[clamp(0.375rem,1.3vh,0.75rem)] text-center font-magic uppercase text-flame transition-colors group-hover:text-cream';

export function FramedLink({ to, children, size = 'text-2xl' }: { to: string; children: ReactNode; size?: string }) {
  return (
    <Link to={to} className="group inline-block transition-transform hover:-translate-y-0.5 active:translate-y-0">
      <Framed>
        <span className={`${FRAMED_TEXT} ${size}`}>{children}</span>
      </Framed>
    </Link>
  );
}

export function FramedButton({ children, size = 'text-2xl', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { size?: string }) {
  return (
    <button type="button" className={`group inline-block transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-60 ${className}`} {...props}>
      <Framed>
        <span className={`${FRAMED_TEXT} ${size}`}>{children}</span>
      </Framed>
    </button>
  );
}

/** Judul oranye bergaris tepi gelap (SIGN IN, LOGIN, SIMPK). */
export function OutlinedTitle({ as: Tag = 'h1', className = '', children }: { as?: 'h1' | 'h2' | 'p'; className?: string; children: ReactNode }) {
  return <Tag className={`text-outline-dark font-magic uppercase leading-none text-flame ${className}`}>{children}</Tag>;
}

const INPUT_BASE = 'mt-1 w-full rounded-[16px] border-[4px] border-coal-deep px-4 py-[clamp(0.25rem,0.9vh,0.625rem)] font-moon text-[clamp(0.9375rem,2.3vh,1.125rem)] text-coal-deep outline-none transition focus:border-flame';

/** Input di atas kartu krem (Sign In, Login). */
export const brandInput = `${INPUT_BASE} bg-[#ffc49f66] focus:bg-[#ffc49f99]`;

/** Input bersih untuk halaman setelah login dan form pengajuan. */
export const brandInputSolid =
  'mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 font-moon text-sm text-zinc-900 shadow-2xs outline-none transition focus:border-flame focus:ring-2 focus:ring-flame/20';

export function BrandField({ id, label, tone = 'flame', children }: { id: string; label: string; tone?: 'flame' | 'cream'; children: ReactNode }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className={`block font-moon text-xs font-semibold sm:text-sm ${tone === 'flame' ? 'text-zinc-700' : 'text-zinc-700'}`}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function BrandError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 font-moon text-sm font-medium text-red-700">
      {message}
    </p>
  );
}

/** Kotak bergaris putus-putus (dokumen pendukung, unggah bukti). */
export const dashedBox = 'rounded-xl border-2 border-dashed border-zinc-300 transition-colors hover:border-flame';
