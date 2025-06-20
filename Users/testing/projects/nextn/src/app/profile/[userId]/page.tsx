
'use client';

import React, { useState, useEffect } from 'react';
import type { User, Poll } from "@/types";
import { mockUsers, mockPolls } from "@/lib/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, MessageSquare, Edit3, ChevronLeft, Share2, Search, CalendarDays, MapPin, Link as LinkIconLucide, Flame, AlertCircle, Loader2, UserPlus, LogIn, UserCheck, UserX } from "lucide-react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation"; 
import { useToast } from "@/hooks/use-toast";
import PollFeed from '@/components/polls/PollFeed';
import useAuth from '@/hooks/useAuth';
import NextLink from 'next/link';
import { signIn } from 'next-auth/react';


async function getUserData(userId: string): Promise<{ user: User | null; polls: Poll[] }> {
  console.warn(`[UserProfilePage] Using mock data for userId: ${userId}`);
  const user = mockUsers.find(u => u.id === userId) || null;
  const freshUser = user ? {...user} : null;
  
  let polls: Poll[] = [];
  if (freshUser) {
    polls = mockPolls.filter(p => p.creator.id === userId).map(p => ({...p}));
  }
  return { user: freshUser, polls };
}

const urlSafeText = (text: string, maxLength: number = 15): string => {
  const cleanedText = text.replace(/[^a-zA-Z0-9\\s]/g, "").substring(0, maxLength);
  return encodeURIComponent(cleanedText);
};

