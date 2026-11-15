import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { LoadError } from '../../components/brand/StaffParts';
import TrendBands from '../../components/brand/TrendBands';
import { useData } from '../../hooks/useData';
import { getDashboard } from '../../services/dashboardService';
import { rupiahRingkas } from '../../utils/format';

// Figma "Project Dashboard Page Marketing" (144:735): kartu angka dan grafik per bulan (REQ-F06).
// Atas permintaan PM: keempat kartu sejajar satu baris tanpa nomor 01-04 (14 Nov), lalu diperkecil dan diberi ikon (15 Nov).

// Ikon garis 24x24 yang ikut warna teks.
const IKON = {
  request: ['M22 12h-6l-2 3h-4l-2-3H2', 'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'],
  projek: ['M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16', 'M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z'],
  selesai: ['M22 11.08V12a10 10 0 1 1-5.93-9.14', 'm9 11 3 3L22 4'],
  keuntungan: ['M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1', 'M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4'],
} as const;

function StatCard({ value, label, to, index, ikon }: { value: string; label: string; to: string; index: number; ikon: keyof typeof IKON }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06, duration: 0.4 }}>
      <Link
        to={to}
        className="group flex h-[clamp(96px,15vh,140px)] items-center gap-[clamp(10px,1.2vw,18px)] rounded-[24px] bg-coal-deep px-[clamp(14px,1.4vw,24px)] transition-transform hover:-translate-y-1"
      >
        <span className="grid size-[clamp(44px,min(7vh,3.6vw),64px)] shrink-0 place-items-center rounded-2xl bg-flame text-coal transition-transform group-hover:-rotate-6 group-hover:scale-105">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-[55%]">
            {IKON[ikon].map((d) => (
              <path key={d} d={d} />
            ))}
          </svg>
        </span>
        <span className="flex min-w-0 flex-col">
          {/* Nilai panjang seperti "25,2 JT" dikecilkan agar tetap satu baris di dalam kartu. */}
          <span
            className={`whitespace-nowrap font-magic leading-none text-flame ${
              value.length > 4 ? 'text-[clamp(24px,min(5vh,2.4vw),44px)]' : 'text-[clamp(30px,min(7vh,3.4vw),60px)]'
            }`}
          >
            {value}
          </span>
          <span className="mt-1 font-magic text-[clamp(12px,min(1.9vh,1.05vw),17px)] uppercase leading-tight text-cream/90">{label}</span>
        </span>
      </Link>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { data, loading, error } = useData(getDashboard);

  if (loading && !data) return <p className="p-10 text-center font-moon text-xl text-coal-deep">Memuat...</p>;
  if (error || !data) return <LoadError message={error || 'Data dashboard tidak tersedia.'} />;

  return (
    <div className="space-y-4">
      {data.buktiMenunggu > 0 && (
        <Link to="/app/request" className="block rounded-2xl bg-[#ffd27a] px-5 py-2.5 font-moon text-sm text-coal-deep hover:bg-[#ffc35a]">
          Ada {data.buktiMenunggu} bukti transfer yang menunggu diperiksa. Buka Request untuk memeriksanya.
        </Link>
      )}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard index={0} value={String(data.requestMasuk)} label="Request Masuk" to="/app/request" ikon="request" />
        <StatCard index={1} value={String(data.projekMasuk)} label="Total Projek Masuk" to="/app/projek" ikon="projek" />
        <StatCard index={2} value={String(data.projekSelesai)} label="Total Projek Selesai" to="/app/projek" ikon="selesai" />
        <StatCard index={3} value={rupiahRingkas(data.keuntungan)} label="Keuntungan" to="/app/request" ikon="keuntungan" />
      </div>
      <TrendBands bulanan={data.bulanan} />
      <p className="font-moon text-xs text-coal-deep/60">
        Projek masuk dihitung saat tim dibentuk; keuntungan dari pembayaran yang sudah diverifikasi. Tiap pita berskala sendiri; arahkan kursor untuk melihat angkanya.
      </p>
    </div>
  );
}
