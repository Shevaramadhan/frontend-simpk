import { useEffect, useState, type PointerEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type HTMLMotionProps } from 'motion/react';

// Animasi landing page. Semua berakhir tepat di posisi desain, jadi tata letak tidak berubah.
const EASE = [0.22, 1, 0.36, 1] as const;
const IN_VIEW = { once: true, amount: 0.25 } as const;

interface RevealProps extends HTMLMotionProps<'div'> {
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
  delay?: number;
  duration?: number;
  /** Langsung berjalan saat halaman dibuka, tanpa menunggu elemen terlihat. */
  immediate?: boolean;
}

/** Elemen muncul sambil bergeser ke posisi desainnya. */
export function Reveal({ x = 0, y = 0, scale = 1, rotate = 0, delay = 0, duration = 0.8, immediate = false, ...props }: RevealProps) {
  const hidden = { opacity: 0, x, y, scale, rotate };
  const shown = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 };
  const transition = { duration, delay, ease: EASE };
  if (immediate) return <motion.div initial={hidden} animate={shown} transition={transition} {...props} />;
  return <motion.div initial={hidden} whileInView={shown} viewport={IN_VIEW} transition={transition} {...props} />;
}

/** Garis yang memanjang dari kiri. */
export function DrawLine({ delay = 0, style, ...props }: HTMLMotionProps<'div'> & { delay?: number }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={IN_VIEW}
      transition={{ duration: 0.9, delay, ease: EASE }}
      style={{ ...style, transformOrigin: 'left center' }}
      {...props}
    />
  );
}

