'use client';

import { LoadingSpinner } from './LoadingSpinner';
import { Card } from './Card';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({
  message = 'Loading...',
  fullScreen = false,
}: LoadingStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-body text-text-secondary">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-bg-root flex items-center justify-center">
        {content}
      </div>
    );
  }

  return <Card className="p-8">{content}</Card>;
}

