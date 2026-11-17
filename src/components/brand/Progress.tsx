import { motion } from 'motion/react';
import type { Bidang } from '../../types';
import { BIDANG_LABEL } from '../../utils/format';

export const BIDANG_ORDER: Bidang[] = ['UI_UX', 'FRONTEND', 'BACKEND', 'INTEGRASI'];

export function Bar({ value, track, fill }: { value: number; track: string; fill: string }) {
  return (
    <span className={`relative block h-2 flex-1 overflow-hidden rounded-full ${track}`}>
      <motion.span
        className={`absolute inset-y-0 left-0 rounded-full ${fill}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </span>
  );
}

function BidangProgress({ bidang, value }: { bidang: Bidang; value: number | null }) {
  const done = value === 100;
  return (
    <div className="rounded-xl border border-zinc-200/90 bg-zinc-50/60 p-3.5">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-moon text-xs font-semibold uppercase tracking-wide text-zinc-600">{BIDANG_LABEL[bidang]}</p>
        <span className={`font-moon text-sm font-bold ${value === null ? 'text-zinc-400' : done ? 'text-emerald-600' : 'text-flame'}`}>
          {value === null ? 'Belum ada tugas' : `${value}%`}
        </span>
      </div>
      <Bar value={value ?? 0} track="bg-zinc-200/80" fill={done ? 'bg-emerald-500' : 'bg-flame'} />
    </div>
  );
}

export function ProgressPanel({ progres, progresBidang }: { progres: number; progresBidang: Record<Bidang, number | null> }) {
  return (
    <div>
      <div className="rounded-xl border border-flame/20 bg-flame/5 p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-magic text-sm font-bold text-zinc-900 sm:text-base">Total Progres Pengerjaan</p>
          <span className="font-magic text-lg font-bold text-flame sm:text-xl">{progres}%</span>
        </div>
        <Bar value={progres} track="bg-zinc-200" fill="bg-flame" />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {BIDANG_ORDER.map((bidang) => (
          <BidangProgress key={bidang} bidang={bidang} value={progresBidang[bidang]} />
        ))}
      </div>
    </div>
  );
}
