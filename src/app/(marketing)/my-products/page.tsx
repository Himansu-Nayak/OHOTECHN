'use client';

import * as React from 'react';
import Link from 'next/link';
import { Package, Key, Download, Repeat, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getMyEntitledProductsApi } from '@/api/releases';
import { getMyLicensesApi } from '@/api/licenses';
import { getMySubscriptionsApi } from '@/api/subscriptions';
import { ProductDto, License, Subscription } from '@/api/types';
import { CustomerPortalNav } from '@/components/portal/CustomerPortalNav';

export default function MyProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = React.useState<ProductDto[]>([]);
  const [licenses, setLicenses] = React.useState<License[]>([]);
  const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!user) return;
    async function loadData() {
      setLoading(true);
      try {
        const [pRes, lRes, sRes] = await Promise.all([
          getMyEntitledProductsApi().catch(() => ({ success: false, data: [] })),
          getMyLicensesApi().catch(() => ({ success: false, data: [] })),
          getMySubscriptionsApi().catch(() => ({ success: false, data: [] })),
        ]);
        if (pRes.success && pRes.data) setProducts(pRes.data);
        if (lRes.success && lRes.data) setLicenses(lRes.data);
        if (sRes.success && sRes.data) setSubscriptions(sRes.data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (!user) {
    return (
      <div className="bg-[#f7f7f5] min-h-screen pb-16 pt-28 sm:pt-36 px-4">
        <div className="max-w-md mx-auto bg-white border-2 border-slate-300 rounded-[32px] p-8 text-center shadow-sm">
          <Package className="w-12 h-12 text-sky-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#0d0d0e] mb-2">Sign In Required</h1>
          <p className="text-xs text-slate-500 mb-6">Please sign in to view your entitled products.</p>
          <Link href="/login" className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider inline-block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
      <main className="max-w-5xl w-full mx-auto" id="my-products-main">
        <CustomerPortalNav />
        
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            SOFTWARE ENTITLEMENTS
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d0d0e]">
            My Products &amp; Software Licenses
          </h1>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            View your purchased software products, active license keys, and subscription details.
          </p>
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
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-12 text-center my-6 shadow-sm">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-[#0d0d0e] mb-2">No Purchased Software Entitlements</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              You do not have any active software products yet. Browse our products or start a free trial.
            </p>
            <Link href="/products" className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors inline-block">
              Browse Products Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {products.map((product) => {
              const matchedLicense = licenses.find(l => l.product?.id === product.id);
              const matchedSub = subscriptions.find(s => s.product?.id === product.id);

              return (
                <div key={product.id} className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-[#0d0d0e]">{product.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{product.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href="/downloads" className="py-2.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs transition-colors flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </Link>
                      <Link href="/licenses" className="py-2.5 px-4 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-mono font-bold text-xs transition-colors flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5" />
                        Manage License
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs font-mono">
                    <div className="p-4 rounded-2xl bg-[#fafafa] border border-slate-200">
                      <div className="font-bold text-slate-400 uppercase text-[10px] mb-1">License Details</div>
                      {matchedLicense ? (
                        <div>
                          <div className="font-extrabold text-[#0d0d0e]">{matchedLicense.licenseKey}</div>
                          <div className="text-slate-500 mt-1">Status: <span className="font-bold text-emerald-600">{matchedLicense.status}</span> ({matchedLicense.activationCount}/{matchedLicense.activationLimit} Device Activations)</div>
                        </div>
                      ) : (
                        <div className="text-slate-500">License included via order subscription</div>
                      )}
                    </div>

                    <div className="p-4 rounded-2xl bg-[#fafafa] border border-slate-200">
                      <div className="font-bold text-slate-400 uppercase text-[10px] mb-1">Subscription Details</div>
                      {matchedSub ? (
                        <div>
                          <div className="font-extrabold text-[#0d0d0e]">Status: {matchedSub.status}</div>
                          <div className="text-slate-500 mt-1">Expiry: {matchedSub.expiryDate ? new Date(matchedSub.expiryDate).toLocaleDateString() : 'Lifetime / No Expiry'}</div>
                        </div>
                      ) : (
                        <div className="text-slate-500">Full Lifetime Access Entitlement</div>
                      )}
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
