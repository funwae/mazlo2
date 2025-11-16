"use client";

import { MemoryItemRow } from "./MemoryItemRow";
import { MemoryEditDialog } from "./MemoryEditDialog";
import { useState, useEffect } from "react";

interface Memory {
  _id: string;
  scope: string;
  content: string;
  importance: number;
  [key: string]: any;
}

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
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemories();
  }, [roomId, threadId, ownerUserId]);

  const fetchMemories = async () => {
    try {
      const res = await fetch(`/api/memories?roomId=${roomId}&threadId=${threadId || ''}`);
      if (res.ok) {
        const data = await res.json();
        setMemories(data.memories || []);
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
            // TODO: Implement forget via API
            await fetchMemories();
          }}
          onScopeChange={async (newScope: string) => {
            // TODO: Implement scope change via API
            await fetchMemories();
          }}
        />
      ))}

      {editingMemoryId && (
        <MemoryEditDialog
          memoryId={editingMemoryId}
          onClose={() => {
            setEditingMemoryId(null);
            fetchMemories();
          }}
        />
      )}
    </div>
  );
}

