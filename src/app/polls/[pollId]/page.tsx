
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
import { Clock, Heart, MessageSquare, Share2, Gift, Send, Image as ImageIconLucideShadcn, Video as VideoIconLucide, ThumbsUp, Film, Info, CheckCircle2, Loader2, Check, Users } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from 'react';
import OptionDetailsDialog from "@/components/polls/OptionDetailsDialog";
import { useToast } from "@/hooks/use-toast";

async function getPollDetails(pollId: string): Promise<{ poll: Poll | null; comments: CommentType[] }> {
  const poll = mockPolls.find(p => p.id === pollId) || null;
  // Ensure poll state is fresh if found, otherwise this might refer to an old mockPolls state.
  const freshPoll = poll ? {...mockPolls.find(p => p.id === pollId)} as Poll || null : null;

  const commentUser1 = mockUsers.find(u => u.id === 'user2') || mockUsers[1] || getRandomUser();
  const commentUser2 = mockUsers.find(u => u.id === 'user3') || mockUsers[2] || getRandomUser();

  const comments: CommentType[] = freshPoll ? [
    { id: 'comment1', user: commentUser1, text: "Great question! I'm leaning towards Summer.", createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    { id: 'comment2', user: commentUser2, text: "Definitely Autumn for me, the colors are amazing.", createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  ] : [];
  return { poll: freshPoll, comments };
}

const getRandomUser = (): User => mockUsers[Math.floor(Math.random() * mockUsers.length)];

const OPTION_TEXT_TRUNCATE_LENGTH = 100;
const MIN_PAYOUT_PER_VOTER = 0.10; // $0.10
const CREATOR_PLEDGE_SHARE_FOR_VOTERS = 0.50; // 50%

const PollOptionDisplay: React.FC<{
  option: PollOptionType;
  totalVotes: number;
  isVoted: boolean;
  isSelectedOption: boolean;
  deadlinePassed: boolean;
  onVote: () => Promise<void>; // Keep as async if original onVote needs it, or simplify
  pollHasTwoOptions: boolean;
  onShowDetails: () => void;
  pollPledgeAmount?: number; // Pass pledge amount to option for display or logic if needed
}> = ({ option, totalVotes, isVoted, isSelectedOption, deadlinePassed, onVote, pollHasTwoOptions, onShowDetails, pollPledgeAmount }) => {
  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
  const showResults = isVoted || deadlinePassed;
  const isTruncated = option.text.length > OPTION_TEXT_TRUNCATE_LENGTH;
  const truncatedText = isTruncated
    ? `${option.text.substring(0, OPTION_TEXT_TRUNCATE_LENGTH)}...`
    : option.text;

  const handleOptionClick = async () => {
    if (!isVoted && !deadlinePassed) {
      // The actual vote logic including pledge check is now handled by `handleVote` in the parent.
      // This onVote prop here is the one passed from the parent which already has the logic.
      await onVote(); 
    } else {
      onShowDetails();
    }
  };

  const handleDetailsIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowDetails();
  };

  // Client-side check for display purposes if voting for this option might be limited
  // This is a visual cue; actual enforcement is in the parent's handleVote.
  let isVotingVisuallyLimited = false;
  if (pollPledgeAmount && pollPledgeAmount > 0 && !deadlinePassed && !isVoted) {
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
           (isVoted || deadlinePassed || isTruncated || option.affiliateLink || isVotingVisuallyLimited) && "cursor-pointer hover:bg-accent/60",
           isVotingVisuallyLimited && "opacity-70" // Visual cue for limited voting
        )}
        onClick={handleOptionClick}
        disabled={(isVoted || deadlinePassed || isVotingVisuallyLimited) && !pollHasTwoOptions && !(isTruncated || option.affiliateLink) }
        aria-pressed={isSelectedOption}
        title={isVotingVisuallyLimited ? "Voting for this option may be limited due to pledge payout conditions." : undefined}
      >
        <div className={cn("flex w-full", pollHasTwoOptions ? "flex-col items-center" : "items-center")}>
          {option.imageUrl && <Image src={option.imageUrl} alt={option.text} width={pollHasTwoOptions ? 60 : 30} height={pollHasTwoOptions ? 60 : 30} className={cn("rounded-md object-cover shadow-sm", pollHasTwoOptions ? "mb-2" : "mr-2")} data-ai-hint="poll option" />}
          {option.videoUrl && !option.imageUrl && <VideoIconLucide className={cn("text-muted-foreground", pollHasTwoOptions ? "mb-2 h-10 w-10" : "w-5 h-5 mr-2")} />}
          <span className={cn("flex-grow", pollHasTwoOptions ? "text-sm mt-1 leading-tight" : "text-sm")}>{truncatedText}</span>

          {showResults && <span className={cn("font-semibold text-sm", pollHasTwoOptions ? "mt-2" : "ml-auto pl-1")}>{percentage.toFixed(0)}%</span>}

          {isSelectedOption && showResults && <CheckCircle2 className={cn("w-4 h-4", pollHasTwoOptions ? "mt-1 text-primary-foreground" : "ml-1 text-primary")} />}
          
          {(isTruncated || option.affiliateLink || isVotingVisuallyLimited) && (
             <div
              onClick={!isVotingVisuallyLimited ? handleDetailsIconClick : undefined} // Only allow details if not limited, or always allow? Let's always allow.
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
        <p className="text-xs text-destructive/80 mt-1 text-center">Voting for this option may be limited due to pledge payout conditions.</p>
      )}
    </div>
  );
};

