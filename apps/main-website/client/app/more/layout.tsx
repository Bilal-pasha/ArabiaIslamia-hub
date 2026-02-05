import { SEO_DEFAULTS } from '@/constants/seo';

export const metadata = {
  title: `More | ${SEO_DEFAULTS.siteName}`,
  description:
    'Admissions, scholarships, downloads, and results at Jamia Arabia Islamia. Find information about applying, scholarship opportunities, and examination results.',
  keywords: [
    'Jamia Arabia Islamia admissions',
    'madrasa admission form',
    'Islamic school scholarships',
    'scholarship for Hifz students',
    'madrasa results',
    'examination results',
    'prospectus download',
    'admission requirements',
  ],
  openGraph: {
    title: `More | ${SEO_DEFAULTS.siteName}`,
    description: 'Admissions, scholarships, downloads, and examination results at Jamia Arabia Islamia.',
    url: `${SEO_DEFAULTS.url}/more`,
    images: [SEO_DEFAULTS.ogImage],
  },
};

export default function MoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
