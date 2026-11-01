'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'tertiary' 
  | 'danger' 
  | 'outline' 
  | 'ghost' 
  | 'emerald' 
  | 'sky';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ResponsiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidthOnMobile?: boolean;
  fullWidth?: boolean;
  touchTarget?: boolean;
}

export const ResponsiveButton = React.forwardRef<HTMLButtonElement, ResponsiveButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidthOnMobile = false,
      fullWidth = false,
      touchTarget = true,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeStyles: Record<ButtonSize, string> = {
      xs: 'px-2.5 py-1 text-[11px] font-mono gap-1 rounded-lg',
      sm: 'px-3.5 py-1.5 text-xs font-semibold gap-1.5 rounded-xl',
      md: 'px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold gap-2 rounded-2xl',
      lg: 'px-6 py-3.5 sm:py-4 text-sm sm:text-base font-extrabold gap-2.5 rounded-full',
    };

    const variantStyles: Record<ButtonVariant, string> = {
      primary: 'bg-[#0d0d0e] hover:bg-sky-600 text-white shadow-sm border border-transparent hover:border-sky-500',
      secondary: 'bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-slate-300 shadow-2xs',
      tertiary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200',
      outline: 'bg-transparent hover:bg-slate-100 text-slate-700 border-2 border-slate-300 hover:border-slate-400',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border-none shadow-none',
      danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm border border-rose-600',
      emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md border border-emerald-600',
      sky: 'bg-sky-600 hover:bg-sky-700 text-white shadow-md border border-sky-600',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-200 select-none cursor-pointer',
          'button-tactile glow-focus max-w-full min-w-0 whitespace-nowrap overflow-hidden text-ellipsis',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          sizeStyles[size],
          variantStyles[variant],
          touchTarget && 'min-h-[44px]',
          fullWidth && 'w-full',
          fullWidthOnMobile && 'w-full sm:w-auto',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}

        {children ? <span className="truncate">{children}</span> : null}

        {!isLoading && rightIcon ? (
          <span className="shrink-0">{rightIcon}</span>
        ) : null}
      </button>
    );
  }
);

ResponsiveButton.displayName = 'ResponsiveButton';
