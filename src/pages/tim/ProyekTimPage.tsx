import { useCallback, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { BrandError, BrandField, brandInputSolid } from '../../components/brand/Brand';
import BrandModal from '../../components/brand/BrandModal';
import { Bar, BIDANG_ORDER, ProgressPanel } from '../../components/brand/Progress';
import OrderComments from '../../components/brand/OrderComments';
import Pagination, { usePagination } from '../../components/brand/Pagination';
import ProyekInfo from '../../components/brand/ProyekInfo';
import { pillButton } from '../../components/brand/StaffParts';
import { useCurrentUser } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { addProgress, createTask, deleteTask, getProject, listTasks, listTeamUpdates, updateProject, updateTask } from '../../services/projectService';
import type { Bidang, Member, ProjectDetail, ProjectStatus, Task } from '../../types';
import { BIDANG_LABEL, PROJECT_STATUS_LABEL, tanggal, tanggalPendek, TASK_STATUS_LABEL } from '../../utils/format';
import DateInput from '../../components/DateInput';

// Detail project untuk Tim (dan Operasional): bergaya halaman Detail klien, ditambah tabel tugas.
// PM membuat tugas; anggota memperbarui progres tugas miliknya. Catatan teknis hanya untuk tim (REQ-F05).

const textarea = `${brandInputSolid} min-h-24 resize-y`;

function PerbaruiModal({ projectId, task, onClose, onDone }: { projectId: number; task: Task | null; onClose: () => void; onDone: () => void }) {
  const [persen, setPersen] = useState(0);
  const [catatanKlien, setCatatanKlien] = useState('');
  const [catatanTeknis, setCatatanTeknis] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastId, setLastId] = useState<number | null>(null);

  // Isian diisi ulang setiap kali tugas yang dibuka berganti.
  if (task && task.id !== lastId) {
    setLastId(task.id);
    setPersen(task.persentase);
    setCatatanKlien('');
    setCatatanTeknis('');
    setError('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!task) return;
    setError('');
    setSaving(true);
    try {
      await addProgress(projectId, task.id, { persentase: persen, catatanKlien, catatanTeknis });
      setLastId(null);
      onDone();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <BrandModal open={task !== null} title="Perbarui Progres" onClose={onClose}>
      {task && (
        <form onSubmit={handleSubmit}>
          <p className="mb-3 font-moon text-lg text-coal-deep">{task.judul}</p>
          <BrandField id="p-persen" label={`Persentase selesai: ${persen}%`}>
            <input id="p-persen" type="range" min={0} max={100} step={5} value={persen} onChange={(event) => setPersen(Number(event.target.value))} className="mt-2 w-full accent-[#ff6200]" />
          </BrandField>
          <BrandField id="p-klien" label="Catatan untuk klien (tampil di halaman Detail klien)">
            <textarea id="p-klien" maxLength={5000} value={catatanKlien} onChange={(event) => setCatatanKlien(event.target.value)} className={textarea} />
          </BrandField>
          <BrandField id="p-teknis" label="Catatan teknis (hanya untuk tim)">
            <textarea id="p-teknis" maxLength={5000} value={catatanTeknis} onChange={(event) => setCatatanTeknis(event.target.value)} className={textarea} />
          </BrandField>
          <BrandError message={error} />
          <button type="submit" disabled={saving} className={`${pillButton} w-full`}>
            {saving ? 'Menyimpan...' : 'Simpan Progres'}
          </button>
        </form>
      )}
    </BrandModal>
  );
}

const emptyTask = { judul: '', deskripsi: '', bidang: 'FRONTEND' as Bidang, bobot: 1, assigneeId: '', tenggat: '' };

// Tambah tugas baru, atau ubah tugas yang ada bila `task` diisi (PM dan Operasional).
// Persentase tidak diubah di sini; progres tetap lewat tombol Perbarui agar tercatat di riwayat.
function TugasModal({ projectId, task, open, members, onClose, onDone }: { projectId: number; task: Task | null; open: boolean; members: Member[]; onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState(
    task
      ? { judul: task.judul, deskripsi: task.deskripsi ?? '', bidang: task.bidang, bobot: task.bobot, assigneeId: task.assignee ? String(task.assignee.id) : '', tenggat: task.tenggat?.slice(0, 10) ?? '' }
      : emptyTask,
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const ubah = task !== null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSaving(true);
    const data = {
      judul: form.judul,
      deskripsi: form.deskripsi || null,
      bidang: form.bidang,
      bobot: form.bobot,
      assigneeId: form.assigneeId ? Number(form.assigneeId) : null,
      tenggat: form.tenggat || null,
    };
    try {
      if (task) await updateTask(projectId, task.id, data);
      else await createTask(projectId, data);
      setForm(emptyTask);
      onDone();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <BrandModal open={open} title={ubah ? 'Ubah Tugas' : 'Tambah Tugas'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <BrandField id="t-judul" label="Judul tugas">
          <input id="t-judul" required minLength={3} maxLength={200} value={form.judul} onChange={(event) => setForm({ ...form, judul: event.target.value })} className={brandInputSolid} />
        </BrandField>
        <BrandField id="t-deskripsi" label="Deskripsi (opsional)">
          <textarea id="t-deskripsi" maxLength={5000} value={form.deskripsi} onChange={(event) => setForm({ ...form, deskripsi: event.target.value })} className={textarea} />
        </BrandField>
        <div className="grid gap-x-3 sm:grid-cols-2">
          <BrandField id="t-bidang" label="Bidang">
            <select id="t-bidang" value={form.bidang} onChange={(event) => setForm({ ...form, bidang: event.target.value as Bidang })} className={brandInputSolid}>
              {BIDANG_ORDER.map((bidang) => (
                <option key={bidang} value={bidang}>
                  {BIDANG_LABEL[bidang]}
                </option>
              ))}
            </select>
          </BrandField>
          <BrandField id="t-bobot" label="Bobot (1-10)">
            <input id="t-bobot" type="number" min={1} max={10} required value={form.bobot} onChange={(event) => setForm({ ...form, bobot: Number(event.target.value) })} className={brandInputSolid} />
          </BrandField>
          <BrandField id="t-assignee" label="Penanggung jawab">
            <select id="t-assignee" value={form.assigneeId} onChange={(event) => setForm({ ...form, assigneeId: event.target.value })} className={brandInputSolid}>
              <option value="">Belum ditentukan</option>
              {members.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.name} ({member.posisi})
                </option>
              ))}
            </select>
          </BrandField>
          <BrandField id="t-tenggat" label="Tenggat (opsional)">
            <DateInput id="t-tenggat" value={form.tenggat} onChange={(event) => setForm({ ...form, tenggat: event.target.value })} className={brandInputSolid} />
          </BrandField>
        </div>
        <p className="mb-3 font-moon text-sm text-coal-deep/70">Bobot menentukan seberapa besar tugas ini memengaruhi progres bidangnya.</p>
        <BrandError message={error} />
        <button type="submit" disabled={saving} className={`${pillButton} w-full`}>
          {saving ? 'Menyimpan...' : ubah ? 'Simpan Perubahan' : 'Tambah Tugas'}
        </button>
      </form>
    </BrandModal>
  );
}

// `ringkas`: Marketing hanya menerima ringkasan tugas (B-26), tanpa penanggung jawab dan tenggat.
// `kelola`: PM dan Operasional dapat mengubah dan menghapus tugas.
function TaskTable({
  tasks,
  ringkas,
  kelola,
  canUpdate,
  onUpdate,
  onEdit,
  onDelete,
}: {
  tasks: Task[];
  ringkas: boolean;
  kelola: boolean;
  canUpdate: (task: Task) => boolean;
  onUpdate: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  const { paged, page, totalPages, setPage } = usePagination(tasks, 5);
  if (!tasks.length) return <p className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-5 text-center font-moon text-sm text-zinc-500">Belum ada tugas pada project ini.</p>;
  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className={`w-full ${ringkas ? 'min-w-[480px]' : 'min-w-[720px]'} font-moon text-sm text-zinc-700`}>
          <thead className="border-b border-zinc-200 bg-zinc-50/80 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-3.5 py-2.5">Tugas</th>
              <th className="px-3.5 py-2.5">Bidang</th>
              {!ringkas && <th className="px-3.5 py-2.5">Penanggung jawab</th>}
              {!ringkas && <th className="px-3.5 py-2.5">Tenggat</th>}
              <th className="w-48 px-3.5 py-2.5">Progres</th>
              <th className="px-3.5 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {paged.map((task) => (
              <tr key={task.id} className="align-middle hover:bg-zinc-50/70">
                <td className="px-3.5 py-2.5">
                  <p className="font-semibold text-zinc-900">{task.judul}</p>
                  <p className="text-xs text-zinc-500">
                    {TASK_STATUS_LABEL[task.status]} · bobot {task.bobot}
                  </p>
                </td>
                <td className="px-3.5 py-2.5">{BIDANG_LABEL[task.bidang]}</td>
                {!ringkas && <td className="px-3.5 py-2.5">{task.assignee?.name ?? <span className="text-zinc-400">Belum ditentukan</span>}</td>}
                {!ringkas && <td className="px-3.5 py-2.5">{tanggalPendek(task.tenggat)}</td>}
                <td className="px-3.5 py-2.5">
                  <span className="flex items-center gap-2">
                    <span className="w-10 font-semibold text-flame">{task.persentase}%</span>
                    <Bar value={task.persentase} track="bg-zinc-200/80" fill={task.persentase === 100 ? 'bg-emerald-500' : 'bg-flame'} />
                  </span>
                </td>
                <td className="px-3.5 py-2.5 text-right">
                  <span className="inline-flex flex-wrap justify-end gap-1.5">
                    {canUpdate(task) && (
                      <button type="button" onClick={() => onUpdate(task)} className="rounded-lg bg-flame px-3 py-1 text-xs font-semibold text-white hover:bg-[#e05600]">
                        Perbarui
                      </button>
                    )}
                    {kelola && (
                      <>
                        <button type="button" onClick={() => onEdit(task)} className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:border-flame/40 hover:text-flame">
                          Ubah
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(task)}
                          aria-label={`Hapus tugas ${task.judul}`}
                          className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                        >
                          Hapus
                        </button>
                      </>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} tone="light" className="mt-3" />
    </>
  );
}

function Riwayat({ projectId, version }: { projectId: number; version: number }) {
  const load = useCallback(() => listTeamUpdates(projectId), [projectId, version]);
  const { data } = useData(load);
  const { paged, page, totalPages, setPage } = usePagination(data ?? [], 3);
  if (!data?.length) return null;
  return (
    <div className="mt-6 border-t border-zinc-100 pt-5">
      <p className="font-magic text-base font-bold text-zinc-900 sm:text-lg">Riwayat Progres</p>
      <ul className="mt-3 space-y-2">
        {paged.map((update) => (
          <li key={update.id} className="rounded-xl border border-zinc-200 bg-zinc-50/60 px-4 py-3">
            <p className="font-moon text-xs text-zinc-500">
              {tanggal(update.createdAt)} · {update.author ? `${update.author.name} · ` : ''}
              {update.task.judul} · <span className="font-semibold text-flame">{update.persentase}%</span>
            </p>
            {update.catatanKlien && <p className="mt-1 font-moon text-sm text-zinc-800">Untuk klien: {update.catatanKlien}</p>}
            {update.catatanTeknis && <p className="mt-1 font-moon text-sm text-zinc-600">Teknis: {update.catatanTeknis}</p>}
          </li>
        ))}
      </ul>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} tone="light" className="mt-3" />
    </div>
  );
}

function PeranSaya({ member, jumlahTugas }: { member: Member; jumlahTugas: number }) {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <p className="font-moon text-xs text-zinc-500">Peran Anda di project ini</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-2">
          <span className="font-magic text-base font-bold text-zinc-900 sm:text-lg">{member.posisi}</span>
          {member.isPm && <span className="rounded-md bg-flame px-2 py-0.5 font-moon text-xs font-semibold text-white">Project Manager</span>}
        </p>
        <p className="mt-1 font-moon text-xs text-zinc-600">
          {member.isPm
            ? 'Sebagai PM, Anda menambah tugas, membagi tugas ke anggota, dan dapat memperbarui progres semua tugas.'
            : 'Anda memperbarui progres tugas yang ditugaskan kepada Anda.'}
        </p>
      </div>
      <p className="shrink-0 rounded-xl border border-flame/20 bg-white px-4 py-2 text-center font-moon text-zinc-700 shadow-2xs">
        <span className="block font-magic text-2xl font-bold leading-none text-flame">{jumlahTugas}</span>
        <span className="text-xs text-zinc-500">tugas Anda</span>
      </p>
    </div>
  );
}

