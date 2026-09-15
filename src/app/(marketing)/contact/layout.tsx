import { Metadata } from 'next';
import { buildMetadata, getBreadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Contact Engineering & Direct Architect Discovery | OHO TECH',
  description: 'Directly connect with Founder & Director Japabandhu Kampa and lead system architects. SLA-backed 24-hour response on enterprise software discovery.',
  path: '/contact',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Contact & Discovery', url: '/contact' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      {children}
    </>
  );
}
