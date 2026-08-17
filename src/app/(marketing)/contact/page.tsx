'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle2 } from 'lucide-react';
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
    }, 800);
  };

  const inputClass = 'w-full px-4 py-3 rounded-md bg-white border border-slate-300/80 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors';
  const labelClass = 'block text-xs font-semibold text-slate-700 mb-1.5';

  return (
    <div className="bg-[#f8f9fb] text-[#0f172a] min-h-screen pb-20 pt-28 sm:pt-36 px-4 sm:px-6 lg:px-8 selection:bg-slate-900 selection:text-white">
      <main className="max-w-7xl mx-auto" id="contact-main">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 block mb-2">
            Contact OHO TECHN
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-950 tracking-tight mb-4">
            Start a Conversation.
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Have a project, engineering challenge, or operational requirement? Let’s explore how OHO TECHN can help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Form */}
          <div className="lg:col-span-7 corporate-card p-6 sm:p-10">
            {submitStatus === 'success' ? (
              <div className="p-8 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-teal-700 mx-auto" />
                <h2 className="text-2xl font-bold text-slate-950">Thank You</h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Your inquiry has been received. Our technical team will review your message and reach out shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Work Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@company.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
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
                      placeholder="Acme Corp"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Area of Interest</label>
                  <select
                    name="serviceInterest"
                    value={formData.serviceInterest}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select a domain</option>
                    <option value="technology">Technology Solutions & Software</option>
                    <option value="infrastructure">Infrastructure & ERP</option>
                    <option value="energy">Renewable Energy Solutions</option>
                    <option value="digital">Digital Transformation</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Project / Requirement Summary *</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Briefly describe your objectives or questions..."
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-md bg-[#090a0f] hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-xs"
                >
                  {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>

          {/* Direct Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="corporate-card p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold text-slate-950">
                Direct Contact
              </h2>
              
              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900">General Inquiries</div>
                    <div>{siteConfig.contact.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900">Phone & Support</div>
                    <div>{siteConfig.contact.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900">Registered Office</div>
                    <div>{siteConfig.contact.address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900">Business Hours</div>
                    <div>{siteConfig.contact.hours}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 text-white space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                Executive Leadership
              </div>
              <div className="text-sm font-semibold text-white">
                Jagabandhu Kampa — Founder & Director
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct engagement on strategic enterprise initiatives and large-scale infrastructure deployments.
              </p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
