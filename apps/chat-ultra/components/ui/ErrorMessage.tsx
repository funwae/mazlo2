'use client';

import { Card } from './Card';
import { Button } from './Button';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorMessage({
  title = 'Error',
  message,
  onRetry,
  onDismiss,
}: ErrorMessageProps) {
  return (
    <Card className="p-4 border-l-4 border-red-500 bg-red-500/10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-h4 font-semibold text-red-400 mb-1">{title}</h3>
          <p className="text-body-small text-text-secondary">{message}</p>
        </div>
        <div className="flex gap-2">
          {onRetry && (
            <Button variant="secondary" size="sm" onClick={onRetry}>
              Retry
            </Button>
          )}
          {onDismiss && (
            <Button variant="text" size="sm" onClick={onDismiss}>
              Dismiss
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

