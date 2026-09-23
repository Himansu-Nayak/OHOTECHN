'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Search, Bell, Shield, LogOut, ChevronDown, User, 
  ExternalLink, Check, AlertCircle, Clock, X, Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserDto, NotificationDto } from '@/api/types';
import { getNotificationsApi } from '@/api/notifications';
import { AdminBadge, StatusBadge } from './AdminUiPrimitives';

interface AdminHeaderProps {
  user: UserDto | null;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTab: string;
  onSelectTab: (tab: any) => void;
  onOpenMobileSidebar?: () => void;
}

export function AdminHeader({
  user,
  onLogout,
  searchQuery,
  onSearchChange,
  activeTab,
  onSelectTab,
  onOpenMobileSidebar,
}: AdminHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<NotificationDto[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = React.useState(false);

  const popoverRef = React.useRef<HTMLDivElement>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = React.useCallback(async () => {
    setIsLoadingNotifications(true);
    try {
      const res = await getNotificationsApi(false, 0, 10);
      if (res.success && res.data) {
        setNotifications(res.data.content || []);
      }
    } catch {
      // Non-blocking notification fetch
    } finally {
      setIsLoadingNotifications(false);
    }
  }, []);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getBreadcrumbs = (tab: string) => {
    switch (tab) {
      case 'overview': return { section: 'Overview', page: 'Dashboard' };
      case 'analytics': return { section: 'Overview', page: 'Analytics' };
      case 'products': return { section: 'Commerce', page: 'Products Catalog' };
      case 'orders': return { section: 'Commerce', page: 'Orders' };
      case 'payments': return { section: 'Commerce', page: 'Payments Ledger' };
      case 'subscriptions': return { section: 'Commerce', page: 'Subscriptions' };
      case 'licenses': return { section: 'Commerce', page: 'License Keys' };
      case 'customers': return { section: 'Customers', page: 'Customer Directory' };
      case 'customer-360': return { section: 'Customers', page: 'Customer 360' };
      case 'leads': return { section: 'CRM', page: 'Leads & Enquiries' };
      case 'crm': return { section: 'CRM', page: 'Sales Pipeline' };
      case 'releases': return { section: 'Operations', page: 'Software Releases' };
      case 'notifications': return { section: 'Operations', page: 'Notifications' };
      case 'ai': return { section: 'Operations', page: 'AI Operations' };
      case 'audit-logs': return { section: 'Security', page: 'Audit Logs' };
      case 'admin-users': return { section: 'System', page: 'Admin Users' };
      case 'settings': return { section: 'System', page: 'Platform Settings' };
      default: return { section: 'Administration', page: tab };
    }
  };

  const breadcrumbs = getBreadcrumbs(activeTab);

  return (
    <header className="sticky top-0 z-30 w-full h-[65px] bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile Toggle + Logo + Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-4">
        {onOpenMobileSidebar && (
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2">
          <Link href="/admin" className="flex items-center gap-2 group">
            <span className="text-xs font-black text-slate-900 tracking-tight">OHO TECHN</span>
          </Link>
          <span className="text-slate-300">/</span>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 hidden sm:inline">{breadcrumbs.section}</span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="font-semibold text-slate-900">{breadcrumbs.page}</span>
          </div>
        </div>
      </div>

      {/* Center: Quick Search */}
      <div className="hidden md:flex items-center max-w-sm w-full mx-4">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search records across platform..."
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions, Notifications, Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Public Storefront Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Open live public website in new tab"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        {/* Notifications Popover */}
        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={fetchNotifications}
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  Refresh
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {isLoadingNotifications ? (
                  <div className="p-6 text-center text-xs text-slate-500">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">No new notifications recorded.</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        'p-3.5 hover:bg-slate-50/80 transition-colors text-left',
                        !n.read && 'bg-indigo-50/30'
                      )}
                    >
                      <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(n.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Administrator Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-left"
          >
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                {user?.email || 'admin@ohotech.com'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 divide-y divide-slate-100">
              <div className="px-3.5 py-2.5">
                <p className="text-xs font-semibold text-slate-900">{user?.name || 'Administrator'}</p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{user?.email}</p>
                <div className="mt-2">
                  <StatusBadge status={user?.role || 'ROLE_ADMIN'} />
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onSelectTab('settings');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Platform Settings</span>
                </button>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
