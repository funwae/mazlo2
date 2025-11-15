'use client';

import { Card } from '@/components/ui/Card';

const shortcuts = [
  { key: 'Cmd+K', description: 'Open command palette' },
  { key: 'Cmd+Shift+N', description: 'Create new Room' },
  { key: 'Cmd+Shift+T', description: 'Create new Thread' },
  { key: 'Cmd+Shift+P', description: 'Pin message' },
  { key: 'Cmd+Shift+O', description: 'Toggle Mazlo panel' },
  { key: 'Cmd+Shift+B', description: 'Open Bridge mode' },
];

export default function ShortcutsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-h1 font-semibold text-text-primary mb-6">Keyboard Shortcuts</h1>

      <Card className="p-6">
        <div className="space-y-3">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center justify-between py-2 border-b border-border-default last:border-0">
              <span className="text-body text-text-primary">{shortcut.description}</span>
              <kbd className="px-2 py-1 rounded-sm bg-bg-surface-soft border border-border-default text-label text-text-secondary font-mono">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

