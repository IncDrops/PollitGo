
'use client';

import type { Poll, PollOption as PollOptionType } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MessageSquare, Heart, Share2, Gift, CheckCircle2, Film, Video as VideoIcon } from 'lucide-react';
import { parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => void;
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
}> = ({ option, totalVotes, onVote, isVoted, isSelectedOption, deadlinePassed, pollHasTwoOptions }) => {
  const percentage = totalVotes > 0 && (isVoted || deadlinePassed) ? (option.votes / totalVotes) * 100 : 0;
  const truncatedText = option.text.length > OPTION_TEXT_TRUNCATE_LENGTH 
    ? `${option.text.substring(0, OPTION_TEXT_TRUNCATE_LENGTH)}...` 
    : option.text;

  return (
    <div className={cn("relative", pollHasTwoOptions ? "flex-1" : "mb-2 w-full")}>
      <Button
        variant={isSelectedOption ? "default" : "outline"}
        className={cn(
          "w-full justify-start h-auto p-3 text-left relative overflow-hidden disabled:opacity-100 disabled:cursor-default",
          pollHasTwoOptions && "aspect-square flex flex-col items-center justify-center text-center" // Square for 2 options
        )}
        onClick={onVote}
        disabled={isVoted || deadlinePassed}
        aria-pressed={isSelectedOption}
      >
        {(isVoted || deadlinePassed) && !pollHasTwoOptions && ( // Progress bar only for non-2-option layout
          <div
            className="absolute top-0 left-0 h-full bg-primary/30 dark:bg-primary/40"
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
              className={cn("rounded object-cover", pollHasTwoOptions ? "mb-2" : "mr-2")}
              data-ai-hint="poll option" 
            />
          )}
          {option.videoUrl && !option.imageUrl && <VideoIcon className={cn("w-5 h-5 text-muted-foreground", pollHasTwoOptions ? "mb-2 h-8 w-8" : "mr-2")} />}
          <span className={cn("flex-grow", pollHasTwoOptions ? "text-sm" : "")}>{truncatedText}</span>
          {(isVoted || deadlinePassed) && (
             <span className={cn("text-xs font-semibold", pollHasTwoOptions ? "mt-1" : "ml-2")}>{percentage.toFixed(0)}%</span>
          )}
          {isSelectedOption && <CheckCircle2 className={cn("w-5 h-5", pollHasTwoOptions ? "mt-1 text-primary-foreground" : "ml-2 text-primary-foreground")} />}
        </div>
      </Button>
    </div>
  );
};

export default function PollCard({ poll, onVote: handleVote }: PollCardProps) {
  const router = useRouter();
  const [deadlinePassed, setDeadlinePassed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [createdAtFormatted, setCreatedAtFormatted] = useState<string | null>(null);

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
    if (hours > 0 || days > 0) parts.push(`${hours}h`); // show hours if days are shown or if hours > 0
    if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`); // show minutes if above are shown
    parts.push(`${seconds}s`);
    
    return parts.join(':');
  }, []);

  useEffect(() => {
    const deadlineDate = parseISO(poll.deadline);
    
    const updateTimer = () => {
      setTimeRemaining(formatTimeDifference(deadlineDate));
    };

    updateTimer(); // Initial call
    const intervalId = setInterval(updateTimer, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, [poll.deadline, formatTimeDifference]);

  useEffect(() => {
    try {
        const createdDate = parseISO(poll.createdAt);
        // Basic format, can be expanded if needed
        setCreatedAtFormatted(new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(createdDate));
    } catch (error) {
        console.error("Error formatting poll.createdAt:", error);
        setCreatedAtFormatted("Date unavailable");
    }
  }, [poll.createdAt]);


  const onCardClick = () => {
    router.push(`/polls/${poll.id}`);
  };

  const onCreatorClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    router.push(`/profile/${poll.creator.id}`);
  };
  
  const onLongPress = (e: React.TouchEvent | React.MouseEvent) => {
    if ('touches' in e && e.touches.length > 0 || 'buttons' in e && e.buttons === 1) {
      e.stopPropagation();
      router.push(`/profile/${poll.creator.id}`);
    }
  };

  const hasTwoOptions = poll.options.length === 2;

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl overflow-hidden mb-4 bg-card">
      <CardHeader className="p-4 cursor-pointer" onClick={onCardClick} onContextMenu={(e) => { e.preventDefault(); onLongPress(e);}}>
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

      {poll.imageUrls && poll.imageUrls.length > 0 && (
        <div className="w-full h-64 relative cursor-pointer" onClick={onCardClick}>
          <Image src={poll.imageUrls[0]} alt={poll.question} layout="fill" objectFit="cover" data-ai-hint="poll image content" />
          {poll.videoUrl && (
            <div className="absolute bottom-2 right-2 bg-black/60 p-1.5 rounded-md backdrop-blur-sm" title="Video available">
              <Film className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      )}
      {(!poll.imageUrls || poll.imageUrls.length === 0) && poll.videoUrl && (
         <div className="w-full h-64 relative bg-black flex items-center justify-center cursor-pointer" onClick={onCardClick}>
          <VideoIcon className="w-16 h-16 text-white/70" />
          <p className="absolute bottom-2 right-2 text-xs text-white/80 bg-black/50 px-1 py-0.5 rounded">Video</p>
        </div>
      )}

      <CardContent className="p-4">
        <div className={cn(hasTwoOptions ? "flex gap-2" : "")}>
          {poll.options.map((option) => (
            <PollOption
              key={option.id}
              option={option}
              totalVotes={poll.totalVotes}
              onVote={() => handleVote(poll.id, option.id)}
              isVoted={!!poll.isVoted}
              isSelectedOption={poll.votedOptionId === option.id}
              deadlinePassed={deadlinePassed}
              pollHasTwoOptions={hasTwoOptions}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center text-xs text-muted-foreground">
          <Clock className="w-4 h-4 mr-1.5" />
          <span>{deadlinePassed ? `Ended` : timeRemaining || 'Calculating...'} &middot; {poll.totalVotes} votes</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 border-t flex justify-around">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <Heart className="w-5 h-5 mr-1.5" /> {poll.likes}
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={onCardClick}>
          <MessageSquare className="w-5 h-5 mr-1.5" /> {poll.commentsCount}
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <Gift className="w-5 h-5 mr-1.5" /> {poll.tipCount || 0}
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <Share2 className="w-5 h-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
