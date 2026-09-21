const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DOMAIN = 'https://www.citybroadbandguide.com';
const URLS_PER_SITEMAP = 15000; // Chunk into easily digestible 15k blocks for Googlebot

async function generateSplitSitemaps() {
  console.log('Fetching database records for sitemaps...');

  const carriers = await prisma.carrier.findMany({
    where: { isActive: true },
    select: { slug: true }
  });

  const locations = await prisma.location.findMany({
    select: { state: true, city: true, zip: true }
  });

  console.log(`Found ${carriers.length} active carriers and ${locations.length} localized zip codes.`);

  const allUrls = [];

  // 1. Static Pages
  const staticPages = ['', '/resources', '/resources/fiber-vs-cable', '/research/state-of-broadband', '/research/fastest-cities'];
  for (const page of staticPages) {
    allUrls.push({
      loc: `${DOMAIN}${page}`,
      changefreq: 'weekly',
      priority: page === '' ? '1.0' : '0.8',
      lastmod: new Date().toISOString().split('T')[0]
    });
  }

  // 2. Provider Pages
  for (const carrier of carriers) {
    allUrls.push({
      loc: `${DOMAIN}/providers/${carrier.slug}`,
      changefreq: 'weekly',
      priority: '0.9',
      lastmod: new Date().toISOString().split('T')[0]
    });
  }

  // 3. Zip Code Landing Pages
  const today = new Date().toISOString().split('T')[0];
  for (const loc of locations) {
    const stateSlug = encodeURIComponent(loc.state.toLowerCase().replace(/\s+/g, '-'));
    const citySlug = encodeURIComponent(loc.city.toLowerCase().replace(/\s+/g, '-'));
    
    allUrls.push({
      loc: `${DOMAIN}/internet/${stateSlug}/${citySlug}/${loc.zip}`,
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: today
    });
  }

  console.log(`Total URLs to map: ${allUrls.length}`);

  // Chunk URLs
  const chunks = [];
  for (let i = 0; i < allUrls.length; i += URLS_PER_SITEMAP) {
    chunks.push(allUrls.slice(i, i + URLS_PER_SITEMAP));
  }

  // Generate individual sitemaps
  let sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const sitemapName = `sitemap-${i + 1}.xml`;
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (const url of chunk) {
      xml += `  <url>\n`;
      xml += `    <loc>${url.loc}</loc>\n`;
      if (url.lastmod) xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      xml += `    <priority>${url.priority}</priority>\n`;
      xml += `  </url>\n`;
    }
    xml += `</urlset>`;
    
    fs.writeFileSync(`public/${sitemapName}`, xml);
    console.log(`Generated ${sitemapName} with ${chunk.length} URLs`);
    
    sitemapIndexXml += `  <sitemap>\n`;
    sitemapIndexXml += `    <loc>${DOMAIN}/${sitemapName}</loc>\n`;
    sitemapIndexXml += `    <lastmod>${today}</lastmod>\n`;
    sitemapIndexXml += `  </sitemap>\n`;
  }

  sitemapIndexXml += `</sitemapindex>`;
  fs.writeFileSync('public/sitemap.xml', sitemapIndexXml);
  
  console.log(`\nSUCCESS: Generated root sitemap index at public/sitemap.xml pointing to ${chunks.length} child sitemaps!`);
  
  // Ensure robots.txt is updated
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${DOMAIN}/sitemap.xml\n`;
  fs.writeFileSync('public/robots.txt', robots);
}

generateSplitSitemaps().catch(console.error).finally(() => prisma.$disconnect());
