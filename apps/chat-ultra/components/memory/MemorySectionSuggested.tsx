"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/Button";
import type { Id } from "../../../convex/_generated/dataModel";

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
  const suggested = useQuery(api.memory.listSuggestedForRoomAndThread, {
    ownerUserId: ownerUserId as Id<"users">,
    roomId: roomId as Id<"rooms">,
    threadId: threadId as Id<"threads"> | undefined,
  });

  const pinMemory = useMutation(api.memory.pin);
  const discardCandidate = useMutation(api.memory.discardCandidate);

  if (suggested === undefined) {
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
      await pinMemory({
        ownerUserId: ownerUserId as Id<"users">,
        scope: candidate.scope || "room",
        roomId: roomId as Id<"rooms">,
        threadId: threadId as Id<"threads"> | undefined,
        kind: candidate.kind || "fact",
        content: candidate.content,
        importance: candidate.importance || 0.7,
      });
      // Optionally discard the candidate event after accepting
      if (candidate.eventId) {
        await discardCandidate({ eventId: candidate.eventId as Id<"memory_events"> });
      }
    } catch (error) {
      console.error("Failed to accept memory candidate:", error);
    }
  };

  const handleDiscard = async (candidate: any) => {
    if (!candidate.eventId) return;
    try {
      await discardCandidate({ eventId: candidate.eventId as Id<"memory_events"> });
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

