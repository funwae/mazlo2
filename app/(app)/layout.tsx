'use client';

import { AppShell } from '@/components/layout/AppShell';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { startSession, endSession, trackActivity } from '@/lib/health/tracker';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { useGlobalShortcuts } from '@/lib/shortcuts/global';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  useGlobalShortcuts();

  useEffect(() => {
    const handleOpenCommandPalette = () => {
      setShowCommandPalette(true);
    };

    window.addEventListener('openCommandPalette', handleOpenCommandPalette);
    return () => window.removeEventListener('openCommandPalette', handleOpenCommandPalette);
  }, []);

  useEffect(() => {
    const supabase = createClientComponentClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
      } else {
        // Start session tracking
        const roomId = pathname?.match(/\/rooms\/([^/]+)/)?.[1];
        startSession(roomId);
      }
    });

    // Track user activity
    const handleActivity = () => trackActivity();
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);

    // End session on page unload
    const handleBeforeUnload = () => {
      endSession();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      endSession();
    };
  }, [router, pathname]);

  const handleCommandSelect = (result: any) => {
    if (result.type === 'room') {
      router.push(`/app/rooms/${result.roomId}`);
    } else if (result.type === 'message') {
      router.push(`/app/rooms/${result.roomId}?thread=${result.threadId}&message=${result.id}`);
    } else {
      router.push(`/app/rooms/${result.roomId}`);
    }
  };

  return (
    <>
      <AppShell>{children}</AppShell>
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onSelect={handleCommandSelect}
      />
    </>
  );
}
