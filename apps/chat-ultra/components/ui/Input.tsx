import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-body-small text-text-secondary mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-10 w-full px-3 py-2 rounded-sm bg-bg-surface-soft',
            'border border-[rgba(255,255,255,0.10)]',
            'text-body text-text-primary placeholder:text-text-muted',
            'focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:ring-opacity-60',
            'transition-colors duration-150',
            error && 'border-accent-danger focus:border-accent-danger focus:ring-accent-danger',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-label text-accent-danger">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

