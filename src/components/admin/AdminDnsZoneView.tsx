'use client';

import * as React from 'react';
import { 
  Globe, ShieldAlert, Zap, RefreshCw, Plus, CheckCircle2, 
  AlertTriangle, Lock, Server, X, Shield, ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { AdminModal, AdminButton, AdminInput } from './AdminUiPrimitives';

export interface DnsRecord {
  id: number;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT';
  name: string;
  content: string;
  ttl: string;
  proxied: boolean;
}

export function AdminDnsZoneView() {
  const { showToast } = useToast();
  const [underAttackMode, setUnderAttackMode] = React.useState(false);
  const [devMode, setDevMode] = React.useState(false);
  const [sslStrict, setSslStrict] = React.useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const [records, setRecords] = React.useState<DnsRecord[]>([
    { id: 1, type: 'A', name: 'ohotech.com', content: '104.21.58.112', ttl: 'Auto', proxied: true },
    { id: 2, type: 'A', name: 'api.ohotech.com', content: '172.67.142.89', ttl: 'Auto', proxied: true },
    { id: 3, type: 'CNAME', name: 'www.ohotech.com', content: 'ohotech.com', ttl: 'Auto', proxied: true },
    { id: 4, type: 'CNAME', name: 'admin.ohotech.com', content: 'cname.vercel-dns.com', ttl: 'Auto', proxied: true },
    { id: 5, type: 'MX', name: 'ohotech.com', content: 'aspmx.l.google.com (Pri: 1)', ttl: 'Auto', proxied: false },
    { id: 6, type: 'TXT', name: 'ohotech.com', content: 'v=spf1 include:_spf.google.com ~all', ttl: 'Auto', proxied: false },
  ]);

  const [newRecordForm, setNewRecordForm] = React.useState({
    type: 'A' as DnsRecord['type'],
    name: '',
    content: '',
    proxied: true,
  });

  const handleToggleProxy = (id: number) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextProxied = !r.proxied;
          showToast(`Record ${r.name} proxy status changed to ${nextProxied ? 'Proxied' : 'DNS Only'}`, 'info');
          return { ...r, proxied: nextProxied };
        }
        return r;
      })
    );
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecordForm.name || !newRecordForm.content) return;

    const created: DnsRecord = {
      id: Date.now(),
      type: newRecordForm.type,
      name: newRecordForm.name,
      content: newRecordForm.content,
      ttl: 'Auto',
      proxied: newRecordForm.proxied,
    };

    setRecords([...records, created]);
    setIsAddModalOpen(false);
    showToast(`DNS record ${created.name} (${created.type}) published to Cloudflare edge`, 'success');
  };

  const handleToggleAttackMode = () => {
    const next = !underAttackMode;
    setUnderAttackMode(next);
    showToast(
      next
        ? 'WARNING: Cloudflare Under Attack Mode ENABLED! Managed challenge triggered for all visitors.'
        : 'Under Attack Mode deactivated. Normal edge mitigation active.',
      next ? 'error' : 'success'
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-mono">
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
              CLOUDFLARE EDGE
            </span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Zone: ohotech.com (Active)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            DNS Zone, Edge Security &amp; WAF Management
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Configure global edge routing, enable instant DDoS protection, and manage root domain DNS records.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold font-mono text-xs transition-all shadow-lg shadow-orange-950/30 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add DNS Record</span>
        </button>
      </div>

      {/* Quick Infrastructure Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Under Attack Mode */}
        <div className={cn(
          "p-4 rounded-2xl border transition-all flex items-center justify-between",
          underAttackMode ? "bg-red-950/40 border-red-500/50" : "bg-[#141416] border-white/10"
        )}>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <ShieldAlert className={cn("w-4 h-4", underAttackMode ? "text-red-400 animate-pulse" : "text-slate-400")} />
              <p className="text-xs font-bold text-white uppercase">Under Attack Mode</p>
            </div>
            <p className="text-[10px] text-slate-400">Forces JS challenge on all incoming traffic</p>
          </div>
          <button
            onClick={handleToggleAttackMode}
            className={cn(
              "w-11 h-6 rounded-full transition-colors relative cursor-pointer",
              underAttackMode ? "bg-red-500" : "bg-white/20"
            )}
          >
            <span className={cn(
              "absolute top-1 w-4 h-4 rounded-full bg-black transition-transform",
              underAttackMode ? "right-1" : "left-1"
            )} />
          </button>
        </div>

        {/* Development Mode */}
        <div className="p-4 rounded-2xl bg-[#141416] border border-white/10 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Zap className={cn("w-4 h-4", devMode ? "text-amber-400" : "text-slate-400")} />
              <p className="text-xs font-bold text-white uppercase">Development Mode</p>
            </div>
            <p className="text-[10px] text-slate-400">Bypasses Cloudflare edge cache for 3 hours</p>
          </div>
          <button
            onClick={() => {
              setDevMode(!devMode);
              showToast(`Development Mode ${!devMode ? 'Enabled' : 'Disabled'}`, 'info');
            }}
            className={cn(
              "w-11 h-6 rounded-full transition-colors relative cursor-pointer",
              devMode ? "bg-amber-500" : "bg-white/20"
            )}
          >
            <span className={cn(
              "absolute top-1 w-4 h-4 rounded-full bg-black transition-transform",
              devMode ? "right-1" : "left-1"
            )} />
          </button>
        </div>

        {/* Strict SSL/TLS */}
        <div className="p-4 rounded-2xl bg-[#141416] border border-white/10 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <p className="text-xs font-bold text-white uppercase">Full SSL/TLS Strict</p>
            </div>
            <p className="text-[10px] text-slate-400">End-to-end HTTPS with origin cert</p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            ENFORCED
          </span>
        </div>
      </div>

      {/* DNS Records Table */}
      <div className="bg-[#141416] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-slate-300 flex items-center gap-2">
            <Globe className="w-4 h-4 text-orange-400" /> Cloudflare Edge DNS Records ({records.length})
          </span>
          <span className="text-[11px] text-slate-400">Global Propagation: ~300ms</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#19191d] text-slate-300 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Name / Subdomain</th>
                <th className="p-3.5">Target / Content IP</th>
                <th className="p-3.5">TTL</th>
                <th className="p-3.5">Proxy Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold text-white">
                      {rec.type}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-white">{rec.name}</td>
                  <td className="p-3.5 text-orange-400 truncate max-w-xs">{rec.content}</td>
                  <td className="p-3.5 text-slate-400">{rec.ttl}</td>
                  <td className="p-3.5">
                    <button
                      onClick={() => handleToggleProxy(rec.id)}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer",
                        rec.proxied
                          ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                          : "bg-white/5 text-slate-400 border border-white/10"
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full", rec.proxied ? "bg-orange-400" : "bg-slate-400")} />
                      <span>{rec.proxied ? 'Proxied' : 'DNS Only'}</span>
                    </button>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => {
                        setRecords(records.filter((r) => r.id !== rec.id));
                        showToast(`Deleted DNS record ${rec.name}`, 'info');
                      }}
                      className="px-2 py-1 rounded bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300 text-[10px] cursor-pointer transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add DNS Record Modal (with Spring Motion) */}
      <AdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Cloudflare DNS Record"
        subtitle="Route subdomains, edge endpoints, and mail servers"
        maxWidth="md"
      >
        <form onSubmit={handleCreateRecord} className="space-y-3.5 text-xs">
          <div className="space-y-1.5 w-full">
            <label className="block text-xs font-semibold text-slate-700">Record Type</label>
            <select
              value={newRecordForm.type}
              onChange={(e) => setNewRecordForm({ ...newRecordForm, type: e.target.value as any })}
              className="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:border-slate-900 cursor-pointer shadow-2xs"
            >
              <option value="A">A (IPv4 Address)</option>
              <option value="AAAA">AAAA (IPv6 Address)</option>
              <option value="CNAME">CNAME (Alias)</option>
              <option value="MX">MX (Mail Exchange)</option>
              <option value="TXT">TXT (Text Record)</option>
            </select>
          </div>

          <AdminInput
            label="Name / Subdomain"
            required
            placeholder="e.g. portal or @"
            value={newRecordForm.name}
            onChange={(e) => setNewRecordForm({ ...newRecordForm, name: e.target.value })}
          />

          <AdminInput
            label="Target / IPv4 Content"
            required
            placeholder="e.g. 104.21.58.112 or cname.vercel-dns.com"
            value={newRecordForm.content}
            onChange={(e) => setNewRecordForm({ ...newRecordForm, content: e.target.value })}
          />

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <p className="font-semibold text-slate-900 text-xs">Cloudflare Proxy</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Enables CDN caching, DDoS mitigation, and WAF</p>
            </div>
            <button
              type="button"
              onClick={() => setNewRecordForm({ ...newRecordForm, proxied: !newRecordForm.proxied })}
              className={cn(
                "w-11 h-6 rounded-full transition-colors relative cursor-pointer",
                newRecordForm.proxied ? "bg-orange-500" : "bg-slate-300"
              )}
            >
              <span className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-xs",
                newRecordForm.proxied ? "right-1" : "left-1"
              )} />
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <AdminButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </AdminButton>
            <AdminButton
              type="submit"
              variant="primary"
              size="sm"
            >
              Save Record
            </AdminButton>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
