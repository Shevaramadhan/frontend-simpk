import { useState } from 'react';
import DataState from '../../components/DataState';
import Table, { type Column } from '../../components/Table';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { listClients, setClientActive } from '../../services/clientService';
import type { Client } from '../../types';

export default function KlienPage() {
  const { data, loading, error, reload } = useData(listClients);
  const [actionError, setActionError] = useState('');

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

  return (
    <section>
      <h1 className="mb-1 text-xl font-semibold">Klien</h1>
      <p className="mb-4 text-sm text-muted">Klien mendaftar sendiri lewat halaman Daftar. Nonaktifkan akun yang tidak jelas atau spam.</p>
      <DataState loading={loading} error={error} />
      {actionError && <p role="alert" className="mb-3 text-sm text-danger">{actionError}</p>}
      {data && <Table columns={columns} rows={data} rowKey={(client) => client.id} emptyText="Belum ada klien." />}

    </section>
  );
}
