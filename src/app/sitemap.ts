import type { MetadataRoute } from 'next';
import { services } from '@/config/services';
import { industries } from '@/config/industries';
import { WORK_PROJECTS } from '@/config/work';
import { INSIGHT_ARTICLES } from '@/config/insights';
import { siteConfig } from '@/config/site';

const BASE_URL = siteConfig.url || 'https://ohotech.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // 1. Core Static Marketing & Company Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/work`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/technology`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.90,
    },
    {
      url: `${BASE_URL}/solutions`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.90,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/insights`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.90,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.80,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/get-quote`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.80,
    },
    {
      url: `${BASE_URL}/book-demo`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.80,
    },
    {
      url: `${BASE_URL}/partner`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.70,
    },
    {
      url: `${BASE_URL}/careers`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.70,
    },
    {
      url: `${BASE_URL}/developer`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.70,
    },
    // Legal & Policy Pages
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.50,
    },
    {
      url: `${BASE_URL}/terms-and-conditions`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.50,
    },
    {
      url: `${BASE_URL}/refund-cancellation`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.50,
    },
    {
      url: `${BASE_URL}/cookie-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.50,
    },
    {
      url: `${BASE_URL}/disclaimer`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.50,
    },
    {
      url: `${BASE_URL}/licenses`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.50,
    },
  ];

  // 2. Dynamic Work Case Studies
  const workRoutes: MetadataRoute.Sitemap = WORK_PROJECTS.map((project) => ({
    url: `${BASE_URL}/work/${project.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  // 3. Dynamic Insights Technical Whitepapers
  const insightsRoutes: MetadataRoute.Sitemap = INSIGHT_ARTICLES.map((article) => ({
    url: `${BASE_URL}/insights/${article.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  // 4. Dynamic Engineering Services
  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 5. Dynamic Industry Solutions
  const industryRoutes: MetadataRoute.Sitemap = industries.map((industry) => ({
    url: `${BASE_URL}/solutions/${industry.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [
    ...staticRoutes,
    ...workRoutes,
    ...insightsRoutes,
    ...serviceRoutes,
    ...industryRoutes,
  ];
}
