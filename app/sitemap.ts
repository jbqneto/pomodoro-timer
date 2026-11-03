import type { MetadataRoute } from 'next';
import { urlFor } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: urlFor('en', 'home'), changeFrequency: 'weekly', priority: 1 },
    { url: urlFor('pt', 'home'), changeFrequency: 'weekly', priority: 0.9 },
    { url: urlFor('en', 'about'), changeFrequency: 'monthly', priority: 0.5 },
    { url: urlFor('pt', 'about'), changeFrequency: 'monthly', priority: 0.5 },
  ];
}
