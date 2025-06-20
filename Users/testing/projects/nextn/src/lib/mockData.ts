
import type { Poll, User } from '@/types';

const generateRandomVotes = () => Math.floor(Math.random() * 300) + 10;
const generateRandomTips = () => Math.floor(Math.random() * 50);
const generateRandomPledge = (forcePledge: boolean = false): number | undefined => {
  const shouldPledge = forcePledge || Math.random() > 0.6;
  return shouldPledge ? parseFloat((Math.random() * 95 + 5).toFixed(2)) : undefined;
};
const generatePollitPoints = () => Math.floor(Math.random() * 5000) + 100;
const urlSafeText = (text: string, maxLength: number = 15): string => {
  const cleanedText = text.replace(/[^a-zA-Z0-9\\s]/g, "").substring(0, maxLength);
  return encodeURIComponent(cleanedText);
};


const usersData: { name: string }[] = [
  { name: 'Alice Wonderland' }, { name: 'Bob The Builder' }, { name: 'Charlie Chaplin' },
  { name: 'Sophia Miller' }, { name: 'Alex Johnson' }, { name: 'Emma Davis' }, { name: 'Liam Garcia' },
  { name: 'Olivia Rodriguez' }, { name: 'Noah Smith' }, { name: 'Ava Williams' }, { name: 'Isabella Brown' },
  { name: 'Mia Jones' }, { name: 'Charlotte Wilson' }, { name: 'Amelia Taylor' }, { name: 'Harper Anderson' },
  { name: 'Evelyn Thomas' }, { name: 'Abigail Jackson' }, { name: 'Ella White' }, { name: 'Scarlett Harris' },
  { name: 'Elizabeth Martin' }, { name: 'Poll Progenitor' }, { name: 'Curious Explorer' }, { name: 'Path Seeker' },
  { name: 'Ugly Day Canceller' }, { name: 'Spaghetti Fiend' }, { name: 'DJ Drama Llama' }, { name: 'Opinion Haver' }
];

export const mockUsers: User[] = usersData.map((user, index) => ({
  id: `user${index + 1}`,
  name: user.name,
  avatarUrl: `https://placehold.co/100x100.png?text=${user.name.split(' ').map(n => n[0]).join('')}`,
  username: user.name.toLowerCase().replace(/\s+/g, '').substring(0, 10) + (index + 100),
  pollitPointsBalance: generatePollitPoints(),
  isFollowedByCurrentUser: Math.random() > 0.8,
}));

const parseTimeRemaining = (timeString: string): number => {
  let totalMilliseconds = 0;
  const daysMatch = timeString.match(/(\\d+)\\s*days?/);
  const hoursMatch = timeString.match(/(\\d+)\\s*hours?/);
  const minutesMatch = timeString.match(/(\\d+)\\s*minutes?/);

  if (daysMatch) totalMilliseconds += parseInt(daysMatch[1], 10) * 24 * 60 * 60 * 1000;
  if (hoursMatch) totalMilliseconds += parseInt(hoursMatch[1], 10) * 60 * 60 * 1000;
  if (minutesMatch) totalMilliseconds += parseInt(minutesMatch[1], 10) * 60 * 1000;

  return totalMilliseconds > 0 ? totalMilliseconds : 60000; // min 1 minute
};

const getRandomUser = (): User => mockUsers[Math.floor(Math.random() * mockUsers.length)];

const generateCreatedAt = (deadlineString: string): string => {
  const deadlineMs = parseTimeRemaining(deadlineString);
  let createdAgoMs;

  if (deadlineMs <= 60 * 60 * 1000) { 
    createdAgoMs = Math.random() * (deadlineMs * 0.5);
  } else if (deadlineMs <= 24 * 60 * 60 * 1000) { 
    createdAgoMs = Math.random() * (6 * 60 * 60 * 1000) + (15 * 60 * 1000);
  } else { 
    createdAgoMs = Math.random() * (3 * 24 * 60 * 60 * 1000) + (1 * 24 * 60 * 60 * 1000);
  }
  return new Date(Date.now() - createdAgoMs).toISOString();
};

type PollSkeleton = Omit<Poll, 'totalVotes' | 'isVoted' | 'votedOptionId' | 'commentsCount' | 'likes' | 'tipCount' | 'pledgeAmount' | 'pledgeOutcome' | 'imageKeywords' | 'isSpicy' | 'isLiked' | 'postType'> & { isSpicy?: boolean };

