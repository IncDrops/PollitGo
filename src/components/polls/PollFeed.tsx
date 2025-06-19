
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Poll, User } from '@/types';
import PollCard from './PollCard';
import { fetchMorePolls } from '@/lib/mockData'; // mockUsers removed from here
import { Loader2, Zap, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth'; // Import useAuth

const pollCardVariants = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 30 } },
  exit: (custom: 'left' | 'right' | 'default') => {
    // ... (variants remain the same)
  }
};

const MIN_PAYOUT_PER_VOTER = 0.10;
const CREATOR_PLEDGE_SHARE_FOR_VOTERS = 0.50;
const BATCH_SIZE = 10;

interface PollFeedProps {
  staticPolls?: Poll[];
  onVoteCallback?: (pollId: string, optionId: string) => void;
  onPollActionCompleteCallback?: (pollId: string, swipeDirection?: 'left' | 'right') => void;
  onPledgeOutcomeCallback?: (pollId: string, outcome: 'accepted' | 'tipped_crowd') => void;
  currentUser?: User | null; // This prop might still be passed from profile page using mockUser
}

export default function PollFeed({
  staticPolls,
  onVoteCallback,
  onPollActionCompleteCallback,
  onPledgeOutcomeCallback,
  currentUser: propCurrentUser // Renamed to avoid conflict with hook's currentUser
}: PollFeedProps) {
  const [polls, setPolls] = useState<Poll[]>(staticPolls || []);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(!staticPolls);
  const [initialLoadComplete, setInitialLoadComplete] = useState(!!staticPolls);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderTriggerRef = useRef<HTMLDivElement | null>(null);

  const { user: authHookUser, loading: authLoading } = useAuth(); // Get user from hook (will be null)
  const currentUser = propCurrentUser !== undefined ? propCurrentUser : authHookUser; // Prioritize prop, then hook

  const { toast } = useToast();
  const [exitDirectionMap, setExitDirectionMap] = useState<Record<string, 'left' | 'right' | 'default'>>({});

  // useEffect for propCurrentUser and authHookUser sync removed as currentUser is now derived

  const loadMorePolls = useCallback(async (isInitial = false) => {
    // ... (loadMorePolls logic remains largely the same)
  }, [staticPolls, loading, hasMore, polls.length]);


  // useEffects for loading polls remain largely the same
  // ...

  const handleVote = (pollId: string, optionId: string) => {
    if (!currentUser) {
        toast({title: "Login Required", description: "Please login to vote.", variant: "destructive"});
        return;
    }
    if (onVoteCallback) {
      onVoteCallback(pollId, optionId);
      return;
    }
    // ... (rest of vote logic, check for currentUser if needed for specific actions)
  };

  const handlePollActionComplete = (pollIdToRemove: string, swipeDirection?: 'left' | 'right') => {
     // ...
  };

  const handlePledgeOutcome = (pollId: string, outcome: 'accepted' | 'tipped_crowd') => {
    if (!currentUser || polls.find(p => p.id === pollId)?.creator.id !== currentUser.uid) {
        toast({title: "Action Denied", description: "Only the poll creator can decide the pledge outcome.", variant: "destructive"});
        return;
    }
    if (onPledgeOutcomeCallback) {
      onPledgeOutcomeCallback(pollId, outcome);
      return;
    }
    // ...
  };

  if (!staticPolls && !initialLoadComplete && (loading || authLoading) && polls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading Polls...</p>
      </div>
    );
  }
  
  // ... (other loading/empty states remain similar)

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
              currentUser={currentUser} // Pass derived currentUser
              onPledgeOutcome={handlePledgeOutcome}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Loader trigger and end-of-feed messages remain similar */}
      {/* ... */}
    </div>
  );
}
