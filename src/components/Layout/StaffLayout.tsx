import { useState, type CSSProperties, type ReactNode } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import ikonAccount from '../../assets/staff/ikon-account.svg';
import ikonLogoutA from '../../assets/staff/ikon-logout-a.svg';
import ikonLogoutB from '../../assets/staff/ikon-logout-b.svg';
import ikonProfil from '../../assets/staff/ikon-profil.svg';
import ikonProject from '../../assets/staff/ikon-project.svg';
import ikonProjekA from '../../assets/staff/ikon-projek-a.svg';
import ikonProjekB from '../../assets/staff/ikon-projek-b.svg';
import ikonProjekC from '../../assets/staff/ikon-projek-c.svg';
import ikonRequestA from '../../assets/staff/ikon-request-a.svg';
import ikonRequestB from '../../assets/staff/ikon-request-b.svg';
import ikonReviewA from '../../assets/staff/ikon-review-a.svg';
import ikonReviewB from '../../assets/staff/ikon-review-b.svg';
import ikonReviewC from '../../assets/staff/ikon-review-c.svg';
import { useAuth, useCurrentUser } from '../../hooks/useAuth';
import type { Role } from '../../types';
import { ROLE_LABEL } from '../../utils/navigation';

// Figma "Project Page Operational": sidebar gelap dengan SIMPK, menu, dan Log Out di bawah.
// Dipakai Operasional dan Tim. Ikon diwarnai lewat mask agar ikut warna teks (oranye atau gelap saat aktif).
function Icon({ src, className = 'size-7', style }: { src: string; className?: string; style?: CSSProperties }) {
  const mask: CSSProperties = { maskImage: `url("${src}")`, WebkitMaskImage: `url("${src}")`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' };
  return <span aria-hidden="true" className={`inline-block shrink-0 bg-current ${className}`} style={{ ...mask, ...style }} />;
}

/** Ikon berlapis dari Figma: tiap lapisan diletakkan sesuai posisinya di desain (persen terhadap kotak ikon). */
type Part = { src: string; left: number; top: number; width: number; height: number };
function LayeredIcon({ parts, ratio }: { parts: Part[]; ratio: string }) {
  return (
    <span aria-hidden="true" className="relative inline-block h-6 shrink-0" style={{ aspectRatio: ratio }}>
      {parts.map((part) => (
        <Icon key={part.src} src={part.src} className="absolute" style={{ left: `${part.left}%`, top: `${part.top}%`, width: `${part.width}%`, height: `${part.height}%` }} />
      ))}
    </span>
  );
}

// Figma "Project Dashboard Page Marketing" (144:768-147:775).
const REQUEST_ICON = <LayeredIcon ratio="46 / 46" parts={[{ src: ikonRequestA, left: 0, top: 0, width: 100, height: 100 }, { src: ikonRequestB, left: 15.4, top: 13.3, width: 54.3, height: 69.6 }]} />;
const PROJEK_ICON = (
  <LayeredIcon
    ratio="44 / 56"
    parts={[
      { src: ikonProjekA, left: 18, top: 0, width: 63.9, height: 23.2 },
      { src: ikonProjekB, left: 9.2, top: 17.9, width: 81.9, height: 75 },
      { src: ikonProjekC, left: 0, top: 10.8, width: 100, height: 89.2 },
    ]}
  />
);
const REVIEW_ICON = (
  <LayeredIcon
    ratio="51 / 53"
    parts={[
      { src: ikonReviewA, left: 47.2, top: 0, width: 50.9, height: 49 },
      { src: ikonReviewB, left: 0, top: 15.1, width: 53, height: 49.2 },
      { src: ikonReviewC, left: 25.4, top: 51, width: 53, height: 49 },
    ]}
  />
);

// Menu tambahan di luar desain Figma memakai ikon garis sederhana yang ikut warna teks.
function LineIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-6 shrink-0">
      <path d={d} />
    </svg>
  );
}
const DASHBOARD_ICON = <LineIcon d="M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z" />;
const JASA_ICON = <LineIcon d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7.5 7.5h.01" />;
// Pengaturan tagihan: ikon bangunan bank.
const BANK_ICON = <LineIcon d="M3 10 12 4l9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" />;
const icon = (src: string) => <Icon src={src} className="size-6" />;

