import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';

/** Jendela isian bergaya desain: kartu krem di atas lapisan gelap. Tombol Esc dan klik luar menutup. */
export default function BrandModal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="max-h-full w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl sm:p-6"
            initial={{ y: 24, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 16, scale: 0.98 }}
          >
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-zinc-100 pb-3">
              <h2 className="font-magic text-lg font-bold text-zinc-900 sm:text-xl">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="grid size-8 place-items-center rounded-lg text-xl leading-none text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
              >
                ×
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
