import { useState, type FormEvent } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import AuthCard from '../../components/AuthCard';
import Button from '../../components/Button';
import Field, { inputClass } from '../../components/Field';
import { useAuth } from '../../hooks/useAuth';
import { errorMessage } from '../../services/apiConfig';
import { afterAuthPath } from '../../utils/navigation';

const empty = { name: '', email: '', password: '', namaInstansi: '', jenisKlien: 'Organisasi', noWhatsapp: '' };

export default function DaftarPage() {
  const { user, register } = useAuth();
  const [params] = useSearchParams();
  const jasa = params.get('jasa');
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (user) return <Navigate to={afterAuthPath(user.role, jasa)} replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      await register(form);
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  }

  const text = (id: keyof typeof empty, label: string, type = 'text', autoComplete = 'off') => (
    <Field id={id} label={label}>
      <input id={id} type={type} required autoComplete={autoComplete} value={form[id]} onChange={(event) => setForm({ ...form, [id]: event.target.value })} className={inputClass} />
    </Field>
  );

  return (
    <AuthCard title="Daftar Akun Klien">
      <form onSubmit={handleSubmit}>
        {text('name', 'Nama', 'text', 'name')}
        {text('namaInstansi', 'Instansi atau organisasi', 'text', 'organization')}
        <Field id="jenisKlien" label="Jenis klien">
          <select id="jenisKlien" value={form.jenisKlien} onChange={(event) => setForm({ ...form, jenisKlien: event.target.value })} className={inputClass}>
            <option>Organisasi</option>
            <option>Instansi</option>
            <option>Perorangan</option>
          </select>
        </Field>
        {text('noWhatsapp', 'Nomor WhatsApp', 'tel', 'tel')}
        {text('email', 'Email', 'email', 'email')}
        {text('password', 'Kata sandi (minimal 8 karakter)', 'password', 'new-password')}
        {error && <p role="alert" className="mb-3 text-sm text-danger">{error}</p>}
        <Button type="submit" disabled={saving} className="w-full">{saving ? 'Memproses...' : 'Daftar'}</Button>
      </form>
      <p className="mt-4 text-sm text-muted">
        Sudah punya akun? <Link to={jasa ? `/login?jasa=${encodeURIComponent(jasa)}` : '/login'} className="underline">Masuk</Link>
      </p>
    </AuthCard>
  );
}
