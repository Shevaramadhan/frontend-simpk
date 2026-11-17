import { useState, type FormEvent, type ReactNode } from 'react';
import { BrandError, BrandField, brandInputSolid } from '../../components/brand/Brand';
import { pillButton } from '../../components/brand/StaffParts';
import PasswordInput from '../../components/PasswordInput';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { changePassword } from '../../services/authService';
import { getMyProfile, updateMyProfile } from '../../services/clientService';
import type { Client } from '../../types';

// Profil klien: data diri (termasuk WhatsApp yang belum ada untuk akun dari Google) dan ganti kata sandi.
const JENIS = ['Perorangan', 'Organisasi', 'Instansi', 'Perusahaan'];

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200/90 bg-zinc-50/50 p-5 sm:p-6">
      <h2 className="mb-3 font-magic text-base font-bold text-zinc-900 sm:text-lg">{title}</h2>
      {children}
    </div>
  );
}

function Saved({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return (
    <p role="status" className="mb-3 font-moon text-sm font-medium text-emerald-600">
      {text}
    </p>
  );
}

function DataDiri({ client, onSaved }: { client: Client; onSaved: () => Promise<void> }) {
  const [form, setForm] = useState({
    name: client.user.name,
    namaInstansi: client.namaInstansi,
    jenisKlien: client.jenisKlien,
    noWhatsapp: client.noWhatsapp ?? '',
    alamat: client.alamat ?? '',
  });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const jenis = JENIS.includes(form.jenisKlien) ? JENIS : [form.jenisKlien, ...JENIS];
  const set = (key: keyof typeof form) => (event: { target: { value: string } }) => {
    setDone(false);
    setForm({ ...form, [key]: event.target.value });
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setDone(false);
    setSaving(true);
    try {
      await updateMyProfile(form);
      await onSaved();
      setDone(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card title="Data Diri">
      {!client.noWhatsapp && (
        <p className="mb-4 rounded-xl bg-[#ffd27a] px-4 py-2 font-moon text-sm text-coal-deep">
          Lengkapi nomor WhatsApp agar Marketing dapat menghubungi Anda tentang project.
        </p>
      )}
      {/* Dua kolom di layar lebar agar profil muat satu layar tanpa digulir. */}
      <form onSubmit={handleSubmit} className="grid gap-x-4 sm:grid-cols-2">
        <BrandField id="p-nama" label="Nama">
          <input id="p-nama" required minLength={2} maxLength={120} value={form.name} onChange={set('name')} className={brandInputSolid} />
        </BrandField>
        <div>
          <BrandField id="p-email" label="Email">
            <input id="p-email" value={client.user.email} readOnly disabled className={`${brandInputSolid} cursor-not-allowed opacity-70`} />
          </BrandField>
          <p className="-mt-1 mb-3 font-moon text-xs text-coal-deep/60">Email dipakai untuk masuk. Bila salah, hubungi pengurus Neo Telemetri.</p>
        </div>
        <BrandField id="p-wa" label="Nomor WhatsApp">
          <input id="p-wa" type="tel" required inputMode="tel" pattern="[0-9+\-\s]{8,25}" placeholder="08xxxxxxxxxx" value={form.noWhatsapp} onChange={set('noWhatsapp')} className={brandInputSolid} />
        </BrandField>
        <div className="contents">
          <BrandField id="p-instansi" label="Nama instansi / organisasi">
            <input id="p-instansi" required minLength={2} maxLength={160} value={form.namaInstansi} onChange={set('namaInstansi')} className={brandInputSolid} />
          </BrandField>
          <BrandField id="p-jenis" label="Jenis klien">
            <select id="p-jenis" value={form.jenisKlien} onChange={set('jenisKlien')} className={brandInputSolid}>
              {jenis.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </BrandField>
        </div>
        <div className="sm:col-span-2">
        <BrandField id="p-alamat" label="Alamat (opsional)">
          <textarea id="p-alamat" maxLength={255} rows={2} value={form.alamat} onChange={set('alamat')} className={`${brandInputSolid} resize-y`} />
        </BrandField>
        <BrandError message={error} />
        <Saved show={done} text="Profil tersimpan." />
        <button type="submit" disabled={saving} className={pillButton}>
          {saving ? 'Menyimpan...' : 'Simpan Profil'}
        </button>
        </div>
      </form>
    </Card>
  );
}

const emptyPassword = { lama: '', baru: '', ulang: '' };

function GantiSandi() {
  const [form, setForm] = useState(emptyPassword);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setDone(false);
    if (form.baru !== form.ulang) return setError('Konfirmasi kata sandi baru tidak sama.');
    setSaving(true);
    try {
      await changePassword(form.lama, form.baru);
      setForm(emptyPassword);
      setDone(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const input = (id: keyof typeof emptyPassword, label: string, autoComplete: string) => (
    <BrandField id={`s-${id}`} label={label}>
      <PasswordInput id={`s-${id}`} required autoComplete={autoComplete} value={form[id]} onChange={(event) => setForm({ ...form, [id]: event.target.value })} className={brandInputSolid} />
    </BrandField>
  );

  return (
    <Card title="Ganti Kata Sandi">
      <form onSubmit={handleSubmit}>
        {input('lama', 'Kata sandi lama', 'current-password')}
        {input('baru', 'Kata sandi baru (minimal 8 karakter)', 'new-password')}
        {input('ulang', 'Konfirmasi kata sandi baru', 'new-password')}
        <p className="mb-3 font-moon text-xs text-coal-deep/60">Akun yang masuk dengan Google dapat membuat kata sandi lewat "Lupa kata sandi?" di halaman Login.</p>
        <BrandError message={error} />
        <Saved show={done} text="Kata sandi diperbarui." />
        <button type="submit" disabled={saving} className={pillButton}>
          {saving ? 'Menyimpan...' : 'Simpan Kata Sandi'}
        </button>
      </form>
    </Card>
  );
}

export default function ProfilPage() {
  const { refreshUser } = useAuth();
  const { data, loading, error, reload } = useData(getMyProfile);

  // Isian tetap seperti yang baru disimpan; data dimuat ulang agar peringatan WhatsApp dan sapaan HALLO ikut berubah.
  async function afterSave() {
    await Promise.all([refreshUser(), reload()]);
  }

  return (
    <section className="px-3 pb-6 sm:px-6">
      <div className="mx-auto max-w-6xl rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs sm:p-6">
        <h1 className="mb-4 border-b border-zinc-100 pb-3 font-magic text-lg font-bold text-zinc-900 sm:text-xl">Profil Saya</h1>
        {loading && !data ? (
          <p className="py-10 text-center font-moon text-sm text-zinc-500">Memuat...</p>
        ) : error || !data ? (
          <p role="alert" className="py-10 text-center font-moon text-sm text-red-600">
            {error || 'Profil tidak ditemukan.'}
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
            <DataDiri client={data} onSaved={afterSave} />
            <GantiSandi />
          </div>
        )}
      </div>
    </section>
  );
}
