import { useEffect, useState, type FormEvent } from 'react';
import Button from '../../components/Button';
import DataState from '../../components/DataState';
import Field, { inputClass } from '../../components/Field';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';
import Table, { type Column } from '../../components/Table';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { openProtectedFile } from '../../services/fileService';
import { approveOrder, getOrder, listOrders, updateOrderStatus } from '../../services/orderService';
import type { Order, OrderDocument, OrderStatus } from '../../types';
import { ORDER_STATUS_LABEL, rupiah, tanggal } from '../../utils/format';

// Persetujuan punya formulir sendiri karena wajib disertai nilai kesepakatan.
const NEXT: Partial<Record<OrderStatus, OrderStatus[]>> = {
  BARU: ['DITINJAU', 'DITOLAK', 'DIBATALKAN'],
  DITINJAU: ['DITOLAK', 'DIBATALKAN'],
  DISETUJUI: ['DIBATALKAN'],
};

export default function PesananPage() {
  const { data, loading, error, reload } = useData(listOrders);
  const [detail, setDetail] = useState<Order | null>(null);
  const [alasan, setAlasan] = useState('');
  const [actionError, setActionError] = useState('');
  const [nilai, setNilai] = useState('');
  const [documents, setDocuments] = useState<OrderDocument[]>([]);

  // Dokumen pendukung dimuat saat modal dibuka.
  useEffect(() => {
    setDocuments([]);
    if (!detail) return;
    let active = true;
    getOrder(detail.id)
      .then((full) => active && setDocuments(full.documents))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [detail]);

  function openDetail(order: Order) {
    setDetail(order);
    setAlasan('');
    setActionError('');
    setNilai(order.anggaran ? String(Number(order.anggaran)) : '');
  }

  async function change(order: Order, status: OrderStatus) {
    setActionError('');
    try {
      await updateOrderStatus(order.id, status, status === 'DITOLAK' ? alasan : undefined);
      setDetail(null);
      await reload();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  }

  async function handleApprove(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!detail) return;
    setActionError('');
    try {
      await approveOrder(detail.id, Number(nilai));
      setDetail(null);
      await reload();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  }

  const columns: Column<Order>[] = [
    { key: 'nomor', label: 'Nomor', render: (order) => order.nomor },
    { key: 'judul', label: 'Project', render: (order) => order.judul || '-' },
    { key: 'klien', label: 'Klien', render: (order) => order.client.namaInstansi },
    { key: 'tanggal', label: 'Tanggal', render: (order) => tanggal(order.createdAt) },
    { key: 'status', label: 'Status', render: (order) => <StatusBadge status={order.status} /> },
    {
      key: 'aksi',
      label: 'Aksi',
      render: (order) => (
        <button type="button" className="underline" onClick={() => openDetail(order)}>
          Periksa
        </button>
      ),
    },
  ];

  return (
    <section>
      <h1 className="mb-4 text-xl font-semibold">Pesanan</h1>
      <DataState loading={loading} error={error} />
      {data && <Table columns={columns} rows={data} rowKey={(order) => order.id} emptyText="Belum ada pesanan." />}

      <Modal open={Boolean(detail)} title={`Pesanan ${detail?.nomor ?? ''}`} onClose={() => setDetail(null)}>
        {detail && (
          <>
            <dl className="text-sm">
              <dt className="font-medium">Klien</dt>
              <dd className="mb-2">{detail.client.namaInstansi}</dd>
              <dt className="font-medium">Nama project</dt>
              <dd className="mb-2">{detail.judul || '-'}</dd>
              <dt className="font-medium">Deskripsi</dt>
              <dd className="mb-2 whitespace-pre-wrap">{detail.kebutuhan}</dd>
              <dt className="font-medium">Anggaran</dt>
              <dd className="mb-2">{rupiah(detail.anggaran)}</dd>
              <dt className="font-medium">Tenggat</dt>
              <dd className="mb-2">{tanggal(detail.tenggatDiharapkan)}</dd>
              <dt className="font-medium">Dokumen pendukung</dt>
              <dd className="mb-2">
                {documents.length === 0
                  ? '-'
                  : documents.map((doc) => (
                      <button key={doc.id} type="button" className="mr-3 underline" onClick={() => void openProtectedFile(`/files/dokumen/${doc.id}`, doc.namaFile)}>
                        {doc.namaFile}
                      </button>
                    ))}
              </dd>
              {detail.nilaiDisepakati && (
                <>
                  <dt className="font-medium">Nilai disepakati</dt>
                  <dd className="mb-2">{rupiah(detail.nilaiDisepakati)}</dd>
                </>
              )}
            </dl>
            {(detail.status === 'BARU' || detail.status === 'DITINJAU') && (
              <form onSubmit={handleApprove} className="mb-4 border-t border-line pt-3">
                <h3 className="mb-2 font-semibold">Setujui setelah MoU disepakati</h3>
                <Field id="nilai" label="Nilai disepakati (Rp)">
                  <input id="nilai" type="number" min="1" required value={nilai} onChange={(event) => setNilai(event.target.value)} className={inputClass} />
                </Field>
                <Button type="submit">Setujui Pesanan</Button>
                <p className="mt-2 text-xs text-muted">Setelah disetujui, terbitkan tagihan DP di menu Tagihan dan Pembayaran.</p>
              </form>
            )}
            {NEXT[detail.status]?.includes('DITOLAK') && (
              <Field id="alasan" label="Alasan penolakan (wajib jika ditolak)">
                <input id="alasan" value={alasan} onChange={(e) => setAlasan(e.target.value)} className={inputClass} />
              </Field>
            )}
            {actionError && <p role="alert" className="mb-3 text-sm text-danger">{actionError}</p>}
            <div className="flex flex-wrap gap-2">
              {NEXT[detail.status]?.map((status) => (
                <Button key={status} onClick={() => void change(detail, status)}>
                  {ORDER_STATUS_LABEL[status]}
                </Button>
              ))}
            </div>
            {!NEXT[detail.status] && <p className="text-sm text-muted">Status pesanan ini tidak dapat diubah lagi.</p>}
          </>
        )}
      </Modal>
    </section>
  );
}
