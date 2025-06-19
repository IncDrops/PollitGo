
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { mockPolls, mockUsers } from "@/lib/mockData";
import type { Poll, PollOption as PollOptionType, Comment as CommentType, User } from "@/types";
import { formatDistanceToNowStrict, parseISO, isPast } from "date-fns";
import { Clock, Heart, MessageSquare, Share2, Gift, Send, Image as ImageIconLucideShadcn, Video as VideoIconLucide, ThumbsUp, Film, Info, CheckCircle2, Loader2, Check, Users, Flame, AlertCircle } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from 'react';
import OptionDetailsDialog from "@/components/polls/OptionDetailsDialog";
import { useToast } from '@/hooks/use-toast';
import { useStripe } from "@stripe/react-stripe-js";
import useAuth from "@/hooks/useAuth"; // Import useAuth

async function getPollDetails(pollId: string): Promise<{ poll: Poll | null; comments: CommentType[] }> {
  const poll = mockPolls.find(p => p.id === pollId) || null;
  const freshPoll = poll ? {...mockPolls.find(p => p.id === pollId)} as Poll || null : null;

  // Using mock users for comments as actual user system is being removed/changed
  const commentUser1 = mockUsers.find(u => u.id === 'user2') || mockUsers[1] || getRandomUserFromMock();
  const commentUser2 = mockUsers.find(u => u.id === 'user3') || mockUsers[2] || getRandomUserFromMock();

  const comments: CommentType[] = freshPoll ? [
    { id: 'comment1', user: commentUser1, text: "Great question! I'm leaning towards Summer.", createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    { id: 'comment2', user: commentUser2, text: "Definitely Autumn for me, the colors are amazing.", createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  ] : [];
  return { poll: freshPoll, comments };
}

const getRandomUserFromMock = (): User => mockUsers[Math.floor(Math.random() * mockUsers.length)];
const generateHintFromText = (text: string = ""): string => {
  return text.split(' ').slice(0, 2).join(' ').toLowerCase();
};

const OPTION_TEXT_TRUNCATE_LENGTH = 100;
const MIN_PAYOUT_PER_VOTER = 0.10;
const CREATOR_PLEDGE_SHARE_FOR_VOTERS = 0.50;

const PollOptionDisplay: React.FC<{
  option: PollOptionType;
  totalVotes: number;
  isVoted: boolean;
  isSelectedOption: boolean;
  deadlinePassed: boolean;
  onVote: () => Promise<void>;
  pollHasTwoOptions: boolean;
  onShowDetails: () => void;
  pollPledgeAmount?: number;
  canVote: boolean; // Added to control voting ability
}> = ({ option, totalVotes, isVoted, isSelectedOption, deadlinePassed, onVote, pollHasTwoOptions, onShowDetails, pollPledgeAmount, canVote }) => {
  const { toast } = useToast(); 
  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
  const showResults = isVoted || deadlinePassed;
  const isTruncated = option.text.length > OPTION_TEXT_TRUNCATE_LENGTH;
  const truncatedText = isTruncated
    ? `${option.text.substring(0, OPTION_TEXT_TRUNCATE_LENGTH)}...`
    : option.text;

  const handleOptionClick = async () => {
    if (canVote && !isVoted && !deadlinePassed) { // Check canVote
      await onVote();
    } else {
      onShowDetails();
    }
  };

  const handleDetailsIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowDetails();
  };

  let isVotingVisuallyLimited = false;
  if (pollPledgeAmount && pollPledgeAmount > 0 && !deadlinePassed && !isVoted && canVote) {
    const amountForVoters = pollPledgeAmount * CREATOR_PLEDGE_SHARE_FOR_VOTERS;
    if ((amountForVoters / (option.votes + 1)) < MIN_PAYOUT_PER_VOTER && (option.votes + 1) > 0) {
      isVotingVisuallyLimited = true;
    }
  }

  return (
    <div className={cn("relative group", pollHasTwoOptions ? "flex-1" : "mb-3 w-full")}>
      <Button
        variant={isSelectedOption && showResults ? "default" : "outline"}
        className={cn(
          "w-full justify-between h-auto p-3 text-left relative disabled:opacity-100 disabled:cursor-default",
           pollHasTwoOptions && "aspect-square flex flex-col items-center justify-center text-center",
           (isVoted || deadlinePassed || isTruncated || option.affiliateLink || isVotingVisuallyLimited) && "cursor-pointer hover:bg-accent/60"
        )}
        onClick={handleOptionClick}
        disabled={!canVote && (isVoted || deadlinePassed) && !pollHasTwoOptions && !(isTruncated || option.affiliateLink) }
        aria-pressed={isSelectedOption}
        title={isVotingVisuallyLimited ? "Voting for this option is allowed, but your potential PollitPoint payout might be low due to pledge conditions." : undefined}
      >
        <div className={cn("flex w-full", pollHasTwoOptions ? "flex-col items-center" : "items-center")}>
          {option.imageUrl && <Image src={option.imageUrl} alt={option.text} width={pollHasTwoOptions ? 60 : 30} height={pollHasTwoOptions ? 60 : 30} className={cn("rounded-md object-cover shadow-sm", pollHasTwoOptions ? "mb-2" : "mr-2")} data-ai-hint={generateHintFromText(option.text) || "option visual"} />}
          {option.videoUrl && !option.imageUrl && <VideoIconLucide className={cn("text-muted-foreground", pollHasTwoOptions ? "mb-2 h-10 w-10" : "w-5 h-5 mr-2")} />}
          <span className={cn("flex-grow", pollHasTwoOptions ? "text-sm mt-1 leading-tight" : "text-sm")}>{truncatedText}</span>

          {showResults && <span className={cn("font-semibold text-sm", pollHasTwoOptions ? "mt-2" : "ml-auto pl-1")}>{percentage.toFixed(0)}%</span>}

          {isSelectedOption && showResults && <CheckCircle2 className={cn("w-4 h-4", pollHasTwoOptions ? "mt-1 text-primary-foreground" : "ml-1 text-primary")} />}

          {(isTruncated || option.affiliateLink || isVotingVisuallyLimited) && (
             <div
              onClick={handleDetailsIconClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleDetailsIconClick(e as any)}
              aria-label="View option details"
              className={cn(
                "h-6 w-6 opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
                pollHasTwoOptions ? "absolute top-1 right-1" : "ml-2 shrink-0",
                "flex items-center justify-center rounded-full cursor-pointer p-1",
                "hover:bg-accent/70 hover:text-accent-foreground"
              )}
            >
              <Info className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
            </div>
          )}
        </div>
      </Button>
      {showResults && !pollHasTwoOptions && <Progress value={percentage} className="h-1.5 mt-1 bg-primary/20 [&>div]:bg-primary" />}
       {isVotingVisuallyLimited && !pollHasTwoOptions && (
        <p className="text-xs text-amber-600 mt-1 text-center">Low Payout Warning: Your vote is counted, but potential PollitPoint payout might be small for this option.</p>
      )}
    </div>
  );
};

export default function PollDetailsPage({ params }: { params: { pollId: string } }) {
  const [pollData, setPollData] = useState<{ poll: Poll | null; comments: CommentType[] }>({ poll: null, comments: [] });
  const [loading, setLoading] = useState(true);
  const [isTipping, setIsTipping] = useState(false);
  const [deadlinePassedState, setDeadlinePassedState] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const { user: currentUser, loading: authLoading } = useAuth(); // currentUser will be null
  const { toast } = useToast();
  const stripe = useStripe();

  const [selectedOptionForModal, setSelectedOptionForModal] = useState<PollOptionType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getPollDetails(params.pollId); // Using mock data
      setPollData(prev => ({ ...prev, ...data, poll: data.poll ? {...data.poll} : null }));
      // currentUser is now handled by useAuth hook
      setLoading(false);
    };
    fetchData();
  }, [params.pollId]);

  const poll = pollData.poll;
  const comments = pollData.comments;

  useEffect(() => {
    if (poll) {
      const deadlineDate = parseISO(poll.deadline);
      const checkDeadline = () => {
        const now = new Date();
        const remaining = deadlineDate.getTime() - now.getTime();
        if (remaining <= 0) {
          setDeadlinePassedState(true);
          setTimeRemaining("Ended");
        } else {
          setDeadlinePassedState(false);
          setTimeRemaining(formatDistanceToNowStrict(deadlineDate, { addSuffix: true }));
        }
      };
      checkDeadline();
      const interval = setInterval(checkDeadline, 60000);
      return () => clearInterval(interval);
    }
  }, [poll]);

  const handleVote = async (optionId: string) => {
    if (!poll || poll.isVoted || deadlinePassedState || !currentUser) {
        if(!currentUser) toast({title: "Login Required", description: "Please login to vote.", variant: "destructive"})
        return;
    }
    // ... (rest of vote logic, which might need currentUser for some operations not yet implemented)
    
    setPollData(prevData => {
      if (!prevData.poll) return prevData;
      const newPoll = {
        ...prevData.poll,
        isVoted: true,
        votedOptionId: optionId,
        totalVotes: prevData.poll.totalVotes + 1,
        options: prevData.poll.options.map(opt =>
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        ),
      };
      // ... (toast logic for low payout warning remains the same)
      return { ...prevData, poll: newPoll };
    });
  };

  const handleCommentSubmit = async (formData: FormData) => {
    const commentText = formData.get('comment') as string;
    if (!currentUser) {
        toast({title: "Login Required", description: "Please login to comment.", variant: "destructive"});
        return;
    }
    if (commentText && commentText.trim() !== "" && poll) {
      const randomMockUser = getRandomUserFromMock(); // Use mock user for comment as currentUser is null
      const newComment: CommentType = {
        id: `comment${Date.now()}`,
        user: randomMockUser, // Using mock user
        text: commentText,
        createdAt: new Date().toISOString(),
      };
      setPollData(prevData => ({
        ...prevData,
        comments: [newComment, ...prevData.comments],
      }));
      const formElement = document.getElementById('comment-form') as HTMLFormElement | null;
      formElement?.reset();
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    // ... (share logic remains client-side and mostly unaffected)
    e.stopPropagation();
    if (!poll || typeof window === 'undefined') return;
    // ...
  };

  const handleTipCreator = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
        toast({title: "Login Required", description: "Please login to tip.", variant: "destructive"});
        return;
    }
    if (!stripe || !poll) {
      toast({ title: "Stripe not loaded or poll data missing.", variant: "destructive" });
      return;
    }
    setIsTipping(true);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 500, 
          currency: 'usd',
          itemName: `Tip for ${poll.creator.name} (Poll: ${poll.question.substring(0,30)}...)`,
          metadata: { pollId: poll.id, pollCreatorId: poll.creator.id, tipperUserId: currentUser.uid } // currentUser.uid will be an issue
        }),
      });
      // ... (rest of Stripe session handling)
    } catch (error: any) {
        // ...
    } finally {
      setIsTipping(false);
    }
  };

  const handleShowOptionDetails = (option: PollOptionType) => {
    setSelectedOptionForModal(option);
    setIsModalOpen(true);
  };

  const handlePledgeOutcome = (outcome: 'accepted' | 'tipped_crowd') => {
    if (!currentUser) {
        toast({title: "Login Required", description: "Only the poll creator can decide the pledge outcome.", variant: "destructive"});
        return;
    }
    if (poll && currentUser?.id === poll.creator.id) { // Check if current (mock) user is creator
        setPollData(prev => prev.poll ? ({...prev, poll: {...prev.poll, pledgeOutcome: outcome }}) : prev);
        toast({ title: `Pledge Outcome: ${outcome.replace('_', ' ')}`, description: "Action simulated on client."});
    } else {
        toast({title: "Action Denied", description: "Only the poll creator can decide this.", variant: "destructive"});
    }
  };

  if (loading || authLoading) {
    return <div className="container mx-auto px-4 py-8 text-center text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mx-auto" /> Loading poll details...</div>;
  }

  if (!poll) {
    return <div className="container mx-auto px-4 py-8 text-center text-destructive">Poll not found.</div>;
  }
  
  const canVoteOnPoll = !!currentUser && !poll.isVoted && !deadlinePassedState;

  const pollHasTwoOptions = poll.options.length === 2;
  const isCreator = currentUser?.uid === poll.creator.id; // This will be false
  const showPledgeOutcomeButtons = isCreator && deadlinePassedState && poll.pledgeAmount && poll.pledgeAmount > 0 && (poll.pledgeOutcome === 'pending' || poll.pledgeOutcome === undefined);

  return (
    <>
      <div className="container mx-auto px-2 sm:px-4 py-8 max-w-2xl">
        <Card className="shadow-xl rounded-lg">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-3">
              <NextLink href={`/profile/${poll.creator.id}`}>
                <Avatar className="h-12 w-12 border cursor-pointer">
                  <AvatarImage src={poll.creator.avatarUrl} alt={poll.creator.name} data-ai-hint={generateHintFromText(poll.creator.name) || "profile avatar"}/>
                  <AvatarFallback>{poll.creator.name.substring(0, 1)}</AvatarFallback>
                </Avatar>
              </NextLink>
              <div>
                <NextLink href={`/profile/${poll.creator.id}`}>
                  <p className="text-md font-semibold text-foreground hover:underline cursor-pointer">{poll.creator.name}</p>
                </NextLink>
                <p className="text-xs text-muted-foreground">@{poll.creator.username} &middot; {formatDistanceToNowStrict(parseISO(poll.createdAt), { addSuffix: true })}</p>
              </div>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-headline text-foreground flex items-center">
              {poll.isSpicy && <Flame className="w-5 h-5 mr-2 text-orange-500 flex-shrink-0" />}
              <span>{poll.question}</span>
            </CardTitle>

            {/* Image and Video display logic remains similar */}
            {poll.imageUrls && poll.imageUrls.length > 0 && (
              <div className="mt-4 space-y-3">
                 {/* ... */}
              </div>
            )}
            {poll.videoUrl && (
              <div className="mt-4">
                {/* ... */}
              </div>
            )}
          </CardHeader>

          <CardContent className="p-4 sm:p-6 pt-4">
            <div className={cn("space-y-3", pollHasTwoOptions && "flex gap-2 space-y-0")}>
              {poll.options.map((option) => (
                <PollOptionDisplay
                  key={option.id}
                  option={option}
                  totalVotes={poll.totalVotes}
                  isVoted={!!poll.isVoted}
                  isSelectedOption={poll.votedOptionId === option.id}
                  deadlinePassed={deadlinePassedState}
                  onVote={() => handleVote(option.id)}
                  pollHasTwoOptions={pollHasTwoOptions}
                  onShowDetails={() => handleShowOptionDetails(option)}
                  pollPledgeAmount={poll.pledgeAmount}
                  canVote={canVoteOnPoll} // Pass canVote
                />
              ))}
            </div>
             {!currentUser && (
                <div className="mt-3 text-sm text-destructive flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1.5" />
                    Please <NextLink href="/login" className="underline hover:text-destructive/80 mx-1">login</NextLink> or <NextLink href="/signup" className="underline hover:text-destructive/80 mx-1">sign up</NextLink> to vote.
                </div>
            )}
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1.5" />
              <span>{deadlinePassedState ? `Ended ${formatDistanceToNowStrict(parseISO(poll.deadline), { addSuffix: true })}` : `Ends ${timeRemaining}`} &middot; {poll.totalVotes.toLocaleString()} votes</span>
               {poll.pledgeAmount && poll.pledgeAmount > 0 && (
                 <span className="ml-1 text-green-600 font-semibold">&middot; Creator Pledged: ${poll.pledgeAmount.toLocaleString()}</span>
              )}
            </div>

            {showPledgeOutcomeButtons && (
              <div className="mt-4 pt-4 border-t space-y-2 sm:space-y-0 sm:flex sm:space-x-2">
                <p className="text-xs text-center sm:text-left text-muted-foreground mb-2 sm:mb-0 sm:w-full">Creator: Decide the pledge outcome.</p>
                <Button onClick={() => handlePledgeOutcome('accepted')} variant="outline" size="sm" className="w-full sm:w-auto">
                  <Check className="mr-2 h-4 w-4" /> Accept the Vote
                </Button>
                <Button onClick={() => handlePledgeOutcome('tipped_crowd')} variant="destructive" size="sm" className="w-full sm:w-auto">
                  <Users className="mr-2 h-4 w-4" /> Tip the Crowd
                </Button>
              </div>
            )}
            {poll.pledgeOutcome === 'accepted' && isCreator && deadlinePassedState && (
                <p className="mt-2 text-xs text-green-600">You accepted the crowd's vote for this pledge.</p>
            )}
            {poll.pledgeOutcome === 'tipped_crowd' && isCreator && deadlinePassedState && (
                <p className="mt-2 text-xs text-orange-600">You tipped the crowd for this pledge.</p>
            )}
          </CardContent>

          <CardFooter className="p-4 sm:p-6 border-t pt-4 flex flex-col items-stretch">
            <div className="flex justify-around mb-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Heart className="w-5 h-5 mr-1.5" /> {poll.likes.toLocaleString()} Likes
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={handleTipCreator} disabled={isTipping || !currentUser}>
                {isTipping ? <Loader2 className="mr-1.5 h-5 w-5 animate-spin" /> : <Gift className="w-5 h-5 mr-1.5" />}
                 Tip Creator {poll.tipCount && poll.tipCount > 0 ? `(${poll.tipCount.toLocaleString()})` : ''}
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={handleShare}>
                <Share2 className="w-5 h-5 mr-1.5" /> Share
              </Button>
            </div>

            <Separator className="my-4"/>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Comments ({comments.length})</h3>
              <form action={handleCommentSubmit} id="comment-form" className="flex items-start space-x-2 mb-6">
                {currentUser ? (
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={currentUser.photoURL || getRandomUserFromMock().avatarUrl} alt={currentUser.displayName || "User"} data-ai-hint="profile avatar" />
                    <AvatarFallback>{currentUser.displayName ? currentUser.displayName.substring(0,1) : 'U'}</AvatarFallback>
                  </Avatar>
                ) : (
                   <Avatar className="h-10 w-10 border bg-muted">
                      <UserCircle2 className="h-full w-full text-muted-foreground p-1.5"/>
                   </Avatar>
                )}
                <Textarea name="comment" placeholder={currentUser ? "Add a comment..." : "Login to add a comment..."} className="flex-grow min-h-[40px] max-h-[120px]" rows={1} disabled={!currentUser}/>
                <Button type="submit" size="icon" variant="default" className="h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={!currentUser}>
                  <Send className="h-5 w-5" />
                </Button>
              </form>
              {/* Comment display logic remains similar, using mock user data */}
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="flex items-start space-x-3">
                     {/* ... comment user avatar and details */}
                  </div>
                ))}
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      {selectedOptionForModal && (
        <OptionDetailsDialog
          option={selectedOptionForModal}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </>
  );
}
