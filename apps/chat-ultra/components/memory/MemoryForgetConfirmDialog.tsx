"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface MemoryForgetConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memoryContent?: string;
}

export function MemoryForgetConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  memoryContent,
}: MemoryForgetConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="确认忘记">
      <div className="space-y-4">
        <p className="text-body-small text-text-secondary">
          确定要忘记这条记忆吗？这将从 Mazlo 的记忆中删除。
        </p>
        {memoryContent && (
          <div className="p-3 rounded-sm bg-bg-surface-soft">
            <p className="text-body-small text-text-primary">{memoryContent}</p>
          </div>
        )}
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            确认忘记
          </Button>
        </div>
      </div>
    </Modal>
  );
}

