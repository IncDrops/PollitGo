import type { Poll, User } from '@/types';

export const mockUsers: User[] = [
  { id: 'user1', name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/100x100.png', username: 'alicew' },
  { id: 'user2', name: 'Bob The Builder', avatarUrl: 'https://placehold.co/100x100.png', username: 'bobuilds' },
  { id: 'user3', name: 'Charlie Chaplin', avatarUrl: 'https://placehold.co/100x100.png', username: 'charliec' },
];

export const mockPolls: Poll[] = [
  {
    id: 'poll1',
    creator: mockUsers[0],
    question: 'What is your favorite season?',
    imageUrl: 'https://placehold.co/600x400.png',
    options: [
      { id: 'opt1a', text: 'Spring', votes: 120, imageUrl: 'https://placehold.co/300x200.png' },
      { id: 'opt1b', text: 'Summer', votes: 250, imageUrl: 'https://placehold.co/300x200.png' },
      { id: 'opt1c', text: 'Autumn', votes: 180, imageUrl: 'https://placehold.co/300x200.png' },
      { id: 'opt1d', text: 'Winter', votes: 90, imageUrl: 'https://placehold.co/300x200.png' },
    ],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    likes: 350,
    totalVotes: 640,
    commentsCount: 15,
    isVoted: false,
  },
  {
    id: 'poll2',
    creator: mockUsers[1],
    question: 'Best programming language for beginners in 2024?',
    options: [
      { id: 'opt2a', text: 'Python', votes: 300 },
      { id: 'opt2b', text: 'JavaScript', votes: 280 },
      { id: 'opt2c', text: 'Java', votes: 150 },
      { id: 'opt2d', text: 'C#', votes: 100 },
    ],
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    likes: 420,
    totalVotes: 830,
    commentsCount: 22,
    isVoted: true,
    votedOptionId: 'opt2a',
  },
  {
    id: 'poll3',
    creator: mockUsers[2],
    question: 'Which travel destination for next summer?',
    videoUrl: 'https://placehold.co/600x400.png', // Placeholder for video thumbnail
    options: [
      { id: 'opt3a', text: 'Paris, France', votes: 180, videoUrl: 'https://placehold.co/300x200.png' },
      { id: 'opt3b', text: 'Tokyo, Japan', votes: 220, videoUrl: 'https://placehold.co/300x200.png' },
      { id: 'opt3c', text: 'Rome, Italy', votes: 160, videoUrl: 'https://placehold.co/300x200.png' },
    ],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    createdAt: new Date().toISOString(),
    likes: 210,
    totalVotes: 560,
    commentsCount: 8,
    isVoted: false,
  },
  {
    id: 'poll4',
    creator: mockUsers[0],
    question: 'Favorite type of movie?',
    imageUrl: 'https://placehold.co/600x400.png',
    options: [
      { id: 'opt4a', text: 'Action', votes: 300 },
      { id: 'opt4b', text: 'Comedy', votes: 250 },
      { id: 'opt4c', text: 'Sci-Fi', votes: 200 },
      { id: 'opt4d', text: 'Drama', votes: 150 },
    ],
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 500,
    totalVotes: 900,
    commentsCount: 30,
    isVoted: true,
    votedOptionId: 'opt4c',
  },
];

// Function to get more polls, simulating API call for infinite scroll
export const fetchMorePolls = async (offset: number, limit: number): Promise<Poll[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Simulate fetching new polls. In a real app, this would be an API call.
      // For now, we'll just cycle through the mockPolls or generate new ones.
      const newPolls = Array.from({ length: limit }, (_, i) => ({
        ...mockPolls[i % mockPolls.length],
        id: `poll${offset + i + 100}`, // Ensure unique IDs
        question: `Another interesting poll question #${offset + i + 1}?`,
        creator: mockUsers[(offset + i) % mockUsers.length],
        createdAt: new Date().toISOString(),
        deadline: new Date(Date.now() + (i+1) * 24 * 60 * 60 * 1000).toISOString(),
      }));
      resolve(newPolls);
    }, 500); // Simulate network delay
  });
};
