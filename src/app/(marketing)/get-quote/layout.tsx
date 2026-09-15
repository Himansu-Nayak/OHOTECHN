import { Metadata } from 'next';
import { buildMetadata, getBreadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Request a Custom Software & Engineering Quote',
  description: 'Get an itemized engineering estimate and technical proposal for custom software development, mobile apps, or enterprise systems.',
  path: '/get-quote',
  tags: ['Software Quote', 'Project Proposal', 'Engineering Estimate', 'Custom Software'],
});

export default function GetQuoteLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Get Quote', url: '/get-quote' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      {children}
    </>
  );
}
