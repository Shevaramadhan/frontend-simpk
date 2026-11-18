import { useCallback, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PROJECTS, type Division, type Project } from '../../data/portofolio';
import Lightbox, { type LightboxItem } from './Lightbox';
import { BorderBeam, DrawLine, Reveal, SplitWords } from './Motion';
import PillMenu from './PillMenu';
import { SECTION } from './Parts';
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

type Tab = Division | 'SEMUA';
const TABS: Tab[] = ['SEMUA', 'MMD', 'PROGRAMMING', 'SKJ'];

const THUMB = 'relative h-[117.772px] w-[227.372px] rounded-[30px] shadow-[0px_4px_25px_0px_rgba(0,0,0,0.75)]';
const SPRING = { type: 'spring', stiffness: 260, damping: 20 } as const;
// Tombol transparan yang menutupi kartu: klik atau Enter membuka tampilan penuh. Tanda fokus dari index.css ([data-landing]).
const OPEN_CARD =
  'absolute inset-0 z-10 cursor-zoom-in rounded-[20px]';

function useProjects() {
  const [active, setActive] = useState<Tab>('SEMUA');
  const [open, setOpen] = useState<number | null>(null);
  const projects = active === 'SEMUA' ? PROJECTS : PROJECTS.filter((project) => project.division === active);
  const close = useCallback(() => setOpen(null), []);
  const move = useCallback(
    (step: number) => setOpen((i) => (i === null ? i : (i + step + projects.length) % projects.length)),
    [projects.length],
  );
  return { active, setActive, projects, open, setOpen, close, move };
}

type State = ReturnType<typeof useProjects>;

const toLightbox = (project: Project): LightboxItem => ({
  src: project.image,
  alt: `Tampilan ${project.title}`,
  title: project.title,
  label: `Divisi ${project.division}`,
  description: project.description,
});

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

const tabItems = (setActive: (tab: Tab) => void) => TABS.map((tab) => ({ key: tab, label: tab, onSelect: () => setActive(tab) }));

function EmptyNote({ active, className, style }: { active: Tab; className: string; style?: CSSProperties }) {
  return (
    <p className={className} style={style}>
      Project divisi {active} segera hadir
    </p>
  );
}

function Desktop({ active, setActive, projects, setOpen }: State) {
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
              <BorderBeam />
              <h3 className="absolute whitespace-nowrap font-magic text-[36px] uppercase leading-[normal] text-flame" style={box(247, 22)}>
                {project.title}
              </h3>
              <div className="absolute flex items-center justify-center" style={box(-18.14, -45.91, 249.879, 236.37)}>
                <Thumbnail project={project} />
              </div>
              <p className="absolute line-clamp-3 text-justify font-body text-[15px] leading-[1.45] text-cream" style={box(247, 80, 377)}>
                {project.description}
              </p>
              <button type="button" className={OPEN_CARD} aria-label={`Lihat ${project.title}`} onClick={() => setOpen(index)} />
            </Reveal>
          </motion.article>
        ))}
      </AnimatePresence>
      {projects.length === 0 && <EmptyNote active={active} className="absolute text-center font-body text-[32px] text-coal" style={box(50, 610, 1339)} />}

      {/* Gaya judul sama dengan Our Journey With Client: oranye, garis bawah selebar 1215 (krem di latar gelap). */}
      <h2 className="absolute whitespace-nowrap text-center font-magic text-[64px] uppercase leading-[normal] tracking-[3.2px] text-flame" style={box(0, 40, 1440)}>
        <SplitWords text="our Project" />
      </h2>
      <div className="absolute h-0" style={box(112, 137, 1215)}>
        <DrawLine className="absolute inset-[-10px_0_0_0]">
          <span className="block size-full bg-cream" />
        </DrawLine>
      </div>

      <Reveal y={30} delay={0.15} className="absolute flex justify-center" style={box(365, 182, 708)}>
        <PillMenu kind="tab" label="Saring project berdasarkan divisi" size="artboard" items={tabItems(setActive)} active={active} />
      </Reveal>
    </Stage>
  );
}

function Mobile({ active, setActive, projects, setOpen }: State) {
  return (
    <div className="bg-coal px-4 pb-10 pt-8 lg:hidden">
      <h2 className="text-center font-magic text-[7.4vw] uppercase leading-tight tracking-wide text-flame sm:text-5xl">
        <SplitWords text="our Project" />
      </h2>
      <DrawLine className="mt-2 h-1.5 bg-cream sm:h-2.5" />

      <Reveal y={20} className="mx-auto mt-5 flex max-w-xl justify-center">
        <PillMenu kind="tab" label="Saring project berdasarkan divisi" size="kecil" items={tabItems(setActive)} active={active} />
      </Reveal>

      <div className="mx-auto mt-8 max-w-2xl rounded-[30px] bg-cream p-3 sm:p-5">
        <AnimatePresence initial={false} mode="popLayout">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover="hover"
              className="relative mb-6 flex min-h-[120px] items-center rounded-[20px] bg-coal py-4 pl-[126px] pr-4 last:mb-0 sm:pl-[170px]"
            >
              <BorderBeam />
              <div className="absolute left-[-14px] top-1/2 flex w-[130px] origin-center -translate-y-1/2 scale-[0.52] items-center justify-center sm:left-0 sm:w-[170px] sm:scale-[0.7]">
                <Thumbnail project={project} />
              </div>
              <div>
                <h3 className="font-magic text-xl uppercase leading-tight text-flame sm:text-3xl">{project.title}</h3>
                <p className="mt-1.5 font-body text-[13px] leading-snug text-cream sm:text-base">{project.description}</p>
              </div>
              <button type="button" className={OPEN_CARD} aria-label={`Lihat ${project.title}`} onClick={() => setOpen(index)} />
            </motion.article>
          ))}
        </AnimatePresence>
        {projects.length === 0 && <EmptyNote active={active} className="py-10 text-center font-body text-xl text-coal" />}
      </div>
    </div>
  );
}

export default function OurProjectSection() {
  const state = useProjects();
  return (
    <section id={SECTION.projects}>
      <Desktop {...state} />
      <Mobile {...state} />
      <p aria-live="polite" className="sr-only">
        {state.projects.length ? `Menampilkan ${state.projects.length} project` : `Project divisi ${state.active} segera hadir`}
      </p>
      <Lightbox items={state.projects.map(toLightbox)} index={state.open} onClose={state.close} onMove={state.move} />
    </section>
  );
}
