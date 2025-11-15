'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface HealthSettings {
  daily_limit_minutes: number;
  weekly_limit_minutes: number;
  reminder_interval_minutes: number;
  hard_stop_after_limit: boolean;
}

export default function HealthSettingsPage() {
  const [settings, setSettings] = useState<HealthSettings>({
    daily_limit_minutes: 120,
    weekly_limit_minutes: 840,
    reminder_interval_minutes: 45,
    hard_stop_after_limit: false,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // In production, this would save to user settings
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved');
    }, 500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-h1 font-semibold text-text-primary mb-6">Health Settings</h1>

      <Card className="p-6 space-y-6">
        <div>
          <h3 className="text-h3 font-semibold text-text-primary mb-4">Time Limits</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Daily Limit (minutes)"
              type="number"
              value={settings.daily_limit_minutes}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  daily_limit_minutes: parseInt(e.target.value) || 0,
                }))
              }
            />
            <Input
              label="Weekly Limit (minutes)"
              type="number"
              value={settings.weekly_limit_minutes}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  weekly_limit_minutes: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>
        </div>

        <div>
          <h3 className="text-h3 font-semibold text-text-primary mb-4">Reminders</h3>
          <Input
            label="Reminder Interval (minutes)"
            type="number"
            value={settings.reminder_interval_minutes}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                reminder_interval_minutes: parseInt(e.target.value) || 0,
              }))
            }
          />
        </div>

        <div>
          <h3 className="text-h3 font-semibold text-text-primary mb-4">Behavior</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.hard_stop_after_limit}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  hard_stop_after_limit: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded border-border-default bg-bg-surface-soft"
            />
            <span className="text-body text-text-primary">
              Hard stop after limit reached
            </span>
          </label>
        </div>

        <div className="flex justify-end">
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

