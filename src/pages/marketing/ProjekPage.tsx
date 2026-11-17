import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Pagination, { usePagination } from '../../components/brand/Pagination';
import { Bar } from '../../components/brand/Progress';
import { EmptyState, LoadError, Loading, StaffPanel, StatusPill, pillButton } from '../../components/brand/StaffParts';
import { useData } from '../../hooks/useData';
import { listProjects } from '../../services/projectService';
import type { ProjectStatus } from '../../types';
import { PROJECT_STATUS_LABEL } from '../../utils/format';

const TONE: Record<ProjectStatus, string> = {
  PERSIAPAN: 'border border-zinc-200 bg-zinc-100 text-zinc-700',
  BERJALAN: 'border border-amber-200 bg-amber-50 text-amber-800',
  DITUNDA: 'border border-red-200 bg-red-50 text-red-700',
  SELESAI: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
  DIBATALKAN: 'border border-red-200 bg-red-50 text-red-700',
};

export default function ProjekPage() {
  const { data, loading, error } = useData(listProjects);
  const { paged, page, totalPages, setPage } = usePagination(data ?? [], 6);

  return (
    <StaffPanel title="Projek">
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <LoadError message={error} />
      ) : !data?.length ? (
        <EmptyState>Belum ada projek. Projek terbentuk setelah request diterima dan Operasional memilih tim.</EmptyState>
      ) : (
        <>
          <div className="space-y-2.5">
            {paged.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index, 8) * 0.03 }}
                className="flex flex-col gap-3 rounded-xl border border-zinc-200/90 bg-zinc-50/50 px-4 py-3 transition-all hover:border-flame/40 hover:bg-white hover:shadow-sm sm:flex-row sm:items-center"
              >
                <div className="sm:w-32">
                  <StatusPill label={PROJECT_STATUS_LABEL[project.status]} className={TONE[project.status]} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="line-clamp-1 break-words font-magic text-[clamp(14px,1.9vh,17px)] font-semibold leading-snug text-zinc-900">{project.nama}</h2>
                  <p className="line-clamp-1 font-moon text-xs text-zinc-500">{project.kebutuhan}</p>
                  <div className="mt-1.5 flex max-w-sm items-center gap-3 font-moon text-xs text-zinc-600">
                    <span className="truncate font-medium">{project.klien}</span>
                    <span className="w-10 font-semibold text-flame">{project.progres}%</span>
                    <Bar value={project.progres} track="bg-zinc-200/80" fill={project.progres === 100 ? 'bg-emerald-500' : 'bg-flame'} />
                  </div>
                </div>
                <Link to={`/app/proyek/${project.id}`} className={pillButton}>
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
