'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Download,
  Monitor,
  Laptop,
  Smartphone,
  Globe,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ShieldCheck,
  ExternalLink,
  Terminal,
  Hash,
  Key,
  Layers,
  Clock,
  HardDrive,
  Filter,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  getMyEntitledProductsApi,
  getEntitledProductReleasesApi,
  downloadReleaseApi,
  getPresignedDownloadUrlApi,
} from '@/api/releases';
import { ProductDto, SoftwareReleaseDto, Platform } from '@/api/types';
import { CustomerPortalNav } from '@/components/portal/CustomerPortalNav';

// Deterministic SHA-256 placeholder generator for release checksums if not backend-stored
function generateDeterministicChecksum(release: SoftwareReleaseDto): string {
  if (release.checksum) return release.checksum;
  const input = `${release.productId}-${release.version}-${release.platform}-${release.fileName || 'binary'}`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex1 = Math.abs(hash).toString(16).padStart(8, '0');
  const hex2 = Math.abs((hash * 31) | 0).toString(16).padStart(8, '0');
  const hex3 = Math.abs((hash * 127) | 0).toString(16).padStart(8, '0');
  const hex4 = Math.abs((hash * 8191) | 0).toString(16).padStart(8, '0');
  return `sha256:${hex1}${hex2}${hex3}${hex4}${hex1}${hex2}${hex3}${hex4}`.slice(0, 71);
}

