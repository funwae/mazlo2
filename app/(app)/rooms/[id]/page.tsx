'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { ChatTimeline } from '@/components/room/ChatTimeline';
import { Composer } from '@/components/room/Composer';
import { MazloPanel } from '@/components/room/MazloPanel';
import { MazloMemoryPanel } from '@/components/memory/MazloMemoryPanel';
import { PinList } from '@/components/room/PinList';
import { TasksPanel } from '@/components/room/TasksPanel';
import { CreatePinModal } from '@/components/room/CreatePinModal';
import { CreateTaskModal } from '@/components/room/CreateTaskModal';
import { BridgeView } from '@/components/room/BridgeView';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useCurrentUser } from '@/lib/auth/useCurrentUser';

interface Room {
  id: string;
  name: string;
  status: string;
  summary?: string;
  primaryLanguage?: string;
  secondaryLanguages?: string[];
  threads?: Thread[];
  pins?: Array<{ id: string; title: string; tag: string; messageId: string }>;
  tasks?: Array<{
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'doing' | 'done';
    dueDate?: string;
    priority: number;
    messageId?: string;
  }>;
}

interface Thread {
  id: string;
  title: string;
  updatedAt: string;
}

interface Message {
  id: string;
  role: 'user' | 'mazlo' | 'system';
  content: string;
  createdAt: string;
}

