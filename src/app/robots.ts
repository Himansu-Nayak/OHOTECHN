import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url || 'https://ohotechn.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