function Members({ members, myId }: { members: Member[]; myId: number }) {
  return (
    <div className="mb-5">
      <p className="mb-2 font-moon text-xs font-medium text-zinc-500">Susunan tim</p>
      <div className="flex flex-wrap gap-2">
        {members.map((member) => (
          <span
            key={member.userId}
            className={`rounded-lg border px-3 py-1 font-moon text-xs font-medium ${
              member.isPm ? 'border-flame/30 bg-flame/10 text-flame' : 'border-zinc-200 bg-zinc-50 text-zinc-700'
            } ${member.userId === myId ? 'ring-2 ring-flame/30' : ''}`}
          >
            {member.name}
            {member.userId === myId && ' (Anda)'} · {member.posisi}
            {member.isPm && ' · PM'}
          </span>
        ))}
      </div>
    </div>
  );
}

// Operasional menetapkan target selesai dan status project; Selesai membuka ulasan untuk klien.
const STATUS_PILIHAN: ProjectStatus[] = ['PERSIAPAN', 'BERJALAN', 'DITUNDA', 'SELESAI', 'DIBATALKAN'];

function StatusProject({ project, onSaved }: { project: ProjectDetail; onSaved: () => void }) {
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [target, setTarget] = useState(project.targetSelesai?.slice(0, 10) ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const berubah = status !== project.status || target !== (project.targetSelesai?.slice(0, 10) ?? '');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'SELESAI' && project.progres < 100 && !window.confirm(`Progres baru ${project.progres}%. Tetap tandai project Selesai?`)) return;
    setError('');
    setSaving(true);
    try {
      await updateProject(project.id, { status, targetSelesai: target || null });
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-5 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="font-moon text-xs font-semibold text-zinc-700">
          Status project
          <select value={status} onChange={(event) => setStatus(event.target.value as ProjectStatus)} className="mt-1 block rounded-xl border border-zinc-300 bg-white px-3 py-2 font-moon text-sm text-zinc-900">
            {STATUS_PILIHAN.map((item) => (
              <option key={item} value={item}>
                {PROJECT_STATUS_LABEL[item]}
              </option>
            ))}
          </select>
        </label>
        <label className="font-moon text-xs font-semibold text-zinc-700">
          Target selesai
          <DateInput value={target} onChange={(event) => setTarget(event.target.value)} className="mt-1 block rounded-xl border border-zinc-300 bg-white px-3 py-1.5 font-moon text-sm text-zinc-900" />
        </label>
        <button type="submit" disabled={saving || !berubah} className={pillButton}>
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
      <p className="mt-2 font-moon text-xs text-zinc-500">Project Selesai atau Dibatalkan tidak menerima progres lagi. Setelah Selesai, klien dapat memberi ulasan.</p>
      <BrandError message={error} />
    </form>
  );
}

