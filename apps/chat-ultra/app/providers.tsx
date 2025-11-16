// Providers file - no longer needed for Convex
// Keeping file for potential future providers (e.g., theme, query client, etc.)

import { ReactNode } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // Convex removed - just pass through children
  return <>{children}</>;
}

