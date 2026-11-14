import { useMemo } from 'react';
import { EmptyState, LoadError, Loading, ProjectCard, StaffPanel } from '../../components/brand/StaffParts';
import { useData } from '../../hooks/useData';
import { listOrders } from '../../services/orderService';
import type { Order } from '../../types';

// Figma "Project Page Operational": pengajuan yang sudah disetujui Marketing menunggu tim dari Operasional.
function note(order: Order) {
  const project = order.projects[0];
  const members = project?._count?.members ?? 0;
  if (!members) return <span className="text-[#e60000]">Belum ada worker yang mengerjakan</span>;
  if (project.status === 'SELESAI') return <span className="text-[#14aa00]">Project selesai · {members} worker</span>;
  return <span className="text-[#14aa00]">{members} worker sedang mengerjakan</span>;
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

  return (
    <StaffPanel title="Project">
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <LoadError message={error} />
      ) : orders.length === 0 ? (
        <EmptyState>Belum ada pengajuan yang disetujui Marketing.</EmptyState>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
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
      )}
    </StaffPanel>
  );
}
