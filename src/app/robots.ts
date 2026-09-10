import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/dashboard',
          '/dashboard/*',
          '/cart',
          '/checkout',
          '/orders',
          '/orders/*',
          '/profile',
          '/developer',
          '/my-products',
          '/licenses',
          '/subscriptions',
          '/notifications',
        ],
      },
    ],
    sitemap: 'https://ohotech.com/sitemap.xml',
  };
}
