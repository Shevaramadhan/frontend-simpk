import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, useParams } from 'react-router-dom';
import ikonSegitiga from '../../assets/staff/ikon-segitiga.svg';
import { BrandError } from '../../components/brand/Brand';
import Pagination, { usePagination } from '../../components/brand/Pagination';
import { ProgressPanel } from '../../components/brand/Progress';
import OrderComments from '../../components/brand/OrderComments';
import ProyekInfo from '../../components/brand/ProyekInfo';
import { Avatar, pillButton, workerNote } from '../../components/brand/StaffParts';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { getOrder } from '../../services/orderService';
import { createProject, getProject, replaceMembers, type MemberInput } from '../../services/projectService';
import { keahlianList, listWorkers } from '../../services/userService';

// Figma "Detail Page Operational": Operasional memilih worker dan menandai satu PM.
// Saringan "Semua" menyaring per keahlian worker; posisi di project terisi dari keahlian dan tetap dapat diubah.
const POSISI = ['UI/UX Designer', 'Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'Quality Assurance'];
const SEMUA = '';
const TANPA_KEAHLIAN = '__kosong';

export default function PilihWorkerPage() {
  const orderId = Number(useParams().orderId);
  const loadOrder = useCallback(() => getOrder(orderId), [orderId]);
  const { data: order, loading, error, reload } = useData(loadOrder);
  const { data: workers } = useData(listWorkers);

  const [team, setTeam] = useState<MemberInput[]>([]);
  const [filter, setFilter] = useState(SEMUA);
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

  const byId = useMemo(() => new Map((workers ?? []).map((worker) => [worker.id, worker])), [workers]);
  const keahlian = useMemo(() => keahlianList(workers ?? []), [workers]);
  const adaTanpaKeahlian = (workers ?? []).some((worker) => !worker.keahlian);
  const shown = (workers ?? []).filter((worker) =>
    filter === SEMUA
      ? true
      : filter === TANPA_KEAHLIAN
        ? !worker.keahlian
        : worker.keahlian?.toLowerCase() === filter.toLowerCase(),
  );
  const { paged: pagedWorkers, page: workerPage, totalPages: workerTotalPages, setPage: setWorkerPage } = usePagination(shown, 6);

  function toggle(userId: number) {
    setMessage({ error: '', done: '' });
    const posisi = byId.get(userId)?.keahlian || 'Anggota Tim';
    setTeam((current) =>
      current.some((member) => member.userId === userId)
        ? current.filter((member) => member.userId !== userId)
        : [...current, { userId, posisi, isPm: current.length === 0 }],
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
          <p className="font-magic text-base font-bold text-zinc-900 sm:text-lg">Pilih Worker</p>
          {order.project && (
            <Link to={`/app/proyek/${order.project.id}`} className="font-moon text-xs font-semibold text-flame underline underline-offset-4 sm:text-sm">
              Lihat tugas project →
            </Link>
          )}
        </div>

        <datalist id="saran-posisi">
          {keahlianList([...POSISI.map((posisi) => ({ keahlian: posisi })), ...(workers ?? [])]).map((posisi) => (
            <option key={posisi} value={posisi} />
          ))}
        </datalist>
        {/* Slot worker terpilih beserta posisi dan tanda PM. */}
        <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50/70 p-3">
          {team.length === 0 ? (
            <p className="py-3 text-center font-moon text-sm text-zinc-500">Belum ada worker dipilih. Klik kartu worker di bawah.</p>
          ) : (
            <ul className="grid gap-2.5 lg:grid-cols-2">
              <AnimatePresence initial={false}>
                {team.map((member) => (
                  <motion.li key={member.userId} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-2.5 shadow-2xs">
                    <Avatar size="size-11" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-moon text-sm font-semibold text-zinc-900">{byId.get(member.userId)?.name ?? `Worker #${member.userId}`}</p>
                      <input
                        aria-label="Posisi di project"
                        list="saran-posisi"
                        required
                        minLength={2}
                        maxLength={60}
                        value={member.posisi}
                        onChange={(event) => patch(member.userId, { posisi: event.target.value })}
                        className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-moon text-xs text-zinc-800 outline-none focus:border-flame"
                      />
                    </div>
                    <label className={`cursor-pointer rounded-lg px-2.5 py-1 font-moon text-xs font-semibold transition-colors ${member.isPm ? 'bg-flame text-white' : 'border border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-flame/40'}`}>
                      <input type="radio" name="pm" className="sr-only" checked={member.isPm} onChange={() => patch(member.userId, { isPm: true })} />
                      PM
                    </label>
                    <button type="button" onClick={() => toggle(member.userId)} aria-label="Keluarkan" className="px-1.5 text-lg text-zinc-400 hover:text-red-600">
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
            <select
              value={filter}
              onChange={(event) => {
                setFilter(event.target.value);
                setWorkerPage(1);
              }}
              className="appearance-none rounded-xl border border-zinc-200 bg-white py-2 pl-3.5 pr-9 font-moon text-sm font-medium text-zinc-700 shadow-2xs outline-none focus:border-flame"
            >
              <option value={SEMUA}>Semua Keahlian</option>
              {keahlian.map((nama) => (
                <option key={nama} value={nama}>
                  {nama}
                </option>
              ))}
              {adaTanpaKeahlian && <option value={TANPA_KEAHLIAN}>Keahlian belum diisi</option>}
            </select>
            <img alt="" src={ikonSegitiga} className="pointer-events-none absolute right-3 h-2.5 w-2.5 opacity-60" />
          </label>
          <button type="button" onClick={() => void save()} disabled={saving || closed} className={pillButton}>
            {saving ? 'Menyimpan...' : order.project ? 'Simpan Worker' : 'Tambah Worker'}
          </button>
          {message.done && <span role="status" className="font-moon text-sm font-medium text-emerald-600">{message.done}</span>}
        </div>
        <BrandError message={message.error} />

        <div className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {pagedWorkers.map((worker) => {
            const picked = team.some((member) => member.userId === worker.id);
            return (
              <button
                key={worker.id}
                type="button"
                aria-pressed={picked}
                onClick={() => toggle(worker.id)}
                className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                  picked ? 'border-flame bg-flame/5 ring-2 ring-flame/20' : 'border-zinc-200 bg-zinc-50/60 hover:border-flame/40 hover:bg-white'
                }`}
              >
                <Avatar size="size-11" />
                <span className="min-w-0">
                  <span className="block truncate font-moon text-sm font-semibold text-zinc-900">{worker.name}</span>
                  <span className="block truncate font-moon text-xs text-zinc-500">{worker.keahlian ?? 'Keahlian belum diisi'}</span>
                  <span className="block font-moon text-xs leading-snug">{workerNote(worker.jumlahProject)}</span>
                </span>
              </button>
            );
          })}
          {workers && shown.length === 0 && <p className="font-moon text-sm text-zinc-500">Tidak ada worker pada saringan ini.</p>}
        </div>
        <Pagination page={workerPage} totalPages={workerTotalPages} onPageChange={setWorkerPage} tone="light" />

        {order.project && (
          <div className="mt-8">
            <ProgressPanel progres={order.project.progres} progresBidang={order.project.progresBidang} />
          </div>
        )}
        <OrderComments
          orderId={order.id}
          canSend={order.status !== 'DITOLAK' && order.status !== 'DIBATALKAN' && order.project?.status !== 'DIBATALKAN'}
        />
      </ProyekInfo>
    </div>
  );
}
