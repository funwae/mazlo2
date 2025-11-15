import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-bg-surface rounded-lg shadow-[0_14px_45px_rgba(0,0,0,0.45)]',
          'transition-all duration-200',
          hover && 'hover:-translate-y-0.5 hover:shadow-[0_16px_50px_rgba(0,0,0,0.5)] hover:border hover:border-[rgba(255,255,255,0.06)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

