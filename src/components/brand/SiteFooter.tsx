import logoFooter from '../../assets/landing/footer-logo.webp';
import ikonCopyright from '../../assets/landing/ikon-copyright.svg';
import ikonFacebook from '../../assets/landing/ikon-facebook.svg';
import ikonInstagram from '../../assets/landing/ikon-instagram.svg';
import ikonSpotify from '../../assets/landing/ikon-spotify.svg';
import ikonX from '../../assets/landing/ikon-vector-a.svg';
import ikonYoutube from '../../assets/landing/ikon-vector-b.svg';
import ikonTiktok from '../../assets/landing/ikon-vector-c.svg';
import { SIMPK_DESCRIPTION } from '../landing/Parts';

// Footer halaman klien (Figma "Group 97"). Kontak masih dari desain, menunggu kontak resmi Neo Telemetri.
export const CONTACT = { phone: '+62 897  1504 300', email: 'baktiunand2025@gmail.com' };
const SOCIALS = [
  { src: ikonInstagram, alt: 'Instagram', size: 'size-11' },
  { src: ikonFacebook, alt: 'Facebook', size: 'size-10' },
  { src: ikonSpotify, alt: 'Spotify', size: 'size-11' },
  { src: ikonX, alt: 'X', size: 'size-9' },
  { src: ikonTiktok, alt: 'TikTok', size: 'size-9' },
  { src: ikonYoutube, alt: 'YouTube', size: 'h-9 w-11' },
];

export default function SiteFooter() {
  return (
    <footer className="bg-coal px-5 py-8 text-cream sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.4fr_0.8fr_1.2fr] md:items-start">
        <div>
          <p className="text-center font-magic text-3xl uppercase text-sand [text-shadow:0px_4px_5px_rgba(0,0,0,0.25)] md:text-left">SIMPK NEOTELEMETRI</p>
          <p className="mt-2 text-justify font-poppins text-sm leading-relaxed">{SIMPK_DESCRIPTION}</p>
        </div>
        <div className="text-center">
          <p className="font-poppins text-base font-bold">FOLLOW US</p>
          <div className="mx-auto mt-4 grid w-fit grid-cols-3 place-items-center gap-x-5 gap-y-3">
            {SOCIALS.map((icon) => (
              <img key={icon.alt} alt={icon.alt} className={`block ${icon.size}`} src={icon.src} />
            ))}
          </div>
        </div>
        <div className="text-center">
          <p className="font-spartan text-lg font-bold">CONTACT US</p>
          <p className="mt-3 whitespace-pre font-poppins text-sm">{CONTACT.phone}</p>
          <p className="font-poppins text-sm">{CONTACT.email}</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 font-poppins text-sm">
            <img alt="Neo Telemetri" className="h-[26px] w-[150px] object-cover" src={logoFooter} />
            <span className="flex items-center gap-1.5">
              <img alt="" className="size-4" src={ikonCopyright} />
              2026. All Rights Reserved
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
