'use client';

import * as React from 'react';
import Link from 'next/link';
import { Key, Laptop, Plus, X, Trash2, ShieldCheck, Sparkles, AlertCircle, Copy, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getMyLicensesApi, activateDeviceApi, deactivateDeviceApi, getLicenseDevicesApi } from '@/api/licenses';
import { License, DeviceActivation } from '@/api/types';

export default function LicensesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [licenses, setLicenses] = React.useState<License[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  // Device modal state
  const [selectedLicense, setSelectedLicense] = React.useState<License | null>(null);
  const [devices, setDevices] = React.useState<DeviceActivation[]>([]);
  const [loadingDevices, setLoadingDevices] = React.useState<boolean>(false);

  // Activate device form state
  const [showActivateForm, setShowActivateForm] = React.useState<boolean>(false);
  const [deviceIdentifier, setDeviceIdentifier] = React.useState<string>('');
  const [deviceName, setDeviceName] = React.useState<string>('');
  const [operatingSystem, setOperatingSystem] = React.useState<string>('Windows 11');

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

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    showToast('License key copied to clipboard', 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenDevices = async (license: License) => {
    setSelectedLicense(license);
    setLoadingDevices(true);
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
    if (!selectedLicense || !deviceIdentifier) return;
    try {
      const res = await activateDeviceApi(selectedLicense.licenseKey, {
        deviceIdentifier,
        deviceName: deviceName || 'Personal PC',
        operatingSystem,
      });
      if (res.success) {
        showToast('Device activated successfully', 'success');
        setDeviceIdentifier('');
        setDeviceName('');
        setShowActivateForm(false);
        handleOpenDevices(selectedLicense);
        fetchLicenses();
      }
    } catch (err: any) {
      showToast(err.message || 'Device activation failed', 'error');
    }
  };

  const handleDeactivateDevice = async (deviceIdent: string) => {
    if (!selectedLicense) return;
    try {
      const res = await deactivateDeviceApi(selectedLicense.licenseKey, deviceIdent);
      if (res.success) {
        showToast('Device deactivated successfully', 'success');
        handleOpenDevices(selectedLicense);
        fetchLicenses();
      }
    } catch (err: any) {
      showToast(err.message || 'Device deactivation failed', 'error');
    }
  };

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
      <main className="max-w-5xl w-full mx-auto" id="licenses-main">
        
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            CRYPTOGRAPHIC LICENSE KEYS
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d0d0e]">
            Software Licenses &amp; Device Activations
          </h1>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Manage your unique software keys (`OHO-XXXX-XXXX-XXXX-XXXX`) and device activation limits.
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
        ) : licenses.length === 0 ? (
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-12 text-center my-6 shadow-sm">
            <Key className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-[#0d0d0e] mb-2">No Active Licenses Found</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              You do not have any active software license keys. Purchase a product or start a free trial.
            </p>
            <Link href="/products" className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors inline-block">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {licenses.map((license) => (
              <div key={license.id} className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-400 uppercase">
                      {license.product?.name || 'Software Product'}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-lg font-black font-mono text-[#0d0d0e] tracking-wider">
                        {license.licenseKey}
                      </span>
                      <button
                        onClick={() => handleCopyKey(license.licenseKey)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                        title="Copy Key"
                      >
                        {copiedKey === license.licenseKey ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
                      license.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {license.status}
                    </span>

                    <button
                      onClick={() => handleOpenDevices(license)}
                      className="py-2 px-4 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-mono font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      Devices ({license.activationCount}/{license.activationLimit})
                    </button>
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-600">
                  <div>
                    <span className="font-bold text-slate-400 uppercase block text-[10px]">Issued Date</span>
                    {license.issuedAt ? new Date(license.issuedAt).toLocaleDateString() : 'N/A'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 uppercase block text-[10px]">Expiration</span>
                    {license.expiresAt ? new Date(license.expiresAt).toLocaleDateString() : 'Lifetime Access'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 uppercase block text-[10px]">Plan Type</span>
                    {license.productPlan?.name || 'Standard License'}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      {/* Devices Modal */}
      {selectedLicense && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-[#0d0d0e]">Registered Devices</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedLicense.licenseKey}</p>
              </div>
              <button onClick={() => setSelectedLicense(null)} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 max-h-60 overflow-y-auto">
              {loadingDevices ? (
                <div className="text-center py-4 text-xs font-mono text-slate-400">Loading devices...</div>
              ) : devices.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-400 font-medium">No devices registered for this license key yet.</div>
              ) : (
                devices.map((dev) => (
                  <div key={dev.id} className="p-3.5 rounded-2xl bg-[#fafafa] border border-slate-200 flex items-center justify-between text-xs font-mono">
                    <div>
                      <div className="font-bold text-[#0d0d0e]">{dev.deviceName || 'PC Device'} ({dev.operatingSystem})</div>
                      <div className="text-[10px] text-slate-500">ID: {dev.deviceIdentifier}</div>
                    </div>
                    {dev.active ? (
                      <button
                        onClick={() => handleDeactivateDevice(dev.deviceIdentifier)}
                        className="py-1 px-3 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] border border-rose-200 transition-colors"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold">Inactive</span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Activate New Device Form */}
            {showActivateForm ? (
              <form onSubmit={handleActivateDevice} className="pt-4 border-t border-slate-100 space-y-3">
                <div className="text-xs font-bold text-[#0d0d0e]">Register New Device</div>
                <input
                  type="text"
                  placeholder="Device Hardware Identifier (UUID/MAC)"
                  value={deviceIdentifier}
                  onChange={(e) => setDeviceIdentifier(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                />
                <input
                  type="text"
                  placeholder="Device Name (e.g. Workstation PC)"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowActivateForm(false)} className="px-4 py-2 rounded-full border border-slate-300 text-xs font-bold">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold">Confirm Activation</button>
                </div>
              </form>
            ) : (
              <div className="pt-4 border-t border-slate-100 text-right">
                <button
                  onClick={() => setShowActivateForm(true)}
                  disabled={selectedLicense.activationCount >= selectedLicense.activationLimit}
                  className="py-2.5 px-4 rounded-full bg-[#0d0d0e] hover:bg-emerald-600 text-white font-mono font-bold text-xs transition-colors flex items-center gap-1.5 ml-auto cursor-pointer disabled:opacity-40"
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
