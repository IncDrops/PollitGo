'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusSquare, MessageCircle, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/new-poll', label: 'New Poll', icon: PlusSquare },
  { href: '/messages', label: 'Messages', icon: MessageCircle },
  { href: '/notifications', label: 'Notifications', icon: Bell },
];

export default function BottomNavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[70px] bg-nav-background border-t border-border shadow-top z-50">
      <div className="flex justify-around items-center h-full max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.label} legacyBehavior>
              <a
                className={cn(
                  'flex flex-col items-center justify-center text-xs p-2 rounded-md transition-colors',
                  isActive ? 'text-nav-active' : 'text-nav-foreground hover:text-nav-active/80'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className={cn('w-6 h-6 mb-0.5', isActive ? 'fill-nav-active/20' : '')} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
