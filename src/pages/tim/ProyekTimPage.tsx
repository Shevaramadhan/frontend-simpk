import { useCallback, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { BrandError, BrandField, brandInputSolid } from '../../components/brand/Brand';
import BrandModal from '../../components/brand/BrandModal';
import { Bar, BIDANG_ORDER, ProgressPanel } from '../../components/brand/Progress';
import ProyekInfo from '../../components/brand/ProyekInfo';
import { pillButton } from '../../components/brand/StaffParts';
import { useCurrentUser } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { addProgress, createTask, deleteTask, getProject, listTasks, listTeamUpdates, updateProject, updateTask } from '../../services/projectService';
import type { Bidang, Member, ProjectDetail, ProjectStatus, Task } from '../../types';
import { BIDANG_LABEL, PROJECT_STATUS_LABEL, tanggal, tanggalPendek, TASK_STATUS_LABEL } from '../../utils/format';

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
            <input id="t-tenggat" type="date" value={form.tenggat} onChange={(event) => setForm({ ...form, tenggat: event.target.value })} className={brandInputSolid} />
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
  if (!tasks.length) return <p className="rounded-2xl bg-white p-5 text-center font-moon text-lg text-coal-deep">Belum ada tugas pada project ini.</p>;
  return (
    <div className="overflow-x-auto rounded-2xl border-[3px] border-coal/15 bg-white">
      <table className={`w-full ${ringkas ? 'min-w-[480px]' : 'min-w-[720px]'} font-moon text-base text-coal-deep`}>
        <thead className="bg-coal text-left text-flame">
          <tr>
            <th className="px-3 py-2 font-normal">Tugas</th>
            <th className="px-3 py-2 font-normal">Bidang</th>
            {!ringkas && <th className="px-3 py-2 font-normal">Penanggung jawab</th>}
            {!ringkas && <th className="px-3 py-2 font-normal">Tenggat</th>}
            <th className="w-48 px-3 py-2 font-normal">Progres</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-t border-coal/10 align-middle">
              <td className="px-3 py-2">
                <p>{task.judul}</p>
                <p className="text-xs text-coal-deep/60">
                  {TASK_STATUS_LABEL[task.status]} · bobot {task.bobot}
                </p>
              </td>
              <td className="px-3 py-2">{BIDANG_LABEL[task.bidang]}</td>
              {!ringkas && <td className="px-3 py-2">{task.assignee?.name ?? <span className="text-coal-deep/50">Belum ditentukan</span>}</td>}
              {!ringkas && <td className="px-3 py-2">{tanggalPendek(task.tenggat)}</td>}
              <td className="px-3 py-2">
                <span className="flex items-center gap-2">
                  <span className="w-11 text-flame">{task.persentase}%</span>
                  <Bar value={task.persentase} track="bg-coal/15" fill="bg-flame" />
                </span>
              </td>
              <td className="px-3 py-2 text-right">
                <span className="inline-flex flex-wrap justify-end gap-1.5">
                  {canUpdate(task) && (
                    <button type="button" onClick={() => onUpdate(task)} className="rounded-xl bg-coal px-3 py-1 text-sm text-flame hover:text-cream">
                      Perbarui
                    </button>
                  )}
                  {kelola && (
                    <>
                      <button type="button" onClick={() => onEdit(task)} className="rounded-xl border-2 border-coal px-3 py-0.5 text-sm text-coal-deep hover:bg-coal hover:text-flame">
                        Ubah
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(task)}
                        aria-label={`Hapus tugas ${task.judul}`}
                        className="rounded-xl border-2 border-[#9c2b2b] px-3 py-0.5 text-sm text-[#9c2b2b] hover:bg-[#9c2b2b] hover:text-cream"
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
  );
}

function Riwayat({ projectId, version }: { projectId: number; version: number }) {
  // `version` memicu muat ulang setelah progres disimpan.
  const load = useCallback(() => listTeamUpdates(projectId), [projectId, version]);
  const { data } = useData(load);
  if (!data?.length) return null;
  return (
    <div className="mt-8">
      <p className="text-center font-magic text-2xl uppercase text-flame">Riwayat Progres</p>
      <ul className="mt-3 space-y-2">
        {data.slice(0, 10).map((update) => (
          <li key={update.id} className="rounded-2xl border-[3px] border-coal/15 bg-white px-4 py-3">
            <p className="font-moon text-sm text-coal-deep/70">
              {tanggal(update.createdAt)} · {update.author ? `${update.author.name} · ` : ''}
              {update.task.judul} · {update.persentase}%
            </p>
            {update.catatanKlien && <p className="mt-1 font-moon text-base text-coal-deep">Untuk klien: {update.catatanKlien}</p>}
            {update.catatanTeknis && <p className="mt-1 font-moon text-base text-coal-deep/80">Teknis: {update.catatanTeknis}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Peran anggota yang sedang login di project ini, beserta apa yang boleh ia lakukan.
function PeranSaya({ member, jumlahTugas }: { member: Member; jumlahTugas: number }) {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-[22px] bg-coal p-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <p className="font-moon text-sm text-cream/70">Peran Anda di project ini</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-2">
          <span className="font-magic text-2xl uppercase leading-tight text-flame sm:text-3xl">{member.posisi}</span>
          {member.isPm && <span className="rounded-lg bg-flame px-2.5 py-0.5 font-moon text-sm text-coal">Project Manager</span>}
        </p>
        <p className="mt-1 font-moon text-sm text-cream/80">
          {member.isPm
            ? 'Sebagai PM, Anda menambah tugas, membagi tugas ke anggota, dan dapat memperbarui progres semua tugas.'
            : 'Anda memperbarui progres tugas yang ditugaskan kepada Anda.'}
        </p>
      </div>
      <p className="shrink-0 rounded-2xl bg-coal-deep px-4 py-2 text-center font-moon text-cream">
        <span className="block font-magic text-3xl leading-none text-flame">{jumlahTugas}</span>
        <span className="text-sm">tugas Anda</span>
      </p>
    </div>
  );
}

function Members({ members, myId }: { members: Member[]; myId: number }) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-center font-moon text-sm text-coal-deep/70">Susunan tim</p>
      <div className="flex flex-wrap justify-center gap-2">
        {members.map((member) => (
          <span
            key={member.userId}
            className={`rounded-xl px-3 py-1 font-moon text-sm ${member.isPm ? 'bg-flame text-coal' : 'bg-coal text-flame'} ${member.userId === myId ? 'ring-2 ring-coal ring-offset-2 ring-offset-cream' : ''}`}
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
    <form onSubmit={handleSubmit} className="mb-6 rounded-[22px] bg-coal p-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="font-moon text-sm text-flame">
          Status project
          <select value={status} onChange={(event) => setStatus(event.target.value as ProjectStatus)} className="mt-1 block rounded-xl bg-cream px-3 py-2 font-moon text-base text-coal-deep">
            {STATUS_PILIHAN.map((item) => (
              <option key={item} value={item}>
                {PROJECT_STATUS_LABEL[item]}
              </option>
            ))}
          </select>
        </label>
        <label className="font-moon text-sm text-flame">
          Target selesai
          <input type="date" value={target} onChange={(event) => setTarget(event.target.value)} className="mt-1 block rounded-xl bg-cream px-3 py-1.5 font-moon text-base text-coal-deep" />
        </label>
        <button type="submit" disabled={saving || !berubah} className={pillButton}>
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
      <p className="mt-2 font-moon text-xs text-cream/70">Project Selesai atau Dibatalkan tidak menerima progres lagi. Setelah Selesai, klien dapat memberi ulasan.</p>
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

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <p className="font-magic text-2xl uppercase text-flame sm:text-3xl">Daftar Tugas</p>
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
