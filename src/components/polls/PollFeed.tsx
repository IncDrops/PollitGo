
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Poll } from '@/types';
import PollCard from './PollCard';
import { mockPolls, fetchMorePolls } from '@/lib/mockData';
import { Loader2 } from 'lucide-react';

export default function PollFeed() {
  const [polls, setPolls] = useState<Poll[]>([]); // Start with empty and load initial
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadInitialPolls = useCallback(async () => {
    setLoading(true);
    const initialPollsData = await fetchMorePolls(0, 5); // Load initial 5 polls
    setPolls(initialPollsData);
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
      setPolls((prevPolls) => [...prevPolls, ...newPolls]);
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
    setPolls(prevPolls => 
      prevPolls.map(p => {
        if (p.id === pollId && !p.isVoted) {
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

  const handlePollActionComplete = (pollIdToRemove: string) => {
    setPolls(prevPolls => prevPolls.filter(p => p.id !== pollIdToRemove));
     // If we're running out of polls, try to load more
    if (polls.length <= 5 && hasMore) { // Threshold to trigger early load
        loadMorePolls();
    }
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
    <div className="w-full space-y-0">
      {polls.map((poll, index) => {
        const isLastElement = polls.length === index + 1;
        return (
          <div ref={isLastElement ? lastPollElementRef : null} key={poll.id} className="min-h-[1px]">
            <PollCard poll={poll} onVote={handleVote} onPollActionComplete={handlePollActionComplete} />
          </div>
        );
      })}
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
