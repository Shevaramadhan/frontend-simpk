import { useState, type FormEvent } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import AuthShell from '../../components/brand/AuthShell';
import { BrandError, BrandField, FramedButton, brandInput } from '../../components/brand/Brand';
import GoogleButton from '../../components/brand/GoogleButton';
import { useAuth } from '../../hooks/useAuth';
import { errorMessage } from '../../services/apiConfig';
import { afterAuthPath } from '../../utils/navigation';

// Sign In = pendaftaran akun. Semua akun dari halaman ini adalah Klien (role ditentukan backend).
const empty = { name: '', email: '', password: '', noWhatsapp: '' };

export default function DaftarPage() {
  const { user, register, loginWithGoogle } = useAuth();
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

  async function handleGoogle(credential: string) {
    setError('');
    try {
      await loginWithGoogle(credential);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  const text = (id: keyof typeof empty, label: string, type: string, autoComplete: string) => (
    <BrandField id={id} label={label}>
      <input id={id} type={type} required autoComplete={autoComplete} value={form[id]} onChange={(event) => setForm({ ...form, [id]: event.target.value })} className={brandInput} />
    </BrandField>
  );

  return (
    <AuthShell title="Sign In">
      <form onSubmit={handleSubmit}>
        {text('name', 'Nama', 'text', 'name')}
        {text('email', 'Email', 'email', 'email')}
        {text('noWhatsapp', 'Nomor WhatsApp', 'tel', 'tel')}
        {text('password', 'Password', 'password', 'new-password')}
        <BrandError message={error} />
        <div className="mt-2 flex justify-center">
          <FramedButton type="submit" disabled={saving} size="text-3xl">
            {saving ? 'Memproses...' : 'Sign In'}
          </FramedButton>
        </div>
      </form>

      <div className="my-6 flex items-center gap-5">
        <span className="h-[5px] flex-1 bg-coal" />
        <span className="font-magic text-2xl uppercase text-coal-deep">or</span>
        <span className="h-[5px] flex-1 bg-coal" />
      </div>
      <div className="mx-auto max-w-md">
        <GoogleButton onCredential={handleGoogle} label="Sign in with Google" />
      </div>

      <p className="mt-6 text-center font-moon text-lg text-coal-deep">
        Sudah punya akun?{' '}
        <Link to={jasa ? `/login?jasa=${encodeURIComponent(jasa)}` : '/login'} className="text-flame underline underline-offset-4">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}
