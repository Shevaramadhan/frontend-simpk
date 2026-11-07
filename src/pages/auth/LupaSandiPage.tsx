import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import AuthCard from '../../components/AuthCard';
import Button from '../../components/Button';
import Field, { inputClass } from '../../components/Field';
import { errorMessage } from '../../services/apiConfig';
import { forgotPassword } from '../../services/authService';

export default function LupaSandiPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthCard title="Lupa Kata Sandi">
      {sent ? (
        <p role="status" className="text-sm">
          Jika email tersebut terdaftar, tautan untuk membuat kata sandi baru sudah dikirim. Tautan berlaku 30 menit. Periksa juga folder spam.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Field id="email" label="Email akun Anda">
            <input id="email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} />
          </Field>
          {error && <p role="alert" className="mb-3 text-sm text-danger">{error}</p>}
          <Button type="submit" disabled={saving} className="w-full">{saving ? 'Mengirim...' : 'Kirim Tautan'}</Button>
        </form>
      )}
      <p className="mt-4 text-sm text-muted">
        <Link to="/login" className="underline">Kembali ke halaman masuk</Link>
      </p>
    </AuthCard>
  );
}
