'use client';

import React from 'react';
import { Button as AstryxButton, type ButtonProps as AstryxButtonProps } from '@astryxdesign/core';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * OHO TECH Enterprise Button component powered by Astryx v0.7.1
 * 
 * Provides tactile micro-interactions, accessible keyboard navigation,
 * and seamless theme integration with OHO TECH brand tokens.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    disabled,
    ...props
  },
  ref
) {
  // Variant mapping to OHO TECH brand styles
  const variantStyles = {
    primary:
      'bg-[#0d0d0e] hover:bg-[#1a1a1f] text-white shadow-sm hover:shadow-md active:scale-[0.98] border border-black/10',
    secondary:
      'bg-white hover:bg-slate-50 text-[#0d0d0e] border border-black/10 hover:border-black/20 shadow-sm active:scale-[0.98]',
    outline:
      'bg-transparent hover:bg-black/5 text-[#0d0d0e] border border-black/15 hover:border-black/30 active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-black/5 text-slate-700 hover:text-black active:scale-[0.98]',
    danger:
      'bg-[#e11d48] hover:bg-[#be123c] text-white shadow-sm active:scale-[0.98]',
    purple:
      'bg-gradient-to-r from-[#7c3aed] to-[#6366f1] hover:from-[#6d28d9] hover:to-[#4f46e5] text-white shadow-sm hover:shadow-md active:scale-[0.98]',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2 rounded-xl gap-2',
    lg: 'text-base px-6 py-3 rounded-2xl gap-2.5',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed button-tactile select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0 arrow-slide">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';
