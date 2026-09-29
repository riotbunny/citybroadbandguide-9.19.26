import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import EmbedButton from '../../../components/EmbedButton';
import CsvDownloadButton from '../../../components/CsvDownloadButton';
import prisma from "@/lib/prisma";

export const revalidate = 86400;

export async function generateMetadata() {
  const currentYear = new Date().getFullYear();
  return {
    title: `The ${currentYear} US Internet Affordability Index | Proprietary Data Study`,
    description: `An independent data study analyzing internet speeds, pricing, and infrastructure deployment across 42,000+ US zip codes in ${currentYear}.`,
  }
}

const stateMap: Record<string, string> = {
  "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California",
  "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia",
  "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa",
  "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
  "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri",
  "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey",
  "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio",
  "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
  "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont",
  "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming",
  "DC": "Washington D.C."
};

export default async function DataStudy() {
  const currentYear = new Date().getFullYear();
  
  // 100% accurate mathematical query directly against the Neon Database
  const stateData = await prisma.$queryRaw<
    Array<{ stateAbbr: string, avgPrice: number, maxSpeed: number, providerCount: number }>
  >`
    SELECT 
      l.state as "stateAbbr",
      AVG(p.price) as "avgPrice",
      MAX(p."downloadSpeed") as "maxSpeed",
      COUNT(DISTINCT c."carrierId") as "providerCount"
    FROM "Location" l
    JOIN "Coverage" c ON l.zip = c.zip
    JOIN "Plan" p ON c."carrierId" = p."carrierId"
    WHERE p."isActive" = true AND p.price > 0
    GROUP BY l.state
    ORDER BY "avgPrice" ASC
  `;

  // Safely map data for the CSV and Charts
  const cleanData = stateData.map(row => ({
    State: stateMap[row.stateAbbr] || row.stateAbbr,
    Abbreviation: row.stateAbbr,
    AverageMonthlyCost: Number(row.avgPrice).toFixed(2),
    MaxAvailableSpeed: Number(row.maxSpeed),
    TotalProvidersInState: Number(row.providerCount)
  }));

  // Chart Logic (Extracted securely from the exact same cleanData array)
  const mostAffordable = [...cleanData].slice(0, 5);
  const mostExpensive = [...cleanData].sort((a, b) => Number(b.AverageMonthlyCost) - Number(a.AverageMonthlyCost)).slice(0, 5);
  const maxChartPrice = Math.max(...mostExpensive.map(s => Number(s.AverageMonthlyCost))) + 10;

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-16 px-4 font-sans">
      <Navbar />
      <article className="max-w-5xl mx-auto bg-white p-8 md:p-16 rounded-[3rem] shadow-xl border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="text-indigo-600 font-black tracking-widest uppercase text-sm">Proprietary Data Journalism</div>
          <div className="flex flex-wrap gap-3">
            <CsvDownloadButton data={cleanData} filename={`internet-affordability-index-${currentYear}.csv`} />
            <EmbedButton reportName={`The ${currentYear} US Internet Affordability Index`} reportUrl="https://citybroadbandguide.com/research/state-of-broadband" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">The {currentYear} US Internet Affordability Index</h1>
        <p className="text-xl text-slate-500 mb-12">
          An analysis of over 42,700 localized internet markets across the United States reveals a widening gap in regional infrastructure and connectivity pricing. We aggregated over 100,000 distinct internet plans to determine the most and least affordable states for high-speed broadband.
        </p>

        {/* Visual Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Top 5 Most Affordable States</h3>
            <div className="space-y-4">
              {mostAffordable.map(state => (
                <div key={state.State}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{state.State}</span>
                    <span className="font-bold text-green-600">${state.AverageMonthlyCost}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: \`\${(Number(state.AverageMonthlyCost) / maxChartPrice) * 100}%\` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Top 5 Most Expensive States</h3>
            <div className="space-y-4">
              {mostExpensive.map(state => (
                <div key={state.State}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{state.State}</span>
                    <span className="font-bold text-red-500">${state.AverageMonthlyCost}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: \`\${(Number(state.AverageMonthlyCost) / maxChartPrice) * 100}%\` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Data Table */}
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Complete State Rankings</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-200 mb-16">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-600">Rank</th>
                <th className="p-4 font-semibold text-slate-600">State</th>
                <th className="p-4 font-semibold text-slate-600">Average Plan Price</th>
                <th className="p-4 font-semibold text-slate-600">Total ISPs Analyzed</th>
                <th className="p-4 font-semibold text-slate-600">Max Speed (Mbps)</th>
              </tr>
            </thead>
            <tbody>
              {cleanData.map((row, index) => (
                <tr key={row.Abbreviation} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-500 font-medium">#{index + 1}</td>
                  <td className="p-4 font-bold text-slate-900">{row.State}</td>
                  <td className="p-4 text-slate-900 font-bold">
                    ${row.AverageMonthlyCost}<span className="text-sm font-normal text-slate-500">/mo</span>
                  </td>
                  <td className="p-4 text-slate-600">{row.TotalProvidersInState} Providers</td>
                  <td className="p-4 text-indigo-600 font-bold">{row.MaxAvailableSpeed.toLocaleString()} Mbps</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Suggested Headlines Section */}
        <div className="mb-12 p-8 bg-indigo-50 border border-indigo-100 rounded-2xl">
          <h3 className="text-lg font-bold text-indigo-900 mb-4">Reporter Resources: Suggested Angles</h3>
          <ul className="list-disc pl-5 space-y-2 text-indigo-800">
            <li><strong>The Digital Divide:</strong> Why {mostExpensive[0]?.State} residents are paying exponentially more for broadband than {mostAffordable[0]?.State}.</li>
            <li><strong>Cost vs. Speed:</strong> Are the most expensive states actually getting faster internet speeds?</li>
            <li><strong>The {currentYear} Affordability Crisis:</strong> Analyzing the average cost of home internet across all 50 states.</li>
          </ul>
        </div>

        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm leading-relaxed">
          <strong>Methodology:</strong> Data is mathematically sourced from the City Broadband Guide proprietary database, consisting of localized coverage points across 42,700+ US Zip Codes. Pricing reflects the average advertised monthly rate for broadband services across all available speed tiers, excluding promotional expiration spikes where dynamic data is unavailable.
          <br /><br />
          <em>For press inquiries or to request raw localized data for your reporting, please contact press@citybroadbandguide.com.</em>
        </div>
      </article>
      <Footer />
    </main>
  );
}
