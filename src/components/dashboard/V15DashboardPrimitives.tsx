'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

/* ==========================================================================
   1. DASHBOARD SHELL & SURFACES
   ========================================================================== */
export interface DashboardShellProps {
  children: React.ReactNode;
  className?: string;
  theme?: 'light' | 'dark';
}

export function DashboardShell({ children, className, theme = 'light' }: DashboardShellProps) {
  return (
    <div
      className={cn(
        'min-h-screen w-full transition-colors duration-200 antialiased',
        theme === 'light'
          ? 'bg-[#f8f9fa] text-slate-900 selection:bg-orange-100 selection:text-orange-950'
          : 'bg-[#0b0c0e] text-slate-100 selection:bg-orange-500/20 selection:text-orange-200',
        className
      )}
    >
      {children}
    </div>
  );
}

/* ==========================================================================
   2. PAGE HEADER WITH V15 ACCENTS & ACTIONS
   ========================================================================== */
export interface DashboardPageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  lastUpdated?: string;
  className?: string;
}

export function DashboardPageHeader({
  title,
  subtitle,
  badge,
  actions,
  lastUpdated,
  className,
}: DashboardPageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 mb-6',
        className
      )}
    >
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {lastUpdated && (
          <span className="text-[11px] font-mono text-slate-400 hidden md:inline">
            Updated {lastUpdated}
          </span>
        )}
        {actions}
      </div>
    </div>
  );
}

/* ==========================================================================
   3. V15 METRIC KPI CARD (WARM OFF-WHITE, SUBTLE ORANGE ACCENTS, SHADOWS)
   ========================================================================== */
