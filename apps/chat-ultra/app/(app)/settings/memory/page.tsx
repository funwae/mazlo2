"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { useCurrentUser } from "@/lib/auth/useCurrentUser";

export default function MemorySettingsPage() {
  const { userId, isLoading: userLoading } = useCurrentUser();

  const settings = useQuery(
    api.settings.getForUser,
    userId ? { ownerUserId: userId } : "skip"
  );

  const updateSettings = useMutation(api.settings.update);

  const [memoryEnabled, setMemoryEnabled] = useState(
    settings?.memoryEnabled ?? true
  );
  const [showSuggested, setShowSuggested] = useState(
    settings?.showSuggestedMemories ?? true
  );

  if (settings === undefined) {
    return (
      <div className="p-8 text-center">
        <p className="text-body text-text-secondary">加载中...</p>
      </div>
    );
  }

  const handleSave = async () => {
    if (!userId) return;
    await updateSettings({
      ownerUserId: userId,
      memoryEnabled,
      showSuggestedMemories: showSuggested,
    });
  };

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

