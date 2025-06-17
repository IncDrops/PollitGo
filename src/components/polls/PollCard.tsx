
'use client';

import type { Poll, PollOption as PollOptionType } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MessageSquare, Heart, Share2, Gift, CheckCircle2, Film, Video as VideoIconLucide, Info, Zap } from 'lucide-react';
import { parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useSwipeable } from 'react-swipeable';
import OptionDetailsDialog from './OptionDetailsDialog'; // Import the new dialog

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => void;
  onPollActionComplete?: (pollId: string) => void; // Callback to remove poll from feed
}

const OPTION_TEXT_TRUNCATE_LENGTH = 100;

const PollOption: React.FC<{ 
  option: PollOptionType; 
  totalVotes: number; 
  onVote: () => void; 
  isVoted: boolean; 
  isSelectedOption: boolean; 
  deadlinePassed: boolean;
  pollHasTwoOptions: boolean;
  canVote: boolean;
  onShowDetails: () => void;
}> = ({ option, totalVotes, onVote, isVoted, isSelectedOption, deadlinePassed, pollHasTwoOptions, canVote, onShowDetails }) => {
  const percentage = totalVotes > 0 && (isVoted || deadlinePassed) ? (option.votes / totalVotes) * 100 : 0;
  const showResults = isVoted || deadlinePassed;
  const isTruncated = option.text.length > OPTION_TEXT_TRUNCATE_LENGTH;
  const truncatedText = isTruncated
    ? `${option.text.substring(0, OPTION_TEXT_TRUNCATE_LENGTH)}...` 
    : option.text;

  const handleOptionClick = () => {
    if (canVote && !isVoted && !deadlinePassed) {
      onVote();
    } else {
      onShowDetails(); // Show details if already voted, deadline passed, or if it's a swipeable poll (vote handled by swipe)
    }
  };
  
  // For non-swipeable polls, details icon is separate
  const handleDetailsIconClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent voting if the button is also a vote trigger
    onShowDetails();
  };

  return (
    <div className={cn("relative group", pollHasTwoOptions ? "flex-1" : "mb-2 w-full")}>
      <Button
        variant={isSelectedOption && showResults ? "default" : "outline"}
        className={cn(
          "w-full justify-start h-auto p-3 text-left relative overflow-hidden disabled:opacity-100 disabled:cursor-default",
          pollHasTwoOptions && "aspect-square flex flex-col items-center justify-center text-center",
          (!canVote || isVoted || deadlinePassed) && "cursor-pointer hover:bg-accent/60" // Make it clear it's clickable for details
        )}
        onClick={handleOptionClick}
        disabled={canVote && (isVoted || deadlinePassed) && !pollHasTwoOptions} // Disable voting part if already voted/ended on non-2-option
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

           {/* Details Icon for non-swipeable options or to always show details */}
           {!pollHasTwoOptions && (isTruncated || option.affiliateLink) && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleDetailsIconClick} 
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
              aria-label="View option details"
            >
              <Info className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>
      </Button>
    </div>
  );
};