const MENU: Partial<Record<Role, { to: string; label: string; icon: ReactNode; end?: boolean }[]>> = {
  MARKETING: [
    { to: '/app', label: 'Dashboard', icon: DASHBOARD_ICON, end: true },
    { to: '/app/request', label: 'Request', icon: REQUEST_ICON },
    { to: '/app/projek', label: 'Projek', icon: PROJEK_ICON },
    { to: '/app/review', label: 'Review', icon: REVIEW_ICON },
    { to: '/app/katalog', label: 'Daftar Jasa', icon: JASA_ICON },
    { to: '/app/klien', label: 'Klien', icon: icon(ikonProfil) },
    { to: '/app/pengaturan', label: 'Pengaturan', icon: BANK_ICON },
    { to: '/app/akun', label: 'Account', icon: icon(ikonAccount) },
  ],
  OPERASIONAL: [
    { to: '/app', label: 'Project', icon: icon(ikonProject), end: true },
    { to: '/app/worker', label: 'Worker', icon: icon(ikonProfil) },
    { to: '/app/pengguna', label: 'Pengguna', icon: icon(ikonProfil) },
    { to: '/app/akun', label: 'Account', icon: icon(ikonAccount) },
  ],
  TIM: [
    { to: '/app', label: 'Project', icon: icon(ikonProject), end: true },
    { to: '/app/akun', label: 'Account', icon: icon(ikonAccount) },
  ],
};

function LogoutIcon() {
  return (
    <span aria-hidden="true" className="relative inline-block h-7 w-6 shrink-0">
      <Icon src={ikonLogoutA} className="absolute inset-0 size-full" />
      <Icon src={ikonLogoutB} className="absolute left-[-30%] top-[38%] h-[30%] w-full" />
    </span>
  );
}

// Tombol perkecil/perbesar sidebar: panel dengan panah ke kiri (perkecil) atau ke kanan (perbesar).
function ToggleIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-7">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 3v18" />
      <path d={collapsed ? 'M13.5 9.5 16 12l-2.5 2.5' : 'M16 9.5 13.5 12l2.5 2.5'} />
    </svg>
  );
}

