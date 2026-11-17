import { useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useCurrentUser } from '../../hooks/useAuth';
import { errorMessage } from '../../services/apiConfig';
import { openProtectedFile } from '../../services/fileService';
import { addDocuments, deleteDocument } from '../../services/orderService';
import type { OrderDocument } from '../../types';
import { rupiahPendek, tanggalPendek } from '../../utils/format';

interface ProyekInfoProps {
  title: string;
  judul: string;
  deskripsi: string;
  estimasi: string | null;
  /** Anggaran klien; kosongkan (undefined) untuk peran yang tidak berhak melihat data uang. */
  anggaran?: string | null;
  documents: OrderDocument[];
  /** Isi bila pengguna boleh menambah dokumen (B-37); tanpa ini dokumen hanya dapat dilihat. */
  kelolaDokumen?: KelolaDokumen;
  backTo: string;
  children: ReactNode;
}

interface KelolaDokumen {
  orderId: number;
  /** Klien: selama pengajuan belum diterima. Marketing: selama pesanan belum ditolak atau dibatalkan. */
  bisaTambah: boolean;
  onChange: () => void;
}

const PERAN: Record<string, string> = { KLIEN: 'Klien', MARKETING: 'Marketing', OPERASIONAL: 'Operasional', TIM: 'Tim' };
const MAX_MB = 5;

function Dokumen({ documents, kelola }: { documents: OrderDocument[]; kelola?: KelolaDokumen }) {
  const user = useCurrentUser();
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [sibuk, setSibuk] = useState(false);
  const bisaHapus = (doc: OrderDocument) => Boolean(kelola) && doc.uploadedById === user.id && (user.role === 'MARKETING' || Boolean(kelola?.bisaTambah));

  async function unggah(list: FileList | null) {
    if (!kelola || !list?.length) return;
    const files = Array.from(list);
    if (input.current) input.current.value = '';
    const besar = files.find((file) => file.size > MAX_MB * 1024 * 1024);
    if (besar) return setError(`${besar.name} lebih dari ${MAX_MB} MB.`);
    setError('');
    setSibuk(true);
    try {
      await addDocuments(kelola.orderId, files);
      kelola.onChange();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSibuk(false);
    }
  }

  async function hapus(doc: OrderDocument) {
    if (!kelola || !window.confirm(`Hapus dokumen "${doc.namaFile}"?`)) return;
    setError('');
    try {
      await deleteDocument(kelola.orderId, doc.id);
      kelola.onChange();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <div className="mt-5 border-t border-zinc-100 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-moon text-sm font-semibold text-zinc-800">Dokumen Pendukung</p>
        {kelola?.bisaTambah && (
          <>
            <input ref={input} id="tambah-dokumen" type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.docx" className="sr-only" onChange={(event) => void unggah(event.target.files)} />
            <label
              htmlFor="tambah-dokumen"
              className={`cursor-pointer rounded-xl border border-flame/30 bg-flame/10 px-3.5 py-1.5 font-moon text-xs font-semibold text-flame transition-colors hover:bg-flame hover:text-white ${sibuk ? 'pointer-events-none opacity-60' : ''}`}
            >
              {sibuk ? 'Mengunggah...' : '+ Tambah Dokumen'}
            </label>
          </>
        )}
      </div>
      {kelola?.bisaTambah && <p className="mt-0.5 font-moon text-xs text-zinc-500">PDF, PNG, JPG, atau DOCX, maksimal {MAX_MB} MB per berkas, paling banyak 10 dokumen.</p>}
      {error && (
        <p role="alert" className="mt-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 font-moon text-xs font-medium text-red-700">
          {error}
        </p>
      )}
      {documents.length === 0 ? (
        <p className="mt-2 font-moon text-xs text-zinc-400">Tidak ada dokumen pendukung.</p>
      ) : (
        <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <div key={doc.id} className="relative rounded-xl border border-zinc-200 bg-zinc-50/70 px-3.5 py-2.5 transition-all hover:border-flame/40 hover:bg-white hover:shadow-xs">
              <button
                type="button"
                onClick={() => void openProtectedFile(`/files/dokumen/${doc.id}`, doc.namaFile)}
                className="block w-full truncate pr-6 text-left font-moon text-sm font-semibold text-zinc-800 hover:text-flame"
                title={doc.namaFile}
              >
                {doc.namaFile}
              </button>
              <p className="mt-0.5 truncate font-moon text-xs text-zinc-500">
                {doc.uploadedBy ? `${PERAN[doc.uploadedBy.role] ?? doc.uploadedBy.role} · ${doc.uploadedBy.name}` : 'Pengunggah tidak diketahui'}
                {doc.uploadedById === user.id ? ' (Anda)' : ''}
              </p>
              {bisaHapus(doc) && (
                <button
                  type="button"
                  onClick={() => void hapus(doc)}
                  aria-label={`Hapus dokumen ${doc.namaFile}`}
                  className="absolute right-2.5 top-2.5 grid size-6 place-items-center rounded-md text-base leading-none text-zinc-400 hover:bg-red-50 hover:text-red-600"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Bagian atas halaman Payment dan Detail dengan kartu putih bersih modern. */
export default function ProyekInfo({ title, judul, deskripsi, estimasi, anggaran, documents, kelolaDokumen, backTo, children }: ProyekInfoProps) {
  return (
    <section className="px-3 pb-8 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-3.5">
            <Link
              to={backTo}
              aria-label="Kembali"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 transition-colors hover:border-flame/40 hover:text-flame"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <p className="font-moon text-xs font-medium uppercase tracking-wider text-zinc-400">{title}</p>
              <h1 className="font-magic text-lg font-bold text-zinc-900 sm:text-xl">{judul}</h1>
            </div>
          </div>

          <p className="mt-3.5 whitespace-pre-wrap text-justify font-moon text-sm leading-relaxed text-zinc-600">{deskripsi}</p>

          <dl className="mt-4 flex flex-wrap gap-3 font-moon text-xs sm:text-sm">
            <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-zinc-50 px-3.5 py-1.5">
              <dt className="text-zinc-500">Estimasi Selesai:</dt>
              <dd className="font-semibold text-zinc-800">{tanggalPendek(estimasi)}</dd>
            </div>
            {anggaran !== undefined && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-zinc-50 px-3.5 py-1.5">
                <dt className="text-zinc-500">Anggaran:</dt>
                <dd className="font-semibold text-flame">{rupiahPendek(anggaran)}</dd>
              </div>
            )}
          </dl>

          <Dokumen documents={documents} kelola={kelolaDokumen} />
        </div>

        <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs sm:p-6">{children}</div>
      </div>
    </section>
  );
}
