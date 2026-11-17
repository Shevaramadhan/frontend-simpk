import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/landing/logo-hitam.webp';
import { useAuth, useCurrentUser } from '../../hooks/useAuth';
import { Framed, OutlinedTitle } from '../brand/Brand';
import SiteFooter from '../brand/SiteFooter';

// Kerangka halaman klien sesuai Figma "Landing Page Client": logo kiri, SIMPK di tengah, HALLO di kanan.
const MENU = [
  { to: '/portal', label: 'Beranda', end: true },
  { to: '/portal/proyek', label: 'Project Saya', end: false },
  { to: '/portal/profil', label: 'Profil', end: false },
];

function UserMenu() {
  const { logout } = useAuth();
  const user = useCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const firstName = user.name.split(' ')[0] ?? user.name;

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 font-moon text-sm font-semibold text-zinc-800 shadow-2xs transition-colors hover:border-flame/40 hover:text-flame sm:px-4"
      >
        <span className="grid size-6 place-items-center rounded-full bg-flame/15 text-xs font-bold text-flame">
          {firstName.slice(0, 1).toUpperCase()}
        </span>
        <span className="max-w-[40vw] truncate">Halo, {firstName}</span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-30 mt-2 w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl">
          {MENU.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              role="menuitem"
              className={({ isActive }) =>
                `block rounded-lg px-3.5 py-2 font-moon text-sm transition-colors ${
                  isActive ? 'bg-flame font-semibold text-white' : 'text-zinc-700 hover:bg-zinc-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="my-1 h-px bg-zinc-100" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
            className="block w-full rounded-lg px-3.5 py-2 text-left font-moon text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}

export default function ClientLayout() {
  return (
    <div data-app-shell className="bg-[#f4f5f7] text-zinc-800">
      {/* Header dan isi halaman setinggi satu layar; footer berada setelahnya. */}
      <div className="flex min-h-dvh flex-col">
        <header className="sticky top-0 z-20 mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-zinc-200/80 bg-white/90 px-3 py-2.5 backdrop-blur-md sm:px-6">
          <Link to="/portal" className="min-w-0 justify-self-start">
            <img alt="Neo Telemetri, IT For The Future" className="h-auto max-h-9 w-full max-w-[220px] object-contain" src={logo} />
          </Link>
          <Link to="/portal" className="flex flex-col items-center leading-none">
            <span className="font-magic text-[clamp(1.25rem,min(4vh,7vw),2rem)] font-bold tracking-wider text-flame">
              SIMPK
            </span>
            <span className="mt-0.5 font-moon text-[10px] tracking-wide text-zinc-500">by neotelemetri</span>
          </Link>
          <div className="justify-self-end">
            <UserMenu />
          </div>
        </header>
        <main className="flex flex-1 flex-col [&>*]:flex-1">
          <Outlet />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
