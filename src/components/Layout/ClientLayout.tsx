import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth, useCurrentUser } from '../../hooks/useAuth';

export default function ClientLayout() {
  const { logout } = useAuth();
  const user = useCurrentUser();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-page text-ink">
      <header className="flex items-center justify-between border-b border-line bg-page px-4 py-3 sm:px-6">
        <div>
          <Link to="/portal" className="font-heading font-bold">Portal Klien Neo Telemetri</Link>
          <p className="text-sm text-muted">{user.name}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-x-4 gap-y-1 text-sm text-muted">
          <Link to="/portal/sandi" className="underline">Ganti Kata Sandi</Link>
          <button type="button" onClick={handleLogout} className="underline">
            Keluar
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
