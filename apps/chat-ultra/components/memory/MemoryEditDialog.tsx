"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Id } from "@/convex/_generated/dataModel";

interface MemoryEditDialogProps {
  memoryId: Id<"memories">;
  onClose: () => void;
}

export function MemoryEditDialog({
  memoryId,
  onClose,
}: MemoryEditDialogProps) {
  const memory = useQuery(api.memory.listAllForUser, {
    ownerUserId: "" as Id<"users">, // This needs to be fixed - should get from auth
    limit: 1000,
  });

  const updateMemory = useMutation(api.memory.update);

  const currentMemory = memory?.find((m) => m._id === memoryId);

  const [content, setContent] = useState(currentMemory?.content || "");
  const [scope, setScope] = useState(currentMemory?.scope || "room");
  const [importance, setImportance] = useState(
    currentMemory?.importance || 0.5
  );

  if (!currentMemory) {
    return null;
  }

  const handleSave = async () => {
    await updateMemory({
      memoryId,
      content,
      scope,
      importance,
    });
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="编辑记忆">
      <div className="space-y-4">
        <div>
          <label className="text-label text-text-primary mb-1 block">
            内容
          </label>
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="记忆内容"
          />
        </div>

        <div>
          <label className="text-label text-text-primary mb-1 block">
            作用域
          </label>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="w-full px-3 py-2 border border-border-default rounded-sm bg-bg-surface text-text-primary"
          >
            <option value="thread">线程</option>
            <option value="room">房间</option>
            <option value="global">全局</option>
          </select>
        </div>

        <div>
          <label className="text-label text-text-primary mb-1 block">
            重要度: {importance.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={importance}
            onChange={(e) => setImportance(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </div>
      </div>
    </Modal>
  );
}

