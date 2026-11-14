import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, useParams } from 'react-router-dom';
import ikonSegitiga from '../../assets/staff/ikon-segitiga.svg';
import { BrandError } from '../../components/brand/Brand';
import { ProgressPanel } from '../../components/brand/Progress';
import ProyekInfo from '../../components/brand/ProyekInfo';
import { Avatar, pillButton, workerNote } from '../../components/brand/StaffParts';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { getOrder } from '../../services/orderService';
import { createProject, getProject, replaceMembers, type MemberInput } from '../../services/projectService';
import { listWorkers } from '../../services/userService';

// Figma "Detail Page Operational": Operasional memilih worker dan menandai satu PM.
export const POSISI = ['Project Manager', 'UI/UX Designer', 'Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'Quality Assurance'];

type Filter = 'SEMUA' | 'BARU' | 'BERPENGALAMAN';
const FILTER_LABEL: Record<Filter, string> = { SEMUA: 'Semua', BARU: 'Belum pernah', BERPENGALAMAN: 'Sudah pernah' };

export default function PilihWorkerPage() {
  const orderId = Number(useParams().orderId);
  const loadOrder = useCallback(() => getOrder(orderId), [orderId]);
  const { data: order, loading, error, reload } = useData(loadOrder);
  const { data: workers } = useData(listWorkers);

  const [team, setTeam] = useState<MemberInput[]>([]);
  const [filter, setFilter] = useState<Filter>('SEMUA');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ error: '', done: '' });

  const projectId = order?.project?.id;
  // Susunan tim yang sudah tersimpan dimuat sebagai pilihan awal.
  useEffect(() => {
    if (!projectId) return;
    let alive = true;
    void getProject(projectId).then((project) => {
      if (alive) setTeam((project.members ?? []).map(({ userId, posisi, isPm }) => ({ userId, posisi, isPm })));
    });
    return () => {
      alive = false;
    };
  }, [projectId]);

  const names = useMemo(() => new Map((workers ?? []).map((worker) => [worker.id, worker.name])), [workers]);
  const shown = (workers ?? []).filter((worker) =>
    filter === 'SEMUA' ? true : filter === 'BARU' ? worker.jumlahProject === 0 : worker.jumlahProject > 0,
  );

  function toggle(userId: number) {
    setMessage({ error: '', done: '' });
    setTeam((current) =>
      current.some((member) => member.userId === userId)
        ? current.filter((member) => member.userId !== userId)
        : [...current, { userId, posisi: current.length ? 'Frontend Developer' : 'Project Manager', isPm: current.length === 0 }],
    );
  }

  function patch(userId: number, change: Partial<MemberInput>) {
    setTeam((current) =>
      current.map((member) =>
        member.userId === userId ? { ...member, ...change } : change.isPm ? { ...member, isPm: false } : member,
      ),
    );
  }

  async function save() {
    if (!order) return;
    if (!team.length) return setMessage({ error: 'Pilih minimal satu worker.', done: '' });
    if (team.filter((member) => member.isPm).length !== 1) return setMessage({ error: 'Tandai tepat satu worker sebagai PM.', done: '' });
    setSaving(true);
    setMessage({ error: '', done: '' });
    try {
      if (projectId) await replaceMembers(projectId, team);
      else await createProject({ orderId: order.id, nama: order.judul || order.nomor, members: team });
      await reload();
      setMessage({ error: '', done: 'Tim project tersimpan.' });
    } catch (err) {
      setMessage({ error: errorMessage(err), done: '' });
    } finally {
      setSaving(false);
    }
  }

  if (loading && !order) return <p className="p-10 text-center font-moon text-xl">Memuat...</p>;
  if (error || !order) return <p role="alert" className="p-10 text-center font-moon text-xl text-[#9c2b2b]">{error || 'Pengajuan tidak ditemukan.'}</p>;
  const closed = order.project?.status === 'SELESAI' || order.project?.status === 'DIBATALKAN';

  return (
    <div className="-mx-3 sm:-mx-6">
      <ProyekInfo title="Detail" judul={order.judul || order.nomor} deskripsi={order.kebutuhan} estimasi={order.tenggatDiharapkan} anggaran={order.nilaiDisepakati} documents={order.documents} backTo="/app">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-magic text-2xl uppercase text-flame sm:text-3xl">Pilih Worker</p>
          {order.project && (
            <Link to={`/app/proyek/${order.project.id}`} className="font-moon text-base text-flame underline underline-offset-4">
              Lihat tugas project
            </Link>
          )}
        </div>

        {/* Slot worker terpilih beserta posisi dan tanda PM. */}
        <div className="mt-3 rounded-[20px] bg-coal p-3">
          {team.length === 0 ? (
            <p className="py-3 text-center font-moon text-base text-cream/70">Belum ada worker dipilih. Klik kartu worker di bawah.</p>
          ) : (
            <ul className="grid gap-3 lg:grid-cols-2">
              <AnimatePresence initial={false}>
                {team.map((member) => (
                  <motion.li key={member.userId} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-3 rounded-[16px] bg-coal-deep p-2">
                    <Avatar size="size-12" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-moon text-base text-flame">{names.get(member.userId) ?? `Worker #${member.userId}`}</p>
                      <select
                        aria-label="Posisi"
                        value={member.posisi}
                        onChange={(event) => patch(member.userId, { posisi: event.target.value })}
                        className="mt-1 w-full rounded-lg bg-cream px-2 py-1 font-moon text-sm text-coal-deep"
                      >
                        {POSISI.map((posisi) => (
                          <option key={posisi}>{posisi}</option>
                        ))}
                      </select>
                    </div>
                    <label className={`cursor-pointer rounded-xl px-3 py-1 font-moon text-sm ${member.isPm ? 'bg-flame text-coal' : 'border-2 border-flame text-flame'}`}>
                      <input type="radio" name="pm" className="sr-only" checked={member.isPm} onChange={() => patch(member.userId, { isPm: true })} />
                      PM
                    </label>
                    <button type="button" onClick={() => toggle(member.userId)} aria-label="Keluarkan" className="px-1 font-magic text-xl text-cream/70 hover:text-flame">
                      ×
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="relative inline-flex items-center">
            <span className="sr-only">Saring worker</span>
            <select value={filter} onChange={(event) => setFilter(event.target.value as Filter)} className="appearance-none rounded-[24px] bg-coal py-2 pl-5 pr-10 font-moon text-lg text-flame">
              {(Object.keys(FILTER_LABEL) as Filter[]).map((key) => (
                <option key={key} value={key}>
                  {FILTER_LABEL[key]}
                </option>
              ))}
            </select>
            <img alt="" src={ikonSegitiga} className="pointer-events-none absolute right-4 h-3 w-3" />
          </label>
          <button type="button" onClick={() => void save()} disabled={saving || closed} className={pillButton}>
            {saving ? 'Menyimpan...' : order.project ? 'Simpan Worker' : 'Tambah Worker'}
          </button>
          {message.done && <span role="status" className="font-moon text-base text-[#14aa00]">{message.done}</span>}
        </div>
        <BrandError message={message.error} />

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((worker) => {
            const picked = team.some((member) => member.userId === worker.id);
            return (
              <button
                key={worker.id}
                type="button"
                aria-pressed={picked}
                onClick={() => toggle(worker.id)}
                className={`flex items-center gap-3 rounded-[20px] bg-coal p-3 text-left transition ${picked ? 'ring-4 ring-flame' : 'hover:-translate-y-0.5'}`}
              >
                <Avatar size="size-14" />
                <span className="min-w-0">
                  <span className="block truncate font-moon text-lg text-flame">{worker.name}</span>
                  <span className="block font-moon text-xs leading-snug">{workerNote(worker.jumlahProject)}</span>
                </span>
              </button>
            );
          })}
          {workers && shown.length === 0 && <p className="font-moon text-base text-coal-deep/70">Tidak ada worker pada saringan ini.</p>}
        </div>

        {order.project && (
          <div className="mt-8">
            <ProgressPanel progres={order.project.progres} progresBidang={order.project.progresBidang} />
          </div>
        )}
      </ProyekInfo>
    </div>
  );
}
