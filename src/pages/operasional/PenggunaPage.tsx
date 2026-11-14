import { useState, type FormEvent } from 'react';
import { BrandError, BrandField, brandInputSolid } from '../../components/brand/Brand';
import BrandModal from '../../components/brand/BrandModal';
import { BrandTable, LoadError, Loading, StaffPanel, linkButton, pillButton, tableCell as cell } from '../../components/brand/StaffParts';
import PasswordInput from '../../components/PasswordInput';
import { useCurrentUser } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { listClients, updateClientEmail } from '../../services/clientService';
import { createUser, listUsers, updateUser } from '../../services/userService';
import type { InternalRole } from '../../types';
import { ROLE_LABEL } from '../../utils/navigation';

// Kelola semua akun internal (Marketing, Operasional, Tim) dan perbaikan email klien, bergaya halaman Operasional.
const emptyUser = { name: '', email: '', password: '', role: 'MARKETING' as InternalRole };

interface EmailTarget {
  label: string;
  email: string;
  save: (email: string) => Promise<void>;
}

export default function PenggunaPage() {
  const me = useCurrentUser();
  const users = useData(listUsers);
  const clients = useData(listClients);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyUser);
  const [target, setTarget] = useState<EmailTarget | null>(null);
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [actionError, setActionError] = useState('');
  const [saving, setSaving] = useState(false);

  function openEmail(next: EmailTarget) {
    setTarget(next);
    setEmail(next.email);
    setFormError('');
  }

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await createUser(form);
      setAdding(false);
      setForm(emptyUser);
      await users.reload();
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!target) return;
    setFormError('');
    setSaving(true);
    try {
      await target.save(email);
      setTarget(null);
      await Promise.all([users.reload(), clients.reload()]);
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function toggle(id: number, isActive: boolean) {
    setActionError('');
    try {
      await updateUser(id, { isActive: !isActive });
      await users.reload();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  }

  const text = (id: 'name' | 'email', label: string, type = 'text') => (
    <BrandField id={`u-${id}`} label={label}>
      <input id={`u-${id}`} type={type} required autoComplete="off" value={form[id]} onChange={(event) => setForm({ ...form, [id]: event.target.value })} className={brandInputSolid} />
    </BrandField>
  );

  return (
    <StaffPanel
      title="Pengguna"
      action={
        <button
          type="button"
          className={pillButton}
          onClick={() => {
            setFormError('');
            setAdding(true);
          }}
        >
          + Tambah Akun
        </button>
      }
    >
      <p className="mb-3 font-moon text-base text-cream/80">Semua akun internal Neo Telemetri. Tambah Akun untuk pengurus Marketing dan Operasional; akun Tim ditambahkan lewat menu Worker.</p>
      {actionError && <BrandError message={actionError} />}
      {users.loading && !users.data ? (
        <Loading />
      ) : users.error ? (
        <LoadError message={users.error} />
      ) : (
        <BrandTable head={['Nama', 'Email', 'Role', 'Status', 'Aksi']}>
          {(users.data ?? []).map((user) => (
            <tr key={user.id} className={user.isActive ? '' : 'opacity-60'}>
              <td className={cell}>{user.name}</td>
              <td className={cell}>{user.email}</td>
              <td className={cell}>
                {ROLE_LABEL[user.role]}
                {user.role === 'TIM' && user.keahlian && <span className="block text-xs text-coal-deep/60">{user.keahlian}</span>}
              </td>
              <td className={cell}>
                <span className={user.isActive ? 'text-[#14aa00]' : 'text-[#e60000]'}>{user.isActive ? 'Aktif' : 'Nonaktif'}</span>
                {user.id !== me.id && (
                  <button type="button" className={`${linkButton} ml-3`} onClick={() => void toggle(user.id, user.isActive)}>
                    {user.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                )}
              </td>
              <td className={cell}>
                <button type="button" className={linkButton} onClick={() => openEmail({ label: user.name, email: user.email, save: (value) => updateUser(user.id, { email: value }) })}>
                  Ubah email
                </button>
              </td>
            </tr>
          ))}
        </BrandTable>
      )}

      <h2 className="mt-8 font-magic text-2xl uppercase text-flame">Akun Klien</h2>
      <p className="mb-3 font-moon text-base text-cream/80">Klien mendaftar sendiri. Perbaiki email hanya jika klien salah ketik dan tidak menerima tautan lupa kata sandi.</p>
      {clients.loading && !clients.data ? (
        <Loading />
      ) : clients.error ? (
        <LoadError message={clients.error} />
      ) : (
        <BrandTable head={['Instansi', 'Kontak', 'Email', 'Aksi']} empty={clients.data?.length ? undefined : 'Belum ada klien.'}>
          {(clients.data ?? []).map((client) => (
            <tr key={client.id}>
              <td className={cell}>{client.namaInstansi}</td>
              <td className={cell}>{client.user.name}</td>
              <td className={cell}>{client.user.email}</td>
              <td className={cell}>
                <button type="button" className={linkButton} onClick={() => openEmail({ label: client.namaInstansi, email: client.user.email, save: (value) => updateClientEmail(client.id, value) })}>
                  Ubah email
                </button>
              </td>
            </tr>
          ))}
        </BrandTable>
      )}

      <BrandModal open={adding} title="Tambah Akun" onClose={() => setAdding(false)}>
        <form onSubmit={handleAdd}>
          {text('name', 'Nama')}
          {text('email', 'Email login', 'email')}
          <BrandField id="u-password" label="Kata sandi awal (minimal 8 karakter)">
            <PasswordInput id="u-password" required minLength={8} autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className={brandInputSolid} />
          </BrandField>
          <BrandField id="u-role" label="Role">
            <select id="u-role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as InternalRole })} className={brandInputSolid}>
              <option value="MARKETING">Marketing</option>
              <option value="OPERASIONAL">Operasional</option>
            </select>
          </BrandField>
          <p className="mb-3 font-moon text-sm text-coal-deep/70">Akun Tim (worker) ditambahkan lewat menu Worker agar keahliannya ikut tercatat.</p>
          <BrandError message={formError} />
          <button type="submit" disabled={saving} className={`${pillButton} mt-1 w-full`}>
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </form>
      </BrandModal>

      <BrandModal open={Boolean(target)} title={`Ubah Email ${target?.label ?? ''}`} onClose={() => setTarget(null)}>
        <form onSubmit={handleEmail}>
          <BrandField id="email-baru" label="Email baru">
            <input id="email-baru" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className={brandInputSolid} />
          </BrandField>
          <BrandError message={formError} />
          <button type="submit" disabled={saving} className={`${pillButton} mt-1 w-full`}>
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </form>
      </BrandModal>
    </StaffPanel>
  );
}
