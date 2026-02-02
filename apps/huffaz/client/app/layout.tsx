import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Huffaz — Arabia Islamia',
  description: 'Huffaz Section — Registration, Fees, Attendance',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
