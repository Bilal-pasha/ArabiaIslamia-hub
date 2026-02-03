import { HeroCarousel, HeroMobile } from '@/components/organisms';
import { WhiteSection } from '@/components/organisms';
import { FacultiesSection } from '@/components/organisms';
import { StatisticSection } from '@/components/organisms';
import { NewsSection } from '@/components/organisms';
import { DonateFormSection } from '@/components/organisms';

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <HeroMobile />
      <WhiteSection />
      <FacultiesSection />
      <StatisticSection />
      <NewsSection />
      <DonateFormSection />
    </>
  );
}
