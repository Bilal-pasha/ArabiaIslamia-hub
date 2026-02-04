import { SEO_DEFAULTS } from '@/constants/seo';

export const metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Jamia Arabia Islamia. Contact us for admissions, donations, or general enquiries. Visit Scout Colony, Karachi.',
  keywords: [
    'contact Jamia Arabia Islamia',
    'admissions enquiry',
    'donate Islamic education',
    'Scout Colony Karachi contact',
  ],
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
