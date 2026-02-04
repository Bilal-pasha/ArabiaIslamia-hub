import { SEO_DEFAULTS } from '@/constants/seo';

export const metadata = {
  title: `About Us | ${SEO_DEFAULTS.siteName}`,
  description:
    'Learn about Jamia Arabia Islamia – our mission, vision, and dedication to Islamic education. Tahfeez ul Quran, Darse Nizami, Mahad ul Arabia. Support the next generation of scholars and leaders.',
  openGraph: {
    title: `About Us | ${SEO_DEFAULTS.siteName}`,
    description:
      'Our mission is to offer exceptional education in Islamic studies and Arabic. Discover how we empower scholars, leaders, and visionaries.',
    url: `${SEO_DEFAULTS.url}/about`,
    images: [SEO_DEFAULTS.ogImage],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
