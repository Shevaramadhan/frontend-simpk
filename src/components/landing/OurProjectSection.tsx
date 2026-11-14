import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PROJECTS, type Division, type Project } from '../../data/portofolio';
import { Reveal, SplitWords } from './Motion';
import { Framed, PillLayers, SECTION, Separator } from './Parts';
import { box, Stage } from './Stage';

// Posisi kartu di Figma, urut kiri ke kanan lalu atas ke bawah.
const SLOTS = [
  { left: 65, top: 351 },
  { left: 728.14, top: 350.91 },
  { left: 68.14, top: 566.91 },
  { left: 727.14, top: 565.91 },
  { left: 71.28, top: 782.81 },
  { left: 729.14, top: 782.91 },
];

const TABS: { division: Division; left: number }[] = [
  { division: 'MMD', left: 111 },
  { division: 'PROGRAMMING', left: 271 },
  { division: 'SKJ', left: 554 },
];

const THUMB = 'relative h-[117.772px] w-[227.372px] rounded-[30px] shadow-[0px_4px_25px_0px_rgba(0,0,0,0.75)]';
const SPRING = { type: 'spring', stiffness: 260, damping: 20 } as const;

function useDivisionFilter() {
  const [active, setActive] = useState<Division | null>(null);
  const projects = active ? PROJECTS.filter((project) => project.division === active) : PROJECTS;
  const toggle = (division: Division) => setActive((current) => (current === division ? null : division));
  return { active, projects, toggle };
}

type Filter = ReturnType<typeof useDivisionFilter>;

function Thumbnail({ project }: { project: Project }) {
  return (
    <div className="flex-none -rotate-40">
      <motion.div className={THUMB} variants={{ hover: { scale: 1.12, rotate: 6 } }} transition={SPRING}>
        <img alt="" className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[30px] object-cover" src={project.image} />
        <div className="absolute inset-0 rounded-[30px] border-3 border-flame" />
      </motion.div>
    </div>
  );
}

function Desktop({ active, projects, toggle }: Filter) {
  return (
    <Stage framed className="bg-coal">
      <Reveal y={60} className="absolute rounded-[30px] bg-cream" style={box(50, 315, 1339, 648)} />

      <AnimatePresence initial={false}>
        {projects.map((project, index) => (
          <motion.article
            key={project.id}
            className="absolute h-[160px] w-[646px]"
            initial={{ opacity: 0, scale: 0.85, ...SLOTS[index] }}
            animate={{ opacity: 1, scale: 1, ...SLOTS[index] }}
            exit={{ opacity: 0, scale: 0.85 }}
            whileHover="hover"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Reveal x={index % 2 === 0 ? -60 : 60} delay={0.1 + Math.floor(index / 2) * 0.12} className="absolute inset-0">
              <div className="absolute inset-0 rounded-[20px] bg-coal" />
              <h3 className="absolute whitespace-nowrap font-magic text-[36px] uppercase leading-[normal] text-flame" style={box(247, 22)}>
                {project.title}
              </h3>
              <div className="absolute flex items-center justify-center" style={box(-18.14, -45.91, 249.879, 236.37)}>
                <Thumbnail project={project} />
              </div>
              <p className="absolute text-justify font-moon text-[16px] leading-[normal] text-cream" style={box(247, 80, 377)}>
                {project.description}
              </p>
            </Reveal>
          </motion.article>
        ))}
      </AnimatePresence>
      {projects.length === 0 && (
        <p className="absolute text-center font-moon text-[32px] text-coal" style={box(50, 610, 1339)}>
          Project divisi {active} segera hadir
        </p>
      )}

      <h2 className="text-outline absolute whitespace-nowrap font-magic text-[64px] uppercase leading-[normal] tracking-[3.2px] text-flame" style={box(494, 50)}>
        <SplitWords text="our Project" />
      </h2>

      <Reveal y={30} delay={0.15} className="absolute" style={box(365, 151, 708, 85)}>
        <PillLayers />
        {TABS.map((tab) => (
          <button
            key={tab.division}
            type="button"
            aria-pressed={active === tab.division}
            onClick={() => toggle(tab.division)}
            className={`absolute cursor-pointer whitespace-nowrap font-magic text-[24px] uppercase leading-[normal] transition-colors hover:text-cream ${active === tab.division ? 'text-cream' : 'text-flame'}`}
            style={box(tab.left, 29)}
          >
            {tab.division}
          </button>
        ))}
        <Separator left={221} top={24} />
        <Separator left={488} top={24} />
      </Reveal>
    </Stage>
  );
}

function Mobile({ active, projects, toggle }: Filter) {
  return (
    <div className="bg-coal px-4 pb-10 pt-8 lg:hidden">
      <h2 className="text-outline text-center font-magic text-[11vw] uppercase leading-[normal] tracking-wide text-flame sm:text-6xl">
        <SplitWords text="our Project" />
      </h2>

      <Reveal y={20} className="mx-auto mt-3 max-w-xl">
        <Framed rounded="rounded-[22px]">
          <span className="flex items-center justify-center divide-x-2 divide-cream py-2">
            {TABS.map((tab) => (
              <button
                key={tab.division}
                type="button"
                aria-pressed={active === tab.division}
                onClick={() => toggle(tab.division)}
                className={`px-3 font-magic text-sm uppercase min-[400px]:px-5 sm:text-xl ${active === tab.division ? 'text-cream' : 'text-flame'}`}
              >
                {tab.division}
              </button>
            ))}
          </span>
        </Framed>
      </Reveal>

      <div className="mx-auto mt-8 max-w-2xl rounded-[30px] bg-cream p-3 sm:p-5">
        <AnimatePresence initial={false} mode="popLayout">
          {projects.map((project) => (
            <motion.article
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover="hover"
              className="relative mb-6 flex min-h-[120px] items-center rounded-[20px] bg-coal py-4 pl-[126px] pr-4 last:mb-0 sm:pl-[170px]"
            >
              <div className="absolute left-[-14px] top-1/2 flex w-[130px] origin-center -translate-y-1/2 scale-[0.52] items-center justify-center sm:left-0 sm:w-[170px] sm:scale-[0.7]">
                <Thumbnail project={project} />
              </div>
              <div>
                <h3 className="font-magic text-xl uppercase leading-tight text-flame sm:text-3xl">{project.title}</h3>
                <p className="mt-1.5 font-moon text-[13px] leading-snug text-cream sm:text-base">{project.description}</p>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
        {projects.length === 0 && <p className="py-10 text-center font-moon text-xl text-coal">Project divisi {active} segera hadir</p>}
      </div>
    </div>
  );
}

export default function OurProjectSection() {
  const filter = useDivisionFilter();
  return (
    <section id={SECTION.projects}>
      <Desktop {...filter} />
      <Mobile {...filter} />
    </section>
  );
}
