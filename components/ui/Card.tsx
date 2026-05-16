import { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'article' | 'div' | 'section';
}

export default function Card({ as: Tag = 'article', className, children, ...props }: CardProps) {
  return (
    <Tag
      className={cn(
        'rounded-xl border border-gray-200 bg-white p-5',
        'shadow-sm hover:shadow-md transition-shadow duration-200',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
