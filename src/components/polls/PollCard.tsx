
'use client';

import type { Poll, PollOption as PollOptionType, User } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MessageSquare, Heart, Share2, Gift, CheckCircle2, Film, Video as VideoIconLucide, Info, Zap, Check, Users } from 'lucide-react';
import { parseISO, isPast } from 'date-fns';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useSwipeable } from 'react-swipeable';
import OptionDetailsDialog from './OptionDetailsDialog';
import { motion, useAnimationControls } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { mockUsers } from '@/lib/mockData'; // Assuming currentUser might be mocked for now

interface PollCardProps {
  poll: Poll;
  onVote?: (pollId: string, optionId: string) => void; // Made optional
  onPollActionComplete?: (pollId: string, swipeDirection?: 'left' | 'right') => void;
  onPledgeOutcome?: (pollId: string, outcome: 'accepted' | 'tipped_crowd') => void;
  currentUser?: User | null;
}

const OPTION_TEXT_TRUNCATE_LENGTH = 100;

const PollOption: React.FC<{
  option: PollOptionType;
  totalVotes: number;
  onVoteOptionClick: () => void; // Changed prop name to avoid confusion
  isVoted: boolean;
  isSelectedOption: boolean;
  deadlinePassed: boolean;
  pollHasTwoOptions: boolean;
  canVote: boolean;
  onShowDetails: () => void;
}> = ({ option, totalVotes, onVoteOptionClick, isVoted, isSelectedOption, deadlinePassed, pollHasTwoOptions, canVote, onShowDetails }) => {
  const percentage = totalVotes > 0 && (isVoted || deadlinePassed) ? (option.votes / totalVotes) * 100 : 0;
  const showResults = isVoted || deadlinePassed;
  const isTruncated = option.text.length > OPTION_TEXT_TRUNCATE_LENGTH;
  const truncatedText = isTruncated
    ? `${option.text.substring(0, OPTION_TEXT_TRUNCATE_LENGTH)}...`
    : option.text;

  const handleOptionClick = () => {
    // This click now primarily calls the passed handler, which might be onVote or onShowDetails
    onVoteOptionClick();
  };

  const handleDetailsIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowDetails();
  };

  return (
    <div className={cn("relative group", pollHasTwoOptions ? "flex-1" : "mb-2 w-full")}>
      <Button
        variant={isSelectedOption && showResults ? "default" : "outline"}
        className={cn(
          "w-full justify-start h-auto p-3 text-left relative overflow-hidden disabled:opacity-100 disabled:cursor-default",
          pollHasTwoOptions && "aspect-square flex flex-col items-center justify-center text-center",
          (!canVote || isVoted || deadlinePassed || pollHasTwoOptions || isTruncated || option.affiliateLink) && "cursor-pointer hover:bg-accent/60"
        )}
        onClick={handleOptionClick}
        disabled={canVote && (isVoted || deadlinePassed) && !pollHasTwoOptions && !(isTruncated || option.affiliateLink) }
        aria-pressed={isSelectedOption}
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
              alt={option.text}
              width={pollHasTwoOptions ? 60 : 40}
              height={pollHasTwoOptions ? 60 : 40}
              className={cn("rounded-md object-cover shadow-sm", pollHasTwoOptions ? "mb-2" : "mr-2")}
              data-ai-hint="poll option"
            />
          )}
          {option.videoUrl && !option.imageUrl && <VideoIconLucide className={cn("text-muted-foreground", pollHasTwoOptions ? "mb-2 h-10 w-10" : "w-5 h-5 mr-2")} />}
          <span className={cn("flex-grow", pollHasTwoOptions ? "text-sm mt-1 leading-tight" : "text-sm")}>{truncatedText}</span>

          {showResults && <span className={cn("text-xs font-semibold", pollHasTwoOptions ? "mt-1" : "ml-2 pl-1")}>{percentage.toFixed(0)}%</span>}

          {isSelectedOption && showResults && <CheckCircle2 className={cn("w-4 h-4", pollHasTwoOptions ? "mt-1 text-primary-foreground" : "ml-1 text-primary")} />}

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
  const [deadlinePassed, setDeadlinePassed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [createdAtFormatted, setCreatedAtFormatted] = useState<string | null>(null);
  const [currentPoll, setCurrentPoll] = useState<Poll>(poll);


  useEffect(() => {
    setCurrentPoll(poll);
  }, [poll]);

  const [selectedOptionForModal, setSelectedOptionForModal] = useState<PollOptionType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const controls = useAnimationControls();

  const canSwipe = currentPoll.options.length === 2 && !currentPoll.isVoted && !deadlinePassed && !!onPollActionComplete && !!onVote;

  const handlers = useSwipeable({
    onSwiped: async (eventData) => {
      if (!canSwipe || !onVote) return;

      const threshold = 80;
      let swipeDirection: 'left' | 'right' | undefined = undefined;

      if (Math.abs(eventData.deltaX) > threshold) {
        if (eventData.dir === 'Right') {
          swipeDirection = 'right';
          onVote(currentPoll.id, currentPoll.options[0].id);
        } else if (eventData.dir === 'Left') {
          swipeDirection = 'left';
          onVote(currentPoll.id, currentPoll.options[1].id);
        }
        onPollActionComplete?.(currentPoll.id, swipeDirection);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const formatTimeDifference = useCallback((targetDate: Date): string => {
    const now = new Date();
    let diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      return "Ended";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);
    const seconds = Math.floor(diff / 1000);

    let parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || (days > 0 && (minutes > 0 || seconds > 0))) parts.push(`${hours}h`);
    if (minutes > 0 || ((days > 0 || hours > 0) && seconds > 0)) parts.push(`${minutes}m`);
    if (days === 0 && hours === 0 && minutes < 5 && parts.length === 0) {
       parts.push(`${seconds}s`);
    } else if (parts.length === 0 && diff > 0) {
       return `${seconds}s`;
    } else if (parts.length === 0 && diff <=0) {
       return "Ending soon";
    }

    return parts.join(' ') || "0s";
  }, []);

  useEffect(() => {
    const deadlineDate = parseISO(currentPoll.deadline);
    const updateTimer = () => {
        setTimeRemaining(formatTimeDifference(deadlineDate));
        setDeadlinePassed(isPast(deadlineDate));
    };
    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, [currentPoll.deadline, formatTimeDifference]);


  useEffect(() => {
    try {
      const createdDate = parseISO(currentPoll.createdAt);
      setCreatedAtFormatted(new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(createdDate));
    } catch (error) {
      console.error("Error parsing createdAt date:", error);
      setCreatedAtFormatted("Date unavailable");
    }
  }, [currentPoll.createdAt]);


  const handleShowOptionDetails = (option: PollOptionType) => {
    setSelectedOptionForModal(option);
    setIsModalOpen(true);
  };

  const onCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[aria-label="View option details"]')) {
        return;
    }
    if ((e.target as HTMLElement).closest('button, a, [data-swipe-handler]') || (canSwipe && (e.target as HTMLElement).closest('[role="button"]'))) {
      return;
    }
    router.push(`/polls/${currentPoll.id}`);
  };

  const onCreatorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/profile/${currentPoll.creator.id}`);
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/polls/${currentPoll.id}`;
    const shareData = {
      title: 'Check out this poll on PollitAGo!',
      text: `"${currentPoll.question}" - Vote now!`,
      url: shareUrl,
    };

    let sharedNatively = false;
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('Poll shared successfully via native share.');
        sharedNatively = true;
      } catch (error) {
        console.error('Error sharing poll via native share:', error);
      }
    }

    if (!sharedNatively) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: 'Link Copied!',
          description: 'Poll link copied to your clipboard.',
        });
      } catch (error) {
        console.error('Failed to copy poll link:', error);
        toast({
          title: 'Error Copying Link',
          description: 'Could not copy link to clipboard.',
          variant: 'destructive',
        });
      }
    }
  };

  const handlePledgeOutcome = (outcome: 'accepted' | 'tipped_crowd') => {
    setCurrentPoll(prev => ({ ...prev, pledgeOutcome: outcome }));
    if (onPledgeOutcome) {
      onPledgeOutcome(currentPoll.id, outcome);
    } else {
      console.log(`Pledge outcome for poll ${currentPoll.id}: ${outcome} (simulated)`);
      toast({ title: `Pledge Outcome: ${outcome.replace('_', ' ')}`, description: "Action simulated on client."});
    }
  };


  const pollHasTwoOptions = currentPoll.options.length === 2;
  const canVoteOnPoll = !!onVote && !currentPoll.isVoted && !deadlinePassed; // onVote must exist to be able to vote
  const isCreator = currentUser?.id === currentPoll.creator.id;
  const showPledgeOutcomeButtons = isCreator && deadlinePassed && currentPoll.pledgeAmount && currentPoll.pledgeAmount > 0 && (currentPoll.pledgeOutcome === 'pending' || currentPoll.pledgeOutcome === undefined);


  return (
    <>
      <motion.div
        {...(canSwipe ? handlers : {})}
        data-swipe-handler={canSwipe ? "true" : undefined}
        className="w-full touch-pan-y"
        animate={controls}
      >
        <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl overflow-hidden mb-4 bg-card active:shadow-2xl active:scale-[1.01] transition-transform duration-100 ease-out">
          <CardHeader className="p-4 cursor-pointer" onClick={onCardClick}>
            <div onClick={onCreatorClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onCreatorClick(e)} className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={currentPoll.creator.avatarUrl} alt={currentPoll.creator.name} data-ai-hint="profile avatar" />
                <AvatarFallback>{currentPoll.creator.name.substring(0, 1)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">{currentPoll.creator.name}</p>
                <p className="text-xs text-muted-foreground">
                  @{currentPoll.creator.username} &middot; {createdAtFormatted || 'Loading time...'}
                </p>
              </div>
            </div>
            <CardTitle className="text-lg font-headline mt-3 text-foreground">{currentPoll.question}</CardTitle>
          </CardHeader>

          {(currentPoll.imageUrls && currentPoll.imageUrls.length > 0) && (
            <div className="w-full h-64 relative cursor-pointer bg-muted/30" onClick={onCardClick}>
              <Image src={currentPoll.imageUrls[0]} alt={currentPoll.question} layout="fill" objectFit="cover" data-ai-hint="poll image content" />
              {currentPoll.videoUrl && (
                <div className="absolute bottom-2 right-2 bg-black/70 p-1.5 rounded-md backdrop-blur-sm shadow-md" title="Video available">
                  <Film className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          )}
          {(!currentPoll.imageUrls || currentPoll.imageUrls.length === 0) && currentPoll.videoUrl && (
            <div className="w-full h-64 relative bg-black flex items-center justify-center cursor-pointer" onClick={onCardClick}>
              <VideoIconLucide className="w-16 h-16 text-white/70" />
              <p className="absolute bottom-2 right-2 text-xs text-white/80 bg-black/50 px-1 py-0.5 rounded">Video</p>
            </div>
          )}

          <CardContent className="p-4">
            {canSwipe ? (
              <div className="text-center text-muted-foreground text-xs py-2">
                <Zap className="inline-block w-4 h-4 mr-1 animate-pulse" /> Swipe left or right to vote!
              </div>
            ) : null}
            <div className={cn(pollHasTwoOptions ? "flex gap-2" : "")}>
              {currentPoll.options.map((option) => (
                <PollOption
                  key={option.id}
                  option={option}
                  totalVotes={currentPoll.totalVotes}
                  onVoteOptionClick={() => { // Changed prop name here
                     if (canVoteOnPoll && !pollHasTwoOptions && onVote) onVote(currentPoll.id, option.id);
                     else handleShowOptionDetails(option);
                  }}
                  isVoted={!!currentPoll.isVoted}
                  isSelectedOption={currentPoll.votedOptionId === option.id}
                  deadlinePassed={deadlinePassed}
                  pollHasTwoOptions={pollHasTwoOptions}
                  canVote={canVoteOnPoll}
                  onShowDetails={() => handleShowOptionDetails(option)}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center text-xs text-muted-foreground">
              <Clock className="w-4 h-4 mr-1.5" />
              <span>{deadlinePassed ? `Ended` : timeRemaining || 'Calculating...'} &middot; {currentPoll.totalVotes.toLocaleString()} votes</span>
              {currentPoll.pledgeAmount && currentPoll.pledgeAmount > 0 && (
                 <span className="ml-1 text-green-600 font-semibold">&middot; Creator Pledged: ${currentPoll.pledgeAmount.toLocaleString()}</span>
              )}
            </div>

            {showPledgeOutcomeButtons && (
              <div className="mt-4 pt-4 border-t space-y-2 sm:space-y-0 sm:flex sm:space-x-2">
                 <p className="text-xs text-center sm:text-left text-muted-foreground mb-2 sm:mb-0 sm:w-full">Pledge outcome decision needed.</p>
                <Button onClick={() => handlePledgeOutcome('accepted')} variant="outline" size="sm" className="w-full sm:w-auto">
                  <Check className="mr-2 h-4 w-4" /> Accept the Vote
                </Button>
                <Button onClick={() => handlePledgeOutcome('tipped_crowd')} variant="destructive" size="sm" className="w-full sm:w-auto">
                  <Users className="mr-2 h-4 w-4" /> Tip the Crowd
                </Button>
              </div>
            )}
             {currentPoll.pledgeOutcome === 'accepted' && isCreator && deadlinePassed && (
                <p className="mt-2 text-xs text-green-600">You accepted the crowd's vote for this pledge.</p>
            )}
            {currentPoll.pledgeOutcome === 'tipped_crowd' && isCreator && deadlinePassed && (
                <p className="mt-2 text-xs text-orange-600">You tipped the crowd for this pledge.</p>
            )}


          </CardContent>

          <CardFooter className="p-4 border-t flex justify-around">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Heart className="w-5 h-5 mr-1.5" /> {currentPoll.likes.toLocaleString()}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={onCardClick}>
              <MessageSquare className="w-5 h-5 mr-1.5" /> {currentPoll.commentsCount.toLocaleString()}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Gift className="w-5 h-5 mr-1.5" /> {currentPoll.tipCount ? currentPoll.tipCount.toLocaleString() : 0}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
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
