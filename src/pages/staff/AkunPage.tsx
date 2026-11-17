import { useState, type FormEvent } from 'react';
import { BrandError, BrandField, brandInputSolid } from '../../components/brand/Brand';
import { Avatar, StaffPanel, pillButton } from '../../components/brand/StaffParts';
import { useCurrentUser } from '../../hooks/useAuth';
import { errorMessage } from '../../services/apiConfig';
import { changePassword } from '../../services/authService';
import { ROLE_LABEL } from '../../utils/navigation';
import PasswordInput from '../../components/PasswordInput';

// Wireframe "Account": profil singkat dan ganti kata sandi. Foto profil belum didukung Backend.
const empty = { lama: '', baru: '', ulang: '' };

export default function AkunPage() {
  const user = useCurrentUser();
  const [form, setForm] = useState(empty);
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
      setForm(empty);
      setDone(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const input = (id: keyof typeof empty, label: string, autoComplete: string) => (
    <BrandField id={`a-${id}`} label={label}>
      <PasswordInput id={`a-${id}`} required autoComplete={autoComplete} value={form[id]} onChange={(event) => setForm({ ...form, [id]: event.target.value })} className={brandInputSolid} />
    </BrandField>
  );

  return (
    <StaffPanel title="Account">
      <div className="grid gap-6 rounded-[24px] bg-cream p-5 md:grid-cols-[auto_1fr] md:p-7">
        <div className="flex flex-col items-center gap-3 md:w-56">
          <Avatar size="size-32" />
          <p className="text-center font-magic text-2xl uppercase text-flame">{user.name}</p>
          <p className="font-moon text-base text-coal-deep/70">{user.email}</p>
          <span className="rounded-xl bg-coal px-3 py-1 font-moon text-sm text-flame">{ROLE_LABEL[user.role]}</span>
        </div>
        <form onSubmit={handleSubmit} className="max-w-lg">
          <p className="mb-3 font-magic text-2xl uppercase text-flame">Ganti Kata Sandi</p>
          {input('lama', 'Kata sandi lama', 'current-password')}
          {input('baru', 'Kata sandi baru (minimal 8 karakter)', 'new-password')}
          {input('ulang', 'Konfirmasi kata sandi baru', 'new-password')}
          <BrandError message={error} />
          {done && (
            <p role="status" className="mb-2 font-moon text-base text-[#14aa00]">
              Kata sandi diperbarui.
            </p>
          )}
          <button type="submit" disabled={saving} className={pillButton}>
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </form>
      </div>
    </StaffPanel>
  );
}
