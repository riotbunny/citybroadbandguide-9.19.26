const fs = require('fs');

const zipFile = 'src/app/internet/[state]/[city]/[zip]/page.tsx';
let zipCode = fs.readFileSync(zipFile, 'utf8');

// 1. Remove Fake UGC Math in metadata
zipCode = zipCode.replace(/\/\/ Deterministic UGC.*?const reviewCountUI = 12 \+ \(zipNum % 88\);/gs, '');

// 2. Remove Fake UGC Math in component
zipCode = zipCode.replace(/const zipNum = parseInt\(zip\).*?const reviewCountUI = 12 \+ \(zipNum % 88\);/gs, '');

// 3. Rewrite JSON-LD to use ItemList instead of FAQPage and remove AggregateRating
const newJsonLd = `  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": \`Internet Providers in \${cityName}, \${stateUpper} \${location.zip}\`,
      "description": \`Comparison of internet providers available in \${location.zip}.\`
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://yourwebsite.com" },
        { "@type": "ListItem", "position": 2, "name": stateUpper, "item": \`https://yourwebsite.com/internet/\${state.toLowerCase()}\` },
        { "@type": "ListItem", "position": 3, "name": cityName, "item": \`https://yourwebsite.com/internet/\${state.toLowerCase()}/\${city.toLowerCase()}\` },
        { "@type": "ListItem", "position": 4, "name": location.zip, "item": \`https://yourwebsite.com/internet/\${state.toLowerCase()}/\${city.toLowerCase()}/\${location.zip}\` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": availableCarriers.map((c, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Organization",
          "name": c.name,
          "url": c.affiliateUrl || \`https://yourwebsite.com/providers/\${c.slug}\`
        }
      }))
    }
  ];`;

zipCode = zipCode.replace(/const jsonLd = \[.*?\];/gs, newJsonLd);

// 4. Remove meta robots from generateMetadata (Task 3 prep)
zipCode = zipCode.replace(/,\s*robots:.*?\}\s*\}/g, '\n  }');
// There might be a trailing comma issue, let's just do a simpler replace.
zipCode = zipCode.replace(/,\s*robots: activeCarriers\.length > 0 \? \{ index: true, follow: true \} : \{ index: false, follow: true \}/g, '');


fs.writeFileSync(zipFile, zipCode);

// Do the same for [city]/page.tsx
const cityFile = 'src/app/internet/[state]/[city]/page.tsx';
let cityCode = fs.readFileSync(cityFile, 'utf8');

// Replace FAQPage with ItemList in City
const newCityJsonLd = `  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": uniqueCarriers.map((c, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Organization",
        "name": c.name
      }
    }))
  };`;
cityCode = cityCode.replace(/const jsonLd = \{.*?\]\s*\};/gs, newCityJsonLd);
fs.writeFileSync(cityFile, cityCode);

// Do the same for [state]/page.tsx
const stateFile = 'src/app/internet/[state]/page.tsx';
let stateCode = fs.readFileSync(stateFile, 'utf8');

// In State, it's a list of cities. We can just remove the FAQPage.
stateCode = stateCode.replace(/const jsonLd = \{.*?\]\s*\};\s*return \(/gs, 'return (');
stateCode = stateCode.replace(/<script type="application\/ld\+json" dangerouslySetInnerHTML={{ __html: JSON.stringify\(jsonLd\) }} \/>\s*/g, '');

fs.writeFileSync(stateFile, stateCode);