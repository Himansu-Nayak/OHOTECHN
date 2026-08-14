'use client';

import { useState } from 'react';

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
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '', email: '', phone: '', company: '', serviceType: '', budgetRange: '', projectDescription: '', timeline: ''
      });
    }, 1000);
  };

  const inputClass = 'w-full px-4 py-3 rounded-lg border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors';
  const labelClass = 'block text-sm font-medium text-neutral-700 mb-1.5';

  return (
    <div className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Side - Form */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl mb-4">
              Get a Custom Quote
            </h1>
            <p className="text-lg leading-8 text-neutral-600 mb-10">
              Tell us about your project requirements, and we'll provide a detailed proposal and cost estimate.
            </p>

            {submitStatus === 'success' && (
              <div className="mb-8 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
                Your request has been received! Our team will get back to you within 24 hours.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>Name</label>
                  <input type="text" name="name" id="quote-name" value={formData.name} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Email</label>
                  <input type="email" name="email" id="quote-email" value={formData.email} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>Phone</label>
                  <input type="tel" name="phone" id="quote-phone" value={formData.phone} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label htmlFor="company" className={labelClass}>Company</label>
                  <input type="text" name="company" id="quote-company" value={formData.company} onChange={handleChange} className={inputClass} required />
                </div>
              </div>

              <div>
                <label htmlFor="serviceType" className={labelClass}>Service Type</label>
                <select name="serviceType" id="quote-service-type" value={formData.serviceType} onChange={handleChange} className={inputClass} required>
                  <option value="" disabled>Select a service</option>
                  <option value="software">Software Product</option>
                  <option value="custom_dev">Custom Development</option>
                  <option value="digital_marketing">Digital Marketing</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="budgetRange" className={labelClass}>Budget Range</label>
                  <select name="budgetRange" id="quote-budget" value={formData.budgetRange} onChange={handleChange} className={inputClass} required>
                    <option value="" disabled>Select budget</option>
                    <option value="under_50k">Under ₹50,000</option>
                    <option value="50k_200k">₹50,000 - ₹2,00,000</option>
                    <option value="200k_500k">₹2,00,000 - ₹5,00,000</option>
                    <option value="500k_plus">₹5,00,000+</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="timeline" className={labelClass}>Expected Timeline</label>
                  <select name="timeline" id="quote-timeline" value={formData.timeline} onChange={handleChange} className={inputClass} required>
                    <option value="" disabled>Select timeline</option>
                    <option value="urgent">ASAP (Urgent)</option>
                    <option value="1_month">Within 1 Month</option>
                    <option value="1_3_months">1 - 3 Months</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="projectDescription" className={labelClass}>Project Description</label>
                <textarea
                  name="projectDescription"
                  id="quote-description"
                  rows={4}
                  value={formData.projectDescription}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Tell us about your goals, features you need, and any specific requirements..."
                  required
                />
              </div>

              <button
                type="submit"
                id="quote-submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Request Quote'}
              </button>
            </form>
          </div>

          {/* Right Side - How it works */}
          <div className="bg-neutral-50 rounded-3xl p-10 lg:p-12 lg:sticky lg:top-24">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-8">
              How it works
            </h2>
            
            <div className="relative border-l border-neutral-200 ml-3 space-y-10">
              <div className="relative pl-8">
                <div className="absolute -left-3.5 top-1 h-7 w-7 rounded-full border-[3px] border-white bg-primary text-white flex items-center justify-center text-xs font-bold">1</div>
                <h3 className="font-semibold text-neutral-900 text-lg">Submit details</h3>
                <p className="mt-1 text-neutral-600 text-sm">Fill out the form with your project requirements and goals.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-3.5 top-1 h-7 w-7 rounded-full border-[3px] border-white bg-primary text-white flex items-center justify-center text-xs font-bold">2</div>
                <h3 className="font-semibold text-neutral-900 text-lg">Consultation</h3>
                <p className="mt-1 text-neutral-600 text-sm">We'll schedule a call to clarify details and understand your vision perfectly.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-3.5 top-1 h-7 w-7 rounded-full border-[3px] border-white bg-primary text-white flex items-center justify-center text-xs font-bold">3</div>
                <h3 className="font-semibold text-neutral-900 text-lg">Proposal</h3>
                <p className="mt-1 text-neutral-600 text-sm">You receive a detailed proposal with timeline, deliverables, and cost.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-3.5 top-1 h-7 w-7 rounded-full border-[3px] border-white bg-primary text-white flex items-center justify-center text-xs font-bold">4</div>
                <h3 className="font-semibold text-neutral-900 text-lg">Start Project</h3>
                <p className="mt-1 text-neutral-600 text-sm">Once approved, our team kicks off the project immediately.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
