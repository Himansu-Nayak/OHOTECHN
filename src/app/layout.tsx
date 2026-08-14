import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

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
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${jetBrainsMono.variable}`}>
      <body className="min-h-screen bg-[#f7f7f5] text-[#0d0d0e] font-sans antialiased selection:bg-[#0d0d0e] selection:text-white">
        {children}
      </body>
    </html>
  );
}
