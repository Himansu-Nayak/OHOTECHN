'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'interactive' | 'dark';
  children: React.ReactNode;
}

/**
 * OHO TECH Enterprise Card component built on Astryx container principles
 */
export function Card({ variant = 'default', className = '', children, ...props }: CardProps) {
  const variantStyles = {
    default: 'bg-white border border-black/8 shadow-sm rounded-2xl',
    elevated: 'bg-white border border-black/8 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl',
    glass: 'glass-pill rounded-2xl',
    interactive: 'launch-card cursor-pointer',
    dark: 'bg-[#0d0d0e] border border-white/10 text-white rounded-2xl shadow-xl',
  };

  return (
    <div
      className={`p-6 transition-all duration-300 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex flex-col space-y-1.5 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-xl font-bold tracking-tight text-[#0d0d0e] ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className = '', children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-slate-500 leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex items-center pt-4 border-t border-black/5 mt-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
