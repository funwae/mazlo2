"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MemoryItemRow } from "@/components/memory/MemoryItemRow";
import { useState } from "react";
import { useCurrentUser } from "@/lib/auth/useCurrentUser";

export default function GlobalMemoriesPage() {
  const { userId, isLoading: userLoading } = useCurrentUser();

  const memories = useQuery(
    api.memory.listAllForUser,
    userId ? { ownerUserId: userId, limit: 100 } : "skip"
  );

  const [filterScope, setFilterScope] = useState<string>("all");
  const [filterKind, setFilterKind] = useState<string>("all");

  if (memories === undefined) {
    return (
      <div className="p-8 text-center">
        <p className="text-body text-text-secondary">加载中...</p>
      </div>
    );
  }

  const filteredMemories = memories.filter((m) => {
    if (filterScope !== "all" && m.scope !== filterScope) return false;
    if (filterKind !== "all" && m.kind !== filterKind) return false;
    return true;
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-h1 font-semibold text-text-primary mb-2">
          全局记忆
        </h1>
        <p className="text-body-small text-text-muted">
          查看和管理 Mazlo 记住的所有内容
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filterScope}
          onChange={(e) => setFilterScope(e.target.value)}
          className="px-3 py-2 border border-border-default rounded-sm bg-bg-surface text-text-primary"
        >
          <option value="all">所有作用域</option>
          <option value="thread">线程</option>
          <option value="room">房间</option>
          <option value="global">全局</option>
        </select>

        <select
          value={filterKind}
          onChange={(e) => setFilterKind(e.target.value)}
          className="px-3 py-2 border border-border-default rounded-sm bg-bg-surface text-text-primary"
        >
          <option value="all">所有类型</option>
          <option value="fact">事实</option>
          <option value="preference">偏好</option>
          <option value="plan">计划</option>
          <option value="identity">身份</option>
          <option value="project">项目</option>
        </select>
      </div>

      {/* Memory List */}
      <div className="space-y-3">
        {filteredMemories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-body text-text-secondary">
              {memories.length === 0
                ? "还没有记忆"
                : "没有匹配筛选条件的记忆"}
            </p>
          </div>
        ) : (
          filteredMemories.map((memory) => (
            <MemoryItemRow
              key={memory._id}
              memory={memory}
              onEdit={() => {
                // TODO: Open edit dialog
              }}
              onForget={async () => {
                // TODO: Implement forget
              }}
              onScopeChange={async () => {
                // TODO: Implement scope change
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

