'use client';

import { useEffect, useState } from 'react';
import { HeroCarousel, WhiteSection, FacultiesSection, StatisticSection, NewsSection, DonateFormSection } from '@/components/organisms';
import { getPublicHome } from '@/services/cms.service';
import type { PublicHomeDto } from '@/services/cms.service';

export function HomePageClient() {
  const [cms, setCms] = useState<PublicHomeDto | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getPublicHome()
      .then(setCms)
      .catch(() => setCms(null))
      .finally(() => setLoaded(true));
  }, []);

  const heroSlides = loaded && cms?.heroSlides?.length ? cms.heroSlides : null;

  return (
    <>
      <HeroCarousel apiSlides={heroSlides} />
      <WhiteSection />
      <FacultiesSection />
      <StatisticSection />
      <NewsSection />
      <DonateFormSection />
    </>
  );
}
