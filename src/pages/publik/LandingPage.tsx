import { MotionConfig } from 'motion/react';
import HeroSection from '../../components/landing/HeroSection';
import JourneySection from '../../components/landing/JourneySection';
import LatestProjectSection from '../../components/landing/LatestProjectSection';
import OurProjectSection from '../../components/landing/OurProjectSection';
import { usePageWidth } from '../../components/landing/Stage';

// Halaman publik utama. Urutan bagian mengikuti desain Figma "SIMPK By Neotelemetri".
export default function LandingPage() {
  const page = usePageWidth();
  return (
    <MotionConfig reducedMotion="user">
      <div ref={page.ref} style={page.style} className="overflow-x-clip bg-cream text-coal">
        <main>
          <HeroSection />
          <LatestProjectSection />
          <OurProjectSection />
          <JourneySection />
        </main>
      </div>
    </MotionConfig>
  );
}
