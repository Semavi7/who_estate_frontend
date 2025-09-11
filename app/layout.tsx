import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ReduxProvider } from "@/lib/redux/provider";
import { Toaster } from "sonner";
import { ThemeProvider } from "../components/public/theme-provider"
import OneSignalInitializer from "@/components/public/OneSignalInitializer";
import { URI } from "@/components/structured-data/url";
import { OrganizationSchema } from '@/components/structured-data/OrganizationSchema'
import AOSProvider from "@/components/public/AOSProvider";

export const metadata: Metadata = {
  metadataBase: new URL(URI),
  title: {
    default: 'Derya Emlak - Türkiye\'nin En Güvenilir Emlak Platformu',
    template: '%s | Derya Emlak'
  },
  description: 'Derya Emlak ile emlak alım-satım ve kiralama işlemlerinizi güvenle gerçekleştirin. Türkiye genelinde binlerce emlak ilanı.',
  keywords: ['emlak', 'gayrimenkul', 'ev', 'daire', 'satılık', 'kiralık', 'konut', 'işyeri'],
  authors: [{ name: 'Derya Emlak' }],
  creator: 'Derya Emlak',
  publisher: 'Derya Emlak',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: URI,
    siteName: 'Derya Emlak',
    title: 'Derya Emlak - Türkiye\'nin En Güvenilir Emlak Platformu',
    description: 'Derya Emlak ile emlak alım-satım ve kiralama işlemlerinizi güvenle gerçekleştirin.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1027,
        height: 428,
        alt: 'Derya Emlak',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Derya Emlak - Türkiye\'nin En Güvenilir Emlak Platformu',
    description: 'Derya Emlak ile emlak alım-satım ve kiralama işlemlerinizi güvenle gerçekleştirin.',
    images: ['/og-image.jpg'],
    creator: '@deryaemlak',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scrollbar-hide" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="ligth"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <OneSignalInitializer />
            <AOSProvider>
              {children}
            </AOSProvider>
          </ReduxProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
        <OrganizationSchema />
      </body>
    </html>
  )
}
