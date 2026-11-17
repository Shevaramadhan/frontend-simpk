import { useCallback, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BrandError, BrandField, brandInputSolid } from '../../components/brand/Brand';
import BrandModal from '../../components/brand/BrandModal';
import OrderComments from '../../components/brand/OrderComments';
import ProyekInfo from '../../components/brand/ProyekInfo';
import { StatusPill, pillButton } from '../../components/brand/StaffParts';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { approveOrder, getOrder, updateOrderStatus } from '../../services/orderService';
import { MARKETING_ORDER_STATUS, rupiahPendek } from '../../utils/format';

// Tombol aksi tinjau Request Marketing: Tolak / Diskusi Lebih Lanjut / Terima.
const bigButton = 'flex items-center justify-center rounded-xl px-4 py-3 text-center font-moon text-sm font-semibold shadow-xs transition-all hover:-translate-y-0.5 disabled:opacity-50 sm:text-base';

export default function RequestDetailPage() {
  const id = Number(useParams().id);
  const load = useCallback(() => getOrder(id), [id]);
  const { data: order, loading, error, reload } = useData(load);
  const [modal, setModal] = useState<'TOLAK' | 'TERIMA' | null>(null);
  const [alasan, setAlasan] = useState('');
  const [nilai, setNilai] = useState('');
  const [actionError, setActionError] = useState('');
  const [saving, setSaving] = useState(false);

  if (loading && !order) return <p className="p-10 text-center font-moon text-xl">Memuat...</p>;
  if (error || !order) return <p role="alert" className="p-10 text-center font-moon text-xl text-[#9c2b2b]">{error || 'Request tidak ditemukan.'}</p>;

  const terbuka = order.status === 'BARU' || order.status === 'DITINJAU';
  const status = MARKETING_ORDER_STATUS[order.status];

  async function run(action: () => Promise<void>) {
    setActionError('');
    setSaving(true);
    try {
      await action();
      setModal(null);
      await reload();
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function open(next: 'TOLAK' | 'TERIMA') {
    setActionError('');
    setAlasan('');
    setNilai(order!.anggaran ? String(Number(order!.anggaran)) : '');
    setModal(next);
  }

  return (
    <div className="-mx-3 sm:-mx-6">
      <ProyekInfo title="Detail" judul={order.judul || order.nomor} deskripsi={order.kebutuhan} estimasi={order.tenggatDiharapkan} anggaran={order.anggaran} documents={order.documents} kelolaDokumen={{ orderId: order.id, bisaTambah: order.status !== 'DITOLAK' && order.status !== 'DIBATALKAN', onChange: () => void reload() }} backTo="/app/request">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-moon text-sm text-coal-deep/70">
              {order.client.namaInstansi} · {order.nomor}
              {order.service ? ` · ${order.service.nama}` : ''}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <StatusPill label={status.label} className={status.className} />
              {order.nilaiDisepakati && <span className="font-moon text-lg text-coal-deep">Nilai kesepakatan: {rupiahPendek(order.nilaiDisepakati)}</span>}
            </div>
          </div>
          {!terbuka && order.status !== 'DITOLAK' && order.status !== 'DIBATALKAN' && (
            <Link to={`/app/request/${order.id}/payment`} className={pillButton}>
              Buka Payment
            </Link>
          )}
        </div>

        {order.status === 'DITOLAK' && order.alasanDitolak && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-moon text-sm text-red-700">Alasan ditolak: {order.alasanDitolak}</p>
        )}

        {terbuka ? (
          <>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <button type="button" disabled={saving} onClick={() => open('TOLAK')} className={`${bigButton} border border-red-200 bg-red-50 text-red-700 hover:bg-red-100`}>
                Tolak Request
              </button>
              <button
                type="button"
                disabled={saving || order.status === 'DITINJAU'}
                onClick={() => void run(() => updateOrderStatus(order.id, 'DITINJAU'))}
                className={`${bigButton} border border-zinc-200 bg-zinc-900 text-white hover:bg-zinc-800`}
                title={order.status === 'DITINJAU' ? 'Request ini sudah dalam tahap diskusi.' : undefined}
              >
                Diskusi Lebih Lanjut
              </button>
              <button type="button" disabled={saving} onClick={() => open('TERIMA')} className={`${bigButton} bg-flame text-white hover:bg-[#e05600]`}>
                Terima Request
              </button>
            </div>
            <p className="mt-2.5 font-moon text-xs text-zinc-500">
              Diskusi Lebih Lanjut menandai request sedang dibahas bersama klien (klien melihat status "Perlu Diskusi Lebih Lanjut"). Terima setelah MoU dan nilai disepakati.
            </p>
            {!modal && <BrandError message={actionError} />}
          </>
        ) : (
          order.status === 'DISETUJUI' && (
            <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-moon text-sm text-emerald-800">
              Request diterima. Terbitkan tagihan DP lewat Payment; Operasional akan membentuk tim.
            </p>
          )
        )}
        <OrderComments orderId={order.id} canSend={order.status !== 'DITOLAK' && order.status !== 'DIBATALKAN'} />
      </ProyekInfo>

      <BrandModal open={modal === 'TERIMA'} title="Terima Request" onClose={() => setModal(null)}>
        <form
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            void run(() => approveOrder(order.id, Number(nilai)));
          }}
        >
          <BrandField id="nilai" label="Nilai kesepakatan (Rp)">
            <input id="nilai" type="number" min="1" required value={nilai} onChange={(event) => setNilai(event.target.value)} className={brandInputSolid} />
          </BrandField>
          <p className="mb-3 font-moon text-sm text-coal-deep/70">Anggaran klien: {rupiahPendek(order.anggaran)}. Setelah diterima, terbitkan tagihan DP di halaman Payment.</p>
          <BrandError message={actionError} />
          <button type="submit" disabled={saving} className={`${pillButton} w-full`}>
            {saving ? 'Menyimpan...' : 'Terima Request'}
          </button>
        </form>
      </BrandModal>

      <BrandModal open={modal === 'TOLAK'} title="Tolak Request" onClose={() => setModal(null)}>
        <form
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            void run(() => updateOrderStatus(order.id, 'DITOLAK', alasan));
          }}
        >
          <BrandField id="alasan" label="Alasan penolakan (dibaca klien)">
            <textarea id="alasan" required minLength={5} maxLength={255} rows={3} value={alasan} onChange={(event) => setAlasan(event.target.value)} className={`${brandInputSolid} resize-y`} />
          </BrandField>
          <BrandError message={actionError} />
          <button type="submit" disabled={saving} className="w-full rounded-[24px] bg-[#9c2b2b] px-6 py-2 font-moon text-lg text-cream disabled:opacity-60">
            {saving ? 'Menyimpan...' : 'Tolak Request'}
          </button>
        </form>
      </BrandModal>
    </div>
  );
}
