'use client';

import React, { useState } from 'react';
import { Plus, Minus, HelpCircle, ShieldCheck } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface FAQItem {
  id: string;
  number: string;
  category: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    number: '01',
    category: 'CODE OWNERSHIP & IP',
    question: 'Do we own the full source code and intellectual property upon delivery?',
    answer: 'Yes, 100%. Upon final project sign-off and settlement, all bespoke source code, proprietary algorithms, database schemas, architecture blueprints, and documentation transfer completely and exclusively to your organization with zero recurring vendor lock-in royalties.',
  },
  {
    id: 'faq-2',
    number: '02',
    category: 'UPTIME SLA & GUARANTEES',
    question: 'What performance SLAs and uptime commitments does OHO TECH guarantee?',
    answer: 'We deliver contractual 99.99% to 99.999% uptime SLAs across our cloud and web infrastructure deployments, supported by continuous multi-region failover, automated blue-green deployments, 24/7 telemetry monitoring, and sub-15 minute P1 emergency response times.',
  },
  {
    id: 'faq-3',
    number: '03',
    category: 'COMPLIANCE & SECURITY',
    question: 'How do you address enterprise security and compliance standards?',
    answer: 'Our software engineering lifecycle strictly follows SOC-2 Type II, ISO 27001, and HIPAA compliance standards. Every build undergoes automated static & dynamic security analysis (SAST/DAST), strict role-based access control (RBAC), end-to-end AES-256 encryption, and zero-trust authentication.',
  },
  {
    id: 'faq-4',
    number: '04',
    category: 'MIGRATION & INTEGRATION',
    question: 'Can OHO TECH migrate existing legacy systems without downtime?',
    answer: 'Yes. We specialize in zero-downtime database and application migrations using the Strangler Fig architectural pattern, dual-write replication bridges, and canary rollouts to guarantee uninterrupted business operations throughout the cutover.',
  },
  {
    id: 'faq-5',
    number: '05',
    category: 'PRICING & ENGAGEMENT',
    question: 'What engagement models and payment structures are available?',
    answer: 'We provide transparent fixed-price turnkey milestone contracts for defined software deliverables, dedicated engineering squads (time & materials), and long-term enterprise SLA retainers. Clear deliverables and progress metrics are provided at every sprint.',
  },
];

export function EnterpriseFAQSection() {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="relative w-full bg-[#0d0d0e] text-white py-20 md:py-32 px-4 sm:px-6 lg:px-8 border-y border-white/10 overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            ENTERPRISE GOVERNANCE &amp; FAQ
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase mb-4">
            Technical &amp; Commercial <span className="text-neutral-400">Clarity</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base font-mono">
            Direct answers regarding code ownership, uptime SLAs, compliance, and our engineering standards.
          </p>
        </div>

        {/* Accordion Stack */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openId === faq.id;
            return (
              <ScrollReveal key={faq.id} yOffset={15} duration={0.5} delay={idx * 0.05}>
                <div
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-[#151923] border-emerald-500/50 shadow-xl'
                      : 'bg-[#10121a] border-white/10 hover:border-white/20'
                  }`}
                >
                  <button
                    onClick={() => toggle(faq.id)}
                    className="w-full text-left px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between gap-4 select-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                      <span className="font-mono text-xs font-bold text-emerald-400 shrink-0">
                        [{faq.number}]
                      </span>
                      <div className="min-w-0">
                        <span className="block font-mono text-[10px] text-neutral-500 tracking-wider uppercase mb-1">
                          {faq.category}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    <div
                      className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center transition-all ${
                        isOpen
                          ? 'bg-emerald-500 text-black rotate-180'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2 text-neutral-300 text-xs sm:text-sm leading-relaxed border-t border-white/5 font-sans animate-in fade-in slide-in-from-top-2 duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
