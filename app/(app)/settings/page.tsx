'use client';

import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-h1 font-semibold text-text-primary mb-6">Settings</h1>
      <div className="space-y-4">
        <Link href="/app/settings/providers">
          <Card hover className="p-6 cursor-pointer">
            <h2 className="text-h3 font-semibold text-text-primary mb-2">Providers</h2>
            <p className="text-body text-text-secondary">Manage AI provider API keys and models</p>
          </Card>
        </Link>
        <Link href="/app/settings/health">
          <Card hover className="p-6 cursor-pointer">
            <h2 className="text-h3 font-semibold text-text-primary mb-2">Health</h2>
            <p className="text-body text-text-secondary">Configure time limits and reminders</p>
          </Card>
        </Link>
        <Link href="/app/settings/shortcuts">
          <Card hover className="p-6 cursor-pointer">
            <h2 className="text-h3 font-semibold text-text-primary mb-2">Keyboard Shortcuts</h2>
            <p className="text-body text-text-secondary">View and customize keyboard shortcuts</p>
          </Card>
        </Link>
        <Card className="p-6">
          <h2 className="text-h3 font-semibold text-text-primary mb-2">Themes</h2>
          <p className="text-body text-text-secondary">Theme selection coming soon</p>
        </Card>
      </div>
    </div>
  );
}

