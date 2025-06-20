
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
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useSwipeable } from 'react-swipeable';
import OptionDetailsDialog from './OptionDetailsDialog';
import { motion, useAnimationControls } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useStripe } from '@stripe/react-stripe-js';
import { signIn } from 'next-auth/react'; 

interface PollCardProps {
  poll: Poll;
  onVote?: (pollId: string, optionId: string) => void;
  onToggleLike?: (pollId: string) => void;
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

const PollOptionDisplay: React.FC<{ 
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
    onVoteOptionClick();
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
          (!canCurrentUserVote || isVotedByCurrentUser || deadlinePassed || pollHasTwoOptions || isTruncated || option.affiliateLink) && "cursor-pointer hover:bg-accent/60"
        )}
        onClick={handleOptionClick}
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

export default function PollCard({ poll, onVote, onToggleLike, onPollActionComplete, onPledgeOutcome, currentUser }: PollCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const stripe = useStripe();
  const [deadlinePassed, setDeadlinePassed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [createdAtFormatted, setCreatedAtFormatted] = useState<string | null>(null);
  const [currentPoll, setCurrentPoll] = useState<Poll>(poll);
  const [isTipping, setIsTipping] = useState(false);
  const [isLikingInProgress, setIsLikingInProgress] = useState(false);

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();

  useEffect(() => {
    setCurrentPoll({...poll});
  }, [poll]);

  const [selectedOptionForModal, setSelectedOptionForModal] = useState<PollOptionType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isPollType = currentPoll.postType === 'poll' || !currentPoll.postType;
  const canSwipe = !!currentUser?.id && isPollType && currentPoll.options.length === 2 && !currentPoll.isVoted && !deadlinePassed && !!onVote;

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleInternalVote = (optionId: string) => {
    if (!onVote) return;
    if (!currentUser?.id) {
        toast({title: "Login Required", description: "Please login to vote.", variant:"destructive"});
        signIn(); 
        return;
    }
    const pollBeforeUpdate = {...currentPoll};
    onVote(currentPoll.id, optionId); 
    
    setCurrentPoll(prevPoll => {
      if (prevPoll.isVoted && prevPoll.votedOptionId === optionId) return prevPoll; 
      const newTotalVotes = prevPoll.isVoted ? prevPoll.totalVotes : prevPoll.totalVotes + 1; 
      const updatedOptions = prevPoll.options.map(opt =>
        opt.id === optionId ? { ...opt, votes: (prevPoll.options.find(o=>o.id===optionId)?.votes || 0) + (prevPoll.votedOptionId === optionId ? 0 : 1) } : opt 
      );
      return { ...prevPoll, options: updatedOptions, totalVotes: newTotalVotes, isVoted: true, votedOptionId: optionId };
    });


    const votedOptionAfterUpdate = pollBeforeUpdate.options.find(opt => opt.id === optionId);
    if (pollBeforeUpdate.pledgeAmount && pollBeforeUpdate.pledgeAmount > 0 && votedOptionAfterUpdate) {
        const amountToDistributeToVoters = pollBeforeUpdate.pledgeAmount * CREATOR_PLEDGE_SHARE_FOR_VOTERS;
        const votesForThisOptionBeforeCurrent = votedOptionAfterUpdate.votes; 
        const votesAfterThisUsersVote = votesForThisOptionBeforeCurrent + 1;

        if ((amountToDistributeToVoters / votesAfterThisUsersVote) < MIN_PAYOUT_PER_VOTER && votesAfterThisUsersVote > 0) {
            setTimeout(() => { 
              toast({
                  title: "Low Payout Warning",
                  description: `Your vote is counted! Potential PollitPoint payout might be low.`,
                  variant: "default", duration: 7000,
              });
            }, 100);
        }
    }
  };

  const handleInternalToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onToggleLike || isLikingInProgress) return;
    if (!currentUser?.id) {
      toast({ title: "Login Required", description: "Please login to like posts.", variant: "destructive" });
      signIn();
      return;
    }
    setIsLikingInProgress(true);
    onToggleLike(currentPoll.id); 
    setCurrentPoll(prev => ({...prev, isLiked: !prev.isLiked, likes: prev.isLiked ? prev.likes -1 : prev.likes + 1}));
    await new Promise(resolve => setTimeout(resolve, 300)); 
    setIsLikingInProgress(false);
  };

  const swipeHandlers = useSwipeable({
    onSwipeStart: () => {
      clearLongPressTimer();
    },
    onSwiped: async (eventData) => {
      if (!canSwipe || typeof onVote === 'undefined') return;
      clearLongPressTimer(); 

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

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return; 
    clearLongPressTimer();
    longPressTimer.current = setTimeout(() => {
      router.push(`/profile/${currentPoll.creator.id}`);
      longPressTimer.current = null; 
    }, 800);
  }, [clearLongPressTimer, router, currentPoll.creator.id]);

  const handlePointerUp = useCallback(() => {
    clearLongPressTimer();
  }, [clearLongPressTimer]);


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
    const interval = setInterval(checkDeadline, 60000);
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
    if ((e.target as HTMLElement).closest('button, a')) return;
    router.push(`/polls/${currentPoll.id}`);
  };

  const onCreatorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/profile/${currentPoll.creator.id}`);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/polls/${currentPoll.id}`;
    const shareData = {
      title: currentPoll.question,
      text: `Check out this post on PollitAGo: ${currentPoll.question}`,
      url: shareUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({ title: "Link Copied", description: "Post link copied to clipboard."});
      }
    } catch (error) {
       console.error("Error sharing post:", error);
       toast({ title: "Error", description: "Could not share post link.", variant: "destructive"});
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
      toast({ title: "Stripe Error", description: "Stripe is not available.", variant: "destructive" });
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
          itemName: `Tip for ${currentPoll.creator.name}`,
          metadata: { pollId: currentPoll.id, pollCreatorId: currentPoll.creator.id, tipperUserId: currentUser.id }
        }),
      });
      const session = await response.json();
      if (response.ok && session.id) {
        const result = await stripe.redirectToCheckout({ sessionId: session.id });
        if (result.error) throw new Error(result.error.message);
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

  const pollHasTwoOptions = isPollType && currentPoll.options.length === 2;
  const canCurrentUserVoteOnPoll = !!currentUser?.id && isPollType && !currentPoll.isVoted && !deadlinePassed;
  const isCreator = currentUser?.id === currentPoll.creator.id;
  const showPledgeOutcomeButtons = isPollType && isCreator && deadlinePassed && currentPoll.pledgeAmount && currentPoll.pledgeAmount > 0 && (currentPoll.pledgeOutcome === 'pending' || currentPoll.pledgeOutcome === undefined);

  return (
    <>
      <motion.div
        {...(canSwipe ? swipeHandlers : {})}
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp} 
        className="w-full touch-pan-y"
        animate={controls}
        style={{WebkitTapHighlightColor: 'transparent'}}
      >
        <Card
          onClick={onCardClick}
          className="w-full max-w-md mx-auto shadow-lg rounded-xl overflow-hidden mb-4 bg-card active:shadow-2xl active:scale-[1.005] transition-transform duration-100 ease-out cursor-pointer"
        >
          <CardHeader className="p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Avatar className="h-10 w-10 border" onClick={onCreatorClick}>
                <AvatarImage src={currentPoll.creator.avatarUrl} alt={currentPoll.creator.name} data-ai-hint={generateHintFromText(currentPoll.creator.name) || "profile avatar"}/>
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
                <div className="mt-2 -mx-4"> 
                    <div className={cn("grid gap-0.5", currentPoll.imageUrls.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
                        {currentPoll.imageUrls.slice(0, currentPoll.postType === 'opinion' ? 2 : (currentPoll.imageUrls.length === 3 ? 2 : 4)).map((imgUrl, idx) => (
                            <div key={idx} className={cn(
                                "relative bg-muted overflow-hidden",
                                currentPoll.imageUrls?.length === 1 ? "aspect-[16/9]" : "aspect-square",
                                (currentPoll.postType === 'poll' && currentPoll.imageUrls?.length === 3 && idx === 0) ? "col-span-2" : ""
                                )}>
                                <Image src={imgUrl} alt={`Post image ${idx + 1}`} fill className="object-cover" sizes="100vw" data-ai-hint={currentPoll.imageKeywords && currentPoll.imageKeywords[idx] ? currentPoll.imageKeywords[idx] : "post visual"}/>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {currentPoll.videoUrl && (
                <div className="mt-2 -mx-4">
                    <video src={currentPoll.videoUrl} controls className="w-full aspect-video rounded-none bg-black" data-ai-hint="post video" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
          </CardHeader>

          <CardContent className="p-4 pt-2">
            {isPollType && canSwipe && (
              <div className="text-center text-muted-foreground text-xs py-2">
                <Zap className="inline-block w-4 h-4 mr-1 animate-pulse" /> Swipe left or right to vote!
              </div>
            )}
            {isPollType && !currentUser?.id && !deadlinePassed && (
                 <div className="text-center text-destructive text-xs py-2 flex items-center justify-center bg-destructive/10 p-2 rounded-md">
                    <AlertCircle className="w-4 h-4 mr-1.5" /> Please 
                    <Button variant="link" className="p-0 h-auto text-destructive hover:text-destructive/80 mx-1 text-xs" onClick={(e) => {e.stopPropagation(); signIn();}}>login</Button> 
                    to vote.
                </div>
            )}
            {isPollType && (
              <div className={cn(pollHasTwoOptions ? "flex gap-2" : "space-y-2")}>
                {currentPoll.options.map((option) => (
                  <PollOptionDisplay
                    key={option.id}
                    option={option}
                    totalVotes={currentPoll.totalVotes}
                    onVoteOptionClick={() => {
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
            )}
            <div className="mt-3 flex items-center text-xs text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              <span>{deadlinePassed ? `Ended ${timeRemaining}` : `Ends ${timeRemaining}`}</span>
              {isPollType && <span className="ml-1">&middot; {currentPoll.totalVotes.toLocaleString()} votes</span>}
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
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary text-xs px-1.5" onClick={handleInternalToggleLike} disabled={isLikingInProgress}>
              {isLikingInProgress ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Heart className={cn("w-4 h-4 mr-1", currentPoll.isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground")} /> }
              {currentPoll.likes.toLocaleString()}
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
      {selectedOptionForModal && isPollType && (
        <OptionDetailsDialog
          option={selectedOptionForModal}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </>
  );
}

