import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

const BASE_URL = siteConfig.url || 'https://ohotech.com';

interface MetadataOptions {
  title: string;
  description: string;
  path: string;
  ogType?: 'website' | 'article';
  image?: string;
  publishedTime?: string;
  authors?: string[];
  tags?: string[];
  noIndex?: boolean;
}

/**
 * Builds standard, strictly verified Next.js Metadata for any OHO TECH route.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogType = 'website',
  image = '/OHO_TECH_LOGO.png',
  publishedTime,
  authors,
  tags,
  noIndex = false,
}: MetadataOptions): Metadata {
  const fullUrl = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image.startsWith('/') ? image : `/${image}`}`;

  return {
    title,
    description,
    alternates: {
      canonical: fullUrl,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    openGraph: {
      title: `${title} | OHO TECH`,
      description,
      url: fullUrl,
      siteName: siteConfig.name,
      locale: 'en_US',
      type: ogType,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} — OHO TECH`,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(authors && { authors }),
      ...(tags && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | OHO TECH`,
      description,
      creator: '@ohotech',
      site: '@ohotech',
      images: [imageUrl],
    },
  };
}

/**
 * Organization Structured Data
 */
export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: siteConfig.name,
    url: BASE_URL,
    logo: `${BASE_URL}/OHO_TECH_LOGO.png`,
    description: siteConfig.description,
    founder: {
      '@type': 'Person',
      name: 'Japabandhu Kampa',
      jobTitle: 'Founder & Director',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bhubaneswar',
      addressRegion: 'Odisha',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.contact.phone,
      contactType: 'technical support',
      email: siteConfig.contact.email,
      availableLanguage: ['English', 'Hindi', 'Odia'],
    },
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.twitter,
      siteConfig.social.instagram,
      siteConfig.social.facebook,
      siteConfig.social.youtube,
    ].filter(Boolean),
  };
}

/**
 * WebSite Structured Data with SearchAction
 */
export function getWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
  };
}

/**
 * BreadcrumbList Structured Data
 */
export function getBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * TechArticle Structured Data for Insights Whitepapers
 */
export function getTechArticleJsonLd({
  title,
  description,
  url,
  publishedAt,
  authorName,
  authorRole,
  tags,
}: {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  authorName: string;
  authorRole: string;
  tags: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description,
    url: url.startsWith('http') ? url : `${BASE_URL}${url}`,
    datePublished: publishedAt,
    inLanguage: 'en-US',
    author: {
      '@type': 'Person',
      name: authorName,
      jobTitle: authorRole,
    },
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    keywords: tags.join(', '),
  };
}

/**
 * SoftwareApplication Structured Data for Work Case Studies & Products
 */
export function getSoftwareApplicationJsonLd({
  name,
  description,
  applicationCategory,
  operatingSystem = 'Web, Linux, iOS, Android',
  url,
}: {
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    applicationCategory,
    operatingSystem,
    url: url.startsWith('http') ? url : `${BASE_URL}${url}`,
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
  };
}
