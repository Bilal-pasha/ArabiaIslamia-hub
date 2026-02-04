import { SEO_DEFAULTS } from '@/constants/seo';

export const metadata = {
  title: `Contact Us | ${SEO_DEFAULTS.siteName}`,
  description:
    'Get in touch with Jamia Arabia Islamia. Contact us for admissions, donations, or general enquiries. We would love to hear from you.',
  openGraph: {
    title: `Contact Us | ${SEO_DEFAULTS.siteName}`,
    description: 'Contact Jamia Arabia Islamia for admissions, support, or donations. Reach out today.',
    url: `${SEO_DEFAULTS.url}/contact`,
    images: [SEO_DEFAULTS.ogImage],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