const twoOptionPolls: PollSkeleton[] = [
  { id: '2opt_cereal_art', creator: mockUsers.find(u => u.name === 'Ugly Day Canceller') || getRandomUser(), question: "New cereal box art is weird, stop eating?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Cereal Art")}`], options: [{ id: '2opt_cereal_a', text: "Trust gut, ditch it" }, { id: '2opt_cereal_b', text: "It's just a box, chill" }], deadline: new Date(Date.now() + parseTimeRemaining("3 days")).toISOString(), createdAt: generateCreatedAt("3 days"), isSpicy: true },
  { id: '2opt_sneaky_link', creator: getRandomUser(), question: "Bestie's man DMed me twice. Sneaky link?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("DM Drama")}`], options: [{ id: '2opt_sneaky_a', text: "Slide quietly" }, { id: '2opt_sneaky_b', text: "Therapy, girl" }], deadline: new Date(Date.now() + parseTimeRemaining("1 hour")).toISOString(), createdAt: generateCreatedAt("1 hour"), isSpicy: true },
  { id: '2opt_rapper_battle', creator: getRandomUser(), question: "Trippie Redd vs Hurricane Wisdom: better rapper?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Rap Battle")}`], options: [{ id: '2opt_rap_a', text: "Trippie Redd" }, { id: '2opt_rap_b', text: "Hurricane Wisdom" }], deadline: new Date(Date.now() + parseTimeRemaining("7 minutes")).toISOString(), createdAt: generateCreatedAt("7 minutes") },
];

const threeOptionPolls: PollSkeleton[] = [
  { id: '3opt_travel_destination', creator: getRandomUser(), question: 'Next summer travel: Paris, Tokyo, or Rome?', imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Summer Travel")}`], videoUrl: 'placeholder-video-url', options: [{ id: '3opt_travel_a', text: 'Paris, France', imageUrl: `https://placehold.co/300x200.png?text=${urlSafeText("Paris")}` , affiliateLink: 'https://example.com/paris-tours' }, { id: '3opt_travel_b', text: 'Tokyo, Japan', imageUrl: `https://placehold.co/300x200.png?text=${urlSafeText("Tokyo")}`, affiliateLink: 'https://example.com/tokyo-hotels' }, { id: '3opt_travel_c', text: 'Rome, Italy', imageUrl: `https://placehold.co/300x200.png?text=${urlSafeText("Rome")}` }], deadline: new Date(Date.now() + parseTimeRemaining("30 days")).toISOString(), createdAt: generateCreatedAt("30 days") },
];

const fourOptionPolls: PollSkeleton[] = [
  { id: '4opt_seasons_detail', creator: getRandomUser(), question: 'What is your favorite season overall?', imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("FavoriteSeason")}`, `https://placehold.co/600x400.png?text=${urlSafeText("Seasonal")}`], options: [{ id: '4opt_s1_a', text: 'Spring - new beginnings', imageUrl: `https://placehold.co/300x200.png?text=${urlSafeText("Spring")}`, affiliateLink: 'https://example.com/spring-decor' }, { id: '4opt_s1_b', text: 'Summer - sunny days', imageUrl: `https://placehold.co/300x200.png?text=${urlSafeText("Summer")}`, affiliateLink: 'https://example.com/summer-gear' }, { id: '4opt_s1_c', text: 'Autumn - cozy vibes', imageUrl: `https://placehold.co/300x200.png?text=${urlSafeText("Autumn")}`, affiliateLink: 'https://example.com/autumn-fashion' }, { id: '4opt_s1_d', text: 'Winter - snow & holidays', imageUrl: `https://placehold.co/300x200.png?text=${urlSafeText("Winter")}`, affiliateLink: 'https://example.com/winter-sports' }], deadline: new Date(Date.now() + parseTimeRemaining("7 days")).toISOString(), createdAt: generateCreatedAt("7 days") },
];

const basePolls: PollSkeleton[] = [
  ...twoOptionPolls,
  ...threeOptionPolls,
  ...fourOptionPolls
];

const allPollsFull: Poll[] = basePolls.map((pollSkeleton, index) => {
  const optionsWithVotes = pollSkeleton.options.map(opt => ({
    ...opt,
    votes: opt.votes || generateRandomVotes() 
  }));
  const totalVotes = optionsWithVotes.reduce((sum, option) => sum + option.votes, 0);

  const shouldBeVoted = (index % 4 === 0); 
  let determinedVotedOptionId: string | undefined = undefined;
  if (shouldBeVoted && optionsWithVotes.length > 0) {
    determinedVotedOptionId = optionsWithVotes[Math.floor(Math.random() * optionsWithVotes.length)].id;
  }

  let pledgeAmount = generateRandomPledge(index % 5 === 0); 
  let pledgeOutcome: 'accepted' | 'tipped_crowd' | 'pending' | undefined = undefined;

  if (pledgeAmount && pledgeAmount > 0) {
      pledgeOutcome = 'pending';
  } else {
    pledgeAmount = undefined;
    pledgeOutcome = undefined;
  }
  
  const imageKeywords = pollSkeleton.imageUrls && pollSkeleton.imageUrls.length > 0 ? 
    pollSkeleton.question.toLowerCase().split(/\s+/).slice(0,2) : undefined;

  return {
    ...pollSkeleton,
    postType: 'poll',
    options: optionsWithVotes,
    totalVotes,
    isVoted: shouldBeVoted,
    votedOptionId: determinedVotedOptionId,
    isLiked: Math.random() > 0.7,
    likes: (index * 17 % 250) + 10,
    commentsCount: (index * 7 % 35) + 2,
    pledgeAmount,
    pledgeOutcome,
    tipCount: generateRandomTips(),
    imageKeywords: imageKeywords,
    isSpicy: pollSkeleton.isSpicy || false,
  };
});

export let mockPolls: Poll[] = [...allPollsFull];

export const shuffleMockPolls = () => {
  mockPolls = [...allPollsFull].sort(() => Math.random() - 0.5);
};
shuffleMockPolls();


export const fetchMorePolls = async (offset: number, limit: number): Promise<Poll[]> => {
  console.log(`Fetching more polls: offset ${offset}, limit ${limit}`);
  await new Promise(resolve => setTimeout(resolve, 300)); 

  const newPollsToServe = mockPolls.slice(offset, offset + limit);
  return newPollsToServe;
};
