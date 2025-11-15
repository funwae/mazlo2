import { cn } from '@/lib/utils/cn';

interface MazloAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function MazloAvatar({ size = 'md', className }: MazloAvatarProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16',
  };

  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary',
        'flex items-center justify-center',
        'border-2 border-accent-primary/50',
        sizes[size],
        className
      )}
    >
      <div className="text-text-invert font-semibold text-xs">M</div>
    </div>
  );
}

