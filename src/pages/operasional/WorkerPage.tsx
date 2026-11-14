import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { BrandError, BrandField, brandInputSolid } from '../../components/brand/Brand';
import BrandModal from '../../components/brand/BrandModal';
import { Avatar, EmptyState, LoadError, Loading, StaffPanel, pillButton, workerNote } from '../../components/brand/StaffParts';
import PasswordInput from '../../components/PasswordInput';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { createUser, keahlianList, listWorkers, updateUser } from '../../services/userService';
import type { InternalUser } from '../../types';

// Wireframe "Worker" dan "Tambah Worker": Operasional membuat akun Tim (B-29) beserta keahlian utamanya (B-33).
const empty = { name: '', email: '', password: '', keahlian: '' };
const SARAN_KEAHLIAN = ['UI/UX Designer', 'Frontend Developer', 'Backend Developer', 'Fullstack Developer'];

/** Saran keahlian: yang umum ditambah yang sudah pernah diketik Operasional. */
function KeahlianOptions({ id, workers }: { id: string; workers: InternalUser[] }) {
  return (
    <datalist id={id}>
      {keahlianList([...SARAN_KEAHLIAN.map((keahlian) => ({ keahlian })), ...workers]).map((keahlian) => (
        <option key={keahlian} value={keahlian} />
      ))}
    </datalist>
  );
}

function TambahWorker({ open, workers, onClose, onDone }: { open: boolean; workers: InternalUser[]; onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      await createUser({ ...form, role: 'TIM' });
      setForm(empty);
      onDone();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const input = (id: 'name' | 'email', label: string, type: string) => (
    <BrandField id={`w-${id}`} label={label}>
      <input id={`w-${id}`} type={type} required autoComplete="off" minLength={2} value={form[id]} onChange={(event) => setForm({ ...form, [id]: event.target.value })} className={brandInputSolid} />
    </BrandField>
  );

  return (
    <BrandModal open={open} title="Tambah Worker" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {input('name', 'Nama', 'text')}
        <BrandField id="w-keahlian" label="Keahlian (misalnya Frontend Developer)">
          <input id="w-keahlian" list="saran-keahlian" required maxLength={60} autoComplete="off" value={form.keahlian} onChange={(event) => setForm({ ...form, keahlian: event.target.value })} className={brandInputSolid} />
          <KeahlianOptions id="saran-keahlian" workers={workers} />
        </BrandField>
        {input('email', 'Email login', 'email')}
        <BrandField id="w-password" label="Kata sandi awal (minimal 8 karakter)">
          <PasswordInput id="w-password" required minLength={8} autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className={brandInputSolid} />
        </BrandField>
        <p className="mb-3 font-moon text-sm text-coal-deep/70">Sampaikan email dan kata sandi awal kepada anggota. Anggota dapat menggantinya di menu Account.</p>
        <BrandError message={error} />
        <button type="submit" disabled={saving} className={`${pillButton} mt-2 w-full`}>
          {saving ? 'Menyimpan...' : 'Tambah Worker'}
        </button>
      </form>
    </BrandModal>
  );
}

function UbahKeahlian({ worker, workers, onClose, onDone }: { worker: InternalUser | null; workers: InternalUser[]; onClose: () => void; onDone: () => void }) {
  const [value, setValue] = useState('');
  const [lastId, setLastId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Isian diisi ulang setiap kali worker yang dibuka berganti.
  if (worker && worker.id !== lastId) {
    setLastId(worker.id);
    setValue(worker.keahlian ?? '');
    setError('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!worker) return;
    setError('');
    setSaving(true);
    try {
      await updateUser(worker.id, { keahlian: value });
      setLastId(null);
      onDone();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <BrandModal open={worker !== null} title="Ubah Keahlian" onClose={onClose}>
      {worker && (
        <form onSubmit={handleSubmit}>
          <p className="mb-3 font-moon text-lg text-coal-deep">{worker.name}</p>
          <BrandField id="k-keahlian" label="Keahlian">
            <input id="k-keahlian" list="saran-keahlian-ubah" maxLength={60} autoComplete="off" value={value} onChange={(event) => setValue(event.target.value)} className={brandInputSolid} />
            <KeahlianOptions id="saran-keahlian-ubah" workers={workers} />
          </BrandField>
          <BrandError message={error} />
          <button type="submit" disabled={saving} className={`${pillButton} mt-1 w-full`}>
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </form>
      )}
    </BrandModal>
  );
}

export default function WorkerPage() {
  const { data, loading, error, reload } = useData(listWorkers);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<InternalUser | null>(null);
  const workers = data ?? [];

  return (
    <StaffPanel
      title="Worker"
      action={
        <button type="button" onClick={() => setOpen(true)} className={pillButton}>
          + Tambah Worker
        </button>
      }
    >
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <LoadError message={error} />
      ) : !workers.length ? (
        <EmptyState>Belum ada akun worker. Tambahkan anggota tim lewat tombol Tambah Worker.</EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {workers.map((worker, index) => (
            <motion.div
              key={worker.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index, 9) * 0.04 }}
              className="flex items-center gap-3 rounded-[20px] border-[3px] border-flame bg-cream p-3"
            >
              <Avatar />
              <div className="min-w-0 flex-1">
                <p className="truncate font-moon text-xl text-flame">{worker.name}</p>
                <p className="flex flex-wrap items-center gap-x-2 font-moon text-sm">
                  <span className={worker.keahlian ? 'text-coal-deep' : 'text-coal-deep/50'}>{worker.keahlian ?? 'Keahlian belum diisi'}</span>
                  <button type="button" onClick={() => setEditing(worker)} className="text-xs text-flame underline underline-offset-2 hover:text-coal-deep">
                    Ubah
                  </button>
                </p>
                <p className="truncate font-moon text-xs text-coal-deep/60">{worker.email}</p>
                <p className="font-moon text-sm leading-snug">{workerNote(worker.jumlahProject)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <TambahWorker
        open={open}
        workers={workers}
        onClose={() => setOpen(false)}
        onDone={() => {
          setOpen(false);
          void reload();
        }}
      />
      <UbahKeahlian
        worker={editing}
        workers={workers}
        onClose={() => setEditing(null)}
        onDone={() => {
          setEditing(null);
          void reload();
        }}
      />
    </StaffPanel>
  );
}
