import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-black text-slate-900 mb-4">
          Request Received!
        </h1>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          Thank you for your interest in becoming an Omni customer. A representative will be contacting you soon to schedule your installation date and time.
        </p>

        <Link 
          href="/brownsvillearea"
          className="inline-block w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
