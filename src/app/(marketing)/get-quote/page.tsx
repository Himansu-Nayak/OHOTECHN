'use client';

import { useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function GetQuotePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    budgetRange: '',
    projectDescription: '',
    timeline: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        name: '', email: '', phone: '', company: '', serviceType: '', budgetRange: '', projectDescription: '', timeline: ''
      });
    }, 1000);
  };

  const inputClass = 'w-full px-4 py-3.5 rounded-2xl bg-[#fafafa] border-2 border-slate-200 text-sm font-medium text-[#0d0d0e] placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors min-h-[48px]';
  const labelClass = 'block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2';

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-24 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white">
      <main className="max-w-[1536px] w-full mx-auto" id="get-quote-main">
        
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-6 sm:p-14 lg:p-20 shadow-sm" id="quote-section">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* Form Column */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                ESTIMATE YOUR PROJECT
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-black text-[#0d0d0e] tracking-tight mb-4 leading-[1.08]">
                Get a Custom Software Quote.
              </h1>
              
              <p className="text-sm sm:text-base text-slate-600 mb-8 leading-relaxed">
                Tell us about your project requirements, and we&apos;ll provide a detailed proposal and cost estimate.
              </p>

              {submitStatus === 'success' && (
                <div className="mb-8 p-4 rounded-2xl bg-emerald-50 text-emerald-800 border-2 border-emerald-200 text-xs font-mono font-bold">
                  Your request has been received! Our team will get back to you within 24 hours.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="quote-name" className={labelClass}>Full Name *</label>
                    <input type="text" name="name" id="quote-name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="Jagabandhu Kampa" required />
                  </div>
                  <div>
                    <label htmlFor="quote-email" className={labelClass}>Email Address *</label>
                    <input type="email" name="email" id="quote-email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="name@company.com" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="quote-phone" className={labelClass}>Phone Number *</label>
                    <input type="tel" name="phone" id="quote-phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+91 98765 43210" required />
                  </div>
                  <div>
                    <label htmlFor="quote-company" className={labelClass}>Company Name *</label>
                    <input type="text" name="company" id="quote-company" value={formData.company} onChange={handleChange} className={inputClass} placeholder="Company Ltd" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="quote-service" className={labelClass}>Service Type *</label>
                    <select name="serviceType" id="quote-service" value={formData.serviceType} onChange={handleChange} className={inputClass} required>
                      <option value="" disabled>Select service</option>
                      <option value="custom-software">Custom Software &amp; ERP</option>
                      <option value="web-development">Web Platform Development</option>
                      <option value="mobile-apps">iOS &amp; Android Mobile Apps</option>
                      <option value="growth-marketing">Digital Growth &amp; SEO</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="quote-timeline" className={labelClass}>Estimated Timeline *</label>
                    <select name="timeline" id="quote-timeline" value={formData.timeline} onChange={handleChange} className={inputClass} required>
                      <option value="" disabled>Select timeline</option>
                      <option value="immediate">Immediate (&lt; 1 month)</option>
                      <option value="1-3-months">1 - 3 Months</option>
                      <option value="3-6-months">3 - 6 Months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="quote-desc" className={labelClass}>Project Requirements &amp; Scope *</label>
                  <textarea name="projectDescription" id="quote-desc" rows={4} value={formData.projectDescription} onChange={handleChange} className={inputClass} placeholder="Describe the core features, workflow requirements, or tech stack..." required />
                </div>

                <button
                  type="submit"
                  id="quote-submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[52px] py-4 rounded-full bg-[#0d0d0e] hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg disabled:opacity-70 cursor-pointer"
                >
                  {isSubmitting ? 'Submitting Request...' : 'Submit Quote Request →'}
                </button>
              </form>
            </div>

            {/* Process Info Column */}
            <div className="lg:col-span-5 bg-[#fafafa] border-2 border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8">
              <div>
                <h3 className="text-xl font-extrabold text-[#0d0d0e] mb-2">Our Proposal Process</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  How we evaluate your project and deliver an actionable technical quote.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">1</div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0d0d0e]">Submit Details</h4>
                    <p className="text-xs text-slate-600">Fill out the form with your project scope and objectives.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">2</div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0d0d0e]">Technical Audit</h4>
                    <p className="text-xs text-slate-600">Our engineering team reviews your requirements and tech stack needs.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">3</div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0d0d0e]">Proposal &amp; Quote</h4>
                    <p className="text-xs text-slate-600">Receive a detailed milestone roadmap and fixed cost estimate.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 space-y-2 text-xs font-mono text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>24-Hour Response Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>NDA Protected Information</span>
                </div>
              </div>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}
