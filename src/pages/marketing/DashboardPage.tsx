import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { LoadError } from '../../components/brand/StaffParts';
import TrendBands from '../../components/brand/TrendBands';
import { useData } from '../../hooks/useData';
import { getDashboard } from '../../services/dashboardService';
import { rupiahRingkas } from '../../utils/format';

// Figma "Project Dashboard Page Marketing" (144:735): empat kartu angka dan grafik per bulan (REQ-F06).

function StatCard({ no, value, label, to, index }: { no: string; value: string; label: string; to: string; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06, duration: 0.4 }}>
      <Link
        to={to}
        className="relative flex h-[clamp(120px,21vh,231px)] flex-col items-center justify-center rounded-[30px] bg-coal-deep px-4 text-center transition-transform hover:-translate-y-1"
      >
        <span className="absolute right-5 top-1 font-moon text-[clamp(26px,min(5.5vh,7vw),64px)] leading-none text-flame">{no}</span>
        <span className="font-magic text-[clamp(44px,min(13vh,15vw),150px)] leading-[0.9] text-flame">{value}</span>
        <span className="mt-1 font-magic text-[clamp(18px,min(3.4vh,5.5vw),36px)] uppercase leading-tight text-flame">{label}</span>
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
        <Link to="/app/request" className="block rounded-2xl bg-[#ffd27a] px-5 py-3 font-moon text-base text-coal-deep hover:bg-[#ffc35a]">
          Ada {data.buktiMenunggu} bukti transfer yang menunggu diperiksa. Buka Request untuk memeriksanya.
        </Link>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard index={0} no="01" value={String(data.requestMasuk)} label="Request Masuk" to="/app/request" />
        <StatCard index={1} no="02" value={String(data.projekMasuk)} label="Total Projek Masuk" to="/app/projek" />
        <StatCard index={2} no="03" value={String(data.projekSelesai)} label="Total Projek Selesai" to="/app/projek" />
        <StatCard index={3} no="04" value={rupiahRingkas(data.keuntungan)} label="Keuntungan" to="/app/request" />
      </div>
      <TrendBands bulanan={data.bulanan} />
      <p className="font-moon text-xs text-coal-deep/60">
        01 Request masuk, 02 Projek masuk (tim dibentuk), 03 Projek selesai, 04 Keuntungan (pembayaran yang sudah diverifikasi). Tiap pita berskala sendiri; arahkan kursor untuk melihat angkanya.
      </p>
    </div>
  );
}
