import { cn } from '@/lib/cn';

interface BadgeProps {
  label: string;
  className?: string;
}

function getBranchColor(label: string) {
  if (label === 'main' || label === 'master') return 'bg-green-100 text-green-800';
  if (label.startsWith('feature')) return 'bg-blue-100 text-blue-800';
  if (label === 'develop' || label.startsWith('dev')) return 'bg-purple-100 text-purple-800';
  return 'bg-gray-100 text-gray-700';
}

export default function Badge({ label, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        getBranchColor(label),
        className
      )}
    >
      {label}
    </span>
  );
}
