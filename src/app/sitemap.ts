import type { MetadataRoute } from 'next';
import { services } from '@/config/services';

const BASE_URL = 'https://ohotech.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/about',
    '/services',
    '/products',
    '/solutions',
    '/pricing',
    '/contact',
    '/get-quote',
    '/book-demo',
    '/partner',
    '/careers',
    '/developer',
    '/privacy-policy',
    '/terms-and-conditions',
    '/refund-cancellation',
    '/cookie-policy',
    '/disclaimer',
    '/licenses',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : route === '/services' || route === '/products' || route === '/solutions' ? 0.9 : 0.8,
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${BASE_URL}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const industryRoutes = [
    'healthcare',
    'education',
    'retail-ecommerce',
    'hospitality',
    'finance-banking',
    'logistics-supply-chain',
  ].map((slug) => ({
    url: `${BASE_URL}/solutions/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...serviceRoutes, ...industryRoutes];
}
