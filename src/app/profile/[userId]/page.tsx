
'use client';

import React, { useState, useEffect, use } from 'react';
import type { User, Poll } from "@/types";
import { mockUsers, mockPolls } from "@/lib/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Settings, MessageSquare, Edit3, ChevronLeft, Share2, Search, CalendarDays, MapPin, Link as LinkIconLucide, Flame } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import PollFeed from '@/components/polls/PollFeed';
import useAuth from '@/hooks/useAuth';

async function getUserData(userId: string): Promise<{ user: User | null; polls: Poll[] }> {
  console.log(`[UserProfilePage] getUserData called for userId: ${userId}`);
  const user = mockUsers.find(u => u.id === userId) || null;
  
  let polls: Poll[] = [];
  if (user) {
    polls = mockPolls.filter(p => p.creator.id === userId).map(p => ({...p}));
    console.log(`[UserProfilePage] Found ${polls.length} polls for user ${userId}`);
  } else {
    console.log(`[UserProfilePage] User not found for ID: ${userId}`);
  }

  return { user, polls };
}

const urlSafeText = (text: string, maxLength: number = 15): string => {
  const cleanedText = text.replace(/[^a-zA-Z0-9\\s]/g, "").substring(0, maxLength);
  return encodeURIComponent(cleanedText);
};

