import { useCallback, useLayoutEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
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

// Garis tepi bayangan hero (koordinat artboard hero, garis 45 derajat x + y = K), diukur dari piksel di beberapa ukuran layar.
const TEPI_BAYANGAN_HERO = { kiri: 718, kanan: 1660 };
const ARTBOARD_W = 1440;

/**
 * Bayangan hero diteruskan ke Latest Project sebagai satu pita 45 derajat yang menyambung mulus (masukan PM: sambungan
 * kurang rapi). Hero diskalakan menurut tinggi layar dan Latest Project menurut lebar, jadi posisi pita dihitung dari
 * posisi kedua artboard di layar. Hasil: K kiri dan kanan dalam koordinat artboard Latest Project.
 */
function usePitaBayangan() {
  const [pita, setPita] = useState({ kiri: -2000, kanan: 644 });
  useLayoutEffect(() => {
    let frame = 0;
    const hitung = () => {
      cancelAnimationFrame(frame);
      // Tunggu Stage selesai menghitung skala barunya.
      frame = requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const hero = document.querySelector('#home [data-artboard]')?.getBoundingClientRect();
          const latest = document.querySelector('#latest-project [data-artboard]')?.getBoundingClientRect();
          if (!hero?.width || !latest?.width) return;
          const skalaHero = hero.width / ARTBOARD_W;
          const skalaLatest = latest.width / ARTBOARD_W;
          const ke = (k: number) => (hero.left + hero.top + skalaHero * k - (latest.left + latest.top)) / skalaLatest;
          setPita({ kiri: ke(TEPI_BAYANGAN_HERO.kiri), kanan: ke(TEPI_BAYANGAN_HERO.kanan) });
        }),
      );
    };
    hitung();
    const observer = new ResizeObserver(hitung);
    observer.observe(document.documentElement);
    document.querySelectorAll('#home, #latest-project').forEach((el) => observer.observe(el));
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);
  return pita;
}

