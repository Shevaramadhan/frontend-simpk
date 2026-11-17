import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BrandError, BrandField, brandInputSolid, dashedBox } from '../../components/brand/Brand';
import { pillButton } from '../../components/brand/StaffParts';
import DateInput, { hariIni } from '../../components/DateInput';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { listServices } from '../../services/catalogService';
import { createOrder } from '../../services/orderService';
import { rupiahPendek } from '../../utils/format';

const MAX_FILES = 5;
const MAX_MB = 5;
const ACCEPT = '.pdf,.png,.jpg,.jpeg,.docx';

export default function PesanPage() {
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  const [params, setParams] = useSearchParams();
  const jasaId = Number(params.get('jasa')) || null;
  const { data: services } = useData(listServices);
  const jasa = services?.find((service) => service.id === jasaId) ?? null;
  const [form, setForm] = useState({ judul: '', tenggat: '', anggaran: '', kebutuhan: '' });
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const picked = [...files, ...Array.from(list)];
    const tooBig = picked.find((file) => file.size > MAX_MB * 1024 * 1024);
    if (tooBig) setError(`${tooBig.name} lebih dari ${MAX_MB} MB.`);
    else if (picked.length > MAX_FILES) setError(`Maksimal ${MAX_FILES} dokumen.`);
    else {
      setError('');
      setFiles(picked);
    }
    if (fileInput.current) fileInput.current.value = '';
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      await createOrder({
        judul: form.judul,
        kebutuhan: form.kebutuhan,
        anggaran: form.anggaran ? Number(form.anggaran) : null,
        tenggatDiharapkan: form.tenggat || null,
        dokumen: files,
        serviceId: jasa?.id ?? null,
      });
      navigate('/portal/proyek', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  }

  const set = (key: keyof typeof form) => (event: { target: { value: string } }) => setForm({ ...form, [key]: event.target.value });

  return (
    <section className="px-3 pb-8 sm:px-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs sm:p-7">
        <div className="mb-5 flex items-center gap-3 border-b border-zinc-100 pb-3.5">
          <Link
            to="/portal/proyek"
            aria-label="Kembali ke project saya"
            className="inline-flex size-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 transition-colors hover:border-flame/40 hover:text-flame"
          >
            ←
          </Link>
          <div>
            <h1 className="font-magic text-lg font-bold text-zinc-900 sm:text-xl">Form Pengajuan Project</h1>
            <p className="font-moon text-xs text-zinc-500">Isi rincian kebutuhan project Anda agar tim kami dapat meninjaunya.</p>
          </div>
        </div>
        {jasa && (
          <p className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-flame/25 bg-flame/5 px-4 py-2.5 font-moon text-xs text-zinc-700 sm:text-sm">
            <span>
              Jasa dipilih: <span className="font-semibold text-flame">{jasa.nama}</span> ({rupiahPendek(jasa.hargaMin)} - {rupiahPendek(jasa.hargaMax)}, sekitar {jasa.estimasiHari} hari)
            </span>
            <button type="button" onClick={() => setParams({}, { replace: true })} className="text-xs font-semibold text-zinc-500 underline underline-offset-4 hover:text-flame">
              Lepas pilihan
            </button>
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <BrandField id="judul" label="Nama Project">
            <input id="judul" required minLength={3} maxLength={160} value={form.judul} onChange={set('judul')} className={brandInputSolid} />
          </BrandField>
          <div className="grid gap-x-5 sm:grid-cols-2">
            <BrandField id="tenggat" label="Ekspektasi Selesai">
              <DateInput id="tenggat" min={hariIni()} value={form.tenggat} onChange={set('tenggat')} className={brandInputSolid} />
            </BrandField>
            <BrandField id="anggaran" label="Anggaran (Rp)">
              <input id="anggaran" type="number" min="0" step="1000" value={form.anggaran} onChange={set('anggaran')} className={brandInputSolid} />
            </BrandField>
          </div>
          <BrandField id="kebutuhan" label="Deskripsi Project">
            <textarea id="kebutuhan" required minLength={10} rows={4} value={form.kebutuhan} onChange={set('kebutuhan')} className={brandInputSolid} />
          </BrandField>

          <p className="mb-1.5 font-moon text-xs font-semibold text-zinc-700 sm:text-sm">Dokumen Pendukung (Opsional)</p>
          <input ref={fileInput} id="dokumen" type="file" multiple accept={ACCEPT} className="sr-only" onChange={(event) => addFiles(event.target.files)} />
          <label htmlFor="dokumen" className={`${dashedBox} flex cursor-pointer items-center justify-center gap-2.5 bg-zinc-50/70 py-4 font-moon text-sm font-semibold text-flame hover:bg-flame/5`}>
            <span className="grid size-7 place-items-center rounded-full bg-flame text-lg leading-none text-white">+</span>
            Tambah Dokumen Pendukung
          </label>
          <p className="mt-1 font-moon text-xs text-zinc-500">PDF, PNG, JPG, atau DOCX, maksimal {MAX_FILES} berkas dan {MAX_MB} MB per berkas.</p>
          {files.length > 0 && (
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`} className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1 font-moon text-xs text-zinc-700">
                  {file.name}
                  <button type="button" aria-label={`Hapus ${file.name}`} className="font-bold text-red-500 hover:text-red-700" onClick={() => setFiles(files.filter((_, i) => i !== index))}>
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5">
            <BrandError message={error} />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className={`${pillButton} px-6 py-2.5`}>
              {saving ? 'Mengirim...' : 'Kirim Pengajuan'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
