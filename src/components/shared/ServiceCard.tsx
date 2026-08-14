import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  name: string;
  slug: string;
  description: string;
  iconName: string;
  category: 'technology' | 'marketing';
}

export default function ServiceCard({
  name,
  slug,
  description,
  iconName,
  category,
}: ServiceCardProps) {
  // @ts-ignore - dynamic icon access
  const Icon = LucideIcons[iconName] || LucideIcons.Code;

  return (
    <Link
      href={`/services/${slug}`}
      id={`service-card-${slug}`}
      className="group block bg-white rounded-2xl p-6 border border-neutral-100 transition-all hover:-translate-y-2 hover:shadow-xl hover:border-primary/20"
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors",
        category === 'technology' 
          ? "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
          : "bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white"
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary transition-colors">
        {name}
      </h3>
      <p className="text-neutral-500 line-clamp-3">
        {description}
      </p>
    </Link>
  );
}