export default function ProyekTimPage() {
  const projectId = Number(useParams().projectId);
  const user = useCurrentUser();
  const loadProject = useCallback(() => getProject(projectId), [projectId]);
  const loadTasks = useCallback(() => listTasks(projectId), [projectId]);
  const { data: project, loading, error, reload: reloadProject } = useData<ProjectDetail>(loadProject);
  const { data: tasks, reload: reloadTasks } = useData(loadTasks);
  const [editing, setEditing] = useState<Task | null>(null);
  // null = jendela tugas tertutup; { task: null } = tambah; { task } = ubah.
  const [formTugas, setFormTugas] = useState<{ task: Task | null } | null>(null);
  const [hapusError, setHapusError] = useState('');
  const [version, setVersion] = useState(0);

  if (loading && !project) return <p className="p-10 text-center font-moon text-xl">Memuat...</p>;
  if (error || !project) return <p role="alert" className="p-10 text-center font-moon text-xl text-[#9c2b2b]">{error || 'Project tidak ditemukan.'}</p>;

  const canManage = project.isPm || user.role === 'OPERASIONAL';
  const saya = project.members?.find((member) => member.userId === user.id);
  const closed = project.status === 'SELESAI' || project.status === 'DIBATALKAN';
  const canUpdate = (task: Task) => !closed && (canManage || task.assignee?.id === user.id);
  function refresh() {
    void reloadProject();
    void reloadTasks();
    setVersion((value) => value + 1);
  }

  async function hapusTugas(task: Task) {
    const riwayat = task.persentase > 0 ? ' Riwayat progresnya ikut terhapus dan progres project dihitung ulang.' : '';
    if (!window.confirm(`Hapus tugas "${task.judul}"?${riwayat}`)) return;
    setHapusError('');
    try {
      await deleteTask(project!.id, task.id);
      refresh();
    } catch (err) {
      setHapusError(errorMessage(err));
    }
  }

  return (
    <div className="-mx-3 sm:-mx-6">
      <ProyekInfo
        title="Detail"
        judul={project.nama}
        deskripsi={project.kebutuhan}
        estimasi={project.targetSelesai ?? project.tenggatDiharapkan}
        anggaran={user.role === 'TIM' ? undefined : (project.nilai ?? null)}
        documents={project.documents}
        backTo={user.role === 'MARKETING' ? '/app/projek' : '/app'}
      >
        <p className="mb-3 text-center font-moon text-sm text-coal-deep/70">
          {project.klien} · {project.kode} · {PROJECT_STATUS_LABEL[project.status]}
        </p>
        {user.role === 'OPERASIONAL' && <StatusProject key={`${project.status}-${project.targetSelesai}`} project={project} onSaved={refresh} />}
        {saya && <PeranSaya member={saya} jumlahTugas={(tasks ?? []).filter((task) => task.assignee?.id === user.id).length} />}
        <Members members={project.members ?? []} myId={user.id} />
        <ProgressPanel progres={project.progres} progresBidang={project.progresBidang} />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-5">
          <p className="font-magic text-base font-bold text-zinc-900 sm:text-lg">Daftar Tugas</p>
          {canManage && !closed && (
            <button type="button" onClick={() => setFormTugas({ task: null })} className={pillButton}>
              + Tambah Tugas
            </button>
          )}
        </div>
        <div className="mt-3">
          <BrandError message={hapusError} />
          <TaskTable
            tasks={tasks ?? []}
            ringkas={user.role === 'MARKETING'}
            kelola={canManage && !closed}
            canUpdate={canUpdate}
            onUpdate={setEditing}
            onEdit={(task) => setFormTugas({ task })}
            onDelete={(task) => void hapusTugas(task)}
          />
        </div>
        <Riwayat projectId={project.id} version={version} />
        <OrderComments orderId={project.orderId} canSend={project.status !== 'DIBATALKAN'} />
      </ProyekInfo>

      <PerbaruiModal
        projectId={project.id}
        task={editing}
        onClose={() => setEditing(null)}
        onDone={() => {
          setEditing(null);
          refresh();
        }}
      />
      {/* key memastikan isian terisi ulang setiap kali tugas yang dibuka berganti. */}
      <TugasModal
        key={formTugas?.task?.id ?? 'baru'}
        projectId={project.id}
        task={formTugas?.task ?? null}
        open={formTugas !== null}
        members={project.members ?? []}
        onClose={() => setFormTugas(null)}
        onDone={() => {
          setFormTugas(null);
          refresh();
        }}
      />
    </div>
  );
}
