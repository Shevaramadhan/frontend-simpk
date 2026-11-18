import { useMemo } from 'react';
import Pagination, { usePagination } from '../../components/brand/Pagination';
import { EmptyState, LoadError, Loading, ProjectCard, StaffPanel } from '../../components/brand/StaffParts';
import { useData } from '../../hooks/useData';
import { listOrders } from '../../services/orderService';
import type { Order } from '../../types';

// Figma "Project Page Operational": pengajuan yang sudah disetujui Marketing menunggu tim dari Operasional.
function note(order: Order) {
  const project = order.projects[0];
  const members = project?._count?.members ?? 0;
  if (!members) return <span className="text-[#c62828]">Belum ada worker yang mengerjakan</span>;
  if (project.status === 'SELESAI') return <span className="text-[#0f7a00]">Project selesai · {members} worker</span>;
  return <span className="text-[#0f7a00]">{members} worker sedang mengerjakan</span>;
}

export default function ProjectOpsPage() {
  const { data, loading, error } = useData(listOrders);
  const orders = useMemo(
    () =>
      (data ?? [])
        .filter((order) => order.status === 'DISETUJUI' || order.status === 'MENJADI_PROYEK')
        // Yang belum punya tim tampil lebih dulu.
        .sort((a, b) => Number(Boolean(a.projects[0]?._count?.members)) - Number(Boolean(b.projects[0]?._count?.members))),
    [data],
  );
  const { paged, page, totalPages, setPage } = usePagination(orders, 6);

  return (
    <StaffPanel title="Project">
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <LoadError message={error} />
      ) : orders.length === 0 ? (
        <EmptyState>Belum ada pengajuan yang disetujui Marketing.</EmptyState>
      ) : (
        <>
          <div className="space-y-2.5">
            {paged.map((order, index) => (
              <ProjectCard
                key={order.id}
                index={index}
                title={order.judul || order.nomor}
                subtitle={`${order.client.namaInstansi} · ${order.nomor}`}
                note={note(order)}
                to={`/app/pengajuan/${order.id}`}
              />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </StaffPanel>
  );
}
