import './globals.css';
import { LayoutSwitcher } from '@/client/components/templates';
import { Toaster } from '@arabiaaislamia/ui';
import { SEO_DEFAULTS } from '@/constants/seo';

export const metadata = {
  metadataBase: new URL(SEO_DEFAULTS.url),
  title: {
    default: `${SEO_DEFAULTS.siteName} | Scout Colony`,
    template: `%s | ${SEO_DEFAULTS.siteName}`,
  },
  description: SEO_DEFAULTS.description,
  keywords: [
    'Jamia Arabia Islamia',
    'Islamic education Karachi',
    'Tahfeez ul Quran',
    'Hifz Quran',
    'Darse Nizami',
    'Dars e Nizami seminary',
    'Mahad ul Arabia',
    'Arabic language institute Pakistan',
    'Scout Colony Karachi',
    'Islamic seminary Pakistan',
    'Madrasa admissions',
    'Islamic studies',
    'جامعہ عربیہ اسلامیہ',
    'اسکاؤٹ کالونی',
  ],
  authors: [{ name: SEO_DEFAULTS.siteName }],
  creator: SEO_DEFAULTS.siteName,
  openGraph: {
    type: 'website',
    locale: SEO_DEFAULTS.locale,
    siteName: SEO_DEFAULTS.siteName,
    description: SEO_DEFAULTS.description,
    images: [{ url: SEO_DEFAULTS.ogImage, alt: SEO_DEFAULTS.siteName }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SEO_DEFAULTS.siteName} | Scout Colony`,
    description: SEO_DEFAULTS.description,
    images: [SEO_DEFAULTS.ogImage],
  },
  icons: {
    icon: '/images/Logo.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@700&family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased overflow-x-hidden" suppressHydrationWarning>
        <LayoutSwitcher>{children}</LayoutSwitcher>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
