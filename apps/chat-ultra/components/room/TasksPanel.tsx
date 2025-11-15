'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'doing' | 'done';
  dueDate?: string;
  priority: number;
  messageId?: string;
}

interface TasksPanelProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onToggleStatus?: (taskId: string, newStatus: 'todo' | 'doing' | 'done') => void;
  onDeleteTask?: (taskId: string) => void;
}

export function TasksPanel({ tasks, onTaskClick, onToggleStatus, onDeleteTask }: TasksPanelProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'doing' | 'done'>('all');

  const statusColors = {
    todo: 'text-text-secondary',
    doing: 'text-accent-info',
    done: 'text-accent-success line-through',
  };

  const filteredTasks = filterStatus === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filterStatus);

  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    let newStatus: 'todo' | 'doing' | 'done';
    if (currentStatus === 'todo') {
      newStatus = 'doing';
    } else if (currentStatus === 'doing') {
      newStatus = 'done';
    } else {
      newStatus = 'todo';
    }
    onToggleStatus?.(taskId, newStatus);
  };

  if (tasks.length === 0) {
    return (
      <div className="p-4">
        <p className="text-body-small text-text-muted">No tasks yet</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Filter tabs */}
      <div className="flex gap-1 p-2 border-b border-border-default">
        {(['all', 'todo', 'doing', 'done'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`
              px-3 py-1 text-body-small rounded-sm transition-colors
              ${
                filterStatus === status
                  ? 'bg-accent-primary/20 text-accent-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }
            `}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredTasks.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-body-small text-text-muted">
              No {filterStatus === 'all' ? '' : filterStatus} tasks
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-sm bg-bg-surface-soft hover:bg-bg-elevated transition-colors cursor-pointer group"
                onClick={() => onTaskClick?.(task)}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.status === 'done'}
                    onChange={(e) => {
                      e.stopPropagation();
                      const newStatus = e.target.checked ? 'done' : 'todo';
                      onToggleStatus?.(task.id, newStatus);
                    }}
                    className="mt-1 w-4 h-4 rounded border-border-default bg-bg-surface-soft"
                  />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className={`text-body-small font-medium ${statusColors[task.status]}`}>
                  {task.title}
                </p>
                {task.priority > 0 && (
                  <Badge variant="active" className="text-label">
                    P{task.priority}
                  </Badge>
                )}
              </div>
              {task.description && (
                <p className="text-label text-text-muted line-clamp-1">{task.description}</p>
              )}
              {task.dueDate && (
                <p className="text-label text-text-muted mt-1">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
            {onDeleteTask && (
              <Button
                variant="text"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-label p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTask(task.id);
                }}
              >
                ×
              </Button>
            )}
          </div>
        </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}

