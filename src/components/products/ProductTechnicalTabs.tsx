'use client';

import * as React from 'react';
import {
  Sparkles,
  Layers,
  ShieldCheck,
  Server,
  Cpu,
  Key,
  Zap,
  Eye,
  Lock,
  CreditCard,
  Headphones,
  Check,
  Terminal,
  Database,
} from 'lucide-react';
import type { ProductDto } from '@/api/types/product.types';

export interface ProductTechnicalTabsProps {
  product: ProductDto;
  matchedDemo?: any;
  onOpenLiveDemo?: () => void;
}

export function ProductTechnicalTabs({
  product,
  matchedDemo,
  onOpenLiveDemo,
}: ProductTechnicalTabsProps) {
  const [activeTab, setActiveTab] = React.useState<
    'overview' | 'modules' | 'security' | 'deployment' | 'requirements'
  >('overview');

  return (
    <div className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-sm">
      {/* Tab Navigation Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-slate-200 mb-8 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#0d0d0e] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('modules')}
          className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
            activeTab === 'modules'
              ? 'bg-[#0d0d0e] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span>Core Modules</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-[#0d0d0e] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Security &amp; Licensing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('deployment')}
          className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
            activeTab === 'deployment'
              ? 'bg-[#0d0d0e] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Server className="w-3.5 h-3.5 text-sky-400" />
          <span>Deployment</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('requirements')}
          className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
            activeTab === 'requirements'
              ? 'bg-[#0d0d0e] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-amber-400" />
          <span>System Requirements</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="max-w-3xl">
            <h3 className="text-xl font-black text-[#0d0d0e] mb-2">{product.name} — Architecture Overview</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-[#0d0d0e] mb-1">Single-Tenant Isolation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated database schemas and isolated service runtime guaranteeing complete enterprise data sovereignty.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Key className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-[#0d0d0e] mb-1">Zero Royalty Lock-In</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Commercial perpetual licenses grant permanent ownership of code and assets on your infrastructure without forced recurring fees.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-[#0d0d0e] mb-1">High-Throughput Core</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Optimized database indexing and caching layers deliver sub-second response times under concurrent multi-user load.
              </p>
            </div>
          </div>

          {matchedDemo && (
            <div className="p-5 rounded-2xl bg-[#fafafa] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Eye className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-black text-[#0d0d0e]">Interactive Live Demo Ready</div>
                  <div className="text-[11px] text-slate-500">Test-drive the administrator, staff, and customer portals with verified demo accounts.</div>
                </div>
              </div>
              {onOpenLiveDemo && (
                <button
                  type="button"
                  onClick={onOpenLiveDemo}
                  className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shrink-0 text-center cursor-pointer shadow-xs"
                >
                  Launch Interactive Demo
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Core Modules */}
      {activeTab === 'modules' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="max-w-2xl">
            <h3 className="text-xl font-black text-[#0d0d0e] mb-2">Turnkey Modules &amp; Subsystems</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every module is tested for interoperability, automated billing integration, and audit trail compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white border border-slate-200 text-sky-600 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#0d0d0e] mb-1">Multi-Role RBAC &amp; Auth</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Preconfigured roles for Admin, Staff, Student/Patient/Client, and Finance Auditor with granular endpoint permissions.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white border border-slate-200 text-emerald-600 shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#0d0d0e] mb-1">Automated Invoicing &amp; GST</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Built-in UPI QR generation, bank reference UTR verification, and PDF tax invoice generation with company branding.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white border border-slate-200 text-purple-600 shrink-0">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#0d0d0e] mb-1">Cryptographic License Gate</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Machine ID hardware fingerprinting preventing unauthorized distribution while allowing one-click device seat reassignments.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white border border-slate-200 text-amber-600 shrink-0">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#0d0d0e] mb-1">Support Desk &amp; SLA Tracking</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Direct communication channel connecting customers with engineering staff, tracked by strict response SLAs.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Security & Licensing */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="max-w-2xl">
            <h3 className="text-xl font-black text-[#0d0d0e] mb-2">Cryptographic Licensing &amp; Security Controls</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rigorous node-locking algorithms and commercial protections designed for enterprise compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-[#fafafa] border border-slate-200">
              <div className="font-mono font-bold text-sky-600 uppercase tracking-wider mb-2">Hardware-Bound Protection</div>
              <h4 className="text-sm font-black text-[#0d0d0e] mb-2">Machine ID Fingerprinting</h4>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Authoritative `OHO-XXXX-XXXX-XXXX` license verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Hardware ID hashing prevents unauthorized clone deployment</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Customer portal self-service device activation &amp; deactivation</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[#fafafa] border border-slate-200">
              <div className="font-mono font-bold text-emerald-600 uppercase tracking-wider mb-2">Data Protection</div>
              <h4 className="text-sm font-black text-[#0d0d0e] mb-2">Enterprise Encryption Standards</h4>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>TLS 1.3 encrypted transport for all API and WebSocket endpoints</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>AES-256 encryption at rest for database credentials &amp; tokens</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Granular Spring Security filters with BCrypt password hashing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Deployment */}
      {activeTab === 'deployment' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="max-w-2xl">
            <h3 className="text-xl font-black text-[#0d0d0e] mb-2">Production Deployment Architecture</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Turnkey deployment templates compatible with leading cloud and on-premise infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="font-bold text-slate-900 mb-1">Docker Compose</div>
              <p className="text-[11px] text-slate-500 font-sans mb-3">Multi-container setup with automated networking and volume management.</p>
              <div className="p-2 rounded-lg bg-slate-900 text-emerald-400 text-[10px]">
                docker compose up -d
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <Database className="w-4 h-4" />
              </div>
              <div className="font-bold text-slate-900 mb-1">Database Migrations</div>
              <p className="text-[11px] text-slate-500 font-sans mb-3">Automated Flyway version-controlled database schema generation.</p>
              <div className="p-2 rounded-lg bg-slate-900 text-purple-300 text-[10px]">
                PostgreSQL 16 Relational
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Server className="w-4 h-4" />
              </div>
              <div className="font-bold text-slate-900 mb-1">Nginx Reverse Proxy</div>
              <p className="text-[11px] text-slate-500 font-sans mb-3">Automatic SSL certificate issuance with Let's Encrypt integration.</p>
              <div className="p-2 rounded-lg bg-slate-900 text-sky-300 text-[10px]">
                SSL/TLS Port 443
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: System Requirements */}
      {activeTab === 'requirements' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="max-w-2xl">
            <h3 className="text-xl font-black text-[#0d0d0e] mb-2">System &amp; Hardware Requirements</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Minimum and recommended specifications for reliable production operation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-[#fafafa] border border-slate-200">
              <div className="font-mono font-bold text-sky-600 uppercase tracking-wider mb-2">Server Environment</div>
              <h4 className="text-sm font-black text-[#0d0d0e] mb-3">Host Specifications</h4>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="font-medium text-slate-500">Operating System</span>
                  <span className="font-bold text-slate-900 font-mono">Ubuntu 22.04 LTS / Debian 12</span>
                </li>
                <li className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="font-medium text-slate-500">CPU Compute</span>
                  <span className="font-bold text-slate-900 font-mono">2 vCPU (Min) / 4 vCPU (Rec)</span>
                </li>
                <li className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="font-medium text-slate-500">Memory (RAM)</span>
                  <span className="font-bold text-slate-900 font-mono">4 GB (Min) / 8 GB (Rec)</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-medium text-slate-500">Storage</span>
                  <span className="font-bold text-slate-900 font-mono">20 GB NVMe SSD Storage</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[#fafafa] border border-slate-200">
              <div className="font-mono font-bold text-emerald-600 uppercase tracking-wider mb-2">Client Compatibility</div>
              <h4 className="text-sm font-black text-[#0d0d0e] mb-3">User Devices &amp; Browsers</h4>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="font-medium text-slate-500">Web Browsers</span>
                  <span className="font-bold text-slate-900 font-mono">Chrome 120+, Safari 17+, Edge, Firefox</span>
                </li>
                <li className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="font-medium text-slate-500">Desktop Platforms</span>
                  <span className="font-bold text-slate-900 font-mono">Windows 10/11, macOS, Linux</span>
                </li>
                <li className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="font-medium text-slate-500">Mobile Compatibility</span>
                  <span className="font-bold text-slate-900 font-mono">Android 10+, iOS 16+ Responsive</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-medium text-slate-500">Network Protocols</span>
                  <span className="font-bold text-slate-900 font-mono">HTTPS (Port 443) &amp; WSS</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
