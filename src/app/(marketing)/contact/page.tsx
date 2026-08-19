'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceInterest: '',
    message: '',
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
    setSubmitStatus('idle');

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.serviceInterest || 'Contact Enquiry',
          message: formData.message + (formData.company ? ` (Company: ${formData.company})` : ''),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to send message.');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        serviceInterest: '',
        message: '',
      });
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 rounded-2xl bg-[#fafafa] border-2 border-slate-200 text-xs font-medium text-[#0d0d0e] placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-colors';
  const labelClass = 'block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2';

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white">
      <main className="max-w-[1536px] w-full mx-auto" id="contact-main">
        
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm" id="contact-section">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Form Column */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-mono text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                GET IN TOUCH WITH OHO TECH
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-black text-[#0d0d0e] tracking-tight mb-4 leading-[1.08]">
                Let&apos;s discuss your software project.
              </h1>
              
              <p className="text-sm sm:text-base text-slate-600 mb-8 leading-relaxed">
                Have a question or want to discuss a custom software engineering requirement? Send us a message and our lead architect will respond within 24 hours.
              </p>

              {submitStatus === 'success' && (
                <div className="mb-8 p-4 rounded-2xl bg-emerald-50 text-emerald-800 border-2 border-emerald-200 text-xs font-mono font-bold">
                  Thank you for your message! Our engineering team will contact you shortly.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-8 p-4 rounded-2xl bg-red-50 text-red-800 border-2 border-red-200 text-xs font-mono font-bold">
                  Something went wrong. Please try again or contact us directly.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>Full Name</label>
                    <input type="text" name="name" id="contact-name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="e.g. Rahul Sharma" required />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>Email Address</label>
                    <input type="email" name="email" id="contact-email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="rahul@company.com" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-phone" className={labelClass}>Phone Number</label>
                    <input type="tel" name="phone" id="contact-phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+91 98765 43210" required />
                  </div>
                  <div>
                    <label htmlFor="contact-company" className={labelClass}>Company Name</label>
                    <input type="text" name="company" id="contact-company" value={formData.company} onChange={handleChange} className={inputClass} placeholder="Acme Enterprises" required />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-service" className={labelClass}>Area of Interest</label>
                  <select name="serviceInterest" id="contact-service" value={formData.serviceInterest} onChange={handleChange} className={inputClass} required>
                    <option value="" disabled>Select area of interest</option>
                    <option value="custom-software">Custom Software &amp; Enterprise ERP</option>
                    <option value="web-development">Web Platform &amp; Customer Portal</option>
                    <option value="mobile-apps">iOS / Android Mobile Application</option>
                    <option value="hospital-emr">Healthcare EMR &amp; Hospital System</option>
                    <option value="education-erp">Education &amp; Campus ERP</option>
                    <option value="retail-pos">Retail POS &amp; Inventory Sync</option>
                    <option value="digital-growth">Digital Growth &amp; Performance SEO</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className={labelClass}>Project Message</label>
                  <textarea name="message" id="contact-message" rows={4} value={formData.message} onChange={handleChange} className={inputClass} placeholder="Briefly describe your project requirements..." required />
                </div>

                <button
                  type="submit"
                  id="contact-submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg disabled:opacity-70"
                >
                  {isSubmitting ? 'Sending Message...' : 'Send Message to Engineering Team →'}
                </button>
              </form>
            </div>

            {/* Information Column */}
            <div className="lg:col-span-5 bg-[#fafafa] border-2 border-slate-200 rounded-3xl p-8 sm:p-10 space-y-8">
              <div>
                <h3 className="text-xl font-extrabold text-[#0d0d0e] mb-4">Direct Contact Details</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reach out directly to OHO TECH for enterprise partnerships or consultation.
                </p>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="text-slate-800">{siteConfig.contact.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="text-slate-800">{siteConfig.contact.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="text-slate-800">{siteConfig.contact.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="text-slate-800">{siteConfig.contact.hours}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <h4 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2">FOUNDER LEADERSHIP</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Japabandhu Kampa — Director, OHO TECH
                </p>
              </div>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}