export default function RoomDetailPage() {
  const params = useParams();
  const { userId, isLoading: userLoading } = useCurrentUser();
  const roomId = params.id as string;
  const [room, setRoom] = useState<Room | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showCreateThread, setShowCreateThread] = useState(false);
  const [threadTitle, setThreadTitle] = useState('');
  const [showCreatePin, setShowCreatePin] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedMessageForAction, setSelectedMessageForAction] = useState<Message | null>(null);
  const [selectedTab, setSelectedTab] = useState<'threads' | 'pins' | 'tasks'>('threads');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [bridgeMode, setBridgeMode] = useState(false);

  useEffect(() => {
    if (roomId) {
      fetchRoom();
    }
  }, [roomId]);

  useEffect(() => {
    if (selectedThreadId) {
      fetchMessages();
    }
  }, [selectedThreadId]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleCreateNewThread = () => {
      setShowCreateThread(true);
    };

    const handlePinSelectedMessage = () => {
      if (selectedMessageForAction) {
        setShowCreatePin(true);
      }
    };

    const handleToggleBridgeMode = () => {
      setBridgeMode((prev) => !prev);
    };

    window.addEventListener('createNewThread', handleCreateNewThread);
    window.addEventListener('pinSelectedMessage', handlePinSelectedMessage);
    window.addEventListener('toggleBridgeMode', handleToggleBridgeMode);

    return () => {
      window.removeEventListener('createNewThread', handleCreateNewThread);
      window.removeEventListener('pinSelectedMessage', handlePinSelectedMessage);
      window.removeEventListener('toggleBridgeMode', handleToggleBridgeMode);
    };
  }, [selectedMessageForAction]);

  const fetchRoom = async () => {
    try {
      const res = await fetch(`/api/rooms/${roomId}`);
      const data = await res.json();
      setRoom(data.room);
      if (data.room.threads && data.room.threads.length > 0) {
        setSelectedThreadId(data.room.threads[0].id);
      }
    } catch (error) {
      console.error('Error fetching room:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedThreadId) return;
    try {
      const res = await fetch(`/api/rooms/${roomId}/threads/${selectedThreadId}/messages`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadTitle.trim()) return;

    try {
      const res = await fetch(`/api/rooms/${roomId}/threads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: threadTitle }),
      });

      if (res.ok) {
        const data = await res.json();
        setShowCreateThread(false);
        setThreadTitle('');
        fetchRoom();
        setSelectedThreadId(data.thread.id);
      }
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  const handleCreatePin = async (data: { title: string; tag: 'decision' | 'insight' | 'spec' | 'link' }) => {
    if (!selectedMessageForAction) return;
    try {
      const res = await fetch('/api/pins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: roomId,
          message_id: selectedMessageForAction.id,
          title: data.title,
          tag: data.tag,
        }),
      });
      if (res.ok) {
        fetchRoom();
        setSelectedMessageForAction(null);
      }
    } catch (error) {
      console.error('Error creating pin:', error);
    }
  };

  const handleCreateTask = async (data: {
    title: string;
    description?: string;
    dueDate?: string;
    priority: number;
  }) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: roomId,
          message_id: selectedMessageForAction?.id,
          ...data,
        }),
      });
      if (res.ok) {
        fetchRoom();
        setSelectedMessageForAction(null);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleDeletePin = async (pinId: string) => {
    try {
      const res = await fetch(`/api/pins/${pinId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchRoom();
      }
    } catch (error) {
      console.error('Error deleting pin:', error);
    }
  };

  const handleToggleTaskStatus = async (taskId: string, newStatus: 'todo' | 'doing' | 'done') => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchRoom();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchRoom();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSend = async (
    content: string,
    mode: 'chat' | 'translate' | 'code' | 'critique',
    attachments?: Array<{ id: string; url: string; filename: string; size: number; mimeType: string }>
  ) => {
    if (!selectedThreadId || sending) return;

    setSending(true);
    setStreamingContent('');

    try {
      const res = await fetch(`/api/rooms/${roomId}/threads/${selectedThreadId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, mode, attachments }),
      });

      if (!res.body) {
        throw new Error('No response body');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'token') {
              setStreamingContent((prev) => prev + data.content);
            } else if (data.type === 'done') {
              setStreamingContent('');
              fetchMessages();
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      alert(error?.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-root flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-accent-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-body text-text-secondary">Loading room...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-bg-root flex items-center justify-center px-4">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-h2 font-semibold text-text-primary mb-4">Room not found</h2>
          <p className="text-body text-text-secondary mb-6">
            The room you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button variant="primary" onClick={() => window.location.href = '/app/rooms'}>
            Go to Rooms
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Left Panel - Threads, Pins & Tasks */}
      <div className="w-64 bg-bg-surface border-r border-border-default flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-border-default">
          {(['threads', 'pins', 'tasks'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`
                flex-1 px-3 py-2 text-label font-medium transition-colors
                ${selectedTab === tab
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-text-secondary hover:text-text-primary'
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedTab === 'threads' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-h4 font-semibold text-text-primary">Threads</h3>
                <Button
                  variant="text"
                  onClick={() => setShowCreateThread(true)}
                  className="text-label"
                >
                  + New
                </Button>
              </div>
              {room.threads && room.threads.length > 0 ? (
                <div className="space-y-1">
                  {room.threads.map((thread) => (
                    <button
                      key={thread.id}
                      onClick={() => setSelectedThreadId(thread.id)}
                      className={`w-full text-left p-2 rounded-sm text-body-small transition-colors ${
                        selectedThreadId === thread.id
                          ? 'bg-accent-primary/20 text-accent-primary'
                          : 'text-text-secondary hover:bg-[rgba(255,255,255,0.06)]'
                      }`}
                    >
                      {thread.title}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-body-small text-text-muted">No threads yet</p>
              )}
            </>
          )}

          {selectedTab === 'pins' && (
            <PinList
              pins={room.pins || []}
              onPinClick={(pin) => {
                // Scroll to message
                const messageElement = document.getElementById(`message-${pin.messageId}`);
                if (messageElement) {
                  messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              onDeletePin={handleDeletePin}
            />
          )}

          {selectedTab === 'tasks' && (
            <TasksPanel
              tasks={room.tasks || []}
              onToggleStatus={handleToggleTaskStatus}
              onDeleteTask={handleDeleteTask}
            />
          )}
        </div>
      </div>

      {/* Center - Chat */}
      <div className="flex-1 flex flex-col">
        {/* Room Header */}
        <div className="p-4 border-b border-border-default">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-h2 font-semibold text-text-primary">{room.name}</h2>
              <Badge variant={room.status === 'active' ? 'active' : 'paused'}>
                {room.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/rooms/${roomId}/export?format=markdown`);
                    if (res.ok) {
                      const blob = await res.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${room.name}.md`;
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(a);
                    }
                  } catch (error) {
                    console.error('Error exporting room:', error);
                    alert('Failed to export room');
                  }
                }}
                title="Export as Markdown"
              >
                Export MD
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/rooms/${roomId}/export?format=json`);
                    if (res.ok) {
                      const blob = await res.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${room.name}.json`;
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(a);
                    }
                  } catch (error) {
                    console.error('Error exporting room:', error);
                    alert('Failed to export room');
                  }
                }}
                title="Export as JSON"
              >
                Export JSON
              </Button>
              <Button
                variant={bridgeMode ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setBridgeMode(!bridgeMode)}
              >
                {bridgeMode ? 'Close Bridge' : 'Open Bridge'}
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Timeline or Bridge View */}
        {selectedThreadId ? (
          bridgeMode ? (
            <BridgeView
              messages={messages.map((m) => ({
                id: m.id,
                role: m.role,
                content: m.content,
                translation: (m as any).translation,
                intentSummary: (m as any).intentSummary,
                createdAt: m.createdAt,
              }))}
              primaryLanguage={room.primaryLanguage || 'en-US'}
              secondaryLanguage={room.secondaryLanguages?.[0] || 'zh-CN'}
              onSend={async (content, tone) => {
                // In bridge mode, send with translation
                await handleSend(content, 'translate', undefined);
              }}
              disabled={sending}
            />
          ) : (
            <>
              <ChatTimeline
                messages={messages}
                streamingContent={streamingContent}
                onPinMessage={(message) => {
                  setSelectedMessageForAction(message);
                  setShowCreatePin(true);
                }}
                onMakeTask={(message) => {
                  setSelectedMessageForAction(message);
                  setShowCreateTask(true);
                }}
                onSelectMessage={(messageId) => {
                  setSelectedMessageId(messageId);
                  // Switch to trace tab in MazloPanel
                }}
              />
              <Composer onSend={handleSend} disabled={sending} roomId={roomId} />
            </>
          )
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-body text-text-secondary mb-4">No thread selected</p>
              <Button variant="primary" onClick={() => setShowCreateThread(true)}>
                Create Thread
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Mazlo Panel & Memory */}
      <div className="w-80 bg-bg-surface border-l border-border-default flex flex-col">
        {/* Tabs for Mazlo Panel vs Memory */}
        <div className="flex border-b border-border-default">
          <button
            className="flex-1 px-4 py-2 text-label font-medium text-text-primary border-b-2 border-accent-primary"
          >
            Mazlo
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <MazloPanel
            roomSummary={room.summary}
            activePins={room.pins}
            selectedMessageId={selectedMessageId || undefined}
          />
        </div>
        {/* Memory Panel - can be toggled or shown in separate tab */}
        <div className="border-t border-border-default h-1/2">
          {userId && (
            <MazloMemoryPanel
              roomId={roomId}
              threadId={selectedThreadId || undefined}
              ownerUserId={userId}
            />
          )}
        </div>
      </div>

      {/* Create Thread Modal */}
      <Modal
        isOpen={showCreateThread}
        onClose={() => {
          setShowCreateThread(false);
          setThreadTitle('');
        }}
        title="Create New Thread"
      >
        <form onSubmit={handleCreateThread} className="space-y-4">
          <Input
            label="Thread Title"
            placeholder="New Thread"
            value={threadTitle}
            onChange={(e) => setThreadTitle(e.target.value)}
            required
            autoFocus
          />
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowCreateThread(false);
                setThreadTitle('');
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Pin Modal */}
      <CreatePinModal
        isOpen={showCreatePin}
        onClose={() => {
          setShowCreatePin(false);
          setSelectedMessageForAction(null);
        }}
        onSubmit={handleCreatePin}
        initialTitle={selectedMessageForAction?.content.substring(0, 100) || ''}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateTask}
        onClose={() => {
          setShowCreateTask(false);
          setSelectedMessageForAction(null);
        }}
        onSubmit={handleCreateTask}
        initialTitle={selectedMessageForAction?.content.substring(0, 100) || ''}
        initialDescription={selectedMessageForAction?.content || ''}
      />
    </div>
  );
}

