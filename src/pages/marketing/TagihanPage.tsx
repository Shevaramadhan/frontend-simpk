import { useState, type FormEvent } from 'react';
import Button from '../../components/Button';
import DataState from '../../components/DataState';
import Field, { inputClass } from '../../components/Field';
import Modal from '../../components/Modal';
import Table, { type Column } from '../../components/Table';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { openProtectedFile } from '../../services/fileService';
import { createInvoice, listInvoices, listOrders, verifyPayment } from '../../services/orderService';
import type { InvoiceWithOrder, Order, Payment } from '../../types';
import { rupiah, tanggal } from '../../utils/format';

// BPMN 3: Marketing menerbitkan tagihan (DP lalu pelunasan) dan memeriksa bukti transfer.
const PAYMENT_LABEL: Record<Payment['statusVerifikasi'], string> = {
  MENUNGGU_VERIFIKASI: 'Menunggu diperiksa',
  DITERIMA: 'Diterima',
  DITOLAK: 'Ditolak',
};

function IssueForm({ orders, onDone }: { orders: Order[]; onDone: () => void }) {
  const [orderId, setOrderId] = useState('');
  const [keterangan, setKeterangan] = useState('DP 50%');
  const [total, setTotal] = useState('');
  const [jatuhTempo, setJatuhTempo] = useState('');
  const [error, setError] = useState('');
  const selected = orders.find((order) => order.id === Number(orderId));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    try {
      await createInvoice(Number(orderId), { keterangan, total: Number(total), jatuhTempo: jatuhTempo || null });
      setTotal('');
      onDone();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-line bg-surface p-4">
      <h2 className="mb-3 font-semibold">Terbitkan tagihan</h2>
      <div className="grid gap-x-4 sm:grid-cols-2">
        <Field id="order" label="Pesanan yang sudah disetujui">
          <select id="order" required value={orderId} onChange={(event) => setOrderId(event.target.value)} className={inputClass}>
            <option value="">Pilih pesanan</option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.judul || order.nomor} ({order.client.namaInstansi})
              </option>
            ))}
          </select>
        </Field>
        <Field id="keterangan" label="Keterangan">
          <input id="keterangan" required value={keterangan} onChange={(event) => setKeterangan(event.target.value)} className={inputClass} list="keterangan-umum" />
          <datalist id="keterangan-umum">
            <option value="DP 50%" />
            <option value="Pelunasan" />
          </datalist>
        </Field>
        <Field id="total" label={`Nominal (Rp)${selected?.nilaiDisepakati ? `, nilai kesepakatan ${rupiah(selected.nilaiDisepakati)}` : ''}`}>
          <input id="total" type="number" min="1" required value={total} onChange={(event) => setTotal(event.target.value)} className={inputClass} />
        </Field>
        <Field id="jatuhTempo" label="Jatuh tempo">
          <input id="jatuhTempo" type="date" value={jatuhTempo} onChange={(event) => setJatuhTempo(event.target.value)} className={inputClass} />
        </Field>
      </div>
      {error && <p role="alert" className="mb-3 text-sm text-danger">{error}</p>}
      <Button type="submit">Terbitkan</Button>
    </form>
  );
}

export default function TagihanPage() {
  const invoices = useData(listInvoices);
  const orders = useData(listOrders);
  const [review, setReview] = useState<{ invoice: InvoiceWithOrder; payment: Payment } | null>(null);
  const [alasan, setAlasan] = useState('');
  const [actionError, setActionError] = useState('');
  const approved = (orders.data ?? []).filter((order) => order.status === 'DISETUJUI' || order.status === 'MENJADI_PROYEK');

  async function decide(status: 'DITERIMA' | 'DITOLAK') {
    if (!review) return;
    setActionError('');
    try {
      await verifyPayment(review.payment.id, status, status === 'DITOLAK' ? alasan : undefined);
      setReview(null);
      await invoices.reload();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  }

  const columns: Column<InvoiceWithOrder>[] = [
    { key: 'nomor', label: 'Nomor', render: (invoice) => invoice.nomor },
    { key: 'project', label: 'Project', render: (invoice) => `${invoice.order.judul || invoice.order.nomor} (${invoice.order.client.namaInstansi})` },
    { key: 'ket', label: 'Keterangan', render: (invoice) => invoice.keterangan },
    { key: 'total', label: 'Nominal', render: (invoice) => rupiah(invoice.total) },
    { key: 'tempo', label: 'Jatuh tempo', render: (invoice) => tanggal(invoice.jatuhTempo) },
    { key: 'status', label: 'Status', render: (invoice) => (invoice.status === 'LUNAS' ? 'Lunas' : 'Belum lunas') },
    {
      key: 'bukti',
      label: 'Bukti terakhir',
      render: (invoice) => {
        const payment = invoice.payments[0];
        if (!payment) return '-';
        return (
          <button type="button" className="underline" onClick={() => { setAlasan(''); setActionError(''); setReview({ invoice, payment }); }}>
            {PAYMENT_LABEL[payment.statusVerifikasi]}
          </button>
        );
      },
    },
  ];

  return (
    <section>
      <h1 className="mb-4 text-xl font-semibold">Tagihan dan Pembayaran</h1>
      {orders.data && <IssueForm orders={approved} onDone={() => void invoices.reload()} />}
      <DataState loading={invoices.loading} error={invoices.error} />
      {invoices.data && <Table columns={columns} rows={invoices.data} rowKey={(invoice) => invoice.id} emptyText="Belum ada tagihan." />}

      <Modal open={Boolean(review)} title={`Bukti transfer ${review?.invoice.nomor ?? ''}`} onClose={() => setReview(null)}>
        {review && (
          <>
            <dl className="mb-3 text-sm">
              <dt className="font-medium">Jumlah transfer</dt>
              <dd className="mb-2">{rupiah(review.payment.jumlah)} dari tagihan {rupiah(review.invoice.total)}</dd>
              <dt className="font-medium">Tanggal transfer</dt>
              <dd className="mb-2">{tanggal(review.payment.tglTransfer)}</dd>
              <dt className="font-medium">Status</dt>
              <dd className="mb-2">{PAYMENT_LABEL[review.payment.statusVerifikasi]}{review.payment.alasanDitolak ? `: ${review.payment.alasanDitolak}` : ''}</dd>
            </dl>
            <button type="button" className="mb-4 underline" onClick={() => void openProtectedFile(`/files/bukti/${review.payment.id}`, `bukti-${review.payment.id}`)}>
              Buka berkas bukti
            </button>
            {review.payment.statusVerifikasi === 'MENUNGGU_VERIFIKASI' && (
              <>
                <p className="mb-3 text-sm text-muted">Cocokkan dengan mutasi rekening sebelum menerima.</p>
                <Field id="alasan-bukti" label="Alasan penolakan (wajib jika ditolak)">
                  <input id="alasan-bukti" value={alasan} onChange={(event) => setAlasan(event.target.value)} className={inputClass} />
                </Field>
                {actionError && <p role="alert" className="mb-3 text-sm text-danger">{actionError}</p>}
                <div className="flex gap-2">
                  <Button onClick={() => void decide('DITERIMA')}>Terima, tandai lunas</Button>
                  <Button onClick={() => void decide('DITOLAK')}>Tolak</Button>
                </div>
              </>
            )}
          </>
        )}
      </Modal>
    </section>
  );
}
