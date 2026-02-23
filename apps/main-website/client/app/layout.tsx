import "./globals.css";
import { LayoutSwitcher } from "@/components/templates";
import { Toaster, ModalProvider } from "@arabiaaislamia/ui";
import { SEO_DEFAULTS } from "@/constants/seo";
import { Poppins } from "next/font/google";

export const metadata = {
  metadataBase: new URL(SEO_DEFAULTS.url),
  title: {
    default: `${SEO_DEFAULTS.siteName} | Scout Colony`,
    template: `%s | ${SEO_DEFAULTS.siteName}`,
  },
  description: SEO_DEFAULTS.description,
  keywords: [
    "Jamia Arabia Islamia",
    "Islamic education Karachi",
    "Tahfeez ul Quran",
    "Hifz Quran",
    "Darse Nizami",
    "Dars e Nizami seminary",
    "Mahad ul Arabia",
    "Arabic language institute Pakistan",
    "Scout Colony Karachi",
    "Islamic seminary Pakistan",
    "Madrasa admissions",
    "Islamic studies",
    "جامعہ عربیہ اسلامیہ",
    "اسکاؤٹ کالونی",
  ],
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
    icon: "/images/Logo.png",
    apple: "/images/Logo.png",
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
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }),
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="antialiased overflow-x-hidden" suppressHydrationWarning>
        <ModalProvider>
          <LayoutSwitcher>{children}</LayoutSwitcher>
          <Toaster richColors position="top-right" />
        </ModalProvider>
      </body>
    </html>
  );
}
