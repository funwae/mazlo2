'use client';

import { useState, KeyboardEvent, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ComposerProps {
  onSend: (message: string, mode: 'chat' | 'translate' | 'code' | 'critique', attachments?: FileAttachment[]) => void;
  disabled?: boolean;
  roomId?: string;
}

interface FileAttachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export function Composer({ onSend, disabled, roomId }: ComposerProps) {
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<'chat' | 'translate' | 'code' | 'critique'>('chat');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if ((message.trim() || attachments.length > 0) && !disabled) {
      onSend(message.trim(), mode, attachments.length > 0 ? attachments : undefined);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !roomId) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('roomId', roomId);

        const response = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        return await response.json();
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setAttachments((prev) => [...prev, ...uploadedFiles]);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  return (
    <div className="p-4 border-t border-border-default">
      <Card className="p-3">
        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-border-default">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-2 px-2 py-1 rounded-sm bg-bg-surface-soft text-body-small"
              >
                <span className="text-text-primary truncate max-w-[150px]">
                  {att.filename}
                </span>
                <button
                  onClick={() => handleRemoveAttachment(att.id)}
                  className="text-text-muted hover:text-text-primary"
                  type="button"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Shift+Enter for new line)"
              className="w-full bg-transparent text-body text-text-primary placeholder:text-text-muted resize-none focus:outline-none min-h-[56px] max-h-[120px]"
              rows={1}
              disabled={disabled || uploading}
            />
          </div>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={disabled || uploading}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || uploading || !roomId}
              title="Upload file"
            >
              {uploading ? '...' : '📎'}
            </Button>
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={(!message.trim() && attachments.length === 0) || disabled || uploading}
            >
              Send
            </Button>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          {(['chat', 'translate', 'code', 'critique'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`
                px-3 py-1 rounded-sm text-label transition-colors
                ${mode === m
                  ? 'bg-accent-primary/20 text-accent-primary'
                  : 'text-text-secondary hover:text-text-primary'
                }
              `}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

