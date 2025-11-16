"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChatTimeline } from "@/components/room/ChatTimeline";
import { Composer } from "@/components/room/Composer";
import { MazloMemoryPanel } from "@/components/memory/MazloMemoryPanel";
import { useCurrentUser } from "@/lib/auth/useCurrentUser";

interface Message {
  id: string;
  role: 'user' | 'mazlo' | 'system';
  content: string;
  createdAt: string;
}

export default function MazloGlobalPage() {
  const { userId, isLoading: userLoading } = useCurrentUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState('');

  // Get or create global room
  const globalRoom = useQuery(
    api.rooms.getGlobalForUser,
    userId ? { userId } : "skip"
  );

  // Get default thread (or create one) - must be called unconditionally
  const threads = useQuery(
    api.threads.listByRoom,
    globalRoom?._id ? { roomId: globalRoom._id } : "skip"
  );

  const currentThreadId = threads?.[0]?._id;

  // Fetch messages when thread is available
  useEffect(() => {
    if (currentThreadId && globalRoom?._id) {
      fetchMessages();
    }
  }, [currentThreadId, globalRoom?._id]);

  const fetchMessages = async () => {
    if (!currentThreadId || !globalRoom?._id) return;
    try {
      // Convert Convex ID to string for API route
      const roomIdStr = globalRoom._id as string;
      const threadIdStr = currentThreadId as string;
      const res = await fetch(`/api/rooms/${roomIdStr}/threads/${threadIdStr}/messages`);
      const data = await res.json();
      
      // Transform API messages to ChatTimeline format
      const transformedMessages: Message[] = (data.messages || []).map((msg: any) => ({
        id: msg.id,
        role: msg.role === 'assistant' ? 'mazlo' : msg.role === 'user' ? 'user' : 'system',
        content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
        createdAt: msg.createdAt || new Date().toISOString(),
      }));
      
      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  if (!globalRoom) {
    return (
      <div className="p-8 text-center">
        <p className="text-body text-text-secondary">
          正在加载 Mazlo Global...
        </p>
      </div>
    );
  }

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
            messages={messages}
            streamingContent={streamingContent}
          />
        </div>

        <div className="border-t border-border-default p-4">
          <Composer
            roomId={globalRoom._id as string}
            threadId={currentThreadId as string}
            mode="global"
          />
        </div>
      </div>

      {/* Memory panel */}
      {userId && (
        <div className="w-80 border-l border-border-default">
          <MazloMemoryPanel
            roomId={globalRoom._id as string}
            ownerUserId={userId}
          />
        </div>
      )}
    </div>
  );
}

