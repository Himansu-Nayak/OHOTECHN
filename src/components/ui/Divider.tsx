'use client';

import React from 'react';
import { Divider as AstryxDivider, type DividerProps as AstryxDividerProps } from '@astryxdesign/core';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: React.ReactNode;
  variant?: 'subtle' | 'strong';
}

/**
 * OHO TECH Enterprise Divider component powered by Astryx v0.7.1
 */
export function Divider({
  orientation = 'horizontal',
  label,
  variant = 'subtle',
  className = '',
  ...props
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`w-px h-full ${variant === 'strong' ? 'bg-black/20' : 'bg-black/10'} ${className}`}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        className={`flex items-center my-6 text-xs uppercase tracking-wider text-slate-400 font-mono ${className}`}
        {...props}
      >
        <div className={`flex-1 h-px ${variant === 'strong' ? 'bg-black/20' : 'bg-black/10'}`} />
        <span className="px-4 shrink-0">{label}</span>
        <div className={`flex-1 h-px ${variant === 'strong' ? 'bg-black/20' : 'bg-black/10'}`} />
      </div>
    );
  }

  return (
    <div
      role="separator"
      className={`w-full h-px my-6 ${variant === 'strong' ? 'bg-black/20' : 'bg-black/10'} ${className}`}
      {...props}
    />
  );
}
