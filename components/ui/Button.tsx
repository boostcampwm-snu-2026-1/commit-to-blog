'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
}

const variantClass = {
  primary: 'bg-gray-900 text-white hover:bg-gray-700',
  secondary: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50',
  ghost: 'text-gray-600 hover:bg-gray-100',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', isLoading = false, disabled, className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors',
        'outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClass[variant],
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
);
Button.displayName = 'Button';

export default Button;
