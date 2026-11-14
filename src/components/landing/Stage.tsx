import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

// Desain Figma berupa artboard 1440 x 1024. Tiap bagian halaman setinggi layar paling tinggi, lalu artboard
// diskalakan agar muat utuh (lebar dan tinggi) dan berada di tengah. Hasilnya pas pada zoom 100% dan ikut
// menyesuaikan saat zoom atau ukuran jendela berubah (masukan PM 14 Nov).
const ARTBOARD_WIDTH = 1440;
const ARTBOARD_HEIGHT = 1024;
/** Pergeseran paling jauh unsur tepi, dalam satuan artboard. */
const MAX_EDGE = 320;

/** Posisi elemen dalam koordinat artboard, sama dengan angka di Figma. */
export function box(left: number, top: number, width?: number, height?: number): CSSProperties {
  return { left, top, width, height };
}

/** Menyimpan lebar halaman (angka tanpa satuan) pada variabel CSS `--vw` untuk Stage dan Crop. */
export function usePageWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(() => document.documentElement.clientWidth);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => setWidth(element.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, style: { '--vw': width } as CSSProperties };
}

interface View {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface StageProps {
  /** Frame Figma yang bergaris tepi 1 px: isinya dihitung dari sisi dalam garis, jadi bergeser 1 px. */
  framed?: boolean;
  /** Bagian artboard yang harus muat di layar. Bawaan: seluruh artboard. */
  view?: View;
  /** Tinggi diatur induk (misalnya flex-1). Bawaan: setinggi layar, tidak lebih tinggi dari proporsi artboard. */
  fill?: boolean;
  className?: string;
  children: ReactNode;
}

const FULL: View = { x: 0, y: 0, w: ARTBOARD_WIDTH, h: ARTBOARD_HEIGHT };

/** Satu artboard. Hanya tampil di layar lebar; layar kecil memakai tata letak tersendiri. */
export function Stage({ framed = false, view = FULL, fill = false, className = '', children }: StageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ scale: 0, left: 0, top: 0, edge: 0 });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => {
      const { clientWidth: width, clientHeight: height } = element;
      if (!width || !height) return;
      const scale = Math.min(width / view.w, height / view.h);
      const slack = (width - view.w * scale) / 2 / scale;
      setFit({
        scale,
        left: (width - view.w * scale) / 2 - view.x * scale,
        top: (height - view.h * scale) / 2 - view.y * scale,
        edge: Math.min(Math.max(slack - 24, 0), MAX_EDGE),
      });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [view.x, view.y, view.w, view.h]);

  const height = fill ? undefined : `min(100dvh, calc(var(--vw) * ${(view.h / view.w).toFixed(5)} * 1px))`;
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${fill ? '' : 'hidden lg:block'} ${className}`}
      // Tumpang 1 px dengan bagian sebelumnya agar tidak muncul garis tipis akibat pembulatan skala.
      style={{ height, marginTop: fill ? undefined : -1 }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: ARTBOARD_WIDTH,
          height: ARTBOARD_HEIGHT,
          transform: `translate(${fit.left}px, ${fit.top}px) scale(${fit.scale})`,
          visibility: fit.scale ? 'visible' : 'hidden',
          ['--edge' as string]: `${fit.edge}px`,
        }}
      >
        {framed ? <div className="absolute inset-px">{children}</div> : children}
      </div>
    </div>
  );
}

interface CropProps {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Skala tetap. Jika kosong, potongan dilebarkan selebar halaman. */
  scale?: number;
  className?: string;
  children: ReactNode;
}

/** Menampilkan sebagian artboard. Dipakai di layar kecil agar karya visual desain tetap utuh. */
export function Crop({ x, y, w, h, scale, className = '', children }: CropProps) {
  const factor = scale === undefined ? `calc(var(--vw) / ${w})` : String(scale);
  const outer: CSSProperties =
    scale === undefined ? { height: `calc(${h}px * var(--vw) / ${w})` } : { width: w * scale, height: h * scale };
  return (
    <div className={`relative overflow-hidden ${className}`} style={outer}>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: ARTBOARD_WIDTH, height: ARTBOARD_HEIGHT, transform: `scale(${factor}) translate(${-x}px, ${-y}px)` }}
      >
        {children}
      </div>
    </div>
  );
}
