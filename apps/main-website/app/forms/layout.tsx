import { SEO_DEFAULTS } from '@/constants/seo';

export const metadata = {
  title: 'Scouts Camping Registration',
  description:
    'Register for Inter Madaris Scouts Camping 2023 organized by Jamia Arabia Islamia. Fill out the registration form to participate.',
  openGraph: {
    title: 'Scouts Camping Registration | Jamia Arabia Islamia',
    description: 'Register for Inter Madaris Scouts Camping 2023 – organized by Jamia Arabia Islamia.',
    url: `${SEO_DEFAULTS.url}/forms`,
    images: [SEO_DEFAULTS.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
