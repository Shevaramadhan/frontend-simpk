import { Outlet, useNavigate } from 'react-router-dom';
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
          <p className="font-heading font-bold">Portal Klien Neo Telemetri</p>
          <p className="text-sm text-muted">{user.name}</p>
        </div>
        <button type="button" onClick={handleLogout} className="text-sm text-muted underline">
          Keluar
        </button>
      </header>
      <main className="mx-auto max-w-5xl p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
