
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Poll, User } from '@/types';
import PollCard from './PollCard';
import { mockPolls, fetchMorePolls, mockUsers } from '@/lib/mockData';
import { Loader2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast'; // Ensure useToast is imported

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

const MIN_PAYOUT_PER_VOTER = 0.10; // $0.10
const CREATOR_PLEDGE_SHARE_FOR_VOTERS = 0.50; // 50%

export default function PollFeed() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();

  const [exitDirectionMap, setExitDirectionMap] = useState<Record<string, 'left' | 'right' | 'default'>>({});

  useEffect(() => {
    const user1 = mockUsers.find(u => u.id === 'user1') || mockUsers[0];
    setCurrentUser(user1);
  }, []);


  const loadInitialPolls = useCallback(async () => {
    setLoading(true);
    const initialPollsData = await fetchMorePolls(0, 5);
    setPolls(initialPollsData.map(p => ({...p})));
    setHasMore(initialPollsData.length > 0);
    setLoading(false);
    setInitialLoad(false);
  }, []);

  useEffect(() => {
    loadInitialPolls();
  }, [loadInitialPolls]);

  const loadMorePolls = useCallback(async () => {
    if (loading || !hasMore || initialLoad) return;
    setLoading(true);
    const newPolls = await fetchMorePolls(polls.length, 5);
    if (newPolls.length > 0) {
      setPolls((prevPolls) => [...prevPolls, ...newPolls.map(p => ({...p}))]);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  }, [loading, hasMore, polls.length, initialLoad]);

  const lastPollElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !initialLoad) {
          loadMorePolls();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMorePolls, initialLoad]
  );

  const handleVote = (pollId: string, optionId: string) => {
    const pollIndex = polls.findIndex(p => p.id === pollId);
    if (pollIndex === -1) return;

    const pollToUpdate = polls[pollIndex];
    if (pollToUpdate.isVoted) return; // Already voted

    const targetOption = pollToUpdate.options.find(opt => opt.id === optionId);
    if (!targetOption) return;

    // Check pledge payout condition
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
    console.log(`Voted for option ${optionId} in poll ${pollId}`);
  };

  const handlePollActionComplete = (pollIdToRemove: string, swipeDirection?: 'left' | 'right') => {
    setExitDirectionMap(prev => ({ ...prev, [pollIdToRemove]: swipeDirection || 'default' }));
    setPolls(prevPolls => prevPolls.filter(p => p.id !== pollIdToRemove));
    if (polls.length <= 5 && hasMore) {
        loadMorePolls();
    }
  };

  const handlePledgeOutcome = (pollId: string, outcome: 'accepted' | 'tipped_crowd') => {
    setPolls(prevPolls =>
      prevPolls.map(p =>
        p.id === pollId ? { ...p, pledgeOutcome: outcome } : p
      )
    );
    console.log(`Pledge outcome for poll ${pollId} set to ${outcome} in feed.`);
  };


  if (initialLoad && loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading Polls...</p>
      </div>
    );
  }

  if (!initialLoad && polls.length === 0 && !hasMore) {
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
              className="min-h-[1px]"
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
      {loading && !initialLoad && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading more polls...</p>
        </div>
      )}
      {!loading && !hasMore && polls.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>✨ You've reached the end! ✨</p>
        </div>
      )}
    </div>
  );
}

    