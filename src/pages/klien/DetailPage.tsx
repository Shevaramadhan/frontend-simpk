import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useData } from '../../hooks/useData';
import { getOrder, listClientUpdates } from '../../services/orderService';
import type { Bidang } from '../../types';
import { BIDANG_LABEL, tanggal } from '../../utils/format';
import ProyekInfo from './ProyekInfo';

// Figma "Detail Page": total progres dan progres per bidang. Klien tidak pernah menerima catatan teknis.
const BIDANG_ORDER: Bidang[] = ['UI_UX', 'FRONTEND', 'BACKEND', 'INTEGRASI'];

function Bar({ value, track, fill }: { value: number; track: string; fill: string }) {
  return (
    <span className={`relative block h-2.5 flex-1 overflow-hidden rounded-full ${track}`}>
      <motion.span
        className={`absolute inset-y-0 left-0 rounded-full ${fill}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </span>
  );
}

function BidangProgress({ bidang, value }: { bidang: Bidang; value: number | null }) {
  const done = value === 100;
  return (
    <div>
      <p className="font-moon text-xl text-coal-deep">{BIDANG_LABEL[bidang]}</p>
      <div className={`mt-1 flex items-center gap-4 rounded-[18px] border-[4px] border-flame px-4 py-1.5 ${done ? 'bg-flame' : 'bg-cream'}`}>
        {value === null ? (
          <span className="font-moon text-base text-coal-deep/70">Belum ada tugas</span>
        ) : done ? (
          <span className="w-full text-center font-moon text-2xl text-cream">100%</span>
        ) : (
          <>
            <span className="w-14 font-moon text-2xl text-flame">{value}%</span>
            <Bar value={value} track="bg-coal" fill="bg-flame" />
          </>
        )}
      </div>
    </div>
  );
}

function Updates({ projectId }: { projectId: number }) {
  const load = useCallback(() => listClientUpdates(projectId), [projectId]);
  const { data } = useData(load);
  if (!data?.length) return null;
  return (
    <div className="mt-8">
      <p className="text-center font-magic text-2xl uppercase text-flame">Catatan Perkembangan</p>
      <ul className="mt-3 space-y-2">
        {data.slice(0, 5).map((update) => (
          <li key={update.id} className="rounded-2xl border-[3px] border-coal/15 bg-white px-4 py-3">
            <p className="font-moon text-sm text-coal-deep/70">
              {tanggal(update.createdAt)} · {update.task.judul} · {update.persentase}%
            </p>
            <p className="mt-1 font-moon text-base text-coal-deep">{update.catatanKlien}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DetailPage() {
  const id = Number(useParams().id);
  const load = useCallback(() => getOrder(id), [id]);
  const { data: order, loading, error } = useData(load);

  if (loading) return <p className="p-10 text-center font-moon text-xl text-coal-deep">Memuat...</p>;
  if (error || !order) return <p role="alert" className="p-10 text-center font-moon text-xl text-[#9c2b2b]">{error || 'Project tidak ditemukan.'}</p>;
  const project = order.project;

  return (
    <ProyekInfo title="Detail" order={order}>
      <p className="text-center font-magic text-2xl uppercase text-flame sm:text-3xl">Total Progress</p>
      {project ? (
        <>
          <div className="mx-auto mt-2 flex max-w-md items-center gap-4 rounded-[18px] bg-flame px-5 py-2">
            <span className="font-moon text-2xl text-cream">{project.progres}%</span>
            <Bar value={project.progres} track="bg-coal" fill="bg-cream" />
          </div>
          <div className="mt-5 grid gap-x-10 gap-y-3 md:grid-cols-2">
            {BIDANG_ORDER.map((bidang) => (
              <BidangProgress key={bidang} bidang={bidang} value={project.progresBidang[bidang]} />
            ))}
          </div>
          <Updates projectId={project.id} />
        </>
      ) : (
        <p className="mt-3 text-center font-moon text-lg text-coal-deep">
          {order.status === 'DITOLAK' || order.status === 'DIBATALKAN'
            ? 'Pengajuan ini tidak dilanjutkan.'
            : 'Project belum mulai dikerjakan. Progres tampil di sini setelah Operasional membentuk tim.'}
        </p>
      )}
    </ProyekInfo>
  );
}
