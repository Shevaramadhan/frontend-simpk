import { useState, type FormEvent } from 'react';
import { BrandError, BrandField, brandInputSolid } from '../../components/brand/Brand';
import BrandModal from '../../components/brand/BrandModal';
import { BrandTable, LoadError, Loading, StaffPanel, StatusPill, linkButton, pillButton, tableCell as cell } from '../../components/brand/StaffParts';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { listAllServices, saveService } from '../../services/catalogService';
import type { Service } from '../../types';
import { rupiahPendek } from '../../utils/format';

// Daftar jasa yang tampil di katalog publik. Menu tambahan di luar desain Figma, bergaya halaman pengurus.
const empty = { nama: '', deskripsi: '', hargaMin: '', hargaMax: '', estimasiHari: '', isVisible: true };

export default function KatalogPage() {
  const { data, loading, error, reload } = useData(listAllServices);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number>();
  const [form, setForm] = useState(empty);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  function edit(service?: Service) {
    setEditId(service?.id);
    setForm(service ? { ...service, hargaMin: String(Number(service.hargaMin)), hargaMax: String(Number(service.hargaMax)), estimasiHari: String(service.estimasiHari) } : empty);
    setFormError('');
    setOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await saveService(
        { nama: form.nama, deskripsi: form.deskripsi, hargaMin: Number(form.hargaMin), hargaMax: Number(form.hargaMax), estimasiHari: Number(form.estimasiHari), isVisible: form.isVisible },
        editId,
      );
      setOpen(false);
      await reload();
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const field = (id: 'nama' | 'hargaMin' | 'hargaMax' | 'estimasiHari', label: string, type = 'text') => (
    <BrandField id={`j-${id}`} label={label}>
      <input id={`j-${id}`} type={type} min={type === 'number' ? (id === 'estimasiHari' ? 1 : 0) : undefined} required value={form[id]} onChange={(e) => setForm({ ...form, [id]: e.target.value })} className={brandInputSolid} />
    </BrandField>
  );

  return (
    <StaffPanel
      title="Daftar Jasa"
      action={
        <button type="button" onClick={() => edit()} className={pillButton}>
          + Tambah Jasa
        </button>
      }
    >
      <p className="mb-3 font-moon text-base text-cream/80">Jasa yang ditandai tampil muncul di katalog publik dan dapat dipilih klien saat mengajukan project.</p>
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <LoadError message={error} />
      ) : (
        <BrandTable head={['Nama', 'Perkiraan Biaya', 'Waktu', 'Katalog', 'Aksi']} empty={data?.length ? undefined : 'Belum ada jasa.'}>
          {(data ?? []).map((service) => (
            <tr key={service.id}>
              <td className={cell}>
                {service.nama}
                <span className="line-clamp-1 block text-xs text-coal-deep/60">{service.deskripsi}</span>
              </td>
              <td className={cell}>
                {rupiahPendek(service.hargaMin)} - {rupiahPendek(service.hargaMax)}
              </td>
              <td className={cell}>{service.estimasiHari} hari</td>
              <td className={cell}>
                <StatusPill label={service.isVisible ? 'Tampil' : 'Disembunyikan'} className={service.isVisible ? 'bg-[#8fd694] text-coal-deep' : 'bg-[#bdbdbd] text-coal-deep'} />
              </td>
              <td className={cell}>
                <button type="button" className={linkButton} onClick={() => edit(service)}>
                  Ubah
                </button>
              </td>
            </tr>
          ))}
        </BrandTable>
      )}

      <BrandModal open={open} title={editId ? 'Ubah Jasa' : 'Tambah Jasa'} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          {field('nama', 'Nama jasa')}
          <BrandField id="j-deskripsi" label="Deskripsi">
            <textarea id="j-deskripsi" required rows={3} value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} className={`${brandInputSolid} resize-y`} />
          </BrandField>
          <div className="grid gap-x-3 sm:grid-cols-3">
            {field('hargaMin', 'Harga minimum (Rp)', 'number')}
            {field('hargaMax', 'Harga maksimum (Rp)', 'number')}
            {field('estimasiHari', 'Waktu (hari)', 'number')}
          </div>
          <label className="mb-3 flex items-center gap-2 font-moon text-base text-coal-deep">
            <input type="checkbox" className="size-5 accent-[#ff6200]" checked={form.isVisible} onChange={(e) => setForm({ ...form, isVisible: e.target.checked })} />
            Tampilkan di katalog publik
          </label>
          <BrandError message={formError} />
          <button type="submit" disabled={saving} className={`${pillButton} w-full`}>
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </form>
      </BrandModal>
    </StaffPanel>
  );
}
