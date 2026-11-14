import { useState, type FormEvent } from 'react';
import { BrandError, BrandField, brandInputSolid } from '../../components/brand/Brand';
import { LoadError, Loading, StaffPanel, pillButton } from '../../components/brand/StaffParts';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { getPengaturan, savePengaturan, type PengaturanInput } from '../../services/pengaturanService';
import type { Pengaturan } from '../../types';
import { tanggal } from '../../utils/format';

// Identitas dan rekening Neo Telemetri yang tampil di tagihan (FR-12). Diubah Marketing tanpa mengubah kode.
const FIELDS: { key: keyof PengaturanInput; label: string; type?: string; wide?: boolean }[] = [
  { key: 'nama', label: 'Nama organisasi', wide: true },
  { key: 'alamat', label: 'Alamat', wide: true },
  { key: 'telepon', label: 'Telepon / WhatsApp', type: 'tel' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'bank', label: 'Nama bank' },
  { key: 'nomorRekening', label: 'Nomor rekening' },
  { key: 'atasNama', label: 'Atas nama rekening', wide: true },
];

function Form({ awal, onSaved }: { awal: Pengaturan; onSaved: () => void }) {
  const [form, setForm] = useState<PengaturanInput>({
    nama: awal.nama,
    alamat: awal.alamat,
    telepon: awal.telepon,
    email: awal.email,
    bank: awal.bank,
    nomorRekening: awal.nomorRekening,
    atasNama: awal.atasNama,
  });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (awal.contoh && !window.confirm('Simpan data ini sebagai identitas dan rekening resmi di semua tagihan?')) return;
    setError('');
    setDone(false);
    setSaving(true);
    try {
      await savePengaturan(form);
      setDone(true);
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[24px] bg-cream p-5 sm:p-6">
      {awal.contoh ? (
        <p className="mb-4 rounded-xl bg-[#ffd27a] px-4 py-2 font-moon text-base text-coal-deep">
          Data di bawah masih contoh. Selama belum disimpan, setiap tagihan menampilkan peringatan agar klien tidak mentransfer ke rekening contoh.
        </p>
      ) : (
        <p className="mb-4 font-moon text-sm text-coal-deep/70">Terakhir diubah {tanggal(awal.updatedAt)}. Perubahan langsung berlaku di semua tagihan, termasuk yang sudah terbit.</p>
      )}
      <div className="grid gap-x-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.key} className={field.wide ? 'sm:col-span-2' : ''}>
            <BrandField id={`p-${field.key}`} label={field.label}>
              <input
                id={`p-${field.key}`}
                type={field.type ?? 'text'}
                required
                value={form[field.key]}
                onChange={(event) => {
                  setDone(false);
                  setForm({ ...form, [field.key]: event.target.value });
                }}
                className={brandInputSolid}
              />
            </BrandField>
          </div>
        ))}
      </div>
      <BrandError message={error} />
      {done && (
        <p role="status" className="mb-3 font-moon text-base text-[#14aa00]">
          Pengaturan disimpan. Tagihan kini memakai data ini.
        </p>
      )}
      <button type="submit" disabled={saving} className={pillButton}>
        {saving ? 'Menyimpan...' : 'Simpan'}
      </button>
    </form>
  );
}

export default function PengaturanPage() {
  const { data, loading, error, reload } = useData(getPengaturan);
  return (
    <StaffPanel title="Pengaturan">
      <p className="mb-4 font-moon text-base text-cream/80">Identitas dan rekening Neo Telemetri yang tercetak pada tagihan klien.</p>
      {loading && !data ? <Loading /> : error || !data ? <LoadError message={error || 'Pengaturan tidak tersedia.'} /> : <Form awal={data} onSaved={() => void reload()} />}
    </StaffPanel>
  );
}
