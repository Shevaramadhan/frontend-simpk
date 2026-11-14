import { Link } from 'react-router-dom';
import bayangan from '../../assets/landing/hero-bayangan.png';
import ornamenKananAtas from '../../assets/landing/hero-ornamen-kanan-atas.webp';
import ornamenKananBawah from '../../assets/landing/hero-ornamen-kanan-bawah.webp';
import ornamenKiri from '../../assets/landing/hero-ornamen-kiri.webp';
import judulSimpk from '../../assets/landing/hero-simpk.png';
import subjudul from '../../assets/landing/hero-subjudul.png';
import logo from '../../assets/landing/logo-hitam.webp';
import { Float, Magnet, Reveal } from './Motion';
import LandingHeader from './LandingHeader';
import { Framed, NAV_ITEMS, SECTION, SIMPK_DESCRIPTION } from './Parts';
import { box, Crop, Stage } from './Stage';

const FILL = 'pointer-events-none absolute inset-0 size-full max-w-none object-cover';
// Transformasi ornamen dari Figma: skala, lalu miring, lalu putar. Urutan kelas Tailwind berbeda, jadi ditulis langsung.
const isometric = (rotate: number, skew: number) => ({ transform: `rotate(${rotate}deg) skewX(${skew}deg) scaleY(${Math.cos((skew * Math.PI) / 180)})` });

/** Bayangan miring di sudut kiri bawah. Masuk dari arah bayangannya. */
function Backdrop() {
  return (
    <Reveal immediate x={-140} y={140} duration={1} className="pointer-events-none absolute" style={box(-366, 522, 1469, 667)}>
      <img alt="" className={FILL} src={bayangan} />
    </Reveal>
  );
}

/** Tulisan SIMPK dan subjudulnya, berupa gambar dari desain. */
function Title() {
  return (
    <>
      <Reveal immediate x={-160} y={160} duration={1.1} delay={0.1} className="pointer-events-none absolute" style={box(-253, 222, 1356, 890)}>
        <img alt="" className={FILL} src={judulSimpk} />
      </Reveal>
      <Reveal immediate x={-120} y={120} duration={1} delay={0.35} className="pointer-events-none absolute" style={box(-18, 484, 1163, 451)}>
        <img alt="" className={FILL} src={subjudul} />
      </Reveal>
    </>
  );
}

// Bagian artboard di bawah menu Figma (y 110 sampai 1024) harus muat di sisa tinggi layar.
const HERO_VIEW = { x: 0, y: 110, w: 1440, h: 914 };

