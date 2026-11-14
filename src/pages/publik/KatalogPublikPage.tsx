import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import logo from '../../assets/landing/logo-hitam.webp';
import { FramedLink, OutlinedTitle } from '../../components/brand/Brand';
import SiteFooter from '../../components/brand/SiteFooter';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { listPortfolios, listServices } from '../../services/catalogService';
import { homePath } from '../../utils/navigation';
import { rupiahPendek } from '../../utils/format';

// Daftar Jasa publik (tombol LETS MAKE A PROJECT di landing). Tidak ada di Figma; mengikuti gaya halaman klien.
// Pesan jasa ini: pengunjung ke Sign In, klien langsung ke form pengajuan dengan jasa terpilih.

function Header() {
  const { user } = useAuth();
  const target = !user
    ? { to: '/login', label: 'Sign In' }
    : user.role === 'KLIEN'
      ? { to: '/portal/proyek', label: 'Project Saya' }
      : { to: homePath(user.role), label: 'Dashboard' };
  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 pb-2 pt-3 sm:px-5">
      <Link to="/" className="min-w-0 justify-self-start" aria-label="Neo Telemetri, beranda">
        <img alt="Neo Telemetri, IT For The Future" className="h-auto max-h-11 w-full max-w-[280px] object-contain" src={logo} />
      </Link>
      <Link to="/" className="flex flex-col items-end leading-none">
        <OutlinedTitle as="p" className="text-[clamp(1.5rem,min(7vh,10vw),3.75rem)] tracking-[0.12em]">
          SIMPK
        </OutlinedTitle>
        <span className="mt-0.5 font-moon text-[10px] tracking-[0.12em] text-flame sm:text-xs">by neotelemetri</span>
      </Link>
      <div className="justify-self-end">
        <FramedLink to={target.to} size="text-[clamp(0.9rem,2.4vh,1.5rem)]">
          {target.label}
        </FramedLink>
      </div>
    </header>
  );
}

export default function KatalogPublikPage() {
  const { user } = useAuth();
  const services = useData(listServices);
  const portfolios = useData(listPortfolios);
  const bisaPesan = !user || user.role === 'KLIEN';

  return (
    <div className="bg-cream text-coal-deep">
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1 px-3 pb-10 sm:px-6">
          <section className="mx-auto max-w-6xl rounded-[30px] bg-coal-deep p-5 sm:p-8">
            <h1 className="text-center font-magic text-4xl uppercase text-flame sm:text-5xl">Daftar Jasa</h1>
            <p className="mx-auto mt-2 max-w-2xl text-center font-moon text-lg text-cream sm:text-xl">
              Pilih jasa yang Anda butuhkan, ajukan project, lalu pantau perkembangannya kapan saja.
            </p>

            {services.loading && !services.data ? (
              <p className="py-10 text-center font-moon text-xl text-cream/80">Memuat...</p>
            ) : services.error ? (
              <p role="alert" className="py-10 text-center font-moon text-xl text-[#ff8a8a]">
                {services.error}
              </p>
            ) : !services.data?.length ? (
              <p className="py-10 text-center font-moon text-xl text-cream/80">Belum ada jasa yang ditampilkan.</p>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {services.data.map((service, index) => (
                  <motion.article
                    key={service.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index, 8) * 0.06, duration: 0.4 }}
                    className="flex flex-col rounded-[24px] border-[3px] border-flame bg-cream p-5"
                  >
                    <h2 className="font-magic text-2xl uppercase leading-tight text-flame">{service.nama}</h2>
                    <p className="mt-2 flex-1 whitespace-pre-wrap font-moon text-base text-coal-deep">{service.deskripsi}</p>
                    <dl className="mt-4 font-moon text-base">
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="text-flame">Perkiraan biaya :</dt>
                        <dd>
                          {rupiahPendek(service.hargaMin)} - {rupiahPendek(service.hargaMax)}
                        </dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-flame">Perkiraan waktu :</dt>
                        <dd>{service.estimasiHari} hari</dd>
                      </div>
                    </dl>
                    {bisaPesan && (
                      <Link
                        to={`${user ? '/portal/pesan' : '/daftar'}?jasa=${service.id}`}
                        className="mt-4 self-start rounded-[24px] bg-flame px-6 py-2 font-moon text-lg text-coal transition-colors hover:bg-[#e05600]"
                      >
                        Pesan jasa ini
                      </Link>
                    )}
                  </motion.article>
                ))}
              </div>
            )}

            {bisaPesan && (
              <p className="mt-6 text-center font-moon text-base text-cream/80">
                Kebutuhan Anda tidak ada di daftar?{' '}
                <Link to={user ? '/portal/pesan' : '/daftar'} className="text-flame underline underline-offset-4">
                  Ajukan project lain
                </Link>
              </p>
            )}
          </section>

          {Boolean(portfolios.data?.length) && (
            <section className="mx-auto mt-6 max-w-6xl rounded-[30px] bg-coal-deep p-5 sm:p-8">
              <h2 className="text-center font-magic text-3xl uppercase text-flame sm:text-4xl">Portofolio</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {portfolios.data?.map((item) => (
                  <article key={item.id} className="rounded-[24px] border-[3px] border-flame bg-cream p-5">
                    <h3 className="font-magic text-xl uppercase text-flame">{item.judul}</h3>
                    <p className="mt-1 font-moon text-base text-coal-deep">{item.deskripsi}</p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