export default function PollDetailsPage({ params }: { params: { pollId: string } }) {
  const [pollData, setPollData] = useState<{ poll: Poll | null; comments: CommentType[] }>({ poll: null, comments: [] });
  const [loading, setLoading] = useState(true);
  const [deadlinePassedState, setDeadlinePassedState] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();

  const [selectedOptionForModal, setSelectedOptionForModal] = useState<PollOptionType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getPollDetails(params.pollId);
      setPollData(prev => ({ ...prev, ...data, poll: data.poll ? {...data.poll} : null }));
      const user1 = mockUsers.find(u => u.id === 'user1') || mockUsers[0] || getRandomUser();
      setCurrentUser(user1);
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
    if (!poll || poll.isVoted || deadlinePassedState) return;

    const targetOption = poll.options.find(opt => opt.id === optionId);
    if (!targetOption) return;

    if (poll.pledgeAmount && poll.pledgeAmount > 0) {
      const amountToDistributeToVoters = poll.pledgeAmount * CREATOR_PLEDGE_SHARE_FOR_VOTERS;
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
    
    console.log(`Vote action for poll ${poll.id}, option ${optionId}`);
    setPollData(prevData => {
      if (!prevData.poll) return prevData; // Should not happen if poll is defined above
      const newPoll = {
        ...prevData.poll,
        isVoted: true,
        votedOptionId: optionId,
        totalVotes: prevData.poll.totalVotes + 1,
        options: prevData.poll.options.map(opt =>
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        ),
      };
      return { ...prevData, poll: newPoll };
    });
  };

  const handleCommentSubmit = async (formData: FormData) => {
    const commentText = formData.get('comment') as string;
    if (commentText && commentText.trim() !== "" && poll && currentUser) {
      console.log(`New comment for poll ${poll.id}: ${commentText}`);
      const newComment: CommentType = {
        id: `comment${Date.now()}`,
        user: currentUser,
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

  const handleShare = async () => {
    if (!poll || typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/polls/${poll.id}`;
    const shareData = {
      title: 'Check out this poll on PollitAGo!',
      text: `"${poll.question}" - Vote now!`,
      url: shareUrl,
    };

    let sharedNatively = false;
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('Poll shared successfully via native share.');
        sharedNatively = true;
      } catch (error: any) {
        // Don't log permission denied or cancellation as errors to the user.
        if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
            console.error('Error sharing poll via native share:', error);
        }
        // If it failed for any reason (including user cancel), try to copy.
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

  const handleShowOptionDetails = (option: PollOptionType) => {
    setSelectedOptionForModal(option);
    setIsModalOpen(true);
  };

  const handlePledgeOutcome = (outcome: 'accepted' | 'tipped_crowd') => {
    if (poll) {
        setPollData(prev => prev.poll ? ({...prev, poll: {...prev.poll, pledgeOutcome: outcome }}) : prev);
        console.log(`Pledge outcome for poll ${poll.id}: ${outcome} (simulated)`);
        toast({ title: `Pledge Outcome: ${outcome.replace('_', ' ')}`, description: "Action simulated on client."});
    }
  };


  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mx-auto" /> Loading poll details...</div>;
  }

  if (!poll) {
    return <div className="container mx-auto px-4 py-8 text-center text-destructive">Poll not found.</div>;
  }

  const pollHasTwoOptions = poll.options.length === 2;
  const isCreator = currentUser?.id === poll.creator.id;
  const showPledgeOutcomeButtons = isCreator && deadlinePassedState && poll.pledgeAmount && poll.pledgeAmount > 0 && (poll.pledgeOutcome === 'pending' || poll.pledgeOutcome === undefined);

  return (
    <>
      <div className="container mx-auto px-2 sm:px-4 py-8 max-w-2xl">
        <Card className="shadow-xl rounded-lg">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-3">
              <NextLink href={`/profile/${poll.creator.id}`}>
                <Avatar className="h-12 w-12 border cursor-pointer">
                  <AvatarImage src={poll.creator.avatarUrl} alt={poll.creator.name} data-ai-hint="profile avatar"/>
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
            <CardTitle className="text-xl sm:text-2xl font-headline text-foreground">{poll.question}</CardTitle>

            {poll.imageUrls && poll.imageUrls.length > 0 && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Images ({poll.imageUrls.length}):</p>
                <div className={cn("grid gap-2", poll.imageUrls.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
                  {poll.imageUrls.map((url, index) => (
                    <div key={index} className="w-full aspect-video relative rounded-lg overflow-hidden shadow-md bg-muted/30">
                      <Image src={url} alt={`${poll.question} - image ${index + 1}`} layout="fill" objectFit="cover" data-ai-hint="poll image" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {poll.videoUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Video:</p>
                <div className="w-full aspect-video relative bg-black flex items-center justify-center rounded-lg overflow-hidden shadow-md">
                  <Film className="w-16 h-16 text-white/70" />
                  <p className="absolute bottom-2 right-2 text-xs text-white/80 bg-black/50 px-1 py-0.5 rounded">Video (up to 60s)</p>
                </div>
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
                />
              ))}
            </div>
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
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Gift className="w-5 h-5 mr-1.5" /> {poll.tipCount ? poll.tipCount.toLocaleString() : 0} Tip Creator
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={handleShare}>
                <Share2 className="w-5 h-5 mr-1.5" /> Share
              </Button>
            </div>

            <Separator className="my-4"/>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Comments ({comments.length})</h3>
              <form action={handleCommentSubmit} id="comment-form" className="flex items-start space-x-2 mb-6">
                {currentUser && (
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint="profile avatar" />
                    <AvatarFallback>{currentUser.name.substring(0,1)}</AvatarFallback>
                  </Avatar>
                )}
                <Textarea name="comment" placeholder="Add a comment..." className="flex-grow min-h-[40px] max-h-[120px]" rows={1}/>
                <Button type="submit" size="icon" variant="default" className="h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Send className="h-5 w-5" />
                </Button>
              </form>

              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <NextLink href={`/profile/${comment.user.id}`}>
                      <Avatar className="h-10 w-10 border cursor-pointer">
                        <AvatarImage src={comment.user.avatarUrl} alt={comment.user.name} data-ai-hint="profile avatar" />
                        <AvatarFallback>{comment.user.name.substring(0, 1)}</AvatarFallback>
                      </Avatar>
                    </NextLink>
                    <div className="flex-grow bg-accent/20 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <NextLink href={`/profile/${comment.user.id}`}>
                          <p className="text-sm font-semibold text-foreground hover:underline cursor-pointer">{comment.user.name}</p>
                        </NextLink>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNowStrict(parseISO(comment.createdAt), { addSuffix: true })}</p>
                      </div>
                      <p className="text-sm text-foreground mt-1 whitespace-pre-wrap break-words">{comment.text}</p>
                      <Button variant="ghost" size="sm" className="mt-1 p-0 h-auto text-xs text-muted-foreground hover:text-primary">
                        <ThumbsUp className="w-3 h-3 mr-1"/> Like
                      </Button>
                    </div>
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
