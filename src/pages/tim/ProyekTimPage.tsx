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
import { addProgress, createTask, getProject, listTasks, listTeamUpdates } from '../../services/projectService';
import type { Bidang, Member, ProjectDetail, Task } from '../../types';
import { BIDANG_LABEL, tanggal, tanggalPendek, TASK_STATUS_LABEL } from '../../utils/format';

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

function TambahTugasModal({ projectId, open, members, onClose, onDone }: { projectId: number; open: boolean; members: Member[]; onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState(emptyTask);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      await createTask(projectId, {
        judul: form.judul,
        deskripsi: form.deskripsi || null,
        bidang: form.bidang,
        bobot: form.bobot,
        assigneeId: form.assigneeId ? Number(form.assigneeId) : null,
        tenggat: form.tenggat || null,
      });
      setForm(emptyTask);
      onDone();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <BrandModal open={open} title="Tambah Tugas" onClose={onClose}>
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
          {saving ? 'Menyimpan...' : 'Tambah Tugas'}
        </button>
      </form>
    </BrandModal>
  );
}

function TaskTable({ tasks, canUpdate, onUpdate }: { tasks: Task[]; canUpdate: (task: Task) => boolean; onUpdate: (task: Task) => void }) {
  if (!tasks.length) return <p className="rounded-2xl bg-white p-5 text-center font-moon text-lg text-coal-deep">Belum ada tugas pada project ini.</p>;
  return (
    <div className="overflow-x-auto rounded-2xl border-[3px] border-coal/15 bg-white">
      <table className="w-full min-w-[720px] font-moon text-base text-coal-deep">
        <thead className="bg-coal text-left text-flame">
          <tr>
            <th className="px-3 py-2 font-normal">Tugas</th>
            <th className="px-3 py-2 font-normal">Bidang</th>
            <th className="px-3 py-2 font-normal">Penanggung jawab</th>
            <th className="px-3 py-2 font-normal">Tenggat</th>
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
              <td className="px-3 py-2">{task.assignee?.name ?? <span className="text-coal-deep/50">Belum ditentukan</span>}</td>
              <td className="px-3 py-2">{tanggalPendek(task.tenggat)}</td>
              <td className="px-3 py-2">
                <span className="flex items-center gap-2">
                  <span className="w-11 text-flame">{task.persentase}%</span>
                  <Bar value={task.persentase} track="bg-coal/15" fill="bg-flame" />
                </span>
              </td>
              <td className="px-3 py-2 text-right">
                {canUpdate(task) && (
                  <button type="button" onClick={() => onUpdate(task)} className="rounded-xl bg-coal px-3 py-1 text-sm text-flame hover:text-cream">
                    Perbarui
                  </button>
                )}
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
              {tanggal(update.createdAt)} · {update.author.name} · {update.task.judul} · {update.persentase}%
            </p>
            {update.catatanKlien && <p className="mt-1 font-moon text-base text-coal-deep">Untuk klien: {update.catatanKlien}</p>}
            {update.catatanTeknis && <p className="mt-1 font-moon text-base text-coal-deep/80">Teknis: {update.catatanTeknis}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Members({ members }: { members: Member[] }) {
  return (
    <div className="mb-6 flex flex-wrap justify-center gap-2">
      {members.map((member) => (
        <span key={member.userId} className={`rounded-xl px-3 py-1 font-moon text-sm ${member.isPm ? 'bg-flame text-coal' : 'bg-coal text-flame'}`}>
          {member.name} · {member.isPm ? 'PM' : member.posisi}
        </span>
      ))}
    </div>
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
  const [adding, setAdding] = useState(false);
  const [version, setVersion] = useState(0);

  if (loading && !project) return <p className="p-10 text-center font-moon text-xl">Memuat...</p>;
  if (error || !project) return <p role="alert" className="p-10 text-center font-moon text-xl text-[#9c2b2b]">{error || 'Project tidak ditemukan.'}</p>;

  const canManage = project.isPm || user.role === 'OPERASIONAL';
  const closed = project.status === 'SELESAI' || project.status === 'DIBATALKAN';
  const canUpdate = (task: Task) => !closed && (canManage || task.assignee?.id === user.id);
  function refresh() {
    void reloadProject();
    void reloadTasks();
    setVersion((value) => value + 1);
  }

  return (
    <div className="-mx-3 sm:-mx-6">
      <ProyekInfo
        title="Detail"
        judul={project.nama}
        deskripsi={project.kebutuhan}
        estimasi={project.targetSelesai ?? project.tenggatDiharapkan}
        anggaran={user.role === 'OPERASIONAL' ? (project.nilai ?? null) : undefined}
        documents={project.documents}
        backTo="/app"
      >
        <Members members={project.members ?? []} />
        <ProgressPanel progres={project.progres} progresBidang={project.progresBidang} />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <p className="font-magic text-2xl uppercase text-flame sm:text-3xl">Daftar Tugas</p>
          {canManage && !closed && (
            <button type="button" onClick={() => setAdding(true)} className={pillButton}>
              + Tambah Tugas
            </button>
          )}
        </div>
        <div className="mt-3">
          <TaskTable tasks={tasks ?? []} canUpdate={canUpdate} onUpdate={setEditing} />
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
      <TambahTugasModal
        projectId={project.id}
        open={adding}
        members={project.members ?? []}
        onClose={() => setAdding(false)}
        onDone={() => {
          setAdding(false);
          refresh();
        }}
      />
    </div>
  );
}
