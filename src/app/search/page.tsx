
'use client';

import { useState, FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import PollCard from "@/components/polls/PollCard";
import { mockPolls, mockUsers } from "@/lib/mockData"; // Assuming mockUsers is needed for currentUser on PollCard
import type { Poll, User } from "@/types";
import { useToast } from "@/hooks/use-toast"; // Import useToast

const MIN_PAYOUT_PER_VOTER = 0.10; // $0.10
const CREATOR_PLEDGE_SHARE_FOR_VOTERS = 0.50; // 50%

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast(); // Initialize toast

  // Mock current user for PollCard. In a real app, this would come from auth context.
  const [currentUser] = useState<User | null>(() => mockUsers.find(u => u.id === 'user1') || mockUsers[0] || null);


  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setHasSearched(true);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredPolls = mockPolls.map(p => ({...p})).filter(poll => { // Create copies for safe mutation
      const questionMatch = poll.question.toLowerCase().includes(lowerCaseSearchTerm);
      const creatorMatch = poll.creator.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                           poll.creator.username.toLowerCase().includes(lowerCaseSearchTerm);
      const optionsMatch = poll.options.some(option => option.text.toLowerCase().includes(lowerCaseSearchTerm));
      return questionMatch || creatorMatch || optionsMatch;
    });

    setSearchResults(filteredPolls);
    setIsLoading(false);
  };

  const handleVoteInSearch = (pollId: string, optionId: string) => {
    const pollIndex = searchResults.findIndex(p => p.id === pollId);
    if (pollIndex === -1) return;

    const pollToUpdate = searchResults[pollIndex];
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

    setSearchResults(prevResults =>
      prevResults.map(p => {
        if (p.id === pollId) {
          const newTotalVotes = p.isVoted ? p.totalVotes : p.totalVotes + 1;
          return {
            ...p,
            isVoted: true,
            votedOptionId: optionId,
            totalVotes: newTotalVotes,
            options: p.options.map(opt => {
              if (opt.id === optionId) {
                return { ...opt, votes: opt.votes + 1 };
              }
              // If previously voted for another option, and now changing vote (though current logic prevents re-vote)
              // This part might be redundant if re-voting on same poll is disabled once voted.
              if (p.votedOptionId && p.votedOptionId === opt.id && p.votedOptionId !== optionId) {
                 return { ...opt, votes: Math.max(0, opt.votes -1) };
              }
              return opt;
            }),
          };
        }
        return p;
      })
    );
    console.log(`Vote recorded for poll ${pollId}, option ${optionId} in search results.`);
  };
  
  const handlePollActionCompleteInSearch = (pollIdToRemove: string) => {
    setSearchResults(prevPolls => prevPolls.filter(p => p.id !== pollIdToRemove));
    console.log(`Poll ${pollIdToRemove} action completed and removed from search results.`);
  };

  const handlePledgeOutcomeInSearch = (pollId: string, outcome: 'accepted' | 'tipped_crowd') => {
    setSearchResults(prevPolls =>
      prevPolls.map(p =>
        p.id === pollId ? { ...p, pledgeOutcome: outcome } : p
      )
    );
    toast({ title: `Pledge Outcome: ${outcome.replace('_', ' ')}`, description: `Action simulated for poll ${pollId} in search results.`});
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-6 text-foreground">Search Polls</h1>
      <form onSubmit={handleSearch} className="flex w-full max-w-lg items-center space-x-2 mb-8 mx-auto">
        <Input
          type="text"
          placeholder="Search by keyword, user, or tag"
          className="flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SearchIcon className="h-5 w-5" />}
        </Button>
      </form>

      {isLoading && (
        <div className="text-center text-muted-foreground py-10">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>Searching...</p>
        </div>
      )}

      {!isLoading && hasSearched && searchResults.length === 0 && (
        <div className="text-center text-muted-foreground py-10">
          <SearchIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>No polls found matching "{searchTerm}".</p>
          <p className="text-sm">Try a different search term.</p>
        </div>
      )}

      {!isLoading && !hasSearched && (
        <div className="text-center text-muted-foreground py-10">
          <SearchIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>Enter a search term to find polls.</p>
          <p className="text-sm">You can search for poll questions, creators, or tags.</p>
        </div>
      )}

      {!isLoading && searchResults.length > 0 && (
        <div className="space-y-0 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Search Results ({searchResults.length})</h2>
          {searchResults.map(poll => (
            <PollCard 
                key={poll.id} 
                poll={poll} 
                onVote={handleVoteInSearch} 
                onPollActionComplete={handlePollActionCompleteInSearch}
                currentUser={currentUser} // Pass currentUser
                onPledgeOutcome={handlePledgeOutcomeInSearch} // Pass pledge outcome handler
            />
          ))}
        </div>
      )}
    </div>
  );
}

    