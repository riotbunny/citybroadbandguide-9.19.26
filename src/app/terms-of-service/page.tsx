import Navbar from '../../components/Navbar'

export const metadata = {
  title: 'Terms of Service | City Broadband Guide',
  description: 'Terms of Service and Legal Disclaimers for City Broadband Guide.',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="pt-32 pb-24 max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Terms of Service</h1>
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 prose prose-slate max-w-none">
          <p className="text-sm text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            By accessing and using City Broadband Guide, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">2. FTC Affiliate Disclosure</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            City Broadband Guide is an independent, advertising-supported comparison service. We may receive compensation from the Internet Service Providers (ISPs) featured on this website when you click on links or call phone numbers provided. This compensation may impact how and where products appear on this site. We do not include all available ISPs or internet plans in your area.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">3. Data Accuracy & Disclaimers</h2>
          <p className="text-slate-600 mb-6 leading-relaxed border-l-4 border-red-500 pl-4 bg-red-50 py-3 pr-3">
            <strong>CRITICAL NOTICE:</strong> All data, including pricing, download/upload speeds, coverage maps, and availability, is provided on an "AS IS" basis. We aggregate data from various public and private sources. We make NO guarantees regarding the accuracy, completeness, or current validity of this data. Pricing and availability are highly localized and subject to change at any time without notice. You must verify all claims, pricing, and terms directly with the Internet Service Provider before signing a contract.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">4. No Government Affiliation</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            City Broadband Guide is a private entity and is NOT affiliated with, endorsed by, or sponsored by the Federal Communications Commission (FCC), the United States Government, or any state or local regulatory body. Any mention of public data sets is for informational aggregation purposes only.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">5. Limitation of Liability</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            In no event shall City Broadband Guide, its directors, employees, or agents be liable for any indirect, incidental, special, consequential or punitive damages arising out of your access to or use of, or inability to access or use, the website or any provider plans listed herein.
          </p>
        
          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">6. Editorial Opinions & Reviews</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Any reviews, "About" summaries, or provider descriptions published on City Broadband Guide represent our editorial opinion or an aggregation of public sentiment. They do not constitute statements of absolute fact. Internet performance varies heavily by neighborhood, hardware, and network congestion. Our editorial reviews are provided strictly for informational purposes and should not be solely relied upon when making purchasing decisions.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">7. Trademarks & Copyrights</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            All company names, brand names, trademarks, logos, and service marks prominently displayed on this website (including but not limited to AT&T, Verizon, Spectrum, T-Mobile, etc.) are the property of their respective owners. City Broadband Guide claims no ownership over these marks. Their use on this website is solely for identification and nominative fair use purposes to allow consumers to compare third-party services.
          </p>
        </div>
      </div>
    </div>
  )
}