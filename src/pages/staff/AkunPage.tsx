import { useState, type FormEvent } from 'react';
import { BrandError, BrandField, brandInputSolid } from '../../components/brand/Brand';
import { Avatar, StaffPanel, pillButton } from '../../components/brand/StaffParts';
import { useCurrentUser } from '../../hooks/useAuth';
import { errorMessage } from '../../services/apiConfig';
import { changePassword } from '../../services/authService';
import { ROLE_LABEL } from '../../utils/navigation';
import PasswordInput from '../../components/PasswordInput';

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
      <div className="grid gap-6 rounded-xl border border-zinc-200/90 bg-zinc-50/50 p-5 md:grid-cols-[auto_1fr] md:p-7">
        <div className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-zinc-200 bg-white p-5 md:w-60">
          <Avatar size="size-24" />
          <p className="text-center font-magic text-lg font-bold text-zinc-900">{user.name}</p>
          <p className="font-moon text-xs text-zinc-500">{user.email}</p>
          <span className="rounded-lg border border-flame/20 bg-flame/10 px-3 py-1 font-moon text-xs font-semibold text-flame">{ROLE_LABEL[user.role]}</span>
        </div>
        <form onSubmit={handleSubmit} className="max-w-lg rounded-xl border border-zinc-200 bg-white p-5">
          <p className="mb-3 font-magic text-base font-bold text-zinc-900 sm:text-lg">Ganti Kata Sandi</p>
          {input('lama', 'Kata sandi lama', 'current-password')}
          {input('baru', 'Kata sandi baru (minimal 8 karakter)', 'new-password')}
          {input('ulang', 'Konfirmasi kata sandi baru', 'new-password')}
          <BrandError message={error} />
          {done && (
            <p role="status" className="mb-2 font-moon text-sm font-medium text-emerald-600">
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
