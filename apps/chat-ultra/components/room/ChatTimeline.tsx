'use client';

import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';

interface Message {
  id: string;
  role: 'user' | 'mazlo' | 'system';
  content: string;
  createdAt: string;
}

interface ChatTimelineProps {
  messages: Message[];
  streamingContent?: string;
  onPinMessage?: (message: Message) => void;
  onMakeTask?: (message: Message) => void;
  onSelectMessage?: (messageId: string) => void;
}

export function ChatTimeline({
  messages,
  streamingContent,
  onPinMessage,
  onMakeTask,
  onSelectMessage,
}: ChatTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div key={message.id} id={`message-${message.id}`}>
          <MessageBubble
            content={message.content}
            role={message.role}
            createdAt={new Date(message.createdAt)}
            onPin={message.role === 'mazlo' ? () => onPinMessage?.(message) : undefined}
            onMakeTask={message.role === 'mazlo' ? () => onMakeTask?.(message) : undefined}
            onSelect={message.role === 'mazlo' ? () => onSelectMessage?.(message.id) : undefined}
          />
        </div>
      ))}
      {streamingContent && (
        <MessageBubble
          content={streamingContent}
          role="mazlo"
          createdAt={new Date()}
        />
      )}
    </div>
  );
}

