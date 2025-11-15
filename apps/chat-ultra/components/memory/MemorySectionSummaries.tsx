"use client";

import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";

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

  // Query summaries
  const summaries = useQuery(api.memory.getSummariesForRoomAndThread, {
    ownerUserId: ownerUserId as Id<"users">,
    roomId: roomId as Id<"rooms">,
    threadId: threadId as Id<"threads"> | undefined,
  });

  const summarizeThread = useAction(api.memory.summarizeThread);
  const summarizeRoom = useAction(api.memory.summarizeRoom);

  const handleRegenerateThread = async () => {
    if (!threadId) return;
    setIsRegeneratingThread(true);
    try {
      await summarizeThread({
        threadId: threadId as Id<"threads">,
        ownerUserId: ownerUserId as Id<"users">,
      });
    } catch (error) {
      console.error("Failed to regenerate thread summary:", error);
    } finally {
      setIsRegeneratingThread(false);
    }
  };

  const handleRegenerateRoom = async () => {
    setIsRegeneratingRoom(true);
    try {
      await summarizeRoom({
        roomId: roomId as Id<"rooms">,
        ownerUserId: ownerUserId as Id<"users">,
      });
    } catch (error) {
      console.error("Failed to regenerate room summary:", error);
    } finally {
      setIsRegeneratingRoom(false);
    }
  };

  if (summaries === undefined) {
    return (
      <div className="text-body-small text-text-muted">加载中...</div>
    );
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
              size="sm"
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
            size="sm"
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

