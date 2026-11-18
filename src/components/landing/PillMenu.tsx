import { Fragment, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

// Pil menu landing page (navbar utama dan tab Our Project memakai komponen yang sama agar gayanya seragam):
// bingkai gelap, garis krem, pemisah krem, dan penanda aktif berupa pil oranye yang meluncur ke menu terpilih.
// Posisi penanda dihitung dari offsetLeft/offsetWidth, bukan layoutId motion, karena tab Our Project berada di
// artboard yang diskalakan dengan transform sehingga ukuran layar dan ukuran lokal berbeda.
// Kontras: teks gelap #262626 di atas oranye = 5,04:1; teks oranye di atas #292929 = 4,8:1.

export interface PillItem {
  key: string;
  label: string;
  /** Tautan (navbar). Tanpa href, item menjadi tombol (tab saring). */
  href?: string;
  onSelect?: () => void;
}

const UKURAN = {
  /** Navbar utama di layar lebar: mengikuti tinggi layar seperti tombol SIGN IN. */
  nav: { teks: 'text-[clamp(13px,2.3vh,24px)]', item: 'px-[clamp(10px,1vw,16px)] py-[clamp(4px,0.8vh,8px)]', isi: 'p-[clamp(4px,0.7vh,7px)]', garis: 'h-[1.1em] mx-[clamp(4px,0.45vw,8px)]' },
  /** Tab Our Project di artboard 1440 (ikut diskalakan Stage). */
  artboard: { teks: 'text-[21px]', item: 'px-[18px] py-[7px]', isi: 'p-[7px]', garis: 'h-[1.1em] mx-[7px]' },
  /** Ponsel. */
  kecil: { teks: 'text-[11px] min-[400px]:text-[13px] sm:text-lg', item: 'px-2 py-1 min-[400px]:px-2.5 sm:px-4', isi: 'p-1', garis: 'h-[1.1em] mx-[3px]' },
} as const;

export default function PillMenu({
  items,
  active,
  label,
  size,
  kind,
}: {
  items: PillItem[];
  active: string;
  label: string;
  size: keyof typeof UKURAN;
  /** nav: tautan dengan aria-current; tab: tombol dengan aria-pressed. */
  kind: 'nav' | 'tab';
}) {
  const u = UKURAN[size];
  const isi = useRef<HTMLDivElement>(null);
  const [posisi, setPosisi] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  // Ukur ulang saat menu aktif berganti dan saat ukuran berubah (font selesai dimuat, layar diubah).
  useLayoutEffect(() => {
    const wadah = isi.current;
    if (!wadah) return;
    const ukur = () => {
      const el = wadah.querySelector<HTMLElement>(`[data-pill="${CSS.escape(active)}"]`);
      setPosisi(el ? { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight } : null);
    };
    ukur();
    const observer = new ResizeObserver(ukur);
    observer.observe(wadah);
    return () => observer.disconnect();
  }, [active]);

  const isiMenu = (
    <div ref={isi} className={`relative flex items-center rounded-full border-[3px] border-cream bg-coal ${u.isi}`}>
      {posisi && (
        <motion.span
          aria-hidden="true"
          className="absolute left-0 top-0 rounded-full bg-flame"
          initial={false}
          animate={{ x: posisi.x, y: posisi.y, width: posisi.w, height: posisi.h }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
      {items.map((item, index) => {
        const dipilih = item.key === active;
        const kelas = `relative z-10 cursor-pointer whitespace-nowrap rounded-full font-magic uppercase leading-none transition-colors duration-200 ${u.teks} ${u.item} ${
          dipilih ? 'text-coal-deep' : 'text-flame hover:text-cream'
        }`;
        return (
          <Fragment key={item.key}>
            {index > 0 && <span aria-hidden="true" className={`relative z-0 w-[2px] shrink-0 bg-cream ${u.garis}`} />}
            {item.href ? (
              <a href={item.href} data-pill={item.key} aria-current={dipilih ? 'location' : undefined} onClick={item.onSelect} className={kelas}>
                {item.label}
              </a>
            ) : (
              <button type="button" data-pill={item.key} aria-pressed={dipilih} onClick={item.onSelect} className={kelas}>
                {item.label}
              </button>
            )}
          </Fragment>
        );
      })}
    </div>
  );

  const bingkai = 'w-fit rounded-full bg-coal p-[3px]';
  return kind === 'nav' ? (
    <nav aria-label={label} className={bingkai}>
      {isiMenu}
    </nav>
  ) : (
    <div role="group" aria-label={label} className={bingkai}>
      {isiMenu}
    </div>
  );
}
