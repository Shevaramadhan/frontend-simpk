import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import ikonProfilOranye from '../../assets/staff/ikon-profil-oranye.svg';

/** Panel putih bersih pembungkus isi halaman pengurus. */
export function StaffPanel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex flex-1 flex-col rounded-2xl border border-zinc-200/90 bg-white px-4 pb-4 pt-4 shadow-xs sm:px-6 sm:pt-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3">
        <h1 className="font-magic text-[clamp(18px,2.5vh,24px)] font-bold tracking-tight text-zinc-900">{title}</h1>
        {action}
      </div>
      {children}
    </section>
  );
}

export const pillButton =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-flame px-4 py-2 font-moon text-sm font-semibold text-white shadow-xs transition-all hover:bg-[#e05600] disabled:opacity-50';

/** Kartu project modern berbingkai tipis dengan tombol Detail. */
export function ProjectCard({ index, title, subtitle, note, to }: { index: number; title: string; subtitle: string; note: ReactNode; to: string }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.35 }}
      className="flex flex-col gap-3 rounded-xl border border-zinc-200/90 bg-zinc-50/50 px-4 py-3 transition-all hover:border-flame/40 hover:bg-white hover:shadow-sm sm:flex-row sm:items-center"
    >
      <div className="min-w-0 flex-1">
        <h2 className="line-clamp-1 break-words font-magic text-[clamp(14px,1.9vh,17px)] font-semibold leading-snug text-zinc-900" title={title}>
          {title}
        </h2>
        <p className="font-moon text-xs text-zinc-500">{subtitle}</p>
        <div className="mt-0.5 font-moon text-xs font-medium">{note}</div>
      </div>
      <Link to={to} className={pillButton}>
        Detail
      </Link>
    </motion.article>
  );
}

export function Avatar({ size = 'size-[clamp(40px,5.6vh,52px)]' }: { size?: string }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-xl border border-flame/20 bg-flame/10 ${size}`}>
      <img alt="" src={ikonProfilOranye} className="h-1/2 w-1/2" />
    </span>
  );
}

export function workerNote(jumlah: number) {
  return jumlah > 0 ? (
    <span className="text-emerald-600">Sudah mengerjakan {jumlah} project</span>
  ) : (
    <span className="text-amber-600">Belum ada project pada kepengurusan ini</span>
  );
}

/** Tabel modern bersih untuk halaman pengurus. */
export function BrandTable({ head, children, empty, minWidth = 'min-w-[640px]' }: { head: string[]; children: ReactNode; empty?: string; minWidth?: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
      <table className={`w-full ${minWidth} font-moon text-sm text-zinc-700`}>
        <thead className="border-b border-zinc-200 bg-zinc-50/80 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <tr>
            {head.map((label) => (
              <th key={label} className="px-4 py-2.5">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">{children}</tbody>
      </table>
      {empty && <p className="px-4 py-6 text-center font-moon text-sm text-zinc-500">{empty}</p>}
    </div>
  );
}

export const tableCell = 'px-4 py-2.5 align-middle text-sm text-zinc-700';
export const linkButton = 'font-moon text-xs font-semibold text-flame hover:text-[#d45100] hover:underline underline-offset-4';

/** Label status berwarna lembut; warna selalu disertai teks. */
export function StatusPill({ label, className }: { label: string; className: string }) {
  return <span className={`inline-flex items-center whitespace-nowrap rounded-lg px-2.5 py-1 font-moon text-xs font-semibold ${className}`}>{label}</span>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 px-5 py-8 text-center font-moon text-sm text-zinc-500">{children}</p>;
}

export function Loading() {
  return <p className="py-10 text-center font-moon text-sm text-zinc-500">Memuat...</p>;
}

export function LoadError({ message }: { message: string }) {
  return (
    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-center font-moon text-sm font-medium text-red-700">
      {message}
    </p>
  );
}