/** Judul yang muncul kata demi kata. Jarak antarkata tetap spasi biasa agar lebar teks sama dengan desain. */
export function SplitWords({ text, delay = 0, stagger = 0.09, immediate = false }: { text: string; delay?: number; stagger?: number; immediate?: boolean }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, index) => {
        const hidden = { opacity: 0, y: 28, filter: 'blur(10px)' };
        const shown = { opacity: 1, y: 0, filter: 'blur(0px)' };
        const transition = { duration: 0.7, delay: delay + index * stagger, ease: EASE };
        return (
          // Kata bisa berulang dan urutannya tetap, jadi indeks aman sebagai key.
          <span key={index}>
            {immediate ? (
              <motion.span className="inline-block" initial={hidden} animate={shown} transition={transition}>
                {word}
              </motion.span>
            ) : (
              <motion.span className="inline-block" initial={hidden} whileInView={shown} viewport={IN_VIEW} transition={transition}>
                {word}
              </motion.span>
            )}
            {index < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </>
  );
}

/** Gerakan mengambang pelan dan berulang untuk ornamen. Amplitudo negatif membuat ornamen mengambang ke bawah. */
export function Float({ amplitude = 10, rotate = 2, duration = 6, delay = 0, children }: { amplitude?: number; rotate?: number; duration?: number; delay?: number; children: ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;
  return (
    <motion.div
      animate={{ y: [0, -amplitude, 0], rotate: [0, rotate, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Ornamen hero: masuk berputar dari blur lalu memantul, bergeser dan miring 3D mengikuti kursor di seluruh layar
 * (parallax, `depth` = jarak geser), bergoyang elastis saat diarahkan, dan tetap mengambang saat diam.
 * Seluruh efek mati bila pengguna memilih kurangi gerakan.
 */
export function Ornament({
  depth = 24,
  tilt = 14,
  enterRotate = -90,
  delay = 0,
  float = {},
  naikMaks = Infinity,
  children,
}: {
  depth?: number;
  tilt?: number;
  enterRotate?: number;
  delay?: number;
  float?: { amplitude?: number; rotate?: number; duration?: number; delay?: number };
  /** Batas geser parallax ke atas (px). Dipakai ornamen yang menempel di tepi atas hero agar tidak terpotong. */
  naikMaks?: number;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 14 });
  const sy = useSpring(py, { stiffness: 60, damping: 14 });
  const x = useTransform(sx, (v) => v * depth);
  const y = useTransform(sy, (v) => Math.max(v * depth, -naikMaks));
  const rotateY = useTransform(sx, (v) => v * tilt);
  const rotateX = useTransform(sy, (v) => -v * tilt);

  useEffect(() => {
    if (reduced) return;
    // Posisi kursor dinormalkan ke -1..1 terhadap tengah layar.
    const move = (event: globalThis.PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      px.set((event.clientX / window.innerWidth - 0.5) * 2);
      py.set((event.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, [reduced, px, py]);

  if (reduced) return <>{children}</>;
  return (
    <motion.div
      className="pointer-events-auto"
      style={{ x, y, rotateX, rotateY, transformPerspective: 900 }}
      initial={{ opacity: 0, scale: 0.2, rotate: enterRotate, filter: 'blur(16px)' }}
      animate={{ opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }}
      transition={{
        type: 'spring',
        stiffness: 110,
        damping: 11,
        delay,
        opacity: { duration: 0.5, delay },
        filter: { duration: 0.8, delay },
      }}
      whileHover={{ scale: 1.12, rotate: [0, -9, 7, -4, 2, 0], transition: { duration: 0.7, ease: 'easeOut' } }}
    >
      <Float {...float}>{children}</Float>
    </motion.div>
  );
}

// Lingkar bingkai: hanya area padding (tebal garis) yang terlihat, bagian dalam dilubangi.
const RING_MASK = {
  maskImage: 'linear-gradient(#000 0 0), linear-gradient(#000 0 0)',
  WebkitMaskImage: 'linear-gradient(#000 0 0), linear-gradient(#000 0 0)',
  maskClip: 'content-box, border-box',
  WebkitMaskClip: 'content-box, border-box',
  maskComposite: 'exclude',
  WebkitMaskComposite: 'xor',
} as const;

/**
 * Kilatan oranye yang berjalan mengelilingi bingkai kartu, muncul saat induknya berada pada varian "hover"
 * (pasang `whileHover="hover"` pada kartu). Kartu harus `relative`/`absolute` dan membulat; `radius` mengikuti sudutnya.
 * Bila pengguna memilih kurangi gerakan, diganti bingkai oranye diam.
 */
export function BorderBeam({ radius = 20, width = 5, size = 220, duration = 4.5 }: { radius?: number; width?: number; size?: number; duration?: number }) {
  const reduced = useReducedMotion();
  const ring = { ...RING_MASK, padding: width, borderRadius: radius };
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={ring}
      initial={false}
      variants={{ hover: { opacity: 1 } }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {reduced ? (
        <div className="absolute inset-0 bg-flame" />
      ) : (
        <div
          className="absolute left-0 top-0 bg-gradient-to-l from-cream via-flame to-transparent"
          // Bergerak di sepanjang tepi kotak membulat; arah gradasi ikut berputar sehingga ekornya selalu di belakang.
          // Animasi CSS (keyframes simpk-beam di index.css) karena offset-distance lewat motion tidak berulang.
          style={{
            width: size,
            height: width * 6,
            offsetPath: `rect(0 auto auto 0 round ${radius}px)`,
            offsetAnchor: 'center',
            animation: `simpk-beam ${duration}s linear infinite`,
          }}
        />
      )}
    </motion.div>
  );
}

/** Status aktif tombol: kursor di atasnya atau tombol sedang difokus keyboard. Sebarkan `handlers` ke elemen tombol. */
export function useHoverFocus() {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  return {
    active: hovered || focused,
    handlers: {
      onPointerEnter: () => setHovered(true),
      onPointerLeave: () => setHovered(false),
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
    },
  };
}

const ROLL = { duration: 0.3, ease: [0.338, 0.015, 0.395, 0.959] as const };

/**
 * Teks tombol yang bergulir: salinan lama turun keluar, salinan baru masuk dari atas.
 * Satu guliran selalu selesai dulu sebelum arah berikutnya dijalankan, agar tidak tersendat saat kursor keluar-masuk cepat.
 */
export function RollingText({ text, active }: { text: string; active: boolean }) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(false);
  const [busy, setBusy] = useState(false);
  // Status tampil mengejar status aktif hanya ketika tidak sedang bergulir.
  if (!reduced && !busy && shown !== active) {
    setShown(active);
    setBusy(true);
  }
  if (reduced) return <>{text}</>;
  const copy = 'block whitespace-nowrap py-[0.15em]';
  return (
    // Padding vertikal memberi ruang huruf yang melewati tinggi baris; margin negatif menjaga ukuran tombol tetap.
    <span className="relative -my-[0.15em] inline-block overflow-hidden align-top">
      <motion.span className={copy} initial={false} animate={{ y: shown ? '100%' : '0%' }} transition={ROLL} onAnimationComplete={() => setBusy(false)}>
        {text}
      </motion.span>
      <motion.span aria-hidden="true" className={`${copy} absolute inset-0 select-none`} initial={false} animate={{ y: shown ? '0%' : '-100%' }} transition={ROLL}>
        {text}
      </motion.span>
    </span>
  );
}

/** Elemen sedikit mengikuti kursor, lalu kembali ke posisi desain saat kursor pergi. */
export function Magnet({ strength = 0.18, ...props }: HTMLMotionProps<'div'> & { strength?: number }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 16 });
  const springY = useSpring(y, { stiffness: 220, damping: 16 });

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  // tabIndex -1: whileTap membuat motion memberi tabindex 0 pada div ini, sehingga tombol di dalamnya
  // terkena Tab dua kali. Fokus keyboard cukup pada tautan di dalamnya.
  return <motion.div tabIndex={-1} onPointerMove={handleMove} onPointerLeave={handleLeave} {...props} style={{ ...props.style, x: springX, y: springY }} />;
}
