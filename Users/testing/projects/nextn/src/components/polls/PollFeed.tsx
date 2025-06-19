
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Poll, User } from '@/types';
import PollCard from './PollCard';
import { fetchMorePolls } from '@/lib/mockData';
import { Loader2, Zap, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth'; 
import { signIn } from 'next-auth/react';

const pollCardVariants = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 30 } },
  exit: (custom: 'left' | 'right' | 'default') => {
    if (custom === 'left') return { x: "-100%", opacity: 0, transition: { duration: 0.3 } };
    if (custom === 'right') return { x: "100%", opacity: 0, transition: { duration: 0.3 } };
    return { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }; 
  }
};

const MIN_PAYOUT_PER_VOTER = 0.10;
const CREATOR_PLEDGE_SHARE_FOR_VOTERS = 0.50;
const BATCH_SIZE = 10;

interface PollFeedProps {
  staticPolls?: Poll[];
  onVoteCallback?: (pollId: string, optionId: string) => void;
  onToggleLikeCallback?: (pollId: string) => void; // For profile page to manage its own state
  onPollActionCompleteCallback?: (pollId: string, swipeDirection?: 'left' | 'right') => void;
  onPledgeOutcomeCallback?: (pollId: string, outcome: 'accepted' | 'tipped_crowd') => void;
  currentUser?: User | null; 
}

export default function PollFeed({
  staticPolls,
  onVoteCallback,
  onToggleLikeCallback, // New callback for likes
  onPollActionCompleteCallback,
  onPledgeOutcomeCallback,
  currentUser: propCurrentUser 
}: PollFeedProps) {
  const [polls, setPolls] = useState<Poll[]>(staticPolls || []);
  const [loadingMore, setLoadingMore] = useState(false); 
  const [hasMore, setHasMore] = useState(!staticPolls);
  const [initialLoadComplete, setInitialLoadComplete] = useState(!!staticPolls);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderTriggerRef = useRef<HTMLDivElement | null>(null);

  const { user: authHookUser, loading: authLoading, isAuthenticated } = useAuth();
  const currentUser = propCurrentUser !== undefined ? propCurrentUser : authHookUser;

  const { toast } = useToast();
  const [exitDirectionMap, setExitDirectionMap] = useState<Record<string, 'left' | 'right' | 'default'>>({});

  const loadMorePolls = useCallback(async (isInitial = false) => {
    if (staticPolls || loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const newPolls = await fetchMorePolls(isInitial ? 0 : polls.length, BATCH_SIZE);
      if (newPolls.length < BATCH_SIZE) {
        setHasMore(false);
      }
      setPolls(prevPolls => {
        const existingIds = new Set(prevPolls.map(p => p.id));
        const uniqueNewPolls = newPolls.filter(p => !existingIds.has(p.id));
        return [...prevPolls, ...uniqueNewPolls];
      });
    } catch (error) {
      console.error("Failed to fetch more polls:", error);
      toast({ title: "Error", description: "Could not load more polls.", variant: "destructive" });
      setHasMore(false); 
    } finally {
      setLoadingMore(false);
      if (isInitial) setInitialLoadComplete(true);
    }
  }, [staticPolls, loadingMore, hasMore, polls.length, toast]);

  useEffect(() => {
    if (!staticPolls && !initialLoadComplete) {
      loadMorePolls(true);
    }
  }, [staticPolls, initialLoadComplete, loadMorePolls]);

  useEffect(() => {
    if (staticPolls || !hasMore || loadingMore || !loaderTriggerRef.current) return;

    const currentObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMorePolls();
        }
      },
      { threshold: 0.5 } 
    );
    observer.current = currentObserver;
    currentObserver.observe(loaderTriggerRef.current);

    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, [staticPolls, hasMore, loadingMore, loadMorePolls]);

  const handleVote = (pollId: string, optionId: string) => {
    if (!isAuthenticated) { 
        toast({title: "Login Required", description: "Please login to vote.", variant: "destructive"});
        signIn(); 
        return;
    }
    if (onVoteCallback) {
      onVoteCallback(pollId, optionId); 
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
                variant: "default", duration: 7000,
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
    if (onToggleLikeCallback) { // If a specific callback is provided (e.g., from profile page)
        onToggleLikeCallback(pollId);
        return;
    }
    // Standard feed like handling
    setPolls(prevPolls =>
        prevPolls.map(p => {
            if (p.id === pollId) {
                const newIsLiked = !p.isLiked;
                const newLikesCount = newIsLiked ? p.likes + 1 : p.likes - 1;
                toast({ title: newIsLiked ? "Poll Liked" : "Poll Unliked" });
                return { ...p, isLiked: newIsLiked, likes: newLikesCount };
            }
            return p;
        })
    );
  };

  const handlePollActionComplete = (pollIdToRemove: string, swipeDirection?: 'left' | 'right') => {
     setExitDirectionMap(prev => ({ ...prev, [pollIdToRemove]: swipeDirection || 'default' }));
     setTimeout(() => {
        if (onPollActionCompleteCallback) {
            onPollActionCompleteCallback(pollIdToRemove, swipeDirection);
        } else {
            setPolls(prevPolls => prevPolls.filter(p => p.id !== pollIdToRemove));
        }
        setExitDirectionMap(prev => {
            const newMap = {...prev};
            delete newMap[pollIdToRemove];
            return newMap;
        });
     }, 500); 
  };

  const handlePledgeOutcome = (pollId: string, outcome: 'accepted' | 'tipped_crowd') => {
    if (!isAuthenticated || !currentUser || polls.find(p => p.id === pollId)?.creator.id !== currentUser.id) {
        toast({title: "Action Denied", description: "Only the poll creator can decide the pledge outcome.", variant: "destructive"});
        return;
    }
    if (onPledgeOutcomeCallback) {
      onPledgeOutcomeCallback(pollId, outcome);
      return;
    }
    setPolls(prevPolls =>
      prevPolls.map(p =>
        p.id === pollId ? { ...p, pledgeOutcome: outcome } : p
      )
    );
    toast({ title: `Pledge Outcome: ${outcome.replace('_', ' ')}`, description: "Action simulated on client."});
  };

  if (!staticPolls && !initialLoadComplete && (loadingMore || authLoading) && polls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading Polls...</p>
      </div>
    );
  }
  
  if (polls.length === 0 && (initialLoadComplete || staticPolls)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <Zap className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold text-foreground">No Polls Yet!</h3>
        <p className="text-muted-foreground">Be the first to create one or check back soon.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-0 relative">
      <AnimatePresence initial={false} custom={exitDirectionMap}>
        {polls.map((poll) => (
          <motion.div
            key={poll.id}
            layout
            custom={exitDirectionMap[poll.id] || 'default'}
            variants={pollCardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-[1px]" 
          >
            <PollCard
              poll={poll}
              onVote={handleVote}
              onToggleLike={handleToggleLike} // Pass the new handler
              onPollActionComplete={handlePollActionComplete}
              currentUser={currentUser}
              onPledgeOutcome={handlePledgeOutcome}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {!staticPolls && hasMore && (
        <div ref={loaderTriggerRef} className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading more polls...</span>
        </div>
      )}

      {!staticPolls && !hasMore && polls.length > 0 && (
         <div className="text-center py-10 text-muted-foreground">
            <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>You&apos;ve reached the end of the polls!</p>
        </div>
      )}
    </div>
  );
}
