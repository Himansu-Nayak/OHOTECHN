import type { MetadataRoute } from 'next';
import { services } from '@/config/services';
import { industries } from '@/config/industries';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ohotech.com';

  const staticRoutes = [
    '',
    '/about',
    '/services',
    '/solutions',
    '/products',
    '/pricing',
    '/contact',
    '/book-demo',
    '/get-quote',
    '/partner',
    '/careers',
    '/terms-and-conditions',
    '/privacy-policy',
    '/cookie-policy',
    '/refund-cancellation',
    '/disclaimer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const solutionRoutes = industries.map((ind) => ({
    url: `${baseUrl}/solutions/${ind.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...solutionRoutes];
}
