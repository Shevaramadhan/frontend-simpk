import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import ikonProfilOranye from '../../assets/staff/ikon-profil-oranye.svg';

// Potongan tampilan halaman Operasional dan Tim (Figma 115:162 dan 116:235).

/** Panel gelap pembungkus isi halaman, dengan judul Magic Hat di tengah. */
export function StaffPanel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-[30px] bg-coal-deep px-4 pb-6 pt-5 sm:px-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-magic text-[clamp(30px,5vh,48px)] uppercase leading-none text-flame">{title}</h1>
        {action}
      </div>
      {children}
    </section>
  );
}

export const pillButton =
  'inline-flex items-center justify-center gap-2 rounded-[24px] bg-flame px-6 py-2 font-moon text-lg text-coal transition-colors hover:bg-[#e05600] disabled:opacity-60';

/** Kartu project krem berbingkai oranye dengan tombol Detail. */
export function ProjectCard({ index, title, subtitle, note, to }: { index: number; title: string; subtitle: string; note: ReactNode; to: string }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.05, duration: 0.4 }}
      className="flex flex-col gap-3 rounded-[24px] border-[3px] border-flame bg-cream px-5 py-4 sm:flex-row sm:items-center"
    >
      <div className="min-w-0 flex-1">
        <h2 className="line-clamp-2 break-words font-magic text-[clamp(22px,3.6vh,36px)] uppercase leading-tight text-flame" title={title}>
          {title}
        </h2>
        <p className="font-moon text-sm text-coal-deep/70">{subtitle}</p>
        <div className="mt-1 font-moon text-base">{note}</div>
      </div>
      <Link to={to} className={pillButton}>
        Detail
      </Link>
    </motion.article>
  );
}

export function Avatar({ size = 'size-[clamp(48px,8vh,72px)]' }: { size?: string }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-[16px] border-[3px] border-flame bg-[rgba(41,41,41,0.7)] ${size}`}>
      <img alt="" src={ikonProfilOranye} className="h-1/2 w-1/2" />
    </span>
  );
}

export function workerNote(jumlah: number) {
  return jumlah > 0 ? (
    <span className="text-[#14aa00]">Sudah membuat {jumlah} project selama kepengurusan</span>
  ) : (
    <span className="text-[#ff4d4d]">Belum ada membuat project selama kepengurusan</span>
  );
}

/** Tabel krem berbingkai oranye dengan kepala gelap, untuk halaman pengurus. */
export function BrandTable({ head, children, empty, minWidth = 'min-w-[640px]' }: { head: string[]; children: ReactNode; empty?: string; minWidth?: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border-[3px] border-flame bg-cream">
      <table className={`w-full ${minWidth} font-moon text-base text-coal-deep`}>
        <thead className="bg-coal text-left text-flame">
          <tr>
            {head.map((label) => (
              <th key={label} className="px-4 py-2 font-normal">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
      {empty && <p className="px-4 py-4 text-center font-moon text-coal-deep/70">{empty}</p>}
    </div>
  );
}

export const tableCell = 'border-t border-coal/10 px-4 py-2 align-middle';
export const linkButton = 'font-moon text-sm text-flame underline underline-offset-4 hover:text-coal-deep';

/** Label status berwarna; warna selalu disertai teks. */
export function StatusPill({ label, className }: { label: string; className: string }) {
  return <span className={`inline-block whitespace-nowrap rounded-xl px-3 py-1 font-moon text-sm ${className}`}>{label}</span>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-[24px] border-[3px] border-dashed border-flame/60 px-5 py-8 text-center font-moon text-lg text-cream/80">{children}</p>;
}

export function Loading() {
  return <p className="py-10 text-center font-moon text-xl text-cream/80">Memuat...</p>;
}

export function LoadError({ message }: { message: string }) {
  return (
    <p role="alert" className="py-10 text-center font-moon text-xl text-[#ff8a8a]">
      {message}
    </p>
  );
}
