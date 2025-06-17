
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { mockPolls, mockUsers } from "@/lib/mockData";
import type { Poll, PollOption as PollOptionType, Comment as CommentType } from "@/types";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { Clock, Heart, MessageSquare, Share2, DollarSign, Send, Image as ImageIcon, Video as VideoIcon, ThumbsUp, Film } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Simulate fetching poll data and comments
async function getPollDetails(pollId: string): Promise<{ poll: Poll | null; comments: CommentType[] }> {
  const poll = mockPolls.find(p => p.id === pollId) || null;
  // Ensure consistent mock users for comments
  const commentUser1 = mockUsers.find(u => u.id === 'user2') || mockUsers[1] || getRandomUser();
  const commentUser2 = mockUsers.find(u => u.id === 'user3') || mockUsers[2] || getRandomUser();
  
  const comments: CommentType[] = poll ? [
    { id: 'comment1', user: commentUser1, text: "Great question! I'm leaning towards Summer.", createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    { id: 'comment2', user: commentUser2, text: "Definitely Autumn for me, the colors are amazing.", createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  ] : [];
  return { poll, comments };
}

// Helper to get a random user if specific one not found
const getRandomUser = (): User => mockUsers[Math.floor(Math.random() * mockUsers.length)];


const PollOptionDisplay: React.FC<{ option: PollOptionType; totalVotes: number; isVoted: boolean; isSelectedOption: boolean; deadlinePassed: boolean; onVote: () => void }> = ({ option, totalVotes, isVoted, isSelectedOption, deadlinePassed, onVote }) => {
  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
  const showResults = isVoted || deadlinePassed;

  return (
    <div className="mb-3">
      <Button 
        variant={isSelectedOption && showResults ? "default" : "outline"}
        className="w-full justify-between h-auto p-3 text-left relative disabled:opacity-100 disabled:cursor-default group"
        onClick={onVote}
        disabled={isVoted || deadlinePassed}
      >
        <div className="flex items-center">
          {option.imageUrl && <Image src={option.imageUrl} alt={option.text} width={30} height={30} className="rounded mr-2 object-cover" data-ai-hint="poll option" />}
          {option.videoUrl && !option.imageUrl && <VideoIcon className="w-5 h-5 mr-2 text-muted-foreground" />}
          <span>{option.text}</span>
        </div>
        {showResults && <span className="font-semibold text-sm">{percentage.toFixed(0)}%</span>}
      </Button>
      {showResults && <Progress value={percentage} className="h-1.5 mt-1 bg-accent/30 [&>div]:bg-primary" />}
    </div>
  );
};

export default async function PollDetailsPage({ params }: { params: { pollId: string } }) {
  const { poll, comments } = await getPollDetails(params.pollId);

  if (!poll) {
    return <div className="container mx-auto px-4 py-8 text-center text-destructive">Poll not found.</div>;
  }
  
  const deadlineDate = parseISO(poll.deadline);
  const deadlinePassed = new Date() > deadlineDate;
  const timeRemaining = deadlinePassed ? "Ended" : formatDistanceToNowStrict(deadlineDate, { addSuffix: true });

  const handleVote = async (optionId: string) => {
    "use server";
    console.log(`Vote action for poll ${poll.id}, option ${optionId}`);
    // This would be a server action to record the vote
    // Revalidate path or update data as needed
  };

  const handleCommentSubmit = async (formData: FormData) => {
    "use server";
    const commentText = formData.get('comment') as string;
    if (commentText && commentText.trim() !== "") {
      console.log(`New comment for poll ${poll.id}: ${commentText}`);
      // This would be a server action to post the comment
      // Revalidate path or update data as needed
    }
  };
  
  const currentUser = mockUsers.find(u => u.id === 'user1') || mockUsers[0] || getRandomUser();


  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 max-w-2xl">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-3">
            <Link href={`/profile/${poll.creator.id}`}>
              <Avatar className="h-12 w-12 border cursor-pointer">
                <AvatarImage src={poll.creator.avatarUrl} alt={poll.creator.name} data-ai-hint="profile avatar"/>
                <AvatarFallback>{poll.creator.name.substring(0, 1)}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link href={`/profile/${poll.creator.id}`}>
                <p className="text-md font-semibold text-foreground hover:underline cursor-pointer">{poll.creator.name}</p>
              </Link>
              <p className="text-xs text-muted-foreground">@{poll.creator.username} &middot; {formatDistanceToNowStrict(parseISO(poll.createdAt), { addSuffix: true })}</p>
            </div>
          </div>
          <CardTitle className="text-2xl font-headline text-foreground">{poll.question}</CardTitle>
          
          {poll.imageUrls && poll.imageUrls.length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Images ({poll.imageUrls.length}):</p>
              {poll.imageUrls.map((url, index) => (
                <div key={index} className="w-full aspect-video relative rounded-lg overflow-hidden shadow-md">
                  <Image src={url} alt={`${poll.question} - image ${index + 1}`} layout="fill" objectFit="cover" data-ai-hint="poll image content" />
                </div>
              ))}
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

        <CardContent className="pt-4"> {/* Added pt-4 as media is in header now */}
          <div className="space-y-3">
            {poll.options.map((option) => (
              <PollOptionDisplay
                key={option.id}
                option={option}
                totalVotes={poll.totalVotes}
                isVoted={!!poll.isVoted}
                isSelectedOption={poll.votedOptionId === option.id}
                deadlinePassed={deadlinePassed}
                onVote={handleVote.bind(null, option.id)}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1.5" />
            <span>{deadlinePassed ? `Ended ${formatDistanceToNowStrict(deadlineDate, { addSuffix: true })}` : `Ends ${timeRemaining}`} &middot; {poll.totalVotes} votes</span>
          </div>
        </CardContent>

        <CardFooter className="border-t pt-4 flex flex-col items-stretch">
          <div className="flex justify-around mb-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Heart className="w-5 h-5 mr-1.5" /> {poll.likes} Likes
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <DollarSign className="w-5 h-5 mr-1.5" /> Tip Creator
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Share2 className="w-5 h-5 mr-1.5" /> Share
            </Button>
          </div>
        
          <Separator className="my-4"/>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Comments ({comments.length})</h3>
            <form action={handleCommentSubmit} className="flex items-start space-x-2 mb-6">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint="profile avatar" /> 
                <AvatarFallback>{currentUser.name.substring(0,1)}</AvatarFallback>
              </Avatar>
              <Textarea name="comment" placeholder="Add a comment..." className="flex-grow min-h-[40px] max-h-[120px]" rows={1}/>
              <Button type="submit" size="icon" variant="default" className="h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Send className="h-5 w-5" />
              </Button>
            </form>

            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <Link href={`/profile/${comment.user.id}`}>
                    <Avatar className="h-10 w-10 border cursor-pointer">
                      <AvatarImage src={comment.user.avatarUrl} alt={comment.user.name} data-ai-hint="profile avatar" />
                      <AvatarFallback>{comment.user.name.substring(0, 1)}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-grow bg-accent/20 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <Link href={`/profile/${comment.user.id}`}>
                        <p className="text-sm font-semibold text-foreground hover:underline cursor-pointer">{comment.user.name}</p>
                      </Link>
                      <p className="text-xs text-muted-foreground">{formatDistanceToNowStrict(parseISO(comment.createdAt), { addSuffix: true })}</p>
                    </div>
                    <p className="text-sm text-foreground mt-1">{comment.text}</p>
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
  );
}
