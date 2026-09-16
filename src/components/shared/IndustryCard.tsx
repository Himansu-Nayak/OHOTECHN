'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const MotionLink = motion.create(Link);

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
    <MotionLink 
      href={`/solutions/${slug}`}
      id={`industry-card-${slug}`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="group block relative bg-white rounded-none p-6 sm:p-7 border border-neutral-200 hover:border-emerald-500/60 overflow-hidden transition-colors duration-200 cursor-pointer will-change-transform"
    >
      <div 
        className={cn('absolute left-0 top-0 bottom-0 w-1', colorClass)} 
      />
      <div className="pl-3">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-emerald-600 transition-colors">
            {name}
          </h3>
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-[11px] font-mono font-medium bg-neutral-100 text-neutral-600 rounded-none border border-neutral-200">
            {productCount} {productCount === 1 ? 'Product' : 'Products'}
          </span>
        </div>
        <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </MotionLink>
  );
}
