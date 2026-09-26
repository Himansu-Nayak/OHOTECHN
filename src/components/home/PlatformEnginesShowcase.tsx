'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Package, 
  Cpu, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';

const ENGINES = [
  {
    id: 'engine-1',
    number: '01',
    badge: 'TURNKEY DEPLOYMENT',
    title: 'COMMERCIAL SOFTWARE PRODUCTS',
    tagline: '28+ production systems ready for instant activation.',
    description: 'Pre-architected, compliance-ready enterprise applications across Healthcare EMR, Campus ERP, Multi-Store POS, and Digital Commerce. Zero build delays.',
    highlights: [
      'Instant private VPC or On-Premise installation',
      'Perpetual or subscription licensing',
      'Continuous feature updates & security patches',
      'Source-code access available on enterprise tier'
    ],
    ctaText: 'EXPLORE PRODUCT CATALOG',
    ctaHref: '/products',
    accent: 'emerald',
    gradient: 'from-emerald-500/20 to-teal-500/5'
  },
  {
    id: 'engine-2',
    number: '02',
    badge: 'BESPOKE ARCHITECTURE',
    title: 'CUSTOM ENTERPRISE SYSTEMS',
    tagline: 'Tailored microservices engineered to eliminate company friction.',
    description: 'When off-the-shelf software fails your workflow, our studio architects high-throughput Java 21/Spring Boot microservices and Next.js 16 platforms with 100% IP ownership.',
    highlights: [
      '100% intellectual property & code transfer',
      'High-concurrency PostgreSQL & Redis scaling',
      'HIPAA, ISO 27001, and SOC2 compliant architectures',
      'Direct founder & senior architect execution'
    ],
    ctaText: 'COMMISSION ARCHITECTURE',
    ctaHref: '/services',
    accent: 'cyan',
    gradient: 'from-cyan-500/20 to-blue-500/5'
  },
  {
    id: 'engine-3',
    number: '03',
    badge: 'FIELD MOBILITY',
    title: 'MISSION-CRITICAL MOBILE APPS',
    tagline: 'Native iOS & Android apps built for real-world reliability.',
    description: 'High-performance mobile solutions with local SQLite write-ahead caching, background GPS sync, and encrypted offline storage for clinical, retail, and field operations.',
    highlights: [
      '100% offline operational guarantee with auto-sync',
      'Native device hardware integration (BLE, Camera, NFC)',
      'Sub-100ms UI interaction responsiveness',
      'Automated App Store & Google Play deployment'
    ],
    ctaText: 'VIEW MOBILE ENGINEERING',
    ctaHref: '/services/mobile-app-development',
    accent: 'violet',
    gradient: 'from-violet-500/20 to-indigo-500/5'
  }
];

export function PlatformEnginesShowcase() {
  return (
    <section className="relative py-28 sm:py-36 bg-[#08090b] border-t border-white/10 overflow-hidden">
      
      {/* Background radial atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-emerald-500/5 rounded-full blur-[170px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* The Central Visual Showcase (Inspired by play 1 screen recording 00:30 - 00:35) */}
        <div className="text-center mb-20 sm:mb-28">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono text-[11px] font-bold uppercase tracking-widest mb-8"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>UNIFIED TECHNICAL CAPABILITY</span>
          </motion.div>

          {/* Big Split Kinetic Typography with Floating Kinetic Centerpiece */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 select-none my-4">
            
            {/* Left Big Text */}
            <motion.h2 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-[-0.04em] text-white leading-none"
            >
              ONE <br className="hidden md:inline" /> PLATFORM
            </motion.h2>

            {/* Central Floating Kinetic 3D-Style Orb / Balloon Cluster */}
            <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 shrink-0 flex items-center justify-center my-4 md:my-0">
              
              {/* Outer Pulsing Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/25 via-teal-400/20 to-cyan-500/25 rounded-full blur-2xl animate-[pulseGlow_4s_ease-in-out_infinite]" />
              
              {/* Central Floating Sphere Mesh */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-emerald-400/30 via-teal-400/20 to-cyan-400/10 border border-white/20 backdrop-blur-xl shadow-2xl flex items-center justify-center animate-[floatSlow_6s_ease-in-out_infinite]">
                
                {/* Inner Concentric Kinetic Ring */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-emerald-400/40 border-dashed animate-spin" style={{ animationDuration: '16s' }} />
                
                {/* Center Core Pulse */}
                <div className="absolute w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 blur-sm animate-ping" style={{ animationDuration: '3s' }} />
                <div className="absolute w-6 h-6 rounded-full bg-white shadow-lg shadow-emerald-400/50" />
              </div>

            </div>

            {/* Right Big Text */}
            <motion.h2 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 leading-none"
            >
              THREE <br className="hidden md:inline" /> ENGINES
            </motion.h2>

          </div>

          <p className="mt-8 text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Every business problem requires the right delivery modality. OHO TECH combines ready-to-deploy software, bespoke enterprise engineering, and native mobility under one unified technology foundation.
          </p>

        </div>

        {/* 3 Capability Engine Cards with Staggered Entrance and Hover Lifts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {ENGINES.map((eng, idx) => (
            <motion.div
              key={eng.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.015 }}
              className="relative p-7 sm:p-8 rounded-3xl bg-[#0f1116] border border-white/10 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between group overflow-hidden"
            >
              {/* Card Accent Top Ambient */}
              <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${eng.gradient} rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <span className="font-mono text-xs font-bold text-slate-500">
                    {eng.number} // ENGINE
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    {eng.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {eng.title}
                </h3>

                <p className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400/90 mb-4">
                  {eng.tagline}
                </p>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  {eng.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-2.5 mb-8 pt-4 border-t border-white/5">
                  {eng.highlights.map((hl, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-white/10">
                <Link
                  href={eng.ctaHref}
                  className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-black border border-white/10 hover:border-emerald-400 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 group/btn shadow-md"
                >
                  <span>{eng.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
