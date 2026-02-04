import { SEO_DEFAULTS } from '@/constants/seo';

export const metadata = {
  title: `Faculties | ${SEO_DEFAULTS.siteName}`,
  description:
    'Explore Jamia Arabia Islamia faculties: Tahfeez ul Quran, Darse Nizami, Mahad ul Arabia, and Schooling System. Islamic education combining tradition with modern learning.',
  keywords: [
    'Tahfeez ul Quran',
    'Hifz Quran program',
    'Darse Nizami',
    'Dars e Nizami curriculum',
    'Mahad ul Arabia',
    'Arabic language course',
    'Schooling System',
    'Islamic seminary Karachi',
    'Quran memorization',
    'Islamic studies Pakistan',
  ],
  openGraph: {
    title: `Faculties | ${SEO_DEFAULTS.siteName}`,
    description:
      'Tahfeez ul Quran, Darse Nizami, Mahad ul Arabia, and Schooling System – discover our Islamic education programs.',
    url: `${SEO_DEFAULTS.url}/faculties`,
    images: [SEO_DEFAULTS.ogImage],
  },
};

export default function FacultiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
