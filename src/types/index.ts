export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  username: string;
}

export interface PollOption {
  id: string;
  text: string;
  imageUrl?: string;
  videoUrl?: string; // For thumbnail of video option
  votes: number;
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
  videoUrl?: string; // Video for the poll itself (e.g. context video, up to 60s)
  deadline: string; // ISO string
  createdAt: string; // ISO string
  likes: number;
  totalVotes: number;
  commentsCount: number;
  isVoted?: boolean; 
  votedOptionId?: string; 
}

export type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

