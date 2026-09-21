const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DOMAIN = 'https://www.citybroadbandguide.com';

async function generateSitemap() {
  console.log('Fetching database records for sitemap...');

  const carriers = await prisma.carrier.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true }
  });

  console.log(`Found ${carriers.length} active carriers.`);

  // Get ALL locations since Nationwide providers ensure no page is empty
  const locations = await prisma.location.findMany({
    select: { state: true, city: true, zip: true }
  });

  console.log(`Found ${locations.length} localized zip code pages.`);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // 1. Static Pages
  const staticPages = [
    '',
    '/resources',
    '/resources/fiber-vs-cable',
    '/research/state-of-broadband',
    '/research/fastest-cities'
  ];

  for (const page of staticPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${DOMAIN}${page}</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n`;
    xml += `  </url>\n`;
  }

  // 2. Provider Pages
  for (const carrier of carriers) {
    xml += `  <url>\n`;
    xml += `    <loc>${DOMAIN}/providers/${carrier.slug}</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;
  }

  // 3. Zip Code Landing Pages (Programmatic SEO)
  const today = new Date().toISOString().split('T')[0];
  
  for (const loc of locations) {
    const stateSlug = encodeURIComponent(loc.state.toLowerCase().replace(/\s+/g, '-'));
    const citySlug = encodeURIComponent(loc.city.toLowerCase().replace(/\s+/g, '-'));
    
    xml += `  <url>\n`;
    xml += `    <loc>${DOMAIN}/internet/${stateSlug}/${citySlug}/${loc.zip}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;

  fs.writeFileSync('public/sitemap.xml', xml);
  console.log(`\nSUCCESS: Generated public/sitemap.xml with ${staticPages.length + carriers.length + locations.length} URLs!`);
  
  // Generate robots.txt
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${DOMAIN}/sitemap.xml\n`;
  fs.writeFileSync('public/robots.txt', robots);
  console.log(`SUCCESS: Generated public/robots.txt`);
}

generateSitemap().catch(console.error).finally(() => prisma.$disconnect());
