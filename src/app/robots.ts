import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // In production, you would swap this to your actual domain
  const baseUrl = 'https://citybroadbandguide.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}