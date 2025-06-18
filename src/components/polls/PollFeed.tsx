
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Poll, User } from '@/types';
import PollCard from './PollCard';
import { fetchMorePolls, mockUsers } from '@/lib/mockData';
import { Loader2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const pollCardVariants = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 30 } },
  exit: (custom: 'left' | 'right' | 'default') => {
    if (custom === 'left') {
      return { x: -300, opacity: 0, rotate: -10, transition: { duration: 0.3 } };
    }
    if (custom === 'right') {
      return { x: 300, opacity: 0, rotate: 10, transition: { duration: 0.3 } };
    }
    return { opacity: 0, scale: 0.8, transition: { duration: 0.3 } };
  }
};

const MIN_PAYOUT_PER_VOTER = 0.10;
const CREATOR_PLEDGE_SHARE_FOR_VOTERS = 0.50;
const BATCH_SIZE = 10; // Increased from 7

interface PollFeedProps {
  staticPolls?: Poll[];
  onVoteCallback?: (pollId: string, optionId: string) => void;
  onPollActionCompleteCallback?: (pollId: string, swipeDirection?: 'left' | 'right') => void;
  onPledgeOutcomeCallback?: (pollId: string, outcome: 'accepted' | 'tipped_crowd') => void;
  currentUser?: User | null;
}

