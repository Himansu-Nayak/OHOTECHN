'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Search, Bell, Terminal, Shield, LogOut, CheckCircle2, 
  AlertCircle, ChevronDown, ExternalLink, Zap, Clock, User,
  PanelLeftClose, Maximize2, Minimize2, SlidersHorizontal, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserDto } from '@/api/types';

interface AdminHeaderProps {
  user: UserDto | null;
  onLogout: () => void;
  onOpenSearch?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTab: string;
  onSelectTab: (tab: any) => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  workspaceLayout?: 'contained' | 'fluid';
  onToggleLayout?: () => void;
  contentDensity?: 'normal' | 'compact';
  onToggleDensity?: () => void;
}

export function AdminHeader({
  user,
  onLogout,
  onOpenSearch,
  searchQuery,
  onSearchChange,
  activeTab,
  onSelectTab,
  isSidebarCollapsed = false,
  onToggleSidebar,
  workspaceLayout = 'fluid',
  onToggleLayout,
  contentDensity = 'normal',
  onToggleDensity,
}: AdminHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);

  const notifications = [
    { id: 1, title: 'New Enterprise Order #104', time: '5m ago', type: 'order', unread: true },
    { id: 2, title: 'Lead converted: Dr. Rajesh (HMS)', time: '18m ago', type: 'crm', unread: true },
    { id: 3, title: 'Google Meet booked for 3:30 PM', time: '1h ago', type: 'meet', unread: false },
    { id: 4, title: 'Gemini RAG catalog embeddings synced', time: '2h ago', type: 'ai', unread: false },
  ];

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'overview': return 'Executive Dashboard';
      case 'analytics': return 'Site Traffic & Analytics';
      case 'crm': return 'Leads & Pipeline CRM';
      case 'appointments': return 'Appointments Calendar';
      case 'whatsapp': return 'WhatsApp Automation';
      case 'tickets': return 'Support Desk / SLA';
      case 'orders': return 'Orders & Invoicing';
      case 'products': return 'Products & Inventory';
      case 'quotes': return 'Demo & Custom Quotes';
      case 'plans': return 'Subscription Plans';
      case 'licenses': return 'License Key Vault';
      case 'releases': return 'Software Releases';
      case 'gateways': return 'Payment Gateways';
      case 'dns': return 'DNS Zone & Cloudflare';
      case 'users': return 'User Directory & RBAC';
      case 'ai': return 'Gemini AI Platform';
      default: return tab;
    }
  };

  return (
    <header className="sticky top-16 lg:top-[72px] z-30 w-full bg-[#0b0c0e]/95 backdrop-blur-xl border-b border-white/10 shadow-xl">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-purple-500/10 border-b border-white/5 px-4 lg:px-6 py-1 text-[10px] font-mono text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-emerald-400 font-bold uppercase tracking-wider">NODE ONLINE:</span>
          <span className="text-slate-400">PostgreSQL 17 · Spring Boot 4.0 · Latency: 14ms · Direct Password Auth Active</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 shrink-0 text-slate-400">
          <span>Cluster: <strong className="text-white font-mono">PRIMARY-PROD</strong></span>
          <span>•</span>
          <span>Security: <strong className="text-emerald-400 font-mono">ROLE_ADMIN</strong></span>
        </div>
      </div>

      {/* Main command row */}
      <div className="px-4 lg:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Sidebar Toggle + Breadcrumb */}
        <div className="flex items-center gap-3 shrink-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              title={isSidebarCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)"}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 group"
            >
              <PanelLeftClose className={cn(
                "w-4 h-4 transition-transform", 
                isSidebarCollapsed && "rotate-180 text-emerald-400"
              )} />
              <span className="hidden md:inline text-[11px] font-mono text-slate-300 group-hover:text-white">
                {isSidebarCollapsed ? 'Expand' : 'Collapse'}
              </span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">Admin</span>
            <span className="text-slate-600">/</span>
            <span className="text-emerald-400 font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px]">
              {getTabLabel(activeTab)}
            </span>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-lg hidden sm:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Orders, Leads, Tickets, Users, Catalog... [Ctrl + K]"
              className="w-full pl-9 pr-16 py-1.5 bg-[#141518] hover:bg-[#18191e] focus:bg-[#1a1b22] border border-white/10 focus:border-emerald-500/50 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none transition-all font-mono"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right side controls: Adjustable Toggles + Dev Switcher + Notifications + Profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Adjustable Layout Width Toggle */}
          {onToggleLayout && (
            <button
              onClick={onToggleLayout}
              title={`Switch to ${workspaceLayout === 'fluid' ? 'Contained' : 'Fluid Full-Width'} Workspace`}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            >
              {workspaceLayout === 'fluid' ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden xl:inline text-[11px] text-slate-400">Fluid</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden xl:inline text-[11px] text-emerald-300">Contained</span>
                </>
              )}
            </button>
          )}

          {/* Density Toggle */}
          {onToggleDensity && (
            <button
              onClick={onToggleDensity}
              title={`Switch Density (${contentDensity === 'compact' ? 'Compact' : 'Comfortable'})`}
              className="hidden lg:flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer text-xs font-mono"
            >
              <SlidersHorizontal className={cn("w-3.5 h-3.5", contentDensity === 'compact' ? "text-amber-400" : "text-slate-400")} />
              <span className="hidden xl:inline text-[11px] text-slate-400 capitalize">{contentDensity}</span>
            </button>
          )}

          {/* Role Switcher to Developer Studio */}
          <Link
            href="/developer"
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/30 text-xs font-mono text-purple-200 transition-all group"
            title="Switch to Developer Control Studio"
          >
            <Terminal className="w-3.5 h-3.5 text-purple-400 group-hover:rotate-6 transition-transform" />
            <span className="text-[11px]">Developer Studio</span>
            <ExternalLink className="w-3 h-3 text-purple-400 ml-0.5" />
          </Link>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
            </button>

            {notificationsOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#141416] border border-white/15 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setNotificationsOpen(false)}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 px-2">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-indigo-400" /> Notifications &amp; Alerts
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                    2 unread
                  </span>
                </div>
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "p-2.5 rounded-xl border text-xs transition-colors cursor-pointer flex items-start gap-2.5",
                        n.unread 
                          ? "bg-white/5 border-indigo-500/30 text-white" 
                          : "bg-transparent border-white/5 text-slate-400 hover:bg-white/5"
                      )}
                    >
                      <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{n.title}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 mt-2 border-t border-white/10 text-center">
                  <button 
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[11px] font-mono text-slate-400 hover:text-white transition-colors"
                  >
                    Close Notification Center
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Quick Actions */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold font-mono">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden xl:block">
                <p className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[10px] font-mono text-emerald-400">
                  {user?.role || 'ROLE_ADMIN'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-[#141416] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setProfileOpen(false)}
              >
                <div className="p-2 border-b border-white/10 mb-1">
                  <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
                  <p className="text-[10px] font-mono text-slate-400 truncate">{user?.email || 'admin@ohotech.com'}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {user?.role || 'ROLE_ADMIN'}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <Link
                    href="/developer"
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Terminal className="w-3.5 h-3.5 text-purple-400" /> Developer Studio
                  </Link>
                  <button
                    onClick={() => {
                      onSelectTab('ai');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Gemini AI Engine
                  </button>
                  <div className="h-px bg-white/10 my-1" />
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" /> End Admin Session
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
