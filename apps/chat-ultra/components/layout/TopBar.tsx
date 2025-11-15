'use client';

import { Avatar } from '@/components/ui/Avatar';
import { supabase } from '@/lib/auth/config';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function TopBar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="h-14 bg-bg-surface border-b border-border-default flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <h1 className="text-h4 font-semibold text-text-primary">Chat Ultra</h1>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <Avatar
              name={user.email || 'User'}
              size="md"
            />
            <button
              onClick={handleLogout}
              className="text-body-small text-text-secondary hover:text-text-primary transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}

