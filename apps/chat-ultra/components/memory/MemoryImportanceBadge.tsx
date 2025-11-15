"use client";

import { Badge } from "@/components/ui/Badge";

interface MemoryImportanceBadgeProps {
  importance: number;
}

export function MemoryImportanceBadge({
  importance,
}: MemoryImportanceBadgeProps) {
  const getVariant = (imp: number): "active" | "language" | "inactive" => {
    if (imp >= 0.8) return "active";
    if (imp >= 0.5) return "language";
    return "inactive";
  };

  const getLabel = (imp: number): string => {
    if (imp >= 0.8) return "高";
    if (imp >= 0.5) return "中";
    return "低";
  };

  return (
    <Badge variant={getVariant(importance)}>
      {getLabel(importance)}
    </Badge>
  );
}

