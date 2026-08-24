'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bell, CheckCircle2, AlertTriangle, Info, XCircle, Check, Trash2, ArrowRight, Filter, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getNotificationsApi, markNotificationAsReadApi, markAllNotificationsAsReadApi, deleteNotificationApi } from '@/api/notifications';
import { NotificationDto } from '@/api/types';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [notifications, setNotifications] = React.useState<NotificationDto[]>([]);
  const [unreadOnly, setUnreadOnly] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchNotifications = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getNotificationsApi(unreadOnly, 0, 50);
      if (res.success && res.data) {
        setNotifications(res.data.content || []);
      } else {
        throw new Error(res.message || 'Failed to load notifications');
      }
    } catch (err: any) {
      setError(err.message || 'Could not fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [user, unreadOnly]);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsReadApi(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      showToast('Notification marked as read.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update notification', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsReadApi();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      showToast('All notifications marked as read.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to mark all read', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotificationApi(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      showToast('Notification deleted.', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete notification', 'error');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'ERROR':
        return <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'INFO':
      default:
        return <Info className="w-5 h-5 text-sky-500 shrink-0" />;
    }
  };

  if (!user) {
    return (
      <div className="bg-[#f7f7f5] min-h-screen pb-16 pt-28 sm:pt-36 px-4">
        <div className="max-w-md mx-auto bg-white border-2 border-slate-300 rounded-[32px] p-8 text-center shadow-sm">
          <Lock className="w-12 h-12 text-sky-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#0d0d0e] mb-2">Login Required</h1>
          <p className="text-xs text-slate-500 mb-6">Please log in to access your notification center.</p>
          <Link href="/login" className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider inline-block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
      <main className="max-w-5xl w-full mx-auto" id="notifications-main">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d0d0e]">
              Notification Center
            </h1>
            <p className="text-xs font-medium text-slate-600 mt-1">
              Account alerts, order confirmations, license status, and system updates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setUnreadOnly((prev) => !prev)}
              className={cn(
                'px-4 py-2 rounded-full font-mono text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer',
                unreadOnly
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
              )}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{unreadOnly ? 'Showing Unread' : 'Filter Unread'}</span>
            </button>

            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="bg-white border-2 border-slate-200 rounded-[28px] p-6 animate-pulse space-y-3">
                <div className="h-5 bg-slate-100 rounded-lg w-1/4" />
                <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-12 text-center my-6 shadow-sm">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-[#0d0d0e] mb-2">No Notifications</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              {unreadOnly ? 'You have no unread notifications.' : 'Your notification log is clear.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  'p-6 rounded-[28px] border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden',
                  !notif.read ? 'bg-white border-sky-500' : 'bg-[#fafafa] border-slate-200'
                )}
              >
                {!notif.read && (
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-sky-600" />
                )}

                <div className="flex items-start gap-4">
                  {getTypeIcon(notif.type)}

                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-[#0d0d0e]">{notif.title}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase border border-slate-200">
                        {notif.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{notif.message}</p>

                    <div className="text-[10px] font-mono text-slate-400">
                      {new Date(notif.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  {notif.actionUrl && (
                    <Link
                      href={notif.actionUrl}
                      className="px-4 py-2 rounded-full bg-slate-900 hover:bg-sky-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
                    >
                      <span>View</span> <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  {!notif.read && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                      title="Mark as Read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-2 rounded-full hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete Notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