export default function UserProfilePage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const resolvedPageParams = use(params); 

  const { user: authUser, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<{ user: User | null; polls: Poll[] }>({ user: null, polls: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (resolvedPageParams && resolvedPageParams.userId) {
      setIsLoading(true);
      getUserData(resolvedPageParams.userId)
        .then(data => {
          setUserData(data);
          if (!data.user) {
            console.warn(`[UserProfilePage] User not found for ID ${resolvedPageParams.userId} after fetch.`);
            toast({ 
              title: "User Not Found", 
              description: `Profile for ID ${resolvedPageParams.userId} could not be loaded.`, 
              variant: "destructive" 
            });
          }
        })
        .catch(error => {
          console.error("[UserProfilePage] Error fetching user data:", error);
          toast({ title: "Error", description: "Could not load user profile.", variant: "destructive" });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false); 
      console.warn("[UserProfilePage] resolvedPageParams.userId is not available.");
      toast({ title: "Error", description: "User ID not provided for profile.", variant: "destructive" });
    }    
  }, [resolvedPageParams, toast]);

  const user = userData.user;
  const userPolls = userData.polls;

  if (isLoading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-destructive">
        User profile could not be loaded. They may not exist.
      </div>
    );
  }
  
  const isOwnProfile = authUser?.uid === user.id;

  const handleShareProfile = async () => {
    if (typeof window === 'undefined') return;
    const shareUrl = window.location.href;
    const shareData = {
      title: `${user.name}'s Profile on PollitGo`,
      text: `Check out ${user.name}'s profile and polls!`,
      url: shareUrl,
    };
    
    let sharedNatively = false;
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        sharedNatively = true;
      } catch (error: any) {
        if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
            console.error('Error sharing profile via native share:', error);
        }
      }
    }

    if (!sharedNatively) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({ title: "Link Copied", description: "Profile link copied to clipboard."});
      } catch (copyError) {
        toast({ title: "Error", description: "Could not copy profile link.", variant: "destructive"});
        console.error("Error copying profile link:", copyError);
      }
    }
  };
  
  const coverPhotoUrl = `https://placehold.co/1200x400.png?text=${urlSafeText(user.name + " Cover", 25)}`;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-[80px] sm:top-0 z-40 bg-background/80 backdrop-blur-sm border-b"> {/* Adjusted top for main nav */}
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

      <main className="flex-grow pt-0"> {/* Removed pt-14 as header is sticky and handles its own space */}
        <div className="relative h-48 w-full bg-muted">
          <Image
            src={coverPhotoUrl} 
            alt={`${user.name}'s cover photo`}
            layout="fill"
            objectFit="cover"
            priority 
            data-ai-hint="profile cover"
          />
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 transform">
            <Avatar className="h-32 w-32 border-4 border-background ring-2 ring-primary shadow-lg">
              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile avatar" />
              <AvatarFallback className="text-4xl">{user.name.split(" ").map(n => n[0]).join("").toUpperCase()}</AvatarFallback>
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
                <Button variant="outline" onClick={() => router.push('/settings/profile-edit')}>
                  <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
                <Button variant="outline" onClick={() => router.push('/settings')}>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Button>
              </>
            ) : (
              <>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <UserPlus className="mr-2 h-4 w-4" /> Follow
                </Button>
                <Button variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" /> Message
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
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 rounded-none border-b sticky top-[136px] sm:top-[56px] z-30 bg-background/95 backdrop-blur-sm"> {/* Adjusted top for both navs */}
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
                  <CardDescription>This user hasn't created any polls. Check back later!</CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="voted">
            <Card className="shadow-none rounded-none border-0">
                <CardHeader className="items-center text-center pt-12 pb-8">
                    <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <CardTitle className="text-xl">No Voted Polls Yet</CardTitle>
                    <CardDescription>This user hasn't voted on any polls yet.</CardDescription>
                </CardHeader>
            </Card>
          </TabsContent>
          <TabsContent value="media">
             <Card className="shadow-none rounded-none border-0">
                <CardHeader className="items-center text-center pt-12 pb-8">
                    <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <CardTitle className="text-xl">No Media Polls Yet</CardTitle>
                    <CardDescription>This user hasn't created any polls with media.</CardDescription>
                </CardHeader>
            </Card>
          </TabsContent>
           <TabsContent value="liked" className="hidden sm:block">
             <Card className="shadow-none rounded-none border-0">
                <CardHeader className="items-center text-center pt-12 pb-8">
                    <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <CardTitle className="text-xl">No Liked Polls Yet</CardTitle>
                    <CardDescription>This user hasn't liked any polls yet.</CardDescription>
                </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

const PollCardFeedWrapper: React.FC<{ initialPolls: Poll[], userIdForFeed?: string, feedType?: string }> = ({ initialPolls }) => {
  if (!initialPolls || initialPolls.length === 0) {
    return <p className="text-center py-8 text-muted-foreground">No polls to display for this feed.</p>;
  }
  
  const [polls, setPolls] = useState(initialPolls.map(p => ({...p})));
  const { user: authUser } = useAuth(); // Use authUser from useAuth directly
  const { toast } = useToast();

  const MIN_PAYOUT_PER_VOTER = 0.10; 
  const CREATOR_PLEDGE_SHARE_FOR_VOTERS = 0.50; 

  const handleVote = (pollId: string, optionId: string) => {
    const pollIndex = polls.findIndex(p => p.id === pollId);
    if (pollIndex === -1) return;

    const pollToUpdate = polls[pollIndex];
    if (pollToUpdate.isVoted) return;

    const targetOption = pollToUpdate.options.find(opt => opt.id === optionId);
    if (!targetOption) return;

    if (pollToUpdate.pledgeAmount && pollToUpdate.pledgeAmount > 0) {
      const amountToDistributeToVoters = pollToUpdate.pledgeAmount * CREATOR_PLEDGE_SHARE_FOR_VOTERS;
      const potentialVotesForThisOption = targetOption.votes + 1;
       if ((amountToDistributeToVoters / potentialVotesForThisOption) < MIN_PAYOUT_PER_VOTER && potentialVotesForThisOption > 0) {
        toast({
          title: "Low Payout Warning",
          description: `Your vote is counted! However, due to the current pledge and number of voters for this option, your potential PollitPoint payout might be below $${MIN_PAYOUT_PER_VOTER.toFixed(2)}.`,
          variant: "default",
          duration: 7000,
        });
      }
    }
    
    setPolls(prevPolls =>
      prevPolls.map(p => {
        if (p.id === pollId) {
          return {
            ...p,
            isVoted: true,
            votedOptionId: optionId,
            totalVotes: p.totalVotes + 1,
            options: p.options.map(opt =>
              opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            ),
          };
        }
        return p;
      })
    );
  };

  const handlePollActionComplete = (pollIdToRemove: string) => {
    setPolls(prevPolls => prevPolls.filter(p => p.id !== pollIdToRemove));
  };
  
  const handlePledgeOutcome = (pollId: string, outcome: 'accepted' | 'tipped_crowd') => {
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
        currentUser={authUser} // Pass authUser as currentUser
      />
    </div>
  );
};
