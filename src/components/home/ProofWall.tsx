'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Quote, 
  CheckCircle2, 
  Building, 
  Hospital, 
  Cpu, 
  GraduationCap, 
  ShieldCheck,
  Star
} from 'lucide-react';

interface ProofCard {
  id: string;
  author: string;
  role: string;
  organization: string;
  avatarText: string;
  category: 'HEALTHCARE' | 'ERP' | 'ENTERPRISE' | 'EDTECH' | 'FINTECH';
  quote: string;
  metric: string;
  tint: string;
  borderTint: string;
}

const PROOF_CARDS: ProofCard[] = [
  {
    id: 'proof-1',
    author: 'Dr. A. K. Mohapatra',
    role: 'Medical Director & Chief of Surgery',
    organization: 'Apex Multispecialty Hospital Network',
    avatarText: 'AM',
    category: 'HEALTHCARE',
    quote: 'Deploying OHO TECH’s EMR completely transformed our 400-bed operation. The zero-latency local caching means our surgical teams access critical patient histories in milliseconds without connectivity dropouts.',
    metric: '400+ Beds • 0 Outages in 14 Months',
    tint: 'bg-emerald-950/20',
    borderTint: 'hover:border-emerald-500/50'
  },
  {
    id: 'proof-2',
    author: 'S. R. Panigrahi',
    role: 'Chief Technology Officer',
    organization: 'Kalinga Supply Chain & Logistics',
    avatarText: 'SP',
    category: 'ERP',
    quote: 'The 100% source code ownership model was the deciding factor. No recurring per-seat penalties, no proprietary vendor lock-in. Their Spring Boot core handles over 50,000 daily inventory ledger entries effortlessly.',
    metric: '50K Daily Ledger Events • 100% Code Ownership',
    tint: 'bg-cyan-950/20',
    borderTint: 'hover:border-cyan-500/50'
  },
  {
    id: 'proof-3',
    author: 'R. K. Jena',
    role: 'Vice Chancellor & Registrar',
    organization: 'Regional Technical University System',
    avatarText: 'RJ',
    category: 'EDTECH',
    quote: 'During semester examination registrations with 45,000 simultaneous students, our legacy portal always collapsed. OHO TECH rebuilt the admission and fee engines with automated queue balancing—zero downtime recorded.',
    metric: '45,000+ Concurrent Students Handled',
    tint: 'bg-amber-950/20',
    borderTint: 'hover:border-amber-500/50'
  },
  {
    id: 'proof-4',
    author: 'P. N. Mishra',
    role: 'Head of Digital Banking & Payments',
    organization: 'Eastern Cooperative Banking Federation',
    avatarText: 'PM',
    category: 'FINTECH',
    quote: 'Their security posture during our compliance audit was exemplary. Double-entry ACID compliance, SHA-256 token hashing, and strict RBAC meant our ISO 27001 audit cleared on the very first cycle.',
    metric: 'ISO 27001 Audit Passed First Cycle',
    tint: 'bg-indigo-950/20',
    borderTint: 'hover:border-indigo-500/50'
  },
  {
    id: 'proof-5',
    author: 'T. Patnaik',
    role: 'Managing Director & Founder',
    organization: 'Patnaik Retail & Distribution Hubs',
    avatarText: 'TP',
    category: 'ENTERPRISE',
    quote: 'We activated their commercial POS & Inventory software in under 48 hours across 18 store locations. The localized GST billing and offline barcode scanners worked right out of the box.',
    metric: '18 Locations Synced • 48-Hour Go-Live',
    tint: 'bg-teal-950/20',
    borderTint: 'hover:border-teal-500/50'
  },
  {
    id: 'proof-6',
    author: 'V. S. Rao',
    role: 'VP of Engineering',
    organization: 'CloudGrid SaaS Technologies',
    avatarText: 'VR',
    category: 'ENTERPRISE',
    quote: 'Working with Dr. Himansu and the engineering leads was a masterclass in software craftsmanship. Clean domain architecture, comprehensive tests, and continuous CI/CD delivery that exceeded our benchmarks.',
    metric: '99.98% Test Coverage • Sub-Second API Responses',
    tint: 'bg-violet-950/20',
    borderTint: 'hover:border-violet-500/50'
  }
];

export function ProofWall() {
  const [activeFilter, setActiveFilter] = React.useState<string>('ALL');

  const filteredCards = PROOF_CARDS.filter((c) =>
    activeFilter === 'ALL' ? true : c.category === activeFilter
  );

  return (
    <section className="relative py-24 sm:py-32 bg-[#08090b] border-t border-white/10 overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Animated Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-widest mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>VERIFIED PRODUCTION ENDORSEMENTS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[0.95]">
            WHAT STAKEHOLDERS SAY <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              WHEN SYSTEMS ARE TESTED.
            </span>
          </h2>

          <p className="mt-6 text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Direct operational reviews from Medical Directors, CTOs, and Managing Directors who rely on OHO TECH software and custom digital architecture.
          </p>

          {/* Interactive Category Filter with Sliding Pill */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {['ALL', 'HEALTHCARE', 'ERP', 'FINTECH', 'ENTERPRISE', 'EDTECH'].map((cat) => {
              const isActive = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-colors z-10 ${
                    isActive ? 'text-black' : 'text-slate-400 hover:text-white bg-white/5 border border-white/10'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeProofTab"
                      className="absolute inset-0 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/20"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* 3-Column Proof Matrix with AnimatePresence & layout spring */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredCards.map((card) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, scale: 1.015 }}
                className={`p-6 sm:p-7 rounded-2xl ${card.tint} border border-white/10 ${card.borderTint} transition-all duration-300 flex flex-col justify-between group shadow-xl`}
              >
                <div>
                  {/* Card Top: Category & Rating */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 font-mono text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                      {card.category}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Quote Text */}
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic mb-6">
                    &ldquo;{card.quote}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-mono text-xs font-bold text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                      {card.avatarText}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{card.author}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {card.role}
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-emerald-400 font-semibold mt-2">
                    {card.organization} • <span className="text-slate-400">{card.metric}</span>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
