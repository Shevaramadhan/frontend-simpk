import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/landing/logo-hitam.webp';
import { Magnet, Reveal, RollingText, useHoverFocus } from './Motion';
import { Framed, NAV_ITEMS } from './Parts';
import PillMenu from './PillMenu';

// Header landing page: menempel di atas layar saat digulir (masukan teman PM 18 Nov) agar pengunjung selalu tahu
// posisinya dan bisa kembali ke bagian lain. Tampilan mengikuti Figma: pil menu dan tombol berbingkai.
// Tingginya ditulis ke --landing-header-h agar hero dan jarak gulir tiap bagian menyesuaikan.
const TEXT = 'font-magic uppercase leading-none text-[clamp(13px,2.3vh,24px)]';

/** Bagian yang sedang terlihat, untuk menyorot menunya. */
function useBagianAktif() {
  const [aktif, setAktif] = useState<string>(NAV_ITEMS[0].id);
  useEffect(() => {
    const bagian = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => Boolean(el));
    if (!bagian.length) return;
    // Bagian dianggap aktif saat melewati garis 40% dari atas layar.
    const observer = new IntersectionObserver(
      (entries) => {
        const terlihat = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (terlihat[0]) setAktif(terlihat[0].target.id);
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    bagian.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return aktif;
}

export default function LandingHeader() {
  const signIn = useHoverFocus();
  const ref = useRef<HTMLElement>(null);
  const aktif = useBagianAktif();
  const [digulir, setDigulir] = useState(false);

  useEffect(() => {
    const onScroll = () => setDigulir(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tulis = () => document.documentElement.style.setProperty('--landing-header-h', `${el.offsetHeight}px`);
    tulis();
    const observer = new ResizeObserver(tulis);
    observer.observe(el);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--landing-header-h');
    };
  }, []);

  const menu = NAV_ITEMS.map((item) => ({ key: item.id, label: item.label, href: `#${item.id}` }));

  return (
    <header
      ref={ref}
      className={`sticky top-0 z-40 bg-cream transition-shadow duration-300 ${digulir ? 'shadow-[0_6px_18px_-8px_rgba(0,0,0,0.35)]' : ''}`}
    >
      {/* Layar lebar: logo, pil menu, dan tombol masuk dalam satu baris. */}
      <div className="hidden grid-cols-[1fr_auto_1fr] items-center gap-4 px-[clamp(12px,1.6vw,28px)] py-[clamp(8px,1.8vh,20px)] lg:grid">
        <Reveal immediate x={-40} className="justify-self-start">
          <Link to="/" aria-label="Neo Telemetri, beranda">
            <img alt="Neo Telemetri, IT For The Future" className="h-[clamp(28px,5.2vh,52px)] w-auto" src={logo} />
          </Link>
        </Reveal>

        <Reveal immediate y={-40}>
          <PillMenu kind="nav" label="Bagian halaman" size="nav" items={menu} active={aktif} />
        </Reveal>

        <Reveal immediate y={-40} delay={0.15} className="justify-self-end">
          <Magnet whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link to="/login" className="group block bg-coal p-[3px]" {...signIn.handlers}>
              <span className="block border-[clamp(3px,0.45vh,5px)] border-cream bg-coal px-[clamp(18px,2.6vw,48px)] py-[clamp(7px,1.4vh,14px)] transition-colors group-hover:border-flame">
                {/* Huruf besar Magic Hat duduk tinggi di dalam baris; diturunkan agar tampak di tengah bingkai. */}
                <span className={`${TEXT} relative top-[0.07em] block text-flame`}>
                  <RollingText text="Sign in" active={signIn.active} />
                </span>
              </span>
            </Link>
          </Magnet>
        </Reveal>
      </div>

      {/* Ponsel: logo dan tombol masuk, lalu pil menu di bawahnya. */}
      <div className="px-4 pb-3 pt-4 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" aria-label="Neo Telemetri, beranda">
            <img alt="Neo Telemetri, IT For The Future" className="h-8 w-auto sm:h-10" src={logo} />
          </Link>
          <Link to="/login">
            <Framed>
              <span className="block px-5 py-1.5 font-magic text-base uppercase text-flame sm:text-xl">SIGN IN</span>
            </Framed>
          </Link>
        </div>
        <div className="mt-3 flex justify-center">
          <PillMenu kind="nav" label="Bagian halaman" size="kecil" items={menu} active={aktif} />
        </div>
      </div>
    </header>
  );
}
