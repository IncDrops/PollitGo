'use client';

import type { Poll, PollOption as PollOptionType, User } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MessageSquare, Heart, Share2, Gift, CheckCircle2, Film, Video as VideoIconLucide, Info, Zap, Check, Users, Flame, Loader2, AlertCircle } from 'lucide-react';
import { formatDistanceToNowStrict, parseISO, isPast } from 'date-fns';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useSwipeable } from 'react-swipeable';
import OptionDetailsDialog from './OptionDetailsDialog';
import { motion, useAnimationControls } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useStripe } from '@stripe/react-stripe-js';
import { signIn } from 'next-auth/react'; // For prompting login

interface PollCardProps {
  poll: Poll;
  onVote?: (pollId: string, optionId: string) => void;
  onPollActionComplete?: (pollId: string, swipeDirection?: 'left' | 'right') => void;
  onPledgeOutcome?: (pollId: string, outcome: 'accepted' | 'tipped_crowd') => void;
  currentUser?: User | null;
}

const OPTION_TEXT_TRUNCATE_LENGTH = 100;
const MIN_PAYOUT_PER_VOTER = 0.10;
const CREATOR_PLEDGE_SHARE_FOR_VOTERS = 0.50;

const generateHintFromText = (text: string = ""): string => {
  return text.split(' ').slice(0, 2).join(' ').toLowerCase();
};

const PollOption: React.FC<{
  option: PollOptionType;
  totalVotes: number;
  onVoteOptionClick: () => void;
  isVotedByCurrentUser: boolean;
  isSelectedOptionByCurrentUser: boolean;
  deadlinePassed: boolean;
  pollHasTwoOptions: boolean;
  canCurrentUserVote: boolean;
  onShowDetails: () => void;
}> = ({ option, totalVotes, onVoteOptionClick, isVotedByCurrentUser, isSelectedOptionByCurrentUser, deadlinePassed, pollHasTwoOptions, canCurrentUserVote, onShowDetails }) => {
  const percentage = totalVotes > 0 && (isVotedByCurrentUser || deadlinePassed) ? (option.votes / totalVotes) * 100 : 0;
  const showResults = isVotedByCurrentUser || deadlinePassed;
  const isTruncated = option.text.length > OPTION_TEXT_TRUNCATE_LENGTH;
  const truncatedText = isTruncated
    ? `${option.text.substring(0, OPTION_TEXT_TRUNCATE_LENGTH)}...`
    : option.text;

  const handleOptionClick = () => {
    onVoteOptionClick(); // This will either vote or show details based on parent logic
  };

  const handleDetailsIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowDetails();
  };

  return (
    <div className={cn("relative group", pollHasTwoOptions ? "flex-1" : "mb-2 w-full")}>
      <Button
        variant={isSelectedOptionByCurrentUser && showResults ? "default" : "outline"}
        className={cn(
          "w-full justify-start h-auto p-3 text-left relative overflow-hidden disabled:opacity-100 disabled:cursor-default",
          pollHasTwoOptions && "aspect-square flex flex-col items-center justify-center text-center",
          // Make clickable for details if voted, deadline passed, or can't vote (for non-two-option polls)
          (!canCurrentUserVote || isVotedByCurrentUser || deadlinePassed || pollHasTwoOptions || isTruncated || option.affiliateLink) && "cursor-pointer hover:bg-accent/60"
        )}
        onClick={handleOptionClick}
        // Disable button if user cannot vote AND it's not a case where clicking should show details (e.g., not truncated, no affiliate link, and two-option layout)
        disabled={!canCurrentUserVote && (isVotedByCurrentUser || deadlinePassed) && !pollHasTwoOptions && !(isTruncated || option.affiliateLink) }
        aria-pressed={isSelectedOptionByCurrentUser}
      >
        {showResults && !pollHasTwoOptions && (
          <div
            className="absolute top-0 left-0 h-full bg-primary/20 dark:bg-primary/30"
            style={{ width: `${percentage}%` }}
          />
        )}
        <div className={cn("relative z-10 flex w-full", pollHasTwoOptions ? "flex-col items-center" : "items-center")}>
          {option.imageUrl && (
            <Image
              src={option.imageUrl}
              alt={option.text.substring(0, 50)}
              width={pollHasTwoOptions ? 60 : 40}
              height={pollHasTwoOptions ? 60 : 40}
              className={cn("rounded-md object-cover shadow-sm", pollHasTwoOptions ? "mb-2" : "mr-2")}
              data-ai-hint={generateHintFromText(option.text) || "option visual"}
            />
          )}
          {option.videoUrl && !option.imageUrl && <VideoIconLucide className={cn("text-muted-foreground", pollHasTwoOptions ? "mb-2 h-10 w-10" : "w-5 h-5 mr-2")} />}
          <span className={cn("flex-grow", pollHasTwoOptions ? "text-sm mt-1 leading-tight" : "text-sm")}>{truncatedText}</span>

          {showResults && <span className={cn("text-xs font-semibold", pollHasTwoOptions ? "mt-1" : "ml-2 pl-1")}>{percentage.toFixed(0)}%</span>}

          {isSelectedOptionByCurrentUser && showResults && <CheckCircle2 className={cn("w-4 h-4", pollHasTwoOptions ? "mt-1 text-primary-foreground" : "ml-1 text-primary")} />}

          {(!pollHasTwoOptions && (isTruncated || option.affiliateLink)) && (
             <div
              onClick={handleDetailsIconClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleDetailsIconClick(e as any)}
              aria-label="View option details"
              className={cn(
                "absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
                "flex items-center justify-center rounded-full cursor-pointer p-1",
                "hover:bg-accent/70 hover:text-accent-foreground"
              )}
            >
              <Info className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
            </div>
          )}
        </div>
      </Button>
    </div>
  );
};

