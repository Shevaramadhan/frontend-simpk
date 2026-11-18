import { useCallback, useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import belakangAtas from '../../assets/landing/latest-belakang-atas.webp';
import belakangBawah from '../../assets/landing/latest-belakang-bawah.webp';
import utama from '../../assets/landing/latest-utama.webp';
import Lightbox from './Lightbox';
import { DrawLine, Reveal, SplitWords } from './Motion';
import { SECTION } from './Parts';
import { box, Crop, Stage } from './Stage';

const TITLE = 'Proudly share our latest project';
const PROJECT_NAME = 'WEBSITE FIRETECH 2026';
const PROJECT_TEXT =
  'Dalam project ini kami diberi tugas untuk membuat sebuah website yang bertujuan untuk membantu para peserta FIRETECH 2026 melakukan registrasi dan mendapatkan info selengkapnya seputar lomba lomba di FIRETECH';

const FILL = 'pointer-events-none absolute inset-0 size-full max-w-none rounded-[30px] object-cover';
const TITLE_TEXT = 'whitespace-nowrap font-magic text-[64px] uppercase leading-[normal] tracking-[3.2px]';
// Bagian judul dan garis yang berada di atas segitiga gelap digambar ulang dengan warna krem.
// Bentuk segitiga dibuat dengan clip-path (bukan gambar).
const TRIANGLE_MASK: CSSProperties = { clipPath: 'polygon(0 0, 100% 0, 0 100%)' };

function Triangle() {
  return (
    <>
    <div className="pointer-events-none absolute bg-coal" style={box(-1000, 0, 999, 579.5)} />
    <div className="pointer-events-none absolute bg-coal" style={{ ...box(-2, 0, 644, 579.5), ...TRIANGLE_MASK }} />
    </>
  );
}

// Tiga tangkapan layar proyek, urut seperti tampil di lightbox. Gambar utama adalah halaman beranda
// (sebelumnya layar pembuka yang hanya berisi logo), layar pembuka pindah ke kartu belakang.
const SHOTS = [
  { src: utama, alt: 'Halaman beranda website Firetech 2026' },
  { src: belakangAtas, alt: 'Halaman pembuka website Firetech' },
  { src: belakangBawah, alt: 'Halaman tentang Firetech' },
];

/**
 * Susunan tiga tangkapan layar proyek. Saat diam bertumpuk sesuai Figma; gambar yang diarahkan kursor
 * naik ke depan agar gambar belakang dapat dilihat utuh, dan klik membuka tampilan penuh.
 */
function Collage() {
  const [depan, setDepan] = useState<number | null>(null);
  const [buka, setBuka] = useState<number | null>(null);
  const tutup = useCallback(() => setBuka(null), []);
  const geser = useCallback((step: number) => setBuka((i) => (i === null ? i : (i + step + SHOTS.length) % SHOTS.length)), []);

  // Urutan tumpukan bawaan desain: bawah (2), atas (1), utama (0) di paling depan.
  const z = (i: number, bawaan: number) => (depan === i ? 20 : bawaan);
  const kartu = (i: number) => ({
    onMouseEnter: () => setDepan(i),
    onMouseLeave: () => setDepan((d) => (d === i ? null : d)),
    onFocus: () => setDepan(i),
    onBlur: () => setDepan((d) => (d === i ? null : d)),
    onClick: () => setBuka(i),
    'aria-label': `Lihat ${SHOTS[i].alt}`,
  });
  const hover = { scale: 1.06, rotate: -1 };
  const pegas = { type: 'spring', stiffness: 260, damping: 18 } as const;

  return (
    <>
      <Reveal scale={0.5} delay={0.2} className="pointer-events-none absolute" style={box(55, 788, 627, 157)}>
        <div className="absolute inset-0 rounded-[50%] bg-coal" />
      </Reveal>

      <Reveal x={120} y={60} delay={0.35} className="absolute" style={{ ...box(296, 646, 472, 230), zIndex: z(2, 1) }}>
        <motion.button type="button" className="absolute inset-0 cursor-zoom-in" whileHover={hover} whileFocus={hover} transition={pegas} {...kartu(2)}>
          <div className="absolute inset-0 rounded-[30px] bg-flame" />
          <div className="absolute" style={box(33, 11, 407, 208)}>
            <img alt={SHOTS[2].alt} className={FILL} src={belakangBawah} />
            <div className="absolute inset-0 rounded-[30px] border-3 border-coal-deep" />
          </div>
        </motion.button>
      </Reveal>

      <Reveal x={-120} y={-60} delay={0.25} className="absolute" style={{ ...box(13, 270, 472, 230), zIndex: z(1, 2) }}>
        <motion.button type="button" className="absolute inset-0 cursor-zoom-in" whileHover={hover} whileFocus={hover} transition={pegas} {...kartu(1)}>
          <div className="absolute inset-0 rounded-[30px] bg-flame" />
          <div className="absolute" style={box(38, 12, 402, 206)}>
            <img alt={SHOTS[1].alt} className={FILL} src={belakangAtas} />
            <div className="absolute inset-0 rounded-[30px] border-3 border-black" />
          </div>
        </motion.button>
      </Reveal>

      <Reveal scale={0.85} delay={0.1} className="absolute" style={{ ...box(54, 403, 627.619, 358), zIndex: z(0, 3) }}>
        <motion.button type="button" className="absolute inset-0 cursor-zoom-in" whileHover={{ scale: 1.03, rotate: -1 }} whileFocus={{ scale: 1.03, rotate: -1 }} transition={pegas} {...kartu(0)}>
          <div className="absolute inset-0 rounded-[30px] bg-coal" />
          <div className="absolute" style={box(16.78, 26.85, 594.483, 304.082)}>
            <img alt={SHOTS[0].alt} className={FILL} src={utama} />
            <div className="absolute inset-0 rounded-[30px] border-3 border-cream" />
          </div>
        </motion.button>
      </Reveal>

      <Lightbox items={SHOTS} index={buka} onClose={tutup} onMove={geser} />
    </>
  );
}

function Desktop() {
  return (
    <Stage framed className="bg-cream">
      <div className="edge-r2 absolute inset-0">
        <Reveal x={100} className="absolute rounded-[30px] bg-coal" style={box(781, 251, 585, 694)} />
      </div>

      <h2 className={`absolute text-flame ${TITLE_TEXT}`} style={box(68, 57)}>
        <SplitWords text={TITLE} />
      </h2>

      <div className="edge-r2 pointer-events-none absolute inset-0">
        <Reveal y={30} delay={0.35} className="absolute" style={box(817, 371, 509)}>
        <p className="text-justify font-body text-[30px] leading-[1.45] text-cream">{PROJECT_TEXT}</p>
      </Reveal>
      </div>

      <Triangle />

      <div className="absolute h-0" style={box(68, 162, 1298)}>
        <DrawLine className="absolute inset-[-10px_0_0_0]">
          <span className="block size-full bg-coal" />
        </DrawLine>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute" style={{ ...box(-2, 0, 644, 579.5), ...TRIANGLE_MASK }}>
        <p className={`absolute text-cream ${TITLE_TEXT}`} style={box(66, 57)}>
          <SplitWords text={TITLE} />
        </p>
        <div className="absolute h-0" style={box(70, 163, 1298)}>
          <DrawLine className="absolute inset-[-10px_0_0_0]">
            <span className="block size-full bg-cream" />
          </DrawLine>
        </div>
      </div>

      <div className="edge-r2 pointer-events-none absolute inset-0">
        {/* Judul berdiri di atas kotak gelap, tidak menumpuk tepinya: garis tepi krem tidak menutup celah antarhuruf
            sehingga kotak gelap tampak sebagai titik-titik kecil. */}
        <Reveal y={-30} scale={0.9} delay={0.2} className="absolute" style={box(768, 186, 607)}>
        <h3 className="text-outline-lg whitespace-nowrap text-center font-magic text-[46px] leading-[normal] tracking-[2px] text-flame">{PROJECT_NAME}</h3>
      </Reveal>
      </div>

      <div className="edge-l2 absolute inset-0">
        <Collage />
      </div>
    </Stage>
  );
}

function Mobile() {
  const titleClass = 'font-magic text-[6.6vw] uppercase leading-tight tracking-wide';
  const lineClass = 'mt-2 h-1.5 sm:h-2.5';
  return (
    <div className="relative overflow-hidden bg-cream pb-10 lg:hidden">
      <Crop x={0} y={0} w={781} h={960}>
        <Triangle />
        <Collage />
      </Crop>

      <div className="absolute inset-x-0 top-0 px-4 pt-5">
        <h2 className={`text-flame ${titleClass}`}>{TITLE}</h2>
        <div className={`bg-coal ${lineClass}`} />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 overflow-hidden"
        style={{ width: 'calc(var(--vw) * 644px / 781)', height: 'calc(var(--vw) * 579.5px / 781)', ...TRIANGLE_MASK }}
      >
        <div className="px-4 pt-5" style={{ width: 'calc(var(--vw) * 1px)' }}>
          <p className={`text-cream ${titleClass}`}>{TITLE}</p>
          <div className={`bg-cream ${lineClass}`} />
        </div>
      </div>

      <div className="relative mx-4 mt-8">
        <Reveal y={-20} scale={0.9}>
          <h3 className="whitespace-nowrap text-center font-magic text-[6.8vw] leading-none tracking-wide text-flame">{PROJECT_NAME}</h3>
        </Reveal>
        <Reveal y={30} delay={0.1} className="mt-3 rounded-[30px] bg-coal px-5 py-8 sm:px-8">
          <p className="text-justify font-body text-base leading-relaxed text-cream sm:text-xl">{PROJECT_TEXT}</p>
        </Reveal>
      </div>
    </div>
  );
}

export default function LatestProjectSection() {
  return (
    <section id={SECTION.latest}>
      <Desktop />
      <Mobile />
    </section>
  );
}
