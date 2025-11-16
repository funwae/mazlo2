"use client";

import { useEffect, useState } from "react";
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

interface Room {
  id: string;
  name: string;
}

interface Thread {
  id: string;
  title: string;
}

export default function MazloGlobalPage() {
  const { userId, isLoading: userLoading } = useCurrentUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [globalRoom, setGlobalRoom] = useState<Room | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch global room and threads
  useEffect(() => {
    if (userId) {
      fetchGlobalRoom();
    }
  }, [userId]);

  const fetchMessages = async () => {
    if (!threads[0]?.id || !globalRoom?.id) return;
    try {
      const res = await fetch(`/api/rooms/${globalRoom.id}/threads/${threads[0].id}/messages`);
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

  // Fetch messages when thread is available
  useEffect(() => {
    if (threads.length > 0 && globalRoom) {
      fetchMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threads.length, globalRoom?.id]);

  const fetchGlobalRoom = async () => {
    try {
      const res = await fetch('/api/rooms/global');
      if (res.ok) {
        const data = await res.json();
        setGlobalRoom(data.room);
        setThreads(data.threads || []);

        // Create a thread if none exists
        if (data.threads.length === 0 && data.room) {
          const newThread = await fetch('/api/rooms/' + data.room.id + '/threads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Main Thread' }),
          });
          if (newThread.ok) {
            const threadData = await newThread.json();
            setThreads([threadData.thread]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching global room:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || userLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-body text-text-secondary">
          正在加载 Mazlo Global...
        </p>
      </div>
    );
  }

  if (!globalRoom) {
    return (
      <div className="p-8 text-center">
        <p className="text-body text-text-secondary">
          无法加载全局房间
        </p>
      </div>
    );
  }

  const currentThreadId = threads[0]?.id;

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
            这是一间知道你所有项目与偏好的&ldquo;总监办公室&rdquo;。回答会更慢，但更有全局视角。
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
            roomId={globalRoom.id}
            onSend={async (content, mode, attachments) => {
              if (!currentThreadId) return;
              try {
                const res = await fetch(`/api/rooms/${globalRoom.id}/threads/${currentThreadId}/messages`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ content, mode, attachments }),
                });
                if (res.ok) {
                  fetchMessages();
                }
              } catch (error) {
                console.error('Error sending message:', error);
              }
            }}
            disabled={!currentThreadId}
          />
        </div>
      </div>

      {/* Memory panel */}
      {userId && (
        <div className="w-80 border-l border-border-default">
          <MazloMemoryPanel
            roomId={globalRoom.id}
            ownerUserId={userId}
          />
        </div>
      )}
    </div>
  );
}

