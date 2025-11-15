'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    dueDate?: string;
    priority: number;
  }) => void;
  initialTitle?: string;
  initialDescription?: string;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialTitle = '',
  initialDescription = '',
}: CreateTaskModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
        priority,
      });
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority(0);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        <div>
          <label className="block text-body-small text-text-secondary mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            className="w-full px-3 py-2 rounded-sm bg-bg-surface-soft border border-[rgba(255,255,255,0.10)] text-body text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:ring-opacity-60"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-body-small text-text-secondary mb-2">Due Date</label>
            <Input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-body-small text-text-secondary mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="w-full h-10 px-3 py-2 rounded-sm bg-bg-surface-soft border border-[rgba(255,255,255,0.10)] text-body text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
            >
              <option value={0}>Normal</option>
              <option value={1}>High</option>
              <option value={2}>Urgent</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}

