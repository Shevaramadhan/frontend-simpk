import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Bar } from '../../components/brand/Progress';
import { EmptyState, LoadError, Loading, StaffPanel, StatusPill, pillButton } from '../../components/brand/StaffParts';
import { useData } from '../../hooks/useData';
import { listProjects } from '../../services/projectService';
import type { ProjectStatus } from '../../types';
import { PROJECT_STATUS_LABEL } from '../../utils/format';

// Figma "Project Page Marketing" (wireframe 23:476): Status, Judul dan deskripsi, tombol Detail.
const TONE: Record<ProjectStatus, string> = {
  PERSIAPAN: 'bg-[#bdbdbd] text-coal-deep',
  BERJALAN: 'bg-[#ffd27a] text-coal-deep',
  DITUNDA: 'bg-[#f19b9b] text-coal-deep',
  SELESAI: 'bg-[#8fd694] text-coal-deep',
  DIBATALKAN: 'bg-[#f19b9b] text-coal-deep',
};

export default function ProjekPage() {
  const { data, loading, error } = useData(listProjects);

  return (
    <StaffPanel title="Projek">
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <LoadError message={error} />
      ) : !data?.length ? (
        <EmptyState>Belum ada projek. Projek terbentuk setelah request diterima dan Operasional memilih tim.</EmptyState>
      ) : (
        <div className="space-y-3">
          {data.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index, 8) * 0.04 }}
              className="flex flex-col gap-3 rounded-[24px] border-[3px] border-flame bg-cream px-4 py-3 sm:flex-row sm:items-center"
            >
              <div className="sm:w-36">
                <StatusPill label={PROJECT_STATUS_LABEL[project.status]} className={TONE[project.status]} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="line-clamp-1 break-words font-magic text-[clamp(20px,3.2vh,32px)] uppercase leading-tight text-flame">{project.nama}</h2>
                <p className="line-clamp-1 font-moon text-sm text-coal-deep/80">{project.kebutuhan}</p>
                <div className="mt-1 flex max-w-sm items-center gap-3 font-moon text-sm text-coal-deep/70">
                  <span>{project.klien}</span>
                  <span className="w-10 text-flame">{project.progres}%</span>
                  <Bar value={project.progres} track="bg-coal/15" fill="bg-flame" />
                </div>
              </div>
              <Link to={`/app/proyek/${project.id}`} className={pillButton}>
                Detail
              </Link>
            </motion.article>
          ))}
        </div>
      )}
    </StaffPanel>
  );
}
