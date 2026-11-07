import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth, useCurrentUser } from '../../hooks/useAuth';
import { INTERNAL_MENU, ROLE_LABEL } from '../../utils/navigation';

export default function InternalLayout() {
  const { logout } = useAuth();
  const user = useCurrentUser();
  const navigate = useNavigate();
  const menu = INTERNAL_MENU[user.role] ?? [];

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-page text-ink md:flex">
      <aside className="border-b border-line bg-surface p-4 md:w-60 md:shrink-0 md:border-b-0 md:border-r">
        <p className="font-heading font-bold">SIM Proyek Klien</p>
        <p className="text-sm text-muted">{ROLE_LABEL[user.role]}</p>
        <nav className="mt-4 flex gap-1 overflow-x-auto md:flex-col">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-surface-2 font-medium' : 'hover:bg-surface-2'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" onClick={handleLogout} className="mt-4 text-sm text-muted underline">
          Keluar
        </button>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
