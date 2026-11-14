import { useCallback, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { BrandError, BrandField, brandInputSolid } from '../../components/brand/Brand';
import BrandModal from '../../components/brand/BrandModal';
import ProyekInfo from '../../components/brand/ProyekInfo';
import { StatusPill, linkButton, pillButton } from '../../components/brand/StaffParts';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { openProtectedFile } from '../../services/fileService';
import { createInvoice, getOrder, verifyPayment } from '../../services/orderService';
import type { Invoice, Payment } from '../../types';
import { rupiahPendek, tanggalPendek } from '../../utils/format';

// Tombol Payment di Figma "Request Page Marketing" (BPMN 3): terbitkan tagihan DP lalu pelunasan, periksa bukti transfer.
const PAYMENT_STATUS: Record<Payment['statusVerifikasi'], { label: string; className: string }> = {
  MENUNGGU_VERIFIKASI: { label: 'Menunggu diperiksa', className: 'bg-[#ffd27a] text-coal-deep' },
  DITERIMA: { label: 'Diterima', className: 'bg-[#8fd694] text-coal-deep' },
  DITOLAK: { label: 'Ditolak', className: 'bg-[#f19b9b] text-coal-deep' },
};

function TerbitkanForm({ orderId, sisa, onDone }: { orderId: number; sisa: number; onDone: () => void }) {
  const [form, setForm] = useState({ keterangan: 'DP 50%', total: '', jatuhTempo: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      await createInvoice(orderId, { keterangan: form.keterangan, total: Number(form.total), jatuhTempo: form.jatuhTempo || null });
      setForm({ keterangan: 'Pelunasan', total: '', jatuhTempo: '' });
      onDone();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[22px] border-[3px] border-dashed border-flame bg-white p-4">
      <p className="mb-2 font-magic text-xl uppercase text-flame">Terbitkan Tagihan</p>
      <div className="grid gap-x-3 sm:grid-cols-3">
        <BrandField id="t-ket" label="Keterangan">
          <input id="t-ket" list="ket-umum" required maxLength={160} value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} className={brandInputSolid} />
          <datalist id="ket-umum">
            <option value="DP 50%" />
            <option value="Pelunasan" />
          </datalist>
        </BrandField>
        <BrandField id="t-total" label="Nominal (Rp)">
          <input id="t-total" type="number" min="1" required value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} className={brandInputSolid} />
        </BrandField>
        <BrandField id="t-tempo" label="Tenggat pembayaran">
          <input id="t-tempo" type="date" value={form.jatuhTempo} onChange={(e) => setForm({ ...form, jatuhTempo: e.target.value })} className={brandInputSolid} />
        </BrandField>
      </div>
      {sisa > 0 && (
        <button type="button" onClick={() => setForm({ ...form, total: String(sisa) })} className={`${linkButton} mb-3`}>
          Isi sisa yang belum ditagih: {rupiahPendek(sisa)}
        </button>
      )}
      <BrandError message={error} />
      <button type="submit" disabled={saving} className={pillButton}>
        {saving ? 'Menerbitkan...' : 'Terbitkan'}
      </button>
    </form>
  );
}

