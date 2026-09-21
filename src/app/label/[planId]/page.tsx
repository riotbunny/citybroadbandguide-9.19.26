import prisma from "@/lib/prisma";
import { notFound } from 'next/navigation';

export default async function FCCLabelPage({ params }: { params: Promise<{ planId: string }> }) {
  const { planId } = await params;
  
  const plan = await prisma.plan.findUnique({
    where: { id: planId },
    include: { carrier: true }
  });

  if (!plan) return notFound();

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center py-12 px-4 font-sans">
      <div className="bg-white border-[8px] border-black p-4 md:p-6 w-full max-w-[400px] shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-black text-black mb-1 tracking-tight">Broadband Facts</h1>
        
        <div className="border-b-[8px] border-black pb-2 mb-2">
          <p className="text-xl font-bold text-black">{plan.carrier.name}</p>
          <p className="text-lg font-bold text-black leading-tight">{plan.name}</p>
          <p className="text-base text-black mt-1 font-medium">Fixed Broadband Consumer Disclosure</p>
        </div>

        <div className="border-b-[4px] border-black pb-2 mb-2 flex justify-between items-end">
          <p className="text-lg font-bold text-black">Monthly Price</p>
          <p className="text-3xl font-black text-black">${plan.price.toFixed(2)}</p>
        </div>

        <div className="border-b-[8px] border-black pb-4 mb-4 text-sm text-black font-medium space-y-2">
          <p>This Monthly Price {plan.postPromoPrice && plan.postPromoPrice > plan.price ? "is" : "is not"} an introductory rate.</p>
          {plan.postPromoPrice && plan.postPromoPrice > plan.price && (
            <p className="ml-4">This introductory rate is subject to change. After the promotional period, the standard rate of <strong className="font-black">${plan.postPromoPrice.toFixed(2)}/mo</strong> will apply.</p>
          )}
          <p>This Monthly Price does not require a contract.</p>
        </div>

        <div className="border-b-[8px] border-black pb-4 mb-4">
          <h2 className="text-lg font-bold text-black mb-2">Additional Charges & Terms</h2>
          <div className="space-y-1 text-sm text-black font-medium">
            <div className="flex justify-between">
              <span>Provider Monthly Fees</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span className="ml-4">Equipment Rental (Router)</span>
              <span>Varies</span>
            </div>
            <div className="flex justify-between">
              <span>One-time Fees at the Time of Purchase</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span className="ml-4">Installation Fee</span>
              <span>Varies</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Early Termination Fee</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Government Taxes</span>
              <span>Varies</span>
            </div>
          </div>
        </div>

        <div className="border-b-[8px] border-black pb-4 mb-4">
          <h2 className="text-lg font-bold text-black mb-2">Discounts & Bundles</h2>
          <p className="text-sm text-black font-medium">
            Click "Sign Up Online" on the provider page to view available discounts for bundling this plan with mobile or TV service, or for enrolling in AutoPay and Paperless Billing.
          </p>
        </div>

        <div className="border-b-[8px] border-black pb-4 mb-4">
          <h2 className="text-lg font-bold text-black mb-2">Speeds Provided with Plan</h2>
          <p className="text-sm text-black font-medium italic mb-2">Typical speeds may vary based on location and network congestion.</p>
          <div className="space-y-1 text-sm text-black font-medium">
            <div className="flex justify-between">
              <span>Typical Download Speed</span>
              <span className="font-black">{plan.downloadSpeed || '--'} Mbps</span>
            </div>
            <div className="flex justify-between">
              <span>Typical Upload Speed</span>
              <span className="font-black">{plan.uploadSpeed || '--'} Mbps</span>
            </div>
            <div className="flex justify-between">
              <span>Typical Latency</span>
              <span className="font-black">{plan.peakLatency || '20'} ms</span>
            </div>
          </div>
        </div>

        <div className="border-b-[8px] border-black pb-4 mb-4">
          <div className="flex justify-between items-center text-lg font-bold text-black">
            <span>Data Included with Monthly Price</span>
            <span>{plan.dataCap || 'Unlimited'}</span>
          </div>
          <p className="text-sm text-black font-medium mt-1">Charges for additional data usage: $0.00</p>
        </div>

        <div className="text-xs text-black font-medium space-y-2">
          <p>
            <strong>Network Management:</strong> <br/>
            <a href="#" className="underline text-blue-600 hover:text-blue-800">Review provider policies</a>
          </p>
          <p>
            <strong>Privacy Policy:</strong> <br/>
            <a href="#" className="underline text-blue-600 hover:text-blue-800">Review provider policies</a>
          </p>
          <p className="mt-4 text-center">
            <strong>FCC ID:</strong> {plan.id.toUpperCase().substring(0, 16)}
          </p>
          <p className="mt-2 text-center text-slate-500">
            Learn more about the terms used on this label by visiting the Federal Communications Commission's Consumer Resource Center.
          </p>
          <p className="text-center font-bold mt-1">fcc.gov/consumer</p>
        </div>
      </div>
      
      {/* Legal Disclaimer to protect the site owner */}
      <div className="mt-8 max-w-[400px] w-full bg-slate-100 border border-slate-200 p-4 rounded-xl text-xs text-slate-500 leading-relaxed shadow-sm">
        <p className="font-black text-slate-700 mb-1 uppercase tracking-wider">Disclaimer & Liability Notice</p>
        <p className="mb-2">
          This broadband label is generated for general informational and comparative purposes only. Speeds, promotional pricing, standard rates, hardware fees, and data caps are subject to change at any time and may vary based on your specific physical address.
        </p>
        <p>
          We make no warranties regarding the complete accuracy of these figures. Please visit the provider's official website or contact their sales department to view the legally binding, exact FCC Broadband Facts label for your specific location prior to making a purchasing decision.
        </p>
      </div>
    </div>
  );
}
