
'use client';

import Link from 'next/link';
import { Settings2, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TopNavigationBar() {
  const userId = 'user1'; // Assuming a generic user ID for profile link for now

  return (
    <header className="fixed top-0 left-0 right-0 h-[80px] bg-nav-background border-b border-border shadow-sm z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <Link href="/" passHref>
          <div className="flex flex-col items-start cursor-pointer">
            <h1 className="text-3xl font-headline font-bold leading-none">
              <span style={{ color: '#0629be' }}>Poll</span>
              <span style={{ color: '#f6bc18' }}>it</span>
              <span style={{ color: '#0629be' }}>A</span>
              <span style={{ color: '#00bf63' }}>Go</span>
            </h1>
            <p className="text-xs font-alice -mt-0.5 text-foreground" style={{ letterSpacing: '0.05em' }}>
              THE 2nd OPINION APP
            </p>
          </div>
        </Link>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Link href="/settings" passHref>
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings2 className="h-5 w-5 sm:h-6 sm:w-6 text-nav-foreground" />
            </Button>
          </Link>
          <Link href={`/profile/${userId}`} passHref>
            <Button variant="ghost" size="icon" aria-label="Profile">
              <UserCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-nav-foreground" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