const STORAGE_KEY = 'simpk-sidebar-kecil';
function readCollapsed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export default function StaffLayout() {
  const { logout } = useAuth();
  const user = useCurrentUser();
  const navigate = useNavigate();
  const menu = MENU[user.role] ?? [];
  // Hanya berlaku di layar lebar; di ponsel menu tetap berupa bar atas. Pilihan diingat di peramban.
  const [collapsed, setCollapsed] = useState(readCollapsed);

  function toggle() {
    setCollapsed((value) => {
      try {
        localStorage.setItem(STORAGE_KEY, value ? '0' : '1');
      } catch {
        // Penyimpanan peramban tidak tersedia; pilihan hanya berlaku sampai halaman dimuat ulang.
      }
      return !value;
    });
  }

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  // Ponsel: bar atas ringkas (logo + Log Out, lalu menu); layar lebar: sidebar setinggi layar.
  const size = 'text-sm lg:text-[clamp(13px,1.85vh,15px)]';
  // Saat diperkecil: tiap menu jadi kotak ikon membulat; menu aktif diberi garis penanda di tepi kiri sidebar.
  const item = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-1.5 font-moon transition-all lg:gap-3 lg:py-2.5 ${
      collapsed ? 'lg:mx-auto lg:size-11 lg:justify-center lg:rounded-xl lg:px-0' : 'lg:px-4'
    } ${size} ${
      isActive
        ? 'bg-flame font-semibold text-white shadow-sm shadow-flame/25'
        : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
    } ${
      collapsed && isActive ? 'lg:before:absolute lg:before:-left-3 lg:before:top-1/2 lg:before:h-6 lg:before:w-1 lg:before:-translate-y-1/2 lg:before:rounded-r-full lg:before:bg-flame' : ''
    }`;
  const logoutButton = (extra: string, iconOnly = false) => (
    <button
      type="button"
      onClick={handleLogout}
      title={iconOnly ? 'Log Out' : undefined}
      aria-label={iconOnly ? 'Log Out' : undefined}
      className={`items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 font-moon text-zinc-300 transition-colors hover:border-red-500/30 hover:bg-red-500/15 hover:text-red-300 lg:gap-2.5 ${extra}`}
    >
      <LogoutIcon />
      {!iconOnly && 'Log Out'}
    </button>
  );
  const toggleButton = (
    <button
      type="button"
      onClick={toggle}
      aria-label={collapsed ? 'Perbesar menu' : 'Perkecil menu'}
      aria-expanded={!collapsed}
      title={collapsed ? 'Perbesar menu' : 'Perkecil menu'}
      className={`hidden rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white lg:block ${collapsed ? 'lg:order-first' : ''}`}
    >
      <ToggleIcon collapsed={collapsed} />
    </button>
  );

  return (
    <div data-app-shell data-staff-shell className="min-h-dvh bg-cream text-coal-deep lg:flex">
      <aside
        className={`flex flex-col border-r border-white/5 bg-coal px-4 py-3 transition-[width] duration-300 lg:sticky lg:top-0 lg:h-dvh lg:shrink-0 lg:py-[clamp(14px,2.4vh,22px)] ${
          collapsed ? 'lg:w-[80px] lg:px-3' : 'lg:w-[clamp(210px,15.5vw,252px)] lg:px-4'
        }`}
      >
        <div className={`flex items-center justify-between gap-3 ${collapsed ? 'lg:flex-col lg:gap-3' : 'lg:items-start lg:px-1'}`}>
          <div className="leading-none">
            {collapsed ? (
              <>
                <p className="font-magic text-2xl tracking-wider text-flame lg:hidden">SIMPK</p>
                <p
                  className="hidden size-11 place-items-center rounded-xl border border-flame/30 bg-flame/10 font-magic text-xl leading-none text-flame lg:grid"
                  title="SIMPK by neotelemetri"
                >
                  S
                </p>
              </>
            ) : (
              <>
                <p className="font-magic text-[clamp(22px,3.2vh,28px)] tracking-wider text-flame">SIMPK</p>
                <p className="mt-1 font-moon text-[11px] tracking-wide text-zinc-400">by neotelemetri</p>
                <span className="mt-2.5 hidden w-fit rounded-md bg-white/5 px-2.5 py-0.5 font-moon text-xs font-medium text-zinc-300 lg:inline-block">
                  {ROLE_LABEL[user.role]}
                </span>
              </>
            )}
          </div>
          {toggleButton}
          {logoutButton('flex px-3.5 py-1.5 text-sm lg:hidden')}
        </div>
        <nav
          aria-label="Menu utama"
          className={`mt-2 flex gap-1 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible ${collapsed ? 'lg:mt-6' : 'lg:mt-7'}`}
        >
          {menu.map((entry) => (
            <NavLink key={entry.to} to={entry.to} end={entry.end} className={item} title={collapsed ? entry.label : undefined}>
              {entry.icon}
              <span className={collapsed ? 'lg:sr-only' : ''}>{entry.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="hidden lg:mt-auto lg:block">
          <div className="mb-3 h-px bg-white/10" />
          {logoutButton(`flex w-full py-2 ${collapsed ? 'px-0' : `px-4 ${size}`}`, collapsed)}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-end px-4 pt-3 sm:px-6">
          <div className="flex items-center gap-2.5 rounded-full border border-zinc-200/90 bg-white py-1 pl-3.5 pr-1.5 shadow-2xs">
            <span className="hidden font-moon text-xs font-medium text-zinc-700 sm:inline">{user.name}</span>
            <span className="grid size-8 place-items-center rounded-full bg-flame/10 text-flame" title={user.name}>
              <Icon src={ikonProfil} className="size-4" />
            </span>
          </div>
        </div>
        <main className="flex flex-1 flex-col px-3 pb-5 pt-2.5 sm:px-6 lg:pb-[clamp(14px,2.4vh,22px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
