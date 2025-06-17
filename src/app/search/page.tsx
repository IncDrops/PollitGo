
'use client';

import { useState, FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import PollCard from "@/components/polls/PollCard";
import { mockPolls } from "@/lib/mockData";
import type { Poll } from "@/types";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Local state for votes within search results
  const [votedPollsState, setVotedPollsState] = useState<Record<string, { pollId: string, optionId: string }>>({});

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setHasSearched(true);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredPolls = mockPolls.filter(poll => {
      const questionMatch = poll.question.toLowerCase().includes(lowerCaseSearchTerm);
      const creatorMatch = poll.creator.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                           poll.creator.username.toLowerCase().includes(lowerCaseSearchTerm);
      const optionsMatch = poll.options.some(option => option.text.toLowerCase().includes(lowerCaseSearchTerm));
      return questionMatch || creatorMatch || optionsMatch;
    });

    // Apply local vote state to search results
    const resultsWithVoteState = filteredPolls.map(poll => {
      const voteInfo = votedPollsState[poll.id];
      if (voteInfo) {
        return {
          ...poll,
          isVoted: true,
          votedOptionId: voteInfo.optionId,
          // Note: votes counts within options might not be updated here unless explicitly handled
        };
      }
      return poll;
    });


    setSearchResults(resultsWithVoteState);
    setIsLoading(false);
  };

  const handleVoteInSearch = (pollId: string, optionId: string) => {
    // Update local vote state for this search session
    setVotedPollsState(prev => ({ ...prev, [pollId]: { pollId, optionId } }));

    // Update the displayed search results immediately
    setSearchResults(prevResults =>
      prevResults.map(p => {
        if (p.id === pollId && (!p.isVoted || p.votedOptionId !== optionId) ) { // only update if not already voted or voted for different
          const newTotalVotes = p.isVoted ? p.totalVotes : p.totalVotes + 1; // Increment only if not previously voted
          
          return {
            ...p,
            isVoted: true,
            votedOptionId: optionId,
            totalVotes: newTotalVotes,
            options: p.options.map(opt => {
              // If this is the new voted option and poll wasn't voted before for THIS option
              if (opt.id === optionId && p.votedOptionId !== optionId) {
                let newVotes = opt.votes +1;
                 // If it was previously voted for another option, decrement that one.
                 if (p.isVoted && p.votedOptionId && p.votedOptionId !== optionId) {
                    const oldVotedOptIndex = p.options.findIndex(o => o.id === p.votedOptionId);
                    if (oldVotedOptIndex > -1) {
                        // This creates a new options array to avoid direct mutation
                        const updatedOptions = [...p.options];
                        updatedOptions[oldVotedOptIndex] = {
                            ...updatedOptions[oldVotedOptIndex],
                            votes: Math.max(0, updatedOptions[oldVotedOptIndex].votes -1) 
                        };
                        // Update the p object with new options array before returning
                         return { ...p, isVoted: true, votedOptionId: optionId, totalVotes: newTotalVotes, options: updatedOptions.map(o => o.id === optionId ? {...o, votes: o.votes+1} : o) };
                    }
                 }
                return { ...opt, votes: newVotes };
              }
              // If this option was previously voted but now unselected due to new vote
              if (opt.id !== optionId && p.votedOptionId === opt.id && p.isVoted) {
                return {...opt, votes: Math.max(0, opt.votes -1)};
              }
              return opt;
            })
          };
        }
        return p;
      })
    );
    console.log(`Vote recorded for poll ${pollId}, option ${optionId} in search results.`);
  };
  
  const handlePollActionCompleteInSearch = (pollIdToRemove: string) => {
    setSearchResults(prevPolls => prevPolls.filter(p => p.id !== pollIdToRemove));
    // Optionally, update votedPollsState if needed, though swiping removes it from view.
    console.log(`Poll ${pollIdToRemove} action completed and removed from search results.`);
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
            />
          ))}
        </div>
      )}
    </div>
  );
}

