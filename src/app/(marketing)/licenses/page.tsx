'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Key,
  Laptop,
  Plus,
  X,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  Eye,
  EyeOff,
  Search,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Cpu,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getMyLicensesApi, activateDeviceApi, deactivateDeviceApi, getLicenseDevicesApi } from '@/api/licenses';
import { License, DeviceActivation, LicenseStatus } from '@/api/types';
import { CustomerPortalNav } from '@/components/portal/CustomerPortalNav';

export default function LicensesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [licenses, setLicenses] = React.useState<License[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL');
  
  // Masking state per license ID
  const [revealedKeys, setRevealedKeys] = React.useState<Record<number, boolean>>({});
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  // Device modal state
  const [selectedLicense, setSelectedLicense] = React.useState<License | null>(null);
  const [devices, setDevices] = React.useState<DeviceActivation[]>([]);
  const [loadingDevices, setLoadingDevices] = React.useState<boolean>(false);
  const [deactivatingId, setDeactivatingId] = React.useState<string | null>(null);

  // Activate device form state
  const [showActivateForm, setShowActivateForm] = React.useState<boolean>(false);
  const [deviceIdentifier, setDeviceIdentifier] = React.useState<string>('');
  const [deviceName, setDeviceName] = React.useState<string>('');
  const [operatingSystem, setOperatingSystem] = React.useState<string>('Windows 11');
  const [activating, setActivating] = React.useState<boolean>(false);

  const fetchLicenses = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await getMyLicensesApi();
      if (res.success && res.data) {
        setLicenses(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load licenses', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  React.useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses]);

  const toggleKeyReveal = (id: number) => {
    setRevealedKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getMaskedKey = (key: string, isRevealed: boolean) => {
    if (isRevealed) return key;
    const parts = key.split('-');
    if (parts.length >= 5) {
      return `${parts[0]}-••••-••••-••••-${parts[4]}`;
    }
    return '••••-••••-••••-••••';
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    showToast('License key copied to clipboard', 'info');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleOpenDevices = async (license: License) => {
    setSelectedLicense(license);
    setLoadingDevices(true);
    setShowActivateForm(false);
    try {
      const res = await getLicenseDevicesApi(license.licenseKey);
      if (res.success && res.data) {
        setDevices(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load registered devices', 'error');
    } finally {
      setLoadingDevices(false);
    }
  };

  const handleActivateDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLicense || !deviceIdentifier.trim()) return;
    setActivating(true);
    try {
      const res = await activateDeviceApi(selectedLicense.licenseKey, {
        deviceIdentifier: deviceIdentifier.trim(),
        deviceName: deviceName.trim() || 'Workstation PC',
        operatingSystem,
      });
      if (res.success) {
        showToast('Device activated successfully', 'success');
        setDeviceIdentifier('');
        setDeviceName('');
        setShowActivateForm(false);
        // Refresh devices and license list
        await handleOpenDevices(selectedLicense);
        await fetchLicenses();
      }
    } catch (err: any) {
      showToast(err.message || 'Device activation failed', 'error');
    } finally {
      setActivating(false);
    }
  };

  const handleDeactivateDevice = async (deviceIdent: string) => {
    if (!selectedLicense) return;
    setDeactivatingId(deviceIdent);
    try {
      const res = await deactivateDeviceApi(selectedLicense.licenseKey, deviceIdent);
      if (res.success) {
        showToast('Device deactivated successfully. Seat released.', 'success');
        await handleOpenDevices(selectedLicense);
        await fetchLicenses();
      }
    } catch (err: any) {
      showToast(err.message || 'Device deactivation failed', 'error');
    } finally {
      setDeactivatingId(null);
    }
  };

  // Filtered licenses
  const filteredLicenses = React.useMemo(() => {
    return licenses.filter((lic) => {
      const matchesStatus = statusFilter === 'ALL' || lic.status === statusFilter;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        lic.product?.name?.toLowerCase().includes(term) ||
        lic.licenseKey.toLowerCase().includes(term) ||
        lic.productPlan?.name?.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [licenses, statusFilter, searchTerm]);

  // Metric aggregates
  const totalLicenses = licenses.length;
  const activeLicenses = licenses.filter((l) => l.status === 'ACTIVE').length;
  const totalActivations = licenses.reduce((sum, l) => sum + (l.activationCount || 0), 0);
  const totalCapacity = licenses.reduce((sum, l) => sum + (l.activationLimit || 0), 0);

  if (!user) {
    return (
      <div className="bg-[#f7f7f5] min-h-screen pb-16 pt-28 sm:pt-36 px-4">
        <div className="max-w-md mx-auto bg-white border-2 border-slate-300 rounded-[32px] p-8 text-center shadow-sm">
          <Key className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#0d0d0e] mb-2">Sign In Required</h1>
          <p className="text-xs text-slate-500 mb-6">Please sign in to view your software licenses.</p>
          <Link href="/login" className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider inline-block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
      <main className="max-w-6xl w-full mx-auto" id="licenses-main">
        <CustomerPortalNav />
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              CRYPTOGRAPHIC LICENSE CENTER
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d0d0e]">
              Software Licenses &amp; Device Seats
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Manage your hardware-bound software keys, activations, and seat allocations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchLicenses}
              disabled={loading}
              className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Refresh Licenses"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/downloads"
              className="px-4 py-2.5 rounded-full bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Binaries
            </Link>
            <Link
              href="/products"
              className="px-5 py-2.5 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors inline-block"
            >
              + Get New License
            </Link>
          </div>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">Total Keys</div>
            <div className="text-2xl font-black text-[#0d0d0e] mt-1">{totalLicenses}</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">Assigned to your account</div>
          </div>
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">Active Licenses</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{activeLicenses}</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">Operational &amp; verified</div>
          </div>
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">Active Devices</div>
            <div className="text-2xl font-black text-sky-600 mt-1">{totalActivations}</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">Currently registered</div>
          </div>
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">Total Capacity</div>
            <div className="text-2xl font-black text-slate-700 mt-1">{totalCapacity} <span className="text-xs text-slate-400 font-medium">seats</span></div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{totalCapacity - totalActivations} seats remaining</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product or key..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {(['ALL', 'ACTIVE', 'EXPIRED', 'REVOKED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-[#0d0d0e] text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Licenses List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="bg-white border-2 border-slate-200 rounded-[28px] p-6 animate-pulse space-y-3">
                <div className="h-6 bg-slate-100 rounded-lg w-1/3" />
                <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredLicenses.length === 0 ? (
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-12 text-center my-6 shadow-sm">
            <Key className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-[#0d0d0e] mb-2">
              {licenses.length === 0 ? 'No Licenses Found' : 'No Matching Licenses'}
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              {licenses.length === 0
                ? 'You do not have any software licenses assigned to your account. Purchase a product to generate your first cryptographic key.'
                : 'Try adjusting your search criteria or status filter.'}
            </p>
            {licenses.length === 0 && (
              <Link href="/products" className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors inline-block">
                Browse Products
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLicenses.map((license) => {
              const isRevealed = !!revealedKeys[license.id];
              const pctUsed = license.activationLimit > 0 
                ? Math.min(100, Math.round((license.activationCount / license.activationLimit) * 100))
                : 0;

              return (
                <div
                  key={license.id}
                  className="bg-white border-2 border-slate-200 hover:border-slate-300 rounded-[28px] p-6 transition-all shadow-xs"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    
                    {/* Left: Product & Key */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-sky-600 uppercase bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-100">
                          {license.product?.name || 'Software Product'}
                        </span>
                        {license.productPlan && (
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded-md">
                            {license.productPlan.name}
                          </span>
                        )}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                          license.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : license.status === 'EXPIRED'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {license.status}
                        </span>
                      </div>

                      {/* License Key with Mask / Reveal */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-base sm:text-lg font-black font-mono text-[#0d0d0e] tracking-wider bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
                          {getMaskedKey(license.licenseKey, isRevealed)}
                        </span>
                        
                        <button
                          onClick={() => toggleKeyReveal(license.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                          title={isRevealed ? 'Hide Key' : 'Reveal Key'}
                        >
                          {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-slate-500" />}
                        </button>

                        <button
                          onClick={() => handleCopyKey(license.licenseKey)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                          title="Copy Key"
                        >
                          {copiedKey === license.licenseKey ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Right: Activations & CTAs */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Seat Meter */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 min-w-36">
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 mb-1">
                          <span>DEVICE SEATS</span>
                          <span className="text-[#0d0d0e]">{license.activationCount} / {license.activationLimit}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              pctUsed >= 100 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${pctUsed}%` }}
                          />
                        </div>
                      </div>

                      {/* Manage Devices Button */}
                      <button
                        onClick={() => handleOpenDevices(license)}
                        className="py-2.5 px-4 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-mono font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Laptop className="w-3.5 h-3.5" />
                        Manage Devices
                      </button>

                      {/* Direct Detail Link */}
                      <Link
                        href={`/licenses/${license.id}`}
                        className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="View Detailed License Center"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Metadata Footer */}
                  <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-slate-500">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Issued At</span>
                      <span className="text-[#0d0d0e]">
                        {license.issuedAt ? new Date(license.issuedAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Expires At</span>
                      <span className="text-[#0d0d0e]">
                        {license.expiresAt ? new Date(license.expiresAt).toLocaleDateString() : 'Lifetime Access'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Subscription</span>
                      <span className="text-[#0d0d0e]">
                        {license.subscription ? (
                          <span className="text-emerald-600 font-bold">Auto-Renews</span>
                        ) : (
                          'Perpetual License'
                        )}
                      </span>
                    </div>
                    <div className="text-right sm:text-left">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Direct Action</span>
                      <Link
                        href={`/licenses/${license.id}`}
                        className="text-sky-600 hover:underline inline-flex items-center gap-1 text-[11px] font-bold"
                      >
                        License Details &amp; SDK <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Device Management Modal */}
      {selectedLicense && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 max-w-xl w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-50 border border-sky-100 text-sky-700 font-mono text-[10px] font-bold uppercase mb-1">
                  <Laptop className="w-3 h-3" />
                  DEVICE SEAT CONTROLLER
                </div>
                <h3 className="text-xl font-black text-[#0d0d0e]">
                  {selectedLicense.product?.name || 'Software'} Activations
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Key: {selectedLicense.licenseKey}
                </p>
              </div>
              <button
                onClick={() => setSelectedLicense(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quota Bar */}
            <div className="my-4 bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
                <span className="text-slate-600">Hardware Allocation</span>
                <span className="text-[#0d0d0e]">
                  {selectedLicense.activationCount} of {selectedLicense.activationLimit} Seats Used
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    selectedLicense.activationCount >= selectedLicense.activationLimit
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (selectedLicense.activationCount / (selectedLicense.activationLimit || 1)) * 100
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Device List */}
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {loadingDevices ? (
                <div className="text-center py-6 text-xs font-mono text-slate-400 animate-pulse">
                  Scanning registered hardware...
                </div>
              ) : devices.length === 0 ? (
                <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                  <Laptop className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-medium">No active device bindings found for this key.</p>
                  <p className="text-[10px] text-slate-400 mt-1">Activate through your desktop client or register below.</p>
                </div>
              ) : (
                devices.map((dev) => (
                  <div
                    key={dev.id}
                    className="p-3.5 rounded-2xl bg-[#fafafa] border border-slate-200 flex items-center justify-between gap-3 text-xs font-mono"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0d0d0e] truncate">
                          {dev.deviceName || 'Personal PC'}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md font-bold">
                          {dev.operatingSystem || 'Windows'}
                        </span>
                        {dev.active ? (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Active
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold">Revoked</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        UUID: <span className="text-slate-700">{dev.deviceIdentifier}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-3">
                        <span>Activated: {dev.activatedAt ? new Date(dev.activatedAt).toLocaleDateString() : 'Recent'}</span>
                        {dev.lastSeenAt && (
                          <span>Last Seen: {new Date(dev.lastSeenAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>

                    {dev.active && (
                      <button
                        onClick={() => handleDeactivateDevice(dev.deviceIdentifier)}
                        disabled={deactivatingId === dev.deviceIdentifier}
                        className="py-1.5 px-3.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] border border-rose-200 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                      >
                        {deactivatingId === dev.deviceIdentifier ? 'Revoking...' : 'Deactivate'}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Activate New Device Form / Button */}
            {showActivateForm ? (
              <form onSubmit={handleActivateDevice} className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-[#0d0d0e]">Manual Device Binding</div>
                  <button
                    type="button"
                    onClick={() => setShowActivateForm(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                  >
                    Cancel
                  </button>
                </div>
                
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">
                    Device Identifier (UUID or Machine Hash) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                    value={deviceIdentifier}
                    onChange={(e) => setDeviceIdentifier(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">
                      Device Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MacBook Pro M3"
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">
                      Operating System
                    </label>
                    <select
                      value={operatingSystem}
                      onChange={(e) => setOperatingSystem(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-white"
                    >
                      <option value="Windows 11">Windows 11</option>
                      <option value="macOS Sonoma">macOS Sonoma</option>
                      <option value="Ubuntu Linux 24.04">Ubuntu Linux</option>
                      <option value="iOS">iOS</option>
                      <option value="Android">Android</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowActivateForm(false)}
                    className="px-4 py-2 rounded-full border border-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={activating || !deviceIdentifier.trim()}
                    className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-50 transition-colors"
                  >
                    {activating ? 'Binding...' : 'Confirm Activation'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/licenses/${selectedLicense.id}`}
                  className="text-xs font-mono font-bold text-sky-600 hover:underline flex items-center gap-1"
                >
                  Full License Center &amp; SDK Commands <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => setShowActivateForm(true)}
                  disabled={selectedLicense.activationCount >= selectedLicense.activationLimit}
                  className="py-2.5 px-4 rounded-full bg-[#0d0d0e] hover:bg-emerald-600 text-white font-mono font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  title={
                    selectedLicense.activationCount >= selectedLicense.activationLimit
                      ? 'Activation limit reached. Deactivate a device first.'
                      : 'Register new device hardware'
                  }
                >
                  <Plus className="w-3.5 h-3.5" />
                  Activate New Device
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