/** Bidang pita (x + y antara kiri dan kanan) di artboard Latest Project, memanjang ke tepi kiri layar. */
function PitaClip({ kiri, kanan, children, className = '' }: { kiri: number; kanan: number; children?: ReactNode; className?: string }) {
  const L = 1000; // pita boleh melewati tepi kiri artboard (ruang kosong di layar lebar)
  const T = 4; // dimulai sedikit di atas artboard agar menutup baris tepi bingkai Stage (tanpa garis terang di sambungan)
  const H = 1100;
  const clipPath = `polygon(${kiri + L + T}px 0, ${kanan + L + T}px 0, ${kanan + L + T - H}px ${H}px, ${kiri + L + T - H}px ${H}px)`;
  return (
    <div aria-hidden={children ? true : undefined} className={`pointer-events-none absolute ${className}`} style={{ left: -L, top: -T, width: ARTBOARD_W + 2 * L, height: H, clipPath }}>
      {children && <div className="absolute" style={{ left: L, top: T, width: ARTBOARD_W, height: H - T }}>{children}</div>}
    </div>
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

// Posisi tiga slot kolase di artboard. Kartu belakang 88% kartu depan dengan rasio sama (masukan PM: ukuran lebih seragam).
// Slot 0 depan (proyek aktif), slot 1 belakang kiri atas, slot 2 belakang kanan bawah.
const SLOT = [
  { left: 54, top: 403, width: 628, height: 358, zIndex: 3 },
  { left: 4, top: 292, width: 553, height: 315, zIndex: 2 },
  { left: 196, top: 560, width: 553, height: 315, zIndex: 1 },
];

/**
 * Tumpukan tiga kartu proyek. Tiap kartu terikat pada proyeknya: saat proyek berganti, kartu meluncur dan
 * berubah ukuran ke slot barunya. Kartu depan (klik: tampilan penuh), kartu belakang (klik: dimajukan, diredupkan
 * sedikit). Kartu belakang yang diarahkan kursor naik ke depan agar terlihat utuh.
 */
function Collage({ aktif, setAktif, setBuka }: Latest) {
  const [sorotan, setSorotan] = useState<number | null>(null);
  const kurangiGerak = useReducedMotion();
  const pindah = kurangiGerak ? { duration: 0 } : ({ type: 'spring', stiffness: 170, damping: 24 } as const);

  return (
    <Reveal scale={0.9} delay={0.15} className="absolute inset-0">
      {/* Bayangan lembut di bawah tumpukan (sebelumnya elips hitam padat). */}
      <div
        className="pointer-events-none absolute rounded-[50%] bg-[radial-gradient(closest-side,rgba(20,20,20,0.55),rgba(20,20,20,0.25)_55%,transparent)] blur-[10px]"
        style={box(40, 790, 720, 160)}
      />
      {LATEST.map((item, index) => {
        const slot = (index - aktif + LATEST.length) % LATEST.length;
        const depan = slot === 0;
        const posisi = SLOT[slot];
        return (
          <motion.button
            key={item.name}
            type="button"
            className={`absolute rounded-[30px] bg-coal ${depan ? 'cursor-zoom-in shadow-[0_26px_44px_-14px_rgba(0,0,0,0.55)]' : 'cursor-pointer shadow-[0_18px_30px_-12px_rgba(0,0,0,0.45)]'}`}
            style={{ zIndex: sorotan === index ? 20 : posisi.zIndex }}
            initial={false}
            animate={{ left: posisi.left, top: posisi.top, width: posisi.width, height: posisi.height }}
            transition={pindah}
            whileHover={{ scale: depan ? 1.03 : 1.05, rotate: -1 }}
            whileFocus={{ scale: depan ? 1.03 : 1.05, rotate: -1 }}
            onMouseEnter={() => setSorotan(index)}
            onMouseLeave={() => setSorotan((s) => (s === index ? null : s))}
            onFocus={() => setSorotan(index)}
            onBlur={() => setSorotan((s) => (s === index ? null : s))}
            onClick={() => (depan ? setBuka(index) : setAktif(index))}
            aria-label={depan ? `Lihat ${item.alt}` : `Tampilkan ${item.name}`}
          >
            {/* Bingkai sama untuk ketiga kartu: tepi gelap dan garis krem, seperti kartu utama Figma. */}
            <span className="absolute inset-x-[2.7%] inset-y-[7.5%] overflow-hidden rounded-[26px]">
              <img alt={item.alt} className={FILL} src={item.src} />
              <span className="absolute inset-0 rounded-[26px] border-3 border-cream" />
              <motion.span
                className="absolute inset-0 bg-coal-deep"
                initial={false}
                animate={{ opacity: depan || sorotan === index ? 0 : 0.28 }}
                transition={{ duration: 0.3 }}
              />
            </span>
          </motion.button>
        );
      })}
    </Reveal>
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
  const pita = usePitaBayangan();
  return (
    <Stage framed className="bg-cream">
      <div className="edge-r2 absolute inset-0">
        <Reveal x={100} className="absolute rounded-[30px] bg-coal" style={box(781, 251, 585, 694)} />
      </div>

      <h2 className={`absolute text-flame ${TITLE_TEXT}`} style={box(68, 57)}>
        <SplitWords text={TITLE} />
      </h2>

      {/* Warna sama dengan bayangan hero (coal-deep) agar sambungan tidak terlihat. */}
      <PitaClip {...pita} className="bg-coal-deep" />

      <div className="absolute h-0" style={box(68, 162, 1298)}>
        <DrawLine className="absolute inset-[-10px_0_0_0]">
          <span className="block size-full bg-coal" />
        </DrawLine>
      </div>

      <PitaClip {...pita}>
        <p className={`absolute text-cream ${TITLE_TEXT}`} style={box(68, 57)}>
          <SplitWords text={TITLE} />
        </p>
        <div className="absolute h-0" style={box(68, 162, 1298)}>
          <DrawLine className="absolute inset-[-10px_0_0_0]">
            <span className="block size-full bg-cream" />
          </DrawLine>
        </div>
      </PitaClip>

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
