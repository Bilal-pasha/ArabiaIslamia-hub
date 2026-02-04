import { SEO_DEFAULTS } from '@/constants/seo';

export const metadata = {
  title: `Faculties | ${SEO_DEFAULTS.siteName}`,
  description:
    'Explore Jamia Arabia Islamia faculties: Tahfeez ul Quran, Darse Nizami, Mahad ul Arabia, and Schooling System. Islamic education combining tradition with modern learning.',
  keywords: [
    'Tahfeez ul Quran',
    'Darse Nizami',
    'Mahad ul Arabia',
    'Islamic seminary',
    'Quran memorization',
    'Islamic studies Karachi',
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
