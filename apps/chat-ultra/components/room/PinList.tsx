'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface Pin {
  id: string;
  title: string;
  tag: 'decision' | 'insight' | 'spec' | 'link';
  messageId: string;
  createdAt: string;
}

interface PinListProps {
  pins: Pin[];
  onPinClick?: (pin: Pin) => void;
  onDeletePin?: (pinId: string) => void;
}

export function PinList({ pins, onPinClick, onDeletePin }: PinListProps) {
  const tagColors = {
    decision: 'accent-primary',
    insight: 'accent-info',
    spec: 'accent-warning',
    link: 'accent-secondary',
  };

  if (pins.length === 0) {
    return (
      <div className="p-4">
        <p className="text-body-small text-text-muted">No pins yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      {pins.map((pin) => (
        <div
          key={pin.id}
          className="p-3 rounded-sm bg-bg-surface-soft hover:bg-bg-elevated transition-colors cursor-pointer group"
          onClick={() => onPinClick?.(pin)}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="language" className="text-label">
                  {pin.tag}
                </Badge>
              </div>
              <p className="text-body-small text-text-primary line-clamp-2">{pin.title}</p>
            </div>
            {onDeletePin && (
              <Button
                variant="text"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-label p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePin(pin.id);
                }}
              >
                ×
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

