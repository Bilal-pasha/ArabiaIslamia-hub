import './globals.css';
import { MainLayout } from '@/components/templates';

export const metadata = {
  title: 'Jamia Arabia Islamia | Scout Colony',
  description:
    'Jamia Arabia Islamia - Where tradition meets innovation, and faith meets knowledge. Islamic education, Tahfeez ul Quran, Darse Nizami, Mahad ul Arabia.',
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
      <body className="font-sans antialiased" suppressHydrationWarning>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
