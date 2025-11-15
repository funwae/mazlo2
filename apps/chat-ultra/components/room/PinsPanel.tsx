"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CreatePinModal } from "./CreatePinModal";

interface Pin {
  id: string;
  title: string;
  tag: "decision" | "insight" | "spec" | "link";
  messageId: string;
  createdAt: string;
}

interface PinsPanelProps {
  roomId: string;
  onPinClick?: (pin: Pin) => void;
}

export function PinsPanel({ roomId, onPinClick }: PinsPanelProps) {
  const [pins, setPins] = useState<Pin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  useEffect(() => {
    fetchPins();
  }, [roomId]);

  const fetchPins = async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}/pins`);
      if (response.ok) {
        const data = await response.json();
        setPins(data.pins || []);
      }
    } catch (error) {
      console.error("Failed to fetch pins:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePin = async (pinData: {
    title: string;
    tag: "decision" | "insight" | "spec" | "link";
  }) => {
    if (!selectedMessageId) return;

    try {
      const response = await fetch("/api/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: roomId,
          message_id: selectedMessageId,
          title: pinData.title,
          tag: pinData.tag,
        }),
      });

      if (response.ok) {
        await fetchPins();
        setShowCreateModal(false);
        setSelectedMessageId(null);
      }
    } catch (error) {
      console.error("Failed to create pin:", error);
    }
  };

  const handleDeletePin = async (pinId: string) => {
    try {
      const response = await fetch(`/api/pins/${pinId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchPins();
      }
    } catch (error) {
      console.error("Failed to delete pin:", error);
    }
  };

  const tagColors = {
    decision: "accent-primary",
    insight: "accent-info",
    spec: "accent-warning",
    link: "accent-secondary",
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <p className="text-body-small text-text-muted">加载中...</p>
      </div>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border-default">
          <h3 className="text-h4 font-semibold text-text-primary">Pins</h3>
          <Button
            size="sm"
            onClick={() => {
              // This would typically be triggered from a message action
              // For now, we'll show the modal
              setShowCreateModal(true);
            }}
          >
            + New
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {pins.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-body-small text-text-muted">No pins yet</p>
            </div>
          ) : (
            <div className="space-y-2">
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
                      <p className="text-body-small text-text-primary line-clamp-2">
                        {pin.title}
                      </p>
                    </div>
                    <Button
                      variant="text"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-label p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePin(pin.id);
                      }}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreatePinModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedMessageId(null);
        }}
        onSubmit={handleCreatePin}
      />
    </>
  );
}

