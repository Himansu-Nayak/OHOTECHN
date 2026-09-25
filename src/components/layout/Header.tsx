'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NextImage from 'next/image';
import { Menu, X, ChevronDown, Code2, TrendingUp, Sparkles, Building2, Layers, ShoppingBag, User, LogOut, Package, LayoutDashboard, Key, Download, Headphones, Repeat, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { solutionsNav, techServicesNav, growthServicesNav, resourcesNav, companyNav } from '@/config/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { NotificationBell } from '../NotificationBell';
import { MagneticCTA } from '@/components/ui/MagneticCTA';

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on Escape key and click outside
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setUserMenuOpen(false);
        setIsMobileOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => (prev === name ? null : name));
  };

  return (
    <>
      {/* Accessible Skip to Main Content Landmark */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-5 focus:py-2.5 focus:bg-[#0d0d0e] focus:text-white focus:rounded-full focus:shadow-2xl focus:border-2 focus:border-sky-400 focus:outline-none font-mono text-xs font-bold pointer-events-auto transition-all"
      >
        Skip to Main Content
      </a>

      {/* Floating Top Navigation Header Bar */}
      <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none">
        <header
          id="site-header"
          className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-full px-4 sm:px-6 lg:px-7 py-2 sm:py-2.5 flex items-center justify-between gap-2 lg:gap-3 xl:gap-5 max-w-[1240px] w-full transition-all duration-300"
        >
          {/* Logo */}
          <Link href="/" prefetch={true} id="logo-link" className="flex items-center shrink-0 group py-0.5" aria-label="OHO TECH Home">
            <NextImage
              src="/OHO_TECH_LOGO.png"
              alt="OHO TECH Logo"
              width={260}
              height={80}
              priority
              quality={100}
              unoptimized
              className="h-8 sm:h-10 lg:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links with Dropdowns */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-0.5 xl:gap-1 text-xs font-bold text-slate-700">
            
            {/* 1. Solutions Dropdown */}
            <div
              className="relative group/solutions"
              onMouseEnter={() => setOpenDropdown('solutions')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <div
                className={cn(
                  "flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-full transition-all cursor-pointer",
                  openDropdown === 'solutions' ? "bg-slate-100 text-black font-extrabold" : "hover:bg-slate-50 hover:text-black"
                )}
              >
                <Link
                  href="/solutions"
                  prefetch={true}
                  onClick={() => setOpenDropdown(null)}
                  className="hover:text-sky-600 transition-colors"
                >
                  Solutions
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown('solutions');
                  }}
                  aria-label="Toggle Solutions Dropdown"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'solutions'}
                  className="p-0.5 text-slate-400 hover:text-black transition-colors"
                >
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", openDropdown === 'solutions' && "rotate-180")} />
                </button>
              </div>

              {/* Seamless Hover Bridge Wrapper (pt-2 prevents mouse gap) */}
              <div
                className={cn(
                  "absolute top-full left-0 pt-2 w-80 z-50 transition-all duration-150",
                  openDropdown === 'solutions' ? "block opacity-100 pointer-events-auto" : "hidden opacity-0 pointer-events-none"
                )}
              >
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-4 grid grid-cols-1 gap-1">
                  <div className="text-[11px] font-mono font-bold text-sky-600 uppercase px-3 py-1 mb-1">
                    Solutions by Industry
                  </div>
                  {solutionsNav.slice(0, 6).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      onClick={() => setOpenDropdown(null)}
                      className="p-2.5 rounded-xl hover:bg-sky-50 transition-colors group/item block"
                    >
                      <div className="text-xs font-bold text-[#0d0d0e] group-hover/item:text-sky-600 transition-colors">
                        {item.name}
                      </div>
                      {item.description && (
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</div>
                      )}
                    </Link>
                  ))}
                  <div className="pt-2 border-t border-slate-100 mt-1">
                    <Link
                      href="/solutions"
                      prefetch={true}
                      onClick={() => setOpenDropdown(null)}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 px-3 py-1 block"
                    >
                      View All Industry Solutions →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Services Mega Dropdown */}
            <div
              className="relative group/services"
              onMouseEnter={() => setOpenDropdown('services')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <div
                className={cn(
                  "flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-full transition-all cursor-pointer",
                  openDropdown === 'services' ? "bg-slate-100 text-black font-extrabold" : "hover:bg-slate-50 hover:text-black"
                )}
              >
                <Link
                  href="/services"
                  prefetch={true}
                  onClick={() => setOpenDropdown(null)}
                  className="hover:text-sky-600 transition-colors"
                >
                  Services
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown('services');
                  }}
                  aria-label="Toggle Services Dropdown"
                  className="p-0.5 text-slate-400 hover:text-black transition-colors"
                >
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", openDropdown === 'services' && "rotate-180")} />
                </button>
              </div>

              {/* Seamless Hover Bridge Wrapper (pt-2 prevents mouse gap) */}
              <div
                className={cn(
                  "absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[560px] z-50 transition-all duration-150",
                  openDropdown === 'services' ? "block opacity-100 pointer-events-auto" : "hidden opacity-0 pointer-events-none"
                )}
              >
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-5 grid grid-cols-2 gap-6">
                  {/* Column 1: Tech Services */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-sky-600 uppercase px-2 mb-2">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Technology Services</span>
                    </div>
                    <div className="space-y-1">
                      {techServicesNav.slice(0, 5).map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          prefetch={true}
                          onClick={() => setOpenDropdown(null)}
                          className="p-2 rounded-lg hover:bg-sky-50 block transition-colors group/item"
                        >
                          <div className="text-xs font-bold text-[#0d0d0e] group-hover/item:text-sky-600 transition-colors">
                            {item.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Digital Growth */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-600 uppercase px-2 mb-2">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Digital Growth</span>
                    </div>
                    <div className="space-y-1">
                      {growthServicesNav.slice(0, 5).map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          prefetch={true}
                          onClick={() => setOpenDropdown(null)}
                          className="p-2 rounded-lg hover:bg-amber-50 block transition-colors group/item"
                        >
                          <div className="text-xs font-bold text-[#0d0d0e] group-hover/item:text-amber-600 transition-colors">
                            {item.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    <Link href="/services" prefetch={true} onClick={() => setOpenDropdown(null)} className="text-sky-600 hover:text-sky-700">
                      Explore All 15 Core Services →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Products Link */}
            <Link href="/products" prefetch={true} className="px-2.5 xl:px-3 py-1.5 rounded-full hover:bg-slate-50 hover:text-black transition-all">
              Products
            </Link>

            {/* 4. Resources Dropdown */}
            <div
              className="relative group/resources"
              onMouseEnter={() => setOpenDropdown('resources')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <div
                className={cn(
                  "flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-full transition-all cursor-pointer",
                  openDropdown === 'resources' ? "bg-slate-100 text-black font-extrabold" : "hover:bg-slate-50 hover:text-black"
                )}
              >
                <Link
                  href="/pricing"
                  prefetch={true}
                  onClick={() => setOpenDropdown(null)}
                  className="hover:text-sky-600 transition-colors"
                >
                  Resources
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown('resources');
                  }}
                  aria-label="Toggle Resources Dropdown"
                  className="p-0.5 text-slate-400 hover:text-black transition-colors"
                >
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", openDropdown === 'resources' && "rotate-180")} />
                </button>
              </div>

              {/* Seamless Hover Bridge Wrapper (pt-2 prevents mouse gap) */}
              <div
                className={cn(
                  "absolute top-full left-0 pt-2 w-64 z-50 transition-all duration-150",
                  openDropdown === 'resources' ? "block opacity-100 pointer-events-auto" : "hidden opacity-0 pointer-events-none"
                )}
              >
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-3 grid grid-cols-1 gap-1">
                  {resourcesNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      onClick={() => setOpenDropdown(null)}
                      className="p-2.5 rounded-xl hover:bg-sky-50 transition-colors group/item block"
                    >
                      <div className="text-xs font-bold text-[#0d0d0e] group-hover/item:text-sky-600 transition-colors">
                        {item.name}
                      </div>
                      {item.description && (
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.description}</div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Company Dropdown */}
            <div
              className="relative group/company"
              onMouseEnter={() => setOpenDropdown('company')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <div
                className={cn(
                  "flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-full transition-all cursor-pointer",
                  openDropdown === 'company' ? "bg-slate-100 text-black font-extrabold" : "hover:bg-slate-50 hover:text-black"
                )}
              >
                <Link
                  href="/about"
                  prefetch={true}
                  onClick={() => setOpenDropdown(null)}
                  className="hover:text-sky-600 transition-colors"
                >
                  Company
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown('company');
                  }}
                  aria-label="Toggle Company Dropdown"
                  className="p-0.5 text-slate-400 hover:text-black transition-colors"
                >
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", openDropdown === 'company' && "rotate-180")} />
                </button>
              </div>

              {/* Seamless Hover Bridge Wrapper (pt-2 prevents mouse gap) */}
              <div
                className={cn(
                  "absolute top-full right-0 pt-2 w-64 z-50 transition-all duration-150",
                  openDropdown === 'company' ? "block opacity-100 pointer-events-auto" : "hidden opacity-0 pointer-events-none"
                )}
              >
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-3 grid grid-cols-1 gap-1">
                  {companyNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      onClick={() => setOpenDropdown(null)}
                      className="p-2.5 rounded-xl hover:bg-sky-50 transition-colors group/item block"
                    >
                      <div className="text-xs font-bold text-[#0d0d0e] group-hover/item:text-sky-600 transition-colors">
                        {item.name}
                      </div>
                      {item.description && (
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.description}</div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          </nav>

          {/* Right Dual Action Buttons & Auth State */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Notification Bell */}
            <NotificationBell />

            {/* Cart Icon Link */}
            <Link
              href="/cart"
              className="relative p-1.5 sm:p-2 rounded-full text-slate-700 hover:text-sky-600 hover:bg-slate-100 transition-all shrink-0"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full border border-slate-200 hover:border-sky-500 bg-slate-50 transition-all text-xs font-bold text-[#0d0d0e] cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-extrabold uppercase shrink-0">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <span className="hidden md:inline max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 font-mono text-xs">
                    {/* User Identity Card */}
                    <div className="px-3 py-2.5 border-b border-slate-100 mb-1 bg-slate-50/70 rounded-xl">
                      <div className="text-xs font-extrabold text-[#0d0d0e] truncate">{user.name}</div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">{user.email}</div>
                      <div className="mt-1.5">
                        <span className="inline-block text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 uppercase tracking-wider">
                          {user.role.replace('ROLE_', '')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Staff Portals */}
                    {(user.role === 'ROLE_ADMIN' || user.role === 'ADMIN' || user.role === 'ROLE_DEVELOPER' || user.role === 'DEVELOPER' || user.role === 'ROLE_SUPPORT' || user.role === 'SUPPORT') && (
                      <div className="py-1 border-b border-slate-100 mb-1 space-y-1">
                        {(user.role === 'ROLE_ADMIN' || user.role === 'ADMIN') && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                          >
                            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Admin Console</span>
                          </Link>
                        )}

                        {(user.role === 'ROLE_DEVELOPER' || user.role === 'DEVELOPER') && (
                          <Link
                            href="/developer"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                          >
                            <Code2 className="w-4 h-4 text-purple-600 shrink-0" />
                            <span>Developer Studio</span>
                          </Link>
                        )}

                        {(user.role === 'ROLE_SUPPORT' || user.role === 'SUPPORT' || user.role === 'ROLE_ADMIN' || user.role === 'ADMIN') && (
                          <Link
                            href="/support"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                          >
                            <Headphones className="w-4 h-4 text-blue-600 shrink-0" />
                            <span>Support Desk</span>
                          </Link>
                        )}
                      </div>
                    )}

                    {/* Customer Portal Hub */}
                    <div className="py-1 space-y-0.5" role="menu" aria-label="Customer Portal Navigation">
                      <div className="text-[10px] font-mono font-bold text-slate-400 uppercase px-3 py-1">
                        Customer Portal Hub
                      </div>

                      {[
                        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                        { href: '/my-products', label: 'My Products', icon: Package },
                        { href: '/orders', label: 'Orders', icon: CreditCard },
                        { href: '/licenses', label: 'Licenses & Devices', icon: Key },
                        { href: '/downloads', label: 'Downloads', icon: Download },
                        { href: '/subscriptions', label: 'Subscriptions', icon: Repeat },
                        { href: '/support', label: 'Help & Support', icon: Headphones },
                        { href: '/profile', label: 'Account Profile', icon: User },
                        { href: '/cart', label: 'Shopping Cart', icon: ShoppingBag, badge: itemCount },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            role="menuitem"
                            aria-current={isActive ? 'page' : undefined}
                            onClick={() => setUserMenuOpen(false)}
                            className={cn(
                              "flex items-center justify-between px-3 py-1.5 rounded-xl font-bold transition-colors text-xs",
                              isActive 
                                ? "bg-sky-50 text-sky-700 font-extrabold border border-sky-100" 
                                : "text-slate-700 hover:bg-slate-100 hover:text-black"
                            )}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-sky-600" : "text-slate-500")} />
                              <span>{item.label}</span>
                            </div>
                            {item.badge !== undefined && item.badge > 0 && (
                              <span className="px-1.5 py-0.2 rounded-full bg-sky-600 text-white text-[10px] font-mono font-bold">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>

                    {/* Logout */}
                    <div className="pt-1 mt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 shrink-0" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full border border-slate-300 text-slate-800 hover:text-black hover:border-slate-400 font-extrabold text-xs tracking-tight transition-all button-tactile glow-focus"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="hidden xl:inline-flex px-4 py-2 rounded-full border border-slate-200 text-slate-700 hover:text-[#0d0d0e] font-extrabold text-xs tracking-tight transition-all hover:bg-slate-100 button-tactile glow-focus"
                >
                  Register
                </Link>
              </>
            )}

            <Link
              href="/get-quote"
              className="hidden xl:inline-flex px-3.5 py-1.5 sm:py-2 rounded-full border border-slate-200 text-slate-700 hover:text-[#0d0d0e] font-extrabold text-xs tracking-tight transition-all hover:bg-slate-100 whitespace-nowrap button-tactile glow-focus"
            >
              Get a Quote
            </Link>

            <MagneticCTA strength={0.2} maxOffset={8} className="hidden sm:inline-flex">
              <Link
                href="/book-demo"
                className="inline-flex px-3.5 sm:px-4.5 py-1.5 sm:py-2 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs tracking-tight transition-all shadow-sm whitespace-nowrap shrink-0 button-tactile glow-focus"
              >
                Book a Demo
              </Link>
            </MagneticCTA>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-button"
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-slate-800 hover:text-[#0d0d0e] hover:bg-slate-100 rounded-full transition-colors shrink-0 flex items-center justify-center min-w-[44px] min-h-[44px] cursor-pointer"
              aria-label="Open mobile navigation menu"
              aria-expanded={isMobileOpen}
              aria-controls="mobile-nav-drawer"
            >
              <Menu className="w-6 h-6 text-slate-900" />
            </button>
          </div>

        </header>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="fixed inset-0 z-[60] lg:hidden transition-all duration-300"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-white p-6 flex flex-col justify-between shadow-2xl overflow-y-auto z-10">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <NextImage
                  src="/OHO_TECH_LOGO.png"
                  alt="OHO TECH Logo"
                  width={220}
                  height={70}
                  quality={100}
                  unoptimized
                  className="h-10 sm:h-12 w-auto object-contain"
                />
                <button
                  id="mobile-nav-close"
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 -mr-2 text-slate-400 hover:text-[#0d0d0e] min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                  aria-label="Close mobile navigation menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav aria-label="Mobile Navigation" className="py-6 space-y-3 flex flex-col text-sm font-bold text-slate-700">
                {user && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl mb-2 font-mono">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-black text-[#0d0d0e]">{user.name}</div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 uppercase">
                        {user.role.replace('ROLE_', '')}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{user.email}</div>

                    {/* Mobile Customer Portal Links */}
                    <div className="pt-3 mt-3 border-t border-slate-200/80">
                      <div className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-2">
                        Customer Portal Hub
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        {(user.role === 'ROLE_ADMIN' || user.role === 'ADMIN') && (
                          <Link
                            href="/admin"
                            onClick={() => setIsMobileOpen(false)}
                            className="col-span-2 flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50 text-emerald-800 font-bold"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Admin Console</span>
                          </Link>
                        )}
                        {(user.role === 'ROLE_DEVELOPER' || user.role === 'DEVELOPER') && (
                          <Link
                            href="/developer"
                            onClick={() => setIsMobileOpen(false)}
                            className="col-span-2 flex items-center gap-1.5 p-2 rounded-xl bg-purple-50 text-purple-800 font-bold"
                          >
                            <Code2 className="w-3.5 h-3.5 text-purple-600" />
                            <span>Developer Studio</span>
                          </Link>
                        )}

                        {[
                          { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                          { href: '/my-products', label: 'Products', icon: Package },
                          { href: '/orders', label: 'Orders', icon: CreditCard },
                          { href: '/licenses', label: 'Licenses', icon: Key },
                          { href: '/downloads', label: 'Downloads', icon: Download },
                          { href: '/subscriptions', label: 'Subscriptions', icon: Repeat },
                          { href: '/support', label: 'Support', icon: Headphones },
                          { href: '/profile', label: 'Profile', icon: User },
                          { href: '/cart', label: 'Cart', icon: ShoppingBag, badge: itemCount },
                        ].map((item) => {
                          const Icon = item.icon;
                          const isActive = pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsMobileOpen(false)}
                              className={cn(
                                "flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-colors",
                                isActive
                                  ? "bg-sky-50 text-sky-700 font-extrabold border border-sky-200"
                                  : "bg-white border border-slate-200 text-slate-700 hover:text-sky-600 hover:border-sky-300"
                              )}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <Icon className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-sky-600" : "text-slate-500")} />
                                <span className="truncate">{item.label}</span>
                              </div>
                              {item.badge !== undefined && item.badge > 0 && (
                                <span className="px-1.5 py-0.2 rounded-full bg-sky-600 text-white text-[9px] font-mono font-bold shrink-0">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                <Link href="/" onClick={() => setIsMobileOpen(false)} className="hover:text-sky-600 transition-colors py-1">Home</Link>
                <Link href="/products" onClick={() => setIsMobileOpen(false)} className="hover:text-sky-600 transition-colors py-1 flex items-center justify-between">
                  <span>Products &amp; Modules</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Turnkey</span>
                </Link>
                <Link href="/solutions" onClick={() => setIsMobileOpen(false)} className="hover:text-sky-600 transition-colors py-1">Industry Solutions</Link>
                <Link href="/services" onClick={() => setIsMobileOpen(false)} className="hover:text-sky-600 transition-colors py-1">Core Services</Link>
                <Link href="/work" onClick={() => setIsMobileOpen(false)} className="hover:text-sky-600 transition-colors py-1">Selected Work &amp; Case Studies</Link>
                <Link href="/technology" onClick={() => setIsMobileOpen(false)} className="hover:text-sky-600 transition-colors py-1">Technology &amp; AI</Link>
                <Link href="/insights" onClick={() => setIsMobileOpen(false)} className="hover:text-sky-600 transition-colors py-1">Engineering Insights</Link>
                <Link href="/pricing" onClick={() => setIsMobileOpen(false)} className="hover:text-sky-600 transition-colors py-1">Pricing &amp; Plans</Link>
                <Link href="/about" onClick={() => setIsMobileOpen(false)} className="hover:text-sky-600 transition-colors py-1">About Us</Link>
                <Link href="/contact" onClick={() => setIsMobileOpen(false)} className="hover:text-sky-600 transition-colors py-1">Contact &amp; Discovery</Link>
                <Link href="/cart" onClick={() => setIsMobileOpen(false)} className="hover:text-sky-600 transition-colors py-1 flex items-center justify-between">
                  <span>Shopping Cart</span>
                  <span className="bg-sky-600 text-white text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">{itemCount}</span>
                </Link>
              </nav>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-100">
              <Link
                href="/book-demo"
                onClick={() => setIsMobileOpen(false)}
                className="block w-full py-3.5 rounded-full bg-sky-600 text-white font-extrabold text-xs text-center uppercase tracking-wider shadow-md hover:bg-sky-700 transition-colors min-h-[44px]"
              >
                Book a Demo
              </Link>
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileOpen(false);
                  }}
                  className="block w-full py-3.5 rounded-full bg-rose-600 text-white font-extrabold text-xs text-center uppercase tracking-wider shadow-md hover:bg-rose-700 min-h-[44px]"
                >
                  Logout
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileOpen(false)}
                    className="block w-full py-3 rounded-full border border-slate-300 text-[#0d0d0e] font-extrabold text-xs text-center uppercase tracking-wider hover:bg-slate-50 min-h-[44px] flex items-center justify-center"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileOpen(false)}
                    className="block w-full py-3 rounded-full bg-[#0d0d0e] text-white font-extrabold text-xs text-center uppercase tracking-wider shadow-md hover:bg-sky-600 min-h-[44px] flex items-center justify-center"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
