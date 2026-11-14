import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

// Unsur tampilan desain Figma "SIMPK By Neotelemetri" untuk halaman klien dan halaman masuk.
// Ukuran huruf sekitar 70% dari Figma: artboard 1440 px terasa terlalu besar bila ditampilkan apa adanya.

/** Kotak berlapis: gelap, garis krem, gelap. Dipakai untuk tombol utama seperti LETS MAKE A PROJECT. */
export function Framed({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <span className={`block bg-coal p-[4px] ${className}`}>
      <span className="block border-[4px] border-cream bg-coal">{children}</span>
    </span>
  );
}

const FRAMED_TEXT = 'block px-6 py-[clamp(6px,1.3vh,12px)] text-center font-magic uppercase text-flame transition-colors group-hover:text-cream';

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

const INPUT_BASE = 'mt-1 w-full rounded-[16px] border-[4px] border-coal-deep px-4 py-[clamp(4px,0.9vh,10px)] font-moon text-[clamp(15px,2.3vh,18px)] text-coal-deep outline-none transition focus:border-flame';

/** Input di atas kartu krem (Sign In, Login). */
export const brandInput = `${INPUT_BASE} bg-[#ffc49f66] focus:bg-[#ffc49f99]`;

/** Input di atas panel gelap (form pengajuan). */
export const brandInputSolid = `${INPUT_BASE} bg-cream focus:bg-white`;

export function BrandField({ id, label, tone = 'flame', children }: { id: string; label: string; tone?: 'flame' | 'cream'; children: ReactNode }) {
  return (
    <div className="mb-[clamp(6px,1.6vh,16px)]">
      <label htmlFor={id} className={`block font-moon text-[clamp(15px,2.5vh,20px)] ${tone === 'flame' ? 'text-flame' : 'text-cream'}`}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function BrandError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mb-3 rounded-xl bg-[#9c2b2b] px-4 py-2 font-moon text-base text-cream">
      {message}
    </p>
  );
}

/** Kotak bergaris putus-putus oranye (dokumen pendukung, unggah bukti). */
export const dashedBox = 'rounded-[24px] border-[4px] border-dashed border-flame';
