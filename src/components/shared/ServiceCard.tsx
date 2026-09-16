'use client';

import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const MotionLink = motion.create(Link);

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
    <MotionLink
      href={`/services/${slug}`}
      id={`service-card-${slug}`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="group block bg-white rounded-none p-6 sm:p-7 border border-neutral-200 hover:border-emerald-500/60 transition-colors duration-200 cursor-pointer will-change-transform"
    >
      <div className={cn(
        "w-10 h-10 rounded-none flex items-center justify-center mb-5 border transition-colors",
        category === 'technology' 
          ? "bg-emerald-50 text-emerald-600 border-emerald-200 group-hover:bg-emerald-500 group-hover:text-black"
          : "bg-amber-50 text-amber-600 border-amber-200 group-hover:bg-amber-500 group-hover:text-black"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-emerald-600 transition-colors">
        {name}
      </h3>
      <p className="text-neutral-500 text-sm leading-relaxed line-clamp-3">
        {description}
      </p>
    </MotionLink>
  );
}
