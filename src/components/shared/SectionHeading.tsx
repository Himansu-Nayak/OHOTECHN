import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col', align === 'center' ? 'items-center text-center' : 'items-start text-left')}>
      {eyebrow && (
        <span className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
        {title}
      </h2>
      {description && (
        <p className={cn('text-lg text-neutral-500 max-w-2xl', align === 'center' && 'mx-auto')}>
          {description}
        </p>
      )}
    </div>
  );
}
