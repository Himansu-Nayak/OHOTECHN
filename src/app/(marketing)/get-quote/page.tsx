'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Key } from 'lucide-react';
import { submitContactApi } from '@/api/contact';
import { useToast } from '@/context/ToastContext';

function QuoteFormContent() {
  const searchParams = useSearchParams();
  const productParam = searchParams.get('product') || '';

  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: productParam ? `Product Purchase: ${productParam}` : '',
    budgetRange: '',
    projectDescription: productParam ? `I have evaluated the test-drive demo for ${productParam} and would like to request a commercial quote for full purchase, source code deployment, and SLA setup.` : '',
    timeline: '',
  });

  useEffect(() => {
    if (productParam) {
      setFormData((prev) => ({
        ...prev,
        serviceType: `Product Purchase: ${productParam}`,
        projectDescription: prev.projectDescription || `I have evaluated the test-drive demo for ${productParam} and would like to request a commercial quote for full purchase, source code deployment, and SLA setup.`,
      }));
    }
  }, [productParam]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.name.trim() || !formData.email.trim() || !formData.projectDescription.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const res = await submitContactApi({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        serviceType: formData.serviceType,
        timeline: formData.timeline,
        subject: `Quote Request: ${formData.serviceType || 'General'} (Budget: ${formData.budgetRange || 'Unspecified'})`,
        message: formData.projectDescription,
        formType: 'Software Quote Request',
      });

      if (!res.success) {
        throw new Error(res.message || 'Failed to submit quote request.');
      }

      setSubmitStatus('success');
      showToast('Quote request submitted successfully to kampainfraa@gmail.com!', 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        serviceType: '',
        budgetRange: '',
        projectDescription: '',
        timeline: '',
      });
    } catch (error: any) {
      console.error(error);
      setSubmitStatus('error');
      showToast(error.message || 'Failed to submit quote request.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 rounded-2xl bg-[#fafafa] border-2 border-slate-200 text-xs font-medium text-[#0d0d0e] placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-colors';
  const labelClass = 'block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      
      {/* Form Column */}
      <div className="lg:col-span-7">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-mono text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          ESTIMATE YOUR PROJECT ⚡
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-[#0d0d0e] tracking-tight mb-4 leading-[1.08]">
          {productParam ? `Request Commercial Quote: ${productParam}` : 'Get a Custom Software Quote.'}
        </h1>
        
        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-8">
          Fill out the details below to receive a detailed cost breakdown, timeline estimation, and deployment scope for your software project.
        </p>

        {productParam && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Step 3 of Buyer Journey:</span> Requesting Commercial Quote for <strong className="underline">{productParam}</strong>. Our team will email full source code license &amp; deployment details to kampainfraa@gmail.com.
            </div>
          </div>
        )}

        {submitStatus === 'success' ? (
          <div className="p-8 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-2xl font-bold text-emerald-900">Quote Request Submitted!</h3>
            <p className="text-sm text-emerald-700 max-w-md mx-auto">
              Thank you for reaching out. We have received your project details and sent a confirmation to your email. Our enterprise team will respond within 2 to 4 business hours.
            </p>
            <div className="pt-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0d0d0e] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-emerald-600 transition-colors"
              >
                <span>Browse All Live Demos</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>
                  Your Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Work Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rahul@company.com"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Company / Organization</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Service / Product Type</label>
                <input
                  type="text"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  placeholder="e.g. Custom Software, Hospital EMR, School ERP"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Estimated Budget Range</label>
                <select
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Budget Range</option>
                  <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                  <option value="₹50,000 - ₹1,000,00">₹50,000 - ₹1,00,000</option>
                  <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
                  <option value="₹2,50,000+">₹2,50,000+ Enterprise</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Project Details / Requirements <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                rows={5}
                placeholder="Describe your software requirements, desired features, integration needs, or target users..."
                required
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg flex items-center justify-center gap-2 group hover:scale-[1.01] disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Submitting Quote Request...' : 'Submit Commercial Quote Request'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}
      </div>

      {/* Info Sidebar Column */}
      <div className="lg:col-span-5 bg-[#0d0d0e] text-white border-2 border-slate-800 rounded-[28px] sm:rounded-[36px] p-8 sm:p-10 shadow-2xl relative overflow-hidden grid-pattern-dark space-y-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold uppercase mb-4">
            <Key className="w-3.5 h-3.5" />
            <span>3-STEP BUYING PROCESS</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white mb-4">
            How Software Purchase Works
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-[#141416] border border-white/10 space-y-1">
              <span className="text-emerald-400 font-extrabold block">1. Test-Drive Demo First</span>
              <p className="text-slate-300">Copy 1-click admin credentials and test the full live environment online.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141416] border border-white/10 space-y-1">
              <span className="text-emerald-400 font-extrabold block">2. Request Custom Quote</span>
              <p className="text-slate-300">Submit your requirements to receive exact pricing &amp; SLA timeline.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141416] border border-white/10 space-y-1">
              <span className="text-emerald-400 font-extrabold block">3. Complete Payment &amp; Deploy</span>
              <p className="text-slate-300">Receive complete source code, database setup, branding, and server deployment.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 mt-6 text-xs text-slate-400 font-mono">
            Direct Email Delivery: <span className="text-emerald-400 font-bold">kampainfraa@gmail.com</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function GetQuotePage() {
  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white">
      <main className="max-w-[1536px] w-full mx-auto" id="get-quote-main">
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm" id="quote-section">
          <Suspense fallback={<div className="text-center py-12 font-mono text-xs text-slate-500">Loading quote form...</div>}>
            <QuoteFormContent />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
