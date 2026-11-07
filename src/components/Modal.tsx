import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4">
      <div role="dialog" aria-modal="true" aria-label={title} className="max-h-full w-full max-w-lg overflow-y-auto rounded bg-white p-5">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="font-semibold">{title}</h2>
          <button type="button" onClick={onClose} className="text-sm underline">
            Tutup
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
