import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Pagination, { usePagination } from '../../components/brand/Pagination';
import { pillButton } from '../../components/brand/StaffParts';
import { useData } from '../../hooks/useData';
import { listOrders } from '../../services/orderService';
import type { Order } from '../../types';
import { CLIENT_ORDER_STATUS, tanggal } from '../../utils/format';

const PANEL = 'mx-auto mb-8 flex min-h-[62vh] max-w-6xl flex-col rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs sm:p-6';

function Empty() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
      <div className="grid size-20 place-items-center rounded-2xl border border-flame/20 bg-flame/10 text-flame">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M12 18v-6M9 15h6" />
        </svg>
      </div>
      <p className="mt-4 max-w-md font-moon text-sm leading-relaxed text-zinc-600 sm:text-base">
        Belum ada project yang Anda ajukan. Mulai buat pengajuan project pertama Anda bersama Neo Telemetri.
      </p>
      <div className="mt-5">
        <Link to="/portal/pesan" className={pillButton}>
          + Tambah Project Baru
        </Link>
      </div>
    </div>
  );
}

function Row({ order, index }: { order: Order; index: number }) {
  const status = CLIENT_ORDER_STATUS[order.status];
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex flex-col gap-3 rounded-xl border border-zinc-200/90 bg-zinc-50/50 px-4 py-3 transition-all hover:border-flame/40 hover:bg-white hover:shadow-sm sm:flex-row sm:items-center sm:gap-4"
    >
      <span className={`shrink-0 rounded-lg border px-3 py-1 text-center font-moon text-xs font-semibold sm:w-48 ${status.className}`}>{status.label}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-magic text-sm font-semibold text-zinc-900 sm:text-base">{order.judul || order.nomor}</p>
        <p className="font-moon text-xs text-zinc-500">
          {order.nomor} · Diajukan {tanggal(order.createdAt)}
        </p>
        {order.alasanDitolak && <p className="mt-0.5 font-moon text-xs text-red-600">Alasan: {order.alasanDitolak}</p>}
      </div>
      <div className="flex shrink-0 gap-2">
        <Link
          to={`/portal/proyek/${order.id}/payment`}
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 font-moon text-xs font-semibold text-zinc-700 transition-colors hover:border-flame/40 hover:text-flame sm:flex-initial sm:text-sm"
        >
          Payment
        </Link>
        <Link to={`/portal/proyek/${order.id}`} className={`flex-1 sm:flex-initial ${pillButton}`}>
          Detail
        </Link>
      </div>
    </motion.li>
  );
}

export default function ProyekSayaPage() {
  const { data, loading, error } = useData(listOrders);
  const { paged, page, totalPages, setPage } = usePagination(data ?? [], 6);
  return (
    <section className="px-3 sm:px-6">
      <div className={PANEL}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3">
          <div>
            <h1 className="font-magic text-lg font-bold text-zinc-900 sm:text-xl">Project Saya</h1>
            <p className="font-moon text-xs text-zinc-500">Pantau status pengajuan, progres pengerjaan, diskusi, dan tagihan project Anda.</p>
          </div>
          {Boolean(data?.length) && (
            <Link to="/portal/pesan" className={pillButton}>
              + Tambah Project
            </Link>
          )}
        </div>

        {loading && <p className="p-6 text-center font-moon text-sm text-zinc-500">Memuat...</p>}
        {error && <p role="alert" className="p-6 text-center font-moon text-sm text-red-600">{error}</p>}
        {data?.length === 0 && <Empty />}
        {Boolean(data?.length) && (
          <>
            <ul className="space-y-2.5">
              {paged.map((order, index) => (
                <Row key={order.id} order={order} index={index} />
              ))}
            </ul>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </section>
  );
}
