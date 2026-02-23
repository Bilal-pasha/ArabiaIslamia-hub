import { MetadataRoute } from 'next';
import { SEO_DEFAULTS } from '@/constants/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SEO_DEFAULTS.url;

  const routes = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/faculties', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/more', priority: 0.8, changeFrequency: 'weekly' as const },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path || ''}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
