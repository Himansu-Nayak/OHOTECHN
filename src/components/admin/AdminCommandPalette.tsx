'use client';

import * as React from 'react';
import { 
  Search, 
  LayoutDashboard, 
  BarChart3, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  Layers, 
  KeyRound, 
  Users, 
  UserCheck, 
  Headphones, 
  Inbox, 
  GitPullRequest, 
  MessageSquare, 
  DownloadCloud, 
  Building2, 
  Sparkles, 
  Settings, 
  ArrowRight, 
  Command, 
  RefreshCw, 
  X, 
  Clock, 
  Check,
  User,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminTabKey } from './AdminSidebar';
import { UserDto, Order } from '@/api/types';
import { getAdminCustomersApi } from '@/api/crm';
import { getAdminOrdersApi } from '@/api/orders';

interface AdminCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: AdminTabKey) => void;
  onRefreshStats?: () => void;
}

interface CommandItem {
  id: string;
  category: 'NAVIGATION' | 'CUSTOMERS' | 'ORDERS' | 'ACTIONS';
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  badge?: string;
  onSelect: () => void;
}

export function AdminCommandPalette({
  isOpen,
  onClose,
  onSelectTab,
  onRefreshStats,
}: AdminCommandPaletteProps) {
  const [query, setQuery] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [customerResults, setCustomerResults] = React.useState<UserDto[]>([]);
  const [orderResults, setOrderResults] = React.useState<Order[]>([]);
  const [isSearchingRemote, setIsSearchingRemote] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus input on open
  React.useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Static Navigation Items
  const navigationItems: CommandItem[] = React.useMemo(() => [
    {
      id: 'nav-overview',
      category: 'NAVIGATION',
      title: 'Executive Dashboard',
      subtitle: 'System telemetry, KPI charts & revenue counters',
      icon: LayoutDashboard,
      iconColor: 'text-indigo-600',
      onSelect: () => { onSelectTab('overview'); onClose(); }
    },
    {
      id: 'nav-analytics',
      category: 'NAVIGATION',
      title: 'Business Analytics',
      subtitle: 'Cohort analysis, customer velocity & GMV trends',
      icon: BarChart3,
      iconColor: 'text-sky-600',
      onSelect: () => { onSelectTab('analytics'); onClose(); }
    },
    {
      id: 'nav-products',
      category: 'NAVIGATION',
      title: 'Products & Solutions',
      subtitle: 'Catalog configuration, pricing plans & SKUs',
      icon: Package,
      iconColor: 'text-emerald-600',
      onSelect: () => { onSelectTab('products'); onClose(); }
    },
    {
      id: 'nav-orders',
      category: 'NAVIGATION',
      title: 'Orders & Transactions',
      subtitle: 'Procurement records, invoices & payment logs',
      icon: ShoppingCart,
      iconColor: 'text-amber-600',
      onSelect: () => { onSelectTab('orders'); onClose(); }
    },
    {
      id: 'nav-payments',
      category: 'NAVIGATION',
      title: 'Payments Ledger',
      subtitle: 'Razorpay, Cashfree & UPI transaction reconciliation',
      icon: CreditCard,
      iconColor: 'text-violet-600',
      onSelect: () => { onSelectTab('payments'); onClose(); }
    },
    {
      id: 'nav-subscriptions',
      category: 'NAVIGATION',
      title: 'Recurring Subscriptions',
      subtitle: 'Active SaaS licenses, billing periods & renewals',
      icon: Layers,
      iconColor: 'text-purple-600',
      onSelect: () => { onSelectTab('subscriptions'); onClose(); }
    },
    {
      id: 'nav-licenses',
      category: 'NAVIGATION',
      title: 'Software License Keys',
      subtitle: 'Cryptographic activation keys, hardware locks & domains',
      icon: KeyRound,
      iconColor: 'text-orange-600',
      onSelect: () => { onSelectTab('licenses'); onClose(); }
    },
    {
      id: 'nav-customers',
      category: 'NAVIGATION',
      title: 'Customer Directory',
      subtitle: 'Registered accounts, authentication & 360° profiles',
      icon: Users,
      iconColor: 'text-blue-600',
      onSelect: () => { onSelectTab('customers'); onClose(); }
    },
    {
      id: 'nav-support',
      category: 'NAVIGATION',
      title: 'Support & AI Help Desk',
      subtitle: 'Client queries, Gemini automated triage & resolution',
      icon: Headphones,
      iconColor: 'text-rose-600',
      badge: 'AI Powered',
      onSelect: () => { onSelectTab('support'); onClose(); }
    },
    {
      id: 'nav-leads',
      category: 'NAVIGATION',
      title: 'Leads & Enquiries',
      subtitle: 'Commercial prospect tracking & follow-up queue',
      icon: Inbox,
      iconColor: 'text-teal-600',
      onSelect: () => { onSelectTab('leads'); onClose(); }
    },
    {
      id: 'nav-crm',
      category: 'NAVIGATION',
      title: 'Sales Pipeline (Kanban)',
      subtitle: 'Deal stages, enterprise quotes & conversions',
      icon: GitPullRequest,
      iconColor: 'text-pink-600',
      onSelect: () => { onSelectTab('crm'); onClose(); }
    },
    {
      id: 'nav-quotes',
      category: 'NAVIGATION',
      title: 'Commercial Quotes',
      subtitle: 'Custom scope quotes & pricing approvals',
      icon: MessageSquare,
      iconColor: 'text-cyan-600',
      onSelect: () => { onSelectTab('quotes'); onClose(); }
    },
    {
      id: 'nav-releases',
      category: 'NAVIGATION',
      title: 'Software Releases',
      subtitle: 'Artifact distribution, SHA-256 checksums & downloads',
      icon: DownloadCloud,
      iconColor: 'text-indigo-600',
      onSelect: () => { onSelectTab('releases'); onClose(); }
    },
    {
      id: 'nav-gateways',
      category: 'NAVIGATION',
      title: 'Payment Gateways',
      subtitle: 'Razorpay, Cashfree & manual payout settings',
      icon: Building2,
      iconColor: 'text-slate-600',
      onSelect: () => { onSelectTab('gateways'); onClose(); }
    },
    {
      id: 'nav-ai',
      category: 'NAVIGATION',
      title: 'AI Operations & Models',
      subtitle: 'Gemini reasoning configurations & triage logs',
      icon: Sparkles,
      iconColor: 'text-amber-500',
      badge: 'Gemini',
      onSelect: () => { onSelectTab('ai'); onClose(); }
    },
    {
      id: 'nav-settings',
      category: 'NAVIGATION',
      title: 'Platform Architecture & Settings',
      subtitle: 'System environment, database pooling & security rules',
      icon: Settings,
      iconColor: 'text-slate-700',
      onSelect: () => { onSelectTab('settings'); onClose(); }
    },
  ], [onSelectTab, onClose]);

  // Action Items
  const actionItems: CommandItem[] = React.useMemo(() => [
    {
      id: 'act-refresh',
      category: 'ACTIONS',
      title: 'Synchronize Metrics & Statistics',
      subtitle: 'Force refresh all PostgreSQL counters and revenue numbers',
      icon: RefreshCw,
      iconColor: 'text-emerald-600',
      onSelect: () => {
        if (onRefreshStats) onRefreshStats();
        onClose();
      }
    },
  ], [onRefreshStats, onClose]);

  // Remote Search for Customers and Orders when query has >= 2 characters
  React.useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setCustomerResults([]);
      setOrderResults([]);
      setIsSearchingRemote(false);
      return;
    }

    let isMounted = true;
    setIsSearchingRemote(true);

    const timer = setTimeout(async () => {
      try {
        const [custRes, ordRes] = await Promise.all([
          getAdminCustomersApi(query.trim(), 0, 5).catch(() => ({ success: false, data: undefined })),
          getAdminOrdersApi().catch(() => ({ success: false, data: undefined })),
        ]);

        if (isMounted) {
          if (custRes.success && custRes.data?.content) {
            setCustomerResults(custRes.data.content);
          } else {
            setCustomerResults([]);
          }

          if (ordRes.success && ordRes.data) {
            const q = query.trim().toLowerCase();
            const matchedOrders = ordRes.data
              .filter(o => 
                String(o.id).includes(q) || 
                (o.user?.name && o.user.name.toLowerCase().includes(q)) ||
                (o.user?.email && o.user.email.toLowerCase().includes(q)) ||
                (o.status && o.status.toLowerCase().includes(q))
              )
              .slice(0, 4);
            setOrderResults(matchedOrders);
          } else {
            setOrderResults([]);
          }
        }
      } catch (err) {
        console.warn('Command palette remote search error:', err);
      } finally {
        if (isMounted) setIsSearchingRemote(false);
      }
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query]);

  // Build combined items list
  const combinedItems: CommandItem[] = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    
    // Filter Navigation items
    const filteredNav = navigationItems.filter(item => 
      !q || 
      item.title.toLowerCase().includes(q) || 
      (item.subtitle && item.subtitle.toLowerCase().includes(q))
    );

    // Customer Items
    const dynamicCustomerItems: CommandItem[] = customerResults.map(c => ({
      id: `cust-${c.id}`,
      category: 'CUSTOMERS',
      title: c.name || `User #${c.id}`,
      subtitle: `${c.email || 'No email'} · Role: ${c.role || 'CUSTOMER'}`,
      icon: User,
      iconColor: 'text-blue-600',
      badge: 'Account',
      onSelect: () => {
        onSelectTab('customers');
        onClose();
      }
    }));

    // Order Items
    const dynamicOrderItems: CommandItem[] = orderResults.map(o => ({
      id: `ord-${o.id}`,
      category: 'ORDERS',
      title: `Order #${o.id} — ₹${o.totalAmount || 0}`,
      subtitle: `Status: ${o.status || 'PENDING'} · ${o.user?.name || o.user?.email || 'Guest'}`,
      icon: ShoppingCart,
      iconColor: 'text-amber-600',
      badge: o.status || 'ORDER',
      onSelect: () => {
        onSelectTab('orders');
        onClose();
      }
    }));

    // Filter Actions
    const filteredActions = actionItems.filter(item =>
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q))
    );

    return [
      ...dynamicCustomerItems,
      ...dynamicOrderItems,
      ...filteredNav,
      ...filteredActions,
    ];
  }, [query, navigationItems, customerResults, orderResults, actionItems, onSelectTab, onClose]);

  // Adjust selected index bounds
  React.useEffect(() => {
    if (selectedIndex >= combinedItems.length) {
      setSelectedIndex(Math.max(0, combinedItems.length - 1));
    }
  }, [combinedItems.length, selectedIndex]);

  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (combinedItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (combinedItems.length || 1)) % (combinedItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (combinedItems[selectedIndex]) {
          combinedItems[selectedIndex].onSelect();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, combinedItems, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-[24px] border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col max-h-[75vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input Bar */}
        <div className="relative flex items-center px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, customer name, order ID, or jump to a tab..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {isSearchingRemote && (
            <RefreshCw className="w-4 h-4 text-slate-400 animate-spin mr-2" />
          )}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg mr-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded-md shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-transparent scrollbar-thin">
          {combinedItems.length === 0 ? (
            <div className="py-12 text-center">
              <Command className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No matching commands or records found</p>
              <p className="text-xs text-slate-400 mt-1">Try typing &apos;orders&apos;, &apos;support&apos;, or a customer&apos;s email.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {combinedItems.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={item.onSelect}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer',
                      isSelected 
                        ? 'bg-indigo-50/80 text-indigo-950 border border-indigo-200/60 shadow-xs' 
                        : 'text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                        isSelected ? 'bg-white shadow-xs' : 'bg-slate-100'
                      )}>
                        <Icon className={cn('w-4 h-4', item.iconColor || 'text-slate-600')} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900 truncate">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className={cn(
                              'text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider',
                              item.badge === 'Gemini' || item.badge === 'AI Powered'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200/80 text-slate-700'
                            )}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      {isSelected && (
                        <span className="text-[10px] font-medium text-indigo-600 flex items-center gap-1">
                          Jump <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-2.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-mono shadow-2xs">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-mono shadow-2xs">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-mono shadow-2xs">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <span className="font-medium text-slate-400">
            OHO Command · V15
          </span>
        </div>
      </div>
    </div>
  );
}
