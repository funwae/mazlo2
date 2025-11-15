"use client";

import { MemoryScopeTag } from "./MemoryScopeTag";
import { MemoryImportanceBadge } from "./MemoryImportanceBadge";
import { Button } from "@/components/ui/Button";
import type { Doc } from "../../convex/_generated/dataModel";

interface MemoryItemRowProps {
  memory: Doc<"memories">;
  onEdit: () => void;
  onForget: () => void;
  onScopeChange: (newScope: string) => void;
}

export function MemoryItemRow({
  memory,
  onEdit,
  onForget,
  onScopeChange,
}: MemoryItemRowProps) {
  return (
    <div className="p-3 rounded-sm bg-bg-surface-soft border border-border-default">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <MemoryScopeTag scope={memory.scope} />
            <MemoryImportanceBadge importance={memory.importance} />
          </div>
          <p className="text-body-small text-text-primary">{memory.content}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <Button size="sm" variant="secondary" onClick={onEdit}>
          编辑
        </Button>
        {memory.scope === "room" && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onScopeChange("global")}
          >
            升级为全局
          </Button>
        )}
        <Button size="sm" variant="secondary" onClick={onForget}>
          忘记
        </Button>
      </div>
    </div>
  );
}

