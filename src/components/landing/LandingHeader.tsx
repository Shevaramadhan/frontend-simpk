import { Link } from 'react-router-dom';
import logo from '../../assets/landing/logo-hitam.webp';
import { Magnet, Reveal } from './Motion';
import { NAV_ITEMS } from './Parts';

// Header landing page di layar lebar. Bukan bagian artboard agar logo selalu di sudut kiri atas layar dan
// ukurannya mengikuti tinggi layar (masukan PM 14 Nov). Tampilan mengikuti Figma: pil menu dan tombol berbingkai.
const TEXT = 'font-magic uppercase leading-none text-flame text-[clamp(13px,2.3vh,24px)]';

export default function LandingHeader() {
  return (
    <header className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-[clamp(12px,1.6vw,28px)] py-[clamp(8px,1.8vh,20px)]">
      <Reveal immediate x={-40} className="justify-self-start">
        <Link to="/" aria-label="Neo Telemetri, beranda">
          <img alt="Neo Telemetri, IT For The Future" className="h-[clamp(28px,5.2vh,52px)] w-auto" src={logo} />
        </Link>
      </Reveal>

      <Reveal immediate y={-40}>
        <nav aria-label="Bagian halaman" className="rounded-[clamp(18px,3vh,30px)] bg-coal p-[3px]">
          <div className="flex items-center rounded-[clamp(16px,2.7vh,27px)] border-[clamp(3px,0.45vh,5px)] border-cream bg-coal px-[clamp(10px,1.6vw,26px)] py-[clamp(8px,1.6vh,16px)]">
            {NAV_ITEMS.map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`${TEXT} whitespace-nowrap px-[clamp(8px,1vw,16px)] transition-colors hover:text-cream ${index ? 'border-l-2 border-cream' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </Reveal>

      <Reveal immediate y={-40} delay={0.15} className="justify-self-end">
        <Magnet whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Link to="/login" className="group block bg-coal p-[3px]">
            <span className="block border-[clamp(3px,0.45vh,5px)] border-cream bg-coal px-[clamp(18px,2.6vw,48px)] py-[clamp(7px,1.4vh,14px)] transition-colors group-hover:border-flame">
              <span className={TEXT}>Sign in</span>
            </span>
          </Link>
        </Magnet>
      </Reveal>
    </header>
  );
}
