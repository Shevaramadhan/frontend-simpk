import type { CSSProperties } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import ikonAccount from '../../assets/staff/ikon-account.svg';
import ikonLogoutA from '../../assets/staff/ikon-logout-a.svg';
import ikonLogoutB from '../../assets/staff/ikon-logout-b.svg';
import ikonProfil from '../../assets/staff/ikon-profil.svg';
import ikonProject from '../../assets/staff/ikon-project.svg';
import { useAuth, useCurrentUser } from '../../hooks/useAuth';
import type { Role } from '../../types';
import { ROLE_LABEL } from '../../utils/navigation';

// Figma "Project Page Operational": sidebar gelap dengan SIMPK, menu, dan Log Out di bawah.
// Dipakai Operasional dan Tim. Ikon diwarnai lewat mask agar ikut warna teks (oranye atau gelap saat aktif).
function Icon({ src, className = 'size-7' }: { src: string; className?: string }) {
  const style: CSSProperties = { maskImage: `url("${src}")`, WebkitMaskImage: `url("${src}")`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' };
  return <span aria-hidden="true" className={`inline-block shrink-0 bg-current ${className}`} style={style} />;
}

const MENU: Partial<Record<Role, { to: string; label: string; icon: string; end?: boolean }[]>> = {
  OPERASIONAL: [
    { to: '/app', label: 'Project', icon: ikonProject, end: true },
    { to: '/app/worker', label: 'Worker', icon: ikonProfil },
    { to: '/app/pengguna', label: 'Pengguna', icon: ikonProfil },
    { to: '/app/akun', label: 'Account', icon: ikonAccount },
  ],
  TIM: [
    { to: '/app', label: 'Project', icon: ikonProject, end: true },
    { to: '/app/akun', label: 'Account', icon: ikonAccount },
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

export default function StaffLayout() {
  const { logout } = useAuth();
  const user = useCurrentUser();
  const navigate = useNavigate();
  const menu = MENU[user.role] ?? [];

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  // Ponsel: bar atas ringkas (logo + Log Out, lalu menu); layar lebar: sidebar setinggi layar.
  const size = 'text-lg lg:text-[clamp(18px,3.2vh,30px)]';
  const item = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 whitespace-nowrap rounded-[24px] px-3 py-1 font-moon transition-colors lg:gap-3 lg:px-5 lg:py-2 ${size} ${
      isActive ? 'bg-flame text-coal' : 'text-flame hover:bg-flame/15'
    }`;
  const logoutButton = (extra: string) => (
    <button type="button" onClick={handleLogout} className={`items-center justify-center gap-2 rounded-[24px] bg-flame font-moon text-coal hover:bg-[#e05600] lg:gap-3 ${extra}`}>
      <LogoutIcon />
      Log Out
    </button>
  );

  return (
    <div className="min-h-dvh bg-cream text-coal-deep lg:flex">
      <aside className="flex flex-col bg-coal px-4 py-3 lg:sticky lg:top-0 lg:h-dvh lg:w-[clamp(230px,22vw,330px)] lg:shrink-0 lg:px-7 lg:py-[clamp(16px,3vh,32px)]">
        <div className="flex items-center justify-between gap-4 lg:block">
          <div className="leading-none">
            <p className="font-magic text-[clamp(28px,5vh,48px)] tracking-[0.1em] text-flame">SIMPK</p>
            <p className="mt-1 text-right font-moon text-[11px] tracking-[0.1em] text-flame lg:pr-6">by neotelemetri</p>
            <p className="mt-2 hidden font-moon text-sm text-cream/80 lg:block">{ROLE_LABEL[user.role]}</p>
          </div>
          {logoutButton('flex px-4 py-1.5 text-base lg:hidden')}
        </div>
        <nav className="mt-2 flex gap-1 overflow-x-auto lg:mt-[clamp(20px,7vh,90px)] lg:flex-col lg:gap-[clamp(6px,1.6vh,16px)] lg:overflow-visible">
          {menu.map((entry) => (
            <NavLink key={entry.to} to={entry.to} end={entry.end} className={item}>
              <Icon src={entry.icon} className="size-5 lg:size-7" />
              {entry.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden lg:mt-auto lg:block">
          <div className="mb-3 h-[3px] bg-flame" />
          {logoutButton(`flex w-full px-4 py-2 ${size}`)}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex justify-end px-4 pt-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="hidden font-moon text-base text-coal-deep sm:inline">{user.name}</span>
            <span className="grid size-12 place-items-center bg-coal p-[3px]" title={user.name}>
              <span className="grid size-full place-items-center border-[3px] border-cream text-cream">
                <Icon src={ikonProfil} className="size-6" />
              </span>
            </span>
          </div>
        </div>
        <main className="px-3 pb-8 pt-3 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
