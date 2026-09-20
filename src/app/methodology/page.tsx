import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export const metadata = {
  title: 'Our Ranking Methodology | City Broadband Guide',
  description: 'How we score, rank, and evaluate internet service providers using federal FCC data and localized speed tests.',
};

export default function Methodology() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="pt-32 pb-24 px-4 max-w-4xl mx-auto w-full flex-grow">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-8">Our Scoring Methodology</h1>
        <div className="prose prose-lg text-slate-600">
          <p>At City Broadband Guide, we believe in absolute transparency. Our localized rankings are not arbitrary; they are generated through a strict, data-driven algorithm that weighs multiple objective factors to determine the best internet service provider for your exact address.</p>
          
          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">1. Federal FCC Nutrition Label Integration</h2>
          <p>We directly ingest and aggregate data from the Federal Communications Commission (FCC) Broadband Consumer Labels. When evaluating a provider, we heavily weight:</p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li><strong>Post-Promotional Pricing:</strong> We rank providers based on their long-term cost, not just introductory teaser rates.</li>
            <li><strong>Peak Latency:</strong> We analyze typical latency during high-congestion hours (7:00 PM - 11:00 PM) to ensure real-world reliability for gaming and streaming.</li>
            <li><strong>Data Caps:</strong> Providers offering unlimited data receive a significant scoring boost over those enforcing stringent data allowances.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">2. Proprietary Local Speed Tests</h2>
          <p>National averages mean nothing if the infrastructure in your specific neighborhood is degraded. We utilize a rolling 60-day aggregation of real-world speed tests taken by our users to determine actual localized throughput. Providers that consistently fail to deliver their advertised speeds are actively penalized in our local rankings.</p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">3. Infrastructure Type</h2>
          <p>The physical connection type plays a critical role in our scoring. Fiber-optic networks receive the highest baseline scores due to symmetrical upload/download speeds and lower latency, followed by Cable, 5G Home Internet, and Satellite.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}