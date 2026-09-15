import { Metadata } from 'next';
import { buildMetadata, getBreadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Book a Live Enterprise Software Demo',
  description: 'Schedule an interactive walkthrough with our technical architects. Experience Hospital EMR, University ERP, Retail POS, or Hotel Management in action.',
  path: '/book-demo',
  tags: ['Software Demo', 'Enterprise Walkthrough', 'Architecture Review', 'Live Demo'],
});

export default function BookDemoLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Book Demo', url: '/book-demo' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      {children}
    </>
  );
}
