import { useCallback, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { BrandError, brandInputSolid } from '../../components/brand/Brand';
import OrderComments from '../../components/brand/OrderComments';
import Pagination, { usePagination } from '../../components/brand/Pagination';
import { ProgressPanel } from '../../components/brand/Progress';
import ProyekInfo from '../../components/brand/ProyekInfo';
import { pillButton } from '../../components/brand/StaffParts';
import { StarsInput, StarsView } from '../../components/brand/Stars';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { createReview } from '../../services/dashboardService';
import { getOrder, listClientUpdates } from '../../services/orderService';
import type { ProjectReview } from '../../types';
import { tanggal } from '../../utils/format';

function Updates({ projectId }: { projectId: number }) {
  const load = useCallback(() => listClientUpdates(projectId), [projectId]);
  const { data } = useData(load);
  const { paged, page, totalPages, setPage } = usePagination(data ?? [], 3);
  if (!data?.length) return null;
  return (
    <div className="mt-6 border-t border-zinc-100 pt-5">
      <p className="font-magic text-base font-bold text-zinc-900 sm:text-lg">Catatan Perkembangan</p>
      <ul className="mt-3 space-y-2">
        {paged.map((update) => (
          <li key={update.id} className="rounded-xl border border-zinc-200 bg-zinc-50/60 px-4 py-3">
            <p className="font-moon text-xs text-zinc-500">
              {tanggal(update.createdAt)} · <span className="font-medium text-zinc-700">{update.task.judul}</span> · <span className="font-semibold text-flame">{update.persentase}%</span>
            </p>
            <p className="mt-1 font-moon text-sm text-zinc-800">{update.catatanKlien}</p>
          </li>
        ))}
      </ul>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} tone="light" className="mt-3" />
    </div>
  );
}

function Ulasan({ projectId, review, onSaved }: { projectId: number; review: ProjectReview | null; onSaved: () => void }) {
  const [rating, setRating] = useState(0);
  const [komentar, setKomentar] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (review) {
    return (
      <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 text-center">
        <p className="font-magic text-base font-bold text-zinc-900 sm:text-lg">Ulasan Anda</p>
        <div className="mt-2">
          <StarsView value={review.rating} size="size-7" />
        </div>
        {review.komentar && <p className="mt-2 whitespace-pre-wrap font-moon text-sm text-zinc-700">{review.komentar}</p>}
        <p className="mt-1.5 font-moon text-xs text-zinc-500">Terima kasih telah memakai jasa Neo Telemetri.</p>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rating) return setError('Pilih jumlah bintang terlebih dahulu.');
    setError('');
    setSaving(true);
    try {
      await createReview(projectId, { rating, komentar });
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50/70 p-5 text-center">
      <p className="font-magic text-base font-bold text-zinc-900 sm:text-lg">Beri Ulasan</p>
      <p className="mt-0.5 font-moon text-xs text-zinc-600 sm:text-sm">Project sudah selesai. Bagaimana hasil kerja tim Neo Telemetri?</p>
      <div className="mt-2">
        <StarsInput value={rating} onChange={setRating} />
      </div>
      <label htmlFor="komentar" className="sr-only">
        Komentar
      </label>
      <textarea
        id="komentar"
        maxLength={2000}
        rows={3}
        placeholder="Ceritakan pengalaman Anda (opsional)"
        value={komentar}
        onChange={(event) => setKomentar(event.target.value)}
        className={`${brandInputSolid} mx-auto mt-3 max-w-2xl resize-y text-left`}
      />
      <BrandError message={error} />
      <button type="submit" disabled={saving} className={`mt-3 ${pillButton}`}>
        {saving ? 'Mengirim...' : 'Kirim Ulasan'}
      </button>
    </form>
  );
}

export default function DetailPage() {
  const id = Number(useParams().id);
  const load = useCallback(() => getOrder(id), [id]);
  const { data: order, loading, error, reload } = useData(load);

  if (loading) return <p className="p-10 text-center font-moon text-sm text-zinc-500">Memuat...</p>;
  if (error || !order) return <p role="alert" className="p-10 text-center font-moon text-sm text-red-600">{error || 'Project tidak ditemukan.'}</p>;
  const project = order.project;

  return (
    <ProyekInfo
      title="Detail Project"
      judul={order.judul || order.nomor}
      deskripsi={order.kebutuhan}
      estimasi={order.tenggatDiharapkan}
      anggaran={order.anggaran}
      documents={order.documents}
      kelolaDokumen={{ orderId: order.id, bisaTambah: order.status === 'BARU' || order.status === 'DITINJAU', onChange: () => void reload() }}
      backTo="/portal/proyek"
    >
      {project ? (
        <>
          <ProgressPanel progres={project.progres} progresBidang={project.progresBidang} />
          {project.status === 'SELESAI' && <Ulasan projectId={project.id} review={project.review} onSaved={() => void reload()} />}
          <Updates projectId={project.id} />
        </>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-5 text-center">
          <p className="font-magic text-base font-bold text-zinc-900">Progres Pengerjaan</p>
          <p className="mt-1 font-moon text-sm text-zinc-600">
            {order.status === 'DITOLAK' || order.status === 'DIBATALKAN'
              ? 'Pengajuan ini tidak dilanjutkan.'
              : 'Project belum mulai dikerjakan. Progres tampil di sini setelah Operasional membentuk tim.'}
          </p>
        </div>
      )}
      <OrderComments
        orderId={order.id}
        canSend={order.status !== 'DITOLAK' && order.status !== 'DIBATALKAN' && project?.status !== 'DIBATALKAN'}
      />
    </ProyekInfo>
  );
}
