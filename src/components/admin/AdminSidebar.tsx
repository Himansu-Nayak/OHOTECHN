'use client';

import * as React from 'react';
import { 
  LayoutDashboard, BarChart3, Package, ShoppingCart, CreditCard, 
  Layers, KeyRound, Users, UserCheck, Inbox, GitPullRequest, 
  DownloadCloud, Bell, Sparkles, Shield, UserCog, Settings,
  ChevronRight, ChevronDown, Search, X, PanelLeftClose, PanelLeftOpen,
  Building2, MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { transitions, backdropVariants } from '@/lib/motion-constants';

export type AdminTabKey = 
  | 'overview' 
  | 'analytics' 
  | 'products' 
  | 'orders' 
  | 'payments' 
  | 'subscriptions' 
  | 'licenses' 
  | 'customers' 
  | 'customer-360' 
  | 'leads' 
  | 'crm' 
  | 'quotes'
  | 'releases' 
  | 'gateways'
  | 'notifications' 
  | 'ai' 
  | 'audit-logs' 
  | 'admin-users' 
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTabKey;
  onSelectTab: (tab: AdminTabKey) => void;
  badgeCounts?: {
    orders?: number;
    leads?: number;
    quotes?: number;
    products?: number;
    customers?: number;
    notifications?: number;
  };
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface SidebarItem {
  key: AdminTabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

interface SidebarGroup {
  label: string;
  items: SidebarItem[];
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
  const [searchFilter, setSearchFilter] = React.useState('');
  const [collapsedGroups, setCollapsedGroups] = React.useState<Record<string, boolean>>({});
  const shouldReduceMotion = useReducedMotion();

  const toggleGroup = (groupLabel: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupLabel]: !prev[groupLabel] }));
  };

  const groups: SidebarGroup[] = [
    {
      label: 'OVERVIEW',
      items: [
        { key: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { key: 'analytics', label: 'Business Analytics', icon: BarChart3 },
      ],
    },
    {
      label: 'COMMERCE',
      items: [
        { key: 'products', label: 'Products', icon: Package, badge: badgeCounts.products },
        { key: 'orders', label: 'Orders', icon: ShoppingCart, badge: badgeCounts.orders },
        { key: 'payments', label: 'Payments', icon: CreditCard },
        { key: 'subscriptions', label: 'Subscriptions', icon: Layers },
        { key: 'licenses', label: 'License Keys', icon: KeyRound },
      ],
    },
    {
      label: 'CUSTOMERS',
      items: [
        { key: 'customers', label: 'Customer Directory', icon: Users, badge: badgeCounts.customers },
        { key: 'customer-360', label: 'Customer 360 View', icon: UserCheck },
      ],
    },
    {
      label: 'CRM',
      items: [
        { key: 'leads', label: 'Leads & Enquiries', icon: Inbox, badge: badgeCounts.leads },
        { key: 'crm', label: 'Sales Pipeline', icon: GitPullRequest },
        { key: 'quotes', label: 'Commercial Quotes', icon: MessageSquare, badge: badgeCounts.quotes },
      ],
    },
    {
      label: 'OPERATIONS',
      items: [
        { key: 'releases', label: 'Software Releases', icon: DownloadCloud },
        { key: 'gateways', label: 'Payment Gateways', icon: Building2 },
        { key: 'ai', label: 'AI Operations', icon: Sparkles },
      ],
    },
    {
      label: 'SYSTEM',
      items: [
        { key: 'settings', label: 'Architecture & Settings', icon: Settings },
      ],
    },
  ];

  // Filter groups if search is active
  const filteredGroups = React.useMemo(() => {
    if (!searchFilter.trim()) return groups;
    const q = searchFilter.toLowerCase();
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((item) => item.label.toLowerCase().includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  }, [searchFilter, groups]);

  const renderNavList = (collapsed: boolean) => (
    <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">
      {filteredGroups.map((group) => {
        const isGroupCollapsed = collapsedGroups[group.label] && !searchFilter;

        return (
          <div key={group.label} className="space-y-1">
            {!collapsed && (
              <button
                type="button"
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors cursor-pointer"
              >
                <span>{group.label}</span>
                {isGroupCollapsed ? (
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                )}
              </button>
            )}

            {!isGroupCollapsed && (
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeTab === item.key;
                  const Icon = item.icon;

                  return (
                    <li key={item.key}>
                      <motion.button
                        type="button"
                        whileTap={!shouldReduceMotion ? { scale: 0.98 } : undefined}
                        onClick={() => {
                          onSelectTab(item.key);
                          onCloseMobile();
                        }}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors duration-150 cursor-pointer select-none text-left',
                          isActive
                            ? 'bg-slate-900 text-white font-semibold shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        )}
                      >
                        <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-white' : 'text-slate-400')} />
                        
                        {!collapsed && (
                          <span className="truncate flex-1">{item.label}</span>
                        )}

                        {!collapsed && item.badge !== undefined && Number(item.badge) > 0 && (
                          <span
                            className={cn(
                              'text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0',
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-200 text-slate-700'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </motion.button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-white border-r border-slate-200/90 transition-all duration-300 select-none z-20 shrink-0 sticky top-[65px] h-[calc(100vh-65px)]',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Search Filter Header */}
        {!isCollapsed && (
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter navigation..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Nav List */}
        {renderNavList(isCollapsed)}

        {/* Footer: Collapse Toggle */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-slate-500 font-medium">PostgreSQL Ready</span>
            </div>
          ) : null}

          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors mx-auto lg:mx-0 cursor-pointer"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Drawer (with Motion Slide & Fade) */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={onCloseMobile}
            />
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { x: '-100%' }}
              animate={shouldReduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { x: '-100%' }}
              transition={transitions.micro}
              className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl flex flex-col z-10 border-r border-slate-200"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    OH
                  </div>
                  <span className="font-bold text-sm text-slate-900 tracking-tight">OHO TECH Admin</span>
                </div>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 border-b border-slate-100">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter navigation..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-8 pr-7 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              {renderNavList(false)}

              <div className="p-4 border-t border-slate-100 text-xs text-slate-400 bg-slate-50/50">
                OHO TECH Operational Platform v4.1
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
