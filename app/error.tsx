'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg-root flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-h1 font-semibold text-text-primary mb-4">Something went wrong!</h2>
        <p className="text-body text-text-secondary mb-8">{error.message}</p>
        <div className="flex gap-4 justify-center">
          <Button variant="primary" onClick={reset}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}

