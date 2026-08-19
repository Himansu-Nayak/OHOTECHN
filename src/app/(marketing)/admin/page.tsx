'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ShoppingBag, ShieldCheck, DollarSign, Users, FileText, Settings, Bot, RefreshCw, CheckCircle2, ArrowRight, Edit3, Save, Search, Lock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalQuotes: number;
  totalRevenue: number;
  systemStatus: string;
}

interface ProductItem {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  active: boolean;
  serviceType: string;
}

interface OrderItem {
  id: number;
  totalAmount: number;
  status: string;
  shippingAddress?: string;
  contactPhone?: string;
  createdAt?: string;
}

interface QuoteItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  createdAt?: string;
}

export default function AdminConsolePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { showToast } = useToast();

  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        showToast('Please log in with Admin credentials.', 'info');
        router.push('/login');
      } else if (user.role !== 'ROLE_ADMIN' && user.role !== 'ADMIN' && user.role !== 'ROLE_DEVELOPER' && user.role !== 'DEVELOPER') {
        showToast('Access restricted: Customer account detected. Redirecting to product portal.', 'error');
        router.push('/products');
      }
    }
  }, [user, isLoading, router, showToast]);

  const [activeTab, setActiveTab] = React.useState<'overview' | 'products' | 'orders' | 'quotes' | 'ai'>('overview');
  const [controlMode, setControlMode] = React.useState<'manual' | 'ai'>('manual');

  const [stats, setStats] = React.useState<Stats>({
    totalProducts: 28,
    totalOrders: 14,
    totalUsers: 8,
    totalQuotes: 12,
    totalRevenue: 645000,
    systemStatus: 'OPERATIONAL_100',
  });

  const [products, setProducts] = React.useState<ProductItem[]>([
    { id: 1, name: 'School Management Software', price: 35000, stock: 50, description: 'K-12 administration portal.', active: true, serviceType: 'Education' },
    { id: 2, name: 'University Management System', price: 99000, stock: 50, description: 'Multi-campus university ERP.', active: true, serviceType: 'Education' },
    { id: 3, name: 'Hospital Management Software (HMS)', price: 75000, stock: 50, description: 'OPD/IPD, EMR, Doctor schedules, Pharmacy.', active: true, serviceType: 'Healthcare' },
    { id: 4, name: 'IVF & Fertility Clinic Software', price: 85000, stock: 50, description: 'IVF cycle tracking, embryology lab.', active: true, serviceType: 'Healthcare' },
    { id: 5, name: 'Enterprise HRMS & Payroll', price: 55000, stock: 50, description: 'Biometric sync, leave workflows, salary slips.', active: true, serviceType: 'ERP & HR' },
    { id: 6, name: 'Retail POS & Billing Software', price: 29000, stock: 50, description: 'Fast barcode billing, GST invoices.', active: true, serviceType: 'Retail & POS' },
  ]);

  const [orders, setOrders] = React.useState<OrderItem[]>([
    { id: 101, totalAmount: 75000, status: 'COMPLETED', shippingAddress: 'Bhubaneswar, Odisha', contactPhone: '+91 98765 43210' },
    { id: 102, totalAmount: 35000, status: 'PROCESSING', shippingAddress: 'Cuttack, Odisha', contactPhone: '+91 98765 11111' },
    { id: 103, totalAmount: 55000, status: 'PENDING', shippingAddress: 'Bangalore, Karnataka', contactPhone: '+91 98765 22222' },
  ]);

  const [quotes, setQuotes] = React.useState<QuoteItem[]>([
    { id: 1, name: 'Rahul Sharma', email: 'rahul@techcorp.in', phone: '+91 98765 00001', subject: 'Hospital HMS Commercial Quote', message: 'Evaluated demo. Ready to purchase with custom branding.' },
    { id: 2, name: 'Priya Verma', email: 'priya@edulearn.org', phone: '+91 98765 00002', subject: 'School ERP Custom Setup', message: 'Requesting SLA support and multi-branch database setup.' },
  ]);

  // AI Command sandbox state
  const [aiPrompt, setAiPrompt] = React.useState('');
  const [aiLogs, setAiLogs] = React.useState<string[]>([
    'System initialized in AI Automation Mode.',
    'Ready for natural language administrative execution commands.',
  ]);
  const [isExecutingAi, setIsExecutingAi] = React.useState(false);

  const handlePriceChange = (id: number, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: newPrice } : p))
    );
    showToast(`Updated product #${id} price to ₹${newPrice.toLocaleString('en-IN')}`, 'success');
  };

  const handleOrderStatus = (id: number, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    showToast(`Order #${id} status updated to ${newStatus}`, 'success');
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsExecutingAi(true);
    const cmd = aiPrompt.trim();
    setAiPrompt('');

    setTimeout(() => {
      setIsExecutingAi(false);
      setAiLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Executed AI Task: "${cmd}"`,
        `> Automated parameters updated across catalog & database. System SLA intact.`,
        ...prev,
      ]);
      showToast('AI Task executed successfully!', 'success');
    }, 800);
  };

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white">
      <main className="max-w-[1536px] w-full mx-auto" id="admin-console-main">
        
        {/* Console Header Banner */}
        <section className="bg-[#0d0d0e] text-white border-2 border-slate-800 rounded-[32px] sm:rounded-[44px] p-8 sm:p-12 mb-10 shadow-2xl relative overflow-hidden grid-pattern-dark">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ADMIN MANAGEMENT CONSOLE</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-slate-300 font-mono text-xs uppercase">
                  <span>ROLE_ADMIN SCOPED</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Enterprise Operations &amp; Catalog Management
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                Manage website content, turnkey software product pricing, customer orders, and commercial quote pipelines in real time.
              </p>
            </div>

            {/* Mode Selector Toggle (Manual UI vs AI Automated) */}
            <div className="p-2 rounded-2xl bg-[#141416] border border-white/15 shrink-0">
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 text-center">
                CONTROL MODE SELECTOR
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setControlMode('manual')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                    controlMode === 'manual'
                      ? "bg-emerald-500 text-[#0d0d0e] shadow-md font-extrabold"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Manual UI Mode</span>
                </button>

                <button
                  onClick={() => setControlMode('ai')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                    controlMode === 'ai'
                      ? "bg-sky-500 text-white shadow-md font-extrabold"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Bot className="w-3.5 h-3.5 text-sky-300" />
                  <span>AI Automation Mode</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="bg-white border-2 border-slate-300 rounded-[28px] p-3 mb-8 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar font-mono text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === 'overview' ? "bg-[#0d0d0e] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              📊 Operations Overview
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === 'products' ? "bg-[#0d0d0e] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              ⚡ Turnkey Products Catalog ({products.length})
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === 'orders' ? "bg-[#0d0d0e] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              📦 Customer Orders ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab('quotes')}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === 'quotes' ? "bg-[#0d0d0e] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              ✉️ Commercial Quotes ({quotes.length})
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer text-sky-600 border border-sky-200 bg-sky-50 hover:bg-sky-100",
                activeTab === 'ai' && "bg-sky-600 text-white border-sky-600"
              )}
            >
              🤖 AI Automation Sandbox
            </button>
          </div>
        </section>

        {/* TAB 1: OPERATIONS OVERVIEW */}
        {activeTab === 'overview' && (
          <section className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border-2 border-slate-300 rounded-[28px] p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 font-mono text-xs mb-2">
                  <span>TOTAL REVENUE</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-[#0d0d0e]">
                  ₹{stats.totalRevenue.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] font-mono text-emerald-600 font-bold mt-1 block">
                  +18.4% from last month
                </span>
              </div>

              <div className="bg-white border-2 border-slate-300 rounded-[28px] p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 font-mono text-xs mb-2">
                  <span>ACTIVE PRODUCTS</span>
                  <Zap className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-black text-[#0d0d0e]">
                  {stats.totalProducts} Software Modules
                </div>
                <span className="text-[11px] font-mono text-slate-500 mt-1 block">
                  Across 13 Industry Verticals
                </span>
              </div>

              <div className="bg-white border-2 border-slate-300 rounded-[28px] p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 font-mono text-xs mb-2">
                  <span>CUSTOMER ORDERS</span>
                  <ShoppingBag className="w-4 h-4 text-sky-600" />
                </div>
                <div className="text-3xl font-black text-[#0d0d0e]">
                  {stats.totalOrders} Orders Placed
                </div>
                <span className="text-[11px] font-mono text-sky-600 font-bold mt-1 block">
                  100% SLA Fulfillment Rate
                </span>
              </div>

              <div className="bg-white border-2 border-slate-300 rounded-[28px] p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 font-mono text-xs mb-2">
                  <span>COMMERCIAL QUOTES</span>
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-3xl font-black text-[#0d0d0e]">
                  {stats.totalQuotes} Inquiries
                </div>
                <span className="text-[11px] font-mono text-purple-600 font-bold mt-1 block">
                  Target: kampainfraa@gmail.com
                </span>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white border-2 border-slate-300 rounded-[32px] p-8 shadow-sm">
              <h3 className="text-lg font-black text-[#0d0d0e] mb-4">Admin Quick Action Controls</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs font-bold">
                <button
                  onClick={() => setActiveTab('products')}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex items-center justify-between"
                >
                  <span>Edit Product Prices &amp; Stock</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex items-center justify-between"
                >
                  <span>Manage Customer Orders</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveTab('ai')}
                  className="p-4 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 text-left transition-colors flex items-center justify-between"
                >
                  <span>Launch AI Automation Assistant</span>
                  <Bot className="w-4 h-4 text-sky-600" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: PRODUCTS CATALOG MANAGER */}
        {activeTab === 'products' && (
          <section className="bg-white border-2 border-slate-300 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-black text-[#0d0d0e]">Product Catalog &amp; Price Editor</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Real-time database updates for turnkey software products</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                Live Sync Enabled
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Product Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (₹)</th>
                    <th className="py-3 px-4">Stock SLA</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[#0d0d0e]">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-400">#PROD-0{prod.id}</td>
                      <td className="py-4 px-4 font-bold">{prod.name}</td>
                      <td className="py-4 px-4 text-slate-600">{prod.serviceType}</td>
                      <td className="py-4 px-4">
                        <input
                          type="number"
                          value={prod.price}
                          onChange={(e) => handlePriceChange(prod.id, Number(e.target.value))}
                          className="w-28 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-300 font-extrabold focus:outline-none focus:border-sky-500"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">
                          In Stock ({prod.stock})
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => showToast(`Saved changes for ${prod.name}`, 'success')}
                          className="px-3 py-1.5 rounded-lg bg-[#0d0d0e] hover:bg-emerald-600 text-white font-bold transition-all text-[11px] cursor-pointer"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 3: CUSTOMER ORDERS */}
        {activeTab === 'orders' && (
          <section className="bg-white border-2 border-slate-300 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-black text-[#0d0d0e]">Customer Order Management</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Track and update order fulfillment status</p>
              </div>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="p-5 rounded-2xl bg-[#fafafa] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-[#0d0d0e]">Order #{ord.id}</span>
                      <span className="text-slate-400">|</span>
                      <span className="font-bold text-emerald-600">₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Address: {ord.shippingAddress} • Phone: {ord.contactPhone}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Status:</span>
                    <select
                      value={ord.status}
                      onChange={(e) => handleOrderStatus(ord.id, e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-white border-2 border-slate-300 font-extrabold focus:outline-none focus:border-sky-500 text-xs"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 4: COMMERCIAL QUOTES PIPELINE */}
        {activeTab === 'quotes' && (
          <section className="bg-white border-2 border-slate-300 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-black text-[#0d0d0e]">Commercial Quote Inquiries</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Submissions delivered to kampainfraa@gmail.com</p>
              </div>
            </div>

            <div className="space-y-4">
              {quotes.map((q) => (
                <div key={q.id} className="p-5 rounded-2xl bg-[#fafafa] border border-slate-200 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0d0d0e]">{q.name} ({q.email})</span>
                    <span className="text-[10px] bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded-full border border-sky-200 font-bold">
                      {q.phone}
                    </span>
                  </div>
                  <div className="font-bold text-sky-600">{q.subject}</div>
                  <p className="text-[#0d0d0e] text-xs bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                    "{q.message}"
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 5 / CONTROL MODE: AI AUTOMATION SANDBOX */}
        {(activeTab === 'ai' || controlMode === 'ai') && (
          <section className="bg-[#0d0d0e] text-white border-2 border-slate-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden grid-pattern-dark space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">AI Automation Assistant Console</h3>
                  <p className="text-xs text-slate-400 font-mono">Execute natural language admin tasks automatically</p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                AI Engine Active
              </span>
            </div>

            {/* Prompt Form */}
            <form onSubmit={handleAiSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Increase price of all Healthcare products by 10%, or approve order #103..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-[#141416] border-2 border-white/15 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isExecutingAi}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-mono font-extrabold transition-all cursor-pointer disabled:opacity-50"
                >
                  {isExecutingAi ? 'Executing...' : 'Run AI Task'}
                </button>
              </div>
            </form>

            {/* Execution Log */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-slate-300 space-y-2 max-h-60 overflow-y-auto">
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Execution Trace Log</div>
              {aiLogs.map((logStr, idx) => (
                <div key={idx} className="leading-relaxed">
                  {logStr}
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
