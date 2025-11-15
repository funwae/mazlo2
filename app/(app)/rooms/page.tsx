'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

interface Room {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'archived';
  summary?: string;
  updatedAt: string;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/rooms');
      const data = await res.json();
      setRooms(data.rooms || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: roomName }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setRoomName('');
        fetchRooms();
      }
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-body text-text-secondary">Loading rooms...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h1 font-semibold text-text-primary">Rooms</h1>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Create Room
        </Button>
      </div>

      {rooms.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-body text-text-secondary mb-4">No rooms yet</p>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            Create your first room
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <Link key={room.id} href={`/app/rooms/${room.id}`}>
              <Card hover className="p-4 h-full">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-h4 font-semibold text-text-primary">{room.name}</h3>
                  <Badge variant={room.status === 'active' ? 'active' : 'paused'}>
                    {room.status}
                  </Badge>
                </div>
                {room.summary && (
                  <p className="text-body-small text-text-secondary line-clamp-2">
                    {room.summary}
                  </p>
                )}
                <p className="text-label text-text-muted mt-2">
                  Updated {new Date(room.updatedAt).toLocaleDateString()}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setRoomName('');
        }}
        title="Create New Room"
      >
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <Input
            label="Room Name"
            placeholder="My Project Room"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
            autoFocus
          />
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowCreateModal(false);
                setRoomName('');
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
    </div>
  );
}

