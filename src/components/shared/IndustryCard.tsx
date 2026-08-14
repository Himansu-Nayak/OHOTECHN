import Link from 'next/link';
import { cn } from '@/lib/utils';

interface IndustryCardProps {
  name: string;
  slug: string;
  description: string;
  productCount: number;
  colorClass: string;
}

export default function IndustryCard({
  name,
  slug,
  description,
  productCount,
  colorClass,
}: IndustryCardProps) {
  return (
    <Link 
      href={`/solutions/${slug}`}
      id={`industry-card-${slug}`}
      className="group block relative bg-white rounded-2xl p-6 border border-neutral-100 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg hover:border-neutral-200"
    >
      <div 
        className={cn('absolute left-0 top-0 bottom-0 w-1', colorClass)} 
      />
      <div className="pl-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-full">
            {productCount} {productCount === 1 ? 'Product' : 'Products'}
          </span>
        </div>
        <p className="text-neutral-500 line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );
}
