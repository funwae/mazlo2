'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface CreatePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; tag: 'decision' | 'insight' | 'spec' | 'link' }) => void;
  initialTitle?: string;
}

export function CreatePinModal({ isOpen, onClose, onSubmit, initialTitle = '' }: CreatePinModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [tag, setTag] = useState<'decision' | 'insight' | 'spec' | 'link'>('decision');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({ title: title.trim(), tag });
      setTitle('');
      setTag('decision');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Pin">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Pin Title"
          placeholder="Enter pin title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        <div>
          <label className="block text-body-small text-text-secondary mb-2">Tag</label>
          <div className="grid grid-cols-2 gap-2">
            {(['decision', 'insight', 'spec', 'link'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                className={`
                  px-3 py-2 rounded-sm text-body-small transition-colors
                  ${tag === t
                    ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary'
                    : 'bg-bg-surface-soft text-text-secondary hover:bg-bg-elevated'
                  }
                `}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Pin
          </Button>
        </div>
      </form>
    </Modal>
  );
}

