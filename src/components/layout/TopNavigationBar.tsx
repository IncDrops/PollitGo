
'use client';

import Link from 'next/link';
import { Settings2, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GreenCheckDot = () => (
  <svg 
    width="1em" 
    height="1em" 
    viewBox="0 0 28 28"
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    style={{ 
      display: 'inline-block', 
      verticalAlign: 'middle',
      transform: 'translateY(-0.15em)', 
      marginLeft: '-0.1em', 
      marginRight: '0.05em' 
    }}
    className="h-[0.6em] w-[0.6em]"
  >
    <circle cx="14" cy="14" r="12" fill="#00bf63"/>
    <path d="M9 14.5L12.5 18L19 11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function TopNavigationBar() {
  const userId = 'user1'; // Assuming a generic user ID for profile link for now

  return (
    <header className="fixed top-0 left-0 right-0 h-[80px] bg-nav-background border-b border-border shadow-sm z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <Link href="/" passHref>
          <div className="flex flex-col items-start cursor-pointer">
            <h1 className="text-3xl font-headline font-bold leading-none">
              <span style={{ color: '#0629be' }}>Poll</span>
              <span style={{ color: '#f6bc18' }}>
                i<GreenCheckDot />t
              </span>
              <span style={{ color: '#0629be' }}>A</span>
              <span style={{ color: '#00bf63' }}>Go</span>
            </h1>
            <p className="text-xs font-alice -mt-0.5" style={{color: '#f6bc18', letterSpacing: '0.05em'}}>
              THE OFFICIAL 2nd OPINION APP
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
