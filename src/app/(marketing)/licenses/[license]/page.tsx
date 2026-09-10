'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
  ArrowLeft,
  ChevronRight,
  RefreshCw,
  Download,
  Terminal,
  Code2,
  Calendar,
  Layers,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  getLicenseByIdApi,
  getLicenseByKeyApi,
  getLicenseDevicesApi,
  activateDeviceApi,
  deactivateDeviceApi,
} from '@/api/licenses';
import { License, DeviceActivation } from '@/api/types';
import { CustomerPortalNav } from '@/components/portal/CustomerPortalNav';

export default function LicenseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();

  const licenseParam = params?.license as string;

  const [license, setLicense] = React.useState<License | null>(null);
  const [devices, setDevices] = React.useState<DeviceActivation[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [loadingDevices, setLoadingDevices] = React.useState<boolean>(false);
  const [revealedKey, setRevealedKey] = React.useState<boolean>(false);
  const [copiedKey, setCopiedKey] = React.useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = React.useState<string | null>(null);

  // Activate device form state
  const [showActivateModal, setShowActivateModal] = React.useState<boolean>(false);
  const [deviceIdentifier, setDeviceIdentifier] = React.useState<string>('');
  const [deviceName, setDeviceName] = React.useState<string>('');
  const [operatingSystem, setOperatingSystem] = React.useState<string>('Windows 11');
  const [activating, setActivating] = React.useState<boolean>(false);
  const [deactivatingId, setDeactivatingId] = React.useState<string | null>(null);

  // Active SDK tab
  const [activeCodeTab, setActiveCodeTab] = React.useState<'cli' | 'nodejs' | 'python' | 'curl'>('cli');

  const fetchLicenseData = React.useCallback(async () => {
    if (!licenseParam || !user) return;
    setLoading(true);
    try {
      let res;
      if (/^\d+$/.test(licenseParam)) {
        res = await getLicenseByIdApi(licenseParam);
      } else {
        res = await getLicenseByKeyApi(licenseParam);
      }

      if (res.success && res.data) {
        setLicense(res.data);
        // Also fetch devices
        setLoadingDevices(true);
        try {
          const devRes = await getLicenseDevicesApi(res.data.licenseKey);
          if (devRes.success && devRes.data) {
            setDevices(devRes.data);
          }
        } catch (e) {
          // Non-blocking device fetch error
        } finally {
          setLoadingDevices(false);
        }
      } else {
        setLicense(null);
      }
    } catch (err: any) {
      showToast(err.message || 'License not found or access denied', 'error');
      setLicense(null);
    } finally {
      setLoading(false);
    }
  }, [licenseParam, user, showToast]);

  React.useEffect(() => {
    fetchLicenseData();
  }, [fetchLicenseData]);

  const handleCopyKey = () => {
    if (!license) return;
    navigator.clipboard.writeText(license.licenseKey);
    setCopiedKey(true);
    showToast('License key copied to clipboard', 'info');
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleCopySnippet = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    showToast('Code snippet copied to clipboard', 'info');
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  const getMaskedKey = (key: string, isRevealed: boolean) => {
    if (isRevealed) return key;
    const parts = key.split('-');
    if (parts.length >= 5) {
      return `${parts[0]}-••••-••••-••••-${parts[4]}`;
    }
    return '••••-••••-••••-••••';
  };

  const handleActivateDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!license || !deviceIdentifier.trim()) return;
    setActivating(true);
    try {
      const res = await activateDeviceApi(license.licenseKey, {
        deviceIdentifier: deviceIdentifier.trim(),
        deviceName: deviceName.trim() || 'Workstation PC',
        operatingSystem,
      });
      if (res.success) {
        showToast('Device activated successfully', 'success');
        setDeviceIdentifier('');
        setDeviceName('');
        setShowActivateModal(false);
        await fetchLicenseData();
      }
    } catch (err: any) {
      showToast(err.message || 'Device activation failed', 'error');
    } finally {
      setActivating(false);
    }
  };

  const handleDeactivateDevice = async (deviceIdent: string) => {
    if (!license) return;
    setDeactivatingId(deviceIdent);
    try {
      const res = await deactivateDeviceApi(license.licenseKey, deviceIdent);
      if (res.success) {
        showToast('Device deactivated successfully. Seat released.', 'success');
        await fetchLicenseData();
      }
    } catch (err: any) {
      showToast(err.message || 'Device deactivation failed', 'error');
    } finally {
      setDeactivatingId(null);
    }
  };

  if (!user) {
    return (
      <div className="bg-[#f7f7f5] min-h-screen pb-16 pt-28 sm:pt-36 px-4">
        <div className="max-w-md mx-auto bg-white border-2 border-slate-300 rounded-[32px] p-8 text-center shadow-sm">
          <Key className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#0d0d0e] mb-2">Sign In Required</h1>
          <p className="text-xs text-slate-500 mb-6">Please sign in to inspect your software license.</p>
          <Link href="/login" className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider inline-block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
        <main className="max-w-5xl w-full mx-auto space-y-6">
          <div className="h-6 bg-slate-200 rounded-md w-48 animate-pulse" />
          <div className="h-48 bg-white border-2 border-slate-200 rounded-[32px] animate-pulse" />
          <div className="h-64 bg-white border-2 border-slate-200 rounded-[32px] animate-pulse" />
        </main>
      </div>
    );
  }

  if (!license) {
    return (
      <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
        <main className="max-w-2xl mx-auto text-center bg-white border-2 border-slate-300 rounded-[32px] p-12 shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#0d0d0e] mb-2">License Not Found</h1>
          <p className="text-xs text-slate-600 mb-6 font-medium">
            The license you requested either does not exist or does not belong to your authenticated account (IDOR protected).
          </p>
          <Link
            href="/licenses"
            className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to License Center
          </Link>
        </main>
      </div>
    );
  }

  const pctUsed = license.activationLimit > 0
    ? Math.min(100, Math.round((license.activationCount / license.activationLimit) * 100))
    : 0;

  const cliSnippet = `oho-cli activate --key ${license.licenseKey}`;
  const nodeSnippet = `import { OhoClient } from '@ohotech/sdk';

const client = new OhoClient({
  licenseKey: '${license.licenseKey}',
  deviceIdentifier: 'YOUR_DEVICE_UUID'
});

await client.verify();`;
  const pythonSnippet = `from ohotech import OhoClient

client = OhoClient(
    license_key="${license.licenseKey}",
    device_identifier="YOUR_DEVICE_UUID"
)
client.verify()`;
  const curlSnippet = `curl -X POST https://api.ohotech.com/api/licenses/${license.licenseKey}/activate \\
  -H "Content-Type: application/json" \\
  -d '{"deviceIdentifier": "YOUR_DEVICE_UUID", "deviceName": "Workstation"}'`;

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
      <main className="max-w-5xl w-full mx-auto" id="license-detail-main">
        <CustomerPortalNav />

        {/* Breadcrumb & Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <Link href="/dashboard" className="hover:text-slate-900">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/licenses" className="hover:text-slate-900">Licenses</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold truncate max-w-40 sm:max-w-none">
              {license.product?.name || license.licenseKey}
            </span>
          </div>

          <Link
            href="/licenses"
            className="text-xs font-mono font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Licenses
          </Link>
        </div>

        {/* Main License Hero Card */}
        <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm mb-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider">
                  {license.product?.name || 'Software License'}
                </span>
                <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold uppercase border ${
                  license.status === 'ACTIVE'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : license.status === 'EXPIRED'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {license.status}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0d0d0e]">
                {license.product?.name || 'OHO Software Engine'}
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Plan: <span className="text-slate-800 font-bold">{license.productPlan?.name || 'Standard Plan'}</span> | Perpetual ID #{license.id}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/downloads"
                className="px-4 py-2.5 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download App
              </Link>
              <button
                onClick={fetchLicenseData}
                className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                title="Refresh Status"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* License Key Interactive Banner */}
          <div className="py-6 border-b border-slate-100">
            <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              CRYPTOGRAPHIC LICENSE KEY
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-2xl p-3.5 flex items-center justify-between font-mono font-black text-lg sm:text-xl text-[#0d0d0e] tracking-wider">
                <span>{getMaskedKey(license.licenseKey, revealedKey)}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setRevealedKey(!revealedKey)}
                    className="p-2 rounded-xl hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    title={revealedKey ? 'Hide key' : 'Show key'}
                  >
                    {revealedKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleCopyKey}
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
                    title="Copy full key"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Device Allocation</span>
              <span className="text-base font-black text-[#0d0d0e]">
                {license.activationCount} / {license.activationLimit}
              </span>
              <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-1.5">
                <div className={`h-full ${pctUsed >= 100 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${pctUsed}%` }} />
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Issued Date</span>
              <span className="text-sm font-bold text-[#0d0d0e]">
                {license.issuedAt ? new Date(license.issuedAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Expiration</span>
              <span className="text-sm font-bold text-[#0d0d0e]">
                {license.expiresAt ? new Date(license.expiresAt).toLocaleDateString() : 'Lifetime Access'}
              </span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Subscription</span>
              <span className="text-sm font-bold text-emerald-600">
                {license.subscription ? 'Active Auto-Renew' : 'Perpetual Tier'}
              </span>
            </div>
          </div>

        </div>

        {/* Registered Devices Management Section */}
        <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-50 border border-sky-100 text-sky-700 font-mono text-[10px] font-bold uppercase mb-1">
                <Laptop className="w-3.5 h-3.5" />
                REGISTERED HARDWARE SEATS
              </div>
              <h2 className="text-xl font-black text-[#0d0d0e]">
                Device Activations ({license.activationCount} of {license.activationLimit})
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Hardware instances bound to this cryptographic license signature.
              </p>
            </div>

            <button
              onClick={() => setShowActivateModal(true)}
              disabled={license.activationCount >= license.activationLimit}
              className="py-2.5 px-4 rounded-full bg-[#0d0d0e] hover:bg-emerald-600 text-white font-mono font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <Plus className="w-3.5 h-3.5" />
              Bind New Device
            </button>
          </div>

          <div className="pt-4 space-y-3">
            {loadingDevices ? (
              <div className="text-center py-8 text-xs font-mono text-slate-400 animate-pulse">
                Loading device records...
              </div>
            ) : devices.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                <Laptop className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-medium">No devices registered for this license key yet.</p>
                <p className="text-[10px] text-slate-400 mt-1">Activate via CLI, Desktop client, or click 'Bind New Device' above.</p>
              </div>
            ) : (
              devices.map((dev) => (
                <div
                  key={dev.id}
                  className="p-4 rounded-2xl bg-[#fafafa] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[#0d0d0e] text-sm">
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
                        <span className="text-[10px] text-slate-400 font-bold">Deactivated</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Hardware UUID: <span className="text-slate-800 font-bold">{dev.deviceIdentifier}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-4 pt-0.5">
                      <span>Activated: {dev.activatedAt ? new Date(dev.activatedAt).toLocaleDateString() : 'Recent'}</span>
                      {dev.lastSeenAt && (
                        <span>Last Heartbeat: {new Date(dev.lastSeenAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  {dev.active && (
                    <button
                      onClick={() => handleDeactivateDevice(dev.deviceIdentifier)}
                      disabled={deactivatingId === dev.deviceIdentifier}
                      className="py-1.5 px-4 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
                    >
                      {deactivatingId === dev.deviceIdentifier ? 'Revoking...' : 'Deactivate Seat'}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Developer Integration & SDK Guides */}
        <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-50 border border-purple-100 text-purple-700 font-mono text-[10px] font-bold uppercase mb-1">
                <Code2 className="w-3.5 h-3.5" />
                DEVELOPER INTEGRATION QUICKSTART
              </div>
              <h2 className="text-xl font-black text-[#0d0d0e]">Activate via Code or Terminal</h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Integrate your license key into your continuous deployment or desktop client.
              </p>
            </div>

            <div className="flex items-center gap-1">
              {(['cli', 'nodejs', 'python', 'curl'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCodeTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-colors cursor-pointer ${
                    activeCodeTab === tab
                      ? 'bg-[#0d0d0e] text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <div className="relative bg-[#0d0d0e] text-slate-200 rounded-2xl p-4 font-mono text-xs overflow-x-auto">
              <button
                onClick={() => {
                  const snippet =
                    activeCodeTab === 'cli'
                      ? cliSnippet
                      : activeCodeTab === 'nodejs'
                      ? nodeSnippet
                      : activeCodeTab === 'python'
                      ? pythonSnippet
                      : curlSnippet;
                  handleCopySnippet(snippet, activeCodeTab);
                }}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy snippet"
              >
                {copiedSnippet === activeCodeTab ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              <pre className="pr-8">
                {activeCodeTab === 'cli' && cliSnippet}
                {activeCodeTab === 'nodejs' && nodeSnippet}
                {activeCodeTab === 'python' && pythonSnippet}
                {activeCodeTab === 'curl' && curlSnippet}
              </pre>
            </div>
          </div>
        </div>

      </main>

      {/* Manual Device Binding Modal */}
      {showActivateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-[#0d0d0e]">Bind New Device</h3>
              <button
                onClick={() => setShowActivateModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleActivateDevice} className="pt-4 space-y-3">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">
                  Device Hardware Identifier *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                  value={deviceIdentifier}
                  onChange={(e) => setDeviceIdentifier(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">
                  Device Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Workstation PC"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">
                  Operating System
                </label>
                <select
                  value={operatingSystem}
                  onChange={(e) => setOperatingSystem(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono bg-white"
                >
                  <option value="Windows 11">Windows 11</option>
                  <option value="macOS Sonoma">macOS Sonoma</option>
                  <option value="Ubuntu Linux 24.04">Ubuntu Linux</option>
                  <option value="iOS">iOS</option>
                  <option value="Android">Android</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowActivateModal(false)}
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
          </div>
        </div>
      )}

    </div>
  );
}
