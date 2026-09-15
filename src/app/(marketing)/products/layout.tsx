import { Metadata } from 'next';
import { buildMetadata, getBreadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Enterprise Software Products & System Modules',
  description: 'Explore verified OHO TECH software products and enterprise ERP modules across Healthcare, Education, Retail, Hospitality, and Financial systems.',
  path: '/products',
  tags: ['Software Products', 'Enterprise Modules', 'ERP Software', 'EMR System'],
});

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Products Catalog', url: '/products' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      {children}
    </>
  );
}
