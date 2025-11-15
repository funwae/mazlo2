'use client';

import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Badge } from './Badge';

interface SearchResult {
  type: 'room' | 'message' | 'pin' | 'task';
  id: string;
  roomId: string;
  roomName: string;
  content: string;
  highlight: string;
  createdAt: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (result: SearchResult) => void;
}

export function CommandPalette({ isOpen, onClose, onSelect }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        onSelect(results[selectedIndex]);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onSelect, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-4">
        <Input
          placeholder="Search rooms, messages, pins, tasks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        {loading && (
          <div className="p-4 text-center">
            <p className="text-body-small text-text-muted">Searching...</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="max-h-96 overflow-y-auto space-y-1">
            {results.map((result, index) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => {
                  onSelect(result);
                  onClose();
                }}
                className={`
                  w-full text-left p-3 rounded-sm transition-colors
                  ${index === selectedIndex
                    ? 'bg-accent-primary/20 border border-accent-primary'
                    : 'bg-bg-surface-soft hover:bg-bg-elevated'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="language" className="text-label">
                    {result.type}
                  </Badge>
                  <span className="text-body-small text-text-secondary">{result.roomName}</span>
                </div>
                <p
                  className="text-body-small text-text-primary line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: result.highlight }}
                />
              </button>
            ))}
          </div>
        )}

        {!loading && query.length >= 2 && results.length === 0 && (
          <div className="p-4 text-center">
            <p className="text-body-small text-text-muted">No results found</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

