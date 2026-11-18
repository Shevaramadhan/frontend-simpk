import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { listTestimonials } from '../../services/dashboardService';
import type { Testimonial } from '../../types';
import { StarsView } from '../brand/Stars';
import { DrawLine, Reveal, SplitWords } from './Motion';

// Ulasan klien yang bergerak ke samping, di antara Our Project dan Our Journey With Client (masukan PM 18 Nov).
// Data dari SIMPK: hanya ulasan yang klien izinkan tampil (GET /testimonials, B-41 backend). Bagian ini tidak tampil
// selama belum ada ulasan yang disetujui. Menu TESTI mengarah ke pembungkus ulasan dan Our Journey (LandingPage),
// jadi tetap menuju ulasan bila ada dan ke Our Journey bila belum.
// WCAG 2.2.2: gerakan berhenti saat diarahkan atau difokus, ada tombol Jeda, dan "kurangi gerakan" menampilkan
// daftar yang dapat digulir tanpa animasi.

const MIN_KARTU = 6;

function Kartu({ ulasan }: { ulasan: Testimonial }) {
  return (
    <figure className="flex w-[clamp(260px,26vw,380px)] shrink-0 flex-col rounded-[24px] bg-coal p-[clamp(18px,1.6vw,26px)] text-cream shadow-[0_14px_28px_-14px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between">
        <span aria-hidden="true" className="font-magic text-5xl leading-none text-flame">
          &ldquo;
        </span>
        <StarsView value={ulasan.rating} size="size-5" />
      </div>
      <blockquote className="mt-2 line-clamp-5 flex-1 font-body text-[clamp(14px,1.05vw,16px)] leading-relaxed">{ulasan.komentar}</blockquote>
      <figcaption className="mt-4 border-t-2 border-cream/20 pt-3">
        <span className="block font-magic text-xl uppercase leading-tight text-flame">{ulasan.nama}</span>
        {ulasan.instansi && ulasan.instansi !== ulasan.nama && <span className="block font-body text-sm text-cream/80">{ulasan.instansi}</span>}
      </figcaption>
    </figure>
  );
}

export default function UlasanSection() {
  const [ulasan, setUlasan] = useState<Testimonial[]>([]);
  const [jeda, setJeda] = useState(false);
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

  if (!ulasan.length) return null;

  // Sedikit ulasan diulang agar pita penuh, lalu digandakan untuk putaran tanpa sambungan.
  const isi = Array.from({ length: Math.max(1, Math.ceil(MIN_KARTU / ulasan.length)) }, () => ulasan).flat();

  return (
    <section aria-labelledby="judul-ulasan" className="bg-cream pb-[clamp(36px,4.5vw,64px)] pt-[clamp(36px,4.5vw,64px)]">
      <div className="mx-auto max-w-[1215px] px-4">
        {/* Gaya judul sama dengan Our Journey With Client. */}
        <h2 id="judul-ulasan" className="text-center font-magic text-[clamp(2rem,4.4vw,4rem)] uppercase leading-tight tracking-[0.05em] text-flame">
          <SplitWords text="What Our Clients Say" />
        </h2>
        <DrawLine className="mt-2 h-[clamp(6px,0.7vw,10px)] bg-coal" />
      </div>

      {kurangiGerak ? (
        <ul aria-label="Ulasan klien" className="mt-8 flex gap-6 overflow-x-auto px-4 pb-4">
          {ulasan.map((item) => (
            <li key={item.id} className="flex">
              <Kartu ulasan={item} />
            </li>
          ))}
        </ul>
      ) : (
        <Reveal y={30}>
          <div className="marquee relative mt-8 overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
            <div className="marquee-track flex w-max gap-6" style={{ animationPlayState: jeda ? 'paused' : undefined }}>
              {[0, 1].map((salinan) => (
                <ul
                  key={salinan}
                  aria-label={salinan ? undefined : 'Ulasan klien'}
                  aria-hidden={salinan ? true : undefined}
                  className="flex gap-6"
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
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              aria-pressed={jeda}
              onClick={() => setJeda((value) => !value)}
              className="rounded-full border-2 border-coal-deep px-4 py-1 font-body text-sm font-semibold text-coal-deep transition-colors hover:bg-coal-deep hover:text-cream"
            >
              {jeda ? 'Putar ulasan' : 'Jeda ulasan'}
            </button>
          </div>
        </Reveal>
      )}
    </section>
  );
}
