import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-root';

    const variants = {
      primary: cn(
        'h-10 px-4 rounded-full bg-accent-primary text-text-invert',
        'shadow-[0_10px_30px_rgba(0,0,0,0.45)]',
        'hover:bg-[#68D9FF] hover:shadow-[0_0_12px_rgba(79,209,255,0.35),0_10px_30px_rgba(0,0,0,0.45)]',
        'active:bg-[#38BDF2] active:translate-y-[2px] active:shadow-[0_8px_25px_rgba(0,0,0,0.45)]',
        'disabled:bg-gray-700 disabled:text-gray-500 disabled:shadow-none disabled:pointer-events-none disabled:cursor-not-allowed'
      ),
      secondary: cn(
        'h-10 px-4 rounded-full bg-transparent border border-[rgba(255,255,255,0.12)] text-text-secondary',
        'hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.18)]',
        'active:bg-[rgba(255,255,255,0.06)]',
        'disabled:opacity-60 disabled:pointer-events-none disabled:cursor-not-allowed'
      ),
      text: cn(
        'h-10 px-4 rounded-full text-accent-primary',
        'hover:underline hover:text-[#68D9FF]',
        'active:text-[#38BDF2]',
        'disabled:opacity-60 disabled:pointer-events-none disabled:cursor-not-allowed'
      ),
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

