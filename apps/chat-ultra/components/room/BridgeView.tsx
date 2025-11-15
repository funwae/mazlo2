'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface BridgeViewProps {
  messages: Array<{
    id: string;
    role: 'user' | 'mazlo';
    content: string;
    translation?: string;
    intentSummary?: string;
    createdAt: string;
  }>;
  primaryLanguage: string;
  secondaryLanguage: string;
  onSend: (content: string, tone: 'neutral' | 'warm' | 'formal') => void;
  disabled?: boolean;
}

export function BridgeView({
  messages,
  primaryLanguage,
  secondaryLanguage,
  onSend,
  disabled,
}: BridgeViewProps) {
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState<'neutral' | 'warm' | 'formal'>('neutral');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim(), tone);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tone Selector */}
      <div className="p-4 border-b border-border-default bg-bg-surface">
        <div className="flex items-center gap-4">
          <span className="text-body-small text-text-secondary">Translation Tone:</span>
          {(['neutral', 'warm', 'formal'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              disabled={disabled}
              className={`
                px-3 py-1 rounded-sm text-label transition-colors
                ${tone === t
                  ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary'
                  : 'bg-bg-surface-soft text-text-secondary hover:bg-bg-elevated'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Messages - Split View */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 p-4">
          {/* Primary Language Column */}
          <div className="space-y-4">
            <div className="sticky top-0 bg-bg-surface pb-2 border-b border-border-default mb-4 z-10">
              <Badge variant="language" className="text-h4">
                {primaryLanguage.toUpperCase()}
              </Badge>
            </div>
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-2">
                <div className="p-3 rounded-sm bg-bg-surface-soft">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-label font-medium text-text-primary">
                      {msg.role === 'user' ? 'You' : 'Mazlo'}
                    </span>
                    <span className="text-label text-text-muted">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-body text-text-primary whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Secondary Language Column */}
          <div className="space-y-4">
            <div className="sticky top-0 bg-bg-surface pb-2 border-b border-border-default mb-4 z-10">
              <Badge variant="language" className="text-h4">
                {secondaryLanguage.toUpperCase()}
              </Badge>
            </div>
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-2">
                {msg.translation ? (
                  <>
                    <div className="p-3 rounded-sm bg-bg-surface-soft border-l-2 border-accent-primary">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-label text-text-muted">Translation</span>
                      </div>
                      <p className="text-body text-text-primary whitespace-pre-wrap">
                        {msg.translation}
                      </p>
                    </div>
                    {msg.intentSummary && (
                      <div className="p-3 rounded-sm bg-bg-elevated border border-border-default">
                        <div className="text-label font-medium text-text-secondary mb-1">
                          Intent Summary
                        </div>
                        <p className="text-body-small text-text-primary">{msg.intentSummary}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-3 rounded-sm bg-bg-surface-soft opacity-50">
                    <p className="text-body-small text-text-muted italic">
                      Translation pending...
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Composer */}
      <div className="p-4 border-t border-border-default">
        <Card className="p-3">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Type in ${primaryLanguage}... (Shift+Enter for new line)`}
                className="w-full bg-transparent text-body text-text-primary placeholder:text-text-muted resize-none focus:outline-none min-h-[56px] max-h-[120px]"
                rows={1}
                disabled={disabled}
              />
            </div>
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={!message.trim() || disabled}
            >
              Send
            </Button>
          </div>
          <div className="mt-2 text-body-tiny text-text-muted">
            Messages will be translated to {secondaryLanguage} with {tone} tone
          </div>
        </Card>
      </div>
    </div>
  );
}
