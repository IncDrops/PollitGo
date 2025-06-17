'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Poll } from '@/types';
import PollCard from './PollCard';
import { mockPolls, fetchMorePolls } from '@/lib/mockData';
import { Loader2 } from 'lucide-react';

export default function PollFeed() {
  const [polls, setPolls] = useState<Poll[]>(mockPolls);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadMorePolls = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    // Simulate API call delay
    const newPolls = await fetchMorePolls(polls.length, 5);
    if (newPolls.length > 0) {
      setPolls((prevPolls) => [...prevPolls, ...newPolls]);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  }, [loading, hasMore, polls.length]);

  const lastPollElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePolls();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMorePolls]
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
    // In a real app, this would also send the vote to the server.
    console.log(`Voted for option ${optionId} in poll ${pollId}`);
  };


  return (
    <div className="w-full space-y-0"> {/* Remove space-y-4 to make cards touch for TikTok feel */}
      {polls.map((poll, index) => {
        if (polls.length === index + 1) {
          return (
            <div ref={lastPollElementRef} key={poll.id} className="min-h-[1px]"> {/* Added min-h to ensure visibility for observer */}
              <PollCard poll={poll} onVote={handleVote} />
            </div>
          );
        } else {
          return <PollCard key={poll.id} poll={poll} onVote={handleVote} />;
        }
      })}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading more polls...</p>
        </div>
      )}
      {!loading && !hasMore && (
        <div className="text-center py-8 text-muted-foreground">
          <p>✨ You've reached the end! ✨</p>
        </div>
      )}
    </div>
  );
}
