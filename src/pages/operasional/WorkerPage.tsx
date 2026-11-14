import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { BrandError, BrandField, brandInputSolid } from '../../components/brand/Brand';
import BrandModal from '../../components/brand/BrandModal';
import { Avatar, EmptyState, LoadError, Loading, StaffPanel, pillButton, workerNote } from '../../components/brand/StaffParts';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { createUser, listWorkers } from '../../services/userService';
import PasswordInput from '../../components/PasswordInput';

// Wireframe "Worker" dan "Tambah Worker": Operasional membuat akun Tim (B-29: akun internal dibuat Operasional).
const empty = { name: '', email: '', password: '' };

function TambahWorker({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: () => void }) {
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

  const input = (id: keyof typeof empty, label: string, type: string, autoComplete: string) => (
    <BrandField id={`w-${id}`} label={label}>
      {type === 'password' ? (
        <PasswordInput id={`w-${id}`} required autoComplete={autoComplete} minLength={8} value={form[id]} onChange={(event) => setForm({ ...form, [id]: event.target.value })} className={brandInputSolid} />
      ) : (
        <input id={`w-${id}`} type={type} required autoComplete={autoComplete} minLength={2} value={form[id]} onChange={(event) => setForm({ ...form, [id]: event.target.value })} className={brandInputSolid} />
      )}
    </BrandField>
  );

  return (
    <BrandModal open={open} title="Tambah Worker" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {input('name', 'Nama', 'text', 'off')}
        {input('email', 'Email login', 'email', 'off')}
        {input('password', 'Kata sandi awal (minimal 8 karakter)', 'password', 'new-password')}
        <p className="mb-3 font-moon text-sm text-coal-deep/70">Sampaikan email dan kata sandi awal kepada anggota. Anggota dapat menggantinya di menu Account.</p>
        <BrandError message={error} />
        <button type="submit" disabled={saving} className={`${pillButton} mt-2 w-full`}>
          {saving ? 'Menyimpan...' : 'Tambah Worker'}
        </button>
      </form>
    </BrandModal>
  );
}

export default function WorkerPage() {
  const { data, loading, error, reload } = useData(listWorkers);
  const [open, setOpen] = useState(false);

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
      ) : !data?.length ? (
        <EmptyState>Belum ada akun worker. Tambahkan anggota tim lewat tombol Tambah Worker.</EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((worker, index) => (
            <motion.div
              key={worker.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index, 9) * 0.04 }}
              className="flex items-center gap-3 rounded-[20px] border-[3px] border-flame bg-cream p-3"
            >
              <Avatar />
              <div className="min-w-0">
                <p className="truncate font-moon text-xl text-flame">{worker.name}</p>
                <p className="truncate font-moon text-xs text-coal-deep/60">{worker.email}</p>
                <p className="font-moon text-sm leading-snug">{workerNote(worker.jumlahProject)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <TambahWorker
        open={open}
        onClose={() => setOpen(false)}
        onDone={() => {
          setOpen(false);
          void reload();
        }}
      />
    </StaffPanel>
  );
}
