import { useEffect, type PointerEvent, type ReactNode } from 'react';
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

/** Gerakan mengambang pelan dan berulang untuk ornamen. */
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
  children,
}: {
  depth?: number;
  tilt?: number;
  enterRotate?: number;
  delay?: number;
  float?: { amplitude?: number; rotate?: number; duration?: number; delay?: number };
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 14 });
  const sy = useSpring(py, { stiffness: 60, damping: 14 });
  const x = useTransform(sx, (v) => v * depth);
  const y = useTransform(sy, (v) => v * depth);
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

  return <motion.div onPointerMove={handleMove} onPointerLeave={handleLeave} {...props} style={{ ...props.style, x: springX, y: springY }} />;
}
