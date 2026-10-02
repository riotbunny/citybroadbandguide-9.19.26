"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, X, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function BrownsvilleLandingPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone: '',
    dob: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
    } catch (error) {
      console.error('Error submitting lead:', error);
    }
    
    setIsSubmitting(false);
    router.push('/brownsvillearea/thank-you');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="bg-indigo-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Special Internet Offers for the <span className="text-orange-400">Brownsville Area</span>
          </h1>
          <p className="text-lg text-indigo-200 max-w-2xl mx-auto">
            Compare the top internet providers in Brownsville. Lock in special pricing and get connected fast.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Omni Fiber (HOT ITEM) */}
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-orange-400 overflow-hidden transform md:-translate-y-4 relative flex flex-col">
            <div className="bg-orange-500 text-white text-center py-2 font-black tracking-wider uppercase text-sm flex items-center justify-center gap-2">
              <Zap size={16} /> Hot Item & Top Pick
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h2 className="text-2xl font-black text-slate-900 mb-2">Omni Fiber</h2>
              <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100">Fast Fiber. Great Prices. Power your home.</p>
              
              <div className="flex items-end gap-1 mb-6">
                <span className="text-slate-500 font-medium">Starting at</span>
                <span className="text-5xl font-black text-slate-900">$50</span>
                <span className="text-slate-500 font-medium pb-1">/mo</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2 text-slate-700">
                  <Check className="text-green-500 mt-0.5 shrink-0" size={18} />
                  <span>Speeds from <strong>500 Mbps</strong> to <strong>2 GIG</strong></span>
                </li>
                <li className="flex items-start gap-2 text-slate-700">
                  <Check className="text-green-500 mt-0.5 shrink-0" size={18} />
                  <span>We'll <strong>Price Match</strong></span>
                </li>
                <li className="flex items-start gap-2 text-slate-700">
                  <Check className="text-green-500 mt-0.5 shrink-0" size={18} />
                  <span><strong>No Contracts</strong>. Freedom you can count on.</span>
                </li>
                <li className="flex items-start gap-2 text-slate-700">
                  <Check className="text-green-500 mt-0.5 shrink-0" size={18} />
                  <span>Gift Cards Available!</span>
                </li>
              </ul>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-lg rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/30"
              >
                Sign Up Online <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Spectrum */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col opacity-90">
            <div className="p-6 flex-1 flex flex-col">
              <h2 className="text-2xl font-black text-slate-900 mb-2">Spectrum</h2>
              <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100">Standard Cable Internet.</p>
              
              <div className="flex items-end gap-1 mb-6">
                <span className="text-slate-500 font-medium">Starting at</span>
                <span className="text-4xl font-black text-slate-900">$90</span>
                <span className="text-slate-500 font-medium pb-1">/mo</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2 text-slate-500">
                  <Check className="text-slate-400 mt-0.5 shrink-0" size={18} />
                  <span>Speeds up to 1 Gig</span>
                </li>
                <li className="flex items-start gap-2 text-slate-500">
                  <Check className="text-slate-400 mt-0.5 shrink-0" size={18} />
                  <span>Equipment fees may apply</span>
                </li>
              </ul>

              <a 
                href="tel:1-888-482-6192"
                className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-200"
              >
                <Phone size={20} /> Call Now
              </a>
            </div>
          </div>

          {/* AT&T */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col opacity-90">
            <div className="p-6 flex-1 flex flex-col">
              <h2 className="text-2xl font-black text-slate-900 mb-2">AT&T Internet</h2>
              <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100">Standard Fiber Connection.</p>
              
              <div className="flex items-end gap-1 mb-6">
                <span className="text-slate-500 font-medium">Starting at</span>
                <span className="text-4xl font-black text-slate-900">$90</span>
                <span className="text-slate-500 font-medium pb-1">/mo</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2 text-slate-500">
                  <Check className="text-slate-400 mt-0.5 shrink-0" size={18} />
                  <span>Speeds up to 1 Gig</span>
                </li>
                <li className="flex items-start gap-2 text-slate-500">
                  <Check className="text-slate-400 mt-0.5 shrink-0" size={18} />
                  <span>Subject to availability</span>
                </li>
              </ul>

              <a 
                href="tel:1-888-482-6192"
                className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-200"
              >
                <Phone size={20} /> Call Now
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Modal Form for Omni Fiber */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="bg-indigo-900 text-white p-6 relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-indigo-300 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <h3 className="text-2xl font-black mb-1">Check Availability</h3>
              <p className="text-indigo-200 text-sm">Lock in your $50/mo Omni Fiber rate today.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Installation Address</label>
                  <input 
                    type="text" 
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="123 Main St, Brownsville, TX 78520"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="(956) 555-0123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Date of Birth</label>
                  <p className="text-xs text-slate-500 mb-2">You must be 18 or older to schedule installation.</p>
                  <input 
                    type="date" 
                    name="dob"
                    required
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  />
                </div>
              </div>

              <div className="mt-8">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-black text-lg rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/30"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Submit & Secure Rate <ShieldCheck size={20} /></>
                  )}
                </button>
                <p className="text-center text-xs text-slate-500 mt-4">
                  By submitting, you agree to be contacted regarding Omni Fiber installation.
                </p>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
