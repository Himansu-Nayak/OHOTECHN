import { cn } from '@/lib/utils';

interface StatCardProps {
  value: string;
  label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">
        {value}
      </div>
      <div className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
