import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

// Desain Figma berupa artboard 1440 x 1024. Di layar lebar artboard diskalakan mengikuti lebar halaman,
// sehingga posisi dan proporsi setiap elemen sama persis dengan desain pada lebar berapa pun.
const ARTBOARD_WIDTH = 1440;
const ARTBOARD_HEIGHT = 1024;
// Artboard paling lebar 1200 px agar huruf tidak terlalu besar (masukan PM 14 Nov). Di layar lebih lebar
// artboard berada di tengah, dan latar serta bentuk di tepi tetap memenuhi layar.
const MAX_WIDTH = 1200;
const SCALE = `min(var(--vw), ${MAX_WIDTH}) / ${ARTBOARD_WIDTH}`;

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

interface StageProps {
  /** Frame Figma yang bergaris tepi 1 px: isinya dihitung dari sisi dalam garis, jadi bergeser 1 px. */
  framed?: boolean;
  className?: string;
  children: ReactNode;
}

/** Satu artboard penuh. Hanya tampil di layar lebar; layar kecil memakai tata letak tersendiri. */
export function Stage({ framed = false, className = '', children }: StageProps) {
  return (
    <div
      className={`relative hidden overflow-hidden lg:block ${className}`}
      // Tumpang 1 px dengan bagian sebelumnya agar tidak muncul garis tipis akibat pembulatan skala.
      style={{ height: `calc(${ARTBOARD_HEIGHT}px * ${SCALE})`, marginTop: -1 }}
    >
      <div
        className="absolute top-0 origin-top-left"
        style={{
          left: `calc((var(--vw) * 1px - min(var(--vw) * 1px, ${MAX_WIDTH}px)) / 2)`,
          width: ARTBOARD_WIDTH,
          height: ARTBOARD_HEIGHT,
          transform: `scale(calc(${SCALE}))`,
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
