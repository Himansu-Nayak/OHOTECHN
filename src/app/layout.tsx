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
  title: 'OHO TECH — Software & Digital Technology Company Platform',
  description: 'Building Tomorrow\'s Technology Today. OHO TECH provides innovative software products, custom software development, and digital marketing services.',
};

export default function RootLayout({
  children,
}: LayoutProps<'/'>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${jetBrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#0a0a0b] text-[#e8e8e6] font-sans antialiased selection:bg-emerald-500 selection:text-black" suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
