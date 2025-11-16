"use client";

import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";

interface MemorySectionSuggestedProps {
  roomId: string;
  threadId?: string;
  ownerUserId: string;
}

export function MemorySectionSuggested({
  roomId,
  threadId,
  ownerUserId,
}: MemorySectionSuggestedProps) {
  const [suggested, setSuggested] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggested();
  }, [roomId, threadId, ownerUserId]);

  const fetchSuggested = async () => {
    try {
      const res = await fetch(`/api/memories/suggested?roomId=${roomId}&threadId=${threadId || ''}`);
      if (res.ok) {
        const data = await res.json();
        setSuggested(data.suggested || []);
      }
    } catch (error) {
      console.error('Error fetching suggested memories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-body-small text-text-muted">加载中...</div>;
  }

  if (suggested.length === 0) {
    return (
      <div className="text-body-small text-text-muted">
        目前没有建议的记忆。
      </div>
    );
  }

  const handleAccept = async (candidate: any) => {
    try {
      // TODO: Implement pin memory via API
      await fetchSuggested();
    } catch (error) {
      console.error("Failed to accept memory candidate:", error);
    }
  };

  const handleDiscard = async (candidate: any) => {
    try {
      // TODO: Implement discard via API
      await fetchSuggested();
    } catch (error) {
      console.error("Failed to discard candidate:", error);
    }
  };

  return (
    <div className="space-y-3">
      {suggested.map((candidate: any, index: number) => (
        <div
          key={candidate.eventId || index}
          className="p-3 rounded-sm bg-bg-surface-soft border border-border-default"
        >
          <div className="mb-2">
            <p className="text-body-small text-text-primary mb-1">
              {candidate.content}
            </p>
            {(candidate.scope || candidate.kind || candidate.importance) && (
              <div className="flex gap-2 text-body-tiny text-text-muted">
                {candidate.scope && <span>作用域: {candidate.scope}</span>}
                {candidate.kind && <span>类型: {candidate.kind}</span>}
                {candidate.importance && (
                  <span>重要性: {(candidate.importance * 100).toFixed(0)}%</span>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleAccept(candidate)}
              className="flex-1"
            >
              保存
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleDiscard(candidate)}
              className="flex-1"
            >
              忽略
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

