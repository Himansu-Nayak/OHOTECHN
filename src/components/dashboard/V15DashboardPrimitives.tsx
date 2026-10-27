'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus, Plus, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'motion/react';

/* ==========================================================================
   1. DASHBOARD SHELL & PASTEL V15 AMBIENCE
   Soft lavender, pink, and light pastel backgrounds with subtle ambient glow
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
        'min-h-screen w-full transition-colors duration-200 antialiased selection:bg-orange-100 selection:text-orange-950',
        theme === 'light'
          ? 'bg-[#f8f9fe] text-slate-900 bg-[radial-gradient(ellipse_80%_60%_at_5%_-5%,rgba(224,219,254,0.55),transparent),radial-gradient(ellipse_60%_50%_at_95%_0%,rgba(254,226,236,0.55),transparent),radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(243,232,255,0.35),transparent)]'
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
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6',
        className
      )}
    >
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
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

      <div className="flex items-center gap-3 shrink-0 flex-wrap">
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
   3. V15 METRIC KPI CARD (WARM PASTEL, ORANGE ACCENTS, ROUNDED-2XL)
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
  accentColor?: 'orange' | 'emerald' | 'blue' | 'purple' | 'rose' | 'amber' | 'neutral';
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
    rose: 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-100/80',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-100/80',
    neutral: 'bg-slate-50 text-slate-700 border-slate-100 group-hover:bg-slate-100/80',
  };

  const cardBody = (
    <div
      onClick={onClick}
      className={cn(
        'group relative bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-[22px] p-5 sm:p-5.5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300',
        onClick && 'cursor-pointer hover:border-slate-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]',
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
          {label}
        </span>
        {Icon && (
          <div
            className={cn(
              'p-2.5 rounded-xl border transition-colors shrink-0 shadow-2xs',
              accentStyles[accentColor]
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3.5 flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {value}
        </div>
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full border shadow-2xs',
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

  if (!shouldReduceMotion) {
    return (
      <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
        {cardBody}
      </motion.div>
    );
  }

  return cardBody;
}

/* ==========================================================================
   4. V15 ACCENT ACTION CARD (VIBRANT ORANGE HIGHLIGHT AS SEEN IN V15 REFERENCE)
   Frame 00:02 "Manage Projects / Create New" aesthetic
   ========================================================================== */
export interface V15AccentActionCardProps {
  title: string;
  subtitle: string;
  buttonText: string;
  metricValue?: string | number;
  metricLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
  badge?: string;
  className?: string;
}

