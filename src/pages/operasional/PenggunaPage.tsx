import { useState, type FormEvent } from 'react';
import Button from '../../components/Button';
import DataState from '../../components/DataState';
import Field, { inputClass } from '../../components/Field';
import Modal from '../../components/Modal';
import Table, { type Column } from '../../components/Table';
import { useCurrentUser } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { listClients, updateClientEmail } from '../../services/clientService';
import { createUser, listUsers, updateUser } from '../../services/userService';
import type { Client, InternalRole, InternalUser } from '../../types';
import { ROLE_LABEL } from '../../utils/navigation';
import PasswordInput from '../../components/PasswordInput';

const emptyUser = { name: '', email: '', password: '', role: 'TIM' as InternalRole };

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

  function openEmail(next: EmailTarget) {
    setTarget(next);
    setEmail(next.email);
    setFormError('');
  }

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    try {
      await createUser(form);
      setAdding(false);
      setForm(emptyUser);
      await users.reload();
    } catch (err) {
      setFormError(errorMessage(err));
    }
  }

  async function handleEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!target) return;
    setFormError('');
    try {
      await target.save(email);
      setTarget(null);
      await Promise.all([users.reload(), clients.reload()]);
    } catch (err) {
      setFormError(errorMessage(err));
    }
  }

  async function toggle(user: InternalUser) {
    setActionError('');
    try {
      await updateUser(user.id, { isActive: !user.isActive });
      await users.reload();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  }

  const userColumns: Column<InternalUser>[] = [
    { key: 'nama', label: 'Nama', render: (user) => user.name },
    { key: 'email', label: 'Email', render: (user) => user.email },
    { key: 'role', label: 'Role', render: (user) => ROLE_LABEL[user.role] },
    {
      key: 'aktif',
      label: 'Status',
      render: (user) =>
        user.id === me.id ? (
          'Aktif'
        ) : (
          <button type="button" className="underline" onClick={() => void toggle(user)}>
            {user.isActive ? 'Aktif, nonaktifkan' : 'Nonaktif, aktifkan'}
          </button>
        ),
    },
    {
      key: 'aksi',
      label: 'Aksi',
      render: (user) => (
        <button
          type="button"
          className="underline"
          onClick={() => openEmail({ label: user.name, email: user.email, save: (value) => updateUser(user.id, { email: value }) })}
        >
          Ubah email
        </button>
      ),
    },
  ];

  const clientColumns: Column<Client>[] = [
    { key: 'instansi', label: 'Instansi', render: (client) => client.namaInstansi },
    { key: 'nama', label: 'Kontak', render: (client) => client.user.name },
    { key: 'email', label: 'Email', render: (client) => client.user.email },
    {
      key: 'aksi',
      label: 'Aksi',
      render: (client) => (
        <button
          type="button"
          className="underline"
          onClick={() => openEmail({ label: client.namaInstansi, email: client.user.email, save: (value) => updateClientEmail(client.id, value) })}
        >
          Ubah email
        </button>
      ),
    },
  ];

  const text = (id: 'name' | 'email' | 'password', label: string, type = 'text') => (
    <Field id={id} label={label}>
      {type === 'password' ? (
        <PasswordInput tone="light" id={id} required value={form[id]} onChange={(event) => setForm({ ...form, [id]: event.target.value })} className={inputClass} />
      ) : (
        <input id={id} type={type} required value={form[id]} onChange={(event) => setForm({ ...form, [id]: event.target.value })} className={inputClass} />
      )}
    </Field>
  );

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Pengguna</h1>
        <Button onClick={() => { setFormError(''); setAdding(true); }}>Tambah Akun</Button>
      </div>
      <DataState loading={users.loading} error={users.error} />
      {actionError && <p role="alert" className="mb-3 text-sm text-danger">{actionError}</p>}
      {users.data && <Table columns={userColumns} rows={users.data} rowKey={(user) => user.id} />}

      <h2 className="mb-1 mt-8 font-semibold">Akun Klien</h2>
      <p className="mb-3 text-sm text-muted">Klien mendaftar sendiri. Perbaiki email hanya jika klien salah ketik dan tidak menerima tautan lupa kata sandi.</p>
      <DataState loading={clients.loading} error={clients.error} />
      {clients.data && <Table columns={clientColumns} rows={clients.data} rowKey={(client) => client.id} emptyText="Belum ada klien." />}

      <Modal open={adding} title="Tambah Akun" onClose={() => setAdding(false)}>
        <form onSubmit={handleAdd}>
          {text('name', 'Nama')}
          {text('email', 'Email', 'email')}
          {text('password', 'Kata sandi awal (minimal 8 karakter)', 'password')}
          <Field id="role" label="Role">
            <select id="role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as InternalRole })} className={inputClass}>
              <option value="TIM">Tim</option>
              <option value="MARKETING">Marketing</option>
              <option value="OPERASIONAL">Operasional</option>
            </select>
          </Field>
          {formError && <p role="alert" className="mb-3 text-sm text-danger">{formError}</p>}
          <Button type="submit">Simpan</Button>
        </form>
      </Modal>

      <Modal open={Boolean(target)} title={`Ubah Email ${target?.label ?? ''}`} onClose={() => setTarget(null)}>
        <form onSubmit={handleEmail}>
          <Field id="email-baru" label="Email">
            <input id="email-baru" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} />
          </Field>
          {formError && <p role="alert" className="mb-3 text-sm text-danger">{formError}</p>}
          <Button type="submit">Simpan</Button>
        </form>
      </Modal>
    </section>
  );
}
