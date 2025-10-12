// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.infodirect.ir'
  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    // اگر صفحات فرعی داری اینجا اضافه کن:
    // { url: `${base}/industries/furniture`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // { url: `${base}/industries/food`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]
}
