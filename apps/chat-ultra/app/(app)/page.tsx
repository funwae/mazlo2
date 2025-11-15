'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { HealthPanel } from '@/components/home/HealthPanel';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-h1 font-semibold text-text-primary mb-2">Welcome back</h1>
        <p className="text-body text-text-secondary">Continue your work or start something new</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Continue Section */}
        <div>
          <h2 className="text-h3 font-semibold text-text-primary mb-4">Continue</h2>
          <div className="space-y-3">
            <Card className="p-4">
              <p className="text-body-small text-text-muted">No recent rooms</p>
            </Card>
          </div>
        </div>

        {/* Health Panel */}
        <div>
          <h2 className="text-h3 font-semibold text-text-primary mb-4">Health</h2>
          <HealthPanel />
        </div>
      </div>

      <div className="mt-8">
        <Link href="/app/rooms/new">
          <Button variant="primary">Create New Room</Button>
        </Link>
      </div>
    </div>
  );
}

