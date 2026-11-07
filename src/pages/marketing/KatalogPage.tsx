import { useState, type FormEvent } from 'react';
import Button from '../../components/Button';
import DataState from '../../components/DataState';
import Field, { inputClass } from '../../components/Field';
import Modal from '../../components/Modal';
import Table, { type Column } from '../../components/Table';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { listAllServices, saveService } from '../../services/catalogService';
import type { Service } from '../../types';
import { rupiah } from '../../utils/format';

const empty = { nama: '', deskripsi: '', hargaMin: '', hargaMax: '', estimasiHari: '', isVisible: true };

export default function KatalogPage() {
  const { data, loading, error, reload } = useData(listAllServices);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number>();
  const [form, setForm] = useState(empty);
  const [formError, setFormError] = useState('');

  function edit(service?: Service) {
    setEditId(service?.id);
    setForm(service ? { ...service, estimasiHari: String(service.estimasiHari) } : empty);
    setFormError('');
    setOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await saveService(
        {
          nama: form.nama,
          deskripsi: form.deskripsi,
          hargaMin: Number(form.hargaMin),
          hargaMax: Number(form.hargaMax),
          estimasiHari: Number(form.estimasiHari),
          isVisible: form.isVisible,
        },
        editId,
      );
      setOpen(false);
      await reload();
    } catch (err) {
      setFormError(errorMessage(err));
    }
  }

  const columns: Column<Service>[] = [
    { key: 'nama', label: 'Nama', render: (service) => service.nama },
    { key: 'biaya', label: 'Perkiraan Biaya', render: (service) => `${rupiah(service.hargaMin)} - ${rupiah(service.hargaMax)}` },
    { key: 'waktu', label: 'Waktu', render: (service) => `${service.estimasiHari} hari` },
    { key: 'tampil', label: 'Tampil', render: (service) => (service.isVisible ? 'Ya' : 'Tidak') },
    {
      key: 'aksi',
      label: 'Aksi',
      render: (service) => (
        <button type="button" className="underline" onClick={() => edit(service)}>
          Ubah
        </button>
      ),
    },
  ];

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Daftar Jasa</h1>
        <Button onClick={() => edit()}>Tambah Jasa</Button>
      </div>
      <DataState loading={loading} error={error} />
      {data && <Table columns={columns} rows={data} rowKey={(service) => service.id} />}

      <Modal open={open} title={editId ? 'Ubah Jasa' : 'Tambah Jasa'} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          <Field id="nama" label="Nama jasa">
            <input id="nama" required value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className={inputClass} />
          </Field>
          <Field id="deskripsi" label="Deskripsi">
            <textarea id="deskripsi" required rows={3} value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} className={inputClass} />
          </Field>
          <Field id="hargaMin" label="Harga minimum (Rp)">
            <input id="hargaMin" type="number" min="0" required value={form.hargaMin} onChange={(e) => setForm({ ...form, hargaMin: e.target.value })} className={inputClass} />
          </Field>
          <Field id="hargaMax" label="Harga maksimum (Rp)">
            <input id="hargaMax" type="number" min="0" required value={form.hargaMax} onChange={(e) => setForm({ ...form, hargaMax: e.target.value })} className={inputClass} />
          </Field>
          <Field id="estimasiHari" label="Perkiraan waktu (hari)">
            <input id="estimasiHari" type="number" min="1" required value={form.estimasiHari} onChange={(e) => setForm({ ...form, estimasiHari: e.target.value })} className={inputClass} />
          </Field>
          <label className="mb-3 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isVisible} onChange={(e) => setForm({ ...form, isVisible: e.target.checked })} />
            Tampilkan di daftar jasa
          </label>
          {formError && <p role="alert" className="mb-3 text-sm text-danger">{formError}</p>}
          <Button type="submit">Simpan</Button>
        </form>
      </Modal>
    </section>
  );
}
