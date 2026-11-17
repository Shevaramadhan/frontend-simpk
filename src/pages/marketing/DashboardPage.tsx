import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { LoadError } from '../../components/brand/StaffParts';
import TrendBands from '../../components/brand/TrendBands';
import { useData } from '../../hooks/useData';
import { getDashboard } from '../../services/dashboardService';
import { rupiahRingkas } from '../../utils/format';

// Ikon garis 24x24 untuk kartu statistik Dashboard Marketing.
const IKON = {
  request: {
    paths: ['M22 12h-6l-2 3h-4l-2-3H2', 'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'],
    tone: 'bg-amber-50 text-amber-600 border-amber-200/70',
  },
  projek: {
    paths: ['M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16', 'M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z'],
    tone: 'bg-flame/10 text-flame border-flame/20',
  },
  selesai: {
    paths: ['M22 11.08V12a10 10 0 1 1-5.93-9.14', 'm9 11 3 3L22 4'],
    tone: 'bg-emerald-50 text-emerald-600 border-emerald-200/70',
  },
  keuntungan: {
    paths: ['M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1', 'M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4'],
    tone: 'bg-sky-50 text-sky-600 border-sky-200/70',
  },
} as const;

function StatCard({ value, label, to, index, ikon }: { value: string; label: string; to: string; index: number; ikon: keyof typeof IKON }) {
  const cfg = IKON[ikon];
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.35 }}>
      <Link
        to={to}
        className="group flex h-[clamp(88px,13.5vh,120px)] items-center gap-4 rounded-2xl border border-zinc-200/90 bg-white px-4 shadow-xs transition-all hover:-translate-y-0.5 hover:border-flame/40 hover:shadow-md sm:px-5"
      >
        <span className={`grid size-[clamp(42px,min(6.5vh,3.4vw),54px)] shrink-0 place-items-center rounded-xl border transition-transform group-hover:scale-105 ${cfg.tone}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-[52%]">
            {cfg.paths.map((d) => (
              <path key={d} d={d} />
            ))}
          </svg>
        </span>
        <span className="flex min-w-0 flex-col">
          <span
            className={`whitespace-nowrap font-magic font-bold leading-none text-zinc-900 ${
              value.length > 4 ? 'text-[clamp(20px,min(3.8vh,2vw),30px)]' : 'text-[clamp(24px,min(4.6vh,2.4vw),36px)]'
            }`}
          >
            {value}
          </span>
          <span className="mt-1.5 font-moon text-xs font-medium text-zinc-500">{label}</span>
        </span>
      </Link>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { data, loading, error } = useData(getDashboard);

  if (loading && !data) return <p className="p-10 text-center font-moon text-sm text-zinc-500">Memuat...</p>;
  if (error || !data) return <LoadError message={error || 'Data dashboard tidak tersedia.'} />;

  return (
    <div className="flex flex-1 flex-col gap-4">
      {data.buktiMenunggu > 0 && (
        <Link
          to="/app/request"
          className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 font-moon text-xs font-medium text-amber-900 transition-colors hover:bg-amber-100/80 sm:text-sm"
        >
          <span>Ada {data.buktiMenunggu} bukti transfer yang menunggu diperiksa.</span>
          <span className="font-semibold text-flame underline underline-offset-4">Buka Request →</span>
        </Link>
      )}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard index={0} value={String(data.requestMasuk)} label="Request Masuk" to="/app/request" ikon="request" />
        <StatCard index={1} value={String(data.projekMasuk)} label="Total Projek Masuk" to="/app/projek" ikon="projek" />
        <StatCard index={2} value={String(data.projekSelesai)} label="Total Projek Selesai" to="/app/projek" ikon="selesai" />
        <StatCard index={3} value={rupiahRingkas(data.keuntungan)} label="Keuntungan" to="/app/request" ikon="keuntungan" />
      </div>
      <TrendBands bulanan={data.bulanan} />
      <p className="font-moon text-xs text-zinc-500">
        Projek masuk dihitung saat tim dibentuk; keuntungan dari pembayaran yang sudah diverifikasi. Arahkan kursor pada grafik untuk melihat rincian tiap bulan.
      </p>
    </div>
  );
}
