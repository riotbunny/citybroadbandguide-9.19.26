import Navbar from '../../components/Navbar'

export const metadata = {
  title: 'Privacy Policy | City Broadband Guide',
  description: 'Learn how City Broadband Guide protects your privacy and handles your data.',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="pt-32 pb-24 max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Privacy Policy</h1>
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 prose prose-slate max-w-none">
          <p className="text-sm text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            City Broadband Guide ("we", "our", or "us") is committed to protecting your privacy. We collect minimal personal information. The information we may collect includes your IP address (used temporarily for geographic routing to provide accurate local internet plans), browser type, and interactions with our website. We do not store your exact physical address.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">2. Cookies and Tracking</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            We use cookies and similar tracking technologies to improve user experience and analyze website traffic. Some of our affiliate partners may also place cookies on your browser when you click outbound links to their sites in order to track referrals.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">3. Affiliate Links</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            We participate in various affiliate marketing programs. When you click on links to various merchants on this site and make a purchase, this can result in this site earning a commission. Affiliate networks automatically track conversions using cookies, but we do not pass personally identifiable information to these networks.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">4. Third-Party Services</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Our website may contain links to third-party websites (e.g., Internet Service Providers). We are not responsible for the privacy practices or content of those third-party sites. We encourage you to read their privacy policies before providing them with any personal information.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">5. Contact Us</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us through our primary support channels.
          </p>
        </div>
      </div>
    </div>
  )
}