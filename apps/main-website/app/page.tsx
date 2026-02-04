import { HeroCarousel, WhiteSection, FacultiesSection, StatisticSection, NewsSection, DonateFormSection } from '@/components/organisms';
import { SEO_DEFAULTS } from '@/constants/seo';

export const metadata = {
  title: `Home | ${SEO_DEFAULTS.siteName}`,
  description:
    'Jamia Arabia Islamia – Islamic education, Tahfeez ul Quran, Darse Nizami, Mahad ul Arabia. Scout Colony, Karachi. Discover our faculties, admissions, and how to support us.',
  openGraph: {
    title: `Home | ${SEO_DEFAULTS.siteName}`,
    description: SEO_DEFAULTS.description,
    url: SEO_DEFAULTS.url,
    images: [SEO_DEFAULTS.ogImage],
  },
};

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <WhiteSection />
      <FacultiesSection />
      <StatisticSection />
      <NewsSection />
      <DonateFormSection />
    </>
  );
}