export default function PollCard({ poll, onVote, onPollActionComplete, onPledgeOutcome, currentUser }: PollCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const stripe = useStripe();
  const [deadlinePassed, setDeadlinePassed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [createdAtFormatted, setCreatedAtFormatted] = useState<string | null>(null);
  const [currentPoll, setCurrentPoll] = useState<Poll>(poll); // Local state for optimistic updates
  const [isTipping, setIsTipping] = useState(false);

  useEffect(() => {
    // Sync with prop changes, ensuring the local state reflects the parent's poll object
    // Create a new object to avoid direct mutation issues if parent reuses objects
    setCurrentPoll({...poll});
  }, [poll]);

  const [selectedOptionForModal, setSelectedOptionForModal] = useState<PollOptionType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const controls = useAnimationControls();
  // currentUser.id should be currentUser?.id to handle null
  const canSwipe = !!currentUser?.id && currentPoll.options.length === 2 && !currentPoll.isVoted && !deadlinePassed && !!onVote;


  const handleInternalVote = (optionId: string) => {
    if (!onVote) return; // Should always be provided from PollFeed
    if (!currentUser?.id) { // Check for authenticated user from prop
        toast({title: "Login Required", description: "Please login to vote.", variant:"destructive"});
        signIn(); // Prompt login
        return;
    }
    // Optimistically update UI, then call parent handler
    // This optimistic update is primarily for visual feedback; source of truth is in PollFeed or parent
    const pollBeforeUpdate = {...currentPoll}; // Save state before update

    setCurrentPoll(prevPoll => {
      if (prevPoll.isVoted) return prevPoll; // Already voted in local state
      const newTotalVotes = prevPoll.totalVotes + 1;
      const updatedOptions = prevPoll.options.map(opt =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      );
      return { ...prevPoll, options: updatedOptions, totalVotes: newTotalVotes, isVoted: true, votedOptionId: optionId };
    });

    onVote(currentPoll.id, optionId); // Call the actual vote handler from PollFeed

    // Check for pledge warning based on *updated* votes
    const updatedOption = currentPoll.options.find(opt => opt.id === optionId);
    if (currentPoll.pledgeAmount && currentPoll.pledgeAmount > 0 && updatedOption) {
        const amountToDistributeToVoters = currentPoll.pledgeAmount * CREATOR_PLEDGE_SHARE_FOR_VOTERS;
        const votesForThisOptionAfterCurrentVote = (pollBeforeUpdate.options.find(o => o.id === optionId)?.votes || 0) + 1;

        if ((amountToDistributeToVoters / votesForThisOptionAfterCurrentVote) < MIN_PAYOUT_PER_VOTER && votesForThisOptionAfterCurrentVote > 0) {
            toast({
                title: "Low Payout Warning",
                description: `Your vote is counted! Potential PollitPoint payout might be low.`,
                variant: "default", duration: 7000,
            });
        }
    }
  };


  const handlers = useSwipeable({
    onSwiped: async (eventData) => {
      if (!canSwipe || typeof onVote === 'undefined') return;
      const direction = eventData.dir;
      const optionToVote = direction === 'Left' ? currentPoll.options[0].id : currentPoll.options[1].id;

      controls.start({
        x: direction === "Left" ? "-100%" : "100%",
        opacity: 0,
        transition: { duration: 0.3 },
      }).then(() => {
        if (onPollActionComplete) {
          onPollActionComplete(currentPoll.id, direction.toLowerCase() as 'left' | 'right');
        }
      });
      handleInternalVote(optionToVote);
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  useEffect(() => {
    const deadlineDate = parseISO(currentPoll.deadline);
    const checkDeadline = () => {
      const now = new Date();
      const remaining = deadlineDate.getTime() - now.getTime();
      if (remaining <= 0) {
        setDeadlinePassed(true);
        setTimeRemaining("Ended");
      } else {
        setDeadlinePassed(false);
        setTimeRemaining(formatDistanceToNowStrict(deadlineDate, { addSuffix: true }));
      }
    };
    checkDeadline();
    const interval = setInterval(checkDeadline, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [currentPoll.deadline]);

  useEffect(() => {
    setCreatedAtFormatted(formatDistanceToNowStrict(parseISO(currentPoll.createdAt), { addSuffix: true }));
  }, [currentPoll.createdAt]);

  const handleShowOptionDetails = (option: PollOptionType) => {
    setSelectedOptionForModal(option);
    setIsModalOpen(true);
  };

  const onCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on interactive elements like buttons or links within the card
    if ((e.target as HTMLElement).closest('button, a')) {
      return;
    }
    router.push(`/polls/${currentPoll.id}`);
  };

  const onCreatorClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    router.push(`/profile/${currentPoll.creator.id}`);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/polls/${currentPoll.id}`;
    const shareData = {
      title: currentPoll.question,
      text: `Check out this poll on PollitAGo: ${currentPoll.question}`,
      url: shareUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({ title: "Link Copied", description: "Poll link copied to clipboard."});
      }
    } catch (error) {
       console.error("Error sharing poll:", error);
       toast({ title: "Error", description: "Could not share poll link.", variant: "destructive"});
    }
  };

  const handleTipCreator = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser?.id) {
      toast({ title: "Login Required", description: "Please login to tip the creator.", variant: "destructive" });
      signIn();
      return;
    }
    if (!stripe) {
      toast({ title: "Stripe Error", description: "Stripe is not available. Please try again later.", variant: "destructive" });
      return;
    }
    setIsTipping(true);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 500, // Example: 500 cents = $5.00
          currency: 'usd',
          itemName: `Tip for ${currentPoll.creator.name}`,
          metadata: { pollId: currentPoll.id, tipperUserId: currentUser.id }
        }),
      });
      const session = await response.json();
      if (response.ok && session.id) {
        const result = await stripe.redirectToCheckout({ sessionId: session.id });
        if (result.error) {
          throw new Error(result.error.message);
        }
      } else {
        throw new Error(session.error || 'Failed to create Stripe session for tip.');
      }
    } catch (error: any) {
        console.error("Tip error:", error);
        toast({ title: "Tip Failed", description: error.message || "Could not process tip.", variant: "destructive" });
    } finally {
      setIsTipping(false);
    }
  };

  const handlePledgeOutcomeInternal = (outcome: 'accepted' | 'tipped_crowd') => {
    if (!currentUser?.id || currentUser.id !== currentPoll.creator.id) {
        toast({title: "Action Denied", description: "Only the poll creator can decide the pledge outcome.", variant: "destructive"});
        return;
    }
    if (onPledgeOutcome) {
      onPledgeOutcome(currentPoll.id, outcome);
    }
  };

  const pollHasTwoOptions = currentPoll.options.length === 2;
  const canCurrentUserVoteOnPoll = !!currentUser?.id && !currentPoll.isVoted && !deadlinePassed;
  const isCreator = currentUser?.id === currentPoll.creator.id;
  const showPledgeOutcomeButtons = isCreator && deadlinePassed && currentPoll.pledgeAmount && currentPoll.pledgeAmount > 0 && (currentPoll.pledgeOutcome === 'pending' || currentPoll.pledgeOutcome === undefined);

  return (
    <>
      <motion.div
        {...(canSwipe ? handlers : {})}
        data-swipe-handler={canSwipe ? "true" : undefined}
        className="w-full touch-pan-y" // Allow vertical scroll
        animate={controls}
      >
        <Card 
          onClick={onCardClick} 
          className="w-full max-w-md mx-auto shadow-lg rounded-xl overflow-hidden mb-4 bg-card active:shadow-2xl active:scale-[1.005] transition-transform duration-100 ease-out cursor-pointer"
        >
          <CardHeader className="p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Avatar className="h-10 w-10 border" onClick={onCreatorClick}>
                <AvatarImage 
                  src={currentPoll.creator.avatarUrl || undefined} 
                  alt={currentPoll.creator.name || "User avatar"} 
                  data-ai-hint={generateHintFromText(currentPoll.creator.name) || "profile avatar"}
                />
                <AvatarFallback>{currentPoll.creator.name ? currentPoll.creator.name.substring(0,1).toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground hover:underline" onClick={onCreatorClick}>{currentPoll.creator.name}</p>
                <p className="text-xs text-muted-foreground">@{currentPoll.creator.username} &middot; {createdAtFormatted || 'Just now'}</p>
              </div>
            </div>
            <CardTitle className="text-md font-semibold text-foreground leading-snug flex items-start">
               {currentPoll.isSpicy && <Flame className="w-4 h-4 mr-1.5 text-orange-500 flex-shrink-0 mt-0.5" />}
              <span>{currentPoll.question}</span>
            </CardTitle>
             {currentPoll.imageUrls && currentPoll.imageUrls.length > 0 && (
                <div className="mt-2 -mx-4"> {/* Negative margin to make images bleed to card edges if desired, or keep p-0 on content */}
                    <div className={cn("grid gap-0.5", currentPoll.imageUrls.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
                        {currentPoll.imageUrls.slice(0, currentPoll.imageUrls.length === 3 ? 2 : 4).map((imgUrl, idx) => ( // Show 2 if 3 images, up to 4
                            <div key={idx} className={cn(
                                "relative bg-muted overflow-hidden",
                                currentPoll.imageUrls?.length === 1 ? "aspect-[16/9]" : "aspect-square",
                                currentPoll.imageUrls?.length === 3 && idx === 0 ? "col-span-2" : ""
                                )}>
                                <Image 
                                  src={imgUrl} 
                                  alt={`Poll image ${idx + 1}`} 
                                  fill
                                  style={{ objectFit: 'cover' }}
                                  data-ai-hint={currentPoll.imageKeywords && currentPoll.imageKeywords[idx] ? currentPoll.imageKeywords[idx] : "poll visual"}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {currentPoll.videoUrl && (
                <div className="mt-2 -mx-4">
                    <video src={currentPoll.videoUrl} controls className="w-full aspect-video rounded-none bg-black" data-ai-hint="poll video" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
          </CardHeader>

          <CardContent className="p-4 pt-2">
            {canSwipe ? (
              <div className="text-center text-muted-foreground text-xs py-2">
                <Zap className="inline-block w-4 h-4 mr-1 animate-pulse" /> Swipe left or right to vote!
              </div>
            ) : !currentUser?.id && !deadlinePassed && (
                 <div className="text-center text-destructive text-xs py-2 flex items-center justify-center bg-destructive/10 p-2 rounded-md">
                    <AlertCircle className="w-4 h-4 mr-1.5" /> Please 
                    <Button variant="link" className="p-0 h-auto text-destructive hover:text-destructive/80 mx-1 text-xs" onClick={(e) => {e.stopPropagation(); signIn();}}>login</Button> 
                    to vote.
                </div>
            )}
            <div className={cn(pollHasTwoOptions ? "flex gap-2" : "space-y-2")}>
              {currentPoll.options.map((option) => (
                <PollOption
                  key={option.id}
                  option={option}
                  totalVotes={currentPoll.totalVotes}
                  onVoteOptionClick={() => {
                    // If it's a two-option poll, swiping handles voting. Clicking shows details.
                    // If not two options, clicking votes (if can vote) or shows details.
                    if (pollHasTwoOptions || !canCurrentUserVoteOnPoll || currentPoll.isVoted || deadlinePassed) {
                         handleShowOptionDetails(option);
                    } else {
                         handleInternalVote(option.id);
                    }
                  }}
                  isVotedByCurrentUser={!!currentPoll.isVoted}
                  isSelectedOptionByCurrentUser={currentPoll.votedOptionId === option.id}
                  deadlinePassed={deadlinePassed}
                  pollHasTwoOptions={pollHasTwoOptions}
                  canCurrentUserVote={canCurrentUserVoteOnPoll}
                  onShowDetails={() => handleShowOptionDetails(option)}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center text-xs text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              <span>{deadlinePassed ? `Ended ${timeRemaining}` : `Ends ${timeRemaining}`} &middot; {currentPoll.totalVotes.toLocaleString()} votes</span>
              {currentPoll.pledgeAmount && currentPoll.pledgeAmount > 0 && (
                 <span className="ml-1 text-green-500 font-medium">&middot; Pledged: ${currentPoll.pledgeAmount.toLocaleString()}</span>
              )}
            </div>
            {showPledgeOutcomeButtons && (
              <div className="mt-3 pt-3 border-t space-y-1 sm:space-y-0 sm:flex sm:space-x-2">
                <p className="text-xs text-center sm:text-left text-muted-foreground mb-1 sm:mb-0 sm:w-full">Creator: Decide pledge outcome.</p>
                <Button onClick={(e) => { e.stopPropagation(); handlePledgeOutcomeInternal('accepted'); }} variant="outline" size="sm" className="w-full sm:w-auto text-xs">
                  <Check className="mr-1 h-3 w-3" /> Accept Vote
                </Button>
                <Button onClick={(e) => { e.stopPropagation(); handlePledgeOutcomeInternal('tipped_crowd');}} variant="destructive" size="sm" className="w-full sm:w-auto text-xs">
                  <Users className="mr-1 h-3 w-3" /> Tip Crowd
                </Button>
              </div>
            )}
             {currentPoll.pledgeOutcome === 'accepted' && isCreator && deadlinePassed && (
                <p className="mt-1 text-xs text-green-600">You accepted the crowd's vote for this pledge.</p>
            )}
            {currentPoll.pledgeOutcome === 'tipped_crowd' && isCreator && deadlinePassed && (
                <p className="mt-1 text-xs text-orange-600">You tipped the crowd for this pledge.</p>
            )}
          </CardContent>

          <CardFooter className="p-3 border-t flex justify-around">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary text-xs px-1.5">
              <Heart className="w-4 h-4 mr-1" /> {currentPoll.likes.toLocaleString()}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary text-xs px-1.5" onClick={onCardClick}>
              <MessageSquare className="w-4 h-4 mr-1" /> {currentPoll.commentsCount.toLocaleString()}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary text-xs px-1.5" onClick={handleTipCreator} disabled={isTipping || !currentUser?.id}>
              {isTipping ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Gift className="w-4 h-4 mr-1" />}
               Tip {currentPoll.tipCount && currentPoll.tipCount > 0 ? `(${currentPoll.tipCount.toLocaleString()})` : ''}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary text-xs px-1.5" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
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