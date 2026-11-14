import { EmptyState, LoadError, Loading, ProjectCard, StaffPanel } from '../../components/brand/StaffParts';
import { useData } from '../../hooks/useData';
import { listProjects } from '../../services/projectService';
import { PROJECT_STATUS_LABEL } from '../../utils/format';

// Daftar project yang diikuti anggota Tim, bergaya halaman Project Operasional.
export default function ProjectTimPage() {
  const { data, loading, error } = useData(listProjects);

  return (
    <StaffPanel title="Project Saya">
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <LoadError message={error} />
      ) : !data?.length ? (
        <EmptyState>Anda belum ditunjuk ke project mana pun. Operasional akan menambahkan Anda ke tim project.</EmptyState>
      ) : (
        <div className="space-y-4">
          {data.map((project, index) => (
            <ProjectCard
              key={project.id}
              index={index}
              title={project.nama}
              subtitle={`${project.klien} · ${project.kode}${project.isPm ? ' · Anda PM' : ''}`}
              note={
                <span className={project.progres === 100 ? 'text-[#14aa00]' : 'text-coal-deep'}>
                  {PROJECT_STATUS_LABEL[project.status]} · Progres {project.progres}%
                </span>
              }
              to={`/app/proyek/${project.id}`}
            />
          ))}
        </div>
      )}
    </StaffPanel>
  );
}
