"use client";

import { Badge } from "@/components/ui/Badge";

interface MemoryScopeTagProps {
  scope: string;
}

export function MemoryScopeTag({ scope }: MemoryScopeTagProps) {
  const labels: Record<string, string> = {
    thread: "线程",
    room: "房间",
    global: "全局",
    system: "系统",
  };

  const variants: Record<string, "active" | "language" | "paused"> = {
    thread: "language",
    room: "active",
    global: "active",
    system: "paused",
  };

  return (
    <Badge variant={variants[scope] || "paused"}>
      {labels[scope] || scope}
    </Badge>
  );
}

