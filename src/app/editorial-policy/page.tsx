import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export const metadata = {
  title: 'Editorial Independence Policy | City Broadband Guide',
  description: 'Our commitment to unbiased, data-driven broadband comparisons.',
};

export default function EditorialPolicy() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="pt-32 pb-24 px-4 max-w-4xl mx-auto w-full flex-grow">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-8">Editorial Independence Policy</h1>
        <div className="prose prose-lg text-slate-600">
          <p>City Broadband Guide was founded on a single principle: providing Americans with honest, transparent, and hyper-local internet comparisons.</p>
          
          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Our Commitment to You</h2>
          <p>While we may receive affiliate compensation when you purchase a plan through our links, <strong>this compensation never dictates our rankings, our data, or our reviews.</strong></p>
          
          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Algorithmic Integrity</h2>
          <p>Our localized rankings (e.g., "Cheapest", "Fastest", "Top Pick") are generated programmatically using a strict database algorithm. A provider cannot pay us to artificially inflate their speeds, hide their data caps, or manipulate their post-promotional pricing. The data you see is the data we have validated.</p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Accuracy and Verification</h2>
          <p>Our editorial team constantly audits our database against FCC filings and direct provider documentation to ensure our pricing and performance metrics are strictly accurate. If you spot an error in our data, please contact us immediately.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}