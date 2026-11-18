import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import ornamenKananAtas from '../../assets/landing/hero-ornamen-kanan-atas.webp';
import ornamenKananBawah from '../../assets/landing/hero-ornamen-kanan-bawah.webp';
import ornamenKiri from '../../assets/landing/hero-ornamen-kiri.webp';
import { Magnet, Ornament, Reveal, RollingText, useHoverFocus } from './Motion';
import { Framed, SECTION } from './Parts';
import { box, Crop, Stage } from './Stage';

const FILL = 'pointer-events-none absolute inset-0 size-full max-w-none object-cover';
// Transformasi ornamen dari Figma: skala, lalu miring, lalu putar. Urutan kelas Tailwind berbeda, jadi ditulis langsung.
const isometric = (rotate: number, skew: number) => ({ transform: `rotate(${rotate}deg) skewX(${skew}deg) scaleY(${Math.cos((skew * Math.PI) / 180)})` });

// Judul hero dibuat dengan HTML dan CSS (masukan teman PM 18 Nov), menggantikan tiga gambar: tulisan SIMPK, subjudul,
// dan bayangan latar. Bayangan panjang ke kiri bawah dibuat dari text-shadow berlapis sehingga kedua bayangan menyatu
// menjadi bidang gelap seperti desain. Lapisan bayangan dipisah dari lapisan huruf agar bayangan huruf berikutnya tidak
// menimpa huruf sebelumnya. Ukuran memakai koordinat artboard Figma lewat box().
const BAYANGAN_WARNA = 'var(--color-coal-deep)';
const bayanganPanjang = (panjang: number, langkah = 1.5) =>
  Array.from({ length: Math.ceil(panjang / langkah) }, (_, i) => `${-(i + 1) * langkah}px ${(i + 1) * langkah}px 0 ${BAYANGAN_WARNA}`).join(', ');
const BAYANGAN_JUDUL = bayanganPanjang(950);
const BAYANGAN_SUB = bayanganPanjang(800);
const JUDUL = 'SIMPK';
const MASUK = { x: -160, y: 160 };
const EASE_JUDUL = [0.22, 1, 0.36, 1] as const;

function HurufJudul({ bayangan }: { bayangan: boolean }) {
  return (
    <>
      {JUDUL.split('').map((huruf, index) => (
        <motion.span
          key={index}
          className="inline-block"
          style={bayangan ? { color: 'transparent', textShadow: BAYANGAN_JUDUL } : undefined}
          initial={{ opacity: 0, ...MASUK }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 + index * 0.08, ease: EASE_JUDUL }}
        >
          {huruf}
        </motion.span>
      ))}
    </>
  );
}

function Subjudul({ bayangan }: { bayangan: boolean }) {
  return (
    <motion.span
      className="absolute block text-center"
      style={{ ...SUB_BOX, ...(bayangan ? { color: 'transparent', textShadow: BAYANGAN_SUB } : null) }}
      initial={{ opacity: 0, x: -120, y: 120 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: EASE_JUDUL }}
    >
      Sistem Informasi Manajemen{' '}
      <br />
      Proyek Klien
    </motion.span>
  );
}

const JUDUL_BOX = { ...box(452, 232), fontSize: 198 };
const SUB_BOX = { ...box(318, 487, 838), fontSize: 49, lineHeight: 1.12 };

/** Judul hero: SIMPK dan subjudulnya, berupa teks asli (h1) dengan bayangan panjang. */
function Title() {
  return (
    <h1 className="pointer-events-none absolute inset-0 m-0 font-magic font-normal uppercase leading-none text-flame">
      <span aria-hidden="true">
        <span className="absolute flex whitespace-nowrap" style={JUDUL_BOX}>
          <HurufJudul bayangan />
        </span>
      </span>
      <span className="absolute flex whitespace-nowrap" style={JUDUL_BOX}>
        <span className="sr-only">SIMPK, </span>
        <span aria-hidden="true" className="flex">
          <HurufJudul bayangan={false} />
        </span>
      </span>
      <span aria-hidden="true">
        <Subjudul bayangan />
      </span>
      <Subjudul bayangan={false} />
    </h1>
  );
}

