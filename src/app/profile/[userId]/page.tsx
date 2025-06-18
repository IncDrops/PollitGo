
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUsers, mockPolls } from "@/lib/mockData";
import PollCard from "@/components/polls/PollCard";
import { UserPlus, MessageSquare, Award, Star } from "lucide-react";
import type { User, Poll } from "@/types";
import Image from "next/image";

// Server Action is defined at the module's top level
async function handleVoteOnProfilePage(pollId: string, optionId: string) {
  "use server"; 
  console.log(`Vote action from profile page (server): poll ${pollId}, option ${optionId}`);
  // This is a placeholder. Real voting logic would involve database updates.
  // Revalidating paths or updating cache might be needed if data changes.
};

// Simulate fetching user and their polls
async function getUserData(userId: string): Promise<{ user: User | null; polls: Poll[] }> {
  const user = mockUsers.find(u => u.id === userId) || null;
  const polls = user ? mockPolls.filter(p => p.creator.id === userId) : [];
  return { user, polls };
}


export default async function UserProfilePage({ params }: { params: { userId: string } }) {
  const { user, polls } = await getUserData(params.userId);

  if (!user) {
    return <div className="container mx-auto px-4 py-8 text-center text-destructive">User not found.</div>;
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary to-accent">
        <Image src="https://placehold.co/1200x400.png" alt="Cover image" layout="fill" objectFit="cover" data-ai-hint="profile cover abstract" />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="container mx-auto px-4 -mt-16 md:-mt-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end bg-card p-4 md:p-6 rounded-xl shadow-lg">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-card ring-2 ring-primary">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile avatar" />
            <AvatarFallback className="text-4xl">{user.name.substring(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-foreground">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
            <p className="text-sm text-foreground mt-1 max-w-md">Loves creating insightful polls and engaging with the community. Passionate about tech and travel!</p>
            {user.pollitPointsBalance !== undefined && (
              <div className="mt-2 flex items-center justify-center md:justify-start text-yellow-500">
                <Star className="h-5 w-5 mr-1.5 fill-yellow-500" />
                <span className="font-semibold">{user.pollitPointsBalance.toLocaleString()} PollitPoints</span>
              </div>
            )}
          </div>
          <div className="md:ml-auto mt-4 md:mt-0 flex space-x-2">
            <Button variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <UserPlus className="mr-2 h-4 w-4" /> Follow
            </Button>
            <Button variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" /> Message
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
            <div className="bg-card p-4 rounded-lg shadow">
                <h3 className="text-2xl font-bold text-primary">1.2K</h3>
                <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow">
                <h3 className="text-2xl font-bold text-primary">340</h3>
                <p className="text-sm text-muted-foreground">Following</p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow">
                <h3 className="text-2xl font-bold text-primary">{polls.length}</h3>
                <p className="text-sm text-muted-foreground">Polls</p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow">
                <Award className="mx-auto h-6 w-6 text-yellow-500 mb-1"/>
                <p className="text-sm text-muted-foreground">Pollit Score: 850</p>
            </div>
        </div>

        <Tabs defaultValue="polls" className="mt-8">
          <TabsList className="grid w-full grid-cols-3 md:max-w-md mx-auto">
            <TabsTrigger value="polls">Polls</TabsTrigger>
            <TabsTrigger value="voted">Voted</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="polls" className="mt-6">
            {polls.length > 0 ? (
              <div className="space-y-0">
                {polls.map(poll => (
                  <PollCard
                    key={poll.id}
                    poll={poll}
                    // onVote={handleVoteOnProfilePage} // Temporarily removed for diagnosis
                    currentUser={user} 
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-10">This user hasn't created any polls yet.</p>
            )}
          </TabsContent>
          <TabsContent value="voted" className="mt-6">
            <p className="text-center text-muted-foreground py-10">Polls voted on by {user.name} will appear here.</p>
          </TabsContent>
          <TabsContent value="activity" className="mt-6">
             <p className="text-center text-muted-foreground py-10">Activity feed for {user.name} (likes, comments) will appear here.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
