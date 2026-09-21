import { MetadataRoute } from 'next'
import prisma from "@/lib/prisma";



export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://citybroadbandguide.com' // You will change this in production

  // 1. Static Routes
  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/locations`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/research/state-of-broadband`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.9 }
  ] as MetadataRoute.Sitemap;

  
  // 1.5 Fetch Providers
  const carriers = await prisma.carrier.findMany({ select: { slug: true, updatedAt: true } });
  const providerRoutes = carriers.map(c => ({
    url: `${baseUrl}/providers/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.9,
  })) as MetadataRoute.Sitemap;
  
  // 2. Fetch all distinct locations for PSEO pages
  const locations = await prisma.location.findMany({
    select: { state: true, city: true, zip: true },
    orderBy: { zip: 'asc' }
  });

  // Extract distinct States and Cities
  const states = Array.from(new Set(locations.map(loc => loc.state)));
  const cities = Array.from(new Set(locations.map(loc => `${loc.state}|${loc.city}`)));

  // 3. State Pages (/internet/[state])
  const stateRoutes = states.map(state => ({
    url: `${baseUrl}/internet/${state.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  })) as MetadataRoute.Sitemap;

  // 4. City Pages (/internet/[state]/[city])
  const cityRoutes = cities.map(cityStr => {
    const [state, city] = cityStr.split('|');
    return {
      url: `${baseUrl}/internet/${state.toLowerCase()}/${city.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  }) as MetadataRoute.Sitemap;

  // 5. Zip Code Pages (/internet/[state]/[city]/[zip])
  const zipRoutes = locations.map(loc => ({
    url: `${baseUrl}/internet/${loc.state.toLowerCase()}/${loc.city.toLowerCase().replace(/\s+/g, '-')}/${loc.zip}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  })) as MetadataRoute.Sitemap;

  return [...staticRoutes, ...providerRoutes, ...stateRoutes, ...cityRoutes, ...zipRoutes];
}