import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useData } from '../../hooks/useData';
import { listOrders } from '../../services/orderService';
import type { Order } from '../../types';
import { CLIENT_ORDER_STATUS } from '../../utils/format';

// Figma "MyProject ketika belum ada isi" dan "MyProject ketika sudah ada isi".
const PANEL = 'mx-auto mb-10 min-h-[60vh] max-w-6xl rounded-[30px] bg-coal-deep p-4 sm:p-6';

function Empty() {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center px-4 text-center">
      <svg aria-hidden="true" viewBox="0 0 120 120" className="size-28 sm:size-36" fill="none">
        <circle cx="60" cy="60" r="52" stroke="#ff6200" strokeWidth="10" />
        <path d="M44 46a16 16 0 1 1 22 14c-4 2-6 5-6 9v4" stroke="#ff6200" strokeWidth="10" strokeLinecap="round" />
        <circle cx="60" cy="88" r="6" fill="#ff6200" />
      </svg>
      <p className="mt-6 max-w-lg font-moon text-xl leading-relaxed text-flame sm:text-2xl">
        Sepertinya belum ada project yang kamu buat, ayo buat project sekarang bersama SIMPK BY NEO TELEMETRI
      </p>
      <div className="mt-8">
        <Link to="/portal/pesan" className="group inline-block transition-transform hover:-translate-y-0.5">
          <span className="block bg-cream p-[4px]">
            <span className="block border-[4px] border-coal bg-cream px-8 py-3 font-magic text-2xl uppercase text-flame">Tambah Project</span>
          </span>
        </Link>
      </div>
    </div>
  );
}

function Row({ order, index }: { order: Order; index: number }) {
  const status = CLIENT_ORDER_STATUS[order.status];
  const link = 'rounded-2xl bg-flame px-4 py-2 text-center font-moon text-lg text-cream transition-colors hover:bg-[#e05600] sm:px-6';
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex flex-col gap-3 rounded-[22px] bg-cream p-3 sm:flex-row sm:items-center sm:gap-4"
    >
      <span className={`shrink-0 rounded-2xl border-[3px] px-3 py-1.5 text-center font-moon text-sm leading-tight sm:w-40 ${status.className}`}>{status.label}</span>
      <div className="min-w-0 flex-1 text-center sm:text-left">
        <p className="truncate font-magic text-xl uppercase text-flame sm:text-2xl">{order.judul || order.nomor}</p>
        {order.alasanDitolak && <p className="font-moon text-sm text-coal-deep">Alasan: {order.alasanDitolak}</p>}
      </div>
      <div className="flex shrink-0 gap-2">
        <Link to={`/portal/proyek/${order.id}/payment`} className={`flex-1 ${link}`}>
          Payment
        </Link>
        <Link to={`/portal/proyek/${order.id}`} className={`flex-1 ${link}`}>
          Detail
        </Link>
      </div>
    </motion.li>
  );
}

export default function ProyekSayaPage() {
  const { data, loading, error } = useData(listOrders);
  return (
    <section className="px-3 sm:px-6">
      <h1 className="sr-only">Project saya</h1>
      <div className={PANEL}>
        {loading && <p className="p-6 text-center font-moon text-lg text-cream">Memuat...</p>}
        {error && <p role="alert" className="p-6 text-center font-moon text-lg text-[#f19b9b]">{error}</p>}
        {data?.length === 0 && <Empty />}
        {Boolean(data?.length) && (
          <>
            <ul className="space-y-3">
              {data?.map((order, index) => (
                <Row key={order.id} order={order} index={index} />
              ))}
            </ul>
            <Link
              to="/portal/pesan"
              className="mt-3 block rounded-[22px] border-[4px] border-dashed border-flame bg-[#83522f] py-4 text-center font-magic text-2xl uppercase text-flame transition-colors hover:bg-[#9a5f35]"
            >
              Tambah Project
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
