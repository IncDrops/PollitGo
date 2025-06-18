
import type { User, Poll } from "@/types";
import { mockUsers } from "@/lib/mockData"; // Only mockUsers is needed for this version

// Simulate fetching user. Polls are intentionally not processed here.
async function getUserData(userId: string): Promise<{ user: User | null; polls: Poll[] }> {
  console.log(`[UserProfilePage - MINIMAL] getUserData called for userId: ${userId}`);
  const user = mockUsers.find(u => u.id === userId) || null;
  
  if (user) {
    console.log(`[UserProfilePage - MINIMAL] User found: ${user.name}`);
  } else {
    console.log(`[UserProfilePage - MINIMAL] User not found for userId: ${userId}`);
  }
  // Return an empty polls array to completely avoid poll processing for this test.
  return { user, polls: [] };
}


export default async function UserProfilePage({ params }: { params: { userId:string } }) {
  console.log(`[UserProfilePage - MINIMAL] Rendering page for userId: ${params.userId}`);
  const { user } = await getUserData(params.userId); // Polls are not used from the result

  if (!user) {
    console.log(`[UserProfilePage - MINIMAL] User not found for ID ${params.userId}, rendering 'User not found' message.`);
    return (
      <div className="container mx-auto px-4 py-8 text-center text-destructive">
        User not found.
      </div>
    );
  }

  console.log(`[UserProfilePage - MINIMAL] User ${user.name} found. Rendering minimal info.`);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground">Profile Page (Minimal Test V2)</h1>
      <p className="text-foreground">User Name: {user.name}</p>
      <p className="text-foreground">User ID: {user.id}</p>
      <p className="text-muted-foreground mt-4">This is a highly simplified version of the profile page. If this page loads successfully, the stringify error is related to poll data processing. If it still fails, the issue might be with the user object for '{user.name}' itself when serialized by Next.js on the server.</p>
    </div>
  );
}

