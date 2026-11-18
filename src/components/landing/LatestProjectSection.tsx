import { useCallback, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import utama from '../../assets/landing/latest-utama.webp';
import bakti from '../../assets/landing/proyek-bakti.webp';
import tedx from '../../assets/landing/proyek-tedx.webp';
import { PROJECTS } from '../../data/portofolio';
import Lightbox, { type LightboxItem } from './Lightbox';
import { DrawLine, Reveal, SplitWords } from './Motion';
import { SECTION } from './Parts';
import { box, Crop, Stage } from './Stage';

const TITLE = 'Proudly share our latest project';
const deskripsi = (id: string) => PROJECTS.find((project) => project.id === id)?.description ?? '';

// Tiga proyek terbaru (masukan PM 18 Nov): Firetech, Bakti, dan TEDx. Proyek aktif berada di kartu depan,
// dua lainnya di kartu belakang; klik kartu belakang atau tombol panah untuk memajukannya.
const LATEST: (LightboxItem & { name: string; text: string })[] = [
  {
    name: 'WEBSITE FIRETECH 2026',
    text: 'Dalam project ini kami diberi tugas untuk membuat sebuah website yang bertujuan untuk membantu para peserta FIRETECH 2026 melakukan registrasi dan mendapatkan info selengkapnya seputar lomba lomba di FIRETECH',
    src: utama,
    alt: 'Halaman beranda website Firetech 2026',
  },
  { name: 'BAKTI UNAND 2026', text: deskripsi('bakti'), src: bakti, alt: 'Halaman beranda website Bakti Unand 2026' },
  { name: 'TEDX UNAND', text: deskripsi('tedx'), src: tedx, alt: 'Halaman beranda website TEDx Unand' },
].map((item) => ({ ...item, title: item.name, description: item.text }));

const FILL = 'pointer-events-none absolute inset-0 size-full max-w-none rounded-[30px] object-cover';
const TITLE_TEXT = 'whitespace-nowrap font-magic text-[64px] uppercase leading-[normal] tracking-[3.2px]';
// Bagian judul dan garis yang berada di atas segitiga gelap digambar ulang dengan warna krem.
// Bentuk segitiga dibuat dengan clip-path (bukan gambar).
const TRIANGLE_MASK: CSSProperties = { clipPath: 'polygon(0 0, 100% 0, 0 100%)' };
const GANTI = { duration: 0.45, ease: [0.22, 1, 0.36, 1] } as const;

function Triangle() {
  return (
    <>
    <div className="pointer-events-none absolute bg-coal" style={box(-1000, 0, 999, 579.5)} />
    <div className="pointer-events-none absolute bg-coal" style={{ ...box(-2, 0, 644, 579.5), ...TRIANGLE_MASK }} />
    </>
  );
}

function useLatest() {
  const [aktif, setAktif] = useState(0);
  const [buka, setBuka] = useState<number | null>(null);
  const geser = useCallback((step: number) => setAktif((i) => (i + step + LATEST.length) % LATEST.length), []);
  const tutup = useCallback(() => setBuka(null), []);
  const geserLightbox = useCallback((step: number) => setBuka((i) => (i === null ? i : (i + step + LATEST.length) % LATEST.length)), []);
  return { aktif, setAktif, geser, buka, setBuka, tutup, geserLightbox };
}

type Latest = ReturnType<typeof useLatest>;

/** Gambar yang berganti dengan memudar saat proyek berganti. */
function Gambar({ index }: { index: number }) {
  return (
    <AnimatePresence initial={false}>
      <motion.img
        key={index}
        alt={LATEST[index].alt}
        className={FILL}
        src={LATEST[index].src}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={GANTI}
      />
    </AnimatePresence>
  );
}

/**
 * Susunan tiga kartu seperti Figma. Kartu depan berisi proyek aktif (klik: tampilan penuh); kartu belakang berisi dua
 * proyek lain (klik: dimajukan). Kartu yang diarahkan kursor naik ke depan agar terlihat utuh.
 */
function Collage({ aktif, setAktif, setBuka }: Latest) {
  const [depan, setDepan] = useState<number | null>(null);
  const atas = (aktif + 1) % LATEST.length;
  const bawah = (aktif + 2) % LATEST.length;

  // Urutan tumpukan bawaan desain: bawah (slot 2), atas (slot 1), utama (slot 0) di paling depan.
  const z = (slot: number, bawaan: number) => (depan === slot ? 20 : bawaan);
  const sorot = (slot: number) => ({
    onMouseEnter: () => setDepan(slot),
    onMouseLeave: () => setDepan((d) => (d === slot ? null : d)),
    onFocus: () => setDepan(slot),
    onBlur: () => setDepan((d) => (d === slot ? null : d)),
  });
  const hover = { scale: 1.06, rotate: -1 };
  const pegas = { type: 'spring', stiffness: 260, damping: 18 } as const;

  return (
    <>
      {/* Bayangan lembut di bawah kartu (sebelumnya elips hitam padat). */}
      <Reveal scale={0.5} delay={0.2} className="pointer-events-none absolute" style={box(55, 770, 627, 175)}>
        <div className="absolute inset-0 rounded-[50%] bg-[radial-gradient(closest-side,rgba(20,20,20,0.6),rgba(20,20,20,0.28)_55%,transparent)] blur-[10px]" />
      </Reveal>

      <Reveal x={120} y={60} delay={0.35} className="absolute" style={{ ...box(296, 646, 472, 230), zIndex: z(2, 1) }}>
        <motion.button
          type="button"
          className="absolute inset-0 cursor-pointer"
          whileHover={hover}
          whileFocus={hover}
          transition={pegas}
          onClick={() => setAktif(bawah)}
          aria-label={`Tampilkan ${LATEST[bawah].name}`}
          {...sorot(2)}
        >
          <div className="absolute inset-0 rounded-[30px] bg-flame shadow-[0_18px_30px_-12px_rgba(0,0,0,0.45)]" />
          <div className="absolute overflow-hidden rounded-[30px]" style={box(33, 11, 407, 208)}>
            <Gambar index={bawah} />
            <div className="absolute inset-0 rounded-[30px] border-3 border-coal-deep" />
          </div>
        </motion.button>
      </Reveal>

      <Reveal x={-120} y={-60} delay={0.25} className="absolute" style={{ ...box(13, 270, 472, 230), zIndex: z(1, 2) }}>
        <motion.button
          type="button"
          className="absolute inset-0 cursor-pointer"
          whileHover={hover}
          whileFocus={hover}
          transition={pegas}
          onClick={() => setAktif(atas)}
          aria-label={`Tampilkan ${LATEST[atas].name}`}
          {...sorot(1)}
        >
          <div className="absolute inset-0 rounded-[30px] bg-flame shadow-[0_18px_30px_-12px_rgba(0,0,0,0.45)]" />
          <div className="absolute overflow-hidden rounded-[30px]" style={box(38, 12, 402, 206)}>
            <Gambar index={atas} />
            <div className="absolute inset-0 rounded-[30px] border-3 border-black" />
          </div>
        </motion.button>
      </Reveal>

      <Reveal scale={0.85} delay={0.1} className="absolute" style={{ ...box(54, 403, 627.619, 358), zIndex: z(0, 3) }}>
        <motion.button
          type="button"
          className="absolute inset-0 cursor-zoom-in"
          whileHover={{ scale: 1.03, rotate: -1 }}
          whileFocus={{ scale: 1.03, rotate: -1 }}
          transition={pegas}
          onClick={() => setBuka(aktif)}
          aria-label={`Lihat ${LATEST[aktif].alt}`}
          {...sorot(0)}
        >
          <div className="absolute inset-0 rounded-[30px] bg-coal shadow-[0_24px_40px_-14px_rgba(0,0,0,0.5)]" />
          <div className="absolute overflow-hidden rounded-[30px]" style={box(16.78, 26.85, 594.483, 304.082)}>
            <Gambar index={aktif} />
            <div className="absolute inset-0 rounded-[30px] border-3 border-cream" />
          </div>
        </motion.button>
      </Reveal>
    </>
  );
}

function Panah({ arah }: { arah: 'kiri' | 'kanan' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-[60%]">
      <path d={arah === 'kiri' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  );
}

/** Panah dan titik penanda proyek. Titik aktif melebar; ukuran mengikuti artboard (desktop) atau layar (ponsel). */
function Kontrol({ aktif, setAktif, geser, kecil }: Latest & { kecil?: boolean }) {
  const tombol = `grid shrink-0 place-items-center rounded-full bg-flame text-coal-deep transition-transform hover:scale-110 ${kecil ? 'size-10' : 'size-[52px]'}`;
  return (
    <div className="flex items-center justify-center gap-4">
      <button type="button" className={tombol} onClick={() => geser(-1)} aria-label="Proyek sebelumnya">
        <Panah arah="kiri" />
      </button>
      <div className="flex items-center gap-2">
        {LATEST.map((item, index) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setAktif(index)}
            aria-label={`Tampilkan ${item.name}`}
            aria-current={index === aktif ? 'true' : undefined}
            className={`grid place-items-center ${kecil ? 'h-6 min-w-6' : 'h-8 min-w-8'}`}
          >
            <motion.span
              className="block h-3 rounded-full bg-cream"
              initial={false}
              animate={{ width: index === aktif ? 32 : 12, opacity: index === aktif ? 1 : 0.5 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          </button>
        ))}
      </div>
      <button type="button" className={tombol} onClick={() => geser(1)} aria-label="Proyek berikutnya">
        <Panah arah="kanan" />
      </button>
    </div>
  );
}

/** Nama dan deskripsi proyek aktif, berganti dengan memudar. */
function Teks({ aktif, judul, isi }: { aktif: number; judul: string; isi: string }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={aktif} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
        <h3 className={judul}>{LATEST[aktif].name}</h3>
        <p className={isi}>{LATEST[aktif].text}</p>
      </motion.div>
    </AnimatePresence>
  );
}

function Desktop(latest: Latest) {
  const { aktif } = latest;
  return (
    <Stage framed className="bg-cream">
      <div className="edge-r2 absolute inset-0">
        <Reveal x={100} className="absolute rounded-[30px] bg-coal" style={box(781, 251, 585, 694)} />
      </div>

      <h2 className={`absolute text-flame ${TITLE_TEXT}`} style={box(68, 57)}>
        <SplitWords text={TITLE} />
      </h2>

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

      {/* Judul proyek berdiri di atas kotak gelap (tidak menumpuk tepinya), deskripsi di dalam kotak, kontrol di bawahnya. */}
      <div className="edge-r2 absolute inset-0">
        <Reveal y={30} delay={0.35} className="absolute" style={box(768, 186, 607, 560)}>
          <Teks
            aktif={aktif}
            judul="text-outline-lg whitespace-nowrap text-center font-magic text-[46px] leading-[normal] tracking-[2px] text-flame"
            isi="ml-[49px] mt-[121px] w-[509px] text-justify font-body text-[30px] leading-[1.45] text-cream"
          />
        </Reveal>
        <Reveal y={20} delay={0.45} className="absolute" style={box(781, 856, 585)}>
          <Kontrol {...latest} />
        </Reveal>
      </div>

      <div className="edge-l2 absolute inset-0">
        <Collage {...latest} />
      </div>
    </Stage>
  );
}

function Mobile(latest: Latest) {
  const titleClass = 'font-magic text-[6.6vw] uppercase leading-tight tracking-wide';
  const lineClass = 'mt-2 h-1.5 sm:h-2.5';
  return (
    <div className="relative overflow-hidden bg-cream pb-10 lg:hidden">
      <Crop x={0} y={0} w={781} h={960}>
        <Triangle />
        <Collage {...latest} />
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
        <Reveal y={30} delay={0.1}>
          <Teks
            aktif={latest.aktif}
            judul="whitespace-nowrap text-center font-magic text-[6.8vw] leading-none tracking-wide text-flame"
            isi="mt-3 rounded-t-[30px] bg-coal px-5 pb-4 pt-8 text-justify font-body text-base leading-relaxed text-cream sm:px-8 sm:text-xl"
          />
          <div className="rounded-b-[30px] bg-coal px-5 pb-6 sm:px-8">
            <Kontrol {...latest} kecil />
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export default function LatestProjectSection() {
  const latest = useLatest();
  return (
    <section id={SECTION.latest}>
      <Desktop {...latest} />
      <Mobile {...latest} />
      <p aria-live="polite" className="sr-only">
        Proyek {latest.aktif + 1} dari {LATEST.length}: {LATEST[latest.aktif].name}
      </p>
      <Lightbox items={LATEST} index={latest.buka} onClose={latest.tutup} onMove={latest.geserLightbox} />
    </section>
  );
}
