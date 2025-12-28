import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { Toaster } from '@/components/ui/toaster';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://abs.com'),
  title: {
    default: 'ABS - Technology, AI & Business Community',
    template: '%s | ABS',
  },
  description:
    'A professional community for tech professionals, entrepreneurs, and AI enthusiasts. Read articles, share knowledge, and connect with like-minded people.',
  keywords: [
    'technology',
    'programming',
    'artificial intelligence',
    'startup',
    'business',
    'community',
    'blog',
  ],
  authors: [{ name: 'ABS Platform' }],
  creator: 'ABS Platform',
  publisher: 'ABS Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://abs.com',
    siteName: 'ABS Platform',
    title: 'ABS - Technology, AI & Business Community',
    description:
      'A professional community for tech professionals, entrepreneurs, and AI enthusiasts.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ABS Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ABS - Technology, AI & Business Community',
    description:
      'A professional community for tech professionals, entrepreneurs, and AI enthusiasts.',
    images: ['/og-image.png'],
    creator: '@absplatform',
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