export default function PollFeed({
  staticPolls,
  onVoteCallback,
  onPollActionCompleteCallback,
  onPledgeOutcomeCallback,
  currentUser: propCurrentUser
}: PollFeedProps) {
  const [polls, setPolls] = useState<Poll[]>(staticPolls || []);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(!staticPolls);
  const [initialLoadComplete, setInitialLoadComplete] = useState(!!staticPolls);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderTriggerRef = useRef<HTMLDivElement | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(propCurrentUser || null);
  const { toast } = useToast();
  const [exitDirectionMap, setExitDirectionMap] = useState<Record<string, 'left' | 'right' | 'default'>>({});

  useEffect(() => {
    if (!propCurrentUser) {
      const user1 = mockUsers.find(u => u.id === 'user1') || mockUsers[0];
      setCurrentUser(user1);
    }
  }, [propCurrentUser]);

  const loadMorePolls = useCallback(async (isInitial = false) => {
    if (staticPolls || loading || (!isInitial && !hasMore)) return;

    setLoading(true);
    const offset = isInitial ? 0 : polls.length;
    const newPolls = await fetchMorePolls(offset, BATCH_SIZE);

    if (newPolls.length > 0) {
      setPolls((prevPolls) => isInitial ? newPolls.map(p => ({...p})) : [...prevPolls, ...newPolls.map(p => ({...p}))]);
    }
    setHasMore(newPolls.length === BATCH_SIZE);
    setLoading(false);
    if (isInitial) {
      setInitialLoadComplete(true);
    }
  }, [staticPolls, loading, hasMore, polls.length]);


  useEffect(() => {
    if (!staticPolls && !initialLoadComplete && polls.length === 0 && !loading) {
      loadMorePolls(true);
    }
  }, [staticPolls, initialLoadComplete, polls.length, loading, loadMorePolls]);


  useEffect(() => {
    if (staticPolls) return;
    if (initialLoadComplete && !loading && hasMore && polls.length > 0 && polls.length < BATCH_SIZE ) {
      loadMorePolls();
    }
  }, [staticPolls, polls.length, initialLoadComplete, loading, hasMore, loadMorePolls]);


  useEffect(() => {
    if (staticPolls || loading || !initialLoadComplete || !hasMore) return;

    const currentLoaderTrigger = loaderTriggerRef.current;
    if (currentLoaderTrigger) {
      const obs = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loading) {
          loadMorePolls();
        }
      }, { rootMargin: "400px" }); // Increased from 200px

      obs.observe(currentLoaderTrigger);
      observer.current = obs;
    }

    return () => {
      if (observer.current && currentLoaderTrigger) {
        observer.current.unobserve(currentLoaderTrigger);
      }
      if (observer.current) {
        observer.current.disconnect();
        observer.current = null;
      }
    };
  }, [staticPolls, loading, hasMore, initialLoadComplete, loadMorePolls]);


  const handleVote = (pollId: string, optionId: string) => {
    if (onVoteCallback) {
      onVoteCallback(pollId, optionId);
      return;
    }

    const pollIndex = polls.findIndex(p => p.id === pollId);
    if (pollIndex === -1) return;

    const pollToUpdate = polls[pollIndex];
    if (pollToUpdate.isVoted) return;

    const targetOption = pollToUpdate.options.find(opt => opt.id === optionId);
    if (!targetOption) return;

    if (pollToUpdate.pledgeAmount && pollToUpdate.pledgeAmount > 0) {
      const amountToDistributeToVoters = pollToUpdate.pledgeAmount * CREATOR_PLEDGE_SHARE_FOR_VOTERS;
      const potentialVotesForThisOption = targetOption.votes + 1; // Vote is about to be added
      if ((amountToDistributeToVoters / potentialVotesForThisOption) < MIN_PAYOUT_PER_VOTER && potentialVotesForThisOption > 0) {
        toast({
          title: "Low Payout Warning",
          description: `Due to the current pledge and number of voters for this option, your potential PollitPoint payout might be below $${MIN_PAYOUT_PER_VOTER.toFixed(2)}. Your vote is still counted!`,
          variant: "default",
          duration: 7000,
        });
      }
    }

    setPolls(prevPolls =>
      prevPolls.map(p => {
        if (p.id === pollId) {
          const newTotalVotes = p.totalVotes + 1;
          return {
            ...p,
            isVoted: true,
            votedOptionId: optionId,
            totalVotes: newTotalVotes,
            options: p.options.map(opt =>
              opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            )
          };
        }
        return p;
      })
    );
  };

  const handlePollActionComplete = (pollIdToRemove: string, swipeDirection?: 'left' | 'right') => {
     if (onPollActionCompleteCallback) {
      onPollActionCompleteCallback(pollIdToRemove, swipeDirection);
      return;
    }
    setExitDirectionMap(prev => ({ ...prev, [pollIdToRemove]: swipeDirection || 'default' }));
    setPolls(prevPolls => prevPolls.filter(p => p.id !== pollIdToRemove));
  };

  const handlePledgeOutcome = (pollId: string, outcome: 'accepted' | 'tipped_crowd') => {
    if (onPledgeOutcomeCallback) {
      onPledgeOutcomeCallback(pollId, outcome);
      return;
    }
    setPolls(prevPolls =>
      prevPolls.map(p =>
        p.id === pollId ? { ...p, pledgeOutcome: outcome } : p
      )
    );
  };

  if (!staticPolls && !initialLoadComplete && loading && polls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading Polls...</p>
      </div>
    );
  }

  if (!staticPolls && initialLoadComplete && polls.length === 0 && !hasMore) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
          <Zap className="h-16 w-16 text-primary mb-4 opacity-70" />
          <p className="text-xl font-semibold text-foreground mb-2">No Polls Here Yet!</p>
          <p className="text-muted-foreground">Looks like the feed is empty. Check back later or create a new poll!</p>
        </div>
      );
  }

  if (staticPolls && polls.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No polls to display.
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
              onPollActionComplete={handlePollActionComplete}
              currentUser={currentUser}
              onPledgeOutcome={handlePledgeOutcome}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {!staticPolls && initialLoadComplete && hasMore && !loading && (
        <div ref={loaderTriggerRef} style={{ height: '1px', marginTop: '-1px' }} aria-hidden="true"></div>
      )}

      {!staticPolls && loading && initialLoadComplete && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading more polls...</p>
        </div>
      )}
      {!staticPolls && !loading && !hasMore && polls.length > 0 && initialLoadComplete && (
        <div className="text-center py-8 text-muted-foreground">
          <p>✨ You've reached the end! ✨</p>
        </div>
      )}
    </div>
  );
}