export default function UserProfilePage() {
  const router = useRouter();
  const routeParams = useParams<{ userId: string }>(); 
  const userId = routeParams.userId;
  const { toast } = useToast();
  
  const { user: authUser, loading: authLoading, isAuthenticated } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPolls, setUserPolls] = useState<Poll[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false); 

  useEffect(() => {
    if (userId) {
      setPageLoading(true);
      getUserData(userId)
        .then(data => {
          setProfileUser(data.user);
          setUserPolls(data.polls);
          if (data.user) {
            setIsFollowing(data.user.isFollowedByCurrentUser || false);
          } else {
            toast({
              title: "User Not Found",
              description: `Profile for ID ${userId} could not be loaded.`,
              variant: "destructive"
            });
          }
        })
        .catch(error => {
          console.error("[UserProfilePage] Error fetching user data:", error);
          toast({ title: "Error", description: "Could not load user profile.", variant: "destructive" });
        })
        .finally(() => {
          setPageLoading(false);
        });
    } else {
      setPageLoading(false);
    }
  }, [userId, toast]);


  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      toast({ title: "Login Required", description: "Please login to follow users.", variant: "destructive" });
      signIn();
      return;
    }
    if (authUser?.id === profileUser?.id) {
      toast({ title: "Action Not Allowed", description: "You cannot follow yourself.", variant: "default" });
      return;
    }
    setIsFollowing(prev => !prev); 
    toast({ title: isFollowing ? `Unfollowed ${profileUser?.name}` : `Followed ${profileUser?.name}`, description: "This action is simulated." });
  };

  if (pageLoading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        Loading profile...
      </div>
    );
  }

  if (!profileUser) {
    return (
       <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardHeader>
            <AlertCircle className="mx-auto h-16 w-16 text-destructive mb-4" />
            <CardTitle className="text-2xl">User Not Found</CardTitle>
            <CardDescription>
                The profile for user ID <span className="font-mono bg-muted px-1 rounded">{userId}</span> could not be loaded.
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
  
  const isOwnProfile = isAuthenticated && authUser?.id === profileUser.id;

  const handleShareProfile = async () => {
    if (typeof window === 'undefined') return;
    const shareUrl = window.location.href;
    const shareData = {
      title: `${profileUser.name}'s Profile on PollitAGo`,
      text: `Check out ${profileUser.name}'s profile and polls on PollitAGo!`,
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
  
  const coverPhotoUrl = `https://placehold.co/1200x400.png?text=${urlSafeText(profileUser.name + " Cover", 25)}`;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-[80px] sm:top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto h-14 flex items-center justify-between px-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold truncate">{profileUser.name}</h1>
          <Button variant="ghost" size="icon" onClick={handleShareProfile}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-grow pt-0">
        <div className="relative h-48 w-full bg-muted">
          <Image
            src={coverPhotoUrl} 
            alt={`${profileUser.name}'s cover photo`}
            fill
            className="object-cover"
            priority 
            sizes="100vw"
            data-ai-hint="profile cover"
          />
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 transform">
            <Avatar className="h-32 w-32 border-4 border-background ring-2 ring-primary shadow-lg">
              <AvatarImage src={profileUser.avatarUrl} alt={profileUser.name || ""} data-ai-hint="profile avatar" />
              <AvatarFallback className="text-4xl">{profileUser.name ? profileUser.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U"}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="pt-20 pb-8 text-center border-b">
          <h2 className="text-2xl font-bold text-foreground">{profileUser.name}</h2>
          <p className="text-sm text-muted-foreground">@{profileUser.username}</p>
          
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
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground" 
                  onClick={handleFollowToggle}
                  disabled={!isAuthenticated && !authLoading}
                >
                  {!isAuthenticated && authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {!isAuthenticated && !authLoading ? <LogIn className="mr-2 h-4 w-4" /> : (isFollowing ? <UserX className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />)}
                  {!isAuthenticated && !authLoading ? 'Login to Follow' : (isFollowing ? 'Unfollow' : 'Follow')}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => isAuthenticated ? toast({ title: "Coming Soon!", description: "Direct messaging will be available in a future update."}) : signIn()}
                  disabled={!isAuthenticated && !authLoading}
                >
                   {!isAuthenticated && authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                   {!isAuthenticated && !authLoading ? <LogIn className="mr-2 h-4 w-4" /> : <MessageSquare className="mr-2 h-4 w-4" />}
                   {!isAuthenticated && !authLoading ? 'Login to Message' : 'Message'}
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
                <p className="font-semibold text-lg text-foreground">{(profileUser.pollitPointsBalance || 0).toLocaleString()}</p>
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
                currentUser={authUser} 
              />
            ) : (
              <Card className="shadow-none rounded-none border-0">
                <CardHeader className="items-center text-center pt-12 pb-8">
                   <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <CardTitle className="text-xl">No Polls Created Yet</CardTitle>
                  <CardDescription>{profileUser.name} hasn't created any polls. Check back later!</CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="voted">
            <Card className="shadow-none rounded-none border-0 items-center text-center pt-12 pb-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4 mx-auto" />
                <CardTitle className="text-xl">Voted Polls Unavailable</CardTitle>
                <CardDescription>This feature requires database integration to track votes.</CardDescription>
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
                <CardDescription>This feature requires database integration to show media-specific polls.</CardDescription>
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
                <CardDescription>This feature requires database integration to track liked polls.</CardDescription>
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

interface PollCardFeedWrapperProps {
  initialPolls: Poll[];
  currentUser: User | null;
}

const PollCardFeedWrapper: React.FC<PollCardFeedWrapperProps> = ({ initialPolls, currentUser }) => {
  const [polls, setPolls] = useState(() => initialPolls.map(p => ({...p})));
  const { toast } = useToast();
  const { isAuthenticated } = useAuth(); 

  const MIN_PAYOUT_PER_VOTER = 0.10;
  const CREATOR_PLEDGE_SHARE_FOR_VOTERS = 0.50;

  const handleVote = (pollId: string, optionId: string) => {
    if (!isAuthenticated) {
        toast({title: "Login Required", description: "Please login to vote.", variant: "destructive"});
        signIn();
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
                description: `Your vote is counted! Potential payout might be low.`,
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

  const handleToggleLike = (pollId: string) => {
    if (!isAuthenticated) {
        toast({ title: "Login Required", description: "Please login to like polls.", variant: "destructive" });
        signIn();
        return;
    }
    setPolls(prevPolls =>
        prevPolls.map(p => {
            if (p.id === pollId) {
                const newIsLiked = !p.isLiked;
                const newLikesCount = newIsLiked ? p.likes + 1 : Math.max(0, p.likes - 1);
                 if (!p.isLiked) {
                    toast({ title: "Poll Liked!" });
                } else {
                    toast({ title: "Poll Unliked" });
                }
                return { ...p, isLiked: newIsLiked, likes: newLikesCount };
            }
            return p;
        })
    );
  };

  const handlePollActionComplete = (pollIdToRemove: string) => {
    setPolls(prevPolls => prevPolls.filter(p => p.id !== pollIdToRemove));
    toast({title: "Poll Removed", description: "Poll removed from this view (simulated)."});
  };
  
  const handlePledgeOutcome = (pollId: string, outcome: 'accepted' | 'tipped_crowd') => {
     if (!isAuthenticated || !currentUser || polls.find(p=>p.id === pollId)?.creator.id !== currentUser.id) {
        toast({title: "Action Denied", description: "Only the poll creator can decide the pledge outcome.", variant: "destructive"});
        return;
    }
    setPolls(prevPolls =>
      prevPolls.map(p =>
        p.id === pollId ? { ...p, pledgeOutcome: outcome } : p
      )
    );
     toast({ title: `Pledge Outcome: ${outcome.replace('_', ' ')}`, description: "Action simulated."});
  };

  return (
    <div className="space-y-0 divide-y divide-border"> {/* Changed from PollFeed directly to avoid recursive PollFeed component */}
      {polls.map(poll => (
        <PollCard 
          key={poll.id} 
          poll={poll} 
          onVote={handleVote} 
          onToggleLike={handleToggleLike}
          onPollActionComplete={handlePollActionComplete}
          onPledgeOutcome={handlePledgeOutcome}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
};
    
