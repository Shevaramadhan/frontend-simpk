import { motion } from 'motion/react';
import logoFooter from '../../assets/landing/footer-logo.webp';
import ikonCopyright from '../../assets/landing/ikon-copyright.svg';
import ikonFacebook from '../../assets/landing/ikon-facebook.svg';
import ikonInstagram from '../../assets/landing/ikon-instagram.svg';
import ikonSpotify from '../../assets/landing/ikon-spotify.svg';
import ikonX from '../../assets/landing/ikon-vector-a.svg';
import ikonYoutube from '../../assets/landing/ikon-vector-b.svg';
import ikonTiktok from '../../assets/landing/ikon-vector-c.svg';
import foto1 from '../../assets/landing/journey-1.webp';
import foto2 from '../../assets/landing/journey-2.webp';
import foto3 from '../../assets/landing/journey-3.webp';
import foto4 from '../../assets/landing/journey-4.webp';
import foto5 from '../../assets/landing/journey-5.webp';
import garis from '../../assets/landing/journey-garis.svg';
import { DrawLine, Reveal, SplitWords } from './Motion';
import { SECTION, SIMPK_DESCRIPTION } from './Parts';
import { box, Crop, Stage } from './Stage';

const TITLE = 'OUR JOURNEY WITH OUR CLIENT';
// Nomor dan email masih mengikuti desain; diganti saat kontak resmi Neo Telemetri tersedia.
const PHONE = '+62 897  1504 300';
const EMAIL = 'baktiunand2025@gmail.com';
const COPYRIGHT = '2026. All Rights Reserved';

// Bingkai dan foto pada posisi Figma. Foto keempat dipotong rata kiri seperti di desain.
const PHOTOS = [
  { src: foto1, alt: 'Tim Neo Telemetri berdiskusi di teras', frame: box(72, 311, 259, 335), frameClass: 'rounded-[30px] bg-flame', photo: box(12, 18, 234, 299), photoClass: 'rounded-[30px] object-cover' },
  { src: foto2, alt: 'Tim Neo Telemetri bekerja bersama klien', frame: box(331, 261, 259, 335), frameClass: 'bg-coal-deep', photo: box(12, 18, 234, 299), photoClass: 'object-cover' },
  { src: foto3, alt: 'Sesi kerja bersama di ruang rapat', frame: box(590, 211, 259, 335), frameClass: 'rounded-[50px] bg-flame', photo: box(12, 18, 234, 299), photoClass: 'rounded-[50px] object-cover' },
  { src: foto4, alt: 'Pertemuan dengan klien', frame: box(849, 261, 259, 335), frameClass: 'bg-coal-deep', photo: box(12, 20, 234, 299), photoClass: 'object-cover object-left' },
  { src: foto5, alt: 'Foto bersama setelah acara', frame: box(1108, 311, 259, 335), frameClass: 'rounded-[30px] bg-flame', photo: box(12, 18, 234, 299), photoClass: 'rounded-[30px] object-cover' },
];

// Ikon media sosial pada posisi Figma, relatif terhadap footer (0, 728).
const SOCIALS = [
  { src: ikonInstagram, alt: 'Instagram', style: box(673, 117, 55, 55) },
  { src: ikonFacebook, alt: 'Facebook', style: box(748, 117, 50, 50) },
  { src: ikonSpotify, alt: 'Spotify', style: box(818, 117, 55, 55) },
  { src: ikonX, alt: 'X', style: box(678, 195, 45, 45) },
  { src: ikonTiktok, alt: 'TikTok', style: box(750, 195, 45, 45) },
  { src: ikonYoutube, alt: 'YouTube', style: box(818, 194, 55, 45) },
];

