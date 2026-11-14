import { useCallback, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { BrandError, brandInputSolid } from '../../components/brand/Brand';
import { StarsInput, StarsView } from '../../components/brand/Stars';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { createReview } from '../../services/dashboardService';
import { getOrder, listClientUpdates } from '../../services/orderService';
import type { ProjectReview } from '../../types';
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

// Ulasan klien setelah project Selesai (Figma "Review Page Marketing" menampilkan hasilnya ke Marketing).
function Ulasan({ projectId, review, onSaved }: { projectId: number; review: ProjectReview | null; onSaved: () => void }) {
  const [rating, setRating] = useState(0);
  const [komentar, setKomentar] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (review) {
    return (
      <div className="mt-8 rounded-[22px] bg-white p-5 text-center">
        <p className="font-magic text-2xl uppercase text-flame">Ulasan Anda</p>
        <div className="mt-2">
          <StarsView value={review.rating} size="size-8" />
        </div>
        {review.komentar && <p className="mt-2 whitespace-pre-wrap font-moon text-base text-coal-deep">{review.komentar}</p>}
        <p className="mt-2 font-moon text-sm text-coal-deep/60">Terima kasih telah memakai jasa Neo Telemetri.</p>
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
    <form onSubmit={handleSubmit} className="mt-8 rounded-[22px] bg-white p-5 text-center">
      <p className="font-magic text-2xl uppercase text-flame">Beri Ulasan</p>
      <p className="font-moon text-base text-coal-deep">Project sudah selesai. Bagaimana hasil kerja tim Neo Telemetri?</p>
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
      <button type="submit" disabled={saving} className="mt-3 rounded-2xl bg-coal px-8 py-2.5 font-magic text-lg uppercase text-flame hover:text-cream disabled:opacity-60">
        {saving ? 'Mengirim...' : 'Kirim Ulasan'}
      </button>
    </form>
  );
}

export default function DetailPage() {
  const id = Number(useParams().id);
  const load = useCallback(() => getOrder(id), [id]);
  const { data: order, loading, error, reload } = useData(load);

  if (loading) return <p className="p-10 text-center font-moon text-xl text-coal-deep">Memuat...</p>;
  if (error || !order) return <p role="alert" className="p-10 text-center font-moon text-xl text-[#9c2b2b]">{error || 'Project tidak ditemukan.'}</p>;
  const project = order.project;

  return (
    <ProyekInfo title="Detail" judul={order.judul || order.nomor} deskripsi={order.kebutuhan} estimasi={order.tenggatDiharapkan} anggaran={order.anggaran} documents={order.documents} backTo="/portal/proyek">
      {project ? (
        <>
          <ProgressPanel progres={project.progres} progresBidang={project.progresBidang} />
          {project.status === 'SELESAI' && <Ulasan projectId={project.id} review={project.review} onSaved={() => void reload()} />}
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
