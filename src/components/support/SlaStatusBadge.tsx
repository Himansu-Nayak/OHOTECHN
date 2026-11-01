'use client';

import * as React from 'react';
import { Clock, AlertTriangle, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SupportTicketDto } from '@/api/types/support.types';

export interface SlaStatusBadgeProps {
  ticket: SupportTicketDto;
  showDetails?: boolean;
  className?: string;
}

export function getSlaInfo(ticket: SupportTicketDto): {
  status: 'RESOLVED' | 'BREACHED' | 'APPROACHING' | 'WITHIN_SLA' | 'NONE';
  label: string;
  badgeStyle: string;
  icon: React.ComponentType<{ className?: string }>;
} {
  const isClosed = ticket.status === 'RESOLVED' || ticket.status === 'CLOSED';
  
  if (isClosed || ticket.slaStatus === 'RESOLVED') {
    return {
      status: 'RESOLVED',
      label: 'Resolved',
      badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      icon: CheckCircle2,
    };
  }

  // If backend provided explicit slaStatus
  if (ticket.slaStatus === 'BREACHED') {
    const hours = ticket.slaHoursRemaining !== undefined ? Math.abs(ticket.slaHoursRemaining) : null;
    return {
      status: 'BREACHED',
      label: hours !== null && hours > 0 ? `SLA Breached (${hours}h overdue)` : 'SLA Breached',
      badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200/90 font-bold',
      icon: AlertCircle,
    };
  }

  if (ticket.slaStatus === 'APPROACHING') {
    const hours = ticket.slaHoursRemaining !== undefined ? ticket.slaHoursRemaining : null;
    return {
      status: 'APPROACHING',
      label: hours !== null ? `SLA Approaching (${hours}h left)` : 'SLA Approaching',
      badgeStyle: 'bg-amber-50 text-amber-800 border-amber-300 font-bold',
      icon: AlertTriangle,
    };
  }

  if (ticket.slaStatus === 'WITHIN_SLA') {
    const hours = ticket.slaHoursRemaining !== undefined ? ticket.slaHoursRemaining : null;
    return {
      status: 'WITHIN_SLA',
      label: hours !== null ? `Within SLA (${hours}h remaining)` : 'Within SLA',
      badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: Clock,
    };
  }

  // Fallback calculation if slaStatus wasn't provided directly (e.g. raw DTO without new field)
  if (ticket.slaDueAt) {
    const dueTime = new Date(ticket.slaDueAt).getTime();
    const now = Date.now();
    const diffHours = (dueTime - now) / (1000 * 60 * 60);

    if (diffHours < 0) {
      const overdueHours = Math.round(Math.abs(diffHours) * 10) / 10;
      return {
        status: 'BREACHED',
        label: `SLA Breached (${overdueHours}h overdue)`,
        badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200/90 font-bold',
        icon: AlertCircle,
      };
    } else if (diffHours <= 2) {
      const remaining = Math.round(diffHours * 10) / 10;
      return {
        status: 'APPROACHING',
        label: `SLA Approaching (${remaining}h left)`,
        badgeStyle: 'bg-amber-50 text-amber-800 border-amber-300 font-bold',
        icon: AlertTriangle,
      };
    } else {
      const remaining = Math.round(diffHours * 10) / 10;
      return {
        status: 'WITHIN_SLA',
        label: `Within SLA (${remaining}h remaining)`,
        badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200',
        icon: Clock,
      };
    }
  }

  // If slaHoursRemaining was provided without slaDueAt
  if (ticket.slaHoursRemaining !== undefined && ticket.slaHoursRemaining !== null) {
    if (ticket.slaHoursRemaining <= 0) {
      return {
        status: 'BREACHED',
        label: 'SLA Breached',
        badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200/90 font-bold',
        icon: AlertCircle,
      };
    }
    if (ticket.slaHoursRemaining <= 2) {
      return {
        status: 'APPROACHING',
        label: `SLA Approaching (${ticket.slaHoursRemaining}h left)`,
        badgeStyle: 'bg-amber-50 text-amber-800 border-amber-300 font-bold',
        icon: AlertTriangle,
      };
    }
    return {
      status: 'WITHIN_SLA',
      label: `Within SLA (${ticket.slaHoursRemaining}h remaining)`,
      badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: Clock,
    };
  }

  return {
    status: 'NONE',
    label: 'Standard SLA',
    badgeStyle: 'bg-slate-50 text-slate-600 border-slate-200',
    icon: ShieldCheck,
  };
}

export function SlaStatusBadge({ ticket, showDetails = false, className }: SlaStatusBadgeProps) {
  const info = getSlaInfo(ticket);
  const Icon = info.icon;

  return (
    <div className={cn("inline-flex flex-col items-end", className)}>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono border transition-colors shadow-2xs whitespace-nowrap",
          info.badgeStyle
        )}
      >
        <Icon className="w-3 h-3 shrink-0" />
        <span>{info.label}</span>
      </span>
      {showDetails && ticket.createdAt && (
        <span className="text-[10px] font-mono text-slate-400 mt-0.5">
          Opened: {new Date(ticket.createdAt).toLocaleDateString('en-IN')}
        </span>
      )}
    </div>
  );
}
