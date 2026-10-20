'use client';

import React from 'react';
import { Badge as AstryxBadge, type BadgeVariant as AstryxBadgeVariant } from '@astryxdesign/core';
export { StatusBadge } from './StatusBadge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'success' | 'warning' | 'error' | 'blue' | 'purple' | 'cyan' | 'gray';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  label?: React.ReactNode;
}

/**
 * OHO TECH Enterprise Badge component powered by Astryx v0.7.1
 */
export function Badge({
  variant = 'neutral',
  icon,
  children,
  label,
  className = '',
  ...props
}: BadgeProps) {
  const content = label ?? children;

  const variantStyles = {
    neutral: 'bg-slate-100 text-slate-800 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    error: 'bg-rose-50 text-rose-700 border-rose-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{content}</span>
    </span>
  );
}
