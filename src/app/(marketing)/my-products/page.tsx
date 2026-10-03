'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Package, Key, Download, Repeat, Sparkles, AlertCircle, ShieldCheck, 
  Copy, Check, Headphones, ArrowRight, Laptop, ExternalLink, ChevronRight, Zap 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getMyEntitledProductsApi } from '@/api/releases';
import { getMyLicensesApi } from '@/api/licenses';
import { getMySubscriptionsApi } from '@/api/subscriptions';
import { ProductDto, License, Subscription, DeploymentDto } from '@/api/types';
import { getMyDeploymentsApi } from '@/api/deployments';
import { cn } from '@/lib/utils';

function MyProductsContent() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  
  const orderIdParam = searchParams.get('orderId');
  const isNewPurchase = searchParams.get('newPurchase') === 'true';

  const [products, setProducts] = React.useState<ProductDto[]>([]);
  const [licenses, setLicenses] = React.useState<License[]>([]);
  const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);
  const [deployments, setDeployments] = React.useState<DeploymentDto[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) return;
    async function loadData() {
      setLoading(true);
      try {
        const [pRes, lRes, sRes, dRes] = await Promise.all([
          getMyEntitledProductsApi().catch(() => ({ success: false, data: [] })),
          getMyLicensesApi().catch(() => ({ success: false, data: [] })),
          getMySubscriptionsApi().catch(() => ({ success: false, data: [] })),
          getMyDeploymentsApi().catch(() => ({ success: false, data: [] })),
        ]);
        if (pRes.success && pRes.data) setProducts(pRes.data);
        if (lRes.success && lRes.data) setLicenses(lRes.data);
        if (sRes.success && sRes.data) setSubscriptions(sRes.data);
        if (dRes.success && dRes.data) setDeployments(dRes.data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleCopyKey = (key: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(key);
      setCopiedKey(key);
      showToast('License key copied to clipboard!', 'info');
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  if (!user) {
    return (
      <div className="bg-[#f7f7f5] min-h-screen pb-16 pt-28 sm:pt-36 px-4">
        <div className="max-w-md mx-auto bg-white border-2 border-slate-300 rounded-[32px] p-8 text-center shadow-sm">
          <Package className="w-12 h-12 text-sky-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#0d0d0e] mb-2">Sign In Required</h1>
          <p className="text-xs text-slate-500 mb-6">Please sign in to view your entitled products.</p>
          <Link href="/login" className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider inline-block hover:bg-slate-800 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Identify most recent license for new purchase display
  const newestLicense = licenses.length > 0 ? licenses[0] : null;
  const newestProduct = newestLicense ? products.find(p => p.id === newestLicense.product?.id) : null;
  const newestSub = newestLicense ? subscriptions.find(s => s.product?.id === newestLicense.product?.id) : null;

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
      <main className="max-w-5xl w-full mx-auto" id="my-products-main">
        
        {/* NEW PURCHASE CELEBRATION & AUTO-GENERATED KEY MODAL / BANNER */}
        {isNewPurchase && newestLicense && (
          <div className="mb-10 p-6 sm:p-8 rounded-[32px] bg-gradient-to-br from-[#0c1f17] via-[#0d1824] to-[#0d0d0e] text-white shadow-2xl border-2 border-emerald-500/40 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -right-16 -top-16 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-72 h-72 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>PAYMENT CONFIRMED &bull; LICENSE KEY ACTIVATED</span>
                </div>
                {orderIdParam && (
                  <span className="text-xs font-mono font-bold text-slate-300 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                    Order Ref: #ORD-{orderIdParam}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                Your Software License is Live!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mb-6 font-medium">
                Thank you for your purchase. Your software has been provisioned and your unique cryptographic license key has been generated automatically.
              </p>

              {/* Cryptographic License Key Highlight Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-black/60 border border-emerald-500/50 backdrop-blur-md mb-6 shadow-inner">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold mb-1.5">
                      <Key className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Auto-Generated Software License Key</span>
                    </div>
                    <code className="text-xl sm:text-3xl font-mono font-black text-white tracking-wider select-all break-all drop-shadow-sm">
                      {newestLicense.licenseKey}
                    </code>
                    <div className="text-[11px] text-slate-400 font-mono mt-1">
                      Status: <span className="text-emerald-400 font-bold">ACTIVE</span> &bull; Plan: {newestLicense.productPlan?.name || 'Commercial License'} &bull; Seats: {newestLicense.activationCount || 0} / {newestLicense.activationLimit || 1}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyKey(newestLicense.licenseKey)}
                    className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg cursor-pointer"
                  >
                    {copiedKey === newestLicense.licenseKey ? (
                      <>
                        <Check className="w-4 h-4 text-slate-950" />
                        <span>Key Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-950" />
                        <span>Copy License Key</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Software Startup & First-Login Instructions */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/15 text-xs text-slate-200 space-y-2 mb-6 backdrop-blur-xs">
                <div className="flex items-center gap-2 font-bold text-white text-[11px] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>How to Start &amp; Activate Your Software</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  When you launch or open the software on your computer or log into the client console for the first time, you will be prompted for your <strong>License Key</strong>. Copy and paste the key above into the startup activation prompt to register your device seat and immediately begin using your active subscription.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {newestProduct?.demoUrl && (
                  <a
                    href={newestProduct.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-full bg-white text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition-colors inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Launch Software Console</span>
                  </a>
                )}
                <Link
                  href="/downloads"
                  className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Platform Client</span>
                </Link>
                <Link
                  href="/licenses"
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 border border-white/20"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Manage Device Seats</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Standard Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              SOFTWARE ENTITLEMENTS
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d0d0e]">
              My Products &amp; Software Licenses
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              View your purchased software products, cryptographic license keys, device seats, and subscription renewals.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/downloads" className="px-4 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs">
              <Download className="w-3.5 h-3.5" />
              Platform Downloads
            </Link>
            <Link href="/licenses" className="px-4 py-2.5 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors flex items-center gap-1.5 shadow-xs">
              <Key className="w-3.5 h-3.5" />
              Manage Seats
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((idx) => (
              <div key={idx} className="bg-white border-2 border-slate-200 rounded-[32px] p-6 animate-pulse space-y-3">
                <div className="h-6 bg-slate-100 rounded-lg w-1/3" />
                <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-10 sm:p-14 text-center my-6 shadow-sm">
            <Package className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-[#0d0d0e] mb-2">No Active Software Entitlements</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              You do not have any active software entitlements yet. Purchasing a commercial license or starting a free trial immediately provisions an activation key.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/products" className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors inline-flex items-center gap-1.5 shadow-sm">
                <span>Browse Products Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/solutions" className="px-6 py-3 rounded-full bg-white border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors inline-block">
                Industry Solutions
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {products.map((product) => {
              const matchedLicense = licenses.find(l => l.product?.id === product.id);
              const matchedSub = subscriptions.find(s => s.product?.id === product.id);
              const isCopied = matchedLicense && copiedKey === matchedLicense.licenseKey;

              return (
                <div key={product.id} className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm">
                  
                  {/* Top Bar: Title & Primary Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                          {product.categoryName || 'Enterprise Software'}
                        </span>
                        {product.licenseModel && (
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                            {product.licenseModel}
                          </span>
                        )}
                        {product.supportModel && (
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                            {product.supportModel.replace(/_/g, ' ')}
                          </span>
                        )}
                        {matchedLicense && (
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            matchedLicense.status === 'ACTIVE' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-slate-100 text-slate-600 border-slate-300'
                          }`}>
                            {matchedLicense.status}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-[#0d0d0e]">{product.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-xl">{product.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0">
                      <Link 
                        href={`/products/${product.id}`}
                        className="min-h-[40px] py-2 px-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <span>Product Page</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link 
                        href="/downloads" 
                        className="min-h-[40px] py-2 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </Link>
                      <Link 
                        href="/licenses" 
                        className="min-h-[40px] py-2 px-4 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-mono font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>Manage Seats</span>
                      </Link>
                    </div>
                  </div>

                  {/* Operational Deployment Tracking */}
                  {(() => {
                    const matchedDeployment = deployments.find((d) => d.productId === product.id);
                    if (!matchedDeployment) return null;

                    const isLive = matchedDeployment.status === 'LIVE';

                    return (
                      <div className="mt-4 p-4 rounded-2xl bg-sky-50/70 border border-sky-200 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5 font-bold text-sky-950 uppercase tracking-wider text-[11px]">
                            <span className={cn("w-2 h-2 rounded-full", isLive ? "bg-emerald-500" : "bg-sky-600 animate-pulse")} />
                            Software Provisioning &amp; Environment
                          </div>
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase",
                            isLive
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-amber-100 text-amber-800 border border-amber-300"
                          )}>
                            Status: {matchedDeployment.status}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                          <div className="text-slate-600 text-[11px] leading-relaxed">
                            {matchedDeployment.customerNotes || 'Your dedicated instance is undergoing automated environment configuration and security testing.'}
                          </div>

                          {isLive && matchedDeployment.accessUrl && (
                            <a
                              href={matchedDeployment.accessUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0 shadow-xs"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Launch Cloud Console</span>
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* License & Subscription Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 text-xs font-mono">
                    
                    {/* License Box */}
                    <div className="p-4 rounded-2xl bg-[#fafafa] border border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          <span className="flex items-center gap-1 text-emerald-700">
                            <Key className="w-3 h-3 text-emerald-600" />
                            License Activation Key
                          </span>
                          <span>{matchedLicense?.productPlan?.name || 'Perpetual Commercial'}</span>
                        </div>

                        {matchedLicense ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-xs text-slate-900">
                              <span className="truncate select-all font-bold break-all">{matchedLicense.licenseKey}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyKey(matchedLicense.licenseKey)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors shrink-0 cursor-pointer"
                                title="Copy Key"
                              >
                                {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                              <span className="flex items-center gap-1">
                                <Laptop className="w-3 h-3 text-slate-400" />
                                {matchedLicense.activationCount} / {matchedLicense.activationLimit} Device Seats
                              </span>
                              <Link href="/licenses" className="font-bold text-sky-600 hover:underline">
                                Hardware IDs →
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="text-slate-500 text-xs py-2">
                            Authoritative license included with order entitlement.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Subscription / Support SLA Box */}
                    <div className="p-4 rounded-2xl bg-[#fafafa] border border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          <span className="flex items-center gap-1 text-purple-700">
                            <Repeat className="w-3 h-3 text-purple-600" />
                            Entitlement Status
                          </span>
                          <span>{matchedSub ? matchedSub.status : 'Perpetual SLA'}</span>
                        </div>

                        {matchedSub ? (
                          <div className="space-y-2">
                            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800">
                              <div className="font-bold">{matchedSub.productPlan?.name || 'Active Plan'}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                Expiry: {matchedSub.expiryDate ? new Date(matchedSub.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Lifetime / Continuous'}
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                              <span>Auto-Renew: {matchedSub.autoRenew ? 'Enabled' : 'Manual'}</span>
                              <Link href="/subscriptions" className="font-bold text-purple-600 hover:underline">
                                Plan Details →
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800">
                              <div className="font-bold">Lifetime Commercial Access</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">Standard 12-month SLA maintenance included.</div>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                              <span className="text-emerald-600 font-bold">No Recurring Royalties</span>
                              <Link href="/support" className="font-bold text-amber-600 hover:underline flex items-center gap-1">
                                <Headphones className="w-3 h-3" />
                                Engineering Desk
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}

export default function MyProductsPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[#f7f7f5] pt-32 text-center text-xs text-slate-500">
        Loading software entitlements...
      </div>
    }>
      <MyProductsContent />
    </React.Suspense>
  );
}
