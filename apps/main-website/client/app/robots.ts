import { MetadataRoute } from 'next';
import { SEO_DEFAULTS } from '@/constants/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${SEO_DEFAULTS.url}/sitemap.xml`,
  };
}
