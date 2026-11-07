import { Link } from 'react-router-dom';
import DataState from '../../components/DataState';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { listPortfolios, listServices } from '../../services/catalogService';
import { rupiah } from '../../utils/format';

export default function KatalogPublikPage() {
  const { user } = useAuth();
  const services = useData(listServices);
  const portfolios = useData(listPortfolios);

  return (
    <>
      <section className="hero-grid px-4 py-16 text-center sm:py-24">
        <h1 className="text-4xl font-extrabold sm:text-6xl">
          Solusi Digital dari <span className="text-accent">Neo Telemetri</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-muted">
          Pilih jasa yang Anda butuhkan, kirim pesanan, lalu pantau perkembangan proyek Anda kapan saja.
        </p>
      </section>

      <section id="jasa" className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Layanan</p>
        <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Daftar Jasa</h2>
        <div className="mt-4">
          <DataState loading={services.loading} error={services.error} />
          {services.data?.length === 0 && <p className="text-muted">Belum ada jasa yang ditampilkan.</p>}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.data?.map((service) => (
            <article key={service.id} className="flex flex-col rounded-2xl border border-line bg-surface p-5">
              <h3 className="text-lg font-bold">{service.nama}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{service.deskripsi}</p>
              <p className="mt-4 text-sm font-medium">
                {rupiah(service.hargaMin)} sampai {rupiah(service.hargaMax)}
              </p>
              <p className="text-sm text-muted">Perkiraan {service.estimasiHari} hari</p>
              {(!user || user.role === 'KLIEN') && (
                <Link
                  to={`${user ? '/portal/pesan' : '/daftar'}?jasa=${service.id}`}
                  className="mt-4 self-start rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
                >
                  Pesan jasa ini
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      {Boolean(portfolios.data?.length) && (
        <section className="mx-auto max-w-5xl px-4 pb-14 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Karya</p>
          <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Portofolio</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portfolios.data?.map((item) => (
              <article key={item.id} className="rounded-2xl border border-line bg-surface p-5">
                <h3 className="font-bold">{item.judul}</h3>
                <p className="mt-1 text-sm text-muted">{item.deskripsi}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
