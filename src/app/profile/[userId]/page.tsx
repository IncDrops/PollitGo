
'use client';

import React, { useState, useEffect } from 'react';
import type { User, Poll } from "@/types";
import { mockUsers, mockPolls } from "@/lib/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, MessageSquare, Edit3, ChevronLeft, Share2, Search, CalendarDays, MapPin, Link as LinkIconLucide, Flame, AlertCircle, Loader2, UserPlus, LogIn } from "lucide-react";
import Image from "next/image";
import type { UserProfile as AppUserProfileType } from '@/types';
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import PollFeed from '@/components/polls/PollFeed';
import useAuth from '@/hooks/useAuth'; // Updated to NextAuth useAuth
import NextLink from 'next/link';
import { signIn } from 'next-auth/react';


async function getUserData(userId: string): Promise<{ user: User | null; polls: Poll[] }> {
  console.warn(`[UserProfilePage] Using mock data for userId: ${userId}`);
  const user = mockUsers.find(u => u.id === userId) || null;
  
  let polls: Poll[] = [];
  if (user) {
    // Ensure polls are fresh copies for independent state updates if needed later
    polls = mockPolls.filter(p => p.creator.id === userId).map(p => ({...p}));
  }
  return { user, polls };
}

const urlSafeText = (text: string, maxLength: number = 15): string => {
  const cleanedText = text.replace(/[^a-zA-Z0-9\s]/g, "").substring(0, maxLength);
  return encodeURIComponent(cleanedText);
};

