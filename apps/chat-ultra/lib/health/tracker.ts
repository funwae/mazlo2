'use client';

let currentSessionId: string | null = null;
let inactivityTimer: NodeJS.Timeout | null = null;
const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

export async function startSession(roomId?: string): Promise<string | null> {
  try {
    const res = await fetch('/api/health/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room_id: roomId }),
    });

    if (res.ok) {
      const data = await res.json();
      currentSessionId = data.session.id;
      resetInactivityTimer();
      return currentSessionId;
    }
  } catch (error) {
    console.error('Error starting session:', error);
  }
  return null;
}

export async function endSession(): Promise<void> {
  if (!currentSessionId) return;

  try {
    await fetch(`/api/health/sessions/${currentSessionId}`, {
      method: 'PATCH',
    });
    currentSessionId = null;
  } catch (error) {
    console.error('Error ending session:', error);
  }

  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }
}

export function resetInactivityTimer(): void {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }

  inactivityTimer = setTimeout(() => {
    endSession();
  }, INACTIVITY_TIMEOUT);
}

// Call this on user activity
export function trackActivity(): void {
  if (currentSessionId) {
    resetInactivityTimer();
  }
}

