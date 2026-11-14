import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import AuthShell from '../../components/brand/AuthShell';
import { BrandError, BrandField, FramedButton, brandInput } from '../../components/brand/Brand';
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
    <AuthShell title="Lupa Kata Sandi">
      {sent ? (
        <p role="status" className="font-moon text-lg text-coal-deep">
          Jika email tersebut terdaftar, tautan untuk membuat kata sandi baru sudah dikirim. Tautan berlaku 30 menit. Periksa juga folder spam.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <BrandField id="email" label="Email akun Anda">
            <input id="email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={brandInput} />
          </BrandField>
          <BrandError message={error} />
          <div className="flex justify-center"><FramedButton type="submit" disabled={saving}>{saving ? 'Mengirim...' : 'Kirim Tautan'}</FramedButton></div>
        </form>
      )}
      <p className="mt-6 text-center font-moon text-lg text-coal-deep">
        <Link to="/login" className="text-flame underline underline-offset-4">Kembali ke halaman masuk</Link>
      </p>
    </AuthShell>
  );
}
