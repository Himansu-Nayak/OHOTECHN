'use client';

import * as React from 'react';
import { 
  LayoutDashboard, BarChart3, Users2, Calendar, MessageSquare, 
  Headphones, ShoppingCart, Package, FileQuestion, Layers, KeyRound, 
  DownloadCloud, CreditCard, Globe, Users, Sparkles, ChevronRight, 
  ChevronDown, Search, Menu, X, ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type AdminTabKey = 
  | 'overview' 
  | 'analytics' 
  | 'crm' 
  | 'appointments' 
  | 'whatsapp' 
  | 'tickets' 
  | 'orders' 
  | 'products' 
  | 'quotes' 
  | 'plans' 
  | 'licenses' 
  | 'releases' 
  | 'gateways' 
  | 'dns' 
  | 'users' 
  | 'ai';

interface AdminSidebarProps {
  activeTab: AdminTabKey;
  onSelectTab: (tab: AdminTabKey) => void;
  badgeCounts?: {
    orders?: number;
    crm?: number;
    tickets?: number;
    appointments?: number;
    quotes?: number;
  };
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface SidebarGroup {
  label: string;
  items: {
    key: AdminTabKey;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    isAi?: boolean;
  }[];
}

export function AdminSidebar({
  activeTab,
  onSelectTab,
  badgeCounts = {},
  isMobileOpen,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}: AdminSidebarProps) {
  const [filterText, setFilterText] = React.useState('');
  const [collapsedGroups, setCollapsedGroups] = React.useState<Record<string, boolean>>({});

  const toggleGroup = (groupLabel: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupLabel]: !prev[groupLabel] }));
  };

  const groups: SidebarGroup[] = [
    {
      label: 'CORE SUITE',
      items: [
        { key: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard },
        { key: 'analytics', label: 'Site Traffic & Analytics', icon: BarChart3 },
      ],
    },
    {
      label: 'CRM & PIPELINE',
      items: [
        { key: 'crm', label: 'Leads & Contacts', icon: Users2, badge: badgeCounts.crm || 12 },
        { key: 'appointments', label: 'Appointments Calendar', icon: Calendar, badge: badgeCounts.appointments || 4 },
      ],
    },
    {
      label: 'COMMUNICATION & DESK',
      items: [
        { key: 'whatsapp', label: 'WhatsApp Automation', icon: MessageSquare, badge: 'Live' },
        { key: 'tickets', label: 'Support Desk / SLA', icon: Headphones, badge: badgeCounts.tickets || 6 },
      ],
    },
    {
      label: 'E-COMMERCE ENGINE',
      items: [
        { key: 'orders', label: 'Orders & Invoicing', icon: ShoppingCart, badge: badgeCounts.orders || 14 },
        { key: 'quotes', label: 'Demo & Custom Quotes', icon: FileQuestion, badge: badgeCounts.quotes || 8 },
        { key: 'products', label: 'Products & Inventory', icon: Package },
        { key: 'plans', label: 'Subscription Plans', icon: Layers },
        { key: 'licenses', label: 'License Key Vault', icon: KeyRound },
        { key: 'releases', label: 'Software Releases', icon: DownloadCloud },
      ],
    },
    {
      label: 'GATEWAYS & INFRA',
      items: [
        { key: 'gateways', label: 'Payment Gateways', icon: CreditCard },
        { key: 'dns', label: 'DNS Zone & Cloudflare', icon: Globe },
        { key: 'users', label: 'User Directory & RBAC', icon: Users },
        { key: 'ai', label: 'Gemini AI Intelligence', icon: Sparkles, isAi: true },
      ],
    },
  ];

  // Filter groups according to quick search input
  const filteredGroups = groups.map((g) => ({
    ...g,
    items: g.items.filter((item) =>
      item.label.toLowerCase().includes(filterText.toLowerCase())
    ),
  })).filter((g) => g.items.length > 0);

  // Desktop Rail View (Collapsed Mode)
  const collapsedContent = (
    <div className="flex flex-col h-full bg-[#0e0f12] border-r border-white/10 w-16 lg:w-20 select-none items-center py-3 justify-between transition-all duration-300">
      {/* Top action: Expand button */}
      <div className="w-full flex flex-col items-center gap-3">
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title="Expand Sidebar (Ctrl+B)"
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer group"
          >
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
        <div className="w-8 h-px bg-white/10" />
      </div>

      {/* Center icons list */}
      <div className="flex-1 w-full overflow-y-auto py-2 space-y-1.5 scrollbar-none flex flex-col items-center">
        {groups.flatMap((g) => g.items).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <div key={item.key} className="relative group flex justify-center w-full">
              <button
                onClick={() => onSelectTab(item.key)}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative",
                  isActive
                    ? item.isAi
                      ? "bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-lg shadow-purple-950/50"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-950/40"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive && (item.isAi ? "text-purple-400" : "text-emerald-400"))} />
                {item.badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>

              {/* Floating Tooltip */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-2 px-3 py-1.5 bg-[#18191e] border border-white/15 rounded-xl shadow-2xl z-50 pointer-events-none whitespace-nowrap animate-in fade-in duration-150">
                <span className="text-xs font-mono font-medium text-white">{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom telemetry dot */}
      <div className="w-full flex flex-col items-center gap-2 pt-2 border-t border-white/10">
        <div className="w-3 h-3 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40" title="Edge & WAF Synced">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>
    </div>
  );

  // Desktop Expanded View / Mobile Drawer View
  const expandedContent = (
    <div className="flex flex-col h-full bg-[#0e0f12] border-r border-white/10 w-64 lg:w-72 select-none transition-all duration-300">
      {/* Top Header Row with Collapse toggle */}
      <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
          Module Directory
        </span>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title="Collapse Sidebar (Ctrl+B)"
            className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[10px] font-mono border border-white/10 cursor-pointer"
          >
            <span>Collapse</span>
            <ChevronRight className="w-3 h-3 rotate-180" />
          </button>
        )}
      </div>

      {/* Search within menu */}
      <div className="p-3 border-b border-white/10">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter modules..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#15161a] border border-white/10 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
          />
          {filterText && (
            <button 
              onClick={() => setFilterText('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        {filteredGroups.map((group) => {
          const isCollapsedGroup = collapsedGroups[group.label];
          return (
            <div key={group.label} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-mono font-bold text-slate-400 hover:text-slate-200 tracking-wider uppercase cursor-pointer"
              >
                <span>{group.label}</span>
                {isCollapsedGroup ? (
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                )}
              </button>

              {!isCollapsedGroup && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => {
                          onSelectTab(item.key);
                          onCloseMobile();
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer group",
                          isActive
                            ? item.isAi 
                              ? "bg-gradient-to-r from-purple-900/60 to-indigo-900/60 text-purple-200 border border-purple-500/40 shadow-lg shadow-purple-950/40"
                              : "bg-gradient-to-r from-emerald-950/60 to-indigo-950/60 text-white border border-emerald-500/30 shadow-lg shadow-emerald-950/30"
                            : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={cn(
                            "w-4 h-4 transition-transform group-hover:scale-110",
                            isActive 
                              ? (item.isAi ? "text-purple-400" : "text-emerald-400") 
                              : "text-slate-400 group-hover:text-slate-200"
                          )} />
                          <span>{item.label}</span>
                        </div>

                        {item.badge !== undefined && (
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-tight",
                            isActive
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "bg-white/10 text-slate-400 group-hover:text-slate-200"
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cloudflare Edge status footer */}
      <div className="p-3 border-t border-white/10 bg-[#0a0b0d]">
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-indigo-950/40 border border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <p className="text-[10px] font-mono font-bold text-white uppercase">Cloudflare Edge</p>
              <p className="text-[9px] font-mono text-emerald-400">DNS &amp; WAF Synced</p>
            </div>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            ACTIVE
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (Adjustable Collapsed or Expanded) */}
      <aside className="hidden lg:block shrink-0 sticky top-[132px] h-[calc(100vh-140px)] z-20 transition-all duration-300">
        {isCollapsed ? collapsedContent : expandedContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 max-w-xs w-full z-10 animate-in slide-in-from-left duration-200">
            <div className="absolute top-2 right-2 z-20">
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg bg-white/10 text-slate-300 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {expandedContent}
          </div>
        </div>
      )}
    </>
  );
}
