
'use client';

import Link from 'next/link';
import { Settings2, UserCircle2, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
// Firebase auth and signOut are removed
// import { auth } from '@/lib/firebase';
// import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function TopNavigationBar() {
  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    // Firebase signOut logic removed
    toast({ title: 'Logout Functionality Disabled', description: 'Firebase Auth removed. Implement new logout logic.' });
    // router.push('/login'); // Or homepage, as login is also disabled
    router.push('/');
  };

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
          {authLoading ? (
            <Button variant="ghost" size="icon" disabled>
              <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-nav-foreground" />
            </Button>
          ) : authUser ? (
            <>
              <Link href="/settings" passHref>
                <Button variant="ghost" size="icon" aria-label="Settings">
                  <Settings2 className="h-5 w-5 sm:h-6 sm:w-6 text-nav-foreground" />
                </Button>
              </Link>
              <Link href={`/profile/${authUser.uid}`} passHref>
                <Button variant="ghost" size="icon" aria-label="Profile">
                  {authUser.photoURL ? (
                     <Avatar className="h-6 w-6 sm:h-7 sm:w-7">
                        <AvatarImage src={authUser.photoURL} alt={authUser.displayName || 'User'} data-ai-hint="profile avatar"/>
                        <AvatarFallback>{authUser.displayName ? authUser.displayName.substring(0,1).toUpperCase() : <UserCircle2 />}</AvatarFallback>
                      </Avatar>
                  ) : (
                    <UserCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-nav-foreground" />
                  )}
                </Button>
              </Link>
              {/* Logout button behavior changed as Firebase auth is removed */}
              <Button variant="ghost" size="icon" aria-label="Logout (Disabled)" onClick={() => toast({ title: 'Logout Disabled', description: 'Firebase Auth removed.'})}>
                 <UserCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-nav-foreground opacity-50" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button variant="ghost" aria-label="Login (Disabled)">
                  <LogIn className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 opacity-50" />
                  Login
                </Button>
              </Link>
              <Link href="/signup" passHref>
                <Button variant="default" aria-label="Sign Up (Disabled)" className="bg-primary hover:bg-primary/90 text-primary-foreground opacity-50 cursor-not-allowed">
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
