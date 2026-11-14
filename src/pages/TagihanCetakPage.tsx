import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../assets/landing/logo-hitam.webp';
import { useCurrentUser } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { getOrder } from '../services/orderService';
import { getPengaturan } from '../services/pengaturanService';
import { rupiahPendek, tanggal } from '../utils/format';

// Tagihan siap cetak atau simpan PDF lewat fitur cetak browser (FR-12, UC-16, Charter Tujuan 4).
// Dibuka klien pemilik pesanan dan pengurus; data diambil dari detail pesanan yang sudah dibatasi hak aksesnya.

function Baris({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-32 shrink-0 text-neutral-500">{label}</dt>
      <dd className="text-neutral-900">{value}</dd>
    </div>
  );
}

export default function TagihanCetakPage() {
  const params = useParams();
  const orderId = Number(params.orderId);
  const invoiceId = Number(params.invoiceId);
  const navigate = useNavigate();
  const user = useCurrentUser();
  const load = useCallback(() => getOrder(orderId), [orderId]);
  const { data: order, loading, error } = useData(load);
  // Identitas dan rekening Neo Telemetri dari halaman Pengaturan Marketing.
  const { data: neo, error: neoError } = useData(getPengaturan);
  const invoice = order?.invoices.find((item) => item.id === invoiceId);

  // Nama berkas PDF bawaan saat disimpan mengikuti judul halaman.
  useEffect(() => {
    if (!invoice) return;
    const lama = document.title;
    document.title = `Tagihan ${invoice.nomor}`;
    return () => {
      document.title = lama;
    };
  }, [invoice]);

  if ((loading && !order) || (!neo && !neoError)) return <p className="grid min-h-dvh place-items-center bg-cream font-moon text-xl">Memuat...</p>;
  if (error || neoError || !order || !invoice || !neo) {
    return (
      <p role="alert" className="grid min-h-dvh place-items-center bg-cream p-6 text-center font-moon text-xl text-[#9c2b2b]">
        {error || neoError || 'Tagihan tidak ditemukan.'}
      </p>
    );
  }

  const diterima = invoice.payments.filter((p) => p.statusVerifikasi === 'DITERIMA');
  const dibayar = diterima.reduce((n, p) => n + Number(p.jumlah), 0);
  const sisa = Math.max(Number(invoice.total) - dibayar, 0);
  const lunas = invoice.status === 'LUNAS';
  const batal = invoice.status === 'DIBATALKAN';
  const judul = order.judul || order.nomor;
  const kembali = user.role === 'KLIEN' ? `/portal/proyek/${order.id}/payment` : `/app/request/${order.id}/payment`;

  return (
    <div className="min-h-dvh bg-neutral-200 py-6 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-4 flex max-w-[210mm] flex-wrap items-center justify-between gap-3 px-4">
        <button type="button" onClick={() => navigate(kembali)} className="rounded-[20px] border-2 border-coal px-5 py-2 font-moon text-base text-coal hover:bg-coal hover:text-flame">
          ← Kembali
        </button>
        <div className="flex items-center gap-3">
          <span className="hidden font-moon text-sm text-neutral-600 sm:inline">Pilih "Simpan sebagai PDF" pada jendela cetak untuk menyimpan.</span>
          <button type="button" onClick={() => window.print()} className="rounded-[20px] bg-flame px-6 py-2 font-moon text-lg text-coal hover:bg-[#e05600]">
            Cetak / Simpan PDF
          </button>
        </div>
      </div>

      <article className="mx-auto max-w-[210mm] bg-white p-[12mm] font-poppins text-[13px] leading-relaxed text-neutral-900 shadow-lg print:max-w-none print:p-0 print:shadow-none">
        {neo.contoh && (
          <p className="mb-5 border-2 border-dashed border-[#9c2b2b] px-3 py-2 text-center text-[12px] font-semibold text-[#9c2b2b]">
            CONTOH: identitas dan rekening Neo Telemetri pada tagihan ini masih data contoh (belum diisi Marketing di menu Pengaturan). Jangan melakukan transfer ke rekening ini.
          </p>
        )}

        {batal && (
          <p className="mb-5 border-2 border-neutral-500 px-3 py-2 text-center text-[12px] font-semibold text-neutral-700">
            Tagihan ini DIBATALKAN dan tidak perlu dibayar.{invoice.alasanBatal ? ` Alasan: ${invoice.alasanBatal}` : ''}
          </p>
        )}

        <header className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-flame pb-5">
          <div>
            <img src={logo} alt="Neo Telemetri" className="h-12 w-auto" />
            <p className="mt-3 font-semibold">{neo.nama}</p>
            <p className="max-w-[80mm] text-neutral-600">{neo.alamat}</p>
            <p className="text-neutral-600">
              {neo.telepon} · {neo.email}
            </p>
          </div>
          <div className="text-right">
            <h1 className="font-magic text-[40px] uppercase leading-none tracking-wide text-flame">Tagihan</h1>
            <dl className="mt-3 space-y-0.5 text-[12px]">
              <div>
                <dt className="inline text-neutral-500">Nomor: </dt>
                <dd className="inline font-semibold">{invoice.nomor}</dd>
              </div>
              <div>
                <dt className="inline text-neutral-500">Tanggal terbit: </dt>
                <dd className="inline">{tanggal(invoice.tglTerbit)}</dd>
              </div>
              <div>
                <dt className="inline text-neutral-500">Jatuh tempo: </dt>
                <dd className="inline">{tanggal(invoice.jatuhTempo)}</dd>
              </div>
            </dl>
            <p
              className={`mt-3 inline-block border-2 px-3 py-1 text-[12px] font-bold uppercase tracking-wider ${
                lunas ? 'border-[#14aa00] text-[#14aa00]' : batal ? 'border-neutral-500 text-neutral-500' : 'border-[#9c2b2b] text-[#9c2b2b]'
              }`}
            >
              {lunas ? 'Lunas' : batal ? 'Dibatalkan' : 'Belum lunas'}
            </p>
          </div>
        </header>

        <section className="mt-5 grid gap-6 sm:grid-cols-2 print:grid-cols-2">
          <div>
            <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-flame">Ditagihkan kepada</h2>
            <p className="font-semibold">{order.client.namaInstansi}</p>
            <dl>
              <Baris label="Kontak" value={order.client.user.name} />
              <Baris label="Email" value={order.client.user.email} />
              <Baris label="WhatsApp" value={order.client.noWhatsapp ?? '-'} />
              <Baris label="Alamat" value={order.client.alamat ?? '-'} />
            </dl>
          </div>
          <div>
            <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-flame">Project</h2>
            <p className="font-semibold">{judul}</p>
            <dl>
              <Baris label="Nomor pesanan" value={order.nomor} />
              <Baris label="Nilai kesepakatan" value={rupiahPendek(order.nilaiDisepakati)} />
              {order.project && <Baris label="Kode project" value={order.project.kode} />}
            </dl>
          </div>
        </section>

        <table className="mt-6 w-full border-collapse text-left">
          <thead>
            <tr className="bg-coal text-cream">
              <th className="w-12 px-3 py-2 font-semibold">No</th>
              <th className="px-3 py-2 font-semibold">Uraian</th>
              <th className="w-44 px-3 py-2 text-right font-semibold">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-300">
              <td className="px-3 py-2 align-top">1</td>
              <td className="px-3 py-2">
                {invoice.keterangan}
                <span className="block text-[12px] text-neutral-500">Pembayaran project "{judul}"</span>
              </td>
              <td className="px-3 py-2 text-right align-top">{rupiahPendek(invoice.total)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="px-3 pt-3 text-right font-semibold">
                Total tagihan
              </td>
              <td className="px-3 pt-3 text-right text-[15px] font-bold">{rupiahPendek(invoice.total)}</td>
            </tr>
            <tr>
              <td colSpan={2} className="px-3 text-right text-neutral-600">
                Sudah dibayar
              </td>
              <td className="px-3 text-right text-neutral-600">{rupiahPendek(dibayar)}</td>
            </tr>
            <tr>
              <td colSpan={2} className="px-3 text-right font-semibold">
                Sisa tagihan
              </td>
              <td className="px-3 text-right font-semibold">{rupiahPendek(sisa)}</td>
            </tr>
          </tfoot>
        </table>

        {diterima.length > 0 && (
          <section className="mt-5">
            <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-flame">Pembayaran diterima</h2>
            <ul className="text-[12px]">
              {diterima.map((p) => (
                <li key={p.id}>
                  {rupiahPendek(p.jumlah)}, transfer {tanggal(p.tglTransfer)}
                  {p.verifiedAt ? `, diverifikasi ${tanggal(p.verifiedAt)}` : ''}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-6 grid gap-6 border-t border-neutral-300 pt-5 sm:grid-cols-2 print:grid-cols-2">
          <div>
            <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-flame">Pembayaran ke</h2>
            <dl>
              <Baris label="Bank" value={neo.bank} />
              <Baris label="Nomor rekening" value={neo.nomorRekening} />
              <Baris label="Atas nama" value={neo.atasNama} />
            </dl>
          </div>
          <div className="text-[12px] text-neutral-600">
            <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-flame">Catatan</h2>
            <p>Cantumkan nomor tagihan pada berita transfer. Setelah transfer, unggah bukti pembayaran di SIMPK pada halaman Payment project ini agar dapat diperiksa Marketing.</p>
          </div>
        </section>

        <p className="mt-8 border-t border-neutral-200 pt-3 text-center text-[11px] text-neutral-500">
          Dokumen ini dibuat oleh SIMPK Neo Telemetri pada {tanggal(new Date().toISOString())} dan sah tanpa tanda tangan.
        </p>
      </article>
    </div>
  );
}
