import { MotionConfig } from 'motion/react';
import HeroSection from '../../components/landing/HeroSection';
import JourneySection from '../../components/landing/JourneySection';
import LandingHeader from '../../components/landing/LandingHeader';
import LatestProjectSection from '../../components/landing/LatestProjectSection';
import OurProjectSection from '../../components/landing/OurProjectSection';
import UlasanSection from '../../components/landing/UlasanSection';
import { SECTION } from '../../components/landing/Parts';
import { usePageWidth } from '../../components/landing/Stage';

// Halaman publik utama. Urutan bagian mengikuti desain Figma "SIMPK By Neotelemetri".
export default function LandingPage() {
  const page = usePageWidth();
  return (
    <MotionConfig reducedMotion="user">
      <div ref={page.ref} style={page.style} data-landing className="overflow-x-clip bg-cream text-coal">
        <LandingHeader />
        <main>
          <HeroSection />
          <LatestProjectSection />
          <OurProjectSection />
          {/* Menu TESTI: ulasan klien (bila ada yang disetujui tampil) lalu Our Journey With Client. */}
          <section id={SECTION.testi} aria-label="Testimoni">
            <UlasanSection />
            <JourneySection />
          </section>
        </main>
      </div>
    </MotionConfig>
  );
}
