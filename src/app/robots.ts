import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

const BASE_URL = siteConfig.url || 'https://ohotech.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/cart/',
          '/checkout/',
          '/orders/',
          '/profile/',
          '/subscriptions/',
          '/my-products/',
          '/notifications/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
