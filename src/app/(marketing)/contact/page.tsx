'use client';

import { useState } from 'react';

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
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        serviceInterest: '',
        message: '',
      });
    }, 1000);
  };

  const inputClass = 'w-full px-4 py-3 rounded-lg border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors';
  const labelClass = 'block text-sm font-medium text-neutral-700 mb-1.5';

  return (
    <div className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Side - Form */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl mb-4">
              Get in touch
            </h1>
            <p className="text-lg leading-8 text-neutral-600 mb-10">
              Have a question or want to discuss a project? We'd love to hear from you.
            </p>

            {submitStatus === 'success' && (
              <div className="mb-8 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
                Thank you for your message! We will get back to you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>Name</label>
                  <input
                    type="text"
                    name="name"
                    id="contact-name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Email</label>
                  <input
                    type="email"
                    name="email"
                    id="contact-email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    id="contact-phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="company" className={labelClass}>Company</label>
                  <input
                    type="text"
                    name="company"
                    id="contact-company"
                    value={formData.company}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="serviceInterest" className={labelClass}>Service Interest</label>
                <select
                  name="serviceInterest"
                  id="contact-service-interest"
                  value={formData.serviceInterest}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="" disabled>Select a service</option>
                  <option value="software">Software Product</option>
                  <option value="custom">Custom Development</option>
                  <option value="marketing">Digital Marketing</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>Message</label>
                <textarea
                  name="message"
                  id="contact-message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <button
                type="submit"
                id="contact-submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 transition-colors"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Right Side - Info */}
          <div className="bg-neutral-50 rounded-3xl p-10 lg:p-12">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-8">
              Contact Information
            </h2>
            
            <div className="space-y-8 text-neutral-600 text-base leading-7">
              <div>
                <h3 className="font-semibold text-neutral-900">Address</h3>
                <p className="mt-2">
                  123 Tech Park Avenue<br />
                  Innovation District<br />
                  Bangalore, Karnataka 560001
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-neutral-900">Contact</h3>
                <p className="mt-2">
                  <a href="mailto:contact@ohotechn.com" className="hover:text-primary">contact@ohotechn.com</a><br />
                  <a href="tel:+919876543210" className="hover:text-primary">+91 98765 43210</a>
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-900">Business Hours</h3>
                <p className="mt-2">
                  Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                  Saturday - Sunday: Closed
                </p>
              </div>

              {/* Map Placeholder */}
              <div className="mt-10 aspect-video w-full rounded-lg bg-neutral-200 flex items-center justify-center border border-neutral-300">
                <span className="text-neutral-500 font-medium">Map View</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
