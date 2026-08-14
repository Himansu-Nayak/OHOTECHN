'use client';

import { useState } from 'react';

const industries = [
  'Retail', 'Healthcare', 'Education', 'Real Estate', 'Food & Beverage',
  'Automotive', 'Fitness & Gym', 'Logistics', 'E-commerce', 'Hospitality',
  'Manufacturing', 'Finance', 'Other'
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
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '', email: '', phone: '', company: '', industry: '', productInterest: '', preferredDate: '', preferredTime: ''
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
              Book a Free Demo
            </h1>
            <p className="text-lg leading-8 text-neutral-600 mb-10">
              See our software in action. Schedule a personalized walkthrough with our experts.
            </p>

            {submitStatus === 'success' && (
              <div className="mb-8 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
                Demo request received! We will contact you shortly to confirm the schedule.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>Name</label>
                  <input type="text" name="name" id="demo-name" value={formData.name} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Email</label>
                  <input type="email" name="email" id="demo-email" value={formData.email} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>Phone</label>
                  <input type="tel" name="phone" id="demo-phone" value={formData.phone} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label htmlFor="company" className={labelClass}>Company</label>
                  <input type="text" name="company" id="demo-company" value={formData.company} onChange={handleChange} className={inputClass} required />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="industry" className={labelClass}>Industry</label>
                  <select name="industry" id="demo-industry" value={formData.industry} onChange={handleChange} className={inputClass} required>
                    <option value="" disabled>Select industry</option>
                    {industries.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="productInterest" className={labelClass}>Product Interest</label>
                  <input type="text" name="productInterest" id="demo-product" value={formData.productInterest} onChange={handleChange} className={inputClass} placeholder="e.g. Retail POS, ERP" required />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="preferredDate" className={labelClass}>Preferred Date</label>
                  <input type="date" name="preferredDate" id="demo-date" value={formData.preferredDate} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label htmlFor="preferredTime" className={labelClass}>Preferred Time</label>
                  <input type="time" name="preferredTime" id="demo-time" value={formData.preferredTime} onChange={handleChange} className={inputClass} required />
                </div>
              </div>

              <button
                type="submit"
                id="demo-submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Book Demo'}
              </button>
            </form>
          </div>

          {/* Right Side - Benefits */}
          <div className="bg-primary/5 rounded-3xl p-10 lg:p-12 lg:sticky lg:top-24">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-8">
              Why get a demo?
            </h2>
            
            <ul className="space-y-8">
              <li className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 text-lg">Personalized walkthrough</h3>
                  <p className="mt-2 text-neutral-600">See exactly how our software solves the specific challenges in your industry and business.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 text-lg">Expert consultation</h3>
                  <p className="mt-2 text-neutral-600">Talk to our product specialists to understand best practices and implementation strategies.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 text-lg">No commitment</h3>
                  <p className="mt-2 text-neutral-600">The demo is completely free. Evaluate our solution with no pressure to purchase.</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