// Bagian artboard di bawah menu Figma (y 110 sampai 1024) harus muat di sisa tinggi layar.
const HERO_VIEW = { x: 0, y: 110, w: 1440, h: 914 };

function Desktop() {
  const cta = useHoverFocus();
  return (
    // Navbar menempel di atas (LandingHeader di LandingPage); hero mengisi sisa tinggi layar di bawahnya.
    <div className="hidden h-[calc(100dvh-var(--landing-header-h,0px))] min-h-[480px] flex-col bg-cream lg:flex">
    <Stage framed fill view={HERO_VIEW} className="min-h-0 flex-1">
      <div className="edge-r pointer-events-none absolute inset-0">
        <Reveal immediate y={40} delay={0.9} className="pointer-events-auto absolute" style={box(883, 856, 505, 132)}>
        <Magnet className="size-full" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link to="/katalog" className="group absolute inset-0 block" {...cta.handlers}>
            <span className="absolute border-5 border-coal bg-coal" style={box(0, 0, 505, 132)} />
            <span className="absolute border-5 border-cream bg-coal transition-colors group-hover:border-flame" style={box(6, 5, 493, 120)} />
            <span className="absolute border-5 border-coal bg-coal" style={box(17, 12, 472, 106)} />
            <span className="absolute whitespace-nowrap font-magic text-[36px] uppercase leading-[normal] text-flame" style={box(52, 45)}>
              <RollingText text="Lets Make A project" active={cta.active} />
            </span>
          </Link>
        </Magnet>
      </Reveal>
      </div>

      <div className="edge-r2 pointer-events-none absolute inset-0">
        <div className="pointer-events-none absolute flex items-center justify-center" style={box(1100, 150, 468.67, 270.587)}>
        <Ornament depth={34} tilt={16} enterRotate={120} delay={0.6} naikMaks={16} float={{ amplitude: 12, rotate: 2, duration: 7 }}>
          <div className="flex-none" style={isometric(-30, 30)}>
            <div className="relative h-[269.792px] w-[271.382px]">
              <img alt="" className={FILL} src={ornamenKananAtas} />
            </div>
          </div>
        </Ornament>
      </div>
      </div>
      <div className="edge-r2 pointer-events-none absolute inset-0">
        <div className="pointer-events-none absolute flex items-center justify-center" style={box(1186, 537, 151, 260.518)}>
        <Ornament depth={-20} tilt={20} enterRotate={-150} delay={0.8} float={{ amplitude: 10, rotate: -3, duration: 6, delay: 0.8 }}>
          <div className="flex-none" style={isometric(30, 30)}>
            <div className="relative h-[173.338px] w-[174.36px]">
              <img alt="" className={FILL} src={ornamenKananBawah} />
            </div>
          </div>
        </Ornament>
      </div>
      </div>

      <div className="edge-l2 pointer-events-none absolute inset-0">
        <div className="pointer-events-none absolute flex items-center justify-center" style={box(-70, 140, 429.516, 329.579)}>
        {/* Menempel di tepi atas hero: hanya boleh bergeser dan mengambang ke bawah agar tidak terpotong. */}
        <Ornament depth={26} tilt={10} enterRotate={-100} delay={0.45} naikMaks={0} float={{ amplitude: -8, rotate: 1.5, duration: 8, delay: 0.4 }}>
          <div className="flex-none" style={isometric(-15, 15)}>
            <div className="relative size-[293px] rounded-[30px]">
              <div className="absolute inset-0 overflow-hidden rounded-[30px]">
                <img alt="" className="absolute left-[-5.43%] top-[-5.42%] size-[111.26%] max-w-none" src={ornamenKiri} />
              </div>
            </div>
          </div>
        </Ornament>
      </div>
      </div>

      <Title />
    </Stage>
    </div>
  );
}

function Mobile() {
  return (
    <div className="bg-cream lg:hidden">
      <Crop x={300} y={150} w={870} h={650} className="mt-2">
        <Title />
      </Crop>

      <div className="bg-coal px-5 pb-10 pt-6">
        <Reveal y={30}>
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
      <Desktop />
      <Mobile />
    </section>
  );
}
