"use client";

import { useState } from "react";
import { MemorySectionPinned } from "./MemorySectionPinned";
import { MemorySectionSuggested } from "./MemorySectionSuggested";
import { MemorySectionSummaries } from "./MemorySectionSummaries";

interface MazloMemoryPanelProps {
  roomId: string;
  threadId?: string;
  ownerUserId: string;
}

export function MazloMemoryPanel({
  roomId,
  threadId,
  ownerUserId,
}: MazloMemoryPanelProps) {
  const [activeTab, setActiveTab] = useState<"pinned" | "suggested" | "summaries">("pinned");

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-border-default">
        {(["pinned", "suggested", "summaries"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              flex-1 px-4 py-2 text-label font-medium transition-colors
              ${
                activeTab === tab
                  ? "text-accent-primary border-b-2 border-accent-primary"
                  : "text-text-secondary hover:text-text-primary"
              }
            `}
          >
            {tab === "pinned"
              ? "记忆"
              : tab === "suggested"
              ? "建议"
              : "摘要"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "pinned" && (
          <MemorySectionPinned
            roomId={roomId}
            threadId={threadId}
            ownerUserId={ownerUserId}
          />
        )}

        {activeTab === "suggested" && (
          <MemorySectionSuggested
            roomId={roomId}
            threadId={threadId}
            ownerUserId={ownerUserId}
          />
        )}

        {activeTab === "summaries" && (
          <MemorySectionSummaries
            roomId={roomId}
            threadId={threadId}
            ownerUserId={ownerUserId}
          />
        )}
      </div>
    </div>
  );
}

