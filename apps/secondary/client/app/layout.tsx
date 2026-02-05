import './globals.css';
import { PageFadeUp } from '@/components/page-fade-up';
import { Providers } from '@/components/providers';

export const metadata = {
  title: {
    default: 'Arabia Islamia — Secondary Education',
    template: '%s | Arabia Islamia Secondary',
  },
  description: 'Online admission and registration for Arabia Islamia Secondary Education.',
  keywords: ['Arabia Islamia', 'secondary education', 'admission', 'registration'],
  authors: [{ name: 'Arabia Islamia' }],
  openGraph: {
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased overflow-x-hidden" suppressHydrationWarning>
        <Providers>
          <PageFadeUp className="min-h-screen w-full min-w-0">
            {children}
          </PageFadeUp>
        </Providers>
      </body>
    </html>
  );
}
