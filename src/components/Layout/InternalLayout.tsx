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
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <aside className="border-b border-slate-200 bg-white p-4 md:w-60 md:shrink-0 md:border-b-0 md:border-r">
        <p className="font-semibold">SIM Proyek Klien</p>
        <p className="text-sm text-slate-600">{ROLE_LABEL[user.role]}</p>
        <nav className="mt-4 flex gap-1 overflow-x-auto md:flex-col">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              className={({ isActive }) =>
                `whitespace-nowrap rounded px-3 py-2 text-sm ${isActive ? 'bg-slate-200 font-medium' : 'hover:bg-slate-100'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" onClick={handleLogout} className="mt-4 text-sm text-slate-700 underline">
          Keluar
        </button>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
