'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Smartphone, 
  Apple, 
  Zap, 
  WifiOff, 
  ShieldCheck, 
  Bluetooth, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  Cpu,
  Fingerprint,
  LucideIcon
} from 'lucide-react';
import { TextReveal } from '@/components/ui/TextReveal';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface MobileCapability {
  title: string;
  badge: string;
  desc: string;
  icon: LucideIcon;
  specs: string[];
}

const MOBILE_CAPABILITIES: MobileCapability[] = [
  {
    title: 'Native iOS Architecture',
    badge: 'SWIFT & SWIFTUI',
    desc: 'High-performance applications tailored for the Apple ecosystem with CoreData, Metal GPU shaders, and native StoreKit.',
    icon: Apple,
    specs: ['120 FPS ProMotion Support', 'Dynamic Island & Live Activities', 'Biometric Keychain Enclave', 'WatchOS & iPadOS Adaptive'],
  },
  {
    title: 'Native Android Ecosystem',
    badge: 'KOTLIN & JETPACK COMPOSE',
    desc: 'Enterprise Android applications engineered with declarative UI, Room SQLite database, and foreground background workers.',
    icon: Smartphone,
    specs: ['Jetpack Compose Reactive UI', 'Coroutines & Flow Pipelines', 'Hardware Barcode & NFC Drivers', 'Multi-OEM Device Matrix'],
  },
  {
    title: 'Offline-First Data Engine',
    badge: 'ZERO-LATENCY SYNC',
    desc: 'Continuous operational capability in zero-connectivity field environments with automated conflict resolution upon reconnect.',
    icon: WifiOff,
    specs: ['Local SQLite Vault Storage', 'Background Queue Dispatch', 'Vector Clock Reconciliation', 'Sub-50ms Local Queries'],
  },
  {
    title: 'Peripherals & Hardware I/O',
    badge: 'IOT & INDUSTRIAL',
    desc: 'Direct hardware communication protocols for POS barcode scanners, thermal receipt printers, RFID tags, and BLE sensors.',
    icon: Bluetooth,
    specs: ['Bluetooth Low Energy (BLE)', 'ESC/POS Thermal Printing', 'Camera OCR Scanning Engine', 'GPS Real-Time Telemetry'],
  },
];

export function MobileAppShowcase() {
  return (
    <section 
      id="mobile-apps" 
      aria-label="OHO TECH Enterprise Mobile Application Engineering"
      className="w-full bg-[#07080b] text-white py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-white/5"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 sm:mb-20 pb-8 border-b border-white/10">
          <div>
            <ScrollReveal yOffset={15} duration={0.6}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
                <Smartphone className="w-3.5 h-3.5" />
                <span>MOBILE APPLICATION ENGINEERING</span>
              </div>
            </ScrollReveal>

            <TextReveal as="h2" splitType="words" className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase">
              Mission-Critical Mobile Apps
            </TextReveal>
          </div>
          
          <div className="max-w-md text-left md:text-right">
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-4">
              Fluid, 120 FPS native iOS &amp; Android systems engineered for field operations, sales teams, and customer engagement.
            </p>
            <div className="flex items-center md:justify-end gap-2 font-mono text-xs text-purple-400 font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>NATIVE SPEED • OFFLINE-READY • BIOMETRIC GATE</span>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {MOBILE_CAPABILITIES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#111216] border border-white/10 hover:border-purple-500/50 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 group hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-purple-500/20 group-hover:border-purple-500/40 text-purple-400 flex items-center justify-center transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 uppercase tracking-wider">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-6 font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Key Capabilities</div>
                  {item.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Spotlight Banner: Field Sales & Enterprise Mobility */}
        <div className="bg-gradient-to-r from-[#121319] via-[#141520] to-[#121319] border border-purple-500/30 rounded-[32px] p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>TURNKEY MOBILE SOLUTIONS</span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Enterprise Mobile Suites: Field Sales, Inventory &amp; Executive Telemetry
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                We engineer production-ready companion apps for your workforce. Field salesmen create invoices offline, drivers track real-time dispatches, and executives monitor real-time company revenue through live mobile dashboards.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-purple-400" />
                  <span>Biometric Enclave Auth</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Encrypted Offline SQLite</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-sky-400" />
                  <span>Play Store &amp; App Store Deployment</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link
                href="/services/mobile-app-development"
                className="w-full py-4 px-6 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>EXPLORE MOBILE SERVICES</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="w-full py-4 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span>START MOBILE PROJECT</span>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default MobileAppShowcase;
