'use client';

import { cn } from '@/lib/utils/cn';

interface MazloStatusRingProps {
  status: 'idle' | 'thinking' | 'waiting';
  size?: 'sm' | 'md' | 'lg';
}

export function MazloStatusRing({ status, size = 'md' }: MazloStatusRingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('relative', sizes[size])}>
      <div
        className={cn(
          'absolute inset-0 rounded-full border-2',
          status === 'idle' && 'border-accent-primary/30',
          status === 'thinking' && 'border-accent-primary animate-pulse',
          status === 'waiting' && 'border-accent-primary border-dashed animate-spin'
        )}
      />
      {status === 'thinking' && (
        <div className="absolute inset-0 rounded-full bg-accent-primary/20 animate-ping" />
      )}
    </div>
  );
}

