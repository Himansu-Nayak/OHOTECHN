'use client';

import * as React from 'react';
import Link from 'next/link';
import { Download, Monitor, Laptop, Smartphone, Globe, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getMyEntitledProductsApi, getEntitledProductReleasesApi, downloadReleaseApi } from '@/api/releases';
import { ProductDto, SoftwareReleaseDto, Platform } from '@/api/types';

export default function DownloadsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = React.useState<ProductDto[]>([]);
  const [selectedProductId, setSelectedProductId] = React.useState<number | null>(null);
  const [releases, setReleases] = React.useState<SoftwareReleaseDto[]>([]);
  const [selectedPlatform, setSelectedPlatform] = React.useState<string>('ALL');

  const [loadingProducts, setLoadingProducts] = React.useState<boolean>(true);
  const [loadingReleases, setLoadingReleases] = React.useState<boolean>(false);
  const [downloadingReleaseId, setDownloadingReleaseId] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!user) return;
    async function loadProducts() {
      setLoadingProducts(true);
      try {
        const res = await getMyEntitledProductsApi();
        if (res.success && res.data && res.data.length > 0) {
          setProducts(res.data);
          setSelectedProductId(res.data[0].id);
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to load entitled products', 'error');
      } finally {
        setLoadingProducts(false);
      }
    }
    loadProducts();
  }, [user, showToast]);

  const fetchReleases = React.useCallback(async (productId: number) => {
    setLoadingReleases(true);
    try {
      const res = await getEntitledProductReleasesApi(productId);
      if (res.success && res.data) {
        setReleases(res.data);
      } else {
        setReleases([]);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load releases for selected product', 'error');
      setReleases([]);
    } finally {
      setLoadingReleases(false);
    }
  }, [showToast]);

  React.useEffect(() => {
    if (selectedProductId) {
      fetchReleases(selectedProductId);
    }
  }, [selectedProductId, fetchReleases]);

  const handleDownload = async (productId: number, releaseId: number, fileName?: string) => {
    setDownloadingReleaseId(releaseId);
    try {
      const blob = await downloadReleaseApi(productId, releaseId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || `software-release-${releaseId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast('Digital package downloaded successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to download software package', 'error');
    } finally {
      setDownloadingReleaseId(null);
    }
  };

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'WINDOWS':
      case 'MACOS':
      case 'LINUX':
        return <Monitor className="w-4 h-4 text-[#0d0d0e]" />;
      case 'ANDROID':
      case 'IOS':
        return <Smartphone className="w-4 h-4 text-[#0d0d0e]" />;
      case 'WEB':
      default:
        return <Globe className="w-4 h-4 text-[#0d0d0e]" />;
    }
  };

  const filteredReleases = releases.filter((r) => selectedPlatform === 'ALL' || r.platform === selectedPlatform);

  if (!user) {
    return (
      <div className="bg-[#f7f7f5] min-h-screen pb-16 pt-28 sm:pt-36 px-4">
        <div className="max-w-md mx-auto bg-white border-2 border-slate-300 rounded-[32px] p-8 text-center shadow-sm">
          <Download className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#0d0d0e] mb-2">Sign In Required</h1>
          <p className="text-xs text-slate-500 mb-6">Please sign in to access your authorized digital downloads.</p>
          <Link href="/login" className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider inline-block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
      <main className="max-w-6xl w-full mx-auto" id="downloads-main">
        
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AUTHORIZED DIGITAL DELIVERY
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d0d0e]">
            Software Version Releases &amp; Downloads
          </h1>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Download production-ready binary installers, source packages, and release updates for your entitled software.
          </p>
        </div>

        {loadingProducts ? (
          <div className="bg-white border-2 border-slate-200 rounded-[32px] p-8 animate-pulse text-center">
            <div className="h-6 bg-slate-100 rounded-lg w-1/3 mx-auto mb-3" />
            <div className="h-4 bg-slate-100 rounded-lg w-1/2 mx-auto" />
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-12 text-center my-6 shadow-sm">
            <Download className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-[#0d0d0e] mb-2">No Downloads Available</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              You currently do not have an active subscription or valid license entitlement for any software products.
            </p>
            <Link href="/products" className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors inline-block">
              Browse Products Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left Column: Product Selector */}
            <div className="lg:col-span-1 space-y-2">
              <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
                Your Entitled Products ({products.length})
              </div>
              {products.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => setSelectedProductId(prod.id)}
                  className={`w-full p-4 rounded-2xl text-left border-2 transition-all font-bold text-xs flex items-center justify-between cursor-pointer ${
                    selectedProductId === prod.id
                      ? 'bg-[#0d0d0e] text-white border-[#0d0d0e] shadow-sm'
                      : 'bg-white text-[#0d0d0e] border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span className="truncate pr-2">{prod.name}</span>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${selectedProductId === prod.id ? 'text-emerald-400' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>

            {/* Right Column: Platform Filter & Releases List */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Platform Filter Pills */}
              <div className="bg-white border-2 border-slate-300 rounded-[28px] p-3 sm:p-4 shadow-xs flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mr-1 sm:mr-2 shrink-0">Platform:</span>
                {['ALL', 'WINDOWS', 'MACOS', 'LINUX', 'ANDROID', 'IOS', 'WEB'].map((plat) => (
                  <button
                    key={plat}
                    onClick={() => setSelectedPlatform(plat)}
                    className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all border shrink-0 ${
                      selectedPlatform === plat
                        ? 'bg-[#0d0d0e] text-white border-[#0d0d0e]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {plat}
                  </button>
                ))}
              </div>

              {/* Releases List */}
              {loadingReleases ? (
                <div className="bg-white border-2 border-slate-200 rounded-[32px] p-8 animate-pulse text-center space-y-3">
                  <div className="h-6 bg-slate-100 rounded-lg w-1/3 mx-auto" />
                  <div className="h-4 bg-slate-100 rounded-lg w-1/2 mx-auto" />
                </div>
              ) : filteredReleases.length === 0 ? (
                <div className="bg-white border-2 border-slate-300 rounded-[32px] p-10 text-center shadow-sm">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-extrabold text-[#0d0d0e] mb-1">No Releases Found</h3>
                  <p className="text-xs text-slate-500">No active software releases available for the selected platform.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReleases.map((release) => (
                    <div key={release.id} className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {getPlatformIcon(release.platform)}
                            <span className="text-lg font-black text-[#0d0d0e]">
                              Version {release.version}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold border border-slate-200">
                              {release.platform}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 font-mono mt-1 break-all">
                            File: {release.fileName || 'release-binary.zip'} ({release.fileSize ? `${Math.round(release.fileSize / 1024)} KB` : '100 MB'})
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDownload(selectedProductId!, release.id, release.fileName)}
                          disabled={downloadingReleaseId === release.id}
                          className="w-full sm:w-auto min-h-[44px] py-2.5 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          <Download className="w-4 h-4" />
                          <span>{downloadingReleaseId === release.id ? 'Downloading...' : 'Download Installer'}</span>
                        </button>
                      </div>

                      {release.releaseNotes && (
                        <div className="pt-4 text-xs">
                          <span className="font-mono font-bold text-slate-400 uppercase text-[10px] block mb-1">Release Notes &amp; Features</span>
                          <p className="text-slate-600 leading-relaxed font-mono">{release.releaseNotes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>
        )}

      </main>
    </div>
  );
}
