import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Pagination, { usePagination } from '../../components/brand/Pagination';
import { StarsView } from '../../components/brand/Stars';
import { EmptyState, LoadError, Loading, StaffPanel, pillButton } from '../../components/brand/StaffParts';
import { useData } from '../../hooks/useData';
import { listReviews } from '../../services/dashboardService';
import { tanggal } from '../../utils/format';

export default function ReviewPage() {
  const { data, loading, error } = useData(listReviews);
  const { paged, page, totalPages, setPage } = usePagination(data ?? [], 6);
  const rata = data?.length ? data.reduce((n, review) => n + review.rating, 0) / data.length : 0;

  return (
    <StaffPanel
      title="Review"
      action={
        data?.length ? (
          <span className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 font-moon text-xs font-medium text-zinc-700 sm:text-sm">
            <StarsView value={Math.round(rata)} /> Rata-rata {rata.toLocaleString('id-ID', { maximumFractionDigits: 1 })} dari 5 · {data.length} ulasan
          </span>
        ) : undefined
      }
    >
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <LoadError message={error} />
      ) : !data?.length ? (
        <EmptyState>Belum ada ulasan. Klien dapat memberi ulasan setelah Operasional menandai projeknya Selesai.</EmptyState>
      ) : (
        <>
          <div className="space-y-2.5">
            {paged.map((review, index) => (
              <motion.article
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index, 8) * 0.03 }}
                className="flex flex-col gap-3 rounded-xl border border-zinc-200/90 bg-zinc-50/50 px-4 py-3 transition-all hover:border-flame/40 hover:bg-white hover:shadow-sm sm:flex-row sm:items-center"
              >
                <div className="sm:w-36">
                  <StarsView value={review.rating} />
                  <p className="mt-0.5 font-moon text-xs text-zinc-400">{tanggal(review.createdAt)}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="line-clamp-1 break-words font-magic text-[clamp(14px,1.9vh,17px)] font-semibold leading-snug text-zinc-900">{review.project.nama}</h2>
                  <p className="font-moon text-xs text-zinc-500">{review.client.namaInstansi}</p>
                  <p className="mt-0.5 line-clamp-1 font-moon text-sm text-zinc-700">{review.komentar ?? <span className="text-zinc-400">Tanpa komentar.</span>}</p>
                </div>
                <Link to={`/app/proyek/${review.project.id}`} className={pillButton}>
                  Detail
                </Link>
              </motion.article>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </StaffPanel>
  );
}
