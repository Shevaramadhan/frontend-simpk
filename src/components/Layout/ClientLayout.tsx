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
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)} className="group block">
        <Framed>
          <span className="block max-w-[46vw] truncate px-3 py-1.5 font-magic text-sm uppercase text-flame group-hover:text-cream sm:px-5 sm:text-lg">
            Hallo, {firstName}
          </span>
        </Framed>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-2xl border-[3px] border-coal bg-cream shadow-xl">
          {MENU.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              role="menuitem"
              className={({ isActive }) => `block px-4 py-3 font-moon text-base ${isActive ? 'bg-flame text-cream' : 'text-coal-deep hover:bg-[#ffc49f66]'}`}
            >
              {item.label}
            </NavLink>
          ))}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
            className="block w-full border-t-2 border-coal/20 px-4 py-3 text-left font-moon text-base text-coal-deep hover:bg-[#ffc49f66]"
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
    <div className="bg-cream text-coal-deep">
      {/* Header dan isi halaman setinggi satu layar; footer berada setelahnya. */}
      <div className="flex min-h-dvh flex-col">
      <header className="relative z-20 grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 pb-[clamp(4px,1vh,8px)] pt-[clamp(6px,1.4vh,12px)] sm:px-5">
        <Link to="/portal" className="min-w-0 justify-self-start">
          <img alt="Neo Telemetri, IT For The Future" className="h-auto max-h-11 w-full max-w-[280px] object-contain" src={logo} />
        </Link>
        <Link to="/portal" className="flex flex-col items-end leading-none">
          <OutlinedTitle as="p" className="text-[clamp(1.5rem,min(7vh,10vw),3.75rem)] tracking-[0.12em]">
            SIMPK
          </OutlinedTitle>
          <span className="mt-0.5 font-moon text-[10px] tracking-[0.12em] text-flame sm:text-xs">by neotelemetri</span>
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
