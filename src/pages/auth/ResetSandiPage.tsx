import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthShell from '../../components/brand/AuthShell';
import { BrandError, BrandField, FramedButton, brandInput } from '../../components/brand/Brand';
import { errorMessage } from '../../services/apiConfig';
import { resetPassword } from '../../services/authService';

export default function ResetSandiPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [baru, setBaru] = useState('');
  const [ulang, setUlang] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (baru !== ulang) {
      setError('Ulangan kata sandi baru tidak sama.');
      return;
    }
    setSaving(true);
    try {
      await resetPassword(token, baru);
      setDone(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthShell title="Buat Kata Sandi Baru">
      {done ? (
        <p role="status" className="font-moon text-lg text-coal-deep">
          Kata sandi diperbarui. <Link to="/login" className="text-flame underline underline-offset-4">Masuk sekarang</Link>
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <BrandField id="baru" label="Kata sandi baru (minimal 8 karakter)">
            <input id="baru" type="password" required autoComplete="new-password" value={baru} onChange={(event) => setBaru(event.target.value)} className={brandInput} />
          </BrandField>
          <BrandField id="ulang" label="Ulangi kata sandi baru">
            <input id="ulang" type="password" required autoComplete="new-password" value={ulang} onChange={(event) => setUlang(event.target.value)} className={brandInput} />
          </BrandField>
          <BrandError message={error} />
          <div className="flex justify-center"><FramedButton type="submit" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</FramedButton></div>
        </form>
      )}
    </AuthShell>
  );
}