function Photos() {
  return (
    <>
      {PHOTOS.map((item, index) => (
        <Reveal key={item.src} y={80} delay={Math.abs(index - 2) * 0.12} className="absolute" style={item.frame}>
          <motion.div className="absolute inset-0" whileHover={{ scale: 1.06, y: -10, zIndex: 5 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
            <div className={`absolute inset-0 ${item.frameClass}`} />
            <img alt={item.alt} loading="lazy" className={`absolute max-w-none ${item.photoClass}`} style={item.photo} src={item.src} />
          </motion.div>
        </Reveal>
      ))}
    </>
  );
}

function Desktop() {
  return (
    <Stage className="bg-cream">
      <h2 className="absolute whitespace-nowrap font-magic text-[64px] uppercase leading-[normal] tracking-[3.2px] text-flame" style={box(169, 59)}>
        <SplitWords text={TITLE} />
      </h2>
      <div className="absolute h-0" style={box(112, 156, 1215)}>
        <DrawLine className="absolute inset-[-10px_0_0_0]">
          <img alt="" className="block size-full max-w-none" src={garis} />
        </DrawLine>
      </div>

      <Photos />

      <div aria-hidden="true" className="absolute bg-coal" style={box(-1000, 728, 3440, 296)} />
      <footer className="absolute bg-coal" style={box(0, 728, 1440, 296)}>
        <Reveal y={30} className="absolute" style={box(46, 27, 538, 81)}>
          <p className="text-center font-magic text-[48px] uppercase leading-[normal] text-sand [text-shadow:0px_4px_5px_rgba(0,0,0,0.25)]">SIMPK NEOTELEMETRI</p>
        </Reveal>
        <Reveal y={30} delay={0.1} className="absolute" style={box(29, 89, 573)}>
          <p className="text-justify font-poppins text-[22px] leading-[normal] text-cream">{SIMPK_DESCRIPTION}</p>
        </Reveal>

        <Reveal y={30} delay={0.15} className="absolute inset-0">
          <p className="absolute whitespace-nowrap font-poppins text-[24px] font-bold leading-[normal] text-cream" style={box(700, 32)}>
            FOLLOW US
          </p>
          {SOCIALS.map((icon) => (
            <img key={icon.alt} alt={icon.alt} className="absolute block max-w-none" style={icon.style} src={icon.src} />
          ))}
        </Reveal>

        <Reveal y={30} delay={0.25} className="absolute inset-0">
          <p className="absolute whitespace-nowrap font-spartan text-[27px] font-bold leading-[normal] text-cream" style={box(1079, 43)}>
            CONTACT US
          </p>
          <p className="absolute whitespace-pre font-poppins text-[22px] leading-[normal] text-cream" style={box(1061, 114)}>
            {PHONE}
          </p>
          <p className="absolute whitespace-nowrap font-poppins text-[22px] leading-[normal] text-cream" style={box(1001, 148)}>
            {EMAIL}
          </p>
          <img alt="Neo Telemetri" className="absolute max-w-none object-cover" style={box(912, 204, 200, 35)} src={logoFooter} />
          <img alt="" className="absolute block max-w-none" style={box(1119, 210, 25, 25)} src={ikonCopyright} />
          <p className="absolute font-poppins text-[22px] leading-[normal] text-cream" style={box(1147, 206, 270)}>
            {COPYRIGHT}
          </p>
        </Reveal>
      </footer>
    </Stage>
  );
}

function Mobile() {
  return (
    <div className="bg-cream lg:hidden">
      <div className="px-4 pt-8">
        <h2 className="text-center font-magic text-[7.4vw] uppercase leading-tight tracking-wide text-flame sm:text-5xl">
          <SplitWords text={TITLE} />
        </h2>
        <DrawLine className="mt-2 h-1.5 bg-coal sm:h-2.5" />
      </div>

      <div className="overflow-x-auto py-6">
        <Crop x={52} y={196} w={1336} h={470} scale={0.62} className="mx-auto">
          <Photos />
        </Crop>
      </div>

      <footer className="bg-coal px-5 py-8 text-cream">
        <p className="text-center font-magic text-4xl uppercase text-sand [text-shadow:0px_4px_5px_rgba(0,0,0,0.25)]">SIMPK NEOTELEMETRI</p>
        <p className="mt-3 text-justify font-poppins text-base">{SIMPK_DESCRIPTION}</p>

        <p className="mt-8 text-center font-poppins text-xl font-bold">FOLLOW US</p>
        <div className="mx-auto mt-4 grid w-fit grid-cols-3 place-items-center gap-x-6 gap-y-4">
          {SOCIALS.map((icon) => (
            <img key={icon.alt} alt={icon.alt} className="block" style={{ width: icon.style.width, height: icon.style.height }} src={icon.src} />
          ))}
        </div>

        <p className="mt-8 text-center font-spartan text-2xl font-bold">CONTACT US</p>
        <p className="mt-3 whitespace-pre text-center font-poppins text-lg">{PHONE}</p>
        <p className="text-center font-poppins text-lg">{EMAIL}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 font-poppins text-base">
          <img alt="Neo Telemetri" className="h-[35px] w-[200px] object-cover" src={logoFooter} />
          <span className="flex items-center gap-1.5">
            <img alt="" className="size-5" src={ikonCopyright} />
            {COPYRIGHT}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function JourneySection() {
  return (
    <section id={SECTION.testi}>
      <Desktop />
      <Mobile />
    </section>
  );
}