function Desktop() {
  return (
    <div className="hidden h-dvh min-h-[560px] flex-col bg-cream lg:flex">
    <LandingHeader />
    <Stage framed fill view={HERO_VIEW} className="min-h-0 flex-1">
      <Backdrop />

      <div className="edge-r pointer-events-none absolute inset-0">
        <Reveal immediate y={40} delay={0.9} className="pointer-events-auto absolute" style={box(883, 856, 505, 132)}>
        <Magnet className="size-full" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link to="/katalog" className="group absolute inset-0 block">
            <span className="absolute border-5 border-coal bg-coal" style={box(0, 0, 505, 132)} />
            <span className="absolute border-5 border-cream bg-coal transition-colors group-hover:border-flame" style={box(6, 5, 493, 120)} />
            <span className="absolute border-5 border-coal bg-coal" style={box(17, 12, 472, 106)} />
            <span className="absolute whitespace-nowrap font-magic text-[36px] uppercase leading-[normal] text-flame" style={box(52, 45)}>
              Lets Make A project
            </span>
          </Link>
        </Magnet>
      </Reveal>
      </div>

      <div className="edge-r2 pointer-events-none absolute inset-0">
        <Reveal immediate scale={0.6} delay={0.6} className="pointer-events-none absolute flex items-center justify-center" style={box(1100, 150, 468.67, 270.587)}>
        <Float amplitude={12} rotate={2} duration={7}>
          <div className="flex-none" style={isometric(-30, 30)}>
            <div className="relative h-[269.792px] w-[271.382px]">
              <img alt="" className={FILL} src={ornamenKananAtas} />
            </div>
          </div>
        </Float>
      </Reveal>
      </div>
      <div className="edge-r2 pointer-events-none absolute inset-0">
        <Reveal immediate scale={0.6} delay={0.75} className="pointer-events-none absolute flex items-center justify-center" style={box(1186, 537, 151, 260.518)}>
        <Float amplitude={10} rotate={-3} duration={6} delay={0.8}>
          <div className="flex-none" style={isometric(30, 30)}>
            <div className="relative h-[173.338px] w-[174.36px]">
              <img alt="" className={FILL} src={ornamenKananBawah} />
            </div>
          </div>
        </Float>
      </Reveal>
      </div>

      <div className="edge-l2 pointer-events-none absolute inset-0">
        <Reveal immediate scale={0.6} delay={0.5} className="pointer-events-none absolute flex items-center justify-center" style={box(-70, 110, 429.516, 329.579)}>
        <Float amplitude={8} rotate={1.5} duration={8} delay={0.4}>
          <div className="flex-none" style={isometric(-15, 15)}>
            <div className="relative size-[293px] rounded-[30px]">
              <div className="absolute inset-0 overflow-hidden rounded-[30px]">
                <img alt="" className="absolute left-[-5.43%] top-[-5.42%] size-[111.26%] max-w-none" src={ornamenKiri} />
              </div>
            </div>
          </div>
        </Float>
      </Reveal>
      </div>

      <Title />

      <div className="edge-l3 pointer-events-none absolute inset-0">
        <Reveal immediate y={30} delay={0.8} className="absolute" style={box(21, 833, 681)}>
        <p className="text-justify font-moon text-[32px] leading-[normal] text-cream">{SIMPK_DESCRIPTION}</p>
      </Reveal>
      </div>
    </Stage>
    </div>
  );
}

function Mobile() {
  return (
    <div className="bg-cream lg:hidden">
      <div className="flex items-center justify-between gap-3 px-4 pt-4">
        <img alt="Neo Telemetri, IT For The Future" className="h-8 w-auto sm:h-10" src={logo} />
        <Link to="/login">
          <Framed>
            <span className="block px-5 py-1.5 font-magic text-base uppercase text-flame sm:text-xl">SIGN IN</span>
          </Framed>
        </Link>
      </div>

      <nav aria-label="Bagian halaman" className="mx-4 mt-4">
        <Framed rounded="rounded-[22px]">
          <span className="flex items-center justify-center divide-x-2 divide-cream py-2">
            {NAV_ITEMS.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="whitespace-nowrap px-1.5 font-magic text-[11px] uppercase text-flame min-[400px]:px-2.5 min-[400px]:text-[13px] sm:px-5 sm:text-xl">
                {item.label}
              </a>
            ))}
          </span>
        </Framed>
      </nav>

      <Crop x={300} y={150} w={870} h={650} className="mt-2">
        <Backdrop />
        <Title />
      </Crop>

      <div className="bg-coal px-5 pb-10 pt-6">
        <Reveal y={30}>
          <p className="text-justify font-moon text-lg leading-[normal] text-cream sm:text-2xl">{SIMPK_DESCRIPTION}</p>
        </Reveal>
        <Reveal y={30} delay={0.15} className="mt-6">
          <Link to="/katalog">
            <Framed>
              <span className="block px-4 py-4 text-center font-magic text-2xl uppercase text-flame sm:text-3xl">Lets Make A project</span>
            </Framed>
          </Link>
        </Reveal>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section id={SECTION.home}>
      <h1 className="sr-only">SIMPK, Sistem Informasi Manajemen Proyek Klien Neo Telemetri</h1>
      <Desktop />
      <Mobile />
    </section>
  );
}