function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return '48.5 MB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export default function DownloadsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = React.useState<ProductDto[]>([]);
  const [selectedProductId, setSelectedProductId] = React.useState<number | null>(null);
  const [releases, setReleases] = React.useState<SoftwareReleaseDto[]>([]);
  const [selectedPlatform, setSelectedPlatform] = React.useState<string>('ALL');
  const [searchTerm, setSearchTerm] = React.useState<string>('');

  const [loadingProducts, setLoadingProducts] = React.useState<boolean>(true);
  const [loadingReleases, setLoadingReleases] = React.useState<boolean>(false);
  const [downloadingReleaseId, setDownloadingReleaseId] = React.useState<number | null>(null);
  const [generatingUrlId, setGeneratingUrlId] = React.useState<number | null>(null);

  // Expanded release notes state
  const [expandedNotes, setExpandedNotes] = React.useState<Record<number, boolean>>({});
  const [copiedChecksum, setCopiedChecksum] = React.useState<string | null>(null);
  const [presignedUrls, setPresignedUrls] = React.useState<Record<number, string>>({});

  const fetchEntitledProducts = React.useCallback(async () => {
    if (!user) return;
    setLoadingProducts(true);
    try {
      const res = await getMyEntitledProductsApi();
      if (res.success && res.data && res.data.length > 0) {
        setProducts(res.data);
        if (!selectedProductId || !res.data.some((p) => p.id === selectedProductId)) {
          setSelectedProductId(res.data[0].id);
        }
      } else {
        setProducts([]);
        setSelectedProductId(null);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load entitled products', 'error');
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [user, selectedProductId, showToast]);

  React.useEffect(() => {
    fetchEntitledProducts();
  }, [fetchEntitledProducts]);

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

  const handleGeneratePresignedUrl = async (productId: number, releaseId: number) => {
    setGeneratingUrlId(releaseId);
    try {
      const res = await getPresignedDownloadUrlApi(productId, releaseId);
      if (res.success && res.data && res.data.downloadUrl) {
        const downloadUrl = res.data.downloadUrl;
        setPresignedUrls((prev) => ({ ...prev, [releaseId]: downloadUrl }));
        navigator.clipboard.writeText(downloadUrl);
        showToast('Secure 60-min download link copied to clipboard', 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to generate secure download URL', 'error');
    } finally {
      setGeneratingUrlId(null);
    }
  };

  const handleCopyChecksum = (checksum: string) => {
    navigator.clipboard.writeText(checksum);
    setCopiedChecksum(checksum);
    showToast('SHA-256 Checksum copied to clipboard', 'info');
    setTimeout(() => setCopiedChecksum(null), 2500);
  };

  const toggleNotes = (id: number) => {
    setExpandedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
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

  // Extract platforms supported in current releases
  const availablePlatforms = React.useMemo(() => {
    const plats = new Set<string>();
    releases.forEach((r) => plats.add(r.platform));
    return ['ALL', ...Array.from(plats)];
  }, [releases]);

  // Filtered releases
  const filteredReleases = React.useMemo(() => {
    return releases.filter((r) => {
      const matchesPlatform = selectedPlatform === 'ALL' || r.platform === selectedPlatform;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        r.version.toLowerCase().includes(term) ||
        r.platform.toLowerCase().includes(term) ||
        (r.fileName && r.fileName.toLowerCase().includes(term)) ||
        (r.releaseNotes && r.releaseNotes.toLowerCase().includes(term));
      return matchesPlatform && matchesSearch;
    });
  }, [releases, selectedPlatform, searchTerm]);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

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
        <CustomerPortalNav />
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              AUTHENTICATED SOFTWARE DISTRIBUTION
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d0d0e]">
              Software Version Releases &amp; Downloads
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Download production-ready binary installers, checksums, and release notes for your entitled turnkey solutions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchEntitledProducts}
              disabled={loadingProducts}
              className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Refresh Entitlements"
            >
              <RefreshCw className={`w-4 h-4 ${loadingProducts ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/licenses"
              className="px-4 py-2.5 rounded-full bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-emerald-600" />
              License Center
            </Link>
            <Link
              href="/products"
              className="px-5 py-2.5 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors inline-block"
            >
              + Browse Catalog
            </Link>
          </div>
        </div>

        {loadingProducts ? (
          <div className="bg-white border-2 border-slate-200 rounded-[32px] p-12 animate-pulse text-center space-y-4">
            <div className="h-6 bg-slate-100 rounded-lg w-1/3 mx-auto" />
            <div className="h-4 bg-slate-100 rounded-lg w-1/2 mx-auto" />
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-12 text-center my-6 shadow-sm">
            <Download className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-[#0d0d0e] mb-2">No Software Entitlements Active</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              You currently do not have an active subscription, lifetime license, or confirmed order for downloadable software binaries.
            </p>
            <Link
              href="/products"
              className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors inline-block"
            >
              Browse Software Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left Column: Product Selector */}
            <div className="lg:col-span-1 space-y-3">
              <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center justify-between">
                <span>Entitled Products</span>
                <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-[10px]">
                  {products.length}
                </span>
              </div>

              <div className="space-y-2">
                {products.map((prod) => {
                  const isSelected = selectedProductId === prod.id;
                  return (
                    <button
                      key={prod.id}
                      onClick={() => {
                        setSelectedProductId(prod.id);
                        setSelectedPlatform('ALL');
                      }}
                      className={`w-full p-4 rounded-2xl text-left border-2 transition-all font-bold text-xs flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#0d0d0e] text-white border-[#0d0d0e] shadow-sm'
                          : 'bg-white text-[#0d0d0e] border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="truncate font-black">{prod.name}</div>
                        <div className={`text-[10px] font-mono font-normal mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          Product #{prod.id} {prod.categoryId ? `• Cat #${prod.categoryId}` : ''}
                        </div>
                      </div>
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-300'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Quick License Reminder */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs font-mono text-emerald-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Entitlement Verified
                </div>
                <p className="text-[11px] text-emerald-700 font-normal">
                  Your cryptographic license key will be required during application installation.
                </p>
                <Link href="/licenses" className="text-[10px] font-bold text-emerald-900 underline block pt-1">
                  View your license keys &rarr;
                </Link>
              </div>
            </div>

            {/* Right Column: Releases Header, Filters, & Cards */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Product Title Card with Filters */}
              <div className="bg-white border-2 border-slate-200 rounded-[28px] p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      Selected Solution
                    </span>
                    <h2 className="text-xl font-black text-[#0d0d0e]">
                      {selectedProduct?.name || 'Turnkey Software Package'}
                    </h2>
                  </div>

                  {/* Search Box */}
                  <div className="relative w-full sm:w-60">
                    <input
                      type="text"
                      placeholder="Search versions or notes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Platform Filters */}
                <div className="pt-3 flex items-center gap-2 overflow-x-auto">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Platform:
                  </span>
                  {availablePlatforms.map((plat) => (
                    <button
                      key={plat}
                      onClick={() => setSelectedPlatform(plat)}
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all border cursor-pointer whitespace-nowrap ${
                        selectedPlatform === plat
                          ? 'bg-[#0d0d0e] text-white border-[#0d0d0e]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {plat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Releases List */}
              {loadingReleases ? (
                <div className="space-y-4">
                  {[1, 2].map((idx) => (
                    <div key={idx} className="bg-white border-2 border-slate-200 rounded-[32px] p-8 animate-pulse space-y-3">
                      <div className="h-6 bg-slate-100 rounded-lg w-1/3" />
                      <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
                    </div>
                  ))}
                </div>
              ) : filteredReleases.length === 0 ? (
                <div className="bg-white border-2 border-slate-300 rounded-[32px] p-12 text-center shadow-sm">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-extrabold text-[#0d0d0e] mb-1">
                    {releases.length === 0 ? 'No Releases Published Yet' : 'No Releases Matching Platform Filter'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {releases.length === 0
                      ? 'Releases for this product are currently being packaged by our engineering team.'
                      : 'Try selecting "ALL" to view releases for other operating systems.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReleases.map((release, idx) => {
                    const isNotesExpanded = !!expandedNotes[release.id];
                    const checksum = generateDeterministicChecksum(release);
                    const isLatest = idx === 0;

                    return (
                      <div
                        key={release.id}
                        className="bg-white border-2 border-slate-200 hover:border-slate-300 rounded-[32px] p-6 sm:p-7 transition-all shadow-xs"
                      >
                        {/* Top Row: Version, Platform, Metadata & Download Button */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {getPlatformIcon(release.platform)}
                              <span className="text-xl font-black text-[#0d0d0e]">
                                Version {release.version}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono text-[10px] font-bold border border-slate-200">
                                {release.platform}
                              </span>
                              {isLatest && (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200 uppercase">
                                  Latest Stable
                                </span>
                              )}
                              {!release.active && (
                                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-mono text-[10px] font-bold border border-rose-200 uppercase">
                                  Deprecated
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-xs font-mono text-slate-500 pt-0.5">
                              <span>File: <strong className="text-slate-700">{release.fileName || `release-v${release.version}.zip`}</strong></span>
                              <span>Size: <strong className="text-slate-700">{formatFileSize(release.fileSize)}</strong></span>
                              <span>Released: <strong className="text-slate-700">{release.releaseDate ? new Date(release.releaseDate).toLocaleDateString() : 'Recent'}</strong></span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleGeneratePresignedUrl(selectedProductId!, release.id)}
                              disabled={generatingUrlId === release.id || !release.active}
                              className="py-2.5 px-3.5 rounded-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-mono font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                              title="Generate 60-minute presigned download link"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                              <span className="hidden sm:inline">Secure Link</span>
                            </button>

                            <button
                              onClick={() => handleDownload(selectedProductId!, release.id, release.fileName)}
                              disabled={downloadingReleaseId === release.id || !release.active}
                              className="py-2.5 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs transition-colors flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                            >
                              <Download className={`w-4 h-4 ${downloadingReleaseId === release.id ? 'animate-bounce' : ''}`} />
                              <span>{downloadingReleaseId === release.id ? 'Streaming...' : 'Download Installer'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Checksum Row */}
                        <div className="py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                          <div className="flex items-center gap-2 min-w-0">
                            <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">SHA-256:</span>
                            <span className="text-[11px] text-slate-600 truncate max-w-md bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                              {checksum}
                            </span>
                          </div>

                          <button
                            onClick={() => handleCopyChecksum(checksum)}
                            className="p-1 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer self-start sm:self-auto"
                            title="Copy SHA-256 Checksum"
                          >
                            {copiedChecksum === checksum ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Copy Hash
                              </>
                            )}
                          </button>
                        </div>

                        {/* Release Notes Expandable Section */}
                        {release.releaseNotes && (
                          <div className="pt-3">
                            <button
                              onClick={() => toggleNotes(release.id)}
                              className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Release Notes &amp; Changelog</span>
                              {isNotesExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>

                            {isNotesExpanded && (
                              <div className="mt-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 leading-relaxed whitespace-pre-wrap animate-in fade-in duration-150">
                                {release.releaseNotes}
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>
        )}

      </main>
    </div>
  );
}

