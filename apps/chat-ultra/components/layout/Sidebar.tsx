'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: '/app', label: 'Home', icon: '🏠' },
  { href: '/app/rooms', label: 'Rooms', icon: '💬' },
  { href: '/app/global', label: 'Mazlo Global', icon: '🌐' },
  { href: '/app/memories', label: 'Memories', icon: '🧠' },
  { href: '/app/settings', label: 'Settings', icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-bg-surface border-r border-border-default h-screen flex flex-col">
      <div className="p-4 border-b border-border-default">
        <h2 className="text-h4 font-semibold text-text-primary">Chat Ultra</h2>
      </div>
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'h-10 px-3 flex items-center gap-3 rounded-sm transition-colors',
                    'text-body text-text-secondary',
                    isActive
                      ? 'bg-[rgba(79,209,255,0.1)] text-text-primary border-l-2 border-accent-primary'
                      : 'hover:bg-[rgba(255,255,255,0.06)]'
                  )}
                >
                  {item.icon && <span className="text-lg">{item.icon}</span>}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

