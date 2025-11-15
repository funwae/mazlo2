'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface GlobalShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: (router: ReturnType<typeof useRouter>) => void;
}

export const GLOBAL_SHORTCUTS: GlobalShortcut[] = [
  {
    key: 'k',
    ctrl: true,
    description: 'Open command palette',
    action: (router) => {
      // This will be handled by the layout component
      window.dispatchEvent(new CustomEvent('openCommandPalette'));
    },
  },
  {
    key: 'n',
    ctrl: true,
    shift: true,
    description: 'Create new Room',
    action: (router) => {
      router.push('/app/rooms/new');
    },
  },
  {
    key: 't',
    ctrl: true,
    shift: true,
    description: 'Create new Thread',
    action: (router) => {
      // This will be handled by the room page
      window.dispatchEvent(new CustomEvent('createNewThread'));
    },
  },
  {
    key: 'p',
    ctrl: true,
    shift: true,
    description: 'Pin message',
    action: (router) => {
      // This will be handled by the room page
      window.dispatchEvent(new CustomEvent('pinSelectedMessage'));
    },
  },
  {
    key: 'o',
    ctrl: true,
    shift: true,
    description: 'Toggle Mazlo panel',
    action: (router) => {
      window.dispatchEvent(new CustomEvent('toggleMazloPanel'));
    },
  },
  {
    key: 'b',
    ctrl: true,
    shift: true,
    description: 'Open Bridge mode',
    action: (router) => {
      window.dispatchEvent(new CustomEvent('toggleBridgeMode'));
    },
  },
];

export function useGlobalShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs, textareas, or contenteditable elements
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of GLOBAL_SHORTCUTS) {
        const ctrlMatch = shortcut.ctrl
          ? e.ctrlKey || e.metaKey
          : !(e.ctrlKey || e.metaKey);
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          e.preventDefault();
          shortcut.action(router);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);
}

