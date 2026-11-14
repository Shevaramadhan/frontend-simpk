import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../../hooks/useData';
import { getOrder, listClientUpdates } from '../../services/orderService';
import { ProgressPanel } from '../../components/brand/Progress';
import { tanggal } from '../../utils/format';
import ProyekInfo from '../../components/brand/ProyekInfo';

// Figma "Detail Page": total progres dan progres per bidang. Klien tidak pernah menerima catatan teknis.
function Updates({ projectId }: { projectId: number }) {
  const load = useCallback(() => listClientUpdates(projectId), [projectId]);
  const { data } = useData(load);
  if (!data?.length) return null;
  return (
    <div className="mt-8">
      <p className="text-center font-magic text-2xl uppercase text-flame">Catatan Perkembangan</p>
      <ul className="mt-3 space-y-2">
        {data.slice(0, 5).map((update) => (
          <li key={update.id} className="rounded-2xl border-[3px] border-coal/15 bg-white px-4 py-3">
            <p className="font-moon text-sm text-coal-deep/70">
              {tanggal(update.createdAt)} · {update.task.judul} · {update.persentase}%
            </p>
            <p className="mt-1 font-moon text-base text-coal-deep">{update.catatanKlien}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DetailPage() {
  const id = Number(useParams().id);
  const load = useCallback(() => getOrder(id), [id]);
  const { data: order, loading, error } = useData(load);

  if (loading) return <p className="p-10 text-center font-moon text-xl text-coal-deep">Memuat...</p>;
  if (error || !order) return <p role="alert" className="p-10 text-center font-moon text-xl text-[#9c2b2b]">{error || 'Project tidak ditemukan.'}</p>;
  const project = order.project;

  return (
    <ProyekInfo title="Detail" judul={order.judul || order.nomor} deskripsi={order.kebutuhan} estimasi={order.tenggatDiharapkan} anggaran={order.anggaran} documents={order.documents} backTo="/portal/proyek">
      {project ? (
        <>
          <ProgressPanel progres={project.progres} progresBidang={project.progresBidang} />
          <Updates projectId={project.id} />
        </>
      ) : (
        <p className="mt-3 text-center font-moon text-lg text-coal-deep">
          <span className="mb-2 block font-magic text-2xl uppercase text-flame sm:text-3xl">Total Progress</span>
          {order.status === 'DITOLAK' || order.status === 'DIBATALKAN'
            ? 'Pengajuan ini tidak dilanjutkan.'
            : 'Project belum mulai dikerjakan. Progres tampil di sini setelah Operasional membentuk tim.'}
        </p>
      )}
    </ProyekInfo>
  );
}
