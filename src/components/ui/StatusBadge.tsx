import * as React from 'react';
import { cn } from '@/lib/utils';

export type GeneralStatus = 
  | 'PAID'
  | 'CONFIRMED'
  | 'DELIVERED'
  | 'SHIPPED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'SUCCESSFUL'
  | 'RESOLVED'
  | 'CLOSED'
  | 'TRIAL'
  | 'IN_PROGRESS'
  | 'WAITING_USER'
  | 'PENDING'
  | 'OPEN'
  | 'PAST_DUE'
  | 'CANCELLED'
  | 'FAILED'
  | 'EXPIRED'
  | 'REVOKED'
  | 'SUSPENDED'
  | string;

interface StatusBadgeProps {
  status: GeneralStatus;
  label?: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

export function getStatusStyle(status: string): { bg: string; text: string; border: string; dot: string } {
  const s = (status || '').toUpperCase().trim();

  switch (s) {
    case 'PAID':
    case 'CONFIRMED':
    case 'DELIVERED':
    case 'ACTIVE':
    case 'COMPLETED':
    case 'SUCCESSFUL':
    case 'RESOLVED':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'SHIPPED':
    case 'TRIAL':
    case 'IN_PROGRESS':
      return {
        bg: 'bg-sky-50',
        text: 'text-sky-700',
        border: 'border-sky-200',
        dot: 'bg-sky-500',
      };
    case 'WAITING_USER':
    case 'OPEN':
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        dot: 'bg-purple-500',
      };
    case 'PENDING':
    case 'PAST_DUE':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'CANCELLED':
    case 'FAILED':
    case 'EXPIRED':
    case 'REVOKED':
    case 'SUSPENDED':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
      };
    case 'CLOSED':
    default:
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-300',
        dot: 'bg-slate-400',
      };
  }
}

export function StatusBadge({
  status,
  label,
  size = 'sm',
  showDot = false,
  className,
}: StatusBadgeProps) {
  const styles = getStatusStyle(status);
  const displayLabel = label || status;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider rounded-full border',
        styles.bg,
        styles.text,
        styles.border,
        size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3.5 py-1 text-xs',
        className
      )}
    >
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse', styles.dot)} />
      )}
      <span>{displayLabel}</span>
    </span>
  );
}
