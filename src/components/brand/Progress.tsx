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

function BidangProgress({ bidang, value, padat }: { bidang: Bidang; value: number | null; padat: boolean }) {
  const done = value === 100;
  const angka = padat ? 'text-lg' : 'text-2xl';
  return (
    <div>
      <p className={`font-moon text-coal-deep ${padat ? 'text-base' : 'text-xl'}`}>{BIDANG_LABEL[bidang]}</p>
      <div className={`mt-1 flex items-center gap-4 rounded-[18px] border-flame px-4 ${padat ? 'border-[3px] py-1' : 'border-[4px] py-1.5'} ${done ? 'bg-flame' : 'bg-cream'}`}>
        {value === null ? (
          <span className={`font-moon text-coal-deep/70 ${padat ? 'text-sm' : 'text-base'}`}>Belum ada tugas</span>
        ) : done ? (
          <span className={`w-full text-center font-moon text-cream ${angka}`}>100%</span>
        ) : (
          <>
            <span className={`w-14 font-moon text-flame ${angka}`}>{value}%</span>
            <Bar value={value} track="bg-coal" fill="bg-flame" />
          </>
        )}
      </div>
    </div>
  );
}

/** `padat`: versi ringkas untuk kolom sempit (detail project dua kolom). */
export function ProgressPanel({ progres, progresBidang, padat = false }: { progres: number; progresBidang: Record<Bidang, number | null>; padat?: boolean }) {
  return (
    <>
      <p className={`text-center font-magic uppercase text-flame ${padat ? 'text-xl' : 'text-2xl sm:text-3xl'}`}>Total Progress</p>
      <div className={`mx-auto flex max-w-md items-center gap-4 rounded-[18px] bg-flame px-5 ${padat ? 'mt-1 py-1.5' : 'mt-2 py-2'}`}>
        <span className={`font-moon text-cream ${padat ? 'text-xl' : 'text-2xl'}`}>{progres}%</span>
        <Bar value={progres} track="bg-coal" fill="bg-cream" />
      </div>
      <div className={`grid md:grid-cols-2 ${padat ? 'mt-3 gap-x-4 gap-y-2' : 'mt-5 gap-x-10 gap-y-3'}`}>
        {BIDANG_ORDER.map((bidang) => (
          <BidangProgress key={bidang} bidang={bidang} value={progresBidang[bidang]} padat={padat} />
        ))}
      </div>
    </>
  );
}
