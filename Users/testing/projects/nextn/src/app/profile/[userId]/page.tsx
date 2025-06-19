
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
  const cleanedText = text.replace(/[^a-zA-Z0-9\s]/g, "").substring(0, maxLength);
  return encodeURIComponent(cleanedText);
};

export default function UserProfilePage() {
  const router = useRouter();
  const routeParams = useParams<{ userId: string }>(); 
  const userId = routeParams.userId;
  const { toast } } from "@/hooks/use-toast";
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
  const cleanedText = text.replace(/[^a-zA-Z0-9\s]/g, "").substring(0, maxLength);
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
  const [isFollowing, setIsFollowing] = useState(false); // Client-side simulation

  useEffect(() => {
    if (userId) {
      setPageLoading(true);
      getUserData(userId)
        .then(data => {
          setProfileUser(data.user);
          setUserPolls(data.polls);
          if (data.user) {
            // Simulate initial follow state based on mock data for demo
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
      // No toast here as userId might be undefined briefly during initial render
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
    setIsFollowing(prev => !prev); // Optimistically update UI
    // In a real app, you would call an API to update follow status in the database
    toast({ title: isFollowing ? `Unfollowed ${profileUser?.name}` : `Followed ${profileUser?.name}`, description: "This action is simulated." });
  };

  if (pageLoading || authLoading) {
    return (
      

                The profile for user ID could not be loaded.
            
          
            
              Go to Homepage
            
          
        
      
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
    
      
        
          
            
              
            
            
              {profileUser.name}
            
            
              
            
          
        
      

        
          
            
            
              
            
          
          
            
              
                
                  
                  
                
              
            
          
        

        
          
            {profileUser.name}
          
          @{profileUser.username}
          
          
            Lover of polls, opinions, and good conversations. Helping the world make up its mind, one poll at a time! 🚀 #PollMaster
          
          
            Planet Earth
            Joined {new Date(2023, Math.floor(Math.random()*12), Math.floor(Math.random()*28)+1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          
          
            
             example.com
          

          
            
              
                
                 Edit Profile
                
                
                  Settings
                
              
            
              
                
                   Login to Follow
                  Unfollow
                 Follow
                
                
                  Login to Message
                 Message
                
              
            
          
        
        
            
              {userPolls.length.toLocaleString()}
              Polls
            
            
              {(Math.floor(Math.random() * 5000) + 100).toLocaleString()}
              Followers
            
            
              {(Math.floor(Math.random() * 1000) + 50).toLocaleString()}
              Following
            
             
              {(profileUser.pollitPointsBalance || 0).toLocaleString()}
              PollitPoints
            
        

        
          
            
              Created
              Voted
              Media
              Liked
            
          
          
            {userPolls.length > 0 ? (
              
                
              
            ) : (
              
                
                  
                     
                    No Polls Created Yet
                    {profileUser.name} hasn't created any polls. Check back later!
                  
                
              
            )}
          
          
            
                
                   
                    Voted Polls Unavailable
                    This feature requires database integration to track votes.
                     Login to see Voted Polls
                    
                
            
          
          
             
                
                   
                    Media Feed Unavailable
                    This feature requires database integration to show media-specific polls.
                     Login to see Media Feed
                    
                
            
          
           
             
                
                   
                    Liked Polls Unavailable
                    This feature requires database integration to track liked polls.
                     Login to see Liked Polls
                    
                
            
          
        
      
    
  );
}

interface PollCardFeedWrapperProps {
  initialPolls: Poll[];
  currentUser: User | null; // Changed from AppUser to User to match PollFeed's expectation
}

const PollCardFeedWrapper: React.FC = ({ initialPolls, currentUser }) => {
  const [polls, setPolls] = useState(() => initialPolls.map(p => ({...p})));
  const { toast } } from "@/hooks/use-toast";
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
  const cleanedText = text.replace(/[^a-zA-Z0-9\s]/g, "").substring(0, maxLength);
  return encodeURIComponent(cleanedText);
};

export default function UserProfilePage() {
  const router = useRouter();
  const routeParams = useParams<{ userId: string }>(); 
  const userId = routeParams.userId;
  const { toast } = useToast();
  
  const { user: authUser, loading: authLoading, isAuthenticated } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [userPolls, setUserPolls] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false); // Client-side simulation

  useEffect(() => {
    if (userId) {
      setPageLoading(true);
      getUserData(userId)
        .then(data => {
          setProfileUser(data.user);
          setUserPolls(data.polls);
          if (data.user) {
            // Simulate initial follow state based on mock data for demo
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
      // No toast here as userId might be undefined briefly during initial render
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
    setIsFollowing(prev => !prev); // Optimistically update UI
    // In a real app, you would call an API to update follow status in the database
    toast({ title: isFollowing ? `Unfollowed ${profileUser?.name}` : `Followed ${profileUser?.name}`, description: "This action is simulated." });
  };

  if (pageLoading || authLoading) {
    return (
      
        
          Loading profile...
        
      
    );
  }

  if (!profileUser) {
    return (
       
        
          
            
              
                
                   
                    User Not Found
                    The profile for user ID  could not be loaded.
                  
                
            
            
              
                Go to Homepage
              
            
          
        
      
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
    
      
        
          
            
              
            
            
              {profileUser.name}
            
            
              
            
          
        
      

        
          
            
            
              
            
          
          
            
              
                
                  
                  
                
              
            
          
        

        
          
            {profileUser.name}
          
          @{profileUser.username}
          
          
            Lover of polls, opinions, and good conversations. Helping the world make up its mind, one poll at a time! 🚀 #PollMaster
          
          
            Planet Earth
            Joined {new Date(2023, Math.floor(Math.random()*12), Math.floor(Math.random()*28)+1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          
          
            
             example.com
          

          
            
              
                
                 Edit Profile
                
                
                  Settings
                
              
            
              
                
                   Login to Follow
                  Unfollow
                 Follow
                
                
                  Login to Message
                 Message
                
              
            
          
        
        
            
              {userPolls.length.toLocaleString()}
              Polls
            
            
              {(Math.floor(Math.random() * 5000) + 100).toLocaleString()}
              Followers
            
            
              {(Math.floor(Math.random() * 1000) + 50).toLocaleString()}
              Following
            
             
              {(profileUser.pollitPointsBalance || 0).toLocaleString()}
              PollitPoints
            
        

        
          
            
              Created
              Voted
              Media
              Liked
            
          
          
            {userPolls.length > 0 ? (
              
                
              
            ) : (
              
                
                  
                     
                    No Polls Created Yet
                    {profileUser.name} hasn't created any polls. Check back later!
                  
                
              
            )}
          
          
            
                
                   
                    Voted Polls Unavailable
                    This feature requires database integration to track votes.
                     Login to see Voted Polls
                    
                
            
          
          
             
                
                   
                    Media Feed Unavailable
                    This feature requires database integration to show media-specific polls.
                     Login to see Media Feed
                    
                
            
          
           
             
                
                   
                    Liked Polls Unavailable
                    This feature requires database integration to track liked polls.
                     Login to see Liked Polls
                    
                
            
          
        
      
    
  );
}

interface PollCardFeedWrapperProps {
  initialPolls: Poll[];
  currentUser: User | null; // Changed from AppUser to User to match PollFeed's expectation
}

const PollCardFeedWrapper: React.FC = ({ initialPolls, currentUser }) => {
  const [polls, setPolls] = useState(() => initialPolls.map(p => ({...p})));
  const { toast } = useToast();
  const { isAuthenticated } = useAuth(); // No need to get currentUser again, use prop

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
        toast({title: "Action Denied", description: "Only the poll creator can decide this.", variant: "destructive"});
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
    
       
        
          
          onPledgeOutcomeCallback={handlePledgeOutcome}
          currentUser={currentUser}
        />
      
    
  );
};
    
