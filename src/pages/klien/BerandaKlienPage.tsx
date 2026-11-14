import { useReducedMotion } from 'motion/react';
import { FramedLink } from '../../components/brand/Brand';
import { Reveal } from '../../components/landing/Motion';
import { PROJECTS, type Project } from '../../data/portofolio';

// Figma "Landing Page Client": galeri karya Neo Telemetri bergerak ke samping, lalu ajakan membuat project.
function Card({ project }: { project: Project }) {
  return (
    <article className="group relative mt-16 w-[300px] shrink-0 rounded-[24px] bg-coal-deep px-5 pb-5 pt-[118px] sm:w-[340px]">
      <div className="absolute -top-14 left-1/2 -translate-x-1/2 rotate-[30deg] transition-transform duration-300 group-hover:rotate-[22deg] group-hover:scale-105">
        <div className="relative h-[124px] w-[240px] overflow-hidden rounded-[22px] border-[3px] border-flame shadow-[0px_4px_25px_0px_rgba(0,0,0,0.75)]">
          <img alt="" className="size-full object-cover" src={project.image} />
        </div>
      </div>
      <h3 className="font-magic text-2xl uppercase leading-tight text-flame">{project.title}</h3>
      <p className="mt-2 font-moon text-sm leading-snug text-cream">{project.description}</p>
    </article>
  );
}

function Marquee() {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <div className="flex gap-6 overflow-x-auto px-4 pb-4">
        {PROJECTS.map((project) => (
          <Card key={project.id} project={project} />
        ))}
      </div>
    );
  }
  // Daftar digandakan agar gerakan bisa berulang tanpa jeda; berhenti saat disentuh kursor.
  return (
    <div className="marquee overflow-hidden pb-4" aria-label="Karya Neo Telemetri">
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
    <section className="pb-14 pt-2">
      <h1 className="sr-only">Beranda klien SIMPK</h1>
      <Marquee />
      <Reveal y={24} className="mx-auto mt-6 max-w-3xl px-5 text-center">
        <p className="font-moon text-xl leading-relaxed text-flame sm:text-2xl">
          Projek-projek yang telah disiapkan oleh kami dari NEO TELEMETRI sesuai dengan kebutuhan serta keinginan client, sehingga website yang dibuat dapat
          digunakan dengan nyaman dan sesuai dengan tujuan dibuatnya website tersebut.
        </p>
        <p className="mt-6 flex flex-wrap items-center justify-center gap-2 font-moon text-xl text-flame sm:text-2xl">
          Jadi tunggu apa lagi?
          <span className="rounded-2xl bg-coal px-3 py-1 font-magic text-base uppercase sm:text-lg">Lets make a project with Neo Telemetri</span>
        </p>
      </Reveal>
      <Reveal y={30} delay={0.15} className="mt-8 flex justify-center">
        <FramedLink to="/portal/proyek" size="text-2xl sm:text-3xl">
          Lets Make A project
        </FramedLink>
      </Reveal>
    </section>
  );
}