export default function PollCard({ poll, onVote, onPollActionComplete }: PollCardProps) {
  const router = useRouter();
  const [deadlinePassed, setDeadlinePassed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [createdAtFormatted, setCreatedAtFormatted] = useState<string | null>(null);

  const [selectedOptionForModal, setSelectedOptionForModal] = useState<PollOptionType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeOutDirection, setSwipeOutDirection] = useState<'left' | 'right' | null>(null);

  const canSwipe = poll.options.length === 2 && !poll.isVoted && !deadlinePassed && onPollActionComplete;

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      if (!canSwipe) return;
      setIsSwiping(true);
      setSwipeOffset(eventData.deltaX);
    },
    onSwiped: (eventData) => {
      setIsSwiping(false);
      if (!canSwipe) {
        setSwipeOffset(0);
        return;
      }

      const threshold = 80; // Swipe distance threshold
      if (Math.abs(eventData.deltaX) > threshold) {
        if (eventData.dir === 'Right') {
          setSwipeOutDirection('right');
          onVote(poll.id, poll.options[0].id);
        } else if (eventData.dir === 'Left') {
          setSwipeOutDirection('left');
          onVote(poll.id, poll.options[1].id);
        }
        setTimeout(() => {
          onPollActionComplete?.(poll.id);
        }, 300); // Match transition duration
      } else {
        setSwipeOffset(0); // Reset if not swiped far enough
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const formatTimeDifference = useCallback((targetDate: Date): string => {
    const now = new Date();
    let diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      setDeadlinePassed(true);
      return "Ended";
    }
    setDeadlinePassed(false);

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
    if (days === 0 && hours === 0 && minutes < 5) { // Show seconds only if less than 5 mins remaining
       parts.push(`${seconds}s`);
    } else if (parts.length === 0) { // If ended up with nothing (e.g. 0d 0h 0m 0s for exactly ended)
       return "Ending soon";
    }
    
    return parts.join(' ') || "0s";
  }, []);

  useEffect(() => {
    const deadlineDate = parseISO(poll.deadline);
    const updateTimer = () => setTimeRemaining(formatTimeDifference(deadlineDate));
    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, [poll.deadline, formatTimeDifference]);

  useEffect(() => {
    try {
      const createdDate = parseISO(poll.createdAt);
      setCreatedAtFormatted(new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(createdDate));
    } catch (error) {
      setCreatedAtFormatted("Date unavailable");
    }
  }, [poll.createdAt]);

  const handleShowOptionDetails = (option: PollOptionType) => {
    setSelectedOptionForModal(option);
    setIsModalOpen(true);
  };

  const onCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if swipe is in progress or if target is interactive
    if (isSwiping || (e.target as HTMLElement).closest('button, a')) {
      return;
    }
    if (swipeOutDirection) return; // Don't navigate if card is swiping out
    router.push(`/polls/${poll.id}`);
  };

  const onCreatorClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    router.push(`/profile/${poll.creator.id}`);
  };
  
  const pollHasTwoOptions = poll.options.length === 2;
  const canVoteOnPoll = !poll.isVoted && !deadlinePassed;

  const cardStyle: React.CSSProperties = swipeOutDirection ? {
      transform: `translateX(${swipeOutDirection === 'right' ? '100%' : '-100%'}) rotate(${swipeOutDirection === 'right' ? '15deg' : '-15deg'})`,
      opacity: 0,
      transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
    } : (isSwiping ? {
      transform: `translateX(${swipeOffset}px) rotate(${swipeOffset / 20}deg)`,
      transition: 'none',
    } : {
      transition: 'transform 0.3s ease-out',
    }
  );

  return (
    <>
      <div {...(canSwipe ? handlers : {})} style={cardStyle} className="w-full touch-pan-y">
        <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl overflow-hidden mb-4 bg-card active:shadow-2xl active:scale-[1.01] transition-transform duration-100 ease-out">
          <CardHeader className="p-4 cursor-pointer" onClick={onCardClick}>
            <div className="flex items-center space-x-3" onClick={onCreatorClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onCreatorClick(e)}>
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={poll.creator.avatarUrl} alt={poll.creator.name} data-ai-hint="profile avatar" />
                <AvatarFallback>{poll.creator.name.substring(0, 1)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">{poll.creator.name}</p>
                <p className="text-xs text-muted-foreground">
                  @{poll.creator.username} &middot; {createdAtFormatted || 'Loading...'}
                </p>
              </div>
            </div>
            <CardTitle className="text-lg font-headline mt-3 text-foreground">{poll.question}</CardTitle>
          </CardHeader>

          {(poll.imageUrls && poll.imageUrls.length > 0) && (
            <div className="w-full h-64 relative cursor-pointer bg-muted/30" onClick={onCardClick}>
              <Image src={poll.imageUrls[0]} alt={poll.question} layout="fill" objectFit="cover" data-ai-hint="poll image content" />
              {poll.videoUrl && (
                <div className="absolute bottom-2 right-2 bg-black/70 p-1.5 rounded-md backdrop-blur-sm shadow-md" title="Video available">
                  <Film className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          )}
          {(!poll.imageUrls || poll.imageUrls.length === 0) && poll.videoUrl && (
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
              {poll.options.map((option) => (
                <PollOption
                  key={option.id}
                  option={option}
                  totalVotes={poll.totalVotes}
                  onVote={() => {
                     if (canVoteOnPoll) onVote(poll.id, option.id);
                     // If swipeable, vote is handled by swipe, click shows details
                     if (canSwipe) handleShowOptionDetails(option);
                  }}
                  isVoted={!!poll.isVoted}
                  isSelectedOption={poll.votedOptionId === option.id}
                  deadlinePassed={deadlinePassed}
                  pollHasTwoOptions={pollHasTwoOptions}
                  canVote={canVoteOnPoll}
                  onShowDetails={() => handleShowOptionDetails(option)}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center text-xs text-muted-foreground">
              <Clock className="w-4 h-4 mr-1.5" />
              <span>{deadlinePassed ? `Ended` : timeRemaining || 'Calculating...'} &middot; {poll.totalVotes.toLocaleString()} votes</span>
            </div>
          </CardContent>

          <CardFooter className="p-4 border-t flex justify-around">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Heart className="w-5 h-5 mr-1.5" /> {poll.likes.toLocaleString()}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={onCardClick}>
              <MessageSquare className="w-5 h-5 mr-1.5" /> {poll.commentsCount.toLocaleString()}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Gift className="w-5 h-5 mr-1.5" /> {poll.tipCount ? poll.tipCount.toLocaleString() : 0}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Share2 className="w-5 h-5" />
            </Button>
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
