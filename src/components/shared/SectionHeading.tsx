import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col mb-12 sm:mb-16', align === 'center' ? 'items-center text-center' : 'items-start text-left', className)}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2.5">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-950 tracking-tight leading-tight mb-3">
        {title}
      </h2>
      {description && (
        <p className={cn('text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl', align === 'center' && 'mx-auto')}>
          {description}
        </p>
      )}
    </div>
  );
}
