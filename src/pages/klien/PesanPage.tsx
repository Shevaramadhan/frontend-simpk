import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/Button';
import Field, { inputClass } from '../../components/Field';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { listServices } from '../../services/catalogService';
import { createOrder } from '../../services/orderService';

export default function PesanPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const services = useData(listServices);
  const [serviceId, setServiceId] = useState(params.get('jasa') ?? '');
  const [kebutuhan, setKebutuhan] = useState('');
  const [anggaran, setAnggaran] = useState('');
  const [tenggat, setTenggat] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      await createOrder({
        serviceId: serviceId ? Number(serviceId) : null,
        kebutuhan,
        anggaran: anggaran ? Number(anggaran) : null,
        tenggatDiharapkan: tenggat || null,
      });
      navigate('/portal', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="max-w-xl">
      <h1 className="text-xl font-semibold">Pesan Proyek</h1>
      <p className="mb-4 mt-1 text-sm text-muted">
        Marketing akan memeriksa pesanan Anda. Lihat <Link to="/katalog" className="underline">daftar jasa</Link>.
      </p>
      <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-surface p-5">
        <Field id="jasa" label="Jasa">
          <select id="jasa" value={serviceId} onChange={(event) => setServiceId(event.target.value)} className={inputClass}>
            <option value="">Belum tahu, konsultasikan</option>
            {services.data?.map((service) => (
              <option key={service.id} value={service.id}>
                {service.nama}
              </option>
            ))}
          </select>
        </Field>
        <Field id="kebutuhan" label="Kebutuhan">
          <textarea id="kebutuhan" required minLength={10} rows={5} value={kebutuhan} onChange={(event) => setKebutuhan(event.target.value)} className={inputClass} />
        </Field>
        <Field id="anggaran" label="Anggaran (Rp, opsional)">
          <input id="anggaran" type="number" min="0" value={anggaran} onChange={(event) => setAnggaran(event.target.value)} className={inputClass} />
        </Field>
        <Field id="tenggat" label="Tenggat yang diharapkan (opsional)">
          <input id="tenggat" type="date" value={tenggat} onChange={(event) => setTenggat(event.target.value)} className={inputClass} />
        </Field>
        {error && <p role="alert" className="mb-3 text-sm text-danger">{error}</p>}
        <Button type="submit" disabled={saving}>{saving ? 'Mengirim...' : 'Kirim Pesanan'}</Button>
      </form>
    </section>
  );
}
