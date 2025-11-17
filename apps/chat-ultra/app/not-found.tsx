import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-root flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-h0 font-semibold text-text-primary mb-4">404</h1>
        <p className="text-body text-text-secondary mb-8">Page not found</p>
        <Link href="/chatultra">
          <Button variant="primary">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}

