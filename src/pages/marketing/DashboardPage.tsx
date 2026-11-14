import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { LoadError } from '../../components/brand/StaffParts';
import TrendBands from '../../components/brand/TrendBands';
import { useData } from '../../hooks/useData';
import { getDashboard } from '../../services/dashboardService';
import { rupiahRingkas } from '../../utils/format';

// Figma "Project Dashboard Page Marketing" (144:735): kartu angka dan grafik per bulan (REQ-F06).
// Atas permintaan PM, keempat kartu dibuat sejajar satu baris dan nomor 01-04 dihilangkan.

function StatCard({ value, label, to, index }: { value: string; label: string; to: string; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06, duration: 0.4 }}>
      <Link
        to={to}
        className="flex h-[clamp(120px,24vh,231px)] flex-col items-center justify-center rounded-[30px] bg-coal-deep px-3 text-center transition-transform hover:-translate-y-1"
      >
        <span className="font-magic text-[clamp(44px,min(12vh,7vw),130px)] leading-[0.9] text-flame">{value}</span>
        <span className="mt-2 font-magic text-[clamp(16px,min(3vh,1.9vw),32px)] uppercase leading-tight text-flame">{label}</span>
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
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard index={0} value={String(data.requestMasuk)} label="Request Masuk" to="/app/request" />
        <StatCard index={1} value={String(data.projekMasuk)} label="Total Projek Masuk" to="/app/projek" />
        <StatCard index={2} value={String(data.projekSelesai)} label="Total Projek Selesai" to="/app/projek" />
        <StatCard index={3} value={rupiahRingkas(data.keuntungan)} label="Keuntungan" to="/app/request" />
      </div>
      <TrendBands bulanan={data.bulanan} />
      <p className="font-moon text-xs text-coal-deep/60">
        Projek masuk dihitung saat tim dibentuk; keuntungan dari pembayaran yang sudah diverifikasi. Tiap pita berskala sendiri; arahkan kursor untuk melihat angkanya.
      </p>
    </div>
  );
}
