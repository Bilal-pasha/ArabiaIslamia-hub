import './globals.css'
import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import { ClientLocaleDir } from '@/components/client-locale-dir'
import { Toaster } from '@arabiaaislamia/ui'
import { Gulzar } from 'next/font/google'

export const metadata: Metadata = {
  title: {
    default: 'کتب خانہ | جامعہ عربیہ اسلامیہ',
    template: '%s | کتب خانہ',
  },
  description: 'کتب اور جاریات کا نظم – جامعہ عربیہ اسلامیہ لائبریری',
  keywords: ['کتب', 'جاریات', 'جامعہ عربیہ اسلامیہ', 'لائبریری'],
  authors: [{ name: 'جامعہ عربیہ اسلامیہ لائبریری' }],
  robots: {
    index: true,
    follow: true,
  },
  other: {
    google: 'notranslate',
  },
}

const gulzar = Gulzar({
  subsets: ['arabic'],
  weight: '400',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ur"
      dir="rtl"
      suppressHydrationWarning
      className={gulzar.className}
    >
      <body className="min-h-screen antialiased" data-theme="library">
        <Providers>
          <ClientLocaleDir />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}