import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthCard from '../../components/AuthCard';
import Button from '../../components/Button';
import Field, { inputClass } from '../../components/Field';
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
    <AuthCard title="Buat Kata Sandi Baru">
      {done ? (
        <p role="status" className="text-sm">
          Kata sandi diperbarui. <Link to="/login" className="underline">Masuk sekarang</Link>
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Field id="baru" label="Kata sandi baru (minimal 8 karakter)">
            <input id="baru" type="password" required autoComplete="new-password" value={baru} onChange={(event) => setBaru(event.target.value)} className={inputClass} />
          </Field>
          <Field id="ulang" label="Ulangi kata sandi baru">
            <input id="ulang" type="password" required autoComplete="new-password" value={ulang} onChange={(event) => setUlang(event.target.value)} className={inputClass} />
          </Field>
          {error && <p role="alert" className="mb-3 text-sm text-danger">{error}</p>}
          <Button type="submit" disabled={saving} className="w-full">{saving ? 'Menyimpan...' : 'Simpan'}</Button>
        </form>
      )}
    </AuthCard>
  );
}
