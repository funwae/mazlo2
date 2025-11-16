"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState, useEffect } from "react";
import { useCurrentUser } from "@/lib/auth/useCurrentUser";

interface Settings {
  memoryEnabled: boolean;
  showSuggestedMemories: boolean;
}

export default function MemorySettingsPage() {
  const { userId, isLoading: userLoading } = useCurrentUser();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [showSuggested, setShowSuggested] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchSettings();
    }
  }, [userId]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        if (data.settings) {
          setMemoryEnabled(data.settings.memoryEnabled ?? true);
          setShowSuggested(data.settings.showSuggestedMemories ?? true);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memoryEnabled,
          showSuggestedMemories: showSuggested,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  if (loading || userLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-body text-text-secondary">加载中...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-h1 font-semibold text-text-primary mb-6">
        记忆设置
      </h1>

      <div className="space-y-6">
        <div className="p-4 rounded-sm bg-bg-surface-soft border border-border-default">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-h4 font-semibold text-text-primary">
                启用长期记忆
              </h3>
              <p className="text-body-small text-text-secondary mt-1">
                允许 Mazlo 记住跨对话的重要信息
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={memoryEnabled}
                onChange={(e) => setMemoryEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-bg-surface-soft peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
            </label>
          </div>
        </div>

        <div className="p-4 rounded-sm bg-bg-surface-soft border border-border-default">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-h4 font-semibold text-text-primary">
                显示建议记忆
              </h3>
              <p className="text-body-small text-text-secondary mt-1">
                在 Memory Panel 中显示 Mazlo 建议记住的内容
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showSuggested}
                onChange={(e) => setShowSuggested(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-bg-surface-soft peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>保存设置</Button>
        </div>
      </div>
    </div>
  );
}

