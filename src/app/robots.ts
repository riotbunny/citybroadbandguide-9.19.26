import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/login',
        '/*?*', // Block all faceted query parameters from indexation to preserve crawl budget
        '/*/cheapest$', // Block long-tail programmatic doorways
        '/*/fastest$'
      ],
    },
    sitemap: 'https://citybroadbandguide.com/sitemap.xml',
  }
}