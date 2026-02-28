import { SEO_DEFAULTS } from '@/constants/seo';
import { HomePageClient } from './page-client';
import { SEO_KEYWORDS } from '@/constants/seo-keywords';

export const metadata = {
  metadataBase: new URL(SEO_DEFAULTS.url),
  title: {
    default: `${SEO_DEFAULTS.siteName} | Scout Colony`,
    template: `%s | ${SEO_DEFAULTS.siteName}`,
  },
  description: SEO_DEFAULTS.description,
  keywords: SEO_KEYWORDS,
  authors: [{ name: SEO_DEFAULTS.siteName }],
  creator: SEO_DEFAULTS.siteName,
  openGraph: {
    type: "website",
    locale: SEO_DEFAULTS.locale,
    url: SEO_DEFAULTS.url,
    title: `${SEO_DEFAULTS.siteName} | Scout Colony`,
    siteName: SEO_DEFAULTS.siteName,
    description: SEO_DEFAULTS.description,
    images: [{ url: SEO_DEFAULTS.ogImage, alt: SEO_DEFAULTS.siteName }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_DEFAULTS.siteName} | Scout Colony`,
    description: SEO_DEFAULTS.description,
    images: [SEO_DEFAULTS.ogImage],
    creator: SEO_DEFAULTS.twitterHandle ?? undefined,
  },
  icons: {
    icon: SEO_DEFAULTS.logo,
    apple: SEO_DEFAULTS.logo,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: SEO_DEFAULTS.url,
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
