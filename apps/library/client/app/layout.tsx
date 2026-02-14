import './globals.css';
import { Providers } from '@/components/providers';
import { ClientLocaleDir } from '@/components/client-locale-dir';
import { Toaster } from '@arabiaaislamia/ui';

export const metadata = {
  title: { default: 'کتب خانہ | جامعہ عربیہ اسلامیہ', template: '%s | کتب خانہ' },
  description: 'کتب اور جاریات کا نظم – جامعہ عربیہ اسلامیہ لائبریری',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ur" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;600;700&family=Noto+Nastaliq+Urdu:wght@400;700&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased font-sans">
        <Providers>
          <ClientLocaleDir />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
