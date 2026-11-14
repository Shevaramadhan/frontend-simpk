import { Route, Routes } from 'react-router-dom';
import { useCurrentUser } from './hooks/useAuth';
import type { Role } from './types';
import ProtectedRoute from './components/ProtectedRoute';
import Placeholder from './components/Placeholder';
import PublicLayout from './components/Layout/PublicLayout';
import InternalLayout from './components/Layout/InternalLayout';
import ClientLayout from './components/Layout/ClientLayout';
import DaftarPage from './pages/auth/DaftarPage';
import GantiSandiPage from './pages/auth/GantiSandiPage';
import LoginPage from './pages/auth/LoginPage';
import LupaSandiPage from './pages/auth/LupaSandiPage';
import ResetSandiPage from './pages/auth/ResetSandiPage';
import KatalogPublikPage from './pages/publik/KatalogPublikPage';
import LandingPage from './pages/publik/LandingPage';
import MarketingDashboardPage from './pages/marketing/MarketingDashboardPage';
import KatalogPage from './pages/marketing/KatalogPage';
import KlienPage from './pages/marketing/KlienPage';
import PesananPage from './pages/marketing/PesananPage';
import TagihanPage from './pages/marketing/TagihanPage';
import OperasionalDashboardPage from './pages/operasional/OperasionalDashboardPage';
import PenggunaPage from './pages/operasional/PenggunaPage';
import TugasSayaPage from './pages/tim/TugasSayaPage';
import BerandaKlienPage from './pages/klien/BerandaKlienPage';
import DetailPage from './pages/klien/DetailPage';
import PaymentPage from './pages/klien/PaymentPage';
import PesanPage from './pages/klien/PesanPage';
import ProyekSayaPage from './pages/klien/ProyekSayaPage';
import { ForbiddenPage, NotFoundPage } from './pages/ErrorPages';

const INTERNAL: Role[] = ['MARKETING', 'OPERASIONAL', 'TIM'];

function InternalHome() {
  const user = useCurrentUser();
  if (user.role === 'MARKETING') return <MarketingDashboardPage />;
  if (user.role === 'OPERASIONAL') return <OperasionalDashboardPage />;
  return <TugasSayaPage />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/daftar" element={<DaftarPage />} />
      <Route path="/lupa-sandi" element={<LupaSandiPage />} />
      <Route path="/reset-sandi" element={<ResetSandiPage />} />
      <Route path="/" element={<LandingPage />} />
      <Route element={<PublicLayout />}>
        <Route path="/katalog" element={<KatalogPublikPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={INTERNAL} />}>
        <Route path="/app" element={<InternalLayout />}>
          <Route index element={<InternalHome />} />
          <Route path="proyek" element={<Placeholder title="Proyek" />} />
          <Route path="sandi" element={<GantiSandiPage />} />
          <Route element={<ProtectedRoute roles={['MARKETING']} />}>
            <Route path="katalog" element={<KatalogPage />} />
            <Route path="pesanan" element={<PesananPage />} />
            <Route path="klien" element={<KlienPage />} />
            <Route path="tagihan" element={<TagihanPage />} />
          </Route>
          <Route element={<ProtectedRoute roles={['OPERASIONAL']} />}>
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
          <Route path="sandi" element={<GantiSandiPage />} />
        </Route>
      </Route>

      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
