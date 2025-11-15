import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'active' | 'paused' | 'language';
  children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'active', className, children, ...props }, ref) => {
    const variants = {
      active: cn(
        'h-[22px] px-2 rounded-full border border-accent-primary text-accent-primary bg-transparent',
        'text-label font-medium'
      ),
      paused: cn(
        'h-[22px] px-2 rounded-full border border-gray-500 text-gray-300 bg-transparent',
        'text-label font-medium'
      ),
      language: cn(
        'h-[22px] px-2 rounded-sm bg-[rgba(255,255,255,0.08)] text-text-secondary',
        'text-label font-medium'
      ),
    };

    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center', variants[variant], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

