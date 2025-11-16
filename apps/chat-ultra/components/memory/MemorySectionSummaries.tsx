"use client";

import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";

interface MemorySectionSummariesProps {
  roomId: string;
  threadId?: string;
  ownerUserId: string;
}

export function MemorySectionSummaries({
  roomId,
  threadId,
  ownerUserId,
}: MemorySectionSummariesProps) {
  const [isRegeneratingThread, setIsRegeneratingThread] = useState(false);
  const [isRegeneratingRoom, setIsRegeneratingRoom] = useState(false);
  const [summaries, setSummaries] = useState<{
    threadSummary?: { content: string };
    roomSummary?: { content: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummaries();
  }, [roomId, threadId, ownerUserId]);

  const fetchSummaries = async () => {
    try {
      const res = await fetch(`/api/memories/summaries?roomId=${roomId}&threadId=${threadId || ''}`);
      if (res.ok) {
        const data = await res.json();
        setSummaries(data.summaries || {});
      }
    } catch (error) {
      console.error('Error fetching summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateThread = async () => {
    if (!threadId) return;
    setIsRegeneratingThread(true);
    try {
      // TODO: Implement summarize thread via API
      await fetchSummaries();
    } catch (error) {
      console.error("Failed to regenerate thread summary:", error);
    } finally {
      setIsRegeneratingThread(false);
    }
  };

  const handleRegenerateRoom = async () => {
    setIsRegeneratingRoom(true);
    try {
      // TODO: Implement summarize room via API
      await fetchSummaries();
    } catch (error) {
      console.error("Failed to regenerate room summary:", error);
    } finally {
      setIsRegeneratingRoom(false);
    }
  };

  if (loading) {
    return (
      <div className="text-body-small text-text-muted">加载中...</div>
    );
  }

  if (!summaries) {
    return null;
  }

  return (
    <div className="space-y-4">
      {threadId && (
        <div className="p-3 rounded-sm bg-bg-surface-soft border border-border-default">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-h4 font-semibold text-text-primary">
              线程摘要
            </h4>
            <Button

              onClick={handleRegenerateThread}
              disabled={isRegeneratingThread}
            >
              {isRegeneratingThread ? "生成中..." : "重新生成"}
            </Button>
          </div>
          {summaries.threadSummary ? (
            <p className="text-body-small text-text-primary">
              {summaries.threadSummary.content}
            </p>
          ) : (
            <p className="text-body-small text-text-secondary">
              暂无线程摘要。点击"重新生成"创建摘要。
            </p>
          )}
        </div>
      )}

      <div className="p-3 rounded-sm bg-bg-surface-soft border border-border-default">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-h4 font-semibold text-text-primary">房间摘要</h4>
          <Button

            onClick={handleRegenerateRoom}
            disabled={isRegeneratingRoom}
          >
            {isRegeneratingRoom ? "生成中..." : "重新生成"}
          </Button>
        </div>
        {summaries.roomSummary ? (
          <p className="text-body-small text-text-primary">
            {summaries.roomSummary.content}
          </p>
        ) : (
          <p className="text-body-small text-text-secondary">
            暂无房间摘要。点击"重新生成"创建摘要。
          </p>
        )}
      </div>
    </div>
  );
}