export default function UserProfilePage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const { toast } = useToast();  
  
  const { user: authUser, loading: authLoading, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState<{ user: User | null; polls: Poll[] }>({ user: null, polls: [] });
  const [pageLoading, setPageLoading] = useState(true); // Renamed for clarity

  useEffect(() => {
    if (params && params.userId) {
      setPageLoading(true);
      getUserData(params.userId)
        .then(data => {
          setUserData(data);          
          if (!data.user) {
            toast({
              title: "User Not Found",
              description: `Profile for ID ${params.userId} could not be loaded from mock data.`,
              variant: "destructive"
            });
          }
        })
        .catch(error => {
          console.error("[UserProfilePage] Error fetching mock user data:", error);
          toast({ title: "Error", description: "Could not load user profile.", variant: "destructive" });
        })
        .finally(() => {
          setPageLoading(false);
        });
    } else {
      setPageLoading(false);
      toast({ title: "Error", description: "User ID not provided for profile.", variant: "destructive" });
    }    
  }, [params, toast]);

  const user = userData.user;
  const userPolls = userData.polls;

  if (pageLoading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
       <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardHeader>
            <AlertCircle className="mx-auto h-16 w-16 text-destructive mb-4" />
            <CardTitle className="text-2xl">User Not Found</CardTitle>
            <CardDescription>
                The profile for user ID <span className="font-mono bg-muted px-1 rounded">{params.userId}</span> could not be loaded. They may not exist or there was an issue.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <NextLink href="/">Go to Homepage</NextLink>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  const isOwnProfile = isAuthenticated && authUser?.id === user.id;

  const handleShareProfile = async () => {
    if (typeof window === 'undefined') return;
    const shareUrl = window.location.href;
    const shareData = {
      title: `${user.name}'s Profile on PollitAGo`,
      text: `Check out ${user.name}'s profile and polls on PollitAGo!`,
      url: shareUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({ title: "Link Copied", description: "Profile link copied to clipboard."});
      }
    } catch (error) {
       console.error("Error sharing profile:", error);
       toast({ title: "Error", description: "Could not share profile link.", variant: "destructive"});
    }
  };
  
  const coverPhotoUrl = `https://placehold.co/1200x400.png?text=${urlSafeText(user.name + " Cover", 25)}`;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-[80px] sm:top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto h-14 flex items-center justify-between px-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold truncate">{user.name}</h1>
          <Button variant="ghost" size="icon" onClick={handleShareProfile}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-grow pt-0">
        <div className="relative h-48 w-full bg-muted">
          <Image
            src={coverPhotoUrl} 
            alt={`${user.name}'s cover photo`}
            fill
            style={{objectFit: 'cover'}}
            priority 
            data-ai-hint="profile cover"
          />
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 transform">
            <Avatar className="h-32 w-32 border-4 border-background ring-2 ring-primary shadow-lg">
              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile avatar" />
              <AvatarFallback className="text-4xl">{user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U"}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="pt-20 pb-8 text-center border-b">
          <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
          
          <p className="mt-2 text-sm text-foreground max-w-md mx-auto px-4">
            Lover of polls, opinions, and good conversations. Helping the world make up its mind, one poll at a time! 🚀 #PollMaster
          </p>
          <div className="mt-3 flex justify-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" />Planet Earth</span>
            <span className="flex items-center"><CalendarDays className="h-4 w-4 mr-1" />Joined {new Date(2023, Math.floor(Math.random()*12), Math.floor(Math.random()*28)+1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
          <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center text-xs text-primary hover:underline">
            <LinkIconLucide className="h-3 w-3 mr-1" /> example.com
          </a>

          <div className="mt-4 flex justify-center space-x-2 sm:space-x-4">
            {isOwnProfile ? (
              <>
                <Button variant="outline" onClick={() => router.push('/settings')}>
                  <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
                <Button variant="outline" onClick={() => router.push('/settings')}>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Button>
              </>
            ) : (
              <>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={!isAuthenticated} onClick={() => !isAuthenticated && signIn()}>
                  {isAuthenticated ? <UserPlus className="mr-2 h-4 w-4" /> : <LogIn className="mr-2 h-4 w-4" /> }
                  {isAuthenticated ? 'Follow' : 'Login to Follow'}
                </Button>
                <Button variant="outline" disabled={!isAuthenticated} onClick={() => !isAuthenticated && signIn()}>
                   {isAuthenticated ? <MessageSquare className="mr-2 h-4 w-4" /> : <LogIn className="mr-2 h-4 w-4" /> }
                   {isAuthenticated ? 'Message' : 'Login to Message'}
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex justify-around border-b pb-3">
            <div className="text-center">
                <p className="font-semibold text-lg text-foreground">{userPolls.length.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Polls</p>
            </div>
            <div className="text-center">
                <p className="font-semibold text-lg text-foreground">{(Math.floor(Math.random() * 5000) + 100).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
                <p className="font-semibold text-lg text-foreground">{(Math.floor(Math.random() * 1000) + 50).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Following</p>
            </div>
             <div className="text-center">
                <p className="font-semibold text-lg text-foreground">{(user.pollitPointsBalance || 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">PollitPoints</p>
            </div>
        </div>

        <Tabs defaultValue="created" className="w-full mt-0">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 rounded-none border-b sticky top-[136px] sm:top-[56px] z-30 bg-background/95 backdrop-blur-sm">
            <TabsTrigger value="created">Created</TabsTrigger>
            <TabsTrigger value="voted">Voted</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="liked" className="hidden sm:inline-flex">Liked</TabsTrigger>
          </TabsList>
          <TabsContent value="created" className="mt-0">
            {userPolls.length > 0 ? (
              <PollCardFeedWrapper 
                initialPolls={userPolls} 
                userIdForFeed={user.id} 
                feedType="userCreated"
              />
            ) : (
              <Card className="shadow-none rounded-none border-0">
                <CardHeader className="items-center text-center pt-12 pb-8">
                   <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <CardTitle className="text-xl">No Polls Created Yet</CardTitle>
                  <CardDescription>{user.name} hasn't created any polls. Check back later!</CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="voted">
            <Card className="shadow-none rounded-none border-0 items-center text-center pt-12 pb-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4 mx-auto" />
                <CardTitle className="text-xl">Voted Polls Unavailable</CardTitle>
                <CardDescription>This feature requires login and database integration to track votes.</CardDescription>
                 {!isAuthenticated && (
                    <Button onClick={() => signIn()} className="mt-4">
                        <LogIn className="mr-2 h-4 w-4" /> Login to see Voted Polls
                    </Button>
                )}
            </Card>
          </TabsContent>
          <TabsContent value="media">
             <Card className="shadow-none rounded-none border-0 items-center text-center pt-12 pb-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4 mx-auto" />
                <CardTitle className="text-xl">Media Feed Unavailable</CardTitle>
                <CardDescription>This feature requires login and database integration to show media-specific polls.</CardDescription>
                 {!isAuthenticated && (
                    <Button onClick={() => signIn()} className="mt-4">
                        <LogIn className="mr-2 h-4 w-4" /> Login to see Media Feed
                    </Button>
                )}
            </Card>
          </TabsContent>
           <TabsContent value="liked" className="hidden sm:block">
             <Card className="shadow-none rounded-none border-0 items-center text-center pt-12 pb-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4 mx-auto" />
                <CardTitle className="text-xl">Liked Polls Unavailable</CardTitle>
                <CardDescription>This feature requires login and database integration to track liked polls.</CardDescription>
                {!isAuthenticated && (
                    <Button onClick={() => signIn()} className="mt-4">
                        <LogIn className="mr-2 h-4 w-4" /> Login to see Liked Polls
                    </Button>
                )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

const PollCardFeedWrapper: React.FC<{ initialPolls: Poll[], userIdForFeed?: string, feedType?: string }> = ({ initialPolls }) => {
  console.log('PollCardFeedWrapper rendering'); // Added console log
  if (!initialPolls || initialPolls.length === 0) {
    return <p className="text-center py-8 text-muted-foreground">No polls to display for this feed.</p>;
  }
  
  // Local state for polls within this wrapper for potential local modifications
  const [polls, setPolls] = useState(() => initialPolls.map(p => ({...p})));
  const { user: authUser, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const MIN_PAYOUT_PER_VOTER = 0.10; 
  const CREATOR_PLEDGE_SHARE_FOR_VOTERS = 0.50; 

  const handleVote = (pollId: string, optionId: string) => {
    if (!isAuthenticated) {
        toast({title: "Login Required", description: "Please login to vote.", variant: "destructive"});
        return;
    }
    setPolls(prevPolls =>
      prevPolls.map(p => {
        if (p.id === pollId && !p.isVoted) {
          const newTotalVotes = p.totalVotes + 1;
          const updatedOptions = p.options.map(opt =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          );
          const votedOption = updatedOptions.find(opt => opt.id === optionId);
          if (p.pledgeAmount && p.pledgeAmount > 0 && votedOption) {
            const amountToDistributeToVoters = p.pledgeAmount * CREATOR_PLEDGE_SHARE_FOR_VOTERS;
            if ((amountToDistributeToVoters / votedOption.votes) < MIN_PAYOUT_PER_VOTER && votedOption.votes > 0) {
              toast({
                title: "Low Payout Warning",
                description: `Your vote is counted! However, due to the current pledge and number of voters for this option, your potential PollitPoint payout might be below $${MIN_PAYOUT_PER_VOTER.toFixed(2)}.`,
                variant: "default",
                duration: 7000,
              });
            } else {
              toast({ title: "Vote Cast!", description: "Your vote has been recorded." });
            }
          } else {
            toast({ title: "Vote Cast!", description: "Your vote has been recorded." });
          }
          return { ...p, options: updatedOptions, totalVotes: newTotalVotes, isVoted: true, votedOptionId: optionId };
        }
        return p;
      })
    );
  };

  const handlePollActionComplete = (pollIdToRemove: string) => {
    // This is a placeholder for actions like "hide poll" or "report poll"
    // For now, it just removes from local display if needed
    setPolls(prevPolls => prevPolls.filter(p => p.id !== pollIdToRemove));
    toast({title: "Action Noted", description: "This action would be processed by the backend."});
  };
  
  const handlePledgeOutcome = (pollId: string, outcome: 'accepted' | 'tipped_crowd') => {
     if (!isAuthenticated || !authUser || polls.find(p=>p.id === pollId)?.creator.id !== authUser.id) {
        toast({title: "Action Denied", description: "Only the poll creator can decide the pledge outcome.", variant: "destructive"});
        return;
    }
    setPolls(prevPolls =>
      prevPolls.map(p =>
        p.id === pollId ? { ...p, pledgeOutcome: outcome } : p
      )
    );
     toast({ title: `Pledge Outcome: ${outcome.replace('_', ' ')}`, description: "Action simulated on client."});
  };

  return (
    <div className="space-y-0 divide-y divide-border">
       <PollFeed 
        staticPolls={polls} 
        onVoteCallback={handleVote}
        onPollActionCompleteCallback={handlePollActionComplete}
        onPledgeOutcomeCallback={handlePledgeOutcome}
        currentUser={authUser} // Pass authenticated user from hook
      />
    </div>
  );
};


    