'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const industriesList = [
  'Healthcare & EMR', 'Education & Campus', 'Retail & POS', 'Financial & NBFC',
  'Logistics & Supply Chain', 'Fitness & Gym', 'Real Estate', 'Manufacturing',
  'Hotel & Hospitality', 'Enterprise Software', 'Other'
];

export default function BookDemoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    productInterest: '',
    preferredDate: '',
    preferredTime: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '', email: '', phone: '', company: '', industry: '', productInterest: '', preferredDate: '', preferredTime: ''
      });
    }, 1000);
  };

  const inputClass = 'w-full px-4 py-3 rounded-2xl bg-[#fafafa] border-2 border-slate-200 text-xs font-medium text-[#0d0d0e] placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-colors';
  const labelClass = 'block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2';

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white">
      <main className="max-w-[1536px] w-full mx-auto" id="book-demo-main">
        
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm" id="demo-section">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Form Column */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-mono text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                INTERACTIVE DEMO SESSION
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-black text-[#0d0d0e] tracking-tight mb-4 leading-[1.08]">
                Book a Live Product Demo.
              </h1>
              
              <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed">
                Schedule a live walkthrough of our software platforms with a technical specialist, or test drive our 28 live product environments right away.
              </p>

              {/* 28 Live Demos Fast Banner */}
              <div className="mb-8 p-6 rounded-3xl bg-[#0d0d0e] text-white border border-black shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                    INSTANT ACCESS (NO WAITING)
                  </span>
                  <h4 className="text-base font-extrabold text-white tracking-tight">
                    Want to test our 28 Live Software Products now?
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct admin &amp; user login credentials available instantly.
                  </p>
                </div>
                <Link
                  href="/products"
                  className="w-full sm:w-auto px-5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#0d0d0e] font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shrink-0 text-center inline-flex items-center justify-center gap-2"
                >
                  <span>Explore 28 Live Demos</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
              </div>

              {submitStatus === 'success' && (
                <div className="mb-8 p-4 rounded-2xl bg-emerald-50 text-emerald-800 border-2 border-emerald-200 text-xs font-mono font-bold">
                  Demo request received! Our technical team will confirm your meeting schedule shortly.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="demo-name" className={labelClass}>Full Name</label>
                    <input type="text" name="name" id="demo-name" value={formData.name} onChange={handleChange} className={inputClass} required />
                  </div>
                  <div>
                    <label htmlFor="demo-email" className={labelClass}>Work Email</label>
                    <input type="email" name="email" id="demo-email" value={formData.email} onChange={handleChange} className={inputClass} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="demo-phone" className={labelClass}>Phone Number</label>
                    <input type="tel" name="phone" id="demo-phone" value={formData.phone} onChange={handleChange} className={inputClass} required />
                  </div>
                  <div>
                    <label htmlFor="demo-company" className={labelClass}>Company Name</label>
                    <input type="text" name="company" id="demo-company" value={formData.company} onChange={handleChange} className={inputClass} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="demo-industry" className={labelClass}>Industry Sector</label>
                    <select name="industry" id="demo-industry" value={formData.industry} onChange={handleChange} className={inputClass} required>
                      <option value="" disabled>Select sector</option>
                      {industriesList.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="demo-product" className={labelClass}>Product Interest</label>
                    <input type="text" name="productInterest" id="demo-product" value={formData.productInterest} onChange={handleChange} className={inputClass} placeholder="e.g. Hospital EMR, POS, ERP" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="demo-date" className={labelClass}>Preferred Date</label>
                    <input type="date" name="preferredDate" id="demo-date" value={formData.preferredDate} onChange={handleChange} className={inputClass} required />
                  </div>
                  <div>
                    <label htmlFor="demo-time" className={labelClass}>Preferred Time Slot</label>
                    <input type="time" name="preferredTime" id="demo-time" value={formData.preferredTime} onChange={handleChange} className={inputClass} required />
                  </div>
                </div>

                <button
                  type="submit"
                  id="demo-submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg disabled:opacity-70"
                >
                  {isSubmitting ? 'Booking Demo...' : 'Confirm Demo Session →'}
                </button>
              </form>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 bg-[#fafafa] border-2 border-slate-200 rounded-3xl p-8 sm:p-10 space-y-8">
              <div>
                <h3 className="text-xl font-extrabold text-[#0d0d0e] mb-2">What to Expect</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our live demo sessions are 1-on-1 technical walkthroughs customized to your sector.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-3 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>Interactive walkthrough of core system workflows and modules</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>Q&amp;A on database migration, API integration, and security compliance</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>Demonstration of live admin controls and multi-branch dashboards</span>
                </div>
              </div>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}
