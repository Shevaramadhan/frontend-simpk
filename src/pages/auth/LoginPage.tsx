import { useState, type FormEvent } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import AuthShell from '../../components/brand/AuthShell';
import { BrandError, BrandField, FramedButton, brandInput } from '../../components/brand/Brand';
import { useAuth } from '../../hooks/useAuth';
import { errorMessage } from '../../services/apiConfig';
import { afterAuthPath } from '../../utils/navigation';

// Satu halaman login untuk semua akun. Tujuan setelah masuk ditentukan role dari database:
// Klien ke /portal, Marketing, Operasional, dan Tim ke /app.
export default function LoginPage() {
  const { user, login } = useAuth();
  const [params] = useSearchParams();
  const jasa = params.get('jasa');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={afterAuthPath(user.role, jasa)} replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <AuthShell title="Login">
      <form onSubmit={handleSubmit}>
        <BrandField id="email" label="Email">
          <input id="email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={brandInput} />
        </BrandField>
        <BrandField id="password" label="Password">
          <input id="password" type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className={brandInput} />
        </BrandField>
        <div className="mb-[clamp(8px,2.4vh,24px)] text-right">
          <Link to="/lupa-sandi" className="font-moon text-[clamp(13px,2vh,16px)] text-coal-deep underline underline-offset-4">
            Lupa kata sandi?
          </Link>
        </div>
        <BrandError message={error} />
        <div className="flex justify-center">
          <FramedButton type="submit" disabled={submitting} size="text-[clamp(1.25rem,4vh,1.875rem)]">
            {submitting ? 'Memproses...' : 'Login'}
          </FramedButton>
        </div>
      </form>
      <p className="mt-[clamp(8px,2vh,24px)] text-center font-moon text-[clamp(14px,2.2vh,18px)] text-coal-deep">
        Belum punya akun?{' '}
        <Link to={jasa ? `/daftar?jasa=${encodeURIComponent(jasa)}` : '/daftar'} className="text-flame underline underline-offset-4">
          Sign In
        </Link>
      </p>
    </AuthShell>
  );
}
