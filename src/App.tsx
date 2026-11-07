import { Navigate, Route, Routes } from 'react-router-dom';
import { useCurrentUser } from './hooks/useAuth';
import type { Role } from './types';
import ProtectedRoute from './components/ProtectedRoute';
import Placeholder from './components/Placeholder';
import PublicLayout from './components/Layout/PublicLayout';
import InternalLayout from './components/Layout/InternalLayout';
import ClientLayout from './components/Layout/ClientLayout';
import LoginPage from './pages/auth/LoginPage';
import KatalogPublikPage from './pages/publik/KatalogPublikPage';
import MarketingDashboardPage from './pages/marketing/MarketingDashboardPage';
import KatalogPage from './pages/marketing/KatalogPage';
import PesananPage from './pages/marketing/PesananPage';
import TagihanPage from './pages/marketing/TagihanPage';
import OperasionalDashboardPage from './pages/operasional/OperasionalDashboardPage';
import PenggunaPage from './pages/operasional/PenggunaPage';
import TugasSayaPage from './pages/tim/TugasSayaPage';
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
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Navigate to="/katalog" replace />} />
        <Route path="/katalog" element={<KatalogPublikPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={INTERNAL} />}>
        <Route path="/app" element={<InternalLayout />}>
          <Route index element={<InternalHome />} />
          <Route path="proyek" element={<Placeholder title="Proyek" />} />
          <Route element={<ProtectedRoute roles={['MARKETING']} />}>
            <Route path="katalog" element={<KatalogPage />} />
            <Route path="pesanan" element={<PesananPage />} />
            <Route path="tagihan" element={<TagihanPage />} />
          </Route>
          <Route element={<ProtectedRoute roles={['OPERASIONAL']} />}>
            <Route path="pengguna" element={<PenggunaPage />} />
          </Route>
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['KLIEN']} />}>
        <Route path="/portal" element={<ClientLayout />}>
          <Route index element={<ProyekSayaPage />} />
        </Route>
      </Route>

      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
