import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';

export interface LightboxItem {
  src: string;
  alt: string;
  /** Judul di atas keterangan; tanpa judul, keterangan memakai teks alt. */
  title?: string;
  label?: string;
  description?: string;
}

function Panah({ arah }: { arah: 'kiri' | 'kanan' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-6">
      <path d={arah === 'kiri' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  );
}

const TOMBOL =
  'grid size-12 shrink-0 place-items-center rounded-full bg-flame text-coal-deep transition-transform hover:scale-110 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cream';

/**
 * Tampilan penuh gambar (landing page). Dirender ke body karena artboard diskalakan dengan transform.
 * Fokus pindah ke dialog saat dibuka, Tab berputar di dalam dialog, dan fokus kembali ke pemicu saat ditutup (WCAG 2.4.3).
 * Tombol keyboard: Esc menutup, panah kiri dan kanan berpindah gambar.
 */
export default function Lightbox({ items, index, onClose, onMove }: { items: LightboxItem[]; index: number | null; onClose: () => void; onMove: (step: number) => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  const tutup = useRef<HTMLButtonElement>(null);
  const terbuka = index !== null;

  useEffect(() => {
    if (!terbuka) return;
    const pemicu = document.activeElement as HTMLElement | null;
    tutup.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onMove(1);
      if (event.key === 'ArrowLeft') onMove(-1);
      if (event.key === 'Tab' && dialog.current) {
        const fokus = [...dialog.current.querySelectorAll<HTMLElement>('button')];
        const awal = fokus[0];
        const akhir = fokus[fokus.length - 1];
        if (event.shiftKey && document.activeElement === awal) {
          event.preventDefault();
          akhir.focus();
        } else if (!event.shiftKey && document.activeElement === akhir) {
          event.preventDefault();
          awal.focus();
        }
      }
    };
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('keydown', key);
      pemicu?.focus({ preventScroll: true });
    };
  }, [terbuka, onClose, onMove]);

  const item = terbuka ? items[index] : null;
  let keterangan: ReactNode = null;
  if (item) {
    keterangan = item.title ? (
      <figcaption className="mx-auto mt-3 max-w-2xl text-center text-cream">
        <span className="block font-magic text-2xl uppercase text-flame sm:text-3xl">{item.title}</span>
        {item.label && <span className="mt-1 block font-body text-sm uppercase tracking-wide text-cream/80">{item.label}</span>}
        {item.description && <span className="mt-2 block font-body text-sm leading-relaxed sm:text-base">{item.description}</span>}
        <span className="mt-1 block font-body text-sm text-cream/80">
          {index! + 1} dari {items.length}
        </span>
      </figcaption>
    ) : (
      <figcaption className="mt-2 text-center font-body text-base text-cream">
        {item.alt} ({index! + 1}/{items.length})
      </figcaption>
    );
  }

  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          ref={dialog}
          className="fixed inset-0 z-[100] flex items-center justify-center gap-3 bg-black/85 p-4 sm:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => event.target === event.currentTarget && onClose()}
          role="dialog"
          aria-modal="true"
          aria-label={item.title ?? item.alt}
        >
          {items.length > 1 && (
            <button type="button" onClick={() => onMove(-1)} aria-label="Gambar sebelumnya" className={TOMBOL}>
              <Panah arah="kiri" />
            </button>
          )}
          <motion.figure key={index} className="max-h-full min-w-0 max-w-5xl" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <img
              src={item.src}
              alt={item.alt}
              className={`mx-auto w-auto rounded-[20px] border-4 border-flame object-contain ${item.title ? 'max-h-[62dvh]' : 'max-h-[80dvh]'}`}
            />
            {keterangan}
          </motion.figure>
          {items.length > 1 && (
            <button type="button" onClick={() => onMove(1)} aria-label="Gambar berikutnya" className={TOMBOL}>
              <Panah arah="kanan" />
            </button>
          )}
          <button
            ref={tutup}
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="absolute right-4 top-4 grid size-12 place-items-center rounded-full font-magic text-4xl leading-none text-cream hover:text-flame focus-visible:outline-3 focus-visible:outline-cream"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
