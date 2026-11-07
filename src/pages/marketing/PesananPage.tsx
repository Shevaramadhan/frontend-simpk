import { useState } from 'react';
import Button from '../../components/Button';
import DataState from '../../components/DataState';
import Field, { inputClass } from '../../components/Field';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';
import Table, { type Column } from '../../components/Table';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { listOrders, updateOrderStatus } from '../../services/orderService';
import type { Order, OrderStatus } from '../../types';
import { ORDER_STATUS_LABEL, rupiah, tanggal } from '../../utils/format';

const NEXT: Partial<Record<OrderStatus, OrderStatus[]>> = {
  BARU: ['DITINJAU', 'DITOLAK', 'DIBATALKAN'],
  DITINJAU: ['DISETUJUI', 'DITOLAK', 'DIBATALKAN'],
  DISETUJUI: ['DIBATALKAN'],
};

export default function PesananPage() {
  const { data, loading, error, reload } = useData(listOrders);
  const [detail, setDetail] = useState<Order | null>(null);
  const [alasan, setAlasan] = useState('');
  const [actionError, setActionError] = useState('');

  function openDetail(order: Order) {
    setDetail(order);
    setAlasan('');
    setActionError('');
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

  const columns: Column<Order>[] = [
    { key: 'nomor', label: 'Nomor', render: (order) => order.nomor },
    { key: 'klien', label: 'Klien', render: (order) => order.client.namaInstansi },
    { key: 'jasa', label: 'Jasa', render: (order) => order.service?.nama ?? '-' },
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
              <dt className="font-medium">Kebutuhan</dt>
              <dd className="mb-2 whitespace-pre-wrap">{detail.kebutuhan}</dd>
              <dt className="font-medium">Anggaran</dt>
              <dd className="mb-2">{rupiah(detail.anggaran)}</dd>
              <dt className="font-medium">Tenggat</dt>
              <dd className="mb-2">{tanggal(detail.tenggatDiharapkan)}</dd>
            </dl>
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
