'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bell, CheckCircle2, AlertTriangle, Info, XCircle, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getNotificationsApi, getUnreadNotificationCountApi, markNotificationAsReadApi, markAllNotificationsAsReadApi } from '@/api/notifications';
import { NotificationDto } from '@/api/types';

export function NotificationBell() {
  const { user } = useAuth();
  const [mounted, setMounted] = React.useState<boolean>(false);

  const [unreadCount, setUnreadCount] = React.useState<number>(0);
  const [notifications, setNotifications] = React.useState<NotificationDto[]>([]);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const fetchUnreadCount = React.useCallback(async () => {
    if (!user) return;
    try {
      const res = await getUnreadNotificationCountApi();
      if (res.success && res.data) {
        setUnreadCount(res.data.count);
      }
    } catch {
      // Silent catch for background unread poll
    }
  }, [user]);

  const fetchRecentNotifications = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await getNotificationsApi(false, 0, 5);
      if (res.success && res.data) {
        setNotifications(res.data.content || []);
      }
    } catch (e) {
      console.warn('Failed to load recent notifications', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  React.useEffect(() => {
    if (isOpen) {
      fetchRecentNotifications();
    }
  }, [isOpen, fetchRecentNotifications]);

  // Click outside to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markNotificationAsReadApi(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.warn('Failed to mark read', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsReadApi();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.warn('Failed to mark all read', err);
    }
  };

  if (!mounted || !user) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'ERROR':
        return <XCircle className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'INFO':
      default:
        return <Info className="w-4 h-4 text-sky-500 shrink-0" />;
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      
      {/* Trigger Bell Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2.5 rounded-full hover:bg-slate-100 transition-colors text-slate-700 focus:outline-none cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-[#0d0d0e]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 px-1.5 py-0.5 min-w-5 h-5 rounded-full bg-rose-500 text-white font-mono font-black text-[10px] flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border-2 border-slate-300 rounded-[28px] shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-[#fafafa]">
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-[#0d0d0e]">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-mono font-bold text-sky-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="p-6 text-center text-xs font-mono text-slate-400">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-medium">
                No notifications right now. You are all caught up!
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 transition-colors hover:bg-slate-50 flex items-start gap-3 relative group ${
                    !notif.read ? 'bg-sky-50/50' : 'bg-white'
                  }`}
                >
                  {getTypeIcon(notif.type)}

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-bold text-[#0d0d0e] truncate">{notif.title}</h4>
                      <span className="text-[9px] font-mono text-slate-400 shrink-0">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{notif.message}</p>

                    {notif.actionUrl && (
                      <Link
                        href={notif.actionUrl}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-sky-600 hover:underline mt-1.5"
                      >
                        View Details <ArrowRight className="w-2.5 h-2.5" />
                      </Link>
                    )}
                  </div>

                  {!notif.read && (
                    <button
                      onClick={(e) => handleMarkAsRead(notif.id, e)}
                      title="Mark as read"
                      className="absolute right-3 top-4 p-1 text-slate-400 hover:text-sky-600 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-slate-100 bg-[#fafafa] text-center">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-sky-600 hover:underline inline-flex items-center gap-1 font-mono uppercase tracking-wider"
            >
              View All Notifications <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}
