import { useEffect, useState } from 'react';

export interface PaginationState<T> {
  page: number;
  totalPages: number;
  totalItems: number;
  paged: T[];
  setPage: (page: number) => void;
  prev: () => void;
  next: () => void;
}

/** Memotong daftar menjadi per halaman agar muat dalam satu layar tanpa perlu digulir panjang. */
export function usePagination<T>(items: readonly T[], perPage: number, initialLastPage = false): PaginationState<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const [page, setPage] = useState(() => (initialLastPage ? totalPages : 1));
  const current = Math.min(Math.max(1, page), totalPages);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const start = (current - 1) * perPage;
  return {
    page: current,
    totalPages,
    totalItems: items.length,
    paged: items.slice(start, start + perPage),
    setPage,
    prev: () => setPage(Math.max(1, current - 1)),
    next: () => setPage(Math.min(totalPages, current + 1)),
  };
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** `dark` di atas panel gelap (StaffPanel/ProyekSaya), `light` di atas kartu krem/putih. */
  tone?: 'dark' | 'light';
  className?: string;
}

export default function Pagination({ page, totalPages, onPageChange, tone = 'dark', className = 'mt-auto pt-4' }: PaginationProps) {
  if (totalPages <= 1) return null;

  const isDark = tone === 'dark';
  const navBtn = isDark
    ? 'border-2 border-flame bg-coal text-flame hover:bg-flame hover:text-coal disabled:border-cream/20 disabled:bg-coal/50 disabled:text-cream/30'
    : 'border-2 border-coal bg-white text-coal-deep hover:border-flame hover:bg-flame hover:text-coal disabled:border-coal/15 disabled:bg-white/50 disabled:text-coal-deep/30';

  const numBtn = (active: boolean) =>
    active
      ? 'border-2 border-flame bg-flame text-coal font-bold'
      : isDark
        ? 'border-2 border-flame/50 bg-coal text-cream hover:border-flame hover:text-flame'
        : 'border-2 border-coal/20 bg-white text-coal-deep hover:border-flame hover:text-flame';

  return (
    <nav aria-label="Navigasi halaman" className={`flex flex-wrap items-center justify-center gap-2 font-moon text-sm ${className}`}>
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label="Halaman sebelumnya"
        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 transition-colors disabled:cursor-not-allowed ${navBtn}`}
      >
        <span aria-hidden="true" className="font-magic text-base leading-none">
          &lt;
        </span>
        <span>Sebelumnya</span>
      </button>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onPageChange(num)}
            aria-current={num === page ? 'page' : undefined}
            className={`min-w-8 rounded-xl px-2.5 py-1 text-center transition-colors ${numBtn(num === page)}`}
          >
            {num}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        aria-label="Halaman berikutnya"
        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 transition-colors disabled:cursor-not-allowed ${navBtn}`}
      >
        <span>Selanjutnya</span>
        <span aria-hidden="true" className="font-magic text-base leading-none">
          &gt;
        </span>
      </button>
    </nav>
  );
}
