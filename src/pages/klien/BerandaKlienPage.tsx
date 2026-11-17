import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';
import { Reveal } from '../../components/landing/Motion';
import { PROJECTS, type Project } from '../../data/portofolio';

const CARD: CSSProperties = { ['--c' as string]: 'clamp(180px, min(33vh, 58vw), 320px)' };

function Card({ project }: { project: Project }) {
  return (
    <article className="group relative flex h-[calc(var(--c)*0.82)] w-[var(--c)] shrink-0 flex-col justify-end rounded-2xl border border-zinc-200/90 bg-white px-[calc(var(--c)*0.06)] pb-[calc(var(--c)*0.06)] shadow-sm transition-shadow hover:shadow-md">
      <div className="absolute left-1/2 top-[calc(var(--c)*-0.16)] -translate-x-1/2 rotate-[18deg] transition-transform duration-300 group-hover:rotate-[10deg] group-hover:scale-105">
        <div className="relative h-[calc(var(--c)*0.34)] w-[calc(var(--c)*0.66)] overflow-hidden rounded-xl border-2 border-flame shadow-lg">
          <img alt="" className="size-full object-cover" src={project.image} />
        </div>
      </div>
      <h3 className="truncate font-magic text-[calc(var(--c)*0.062)] font-bold leading-snug text-zinc-900">{project.title}</h3>
      <p className="mt-1 line-clamp-4 h-[calc(var(--c)*0.042*1.4*4)] font-moon text-[calc(var(--c)*0.042)] leading-[1.4] text-zinc-600">{project.description}</p>
    </article>
  );
}

function Marquee() {
  const reduced = useReducedMotion();
  const frame = 'pt-[calc(var(--c)*0.28)] pb-2';
  if (reduced) {
    return (
      <div className={`flex gap-6 overflow-x-auto px-4 ${frame}`} style={CARD}>
        {PROJECTS.map((project) => (
          <Card key={project.id} project={project} />
        ))}
      </div>
    );
  }
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
    <section className="flex h-full flex-col justify-evenly gap-[clamp(10px,2vh,24px)] pb-[clamp(12px,2.5vh,28px)]">
      <h1 className="sr-only">Beranda klien SIMPK</h1>
      <Marquee />
      <Reveal y={20} className="mx-auto max-w-3xl px-5 text-center">
        <p className="font-moon text-[clamp(13px,min(2.2vh,3.6vw),17px)] leading-relaxed text-zinc-600">
          Projek-projek yang telah disiapkan oleh kami dari <span className="font-semibold text-zinc-900">Neo Telemetri</span> sesuai dengan kebutuhan serta keinginan klien,
          sehingga website atau sistem yang dibuat dapat digunakan dengan nyaman dan tepat sasaran.
        </p>
        <p className="mt-3 flex flex-wrap items-center justify-center gap-2 font-moon text-sm text-zinc-600 sm:text-base">
          Jadi tunggu apa lagi?
          <span className="rounded-lg border border-flame/20 bg-flame/10 px-3 py-1 font-magic text-xs font-semibold text-flame sm:text-sm">
            Let&apos;s make a project with Neo Telemetri
          </span>
        </p>
      </Reveal>
      <Reveal y={24} delay={0.12} className="flex justify-center">
        <Link
          to="/portal/proyek"
          className="inline-flex items-center gap-2 rounded-xl bg-flame px-7 py-3 font-magic text-base font-bold text-white shadow-md shadow-flame/25 transition-all hover:-translate-y-0.5 hover:bg-[#e05600] sm:text-lg"
        >
          Kelola &amp; Buat Project →
        </Link>
      </Reveal>
    </section>
  );
}
