'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Building2, 
  Cpu, 
  ArrowRight,
  User,
  ExternalLink,
  Lock,
  RefreshCw,
  Layers
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { submitContactApi } from '@/api/contact';
import { useToast } from '@/context/ToastContext';

const PROJECT_TYPES = [
  { id: 'custom-software', label: 'Custom Enterprise Software / SaaS' },
  { id: 'healthcare-emr', label: 'Hospital EMR & Clinical Cloud' },
  { id: 'education-erp', label: 'University & Campus ERP' },
  { id: 'retail-pos', label: 'Retail POS & Offline-First Sync' },
  { id: 'ai-automation', label: 'AI OCR & Document Pipeline' },
  { id: 'cloud-infrastructure', label: 'Cloud Scaling & Microservices' },
  { id: 'digital-growth', label: 'Digital Growth & Performance SEO' },
];

const BUDGET_TIERS = [
  { id: 'tier-1', label: '₹3L – ₹8L ($4K – $10K)' },
  { id: 'tier-2', label: '₹8L – ₹20L ($10K – $25K)' },
  { id: 'tier-3', label: '₹20L – ₹50L ($25K – $60K)' },
  { id: 'tier-4', label: '₹50L+ ($60K+)' },
  { id: 'to-be-scoped', label: 'To Be Scoped' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: 'custom-software',
    budget: '₹8L – ₹20L ($10K – $25K)',
    timeline: '1 - 3 months',
    message: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [submissionRef, setSubmissionRef] = useState('');
  const { showToast } = useToast();

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim() || value.trim().length < 2) return 'Full name is required (min 2 characters).';
        break;
      case 'email':
        if (!value.trim()) return 'Work email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address.';
        break;
      case 'phone':
        if (value.trim() && (value.trim().length < 7 || !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/.test(value.trim()))) {
          return 'Please enter a valid phone number.';
        }
        break;
      case 'message':
        if (!value.trim() || value.trim().length < 10) return 'Please describe your project requirements (min 10 characters).';
        break;
    }
    return '';
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on edit
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const err = validateField(name, value);
    if (err) {
      setFieldErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate all fields
    const errors: Record<string, string> = {};
    const nameErr = validateField('name', formData.name);
    if (nameErr) errors.name = nameErr;

    const emailErr = validateField('email', formData.email);
    if (emailErr) errors.email = emailErr;

    const messageErr = validateField('message', formData.message);
    if (messageErr) errors.message = messageErr;

    if (formData.phone) {
      const phoneErr = validateField('phone', formData.phone);
      if (phoneErr) errors.phone = phoneErr;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage('Please correct the highlighted fields before submitting.');
      showToast('Please correct the highlighted fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      const selectedTypeObj = PROJECT_TYPES.find(p => p.id === formData.projectType);
      const projectTypeLabel = selectedTypeObj ? selectedTypeObj.label : formData.projectType;

      const res = await submitContactApi({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        subject: `[DISCOVERY] ${projectTypeLabel}`,
        serviceType: projectTypeLabel,
        budget: formData.budget,
        timeline: formData.timeline,
        message: formData.message.trim(),
        formType: 'Discovery & Consultation Request',
        source: 'CONTACT_FORM',
      });

      if (!res.success) {
        throw new Error(res.message || 'Failed to dispatch enquiry transmission.');
      }

      const generatedRef = `OHO-${Date.now().toString(36).toUpperCase()}`;
      setSubmissionRef(generatedRef);
      setSubmitStatus('success');
      showToast('Your transmission has been dispatched to engineering leadership.', 'success');
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmitStatus('error');
      setErrorMessage(err.message || 'Transmission failed. Please check network connection.');
      showToast(err.message || 'Failed to submit form', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      projectType: 'custom-software',
      budget: '₹8L – ₹20L ($10K – $25K)',
      timeline: '1 - 3 months',
      message: '',
    });
    setFieldErrors({});
    setSubmitStatus('idle');
    setErrorMessage('');
    setSubmissionRef('');
  };

  const inputClasses = (field: string) => `
    w-full px-4 py-3.5 rounded-2xl bg-[#0e0f13] border text-sm text-white placeholder-slate-500 font-sans 
    focus:outline-none transition-all duration-200
    ${fieldErrors[field] 
      ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30' 
      : 'border-white/10 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30 hover:border-white/20'}
  `;

  const labelClasses = "block font-mono text-xs font-bold text-slate-300 uppercase tracking-wider mb-2";

  return (
    <main className="min-h-screen bg-[#07080c] text-white pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-10 left-1/4 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-emerald-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-cyan-500/10 rounded-full blur-[170px] pointer-events-none" />

      {/* Grid Mesh */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 font-mono text-xs text-slate-400 flex items-center gap-2">
          <Link href="/" className="hover:text-emerald-400 transition-colors">HOME</Link>
          <span>/</span>
          <span className="text-emerald-400 font-bold">CONTACT &amp; DISCOVERY</span>
        </nav>

        {/* Page Hero Header */}
        <header className="mb-14 sm:mb-20 pb-10 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DISCOVERY PROTOCOL // DIRECT ARCHITECT ACCESS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.04] uppercase mb-6">
            <span>Let&apos;s Architect Your</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Software System.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl">
            Directly connect with Founder &amp; Director Japabandhu Kampa and lead system architects. We review operational bottlenecks, data schemas, and latency budgets with guaranteed 24-hour turnaround.
          </p>
        </header>

        {/* Main Grid: Form (Col 7) + Direct Details & Leadership (Col 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* ── LEFT: INTERACTIVE TRANSMISSION FORM ── */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-[#111216]/95 border border-white/15 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              
              {/* Form Status Badge */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8 font-mono text-xs">
                <span className="text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>SECURE 256-BIT ENCRYPTED CHANNEL</span>
                </span>
                <span className="text-slate-400">SLA: &lt; 24H RESPONSE</span>
              </div>

              {/* SUCCESS STATE */}
              {submitStatus === 'success' ? (
                <div className="py-8 space-y-6 text-center animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest">
                      TRANSMISSION COMMITTED // {submissionRef}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
                      Thank You, {formData.name || 'Partner'}.
                    </h2>
                    <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                      Your technical project discovery request has been routed directly to Founder &amp; Director Japabandhu Kampa and our engineering architects.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#090a0d] border border-white/10 font-mono text-xs text-left max-w-md mx-auto space-y-2">
                    <div className="text-slate-400">Confirmation Dispatch: <span className="text-white">{formData.email}</span></div>
                    <div className="text-slate-400">Target Domain: <span className="text-emerald-400">{formData.projectType}</span></div>
                    <div className="text-slate-400">Estimated Response: <span className="text-cyan-400">Within 24 Hours</span></div>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg cursor-pointer button-tactile glow-focus"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Send Another Request</span>
                    </button>
                    <Link
                      href="/work"
                      className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all border border-white/10 button-tactile glow-focus"
                    >
                      Explore Case Studies
                    </Link>
                  </div>
                </div>
              ) : (
                /* FORM INPUTS */
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  
                  {/* ERROR ALERT BANNER */}
                  {submitStatus === 'error' && errorMessage && (
                    <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs font-mono flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div className="font-bold uppercase tracking-wider">Transmission Error</div>
                        <div>{errorMessage}</div>
                      </div>
                    </div>
                  )}

                  {/* 1. Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-name" className={labelClasses}>
                        Full Name <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="contact-name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="e.g. Rahul Sharma"
                        required
                        disabled={isSubmitting}
                        className={inputClasses('name')}
                      />
                      {fieldErrors.name && (
                        <p className="mt-1.5 text-[11px] font-mono text-red-400">{fieldErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="contact-email" className={labelClasses}>
                        Work Email <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="contact-email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="rahul@enterprise.com"
                        required
                        disabled={isSubmitting}
                        className={inputClasses('email')}
                      />
                      {fieldErrors.email && (
                        <p className="mt-1.5 text-[11px] font-mono text-red-400">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* 2. Phone & Company Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-phone" className={labelClasses}>
                        Phone Number <span className="text-slate-500">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="contact-phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="+91 98765 43210"
                        disabled={isSubmitting}
                        className={inputClasses('phone')}
                      />
                      {fieldErrors.phone && (
                        <p className="mt-1.5 text-[11px] font-mono text-red-400">{fieldErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="contact-company" className={labelClasses}>
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        name="company"
                        id="contact-company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Acme Health / Retail / Edu"
                        disabled={isSubmitting}
                        className={inputClasses('company')}
                      />
                    </div>
                  </div>

                  {/* 3. Project Type / Service Domain */}
                  <div>
                    <label htmlFor="contact-project-type" className={labelClasses}>
                      Project Domain &amp; Architecture Target
                    </label>
                    <select
                      name="projectType"
                      id="contact-project-type"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={`${inputClasses('projectType')} cursor-pointer bg-[#0e0f13] text-white`}
                    >
                      {PROJECT_TYPES.map((pt) => (
                        <option key={pt.id} value={pt.id} className="bg-[#111216] text-white">
                          {pt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 4. Budget & Timeline Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-budget" className={labelClasses}>
                        Estimated Budget Tier
                      </label>
                      <select
                        name="budget"
                        id="contact-budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className={`${inputClasses('budget')} cursor-pointer bg-[#0e0f13] text-white`}
                      >
                        {BUDGET_TIERS.map((b) => (
                          <option key={b.id} value={b.label} className="bg-[#111216] text-white">
                            {b.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contact-timeline" className={labelClasses}>
                        Target Timeline
                      </label>
                      <select
                        name="timeline"
                        id="contact-timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className={`${inputClasses('timeline')} cursor-pointer bg-[#0e0f13] text-white`}
                      >
                        <option value="Immediate (< 1 month)" className="bg-[#111216] text-white">Immediate (&lt; 1 month)</option>
                        <option value="1 - 3 months" className="bg-[#111216] text-white">1 – 3 months</option>
                        <option value="3 - 6 months" className="bg-[#111216] text-white">3 – 6 months</option>
                        <option value="Flexible / Architectural scoping" className="bg-[#111216] text-white">Flexible / Architectural scoping</option>
                      </select>
                    </div>
                  </div>

                  {/* 5. Project Description / Technical Message */}
                  <div>
                    <label htmlFor="contact-message" className={labelClasses}>
                      Technical Scope &amp; Requirements <span className="text-emerald-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      id="contact-message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Briefly describe your concurrency requirements, existing tech stack, integration needs, or desired business outcomes..."
                      required
                      disabled={isSubmitting}
                      className={inputClasses('message')}
                    />
                    {fieldErrors.message ? (
                      <p className="mt-1.5 text-[11px] font-mono text-red-400">{fieldErrors.message}</p>
                    ) : (
                      <p className="mt-1.5 text-[11px] font-mono text-slate-500">
                        Include specific requirements (e.g. HIPAA, Offline Sync, High Concurrency).
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    id="contact-submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer group button-tactile glow-focus"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Dispatching Encrypted Transmission...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Architecture Discovery Request</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform arrow-slide" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-500 pt-2">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Zero Spam Guaranteed // Mutual NDA Executed Prior To Discovery Calls</span>
                  </div>

                </form>
              )}

            </div>
          </div>

          {/* ── RIGHT: DIRECT DETAILS, LEADERSHIP & GUARANTEES ── */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Leadership Contact Card */}
            <div className="rounded-3xl bg-[#111216]/90 border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                <User className="w-3.5 h-3.5 text-teal-400" />
                <span>LEADERSHIP ACCESS</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white tracking-tight mb-2">
                  Direct Executive Communication
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  All enterprise discovery transmissions are reviewed by Founder &amp; Director Japabandhu Kampa and our core systems engineering group.
                </p>
              </div>

              {/* Founder Avatar Strip */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/5">
                <div className="w-12 h-12 rounded-full overflow-hidden relative border border-teal-400/40 shrink-0">
                  <Image
                    src="/japabandhu_kampa.jpeg"
                    alt="Japabandhu Kampa - Founder & Director"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Japabandhu Kampa</div>
                  <div className="text-[11px] font-mono text-teal-400">Founder &amp; Director, OHO TECH</div>
                </div>
              </div>

              {/* Developer Avatar Strip */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative border border-teal-400/40 shrink-0">
                    <Image
                      src="/himansu_nayak.png"
                      alt="Himansu Nayak - Full-Stack Developer (MCA)"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Himansu Nayak</div>
                    <div className="text-[11px] font-mono text-slate-400">Full-Stack Developer (MCA)</div>
                  </div>
                </div>

                <a
                  href="https://www.linkedin.com/in/himansu-nayak-243b0482h7/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-[#0077b5]/20 text-slate-400 hover:text-[#38bdf8] transition-colors"
                  aria-label="Himansu Nayak LinkedIn Profile"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Direct Coordinates */}
            <div className="rounded-3xl bg-[#111216]/90 border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
              <h3 className="text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider">
                COMMUNICATION COORDINATES
              </h3>

              <div className="space-y-4 text-xs font-mono">
                <div className="flex items-start gap-3 text-slate-300">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500 block text-[10px]">DIRECT EMAIL</span>
                    <a href={`mailto:${siteConfig.contact.email}`} className="text-white hover:text-emerald-400 transition-colors">
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-300">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500 block text-[10px]">PHONE / WHATSAPP</span>
                    <a href={`tel:${siteConfig.contact.phone}`} className="text-white hover:text-emerald-400 transition-colors">
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-300">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500 block text-[10px]">HEADQUARTERS</span>
                    <span className="text-white">{siteConfig.contact.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-300">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500 block text-[10px]">STUDIO HOURS</span>
                    <span className="text-white">{siteConfig.contact.hours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Guarantees Box */}
            <div className="rounded-3xl bg-emerald-950/20 border border-emerald-500/30 p-6 space-y-3">
              <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>OHO TECH ENGAGEMENT GUARANTEES</span>
              </div>
              <ul className="space-y-2 text-xs font-mono text-emerald-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>100% Client Code Sovereignty &amp; Git IP Handover</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Sub-24 Hour Technical SLA Response</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Direct Architect Communication — Zero Sales Fluff</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
