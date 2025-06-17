'use client';

import Link from 'next/link';
import { Settings2, UserCircle2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TopNavigationBar() {
  // Assuming a generic user ID for profile link for now
  const userId = 'user1'; 

  return (
    <header className="fixed top-0 left-0 right-0 h-[60px] bg-nav-background border-b border-border shadow-sm z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <Link href="/" passHref>
          <div className="flex items-center gap-2 cursor-pointer">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-headline font-semibold text-foreground">PollitGo</h1>
          </div>
        </Link>
        <div className="flex items-center space-x-2">
          <Link href="/settings" passHref>
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings2 className="h-6 w-6 text-nav-foreground" />
            </Button>
          </Link>
          <Link href={`/profile/${userId}`} passHref>
            <Button variant="ghost" size="icon" aria-label="Profile">
              <UserCircle2 className="h-6 w-6 text-nav-foreground" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
