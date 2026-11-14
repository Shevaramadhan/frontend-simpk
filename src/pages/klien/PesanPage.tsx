import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BrandError, BrandField, FramedButton, brandInputSolid, dashedBox } from '../../components/brand/Brand';
import { useData } from '../../hooks/useData';
import { errorMessage } from '../../services/apiConfig';
import { listServices } from '../../services/catalogService';
import { createOrder } from '../../services/orderService';
import { rupiahPendek } from '../../utils/format';

// Figma "Form Pengajuan project": Nama Project, Ekspetasi Selesai, Anggaran, Deskripsi, Dokumen Pendukung, Submit.
const MAX_FILES = 5;
const MAX_MB = 5;
const ACCEPT = '.pdf,.png,.jpg,.jpeg,.docx';

export default function PesanPage() {
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  // Jasa dari tombol "Pesan jasa ini" di Daftar Jasa publik (?jasa=id); boleh dilepas klien.
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
    <section className="px-3 pb-10 sm:px-6">
      <div className="mx-auto max-w-5xl rounded-[30px] bg-coal-deep p-5 sm:p-8">
        <div className="mb-6 flex items-center gap-4">
          <Link to="/portal/proyek" aria-label="Kembali ke project saya" className="font-magic text-3xl text-flame hover:text-cream">
            ←
          </Link>
          <h1 className="font-magic text-3xl uppercase text-flame sm:text-5xl">Form Pengajuan project</h1>
        </div>
        {jasa && (
          <p className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border-2 border-flame px-4 py-2 font-moon text-base text-cream">
            <span>
              Jasa dipilih: <span className="text-flame">{jasa.nama}</span> ({rupiahPendek(jasa.hargaMin)} - {rupiahPendek(jasa.hargaMax)}, sekitar {jasa.estimasiHari} hari)
            </span>
            <button type="button" onClick={() => setParams({}, { replace: true })} className="text-sm text-cream/70 underline underline-offset-4 hover:text-flame">
              Lepas pilihan
            </button>
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <BrandField id="judul" label="Nama Project" tone="cream">
            <input id="judul" required minLength={3} maxLength={160} value={form.judul} onChange={set('judul')} className={brandInputSolid} />
          </BrandField>
          <div className="grid gap-x-6 sm:grid-cols-2">
            <BrandField id="tenggat" label="Ekspetasi Selesai" tone="cream">
              <input id="tenggat" type="date" value={form.tenggat} onChange={set('tenggat')} className={brandInputSolid} />
            </BrandField>
            <BrandField id="anggaran" label="Anggaran (Rp)" tone="cream">
              <input id="anggaran" type="number" min="0" step="1000" value={form.anggaran} onChange={set('anggaran')} className={brandInputSolid} />
            </BrandField>
          </div>
          <BrandField id="kebutuhan" label="Deskripsi Project" tone="cream">
            <textarea id="kebutuhan" required minLength={10} rows={5} value={form.kebutuhan} onChange={set('kebutuhan')} className={brandInputSolid} />
          </BrandField>

          <p className="mb-1 font-moon text-xl text-cream">Dokumen-Dokumen Pendukung</p>
          <input ref={fileInput} id="dokumen" type="file" multiple accept={ACCEPT} className="sr-only" onChange={(event) => addFiles(event.target.files)} />
          <label htmlFor="dokumen" className={`${dashedBox} flex cursor-pointer items-center justify-center gap-3 bg-cream py-6 font-moon text-xl text-flame hover:bg-[#ffe7d6]`}>
            <span className="grid size-10 place-items-center rounded-full bg-flame font-magic text-3xl leading-none text-cream">+</span>
            tambah document
          </label>
          <p className="mt-1 font-moon text-sm text-cream/80">PDF, PNG, JPG, atau DOCX, maksimal {MAX_FILES} berkas dan {MAX_MB} MB per berkas.</p>
          {files.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`} className="flex items-center gap-2 rounded-xl bg-cream px-3 py-1.5 font-moon text-sm text-coal-deep">
                  {file.name}
                  <button type="button" aria-label={`Hapus ${file.name}`} className="font-bold text-flame" onClick={() => setFiles(files.filter((_, i) => i !== index))}>
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6">
            <BrandError message={error} />
          </div>
          <div className="flex justify-end">
            <FramedButton type="submit" disabled={saving} size="text-2xl sm:text-3xl">
              {saving ? 'Mengirim...' : 'Submit'}
            </FramedButton>
          </div>
        </form>
      </div>
    </section>
  );
}
