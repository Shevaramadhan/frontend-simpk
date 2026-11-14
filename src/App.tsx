import { Navigate, Route, Routes } from 'react-router-dom';
import { useCurrentUser } from './hooks/useAuth';
import type { Role } from './types';
import ProtectedRoute from './components/ProtectedRoute';
import StaffLayout from './components/Layout/StaffLayout';
import ClientLayout from './components/Layout/ClientLayout';
import DaftarPage from './pages/auth/DaftarPage';
import LoginPage from './pages/auth/LoginPage';
import LupaSandiPage from './pages/auth/LupaSandiPage';
import ResetSandiPage from './pages/auth/ResetSandiPage';
import KatalogPublikPage from './pages/publik/KatalogPublikPage';
import LandingPage from './pages/publik/LandingPage';
import DashboardPage from './pages/marketing/DashboardPage';
import KatalogPage from './pages/marketing/KatalogPage';
import KlienPage from './pages/marketing/KlienPage';
import PaymentMarketingPage from './pages/marketing/PaymentMarketingPage';
import PengaturanPage from './pages/marketing/PengaturanPage';
import ProjekPage from './pages/marketing/ProjekPage';
import RequestDetailPage from './pages/marketing/RequestDetailPage';
import RequestPage from './pages/marketing/RequestPage';
import ReviewPage from './pages/marketing/ReviewPage';
import PilihWorkerPage from './pages/operasional/PilihWorkerPage';
import ProjectOpsPage from './pages/operasional/ProjectOpsPage';
import WorkerPage from './pages/operasional/WorkerPage';
import PenggunaPage from './pages/operasional/PenggunaPage';
import AkunPage from './pages/staff/AkunPage';
import ProjectTimPage from './pages/tim/ProjectTimPage';
import ProyekTimPage from './pages/tim/ProyekTimPage';
import BerandaKlienPage from './pages/klien/BerandaKlienPage';
import DetailPage from './pages/klien/DetailPage';
import PaymentPage from './pages/klien/PaymentPage';
import PesanPage from './pages/klien/PesanPage';
import ProfilPage from './pages/klien/ProfilPage';
import ProyekSayaPage from './pages/klien/ProyekSayaPage';
import { ForbiddenPage, NotFoundPage } from './pages/ErrorPages';
import TagihanCetakPage from './pages/TagihanCetakPage';

const INTERNAL: Role[] = ['MARKETING', 'OPERASIONAL', 'TIM'];

function InternalHome() {
  const user = useCurrentUser();
  if (user.role === 'MARKETING') return <DashboardPage />;
  if (user.role === 'OPERASIONAL') return <ProjectOpsPage />;
  return <ProjectTimPage />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/daftar" element={<DaftarPage />} />
      <Route path="/lupa-sandi" element={<LupaSandiPage />} />
      <Route path="/reset-sandi" element={<ResetSandiPage />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/katalog" element={<KatalogPublikPage />} />

      {/* Tagihan cetak tanpa tata letak agar bersih saat dicetak atau disimpan PDF. */}
      <Route element={<ProtectedRoute roles={['KLIEN', 'MARKETING', 'OPERASIONAL']} />}>
        <Route path="/tagihan/:orderId/:invoiceId" element={<TagihanCetakPage />} />
      </Route>

      {/* Semua pengurus memakai sidebar sesuai Figma (StaffLayout). */}
      <Route element={<ProtectedRoute roles={INTERNAL} />}>
        <Route path="/app" element={<StaffLayout />}>
          <Route index element={<InternalHome />} />
          <Route path="akun" element={<AkunPage />} />
          <Route path="proyek/:projectId" element={<ProyekTimPage />} />
          {/* Alamat lama tetap berfungsi. */}
          <Route path="sandi" element={<Navigate to="/app/akun" replace />} />
          <Route element={<ProtectedRoute roles={['MARKETING']} />}>
            <Route path="request" element={<RequestPage />} />
            <Route path="request/:id" element={<RequestDetailPage />} />
            <Route path="request/:id/payment" element={<PaymentMarketingPage />} />
            <Route path="projek" element={<ProjekPage />} />
            <Route path="review" element={<ReviewPage />} />
            <Route path="katalog" element={<KatalogPage />} />
            <Route path="klien" element={<KlienPage />} />
            <Route path="pengaturan" element={<PengaturanPage />} />
            <Route path="pesanan" element={<Navigate to="/app/request" replace />} />
            <Route path="tagihan" element={<Navigate to="/app/request" replace />} />
          </Route>
          <Route element={<ProtectedRoute roles={['OPERASIONAL']} />}>
            <Route path="pengajuan/:orderId" element={<PilihWorkerPage />} />
            <Route path="worker" element={<WorkerPage />} />
            <Route path="pengguna" element={<PenggunaPage />} />
          </Route>
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['KLIEN']} />}>
        <Route path="/portal" element={<ClientLayout />}>
          <Route index element={<BerandaKlienPage />} />
          <Route path="proyek" element={<ProyekSayaPage />} />
          <Route path="proyek/:id" element={<DetailPage />} />
          <Route path="proyek/:id/payment" element={<PaymentPage />} />
          <Route path="pesan" element={<PesanPage />} />
          <Route path="profil" element={<ProfilPage />} />
          {/* Alamat lama tetap berfungsi. */}
          <Route path="sandi" element={<Navigate to="/portal/profil" replace />} />
        </Route>
      </Route>

      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
