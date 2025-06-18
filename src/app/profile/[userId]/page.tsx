
'use client'; // Keep this if client-side hooks or event handlers are used in restored parts

import type { User, Poll } from "@/types";
import { mockUsers, mockPolls } from "@/lib/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Settings, MessageSquare, Edit3, ChevronLeft, Share2, Search, CalendarDays, MapPin, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
// import PollCardFeed from "@/components/polls/PollCardFeed"; // Keep commented
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";


// Simulate fetching user and their polls.
// In a real app, this would involve API calls or direct database queries.
async function getUserData(userId: string): Promise<{ user: User | null; polls: Poll[] }> {
  console.log(`[UserProfilePage] getUserData called for userId: ${userId}`);
  const user = mockUsers.find(u => u.id === userId) || null;
  
  // For now, return an empty polls array to isolate the issue.
  // We'll reintroduce poll fetching/filtering later.
  const polls: Poll[] = []; 
  // const rawPolls = user ? mockPolls.filter(p => p.creator.id === userId) : [];
  // let polls: Poll[] = [];
  // if (rawPolls.length > 0) {
  //   try {
  //     // Attempt to "sanitize" the polls data.
  //     // If this stringify fails, it will be caught and logged on the server.
  //     polls = JSON.parse(JSON.stringify(rawPolls));
  //     console.log(`[UserProfilePage] Successfully sanitized ${polls.length} polls for user ${userId}`);
  //   } catch (e: any) {
  //     console.error(`[UserProfilePage] !!! Error stringifying/parsing polls for user ${userId}:`, e.message, e.stack);
  //     // Return empty or handle as an error state, but don't let it break the page.
  //     polls = []; // or throw an error if that's preferred for critical failures
  //   }
  // } else {
  //   console.log(`[UserProfilePage] No raw polls found for user ${userId}`);
  // }

  return { user, polls };
}


