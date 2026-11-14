import { useState, type FormEvent } from 'react';
import Button from '../../components/Button';
import Field, { inputClass } from '../../components/Field';
import { errorMessage } from '../../services/apiConfig';
import { changePassword } from '../../services/authService';
import PasswordInput from '../../components/PasswordInput';

const empty = { lama: '', baru: '', ulang: '' };

export default function GantiSandiPage() {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setDone(false);
    if (form.baru !== form.ulang) {
      setError('Ulangan kata sandi baru tidak sama.');
      return;
    }
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

  const text = (id: keyof typeof empty, label: string, autoComplete: string) => (
    <Field id={id} label={label}>
      <PasswordInput tone="light" id={id} required autoComplete={autoComplete} value={form[id]} onChange={(event) => setForm({ ...form, [id]: event.target.value })} className={inputClass} />
    </Field>
  );

  return (
    <section className="max-w-md">
      <h1 className="mb-4 text-xl font-semibold">Ganti Kata Sandi</h1>
      <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-surface p-5">
        {text('lama', 'Kata sandi lama', 'current-password')}
        {text('baru', 'Kata sandi baru (minimal 8 karakter)', 'new-password')}
        {text('ulang', 'Ulangi kata sandi baru', 'new-password')}
        {error && <p role="alert" className="mb-3 text-sm text-danger">{error}</p>}
        {done && <p role="status" className="mb-3 text-sm text-accent">Kata sandi diperbarui.</p>}
        <Button type="submit" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</Button>
      </form>
    </section>
  );
}
