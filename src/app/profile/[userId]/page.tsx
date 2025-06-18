
import type { User, Poll } from "@/types";
import { mockUsers, mockPolls } from "@/lib/mockData";

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
  let polls: Poll[] = [];
  if (user) {
    try {
      const rawPolls = mockPolls.filter(p => p.creator.id === userId);
      // Attempt to serialize and deserialize to catch stringify issues and ensure plain objects
      polls = JSON.parse(JSON.stringify(rawPolls));
    } catch (e: any) {
      console.error(`Error during JSON.stringify/parse for user ${userId}'s polls:`, e.message);
      // Fallback to empty array or re-throw, depending on desired error handling
      polls = []; // For now, let's return empty polls if serialization fails to see if the page loads
    }
  }
  return { user, polls };
}


export default async function UserProfilePage({ params }: { params: { userId:string } }) {
  const { user, polls } = await getUserData(params.userId);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-destructive">
        User not found.
      </div>
    );
  }

  // Extremely simplified rendering for debugging the stringify error
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground">Profile Page (Debug Mode)</h1>
      <p className="text-foreground">User Name: {user.name}</p>
      <p className="text-foreground">User ID: {user.id}</p>
      <p className="text-foreground">Username: {user.username}</p>
      <p className="text-foreground">Number of polls fetched (after potential stringify): {polls.length}</p>
      
      <div className="mt-4 p-4 border border-yellow-500 bg-yellow-50 rounded-md">
        <h2 className="text-xl font-semibold text-yellow-700">Debugging Information</h2>
        <p className="text-yellow-600">This is a minimal version of the profile page to help diagnose a server-side error.</p>
        <p className="text-yellow-600">If this page loads successfully on the live server, the error likely occurs when rendering the full UI (like PollCards, Images, or Avatars) with this user&apos;s data.</p>
        <p className="text-yellow-600">If this page still fails with a &quot;stringify&quot; error, the issue is likely within the user data itself or the poll data for this user, or the stringification process within `getUserData`.</p>
        <p className="text-yellow-600">Check server logs for any errors from `getUserData` (e.g., &quot;Error during JSON.stringify/parse&quot;).</p>
      </div>
    </div>
  );
}
