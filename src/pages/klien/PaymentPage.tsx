import { useCallback, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BrandError, brandInputSolid, dashedBox } from '../../components/brand/Brand';
import ProyekInfo from '../../components/brand/ProyekInfo';
import { pillButton } from '../../components/brand/StaffParts';
import DateInput, { hariIni } from '../../components/DateInput';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { getOrder, payInvoice } from '../../services/orderService';
import type { Invoice } from '../../types';
import { rupiahPendek, tanggalPendek } from '../../utils/format';

function invoiceState(invoice: Invoice) {
  const last = invoice.payments[0];
  if (invoice.status === 'LUNAS') return { label: 'Lunas', tone: 'border border-emerald-200 bg-emerald-50 text-emerald-700', canPay: false, note: '' };
  if (invoice.status === 'DIBATALKAN') return { label: 'Dibatalkan', tone: 'border border-zinc-200 bg-zinc-100 text-zinc-500', canPay: false, note: '' };
  if (last?.statusVerifikasi === 'MENUNGGU_VERIFIKASI') return { label: 'Bukti sedang diperiksa', tone: 'border border-amber-200 bg-amber-50 text-amber-800', canPay: false, note: '' };
  if (last?.statusVerifikasi === 'DITOLAK') return { label: 'Bukti ditolak', tone: 'border border-red-200 bg-red-50 text-red-700', canPay: true, note: last.alasanDitolak ?? '' };
  return { label: 'Belum dibayar', tone: 'border border-zinc-200 bg-zinc-100 text-zinc-700', canPay: true, note: '' };
}

function UploadForm({ invoice, onDone }: { invoice: Invoice; onDone: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [jumlah, setJumlah] = useState(String(Number(invoice.total)));
  const [tgl, setTgl] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const inputId = `bukti-${invoice.id}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError('Pilih berkas bukti transfer.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await payInvoice(invoice.id, { jumlah: Number(jumlah), tglTransfer: tgl, bukti: file });
      onDone();
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 border-t border-zinc-100 pt-3">
      <div className="mb-3 grid gap-3 sm:grid-cols-2">
        <label className="font-moon text-xs font-semibold text-zinc-700">
          Jumlah transfer (Rp)
          <input type="number" min="1" required value={jumlah} onChange={(event) => setJumlah(event.target.value)} className={brandInputSolid} />
        </label>
        <label className="font-moon text-xs font-semibold text-zinc-700">
          Tanggal transfer
          <DateInput required max={hariIni()} value={tgl} onChange={(event) => setTgl(event.target.value)} className={brandInputSolid} />
        </label>
      </div>
      <input id={inputId} type="file" accept=".pdf,.png,.jpg,.jpeg" className="sr-only" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
      <label htmlFor={inputId} className={`${dashedBox} block cursor-pointer bg-zinc-50 px-4 py-3 text-center font-moon text-sm font-semibold text-flame hover:bg-flame/5`}>
        {file ? file.name : '+ Pilih Berkas Bukti Pembayaran'}
      </label>
      <p className="mt-1 font-moon text-xs text-zinc-500">JPG, PNG, atau PDF, maksimal 2 MB.</p>
      <BrandError message={error} />
      {file && (
        <button type="submit" disabled={saving} className={`mt-2 w-full ${pillButton}`}>
          {saving ? 'Mengirim...' : 'Kirim Bukti Pembayaran'}
        </button>
      )}
    </form>
  );
}

function InvoiceCard({ orderId, invoice, onChange }: { orderId: number; invoice: Invoice; onChange: () => void }) {
  const state = invoiceState(invoice);
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-magic text-base font-bold text-zinc-900">{invoice.keterangan}</p>
        <span className="flex items-center gap-2">
          <Link to={`/tagihan/${orderId}/${invoice.id}`} className="rounded-lg border border-zinc-200 bg-white px-3 py-1 font-moon text-xs font-medium text-zinc-700 hover:border-flame/40 hover:text-flame">
            Cetak Tagihan
          </Link>
          <span className={`rounded-lg px-2.5 py-1 font-moon text-xs font-semibold ${state.tone}`}>{state.label}</span>
        </span>
      </div>
      <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-moon text-sm">
        <div className="flex gap-1.5">
          <dt className="text-zinc-500">Tagihan:</dt>
          <dd className="font-semibold text-zinc-900">{rupiahPendek(invoice.total)}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="text-zinc-500">Tenggat Pembayaran:</dt>
          <dd className="font-semibold text-zinc-800">{tanggalPendek(invoice.jatuhTempo)}</dd>
        </div>
      </dl>
      <p className="mt-0.5 font-moon text-xs text-zinc-400">{invoice.nomor}</p>
      {state.note && <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 font-moon text-xs text-red-700">Alasan ditolak: {state.note}</p>}
      {invoice.status === 'DIBATALKAN' && (
        <p className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 font-moon text-xs text-zinc-600">
          Tagihan ini dibatalkan Marketing dan tidak perlu dibayar.{invoice.alasanBatal ? ` Alasan: ${invoice.alasanBatal}` : ''}
        </p>
      )}
      {state.canPay && <UploadForm invoice={invoice} onDone={onChange} />}
    </div>
  );
}

export default function PaymentPage() {
  const id = Number(useParams().id);
  const load = useCallback(() => getOrder(id), [id]);
  const { data: order, loading, error, reload } = useData(load);

  if (loading && !order) return <p className="p-10 text-center font-moon text-sm text-zinc-500">Memuat...</p>;
  if (error || !order) return <p role="alert" className="p-10 text-center font-moon text-sm text-red-600">{error || 'Project tidak ditemukan.'}</p>;

  return (
    <ProyekInfo
      title="Payment"
      judul={order.judul || order.nomor}
      deskripsi={order.kebutuhan}
      estimasi={order.tenggatDiharapkan}
      anggaran={order.anggaran}
      documents={order.documents}
      kelolaDokumen={{ orderId: order.id, bisaTambah: order.status === 'BARU' || order.status === 'DITINJAU', onChange: () => void reload() }}
      backTo="/portal/proyek"
    >
      <p className="font-magic text-base font-bold text-zinc-900 sm:text-lg">Daftar Tagihan &amp; Pembayaran</p>
      <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_200px]">
        <div className="space-y-3">
          {order.invoices.length === 0 ? (
            <p className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-5 text-center font-moon text-sm text-zinc-500">
              {order.status === 'DISETUJUI' || order.status === 'MENJADI_PROYEK'
                ? 'Tagihan belum diterbitkan. Marketing akan segera menerbitkan tagihan DP.'
                : 'Tagihan diterbitkan setelah pengajuan disetujui Marketing.'}
            </p>
          ) : (
            order.invoices.map((invoice) => <InvoiceCard key={invoice.id} orderId={order.id} invoice={invoice} onChange={() => void reload()} />)
          )}
        </div>
        <div className="mx-auto w-full max-w-[200px] rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="grid aspect-square place-items-center rounded-lg border border-dashed border-zinc-300 bg-white p-3 text-center font-moon text-xs text-zinc-500">
            Kode QRIS Neo Telemetri akan tampil di sini. Sementara, transfer sesuai rekening pada Cetak Tagihan.
          </div>
        </div>
      </div>
    </ProyekInfo>
  );
}
