import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import garis10 from '../../assets/auth/garis-10.svg';
import garis11 from '../../assets/auth/garis-11.svg';
import garis8 from '../../assets/auth/garis-8.svg';
import garis9 from '../../assets/auth/garis-9.svg';
import garisJudul from '../../assets/auth/garis-judul.svg';
import ornamenKanan from '../../assets/auth/ornamen-kanan.webp';
import sapuanA from '../../assets/auth/sapuan-a.svg';
import sapuanB from '../../assets/auth/sapuan-b.svg';
import ornamenAtas from '../../assets/landing/hero-ornamen-kanan-atas.webp';
import ornamenBawah from '../../assets/landing/hero-ornamen-kanan-bawah.webp';
import { Reveal } from '../landing/Motion';
import { box } from '../landing/Stage';
import { OutlinedTitle } from './Brand';

const isometric = (rotate: number, skew: number) => ({ transform: `rotate(${rotate}deg) skewX(${skew}deg) scaleY(${Math.cos((skew * Math.PI) / 180)})` });

/** Satu sapuan gelap pada posisi Figma (frame Sign In 83:5). */
function Stroke({ src, frame, rotate, width, height }: { src: string; frame: CSSProperties; rotate: number; width: number; height: number }) {
  return (
    <div className="absolute flex items-center justify-center" style={frame}>
      <div className="flex-none" style={{ transform: `rotate(${rotate}deg)` }}>
        <img alt="" className="block max-w-none" style={{ width, height }} src={src} />
      </div>
    </div>
  );
}

function Line({ src, frame, rotate, width, thickness }: { src: string; frame: CSSProperties; rotate: number; width: number; thickness: number }) {
  return (
    <div className="absolute flex items-center justify-center" style={frame}>
      <div className="flex-none" style={{ transform: `rotate(${rotate}deg)` }}>
        <img alt="" className="block max-w-none" style={{ width, height: thickness }} src={src} />
      </div>
    </div>
  );
}

/** Latar oranye bersapuan gelap dari desain, diskalakan menutupi layar. */
function Backdrop() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () => setScale(Math.max(window.innerWidth / 1440, window.innerHeight / 1024));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden bg-flame">
      <div className="absolute left-1/2 top-1/2 h-[1024px] w-[1440px]" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <div className="absolute flex items-center justify-center" style={box(-96, -41, 190.844, 329.261)}>
          <div className="flex-none" style={isometric(30, 30)}>
            <img alt="" className="block h-[219px] w-[220px] max-w-none object-cover" src={ornamenBawah} />
          </div>
        </div>
        <div className="absolute flex items-center justify-center" style={box(151, 845, 468.67, 270.587)}>
          <div className="flex-none" style={isometric(-30, 30)}>
            <img alt="" className="block h-[270px] w-[271px] max-w-none object-cover" src={ornamenAtas} />
          </div>
        </div>
        <div className="absolute flex items-center justify-center" style={box(1159, 229, 559.838, 429.579)}>
          <div className="flex-none" style={isometric(-15, 15)}>
            <img alt="" className="block size-[382px] max-w-none rounded-[30px] object-cover" src={ornamenKanan} />
          </div>
        </div>
        <Stroke src={sapuanA} frame={box(572, 843, 469, 215.376)} rotate={180} width={469} height={215.376} />
        <Stroke src={sapuanA} frame={box(-198, 526, 513.854, 421.021)} rotate={-150} width={469} height={215.376} />
        <Stroke src={sapuanA} frame={box(-390, 355, 513.854, 421.021)} rotate={-150} width={469} height={215.376} />
        <Stroke src={sapuanA} frame={box(1300, 583, 513.854, 421.021)} rotate={-150} width={469} height={215.376} />
        <Stroke src={sapuanA} frame={box(-69, 166, 497.716, 466.455)} rotate={-140} width={469} height={215.376} />
        <Stroke src={sapuanB} frame={box(793, 31, 470.211, 203.5)} rotate={180} width={470.211} height={203.5} />
        <Stroke src={sapuanB} frame={box(483, -166, 203.5, 470.211)} rotate={90} width={470.211} height={203.5} />
        <Stroke src={sapuanB} frame={box(1125, 659, 203.5, 470.211)} rotate={-90} width={470.211} height={203.5} />
        <Line src={garis9} frame={box(165, -60, 248, 182)} rotate={143.73} width={307.617} thickness={20} />
        <Line src={garis10} frame={box(-29, 845, 248, 182)} rotate={143.73} width={307.617} thickness={50} />
        <Line src={garis11} frame={box(1142, 805, 352, 253)} rotate={144.29} width={433.489} thickness={30} />
        <Line src={garis8} frame={box(1191, -1, 248, 182)} rotate={143.73} width={307.617} thickness={15} />
      </div>
    </div>
  );
}

/** Halaman masuk, daftar, dan lupa kata sandi: kartu krem di atas latar oranye. */
export default function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="relative min-h-screen px-4 py-8 sm:py-12">
      <Backdrop />
      <Reveal immediate y={40} duration={0.6} className="relative mx-auto w-full max-w-2xl rounded-[30px] bg-cream px-6 py-8 shadow-[0_10px_40px_rgba(0,0,0,0.25)] sm:px-12">
        <Link to="/" className="absolute left-5 top-5 font-moon text-sm text-coal-deep/70 underline-offset-4 hover:underline">
          Beranda
        </Link>
        <div className="mb-6 flex flex-col items-center">
          <OutlinedTitle className="text-center text-5xl tracking-wide sm:text-6xl">{title}</OutlinedTitle>
          <img alt="" className="mt-3 h-[8px] w-48 max-w-full" src={garisJudul} />
        </div>
        {children}
      </Reveal>
    </div>
  );
}
