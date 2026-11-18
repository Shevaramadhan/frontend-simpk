import { useEffect, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';
import { listTestimonials } from '../../services/dashboardService';
import type { Testimonial } from '../../types';
import { StarsView } from '../brand/Stars';
import { DrawLine, Reveal, SplitWords } from './Motion';
import { Framed } from './Parts';

// Ulasan klien yang bergerak ke samping, di antara Our Project dan Our Journey With Client (masukan PM 18 Nov).
// Data dari SIMPK: hanya ulasan yang klien izinkan tampil (GET /testimonials, B-41 backend). Selama belum ada ulasan
// yang disetujui, bagian ini berisi ajakan menjadi klien pertama (masukan PM) dan otomatis berganti menjadi ulasan
// bergerak begitu ada yang disetujui.
// Bergerak hanya bila ulasan cukup banyak (MIN_BERGERAK); sedikit ulasan tampil diam di tengah tanpa diulang
// (masukan PM: satu ulasan yang diulang tampak seperti spam).
// WCAG 2.2.2 tanpa tombol Jeda (masukan PM): gerakan berhenti saat diarahkan kursor, disentuh, atau difokus
// keyboard (pita dapat difokus dengan Tab), dan "kurangi gerakan" menampilkan daftar diam tanpa animasi.

const MIN_BERGERAK = 4;
/** Kartu per salinan pita agar pita lebih lebar dari layar lebar saat bergerak. */
const KARTU_PER_SALINAN = 8;

function Kartu({ ulasan }: { ulasan: Testimonial }) {
  return (
    <figure className="flex w-[clamp(220px,17vw,290px)] shrink-0 flex-col rounded-[20px] bg-coal p-[clamp(14px,1.1vw,18px)] text-cream shadow-[0_12px_24px_-14px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between">
        <span aria-hidden="true" className="font-magic text-3xl leading-none text-flame">
          &ldquo;
        </span>
        <StarsView value={ulasan.rating} size="size-4" />
      </div>
      <blockquote className="mt-1 line-clamp-4 flex-1 font-body text-[clamp(13px,0.95vw,15px)] leading-relaxed">{ulasan.komentar}</blockquote>
      <figcaption className="mt-3 border-t-2 border-cream/20 pt-2">
        <span className="block font-magic text-lg uppercase leading-tight text-flame">{ulasan.nama}</span>
        {ulasan.instansi && ulasan.instansi !== ulasan.nama && <span className="block font-body text-xs text-cream/80">{ulasan.instansi}</span>}
      </figcaption>
    </figure>
  );
}

// --s: satu px artboard dalam ukuran layar, sama dengan skala Stage judul lain (min(lebar/1440, tinggi/1024)),
// sehingga di layar lebar judul, garis, dan jaraknya sama persis dengan Our Journey With Client.
const SKALA = { '--s': 'min(calc(var(--vw) * 1px / 1440), calc(100dvh / 1024))' } as CSSProperties;
const SECTION_CLASS = 'bg-cream pb-10 pt-8 lg:pb-[calc(var(--s)*56)] lg:pt-[calc(var(--s)*59)]';

/** Judul bergaya dan berukuran sama dengan Our Journey With Client (64 px artboard, garis 1215 x 10). */
function Judul() {
  return (
    <div className="px-4 lg:px-0">
      <h2
        id="judul-ulasan"
        className="text-center font-magic text-[7.4vw] uppercase leading-tight tracking-wide text-flame sm:text-5xl lg:text-[calc(var(--s)*64)] lg:leading-[normal] lg:tracking-[calc(var(--s)*3.2)]"
      >
        <SplitWords text="What Our Clients Say" />
      </h2>
      <DrawLine className="mx-auto mt-2 h-1.5 bg-coal sm:h-2.5 lg:mt-[calc(var(--s)*6)] lg:h-[calc(var(--s)*10)] lg:w-[calc(var(--s)*1215)]" />
    </div>
  );
}

/** Belum ada ulasan yang disetujui tampil: ajakan menjadi klien pertama. */
function Kosong() {
  return (
    <section aria-labelledby="judul-ulasan" className={SECTION_CLASS} style={SKALA}>
      <Judul />
      <Reveal y={30} className="mx-auto mt-8 max-w-2xl px-4">
        <div className="rounded-[24px] border-[3px] border-dashed border-coal-deep/40 px-6 py-[clamp(24px,3vw,40px)] text-center">
          <div aria-hidden="true">
            <StarsView value={0} size="size-7" />
          </div>
          <p className="mt-3 font-magic text-[clamp(1.4rem,2.4vw,2rem)] uppercase leading-tight text-coal-deep">Belum ada ulasan</p>
          <p className="mx-auto mt-2 max-w-md font-body text-[clamp(15px,1.15vw,18px)] leading-relaxed text-coal-deep">
            Jadilah klien pertama kami dan bagikan pengalaman Anda bekerja bersama Neo Telemetri.
          </p>
          <Link to="/katalog" className="group mt-5 inline-block transition-transform hover:-translate-y-0.5">
            <Framed>
              <span className="block px-6 py-2 font-magic text-[clamp(1.1rem,1.6vw,1.5rem)] uppercase text-flame transition-colors group-hover:text-cream">
                Lets Make A Project
              </span>
            </Framed>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

export default function UlasanSection() {
  // null: masih dimuat (tidak menampilkan apa pun agar tidak berkedip).
  const [ulasan, setUlasan] = useState<Testimonial[] | null>(null);
  const kurangiGerak = useReducedMotion();

  useEffect(() => {
    let batal = false;
    listTestimonials()
      .then((data) => !batal && setUlasan(data))
      .catch(() => !batal && setUlasan([]));
    return () => {
      batal = true;
    };
  }, []);

  if (ulasan === null) return null;
  if (!ulasan.length) return <Kosong />;

  // Pita diisi ulang sampai lebih lebar dari layar, lalu digandakan untuk putaran tanpa sambungan.
  const isi = Array.from({ length: Math.ceil(KARTU_PER_SALINAN / ulasan.length) }, () => ulasan).flat();
  const diam = kurangiGerak || ulasan.length < MIN_BERGERAK;

  return (
    <section aria-labelledby="judul-ulasan" className={SECTION_CLASS} style={SKALA}>
      <Judul />

      {diam ? (
        // Sedikit ulasan atau "kurangi gerakan": kartu diam di tengah, dapat digulir bila tidak muat.
        <ul aria-label="Ulasan klien" className="mx-auto mt-8 flex w-fit max-w-full gap-5 overflow-x-auto px-4 pb-4">
          {ulasan.map((item) => (
            <li key={item.id} className="flex">
              <Reveal y={24} className="flex">
                <Kartu ulasan={item} />
              </Reveal>
            </li>
          ))}
        </ul>
      ) : (
        <Reveal y={30}>
          {/* Dapat difokus agar pengguna keyboard dapat menghentikan gerakan (berhenti saat :focus-within). */}
          <div
            tabIndex={0}
            role="region"
            aria-label="Ulasan klien, berhenti bergerak saat difokus"
            className="marquee relative mt-8 overflow-hidden py-2 outline-none [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] focus-visible:ring-3 focus-visible:ring-flame-ink focus-visible:ring-inset"
          >
            <div className="marquee-track flex w-max gap-5">
              {[0, 1].map((salinan) => (
                <ul
                  key={salinan}
                  aria-label={salinan ? undefined : 'Ulasan klien'}
                  aria-hidden={salinan ? true : undefined}
                  className="flex gap-5"
                >
                  {isi.map((item, index) => (
                    // Salinan kedua dan ulangan hanya untuk tampilan, disembunyikan dari pembaca layar.
                    <li key={`${item.id}-${index}`} className="flex" aria-hidden={!salinan && index >= ulasan.length ? true : undefined}>
                      <Kartu ulasan={item} />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}