export interface V15MetricCardProps {
  label: string;
  value: string | number;
  subvalue?: string;
  icon?: LucideIcon;
  trend?: {
    value: string | number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  accentColor?: 'orange' | 'emerald' | 'blue' | 'purple' | 'neutral';
  tooltip?: string;
  onClick?: () => void;
  className?: string;
}

export function V15MetricCard({
  label,
  value,
  subvalue,
  icon: Icon,
  trend,
  accentColor = 'neutral',
  onClick,
  className,
}: V15MetricCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const accentStyles = {
    orange: 'bg-orange-50 text-orange-600 border-orange-100 group-hover:bg-orange-100/80',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-100/80',
    blue: 'bg-sky-50 text-sky-600 border-sky-100 group-hover:bg-sky-100/80',
    purple: 'bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-100/80',
    neutral: 'bg-slate-50 text-slate-700 border-slate-100 group-hover:bg-slate-100/80',
  };

  const cardBody = (
    <div
      onClick={onClick}
      className={cn(
        'group relative bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs transition-all duration-200',
        onClick && 'cursor-pointer hover:border-slate-300 hover:shadow-md',
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
          {label}
        </span>
        {Icon && (
          <div
            className={cn(
              'p-2.5 rounded-xl border transition-colors shrink-0',
              accentStyles[accentColor]
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3.5 flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full border',
              trend.direction === 'up' && 'text-emerald-700 bg-emerald-50 border-emerald-200',
              trend.direction === 'down' && 'text-rose-700 bg-rose-50 border-rose-200',
              trend.direction === 'neutral' && 'text-slate-600 bg-slate-50 border-slate-200'
            )}
          >
            {trend.direction === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
            {trend.direction === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend.direction === 'neutral' && <Minus className="w-3.5 h-3.5" />}
            <span>{trend.value}</span>
          </span>
        )}
      </div>

      {subvalue && (
        <p className="text-[11px] text-slate-500 mt-1 font-medium truncate">
          {subvalue}
        </p>
      )}
    </div>
  );

  if (onClick && !shouldReduceMotion) {
    return (
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15, ease: 'easeOut' }}>
        {cardBody}
      </motion.div>
    );
  }

  return cardBody;
}

/* ==========================================================================
   4. V15 CARD CONTAINER (ROUNDED-2XL, CLEAN PADDING, OPTIONAL HEADER)
   ========================================================================== */
export interface V15CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
}

export function V15Card({
  title,
  subtitle,
  actions,
  children,
  className,
  contentClassName,
  headerClassName,
}: V15CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden transition-all duration-200',
        className
      )}
    >
      {(title || actions) && (
        <div
          className={cn(
            'px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50',
            headerClassName
          )}
        >
          <div>
            {title && (
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
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
}

/* ==========================================================================
   5. MINI SVG TREND SPARKLINE / LINE CHART (ZERO EXTERNAL DEPS, ZERO HYDRATION)
   ========================================================================== */
export interface V15SparklineProps {
  data: number[];
  color?: string;
  fillColor?: string;
  height?: number;
  className?: string;
}

export function V15Sparkline({
  data,
  color = '#ea580c', // OHO TECH vibrant orange
  fillColor = 'rgba(234, 88, 12, 0.08)',
  height = 56,
  className,
}: V15SparklineProps) {
  if (!data || data.length < 2) {
    return <div className="h-14 flex items-center justify-center text-[10px] text-slate-400 font-mono">No trend data</div>;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 200;
  const padding = 6;
  const effectiveHeight = height - padding * 2;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * effectiveHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M ${points[0]} L ${points.join(' L ')} L ${width - padding},${height} L ${padding},${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('w-full overflow-visible', className)}
      style={{ height }}
      preserveAspectRatio="none"
    >
      <path d={areaD} fill={fillColor} />
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ==========================================================================
   6. V15 MINI BAR COMPARISON CHART
   ========================================================================== */
export interface V15BarChartProps {
  data: { label: string; value: number }[];
  activeColor?: string;
  className?: string;
}

export function V15BarChart({
  data,
  activeColor = '#ea580c',
  className,
}: V15BarChartProps) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn('flex items-end justify-between gap-2 h-28 pt-2', className)}>
      {data.map((item, idx) => {
        const heightPercent = Math.max(8, Math.round((item.value / max) * 100));
        return (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
            <div className="w-full bg-slate-100 rounded-t-md h-full flex items-end overflow-hidden">
              <div
                style={{ height: `${heightPercent}%`, backgroundColor: activeColor }}
                className="w-full rounded-t-md transition-all duration-300 group-hover:brightness-110"
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400 truncate max-w-[40px] text-center">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ==========================================================================
   7. V15 MINI CALENDAR / SCHEDULE WIDGET
   ========================================================================== */
export interface V15CalendarWidgetProps {
  selectedDate?: Date;
  events?: { day: number; count: number }[];
  className?: string;
}

export function V15CalendarWidget({
  selectedDate = new Date(),
  events = [],
  className,
}: V15CalendarWidgetProps) {
  const currentMonthName = selectedDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const today = selectedDate.getDate();
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayIndex }, (_, i) => i);

  return (
    <div className={cn('bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs', className)}>
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-800 tracking-tight">{currentMonthName}</span>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
          Live
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i} className="text-[10px] font-semibold text-slate-400">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {blanks.map((b) => (
          <div key={`blank-${b}`} className="h-6" />
        ))}
        {days.map((d) => {
          const isToday = d === today;
          const hasEvent = events.some((e) => e.day === d && e.count > 0);

          return (
            <div
              key={d}
              className={cn(
                'h-6 w-6 mx-auto rounded-full flex items-center justify-center text-[10px] font-mono transition-colors relative cursor-default',
                isToday
                  ? 'bg-orange-500 text-white font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              )}
            >
              <span>{d}</span>
              {hasEvent && !isToday && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-orange-500" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==========================================================================
   8. V15 ACTIVITY TIMELINE SECTION
   ========================================================================== */
export interface V15ActivityItem {
  id: string | number;
  title: string;
  subtitle: string;
  timestamp: string;
  badge?: React.ReactNode;
  icon?: LucideIcon;
  iconColor?: string;
}

export function V15ActivityTimeline({
  items,
  emptyMessage = 'No recent activity recorded.',
  className,
}: {
  items: V15ActivityItem[];
  emptyMessage?: string;
  className?: string;
}) {
  if (!items || items.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-400 font-medium">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn('flow-root', className)}>
      <ul className="-mb-8">
        {items.map((item, idx) => {
          const Icon = item.icon;
          const isLast = idx === items.length - 1;

          return (
            <li key={item.id} className="relative pb-6">
              {!isLast && (
                <span
                  className="absolute left-3.5 top-4 -ml-px h-full w-0.5 bg-slate-100"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex items-start space-x-3">
                <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 border border-slate-200/90">
                  {Icon ? (
                    <Icon className={cn('h-3.5 w-3.5', item.iconColor || 'text-slate-600')} />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                    <p className="text-[11px] text-slate-500">{item.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge}
                    <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                      {item.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
