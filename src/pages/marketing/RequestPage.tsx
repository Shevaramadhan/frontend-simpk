import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { EmptyState, LoadError, Loading, StaffPanel, StatusPill, pillButton } from '../../components/brand/StaffParts';
import { useData } from '../../hooks/useData';
import { listOrders } from '../../services/orderService';
import type { Order } from '../../types';
import { MARKETING_ORDER_STATUS, tanggal } from '../../utils/format';

// Figma "Request Page Marketing" (wireframe 23:411): Status, Judul Project, tombol Payment dan Detail.
type Tab = 'SEMUA' | 'PERLU' | 'DITERIMA' | 'SELESAI';
const TABS: { key: Tab; label: string; match: (order: Order) => boolean }[] = [
  { key: 'PERLU', label: 'Perlu Ditinjau', match: (o) => o.status === 'BARU' || o.status === 'DITINJAU' },
  { key: 'DITERIMA', label: 'Diterima', match: (o) => o.status === 'DISETUJUI' || o.status === 'MENJADI_PROYEK' },
  { key: 'SELESAI', label: 'Ditolak / Batal', match: (o) => o.status === 'DITOLAK' || o.status === 'DIBATALKAN' },
  { key: 'SEMUA', label: 'Semua', match: () => true },
];

const buktiMenunggu = (order: Order) => (order.invoices ?? []).reduce((n, invoice) => n + invoice.payments.length, 0);
const bisaBayar = (order: Order) => order.status === 'DISETUJUI' || order.status === 'MENJADI_PROYEK';

export default function RequestPage() {
  const { data, loading, error } = useData(listOrders);
  const [tab, setTab] = useState<Tab>('PERLU');
  const orders = useMemo(() => (data ?? []).filter(TABS.find((t) => t.key === tab)!.match), [data, tab]);

  return (
    <StaffPanel title="Request">
      <div role="tablist" aria-label="Saring request" className="mb-4 flex flex-wrap gap-2">
        {TABS.map((item) => {
          const count = (data ?? []).filter(item.match).length;
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setTab(item.key)}
              className={`rounded-[20px] px-4 py-1.5 font-moon text-base transition-colors ${active ? 'bg-flame text-coal' : 'border-2 border-flame text-flame hover:bg-flame/15'}`}
            >
              {item.label} ({count})
            </button>
          );
        })}
      </div>

      {loading && !data ? (
        <Loading />
      ) : error ? (
        <LoadError message={error} />
      ) : orders.length === 0 ? (
        <EmptyState>Tidak ada request pada bagian ini.</EmptyState>
      ) : (
        <div className="space-y-3">
          {orders.map((order, index) => {
            const status = MARKETING_ORDER_STATUS[order.status];
            const bukti = buktiMenunggu(order);
            return (
              <motion.article
                key={order.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index, 8) * 0.04 }}
                className="flex flex-col gap-3 rounded-[24px] border-[3px] border-flame bg-cream px-4 py-3 sm:flex-row sm:items-center"
              >
                <div className="sm:w-40">
                  <StatusPill label={status.label} className={status.className} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="line-clamp-2 break-words font-magic text-[clamp(20px,3.2vh,32px)] uppercase leading-tight text-flame">{order.judul || order.nomor}</h2>
                  <p className="font-moon text-sm text-coal-deep/70">
                    {order.client.namaInstansi} · {tanggal(order.createdAt)} · {order.nomor}
                  </p>
                  {bukti > 0 && <p className="mt-1 font-moon text-sm text-[#b25e00]">{bukti} bukti transfer menunggu diperiksa</p>}
                </div>
                <div className="flex gap-2">
                  {bisaBayar(order) && (
                    <Link to={`/app/request/${order.id}/payment`} className={`${pillButton} ${bukti > 0 ? 'ring-4 ring-[#ffd27a]' : ''}`}>
                      Payment
                    </Link>
                  )}
                  <Link to={`/app/request/${order.id}`} className={pillButton}>
                    Detail
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </StaffPanel>
  );
}
