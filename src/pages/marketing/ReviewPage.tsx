import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Pagination, { usePagination } from '../../components/brand/Pagination';
import { StarsView } from '../../components/brand/Stars';
import { EmptyState, LoadError, Loading, StaffPanel, pillButton } from '../../components/brand/StaffParts';
import { useData } from '../../hooks/useData';
import { listReviews } from '../../services/dashboardService';
import { tanggal } from '../../utils/format';

// Figma "Review Page Marketing" (wireframe 23:512): Rating, Judul dan deskripsi, tombol Detail.
export default function ReviewPage() {
  const { data, loading, error } = useData(listReviews);
  const { paged, page, totalPages, setPage } = usePagination(data ?? [], 6);
  const rata = data?.length ? data.reduce((n, review) => n + review.rating, 0) / data.length : 0;

  return (
    <StaffPanel
      title="Review"
      action={
        data?.length ? (
          <span className="flex items-center gap-2 font-moon text-lg text-cream">
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
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index, 8) * 0.04 }}
                className="flex flex-col gap-3 rounded-[24px] border-[3px] border-flame bg-cream px-4 py-2.5 sm:flex-row sm:items-center"
              >
                <div className="sm:w-40">
                  <StarsView value={review.rating} />
                  <p className="font-moon text-xs text-coal-deep/60">{tanggal(review.createdAt)}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="line-clamp-1 break-words font-magic text-[clamp(14px,1.9vh,18px)] uppercase leading-tight text-flame">{review.project.nama}</h2>
                  <p className="font-moon text-xs text-coal-deep/70">{review.client.namaInstansi}</p>
                  <p className="mt-0.5 line-clamp-1 font-moon text-sm text-coal-deep">{review.komentar ?? <span className="text-coal-deep/50">Tanpa komentar.</span>}</p>
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