export default function UserProfilePage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [userData, setUserData] = useState<{ user: User | null; polls: Poll[] }>({ user: null, polls: [] });
  const [isLoading, setIsLoading] = useState(true);
  
  // This assumes you might have a concept of a "current logged-in user"
  // For now, let's mock it or assume it's not directly needed for viewing a profile
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers.find(u => u.id === 'user1') || null); 


  useEffect(() => {
    if (params.userId) {
      setIsLoading(true);
      getUserData(params.userId)
        .then(data => {
          setUserData(data);
          if (!data.user) {
            console.warn(`[UserProfilePage] User not found for ID ${params.userId} after fetch.`);
            // Optionally redirect or show a more prominent "not found" message
            // router.push('/404'); // Example redirect
          }
        })
        .catch(error => {
          console.error("[UserProfilePage] Error fetching user data:", error);
          toast({ title: "Error", description: "Could not load user profile.", variant: "destructive" });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [params.userId, router, toast]);

  const user = userData.user;
  const userPolls = userData.polls;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    console.log(`[UserProfilePage] Rendering 'User not found' for ID ${params.userId}.`);
    return (
      <div className="container mx-auto px-4 py-8 text-center text-destructive">
        User not found.
      </div>
    );
  }
  
  const isOwnProfile = currentUser?.id === user.id;

  const handleShareProfile = async () => {
    const profileUrl = window.location.href;
    try {
      await navigator.share({
        title: `${user.name}'s Profile on PollitAGo`,
        text: `Check out ${user.name}'s profile and polls!`,
        url: profileUrl,
      });
      toast({ title: "Profile Shared", description: "Link to profile shared successfully."});
    } catch (error) {
      // Fallback to copying to clipboard if native share fails or is cancelled
      try {
        await navigator.clipboard.writeText(profileUrl);
        toast({ title: "Link Copied", description: "Profile link copied to clipboard."});
      } catch (copyError) {
        toast({ title: "Error", description: "Could not share or copy profile link.", variant: "destructive"});
        console.error("Error sharing/copying profile link:", error, copyError);
      }
    }
  };


  console.log(`[UserProfilePage] Rendering profile for user: ${user.name} (ID: ${user.id})`);
  console.log(`[UserProfilePage] Polls count for ${user.name}: ${userPolls.length}`);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto h-14 flex items-center justify-between px-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold truncate">{user.name}</h1>
          <Button variant="ghost" size="icon" onClick={handleShareProfile}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <div className="relative h-48 w-full bg-muted">
          <Image
            src={`https://placehold.co/1200x400.png?text=${user.name}+Cover`}
            alt={`${user.name}'s cover photo`}
            layout="fill"
            objectFit="cover"
            priority // Prioritize loading cover photo
            data-ai-hint="profile cover"
          />
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 transform">
            <Avatar className="h-32 w-32 border-4 border-background ring-2 ring-primary shadow-lg">
              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile avatar" />
              <AvatarFallback className="text-4xl">{user.name.substring(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="pt-20 pb-8 text-center border-b">
          <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
          
          {/* Mocked bio and stats - replace with actual data later */}
          <p className="mt-2 text-sm text-foreground max-w-md mx-auto px-4">
            Lover of polls, opinions, and good conversations. Helping the world make up its mind, one poll at a time! 🚀 #PollMaster
          </p>
          <div className="mt-3 flex justify-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" />Planet Earth</span>
            <span className="flex items-center"><CalendarDays className="h-4 w-4 mr-1" />Joined {new Date(2023, Math.floor(Math.random()*12), Math.floor(Math.random()*28)+1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
          <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center text-xs text-primary hover:underline">
            <LinkIcon className="h-3 w-3 mr-1" /> example.com
          </a>

          <div className="mt-4 flex justify-center space-x-2 sm:space-x-4">
            {isOwnProfile ? (
              <>
                <Button variant="outline" onClick={() => router.push('/settings/profile-edit')}>
                  <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
                <Button variant="outline" onClick={() => router.push('/settings')}>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Button>
              </>
            ) : (
              <>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <UserPlus className="mr-2 h-4 w-4" /> Follow
                </Button>
                <Button variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" /> Message
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex justify-around border-b pb-3">
            <div className="text-center">
                <p className="font-semibold text-lg text-foreground">{(Math.floor(Math.random() * 200) + 10).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Polls</p>
            </div>
            <div className="text-center">
                <p className="font-semibold text-lg text-foreground">{(Math.floor(Math.random() * 5000) + 100).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
                <p className="font-semibold text-lg text-foreground">{(Math.floor(Math.random() * 1000) + 50).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Following</p>
            </div>
             <div className="text-center">
                <p className="font-semibold text-lg text-foreground">{(user.pollitPointsBalance || 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">PollitPoints</p>
            </div>
        </div>


        {/* Polls Section - Temporarily Commented Out for Debugging */}
        {/* <Tabs defaultValue="created" className="w-full mt-0">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 rounded-none border-b">
            <TabsTrigger value="created">Created</TabsTrigger>
            <TabsTrigger value="voted">Voted</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="liked" className="hidden sm:inline-flex">Liked</TabsTrigger>
          </TabsList>
          <TabsContent value="created" className="mt-0">
            {userPolls.length > 0 ? (
              <PollCardFeed 
                initialPolls={userPolls} 
                userIdForFeed={user.id} // Pass the profile user's ID
                feedType="userCreated" // Specify feed type
              />
            ) : (
              <Card className="shadow-none rounded-none border-0">
                <CardHeader className="items-center text-center pt-12 pb-8">
                   <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <CardTitle className="text-xl">No Polls Created Yet</CardTitle>
                  <CardDescription>This user hasn't created any polls. Check back later!</CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="voted">
            <Card className="shadow-none rounded-none border-0">
                <CardHeader className="items-center text-center pt-12 pb-8">
                    <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <CardTitle className="text-xl">No Voted Polls Yet</CardTitle>
                    <CardDescription>This user hasn't voted on any polls yet.</CardDescription>
                </CardHeader>
            </Card>
          </TabsContent>
          <TabsContent value="media">
             <Card className="shadow-none rounded-none border-0">
                <CardHeader className="items-center text-center pt-12 pb-8">
                    <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <CardTitle className="text-xl">No Media Polls Yet</CardTitle>
                    <CardDescription>This user hasn't created any polls with media.</CardDescription>
                </CardHeader>
            </Card>
          </TabsContent>
           <TabsContent value="liked" className="hidden sm:block">
             <Card className="shadow-none rounded-none border-0">
                <CardHeader className="items-center text-center pt-12 pb-8">
                    <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <CardTitle className="text-xl">No Liked Polls Yet</CardTitle>
                    <CardDescription>This user hasn't liked any polls yet.</CardDescription>
                </CardHeader>
            </Card>
          </TabsContent>
        </Tabs> */}
      </main>
    </div>
  );
}

// Basic PollCardFeed component placeholder - to be expanded
// const PollCardFeed: React.FC<{ initialPolls: Poll[], userIdForFeed?: string, feedType?: string }> = ({ initialPolls }) => {
//   if (!initialPolls || initialPolls.length === 0) {
//     return <p className="text-center py-8 text-muted-foreground">No polls to display.</p>;
//   }
//   return (
//     <div className="space-y-0">
//       {initialPolls.map(poll => (
//         <div key={poll.id} className="p-4 border-b">
//           <h3 className="font-semibold">{poll.question}</h3>
//           <p className="text-xs text-muted-foreground">
//             {poll.options.length} options &middot; {poll.totalVotes} votes
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// };

    