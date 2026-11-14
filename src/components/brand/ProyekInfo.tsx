import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ikonKembali from '../../assets/landing/ikon-kembali.svg';
import { openProtectedFile } from '../../services/fileService';
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
  backTo: string;
  children: ReactNode;
}

/** Bagian atas halaman Payment dan Detail (Figma 111:561, 111:614, 116:235). */
export default function ProyekInfo({ title, judul, deskripsi, estimasi, anggaran, documents, backTo, children }: ProyekInfoProps) {
  return (
    <section className="px-3 pb-10 sm:px-6">
      <div className="relative mx-auto max-w-6xl rounded-[30px] bg-coal-deep px-5 pb-6 pt-5 sm:px-8">
        <Link to={backTo} aria-label="Kembali" className="absolute left-5 top-6 transition-transform hover:-translate-x-1 sm:left-8">
          <img alt="" className="h-7 w-auto sm:h-9" src={ikonKembali} />
        </Link>
        <h1 className="text-center font-magic text-4xl uppercase text-flame sm:text-5xl">{title}</h1>

        <h2 className="mt-6 font-magic text-2xl uppercase text-flame sm:text-4xl">{judul}</h2>
        <p className="mt-2 whitespace-pre-wrap text-justify font-moon text-lg leading-relaxed text-cream sm:text-xl">{deskripsi}</p>
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-1 font-moon text-lg sm:text-xl">
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

        <p className="mt-5 font-moon text-lg text-flame sm:text-xl">Document Pendukung</p>
        {documents.length === 0 ? (
          <p className="mt-2 font-moon text-base text-cream/70">Tidak ada dokumen pendukung.</p>
        ) : (
          <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => void openProtectedFile(`/files/dokumen/${doc.id}`, doc.namaFile)}
                className={`${dashedBox} truncate bg-white px-4 py-4 font-moon text-lg text-flame transition-transform hover:-translate-y-0.5`}
                title={doc.namaFile}
              >
                {doc.namaFile}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 rounded-[30px] bg-cream p-4 sm:p-6">{children}</div>
      </div>
    </section>
  );
}
