"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Memory {
  _id: string;
  content: string;
  scope: string;
  importance: number;
}

interface MemoryEditDialogProps {
  memoryId: string;
  onClose: () => void;
}

export function MemoryEditDialog({
  memoryId,
  onClose,
}: MemoryEditDialogProps) {
  const [currentMemory, setCurrentMemory] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [scope, setScope] = useState("room");
  const [importance, setImportance] = useState(0.5);

  useEffect(() => {
    fetchMemory();
  }, [memoryId]);

  const fetchMemory = async () => {
    try {
      const res = await fetch(`/api/memories/${memoryId}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentMemory(data.memory);
        if (data.memory) {
          setContent(data.memory.content || "");
          setScope(data.memory.scope || "room");
          setImportance(data.memory.importance || 0.5);
        }
      }
    } catch (error) {
      console.error('Error fetching memory:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (!currentMemory) {
    return null;
  }

  const handleSave = async () => {
    try {
      // TODO: Implement update memory via API
      onClose();
    } catch (error) {
      console.error('Error saving memory:', error);
    }
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