export function V15AccentActionCard({
  title,
  subtitle,
  buttonText,
  metricValue,
  metricLabel,
  onAction,
  icon: Icon = Plus,
  badge,
  className,
}: V15AccentActionCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const cardContent = (
    <div
      className={cn(
        'relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#FF6B4A] to-[#FF8E53] p-5 sm:p-6 text-white shadow-[0_10px_30px_rgba(255,107,74,0.25)] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_16px_40px_rgba(255,107,74,0.36)] group',
        className
      )}
    >
      {/* Subtle decorative circles as in V15 reference */}
      <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10 blur-md pointer-events-none" />
      <div className="absolute -right-2 -bottom-6 w-24 h-24 rounded-full bg-white/10 blur-xs pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/25 shadow-xs">
            <Icon className="w-5 h-5" />
          </div>
          {badge && (
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/25">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-bold tracking-tight text-white mb-1">
          {title}
        </h3>

        {/* Large Prominent Metric from Video Frame 00:02 */}
        {metricValue != null && (
          <div className="my-2.5">
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none drop-shadow-xs">
              {metricValue}
            </div>
            {metricLabel && (
              <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wider mt-1 block">
                {metricLabel}
              </span>
            )}
          </div>
        )}

        <p className="text-xs text-white/90 leading-relaxed line-clamp-2 mb-4">
          {subtitle}
        </p>
      </div>

      <div className="relative z-10 pt-2">
        <button
          type="button"
          onClick={onAction}
          className="w-full py-2.5 px-4 rounded-xl bg-white text-[#FF6B4A] font-bold text-xs hover:bg-white/95 active:scale-[0.98] transition-all shadow-sm flex items-center justify-between cursor-pointer"
        >
          <span>{buttonText}</span>
          <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF6B4A] flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>
    </div>
  );

  if (!shouldReduceMotion) {
    return (
      <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
}

/* ==========================================================================
   5. V15 CARD CONTAINER (ROUNDED-[22px], CLEAN PADDING, FROSTED GLASS)
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
        'bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-[22px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-200',
        className
      )}
    >
      {(title || actions) && (
        <div
          className={cn(
            'px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40',
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
      <div className={cn('p-5 sm:p-5.5', contentClassName)}>{children}</div>
    </div>
  );
}

/* ==========================================================================
   6. V15 PERFORMANCE CHART (AUTHENTIC DUAL CURVE AS SEEN IN V15 REFERENCE)
   Frame 00:01 & 00:04 "Performance Chart" recreation with smooth SVG spline
   ========================================================================== */
export interface V15PerformanceChartProps {
  title?: string;
  subtitle?: string;
  primaryData: number[];
  secondaryData?: number[];
  labels?: string[];
  timeframes?: string[];
  activeTimeframe?: string;
  onTimeframeChange?: (tf: string) => void;
  className?: string;
}

export function V15PerformanceChart({
  title = "Performance Chart",
  subtitle = "Velocity & transaction completion metrics",
  primaryData,
  secondaryData,
  labels,
  timeframes = ["Weekly", "Monthly", "Yearly"],
  activeTimeframe = "Monthly",
  onTimeframeChange,
  className,
}: V15PerformanceChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const width = 500;
  const height = 180;
  const paddingX = 20;
  const paddingTop = 28;
  const paddingBottom = 25;
  const effectiveWidth = width - paddingX * 2;
  const effectiveHeight = height - paddingTop - paddingBottom;

  const allVals = [...primaryData, ...(secondaryData || [])];
  const max = Math.max(...allVals, 1);
  const min = Math.min(...allVals, 0);
  const range = max - min || 1;

  const buildPath = (data: number[]) => {
    if (!data || data.length < 2) return { path: "", area: "", points: [] };
    const pts = data.map((v, i) => {
      const x = paddingX + (i / (data.length - 1)) * effectiveWidth;
      const y = height - paddingBottom - ((v - min) / range) * effectiveHeight;
      return { x, y, v };
    });

    // Smooth Bezier Curve
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const current = pts[i];
      const next = pts[i + 1];
      const controlX = (current.x + next.x) / 2;
      d += ` C ${controlX},${current.y} ${controlX},${next.y} ${next.x},${next.y}`;
    }

    const area = `${d} L ${pts[pts.length - 1].x},${height - paddingBottom} L ${pts[0].x},${height - paddingBottom} Z`;
    return { path: d, area, points: pts };
  };

  const primary = buildPath(primaryData);
  const secondary = secondaryData ? buildPath(secondaryData) : null;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!primary.points || primary.points.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * width;

    let nearest = 0;
    let minDiff = Infinity;
    for (let i = 0; i < primary.points.length; i++) {
      const diff = Math.abs(primary.points[i].x - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = i;
      }
    }
    setHoveredIndex(nearest);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const activePt = hoveredIndex !== null && primary.points[hoveredIndex] ? primary.points[hoveredIndex] : null;
  const activeSecPt = hoveredIndex !== null && secondary?.points?.[hoveredIndex] ? secondary.points[hoveredIndex] : null;
  const activeLabel = hoveredIndex !== null ? (labels?.[hoveredIndex] || `${activeTimeframe} #${hoveredIndex + 1}`) : null;

  return (
    <V15Card
      title={title}
      subtitle={subtitle}
      actions={
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/60">
          {timeframes.map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => onTimeframeChange && onTimeframeChange(tf)}
              className={cn(
                "px-3 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer",
                activeTimeframe === tf
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      }
      className={className}
    >
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 sm:h-52 overflow-visible cursor-crosshair select-none"
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Primary Gradient (Lavender / Violet) */}
            <linearGradient id="v15ChartViolet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
            </linearGradient>
            {/* Secondary Gradient (Orange Accent) */}
            <linearGradient id="v15ChartOrange" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ea580c" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Dotted horizontal grid lines */}
          {[0.25, 0.5, 0.75, 1.0].map((ratio) => {
            const y = height - paddingBottom - ratio * effectiveHeight;
            return (
              <line
                key={ratio}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Secondary Curve (Violet) */}
          {secondary && (
            <>
              <path d={secondary.area} fill="url(#v15ChartViolet)" />
              <path
                d={secondary.path}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Primary Curve (Vibrant Orange) */}
          {primary.path && (
            <>
              <path d={primary.area} fill="url(#v15ChartOrange)" />
              <path
                d={primary.path}
                fill="none"
                stroke="#ea580c"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Highlight points */}
              {primary.points.length > 0 && (
                <g>
                  {primary.points.map((pt, i) => (
                    <circle
                      key={i}
                      cx={pt.x}
                      cy={pt.y}
                      r={i === primary.points.length - 1 ? 4.5 : 3}
                      fill="#ea580c"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  ))}
                </g>
              )}
            </>
          )}

          {/* Interactive Hover Guide & Tooltip (Matching Reference Frame 00:01) */}
          {activePt && (
            <g className="transition-opacity duration-150 pointer-events-none">
              {/* Vertical dotted guide line */}
              <line
                x1={activePt.x}
                y1={paddingTop - 12}
                x2={activePt.x}
                y2={height - paddingBottom}
                stroke="#ea580c"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.75"
              />

              {/* Secondary point indicator */}
              {activeSecPt && (
                <circle
                  cx={activeSecPt.x}
                  cy={activeSecPt.y}
                  r="4.5"
                  fill="#8b5cf6"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              )}

              {/* Primary point pulsing outer glow & highlighted inner dot */}
              <circle
                cx={activePt.x}
                cy={activePt.y}
                r="8"
                fill="#ea580c"
                opacity="0.3"
              />
              <circle
                cx={activePt.x}
                cy={activePt.y}
                r="5.5"
                fill="#ea580c"
                stroke="#ffffff"
                strokeWidth="2.5"
              />

              {/* Floating Pill Tooltip */}
              <g
                transform={`translate(${Math.max(65, Math.min(width - 65, activePt.x))}, ${Math.max(16, activePt.y - 20)})`}
                className="select-none"
              >
                <rect
                  x="-60"
                  y="-12"
                  width="120"
                  height="24"
                  rx="12"
                  fill="#0f172a"
                  fillOpacity="0.94"
                  stroke="#ea580c"
                  strokeWidth="1.2"
                />
                <text
                  x="0"
                  y="1"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#ffffff"
                  fontSize="9.5"
                  fontWeight="700"
                  fontFamily="sans-serif"
                >
                  {activePt.v.toLocaleString()} • {activeLabel}
                </text>
              </g>
            </g>
          )}
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span>Orders / Velocity</span>
            </span>
            {secondary && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Baseline Capacity</span>
              </span>
            )}
          </div>
          {hoveredIndex !== null && activePt ? (
            <div className="flex items-center gap-2 font-mono text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200 text-[11px]">
              <span className="font-bold">Point #{hoveredIndex + 1}:</span>
              <span>{activePt.v.toLocaleString()}</span>
              {activeSecPt && (
                <span className="text-purple-600">/ Baseline {activeSecPt.v.toLocaleString()}</span>
              )}
            </div>
          ) : (
            <span className="text-[11px] font-mono text-slate-400">
              Real-time PostgreSQL Feed
            </span>
          )}
        </div>
      </div>
    </V15Card>
  );
}
/* ==========================================================================
   7. MINI SVG TREND SPARKLINE
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
  color = '#ea580c',
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
   8. V15 MINI BAR COMPARISON CHART
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
    <div className={cn('flex items-end justify-between gap-2.5 h-28 pt-2', className)}>
      {data.map((item, idx) => {
        const heightPercent = Math.max(8, Math.round((item.value / max) * 100));
        return (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
            <div className="w-full bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden">
              <div
                style={{ height: `${heightPercent}%`, backgroundColor: activeColor }}
                className="w-full rounded-t-lg transition-all duration-300 group-hover:brightness-110"
              />
            </div>
            <span className="text-[10px] font-semibold text-slate-400 truncate max-w-[48px] text-center">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ==========================================================================
   9. V15 MINI CALENDAR / SCHEDULE WIDGET
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
    <div className={cn('bg-white/95 backdrop-blur-sm p-4 rounded-[22px] border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)]', className)}>
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
   10. V15 ACTIVITY TIMELINE SECTION
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
                <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 border border-slate-200/90 shadow-2xs">
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

/* ==========================================================================
   11. V15 PILL TABS
   ========================================================================== */
export interface V15PillTabItem {
  key: string;
  label: string;
  icon?: LucideIcon;
  badge?: number | string;
}

export function V15PillTabs({
  tabs,
  activeKey,
  onChange,
  className,
}: {
  tabs: V15PillTabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-[20px] p-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-x-auto scrollbar-none flex items-center gap-1.5', className)}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeKey === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shadow-2xs',
              isActive
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            )}
          >
            {Icon && <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-orange-400' : 'text-slate-400')} />}
            <span>{tab.label}</span>
            {tab.badge != null && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-mono',
                  isActive ? 'bg-orange-500 text-white' : 'bg-slate-200/80 text-slate-700'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}


/* ==========================================================================
   12. V15 CIRCULAR GAUGE / DONUT METER (FRAMES 00:01 & 00:02)
   Recreates the circular gauge meter for integrations/goals
   ========================================================================== */
export interface V15CircularGaugeProps {
  title: string;
  subtitle?: string;
  value: number; // 0 - 100 percentage
  displayValue?: string | number;
  label?: string;
  primaryColor?: string;
  metrics?: { label: string; value: string | number; color: string }[];
  className?: string;
}

export function V15CircularGauge({
  title,
  subtitle,
  value,
  displayValue,
  label = 'Operational',
  primaryColor = '#ea580c',
  metrics,
  className,
}: V15CircularGaugeProps) {
  const shouldReduceMotion = useReducedMotion();
  const size = 140;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(value, 0), 100);
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  const gaugeCard = (
    <V15Card title={title} subtitle={subtitle} className={className}>
      <div className="flex flex-col items-center justify-center py-1">
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="rotate-[-90deg]">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={primaryColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              {displayValue != null ? displayValue : `${clamped}%`}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
              {label}
            </span>
          </div>
        </div>

        {metrics && metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-3 w-full mt-4 pt-3 border-t border-slate-100">
            {metrics.map((m, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase truncate">
                    {m.label}
                  </span>
                  <span className="text-xs font-black text-slate-800">
                    {m.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </V15Card>
  );

  if (!shouldReduceMotion) {
    return (
      <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
        {gaugeCard}
      </motion.div>
    );
  }

  return gaugeCard;
}

/* ==========================================================================
   13. V15 MOTION CONTAINERS & STAGGER WRAPPERS
   Smooth, restrained entrance animations matching the video transitions
   ========================================================================== */
export function V15StaggerContainer({
  children,
  className,
  staggerDelay = 0.05,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function V15StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' } 
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
