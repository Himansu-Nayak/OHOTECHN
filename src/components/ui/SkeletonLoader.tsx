'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: 'dark' | 'light';
}

export function Skeleton({ className, theme = 'dark', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-2xl relative overflow-hidden',
        theme === 'dark'
          ? 'bg-white/5 border border-white/10'
          : 'bg-slate-200/80 border border-slate-300/60',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r transparent',
          theme === 'dark'
            ? 'via-white/10 to-transparent'
            : 'via-white/60 to-transparent'
        )}
      />
    </div>
  );
}

export function SolutionCardSkeleton({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  return (
    <div
      className={cn(
        'rounded-2xl p-7 flex flex-col justify-between space-y-4 border',
        theme === 'dark'
          ? 'bg-[#141416] border-white/10'
          : 'bg-white border-slate-200'
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="w-10 h-10 rounded-xl" theme={theme} />
          <Skeleton className="w-24 h-6 rounded-full" theme={theme} />
        </div>
        <Skeleton className="w-3/4 h-6 rounded-lg" theme={theme} />
        <Skeleton className="w-full h-12 rounded-lg" theme={theme} />
      </div>
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <Skeleton className="w-28 h-4 rounded" theme={theme} />
        <Skeleton className="w-4 h-4 rounded-full" theme={theme} />
      </div>
    </div>
  );
}
