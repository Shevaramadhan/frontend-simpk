import { useState, type FormEvent } from 'react';
import Button from '../../components/Button';
import DataState from '../../components/DataState';
import Field, { inputClass } from '../../components/Field';
import Modal from '../../components/Modal';
import Table, { type Column } from '../../components/Table';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { createClient, listClients, setClientActive } from '../../services/clientService';
import type { Client } from '../../types';

const empty = { name: '', email: '', password: '', namaInstansi: '', jenisKlien: 'Organisasi', noWhatsapp: '', alamat: '' };

export default function KlienPage() {
  const { data, loading, error, reload } = useData(listClients);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [formError, setFormError] = useState('');
  const [actionError, setActionError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await createClient(form);
      setOpen(false);
      setForm(empty);
      await reload();
    } catch (err) {
      setFormError(errorMessage(err));
    }
  }

  async function toggle(client: Client) {
    setActionError('');
    try {
      await setClientActive(client.id, !client.isActive);
      await reload();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  }

  const columns: Column<Client>[] = [
    { key: 'instansi', label: 'Instansi', render: (client) => client.namaInstansi },
    { key: 'nama', label: 'Kontak', render: (client) => client.user.name },
    { key: 'email', label: 'Email', render: (client) => client.user.email },
    { key: 'wa', label: 'WhatsApp', render: (client) => client.noWhatsapp ?? '-' },
    {
      key: 'aktif',
      label: 'Status',
      render: (client) => (
        <button type="button" className="underline" onClick={() => void toggle(client)}>
          {client.isActive ? 'Aktif, nonaktifkan' : 'Nonaktif, aktifkan'}
        </button>
      ),
    },
  ];

  const text = (id: keyof typeof empty, label: string, type = 'text', required = true) => (
    <Field id={id} label={label}>
      <input id={id} type={type} required={required} value={form[id]} onChange={(e) => setForm({ ...form, [id]: e.target.value })} className={inputClass} />
    </Field>
  );

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Klien</h1>
        <Button onClick={() => { setFormError(''); setOpen(true); }}>Tambah Klien</Button>
      </div>
      <DataState loading={loading} error={error} />
      {actionError && <p role="alert" className="mb-3 text-sm text-danger">{actionError}</p>}
      {data && <Table columns={columns} rows={data} rowKey={(client) => client.id} />}

      <Modal open={open} title="Tambah Klien" onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          {text('name', 'Nama kontak')}
          {text('email', 'Email', 'email')}
          {text('password', 'Kata sandi awal', 'password')}
          {text('namaInstansi', 'Nama instansi')}
          {text('jenisKlien', 'Jenis klien')}
          {text('noWhatsapp', 'Nomor WhatsApp', 'text', false)}
          {text('alamat', 'Alamat', 'text', false)}
          {formError && <p role="alert" className="mb-3 text-sm text-danger">{formError}</p>}
          <Button type="submit">Simpan</Button>
        </form>
      </Modal>
    </section>
  );
}
