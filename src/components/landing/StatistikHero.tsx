import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';
import { STATISTIK } from '../../data/statistik';

// Angka Neo Telemetri di dalam bayangan hitam hero (masukan PM 18 Nov). Versi ringkas: angka dan label saja agar
// tidak bersaing dengan judul SIMPK. Angka berhitung naik saat terlihat; pembaca layar langsung mendapat angka akhir.
// Kontras: oranye #ff6200 di atas #262626 = 4,9:1 (teks besar); krem di atas #262626 = 15:1.

function Hitung({ nilai, akhiran = '', tunda }: { nilai: number; akhiran?: string; tunda: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const terlihat = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const kurangiGerak = useReducedMotion();
  const [angka, setAngka] = useState(kurangiGerak ? nilai : 0);

  useEffect(() => {
    if (!terlihat || kurangiGerak) return;
    const kontrol = animate(0, nilai, { duration: 1.6, delay: tunda, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setAngka(Math.round(v)) });
    return () => kontrol.stop();
  }, [terlihat, kurangiGerak, nilai, tunda]);

  return (
    <span ref={ref} aria-hidden="true" className="tabular-nums">
      {kurangiGerak ? nilai : angka}
      {akhiran}
    </span>
  );
}

/**
 * Daftar angka. `ukuran` desktop memakai px artboard (ikut diskalakan Stage), ponsel memakai ukuran layar.
 * `tunda` memberi jeda agar angka mulai setelah judul hero selesai masuk.
 */
export default function StatistikHero({ ukuran, tunda = 0, className = '', style }: { ukuran: 'artboard' | 'ponsel'; tunda?: number; className?: string; style?: React.CSSProperties }) {
  const artboard = ukuran === 'artboard';
  return (
    <ul aria-label="Neo Telemetri dalam angka" className={className} style={style}>
      {STATISTIK.map((item, index) => (
        <li key={item.label} className={`flex flex-col items-center text-center ${artboard ? 'px-1' : ''} ${artboard && index ? 'border-l-2 border-cream/25' : ''}`}>
          <span className={`font-magic leading-none text-flame ${artboard ? 'text-[64px]' : 'text-[clamp(2.5rem,12vw,3.5rem)]'}`}>
            <span className="sr-only">
              {item.nilai}
              {item.akhiran}{' '}
            </span>
            <Hitung nilai={item.nilai} akhiran={item.akhiran} tunda={tunda + index * 0.12} />
          </span>
          <span className={`mt-1 font-body font-semibold uppercase leading-tight tracking-wide text-cream ${artboard ? 'text-[13.5px]' : 'text-xs sm:text-sm'}`}>
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
