"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MemoryItemRow } from "./MemoryItemRow";
import { MemoryEditDialog } from "./MemoryEditDialog";
import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";

interface MemorySectionPinnedProps {
  roomId: string;
  threadId?: string;
  ownerUserId: string;
}

export function MemorySectionPinned({
  roomId,
  threadId,
  ownerUserId,
}: MemorySectionPinnedProps) {
  const [editingMemoryId, setEditingMemoryId] = useState<Id<"memories"> | null>(null);

  const memories = useQuery(api.memory.listForRoomAndThread, {
    ownerUserId: ownerUserId as Id<"users">,
    roomId: roomId as Id<"rooms">,
    threadId: threadId as Id<"threads"> | undefined,
  });

  const updateMemory = useMutation(api.memory.update);
  const forgetMemory = useMutation(api.memory.forget);

  if (memories === undefined) {
    return <div className="text-body-small text-text-muted">加载中...</div>;
  }

  if (memories.length === 0) {
    return (
      <div className="text-body-small text-text-muted">
        当前房间/线程还没有记忆。
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {memories.map((memory) => (
        <MemoryItemRow
          key={memory._id}
          memory={memory}
          onEdit={() => setEditingMemoryId(memory._id)}
          onForget={async () => {
            await forgetMemory({ memoryId: memory._id });
          }}
          onScopeChange={async (newScope: string) => {
            await updateMemory({
              memoryId: memory._id,
              scope: newScope,
            });
          }}
        />
      ))}

      {editingMemoryId && (
        <MemoryEditDialog
          memoryId={editingMemoryId}
          onClose={() => setEditingMemoryId(null)}
        />
      )}
    </div>
  );
}

