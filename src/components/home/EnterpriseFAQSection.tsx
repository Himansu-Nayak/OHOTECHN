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
    answer: 'Yes, 100%. Upon final project sign-off and settlement, all bespoke source code, proprietary algorithms, database schemas, architecture blueprints, and documentation transfer completely and exclusively to your organization with zero recurring vendor royalties.',
  },
  {
    id: 'faq-2',
    number: '02',
    category: 'UPTIME & RELIABILITY',
    question: 'What reliability commitments does OHO TECH engineer into systems?',
    answer: 'We architect cloud and web platforms with high-availability multi-region clustering, automated failover protocols, continuous database point-in-time backups, and telemetry monitoring for resilient 24/7 uptime.',
  },
  {
    id: 'faq-3',
    number: '03',
    category: 'SECURITY & DATA ISOLATION',
    question: 'How do you ensure enterprise security and sensitive data protection?',
    answer: 'Our software engineering lifecycle implements strict role-based access control (RBAC), multi-tenant schema isolation, end-to-end TLS 1.3 encryption in transit, encrypted storage at rest, and automated static security analysis.',
  },
  {
    id: 'faq-4',
    number: '04',
    category: 'MIGRATION & INTEGRATION',
    question: 'Can OHO TECH migrate existing legacy business systems without disruption?',
    answer: 'Yes. We specialize in structured database and application migrations using incremental strangler patterns, dual-write data synchronization bridges, and canary testing to guarantee uninterrupted operational continuity.',
  },
  {
    id: 'faq-5',
    number: '05',
    category: 'PRICING & ENGAGEMENT',
    question: 'What engagement models and payment structures are available?',
    answer: 'We provide transparent milestone-based contracts for custom turnkey projects, dedicated engineering squads, and flexible software licensing across our ready-to-deploy platforms (SchoolCloud, HealthOS, FinCore, RetailPOS).',
  },
];

export function EnterpriseFAQSection() {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section 
      id="faq" 
      className="w-full bg-[#0d0d0e] text-white py-20 sm:py-28 px-6 sm:px-10 lg:px-16 relative grid-pattern-dark"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <ScrollReveal yOffset={15} duration={0.6}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-4">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
          </ScrollReveal>

          <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase mb-4 leading-tight">
              Technical &amp; Commercial <span className="text-slate-400">Clarity</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-base font-normal max-w-xl mx-auto leading-relaxed">
              Direct answers regarding code ownership, architectural reliability, security standards, and project engagement.
            </p>
          </ScrollReveal>
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
                    className="w-full text-left px-5 sm:px-8 py-5 sm:py-6 flex items-center justify-between gap-4 select-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3.5 sm:gap-6 min-w-0">
                      <span className="font-mono text-xs font-bold text-emerald-400 shrink-0">
                        [{faq.number}]
                      </span>
                      <div className="min-w-0">
                        <span className="block font-mono text-[10px] text-slate-400 tracking-wider uppercase mb-1">
                          {faq.category}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full shrink-0 flex items-center justify-center transition-all ${
                        isOpen
                          ? 'bg-emerald-500 text-black rotate-180'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-2 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-white/5 font-sans">
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

export default EnterpriseFAQSection;