function InvoiceCard({ invoice, onReview }: { invoice: Invoice; onReview: (payment: Payment) => void }) {
  return (
    <div className="rounded-[22px] border-[3px] border-coal/10 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-magic text-xl uppercase text-coal-deep">{invoice.keterangan}</p>
        <StatusPill label={invoice.status === 'LUNAS' ? 'Lunas' : 'Belum lunas'} className={invoice.status === 'LUNAS' ? 'bg-[#8fd694] text-coal-deep' : 'bg-[#bdbdbd] text-coal-deep'} />
      </div>
      <dl className="mt-1 flex flex-wrap gap-x-8 gap-y-1 font-moon text-lg">
        <div className="flex gap-2">
          <dt className="text-flame">Tagihan :</dt>
          <dd>{rupiahPendek(invoice.total)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-flame">Tenggat :</dt>
          <dd>{tanggalPendek(invoice.jatuhTempo)}</dd>
        </div>
      </dl>
      <p className="font-moon text-xs text-coal-deep/60">{invoice.nomor}</p>
      {invoice.payments.length > 0 ? (
        <ul className="mt-2 space-y-1.5">
          {invoice.payments.map((payment) => {
            const status = PAYMENT_STATUS[payment.statusVerifikasi];
            return (
              <li key={payment.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-cream px-3 py-2 font-moon text-sm">
                <StatusPill label={status.label} className={status.className} />
                <span>
                  {rupiahPendek(payment.jumlah)} · transfer {tanggalPendek(payment.tglTransfer)}
                </span>
                <button type="button" onClick={() => onReview(payment)} className={linkButton}>
                  {payment.statusVerifikasi === 'MENUNGGU_VERIFIKASI' ? 'Periksa bukti' : 'Lihat bukti'}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-2 font-moon text-sm text-coal-deep/60">Klien belum mengunggah bukti.</p>
      )}
    </div>
  );
}

export default function PaymentMarketingPage() {
  const id = Number(useParams().id);
  const load = useCallback(() => getOrder(id), [id]);
  const { data: order, loading, error, reload } = useData(load);
  const [review, setReview] = useState<{ invoice: Invoice; payment: Payment } | null>(null);
  const [alasan, setAlasan] = useState('');
  const [actionError, setActionError] = useState('');
  const [saving, setSaving] = useState(false);

  if (loading && !order) return <p className="p-10 text-center font-moon text-xl">Memuat...</p>;
  if (error || !order) return <p role="alert" className="p-10 text-center font-moon text-xl text-[#9c2b2b]">{error || 'Request tidak ditemukan.'}</p>;

  const nilai = Number(order.nilaiDisepakati ?? 0);
  const ditagih = order.invoices.reduce((n, invoice) => n + Number(invoice.total), 0);
  const dibayar = order.invoices.flatMap((invoice) => invoice.payments).filter((p) => p.statusVerifikasi === 'DITERIMA').reduce((n, p) => n + Number(p.jumlah), 0);
  const bisaTagih = order.status === 'DISETUJUI' || order.status === 'MENJADI_PROYEK';

  async function decide(status: 'DITERIMA' | 'DITOLAK') {
    if (!review) return;
    setActionError('');
    setSaving(true);
    try {
      await verifyPayment(review.payment.id, status, status === 'DITOLAK' ? alasan : undefined);
      setReview(null);
      await reload();
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="-mx-3 sm:-mx-6">
      <ProyekInfo title="Payment" judul={order.judul || order.nomor} deskripsi={order.kebutuhan} estimasi={order.tenggatDiharapkan} anggaran={order.anggaran} documents={order.documents} backTo="/app/request">
        <p className="text-center font-magic text-2xl uppercase text-flame sm:text-3xl">Tabel Pembayaran</p>
        <dl className="mx-auto mt-3 grid max-w-3xl gap-2 text-center font-moon sm:grid-cols-3">
          {[
            ['Nilai kesepakatan', rupiahPendek(nilai || null)],
            ['Sudah ditagih', rupiahPendek(ditagih)],
            ['Sudah dibayar', rupiahPendek(dibayar)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-coal px-3 py-2">
              <dt className="text-sm text-flame">{label}</dt>
              <dd className="text-xl text-cream">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 space-y-4">
          {order.invoices.length === 0 && <p className="rounded-2xl bg-white p-4 text-center font-moon text-lg">Belum ada tagihan untuk request ini.</p>}
          {order.invoices.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              onReview={(payment) => {
                setAlasan('');
                setActionError('');
                setReview({ invoice, payment });
              }}
            />
          ))}
          {bisaTagih ? (
            <TerbitkanForm orderId={order.id} sisa={Math.max(nilai - ditagih, 0)} onDone={() => void reload()} />
          ) : (
            <p className="font-moon text-base text-coal-deep/70">Tagihan dapat diterbitkan setelah request diterima.</p>
          )}
        </div>
      </ProyekInfo>

      <BrandModal open={Boolean(review)} title="Bukti Transfer" onClose={() => setReview(null)}>
        {review && (
          <>
            <dl className="mb-3 font-moon text-base text-coal-deep">
              <div className="flex justify-between gap-3">
                <dt className="text-flame">Tagihan</dt>
                <dd>
                  {review.invoice.keterangan} · {rupiahPendek(review.invoice.total)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-flame">Jumlah transfer</dt>
                <dd>{rupiahPendek(review.payment.jumlah)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-flame">Tanggal transfer</dt>
                <dd>{tanggalPendek(review.payment.tglTransfer)}</dd>
              </div>
              {review.payment.alasanDitolak && (
                <div className="flex justify-between gap-3">
                  <dt className="text-flame">Alasan ditolak</dt>
                  <dd>{review.payment.alasanDitolak}</dd>
                </div>
              )}
            </dl>
            <button type="button" className={`${pillButton} mb-4 w-full`} onClick={() => void openProtectedFile(`/files/bukti/${review.payment.id}`, `bukti-${review.payment.id}`)}>
              Buka Berkas Bukti
            </button>
            {review.payment.statusVerifikasi === 'MENUNGGU_VERIFIKASI' && (
              <>
                <p className="mb-3 font-moon text-sm text-coal-deep/70">Cocokkan dengan mutasi rekening sebelum menerima.</p>
                <BrandField id="alasan-bukti" label="Alasan penolakan (wajib jika ditolak)">
                  <input id="alasan-bukti" value={alasan} onChange={(event) => setAlasan(event.target.value)} className={brandInputSolid} />
                </BrandField>
                <BrandError message={actionError} />
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" disabled={saving} onClick={() => void decide('DITOLAK')} className="rounded-[24px] bg-[#9c2b2b] px-4 py-2 font-moon text-lg text-cream disabled:opacity-60">
                    Tolak
                  </button>
                  <button type="button" disabled={saving} onClick={() => void decide('DITERIMA')} className={pillButton}>
                    Terima, Lunas
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </BrandModal>
    </div>
  );
}
