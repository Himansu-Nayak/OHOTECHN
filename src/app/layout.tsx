import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ohotech.com'),
  title: {
    default: 'OHO TECH — Software & Digital Technology Company Platform',
    template: '%s | OHO TECH',
  },
  description:
    'Building Tomorrow\'s Technology Today. OHO TECH designs and builds innovative software products, enterprise systems, custom software, and digital growth platforms.',
  keywords: [
    'OHO TECH',
    'Software Development',
    'Custom Software',
    'Enterprise ERP',
    'Healthcare EMR',
    'Education Management Systems',
    'Web Platforms',
    'Mobile Apps',
    'Cloud Infrastructure',
    'AI & Automation',
  ],
  authors: [{ name: 'OHO TECH', url: 'https://ohotech.com' }],
  creator: 'OHO TECH',
  publisher: 'OHO TECH',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'OHO TECH — Software & Digital Technology Company Platform',
    description:
      'Building Tomorrow\'s Technology Today. OHO TECH designs and builds innovative software products, enterprise systems, custom software, and digital growth platforms.',
    url: 'https://ohotech.com',
    siteName: 'OHO TECH',
    images: [
      {
        url: '/OHO_TECH_LOGO.png',
        width: 1200,
        height: 630,
        alt: 'OHO TECH — Software & Digital Technology Company',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OHO TECH — Software & Digital Technology Company Platform',
    description:
      'Building Tomorrow\'s Technology Today. OHO TECH designs and builds innovative software products, enterprise systems, custom software, and digital growth platforms.',
    creator: '@ohotech',
    images: ['/OHO_TECH_LOGO.png'],
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
    icon: '/OHO_TECH_LOGO.png',
    shortcut: '/OHO_TECH_LOGO.png',
    apple: '/OHO_TECH_LOGO.png',
  },
};

export default function RootLayout({
  children,
}: LayoutProps<'/'>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${jetBrainsMono.variable}`}>
      <body className="min-h-screen bg-[#f7f7f5] text-[#0d0d0e] font-sans antialiased selection:bg-[#0d0d0e] selection:text-white">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
