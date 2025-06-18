
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
const BATCH_SIZE = 7; // Number of polls to fetch each time

export default function PollFeed() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();
  const [exitDirectionMap, setExitDirectionMap] = useState<Record<string, 'left' | 'right' | 'default'>>({});

  useEffect(() => {
    const user1 = mockUsers.find(u => u.id === 'user1') || mockUsers[0];
    setCurrentUser(user1);
  }, []);

  const loadMorePolls = useCallback(async (isInitial = false) => {
    if (loading || (!isInitial && !hasMore)) return;

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
  }, [loading, hasMore, polls.length]);


  useEffect(() => {
    // Perform initial load
    if (!initialLoadComplete && polls.length === 0 && !loading) {
      loadMorePolls(true);
    }
  }, [initialLoadComplete, polls.length, loading, loadMorePolls]);


  useEffect(() => {
    // This effect reacts to changes in polls.length, typically after a poll is removed.
    // Only run if initial load is complete and not currently loading.
    if (initialLoadComplete && !loading && hasMore) {
      // If the number of polls drops below a threshold (e.g., less than BATCH_SIZE), try to load more.
      // This helps refill the feed after items are removed.
      if (polls.length < BATCH_SIZE && polls.length > 0) { // Check polls.length > 0 to avoid loop on empty
        loadMorePolls();
      }
    }
  }, [polls.length, initialLoadComplete, loading, hasMore, loadMorePolls]);


  const lastPollElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        // Only trigger if initial load is complete, entry is intersecting, and there's more data
        if (initialLoadComplete && entries[0]?.isIntersecting && hasMore && !loading) {
          loadMorePolls();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, initialLoadComplete, loadMorePolls]
  );

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
          title: "Vote Not Registered",
          description: `Adding this vote would result in a PollitPoint payout below $${MIN_PAYOUT_PER_VOTER.toFixed(2)} per voter for this option due to the current pledge.`,
          variant: "destructive",
          duration: 5000,
        });
        return;
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
    setExitDirectionMap(prev => ({ ...prev, [pollIdToRemove]: swipeDirection || 'default' }));
    setPolls(prevPolls => prevPolls.filter(p => p.id !== pollIdToRemove));
    // The useEffect watching polls.length will now handle loading more if necessary
  };

  const handlePledgeOutcome = (pollId: string, outcome: 'accepted' | 'tipped_crowd') => {
    setPolls(prevPolls =>
      prevPolls.map(p =>
        p.id === pollId ? { ...p, pledgeOutcome: outcome } : p
      )
    );
  };

  if (!initialLoadComplete && loading && polls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading Polls...</p>
      </div>
    );
  }

  if (initialLoadComplete && polls.length === 0 && !hasMore) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
          <Zap className="h-16 w-16 text-primary mb-4 opacity-70" />
          <p className="text-xl font-semibold text-foreground mb-2">No Polls Here Yet!</p>
          <p className="text-muted-foreground">Looks like the feed is empty. Check back later or create a new poll!</p>
        </div>
      );
  }

  return (
    <div className="w-full space-y-0 relative">
      <AnimatePresence initial={false} custom={exitDirectionMap}>
        {polls.map((poll, index) => {
          const isLastElement = polls.length === index + 1;
          return (
            <motion.div
              key={poll.id}
              layout
              custom={exitDirectionMap[poll.id] || 'default'}
              variants={pollCardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="min-h-[1px]" // Prevents layout shift issues with Framer Motion
              ref={isLastElement ? lastPollElementRef : null}
            >
              <PollCard
                poll={poll}
                onVote={handleVote}
                onPollActionComplete={handlePollActionComplete}
                currentUser={currentUser}
                onPledgeOutcome={handlePledgeOutcome}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
      {loading && initialLoadComplete && ( // Only show loading indicator if initial load is done
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading more polls...</p>
        </div>
      )}
      {!loading && !hasMore && polls.length > 0 && initialLoadComplete && (
        <div className="text-center py-8 text-muted-foreground">
          <p>✨ You've reached the end! ✨</p>
        </div>
      )}
    </div>
  );
}
