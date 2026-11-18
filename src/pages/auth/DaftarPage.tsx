import { useState, type FormEvent } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import AuthShell, { AUTH_BUTTON_SIZE } from '../../components/brand/AuthShell';
import { tautanTeks } from '../../components/brand/Tombol';
import { BrandError, BrandField, FramedButton, brandInput } from '../../components/brand/Brand';
import GoogleButton from '../../components/brand/GoogleButton';
import { useAuth } from '../../hooks/useAuth';
import { errorMessage } from '../../services/apiConfig';
import { afterAuthPath } from '../../utils/navigation';
import PasswordInput from '../../components/PasswordInput';

// Sign Up = pendaftaran akun (sebelumnya berjudul Sign In seperti desain, diganti agar tidak tertukar dengan Login).
// Semua akun dari halaman ini adalah Klien (role ditentukan backend).
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
      {type === 'password' ? (
        <PasswordInput id={id} required autoComplete={autoComplete} value={form[id]} onChange={(event) => setForm({ ...form, [id]: event.target.value })} className={brandInput} />
      ) : (
        <input id={id} type={type} required autoComplete={autoComplete} value={form[id]} onChange={(event) => setForm({ ...form, [id]: event.target.value })} className={brandInput} />
      )}
    </BrandField>
  );

  return (
    <AuthShell title="Sign Up">
      <form onSubmit={handleSubmit}>
        {/* Layar pendek (laptop, zoom besar): dua kolom agar halaman muat tanpa digulir. */}
        <div className="grid gap-x-6 [@media(min-width:640px)_and_(max-height:820px)]:grid-cols-2">
          {text('name', 'Nama', 'text', 'name')}
          {text('email', 'Email', 'email', 'email')}
          {text('noWhatsapp', 'Nomor WhatsApp', 'tel', 'tel')}
          {text('password', 'Password', 'password', 'new-password')}
        </div>
        <BrandError message={error} />
        <div className="mt-2 flex justify-center">
          <FramedButton type="submit" disabled={saving} size={AUTH_BUTTON_SIZE}>
            {saving ? 'Memproses...' : 'Sign Up'}
          </FramedButton>
        </div>
      </form>

      <div className="my-[clamp(8px,2vh,24px)] flex items-center gap-5">
        <span className="h-[5px] flex-1 bg-coal" />
        <span className="font-magic text-[clamp(18px,3vh,24px)] uppercase text-coal-deep">or</span>
        <span className="h-[5px] flex-1 bg-coal" />
      </div>
      <div className="mx-auto max-w-md">
        <GoogleButton onCredential={handleGoogle} label="Sign up with Google" />
      </div>

      <p className="mt-[clamp(8px,2vh,24px)] text-center font-body text-[clamp(14px,2.2vh,18px)] text-coal-deep">
        Sudah punya akun?{' '}
        <Link to={jasa ? `/login?jasa=${encodeURIComponent(jasa)}` : '/login'} className={tautanTeks}>
          Login
        </Link>
      </p>
    </AuthShell>
  );
}
