
export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  username: string;
  pollitPointsBalance?: number;
}

export interface PollOption {
  id: string;
  text: string;
  imageUrl?: string;
  videoUrl?: string; // For thumbnail of video option
  votes: number;
  affiliateLink?: string;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  createdAt: string; // ISO string
}

export interface Poll {
  id: string;
  creator: User;
  question: string;
  options: PollOption[];
  imageUrls?: string[]; // Images for the poll itself (up to 4)
  imageKeywords?: string[]; // Keywords for the main poll images
  videoUrl?: string; // Video for the poll itself (e.g. context video, up to 60s)
  deadline: string; // ISO string
  createdAt: string; // ISO string
  likes: number;
  totalVotes: number;
  commentsCount: number;
  isVoted?: boolean;
  votedOptionId?: string;
  pledgeAmount?: number; // Amount pledged by the creator
  pledgeOutcome?: 'accepted' | 'tipped_crowd' | 'pending'; // Status of the pledge
  tipCount?: number; // Number of tips received for this poll/creator
  isSpicy?: boolean; // Indicates if the poll content might be NSFW/spicy
}

export type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

