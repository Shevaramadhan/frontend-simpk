import { useCallback, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { BrandError, dashedBox } from '../../components/brand/Brand';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { getOrder, payInvoice } from '../../services/orderService';
import type { Invoice } from '../../types';
import { rupiahPendek, tanggalPendek } from '../../utils/format';
import ProyekInfo from './ProyekInfo';

// Figma "Payment Page": tabel pembayaran, QR, dan unggah bukti. Skema DP lalu pelunasan = beberapa tagihan.
function invoiceState(invoice: Invoice) {
  const last = invoice.payments[0];
  if (invoice.status === 'LUNAS') return { label: 'Lunas', tone: 'bg-[#8fd694]', canPay: false, note: '' };
  if (last?.statusVerifikasi === 'MENUNGGU_VERIFIKASI') return { label: 'Bukti sedang diperiksa', tone: 'bg-[#ffd27a]', canPay: false, note: '' };
  if (last?.statusVerifikasi === 'DITOLAK') return { label: 'Bukti ditolak', tone: 'bg-[#f19b9b]', canPay: true, note: last.alasanDitolak ?? '' };
  return { label: 'Belum dibayar', tone: 'bg-[#bdbdbd]', canPay: true, note: '' };
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

  const small = 'w-full rounded-xl border-[3px] border-coal-deep bg-white px-3 py-1.5 font-moon text-base text-coal-deep';
  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <div className="mb-3 grid gap-3 sm:grid-cols-2">
        <label className="font-moon text-sm text-flame">
          Jumlah transfer (Rp)
          <input type="number" min="1" required value={jumlah} onChange={(event) => setJumlah(event.target.value)} className={small} />
        </label>
        <label className="font-moon text-sm text-flame">
          Tanggal transfer
          <input type="date" required value={tgl} onChange={(event) => setTgl(event.target.value)} className={small} />
        </label>
      </div>
      <input id={inputId} type="file" accept=".pdf,.png,.jpg,.jpeg" className="sr-only" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
      <label htmlFor={inputId} className={`${dashedBox} block cursor-pointer bg-[#f7833c6e] px-4 py-4 text-center font-magic text-lg uppercase text-flame hover:bg-[#f7833c99]`}>
        {file ? file.name : 'Upload bukti pembayaran'}
      </label>
      <p className="mt-1 font-moon text-xs text-coal-deep/70">JPG, PNG, atau PDF, maksimal 2 MB.</p>
      <BrandError message={error} />
      {file && (
        <button type="submit" disabled={saving} className="mt-2 w-full rounded-2xl bg-coal py-2.5 font-magic text-lg uppercase text-flame hover:text-cream disabled:opacity-60">
          {saving ? 'Mengirim...' : 'Kirim bukti'}
        </button>
      )}
    </form>
  );
}

function InvoiceCard({ invoice, onChange }: { invoice: Invoice; onChange: () => void }) {
  const state = invoiceState(invoice);
  return (
    <div className="rounded-[22px] border-[3px] border-coal/10 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-magic text-xl uppercase text-coal-deep">{invoice.keterangan}</p>
        <span className={`rounded-xl px-3 py-1 font-moon text-sm text-coal-deep ${state.tone}`}>{state.label}</span>
      </div>
      <dl className="mt-2 flex flex-wrap gap-x-8 gap-y-1 font-moon text-lg">
        <div className="flex gap-2">
          <dt className="text-flame">Tagihan :</dt>
          <dd className="text-coal-deep">{rupiahPendek(invoice.total)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-flame">Tenggat Pembayaran :</dt>
          <dd className="text-coal-deep">{tanggalPendek(invoice.jatuhTempo)}</dd>
        </div>
      </dl>
      <p className="font-moon text-xs text-coal-deep/60">{invoice.nomor}</p>
      {state.note && <p className="mt-2 rounded-xl bg-[#f19b9b55] px-3 py-1.5 font-moon text-sm text-coal-deep">Alasan ditolak: {state.note}</p>}
      {state.canPay && <UploadForm invoice={invoice} onDone={onChange} />}
    </div>
  );
}

export default function PaymentPage() {
  const id = Number(useParams().id);
  const load = useCallback(() => getOrder(id), [id]);
  const { data: order, loading, error, reload } = useData(load);

  if (loading && !order) return <p className="p-10 text-center font-moon text-xl text-coal-deep">Memuat...</p>;
  if (error || !order) return <p role="alert" className="p-10 text-center font-moon text-xl text-[#9c2b2b]">{error || 'Project tidak ditemukan.'}</p>;

  return (
    <ProyekInfo title="Payment" order={order}>
      <p className="text-center font-magic text-2xl uppercase text-flame sm:text-3xl">Tabel Pembayaran</p>
      <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          {order.invoices.length === 0 ? (
            <p className="rounded-2xl bg-white p-5 text-center font-moon text-lg text-coal-deep">
              {order.status === 'DISETUJUI' || order.status === 'MENJADI_PROYEK'
                ? 'Tagihan belum diterbitkan. Marketing akan segera menerbitkan tagihan DP.'
                : 'Tagihan diterbitkan setelah pengajuan disetujui Marketing.'}
            </p>
          ) : (
            order.invoices.map((invoice) => <InvoiceCard key={invoice.id} invoice={invoice} onChange={() => void reload()} />)
          )}
        </div>
        <div className="mx-auto w-[220px] rounded-[20px] bg-flame p-3">
          {/* Kode QRIS resmi Neo Telemetri belum tersedia; QR pada desain hanya contoh dan tidak dipakai. */}
          <div className="grid aspect-square place-items-center rounded-xl bg-white p-4 text-center font-moon text-sm text-coal-deep">
            Kode QRIS Neo Telemetri akan tampil di sini. Sementara, transfer sesuai arahan Marketing.
          </div>
        </div>
      </div>
    </ProyekInfo>
  );
}
