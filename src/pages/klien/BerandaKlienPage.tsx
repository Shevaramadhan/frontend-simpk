import type { CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';
import { FramedLink } from '../../components/brand/Brand';
import { Reveal } from '../../components/landing/Motion';
import { PROJECTS, type Project } from '../../data/portofolio';

// Figma "Landing Page Client": galeri karya bergerak ke samping, lalu ajakan membuat project.
// Semua ukuran mengikuti tinggi layar (--c = lebar kartu) agar beranda muat satu layar tanpa digulir.
const CARD: CSSProperties = { ['--c' as string]: 'clamp(170px, min(33vh, 58vw), 340px)' };

function Card({ project }: { project: Project }) {
  return (
    <article className="group relative flex h-[calc(var(--c)*0.8)] w-[var(--c)] shrink-0 flex-col justify-end rounded-[24px] bg-coal-deep px-[calc(var(--c)*0.06)] pb-[calc(var(--c)*0.06)]">
      <div className="absolute left-1/2 top-[calc(var(--c)*-0.17)] -translate-x-1/2 rotate-[30deg] transition-transform duration-300 group-hover:rotate-[22deg] group-hover:scale-105">
        <div className="relative h-[calc(var(--c)*0.34)] w-[calc(var(--c)*0.66)] overflow-hidden rounded-[18px] border-[3px] border-flame shadow-[0px_4px_25px_0px_rgba(0,0,0,0.75)]">
          <img alt="" className="size-full object-cover" src={project.image} />
        </div>
      </div>
      <h3 className="truncate font-magic text-[calc(var(--c)*0.075)] uppercase leading-tight text-flame">{project.title}</h3>
      {/* Tinggi deskripsi dikunci empat baris agar semua kartu sama besar. */}
      <p className="mt-1 line-clamp-4 h-[calc(var(--c)*0.045*1.35*4)] font-moon text-[calc(var(--c)*0.045)] leading-[1.35] text-cream">{project.description}</p>
    </article>
  );
}

function Marquee() {
  const reduced = useReducedMotion();
  // Ruang atas cukup untuk gambar miring agar tidak terpotong.
  const frame = 'pt-[calc(var(--c)*0.3)] pb-2';
  if (reduced) {
    return (
      <div className={`flex gap-6 overflow-x-auto px-4 ${frame}`} style={CARD}>
        {PROJECTS.map((project) => (
          <Card key={project.id} project={project} />
        ))}
      </div>
    );
  }
  // Daftar digandakan agar gerakan berulang tanpa jeda; berhenti saat disentuh kursor.
  return (
    <div className={`marquee overflow-hidden ${frame}`} style={CARD} aria-label="Karya Neo Telemetri">
      <div className="marquee-track flex w-max gap-6 pr-6">
        {[...PROJECTS, ...PROJECTS].map((project, index) => (
          <div key={`${project.id}-${index}`} aria-hidden={index >= PROJECTS.length}>
            <Card project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BerandaKlienPage() {
  return (
    <section className="flex h-full flex-col justify-evenly gap-[clamp(8px,2vh,24px)] pb-[clamp(8px,2.5vh,28px)]">
      <h1 className="sr-only">Beranda klien SIMPK</h1>
      <Marquee />
      <Reveal y={24} className="mx-auto max-w-3xl px-5 text-center">
        <p className="font-moon text-[clamp(13px,min(2.6vh,4vw),22px)] leading-relaxed text-flame">
          Projek-projek yang telah disiapkan oleh kami dari NEO TELEMETRI sesuai dengan kebutuhan serta keinginan client, sehingga website yang dibuat dapat
          digunakan dengan nyaman dan sesuai dengan tujuan dibuatnya website tersebut.
        </p>
        <p className="mt-[clamp(6px,1.8vh,20px)] flex flex-wrap items-center justify-center gap-2 font-moon text-[clamp(13px,min(2.6vh,4vw),22px)] text-flame">
          Jadi tunggu apa lagi?
          <span className="rounded-2xl bg-coal px-3 py-1 font-magic text-[clamp(11px,min(2.2vh,3.4vw),18px)] uppercase">Lets make a project with Neo Telemetri</span>
        </p>
      </Reveal>
      <Reveal y={30} delay={0.15} className="flex justify-center">
        <FramedLink to="/portal/proyek" size="text-[clamp(1.1rem,min(4vh,6vw),1.875rem)]">
          Lets Make A project
        </FramedLink>
      </Reveal>
    </section>
  );
}
