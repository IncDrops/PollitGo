// src/types/index.ts

// This User type is for your application's representation of a user.
// It might be enriched with data from your database once you set one up.
export interface User {
  id: string; // Typically corresponds to NextAuth user.id or sub
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null; // Corresponds to NextAuth user.image
  username?: string; // You might add this from your database
  pollitPointsBalance?: number; // Example custom field
}

// UserProfile can be more detailed if needed, fetched from your DB
export interface UserProfile extends User {
  bio?: string;
  location?: string;
  website?: string;
  // Add other profile properties here
}

export interface PollOption {
  id: string;
  text: string;
  imageUrl?: string;
  videoUrl?: string;
  votes: number;
  affiliateLink?: string;
}

export interface Comment {
  id: string;
  user: User; // The user who made the comment
  text: string;
  createdAt: string; // ISO string
}

export interface Poll {
  id: string;
  creator: User; // The user who created the poll
  question: string;
  options: PollOption[];
  imageUrls?: string[];
  imageKeywords?: string[];
  videoUrl?: string;
  deadline: string; // ISO string
  createdAt: string; // ISO string
  likes: number;
  totalVotes: number;
  commentsCount: number;
  isVoted?: boolean; // Indicates if the *current session user* has voted
  votedOptionId?: string; // Which option the *current session user* voted for
  pledgeAmount?: number;
  pledgeOutcome?: 'accepted' | 'tipped_crowd' | 'pending';
  tipCount?: number;
  isSpicy?: boolean;
}

export type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

// You might also want a type for your NextAuth session user if you customize it significantly
// import type { DefaultUser } from 'next-auth';
// declare module 'next-auth' {
//   interface Session {
//     user?: DefaultUser & {
//       id: string;
//       // Add other custom session properties here
//     };
//   }
//   interface User extends DefaultUser {
//     // Add other custom user properties here if needed for token/callbacks
//   }
// }
