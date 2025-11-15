import { cn } from '@/lib/utils/cn';

interface MessageBubbleProps {
  content: string;
  role: 'user' | 'mazlo' | 'system';
  createdAt: Date;
  onPin?: () => void;
  onMakeTask?: () => void;
  onSelect?: () => void;
}

export function MessageBubble({
  content,
  role,
  createdAt,
  onPin,
  onMakeTask,
  onSelect,
}: MessageBubbleProps) {
  if (role === 'user') {
    return (
      <div className="flex justify-start mb-4">
        <div
          className={cn(
            'max-w-[70%] rounded-lg px-4 py-2.5',
            'bg-[#151A2E] text-text-primary',
            'rounded-tl-[4px] rounded-tr-[12px] rounded-bl-[12px] rounded-br-[12px]'
          )}
        >
          <p className="text-body whitespace-pre-wrap">{content}</p>
          <p className="text-label text-text-muted mt-1">
            {createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    );
  }

  if (role === 'mazlo') {
    return (
      <div className="flex justify-end mb-4">
        <div
          className={cn(
            'max-w-[70%] rounded-lg px-4 py-2.5',
            'bg-bg-surface-soft text-text-primary',
            'border-l-2 border-accent-primary',
            'rounded-tl-[12px] rounded-tr-[4px] rounded-bl-[12px] rounded-br-[12px]',
            'group'
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-label font-medium text-accent-primary">Mazlo</span>
          </div>
          <p className="text-body whitespace-pre-wrap">{content}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-label text-text-muted">
              {createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {onSelect && (
                <button
                  onClick={onSelect}
                  className="text-label text-accent-primary hover:text-accent-info transition-colors"
                >
                  Why
                </button>
              )}
              {onPin && (
                <button
                  onClick={onPin}
                  className="text-label text-accent-primary hover:text-accent-info transition-colors"
                >
                  Pin
                </button>
              )}
              {onMakeTask && (
                <button
                  onClick={onMakeTask}
                  className="text-label text-accent-primary hover:text-accent-info transition-colors"
                >
                  Make Task
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

