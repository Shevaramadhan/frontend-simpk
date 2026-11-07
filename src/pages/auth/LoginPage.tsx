import { useState, type FormEvent } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { errorMessage } from '../../services/apiConfig';
import { afterAuthPath } from '../../utils/navigation';
import Button from '../../components/Button';

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
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="hero-grid flex min-h-screen items-center justify-center bg-page p-4 text-ink">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6">
        <h1 className="text-lg font-semibold">Masuk</h1>
        <p className="mb-4 text-sm text-muted">SIM Proyek Klien Neo Telemetri</p>

        <label className="block text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mb-3 mt-1 w-full rounded-lg border border-line px-3 py-2"
        />

        <label className="block text-sm font-medium" htmlFor="password">
          Kata sandi
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mb-3 mt-1 w-full rounded-lg border border-line px-3 py-2"
        />

        {error && (
          <p role="alert" className="mb-3 text-sm text-danger">
            {error}
          </p>
        )}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Memproses...' : 'Masuk'}
        </Button>

        <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm text-muted">
          <Link to="/lupa-sandi" className="underline">Lupa kata sandi?</Link>
          <Link to={jasa ? `/daftar?jasa=${encodeURIComponent(jasa)}` : '/daftar'} className="underline">Daftar sebagai klien</Link>
        </div>
      </form>
    </div>
  );
}
