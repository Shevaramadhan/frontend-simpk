import { Link } from 'react-router-dom';
import DataState from '../../components/DataState';
import StatusBadge from '../../components/StatusBadge';
import Table, { type Column } from '../../components/Table';
import { useData } from '../../hooks/useData';
import { listOrders } from '../../services/orderService';
import type { Order } from '../../types';
import { tanggal } from '../../utils/format';

const columns: Column<Order>[] = [
  { key: 'nomor', label: 'Nomor', render: (order) => order.nomor },
  { key: 'jasa', label: 'Jasa', render: (order) => order.service?.nama ?? '-' },
  { key: 'tanggal', label: 'Tanggal', render: (order) => tanggal(order.createdAt) },
  {
    key: 'status',
    label: 'Status',
    render: (order) => (
      <>
        <StatusBadge status={order.status} />
        {order.alasanDitolak && <p className="mt-1 text-xs text-muted">{order.alasanDitolak}</p>}
      </>
    ),
  },
];

export default function ProyekSayaPage() {
  const { data, loading, error } = useData(listOrders);
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Pesanan Saya</h1>
        <Link to="/portal/pesan" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
          Pesan Proyek
        </Link>
      </div>
      <DataState loading={loading} error={error} />
      {data && <Table columns={columns} rows={data} rowKey={(order) => order.id} emptyText="Belum ada pesanan." />}
    </section>
  );
}
