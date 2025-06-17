'use client';

import type { Poll, PollOption as PollOptionType, User } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, MessageSquare, Heart, Share2, DollarSign, Image as ImageIcon, Video as VideoIcon, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => void;
}

const PollOption: React.FC<{ option: PollOptionType; totalVotes: number; onVote: () => void; isVoted: boolean; isSelectedOption: boolean; deadlinePassed: boolean }> = ({ option, totalVotes, onVote, isVoted, isSelectedOption, deadlinePassed }) => {
  const percentage = totalVotes > 0 && (isVoted || deadlinePassed) ? (option.votes / totalVotes) * 100 : 0;

  return (
    <div className="mb-2 relative">
      <Button
        variant={isSelectedOption ? "default" : "outline"}
        className="w-full justify-start h-auto p-3 text-left relative overflow-hidden disabled:opacity-100 disabled:cursor-default"
        onClick={onVote}
        disabled={isVoted || deadlinePassed}
        aria-pressed={isSelectedOption}
      >
        {(isVoted || deadlinePassed) && (
          <div
            className="absolute top-0 left-0 h-full bg-primary/30 dark:bg-primary/40"
            style={{ width: `${percentage}%` }}
          />
        )}
        <div className="relative z-10 flex items-center w-full">
          {option.imageUrl && (
            <Image 
              src={option.imageUrl} 
              alt={option.text} 
              width={40} 
              height={40} 
              className="rounded mr-2 object-cover"
              data-ai-hint="poll option" 
            />
          )}
          {option.videoUrl && !option.imageUrl && <VideoIcon className="w-5 h-5 mr-2 text-muted-foreground" />}
          <span className="flex-grow">{option.text}</span>
          {(isVoted || deadlinePassed) && <span className="text-xs ml-2 font-semibold">{percentage.toFixed(0)}%</span>}
          {isSelectedOption && <CheckCircle2 className="w-5 h-5 ml-2 text-primary-foreground" />}
        </div>
      </Button>
    </div>
  );
};

export default function PollCard({ poll, onVote: handleVote }: PollCardProps) {
  const router = useRouter();
  const [deadlinePassed, setDeadlinePassed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const checkDeadline = () => {
      const deadlineDate = parseISO(poll.deadline);
      if (new Date() > deadlineDate) {
        setDeadlinePassed(true);
        setTimeRemaining("Ended");
      } else {
        setDeadlinePassed(false);
        setTimeRemaining(formatDistanceToNowStrict(deadlineDate, { addSuffix: true }));
      }
    };

    checkDeadline();
    const interval = setInterval(checkDeadline, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [poll.deadline]);

  const onCardClick = () => {
    router.push(`/polls/${poll.id}`);
  };

  const onCreatorClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    router.push(`/profile/${poll.creator.id}`);
  };
  
  const onLongPress = (e: React.TouchEvent | React.MouseEvent) => {
     // Basic long press detection (could be improved with timers)
    if ('touches' in e && e.touches.length > 0 || 'buttons' in e && e.buttons === 1) {
      // Holding for a bit, then release can trigger this. True long press is more complex.
      // For now, this allows testing the navigation.
      e.stopPropagation();
      router.push(`/profile/${poll.creator.id}`);
    }
  };

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
            <p className="text-xs text-muted-foreground">@{poll.creator.username} &middot; {formatDistanceToNowStrict(parseISO(poll.createdAt), { addSuffix: true })}</p>
          </div>
        </div>
        <CardTitle className="text-lg font-headline mt-3 text-foreground">{poll.question}</CardTitle>
      </CardHeader>

      {poll.imageUrl && (
        <div className="w-full h-64 relative cursor-pointer" onClick={onCardClick}>
          <Image src={poll.imageUrl} alt={poll.question} layout="fill" objectFit="cover" data-ai-hint="poll image" />
        </div>
      )}
      {poll.videoUrl && !poll.imageUrl && (
         <div className="w-full h-64 relative bg-black flex items-center justify-center cursor-pointer" onClick={onCardClick}>
          <VideoIcon className="w-16 h-16 text-white/70" />
          <p className="absolute bottom-2 right-2 text-xs text-white/80 bg-black/50 px-1 py-0.5 rounded">Video</p>
        </div>
      )}

      <CardContent className="p-4">
        <div>
          {poll.options.map((option) => (
            <PollOption
              key={option.id}
              option={option}
              totalVotes={poll.totalVotes}
              onVote={() => handleVote(poll.id, option.id)}
              isVoted={!!poll.isVoted}
              isSelectedOption={poll.votedOptionId === option.id}
              deadlinePassed={deadlinePassed}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center text-xs text-muted-foreground">
          <Clock className="w-4 h-4 mr-1.5" />
          <span>{deadlinePassed ? `Ended ${timeRemaining}` : `Ends ${timeRemaining}`} &middot; {poll.totalVotes} votes</span>
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
          <DollarSign className="w-5 h-5 mr-1.5" /> Tip
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <Share2 className="w-5 h-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
