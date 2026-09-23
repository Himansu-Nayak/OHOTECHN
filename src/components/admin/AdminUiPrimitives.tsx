'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Clock, X, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { transitions, modalVariants, backdropVariants, drawerVariants, tabIndicatorTransition } from '@/lib/motion-constants';

/* ==========================================================================
   1. ADMIN BADGES
   ========================================================================== */
export type BadgeVariant = 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'neutral' 
  | 'info' 
  | 'brand'
  | 'primary'
  | 'outline';

interface AdminBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function AdminBadge({ variant = 'neutral', children, className, dot = true }: AdminBadgeProps) {
  const variantStyles: Record<BadgeVariant, { bg: string; dot: string }> = {
    success: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      dot: 'bg-emerald-500',
    },
    warning: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
      dot: 'bg-amber-500',
    },
    error: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200/80',
      dot: 'bg-rose-500',
    },
    info: {
      bg: 'bg-sky-50 text-sky-800 border-sky-200/80',
      dot: 'bg-sky-500',
    },
    brand: {
      bg: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
      dot: 'bg-indigo-500',
    },
    primary: {
      bg: 'bg-slate-900 text-white border-slate-900',
      dot: 'bg-emerald-400',
    },
    outline: {
      bg: 'bg-white text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
    },
    neutral: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
    },
  };

  const style = variantStyles[variant] || variantStyles.neutral;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-colors',
        style.bg,
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', style.dot)} />}
      <span>{children}</span>
    </span>
  );
}

export function StatusBadge({ status }: { status?: string | null }) {
  if (!status) return <AdminBadge variant="neutral">UNKNOWN</AdminBadge>;

  const s = status.toUpperCase();

  if (['ACTIVE', 'SUCCESSFUL', 'SUCCESS', 'CONFIRMED', 'DELIVERED', 'COMPLETED', 'RESOLVED'].includes(s)) {
    return <AdminBadge variant="success">{s}</AdminBadge>;
  }
  if (['PENDING', 'IN_REVIEW', 'PROCESSING', 'NEW', 'TRIAL', 'SCHEDULED'].includes(s)) {
    return <AdminBadge variant="warning">{s}</AdminBadge>;
  }
  if (['FAILED', 'CANCELLED', 'CANCELED', 'REVOKED', 'DISABLED', 'BLOCKED', 'CLOSED', 'EXPIRED'].includes(s)) {
    return <AdminBadge variant="error">{s}</AdminBadge>;
  }
  if (['ROLE_ADMIN', 'ADMIN', 'ROLE_DEVELOPER', 'DEVELOPER'].includes(s)) {
    return <AdminBadge variant="brand">{s.replace('ROLE_', '')}</AdminBadge>;
  }
  if (['ROLE_CUSTOMER', 'CUSTOMER', 'USER'].includes(s)) {
    return <AdminBadge variant="info">{s.replace('ROLE_', '')}</AdminBadge>;
  }

  return <AdminBadge variant="neutral">{s}</AdminBadge>;
}

/* ==========================================================================
   2. BUTTONS (With Motion Tap/Hover Feedback)
   ========================================================================== */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  leftIcon?: React.ReactNode;
}

export function AdminButton({
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  icon: Icon,
  leftIcon,
  children,
  className,
  disabled,
  ...props
}: AdminButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5 rounded-lg',
    md: 'px-3.5 py-2 text-xs font-medium gap-2 rounded-xl',
    lg: 'px-4 py-2.5 text-sm font-medium gap-2.5 rounded-xl',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs border border-slate-900 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1',
    secondary: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 shadow-xs hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-300',
    outline: 'bg-transparent text-slate-700 hover:bg-slate-100/80 border border-slate-200',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 border border-rose-600 shadow-xs focus-visible:ring-2 focus-visible:ring-rose-500',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-none shadow-none',
  };

  const isInteractive = !disabled && !isLoading;

  return (
    <motion.button
      whileTap={isInteractive && !shouldReduceMotion ? { scale: 0.98 } : undefined}
      whileHover={isInteractive && !shouldReduceMotion ? { y: -0.5 } : undefined}
      transition={{ duration: 0.1, ease: 'easeOut' }}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...(props as any)}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : Icon ? (
        <Icon className="w-3.5 h-3.5 shrink-0" />
      ) : null}
      {children ? <span>{children}</span> : null}
    </motion.button>
  );
}

/* ==========================================================================
   3. INPUTS & FORMS
   ========================================================================== */
export interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export function AdminInput({ label, error, helperText, leftIcon, className, id, ...props }: AdminInputProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 tracking-tight">
          {label} {props.required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-200/90 rounded-xl placeholder:text-slate-400',
            leftIcon && 'pl-9',
            'focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors',
            'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed shadow-2xs',
            error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-slate-500">{helperText}</p>}
    </div>
  );
}

export interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function AdminSelect({ label, error, options, className, id, ...props }: AdminSelectProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 tracking-tight">
          {label} {props.required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        id={inputId}
        className={cn(
          'w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-200/90 rounded-xl',
          'focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors shadow-2xs cursor-pointer',
          error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
    </div>
  );
}

/* ==========================================================================
   4. CARDS & CONTAINERS
   ========================================================================== */
export interface AdminCardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  hoverable?: boolean;
}

export function AdminCard({ title, subtitle, actions, children, className, contentClassName, hoverable }: AdminCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const cardContent = (
    <div className={cn('bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden transition-all', hoverable && 'hover:shadow-md hover:border-slate-300/90', className)}>
      {(title || actions) && (
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      <div className={cn('p-5', contentClassName)}>{children}</div>
    </div>
  );

  if (hoverable && !shouldReduceMotion) {
    return (
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15, ease: 'easeOut' }}>
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
}

/* ==========================================================================
   5. EMPTY & LOADING STATES
   ========================================================================== */
export interface AdminEmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
}

export function AdminEmptyState({ title, description, action, icon }: AdminEmptyStateProps) {
  return (
    <div className="py-12 px-4 text-center rounded-xl bg-slate-50/60 border border-dashed border-slate-200 flex flex-col items-center justify-center">
      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
        {React.isValidElement(icon) ? (
          icon
        ) : typeof icon === 'function' ? (
          React.createElement(icon as React.ComponentType<{ className?: string }>, { className: 'w-5 h-5' })
        ) : (
          <AlertCircle className="w-5 h-5" />
        )}
      </div>
      <h4 className="text-xs font-semibold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

export function AdminTableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-3 p-4 animate-pulse">
      <div className="h-8 bg-slate-100 rounded-lg w-full mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-6 bg-slate-100/80 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ==========================================================================
   6. DIALOGS & CONFIRMATIONS (With Motion Transitions)
   ========================================================================== */
export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'max-w-md' | 'max-w-lg' | 'max-w-2xl' | 'max-w-4xl';
}

export function AdminModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}: AdminModalProps) {
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const maxWidthStyles: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    'max-w-md': 'max-w-md',
    'max-w-lg': 'max-w-lg',
    'max-w-2xl': 'max-w-2xl',
    'max-w-4xl': 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            variants={shouldReduceMotion ? undefined : modalVariants}
            initial={shouldReduceMotion ? { opacity: 0 } : 'hidden'}
            animate={shouldReduceMotion ? { opacity: 1 } : 'visible'}
            exit={shouldReduceMotion ? { opacity: 0 } : 'exit'}
            className={cn(
              'relative w-full bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden z-10',
              maxWidthStyles[maxWidth] || 'max-w-md'
            )}
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export interface AdminConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export function AdminConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: AdminConfirmDialogProps) {
  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            'p-2 rounded-full shrink-0',
            variant === 'danger' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
          )}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed pt-0.5">{description}</p>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <AdminButton variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </AdminButton>
          <AdminButton
            variant={variant === 'danger' ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </AdminButton>
        </div>
      </div>
    </AdminModal>
  );
}

/* ==========================================================================
   7. SLIDE-IN DRAWERS (With Spring Motion)
   ========================================================================== */
export interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

export function AdminDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = 'md',
  footer,
}: AdminDrawerProps) {
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const widthStyles: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Drawer Sheet */}
          <motion.div
            role="dialog"
            aria-modal="true"
            variants={shouldReduceMotion ? undefined : drawerVariants}
            initial={shouldReduceMotion ? { opacity: 0 } : 'hidden'}
            animate={shouldReduceMotion ? { opacity: 1 } : 'visible'}
            exit={shouldReduceMotion ? { opacity: 0 } : 'exit'}
            className={cn(
              'relative w-full h-full bg-white shadow-2xl border-l border-slate-200 z-10 flex flex-col',
              widthStyles[width] || 'max-w-md'
            )}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1">{children}</div>

            {/* Optional Footer */}
            {footer && (
              <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 shrink-0 flex items-center justify-end gap-2">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ==========================================================================
   8. ANIMATED TABS (With Sliding Spring Pill)
   ========================================================================== */
export interface AdminTabItem<T extends string = string> {
  id: T;
  label: string;
  badge?: number | string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface AdminTabsProps<T extends string = string> {
  tabs: AdminTabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  className?: string;
  layoutId?: string;
}

export function AdminTabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  className,
  layoutId = 'admin-active-tab-indicator',
}: AdminTabsProps<T>) {
  return (
    <div className={cn('flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 select-none overflow-x-auto', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap z-0',
              isActive ? 'text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
            )}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/70 -z-10"
                transition={tabIndicatorTransition}
              />
            )}
            {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={cn(
                'px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0',
                isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
              )}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

