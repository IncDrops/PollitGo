// src/components/layout/TopNavigationBar.tsx
'use client';

import Link from 'next/link';
import { Settings2, UserCircle2, LogIn, UserPlus, Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function TopNavigationBar() {
  const { user: appUser, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut({ redirect: false }); 
    toast({ title: 'Logged Out', description: "You have been successfully logged out." });
    router.push('/'); 
  };

  const royalBlueColor = '#5271ff'; // Royal Blue

  return (
    <header className="fixed top-0 left-0 right-0 h-[80px] bg-nav-background border-b border-border shadow-sm z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <Link href="/" passHref>
          <div className="flex flex-col items-start cursor-pointer">
            <h1 className="text-3xl font-headline font-bold leading-none">
              <span style={{ color: royalBlueColor }}>Poll</span>
              <span style={{ color: '#f6bc18' }}>it</span>
              <span style={{ color: royalBlueColor }}>A</span>
              <span style={{ color: '#00bf63' }}>Go</span>
            </h1>
            <p className="text-xs font-alice -mt-0.5 text-foreground" style={{ letterSpacing: '0.05em' }}>
              THE 2nd OPINION APP
            </p>
          </div>
        </Link>
        <div className="flex items-center space-x-1 sm:space-x-2">
          {authLoading ? (
            <Button variant="ghost" size="icon" disabled>
              <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-nav-foreground" />
            </Button>
          ) : isAuthenticated && appUser ? (
            <>
              <Link href="/settings" passHref>
                <Button variant="ghost" size="icon" aria-label="Settings">
                  <Settings2 className="h-5 w-5 sm:h-6 sm:w-6 text-nav-foreground" />
                </Button>
              </Link>
              <Link href={`/profile/${appUser.id}`} passHref>
                <Button variant="ghost" size="icon" aria-label="Profile">
                  {appUser.image ? (
                     <Avatar className="h-6 w-6 sm:h-7 sm:w-7">
                        <AvatarImage src={appUser.image} alt={appUser.name || 'User'} data-ai-hint="profile avatar"/>
                        <AvatarFallback>{appUser.name ? appUser.name.substring(0,1).toUpperCase() : <UserCircle2 />}</AvatarFallback>
                      </Avatar>
                  ) : (
                    <UserCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-nav-foreground" />
                  )}
                </Button>
              </Link>
              <Button variant="ghost" size="icon" aria-label="Logout" onClick={handleLogout}>
                 <LogOut className="h-5 w-5 sm:h-6 sm:w-6 text-nav-foreground" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" aria-label="Login" onClick={() => signIn()}>
                <LogIn className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Login
              </Button>
              <Link href="/signup" passHref>
                <Button variant="default" aria-label="Sign Up" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <UserPlus className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
