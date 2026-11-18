import { useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ikonKembali from '../../assets/landing/ikon-kembali.svg';
import { useCurrentUser } from '../../hooks/useAuth';
import { errorMessage } from '../../services/apiConfig';
import { openProtectedFile } from '../../services/fileService';
import { addDocuments, deleteDocument } from '../../services/orderService';
import type { OrderDocument } from '../../types';
import { rupiahPendek, tanggalPendek } from '../../utils/format';
import { dashedBox } from './Brand';

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

// Daftar dokumen pendukung dengan pengunggahnya; pengunggah dapat menghapus dokumennya selama masih diizinkan.
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
    <>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="font-body text-lg text-flame sm:text-xl">Document Pendukung</p>
        {kelola?.bisaTambah && (
          <>
            <input ref={input} id="tambah-dokumen" type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.docx" className="sr-only" onChange={(event) => void unggah(event.target.files)} />
            <label
              htmlFor="tambah-dokumen"
              className={`cursor-pointer rounded-[20px] border-2 border-flame px-4 py-1 font-body text-base text-flame hover:bg-flame hover:text-coal ${sibuk ? 'pointer-events-none opacity-60' : ''}`}
            >
              {sibuk ? 'Mengunggah...' : '+ Tambah Dokumen'}
            </label>
          </>
        )}
      </div>
      {kelola?.bisaTambah && <p className="font-body text-xs text-cream/60">PDF, PNG, JPG, atau DOCX, maksimal {MAX_MB} MB per berkas, paling banyak 10 dokumen.</p>}
      {error && (
        <p role="alert" className="mt-2 rounded-xl bg-[#9c2b2b] px-4 py-2 font-body text-base text-cream">
          {error}
        </p>
      )}
      {documents.length === 0 ? (
        <p className="mt-2 font-body text-base text-cream/70">Tidak ada dokumen pendukung.</p>
      ) : (
        <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <div key={doc.id} className={`${dashedBox} relative bg-white px-4 py-3 transition-transform hover:-translate-y-0.5`}>
              <button type="button" onClick={() => void openProtectedFile(`/files/dokumen/${doc.id}`, doc.namaFile)} className="block w-full truncate pr-6 text-left font-body text-lg text-flame-ink" title={doc.namaFile}>
                {doc.namaFile}
              </button>
              <p className="truncate font-body text-xs text-coal-deep/70">
                {doc.uploadedBy ? `${PERAN[doc.uploadedBy.role] ?? doc.uploadedBy.role} · ${doc.uploadedBy.name}` : 'Pengunggah tidak diketahui'}
                {doc.uploadedById === user.id ? ' (Anda)' : ''}
              </p>
              {bisaHapus(doc) && (
                <button
                  type="button"
                  onClick={() => void hapus(doc)}
                  aria-label={`Hapus dokumen ${doc.namaFile}`}
                  className="absolute right-3 top-3 font-magic text-xl leading-none text-coal-deep/70 hover:text-[#9c2b2b]"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/** Bagian atas halaman Payment dan Detail (Figma 111:561, 111:614, 116:235). */
export default function ProyekInfo({ title, judul, deskripsi, estimasi, anggaran, documents, kelolaDokumen, backTo, children }: ProyekInfoProps) {
  return (
    <section className="px-3 pb-10 sm:px-6">
      <div className="relative mx-auto max-w-6xl rounded-[30px] bg-coal-deep px-5 pb-6 pt-5 sm:px-8">
        <Link to={backTo} aria-label="Kembali" className="absolute left-5 top-6 transition-transform hover:-translate-x-1 sm:left-8">
          <img alt="" className="h-7 w-auto sm:h-9" src={ikonKembali} />
        </Link>
        <h1 className="text-center font-magic text-4xl uppercase text-flame sm:text-5xl">{title}</h1>

        <h2 className="mt-6 font-magic text-2xl uppercase text-flame sm:text-4xl">{judul}</h2>
        <p className="mt-2 whitespace-pre-wrap text-justify font-body text-lg leading-relaxed text-cream sm:text-xl">{deskripsi}</p>
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-1 font-body text-lg sm:text-xl">
          <div className="flex gap-2">
            <dt className="text-flame">Estimasi Selesai :</dt>
            <dd className="text-cream">{tanggalPendek(estimasi)}</dd>
          </div>
          {anggaran !== undefined && (
            <div className="flex gap-2">
              <dt className="text-flame">Anggaran :</dt>
              <dd className="text-cream">{rupiahPendek(anggaran)}</dd>
            </div>
          )}
        </dl>

        <Dokumen documents={documents} kelola={kelolaDokumen} />

        <div className="mt-6 rounded-[30px] bg-cream p-4 sm:p-6">{children}</div>
      </div>
    </section>
  );
}
