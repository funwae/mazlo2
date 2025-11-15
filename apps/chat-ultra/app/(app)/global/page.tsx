"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChatTimeline } from "@/components/room/ChatTimeline";
import { Composer } from "@/components/room/Composer";
import { MazloMemoryPanel } from "@/components/memory/MazloMemoryPanel";
import { useCurrentUser } from "@/lib/auth/useCurrentUser";

export default function MazloGlobalPage() {
  const { userId, isLoading: userLoading } = useCurrentUser();

  // Get or create global room
  const globalRoom = useQuery(
    api.rooms.getGlobalForUser,
    userId ? { userId } : "skip"
  );

  if (!globalRoom) {
    return (
      <div className="p-8 text-center">
        <p className="text-body text-text-secondary">
          正在加载 Mazlo Global...
        </p>
      </div>
    );
  }

  // Get default thread (or create one)
  const threads = useQuery(api.threads.listByRoom, {
    roomId: globalRoom._id,
  });

  const currentThreadId = threads?.[0]?._id;

  if (!currentThreadId) {
    return (
      <div className="p-8 text-center">
        <p className="text-body text-text-secondary">
          正在初始化线程...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border-default">
          <h1 className="text-h2 font-semibold text-text-primary">
            Mazlo Global
          </h1>
          <p className="text-body-small text-text-muted mt-1">
            这是一间知道你所有项目与偏好的"总监办公室"。回答会更慢，但更有全局视角。
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ChatTimeline
            roomId={globalRoom._id}
            threadId={currentThreadId}
            mode="global"
          />
        </div>

        <div className="border-t border-border-default p-4">
          <Composer
            roomId={globalRoom._id}
            threadId={currentThreadId}
            mode="global"
          />
        </div>
      </div>

      {/* Memory panel */}
      {userId && (
        <div className="w-80 border-l border-border-default">
          <MazloMemoryPanel
            roomId={globalRoom._id}
            ownerUserId={userId}
          />
        </div>
      )}
    </div>
  );
}

