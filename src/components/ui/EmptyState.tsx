'use client';

import React from 'react';
import { EmptyState as AstryxEmptyState, type EmptyStateProps as AstryxEmptyStateProps } from '@astryxdesign/core';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * OHO TECH Enterprise Empty State component powered by Astryx v0.7.1
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  actions,
  className = '',
}: EmptyStateProps) {
  const combinedActions = actions ?? action;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-white border border-black/8 shadow-sm ${className}`}
    >
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-black/5 flex items-center justify-center text-slate-500 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-[#0d0d0e] tracking-tight">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-md mt-1 mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {combinedActions && <div className="mt-2">{combinedActions}</div>}
    </div>
  );
}
