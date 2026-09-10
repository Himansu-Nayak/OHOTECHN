'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Key, 
  Download, 
  Repeat, 
  Bell, 
  User, 
  LifeBuoy,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUnreadNotificationCountApi } from '@/api/notifications';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

export function CustomerPortalNav() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = React.useState<number>(0);

  React.useEffect(() => {
    let mounted = true;
    async function loadCount() {
      try {
        const res = await getUnreadNotificationCountApi();
        if (mounted && res.success && res.data) {
          setUnreadCount(res.data.count);
        }
      } catch {
        // Non-blocking
      }
    }
    loadCount();
    return () => {
      mounted = false;
    };
  }, [pathname]);

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Products', href: '/my-products', icon: Package },
    { name: 'Orders', href: '/orders', icon: ShoppingBag },
    { name: 'Invoices', href: '/invoices', icon: FileText },
    { name: 'License Keys', href: '/licenses', icon: Key },
    { name: 'Downloads', href: '/downloads', icon: Download },
    { name: 'Subscriptions', href: '/subscriptions', icon: Repeat },
    { name: 'Notifications', href: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'Profile & Security', href: '/profile', icon: User },
    { name: 'Support', href: '/contact', icon: LifeBuoy },
  ];

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-1.5 shadow-xs mb-8 overflow-hidden">
      <nav 
        aria-label="Customer Portal Navigation"
        className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 px-0.5"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-xl sm:rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 font-mono select-none',
                isActive
                  ? 'bg-[#0d0d0e] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0d0d0e] hover:bg-slate-100'
              )}
            >
              <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-sky-400' : 'text-slate-400')} />
              <span>{item.name}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className={cn(
                  'px-1.5 py-0.2 rounded-full text-[10px] font-black',
                  isActive ? 'bg-sky-500 text-white' : 'bg-rose-500 text-white'
                )}>
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
