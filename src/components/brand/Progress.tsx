import { motion } from 'motion/react';
import type { Bidang } from '../../types';
import { BIDANG_LABEL } from '../../utils/format';

// Total progres dan progres per bidang (Figma "Detail Page"). Dipakai halaman klien, Operasional, dan Tim.
export const BIDANG_ORDER: Bidang[] = ['UI_UX', 'FRONTEND', 'BACKEND', 'INTEGRASI'];

export function Bar({ value, track, fill }: { value: number; track: string; fill: string }) {
  return (
    <span className={`relative block h-2.5 flex-1 overflow-hidden rounded-full ${track}`}>
      <motion.span
        className={`absolute inset-y-0 left-0 rounded-full ${fill}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </span>
  );
}

function BidangProgress({ bidang, value }: { bidang: Bidang; value: number | null }) {
  const done = value === 100;
  return (
    <div>
      <p className="font-moon text-xl text-coal-deep">{BIDANG_LABEL[bidang]}</p>
      <div className={`mt-1 flex items-center gap-4 rounded-[18px] border-[4px] border-flame px-4 py-1.5 ${done ? 'bg-flame' : 'bg-cream'}`}>
        {value === null ? (
          <span className="font-moon text-base text-coal-deep/70">Belum ada tugas</span>
        ) : done ? (
          <span className="w-full text-center font-moon text-2xl text-cream">100%</span>
        ) : (
          <>
            <span className="w-14 font-moon text-2xl text-flame">{value}%</span>
            <Bar value={value} track="bg-coal" fill="bg-flame" />
          </>
        )}
      </div>
    </div>
  );
}

export function ProgressPanel({ progres, progresBidang }: { progres: number; progresBidang: Record<Bidang, number | null> }) {
  return (
    <>
      <p className="text-center font-magic text-2xl uppercase text-flame sm:text-3xl">Total Progress</p>
      <div className="mx-auto mt-2 flex max-w-md items-center gap-4 rounded-[18px] bg-flame px-5 py-2">
        <span className="font-moon text-2xl text-cream">{progres}%</span>
        <Bar value={progres} track="bg-coal" fill="bg-cream" />
      </div>
      <div className="mt-5 grid gap-x-10 gap-y-3 md:grid-cols-2">
        {BIDANG_ORDER.map((bidang) => (
          <BidangProgress key={bidang} bidang={bidang} value={progresBidang[bidang]} />
        ))}
      </div>
    </>
  );
}
