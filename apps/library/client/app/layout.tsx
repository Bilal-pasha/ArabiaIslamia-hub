import './globals.css';
import { Providers } from '@/components/providers';
import { ClientLocaleDir } from '@/components/client-locale-dir';
import { Toaster } from '@arabiaaislamia/ui';
import { appRtlFont } from '@/lib/font';

export const metadata = {
  title: { default: 'کتب خانہ | جامعہ عربیہ اسلامیہ', template: '%s | کتب خانہ' },
  description: 'کتب اور جاریات کا نظم – جامعہ عربیہ اسلامیہ لائبریری',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ur" dir="rtl" suppressHydrationWarning className={appRtlFont.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="کتب اور جاریات کا نظم – جامعہ عربیہ اسلامیہ لائبریری" />
        <meta name="keywords" content="کتب, جاریات, جامعہ عربیہ اسلامیہ, لائبریری" />
        <meta name="author" content="جامعہ عربیہ اسلامیہ لائبریری" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="google" content="notranslate" />
      </head>
      <body className="min-h-screen antialiased" data-theme="library">
        <Providers>
          <ClientLocaleDir />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
