
import type { Poll, User } from '@/types';

const generateRandomVotes = () => Math.floor(Math.random() * 300) + 10;
const generateRandomTips = () => Math.floor(Math.random() * 50); // Can be 0
const generateRandomPledge = (hasPledge: boolean = Math.random() > 0.7): number | undefined => {
  return hasPledge ? Math.floor(Math.random() * 95) + 5 : undefined;
}


const usersData: { name: string }[] = [
  { name: 'Alice Wonderland' }, { name: 'Bob The Builder' }, { name: 'Charlie Chaplin' },
  { name: 'Sophia Miller' }, { name: 'Alex Johnson' }, { name: 'Emma Davis' }, { name: 'Liam Garcia' },
  { name: 'Olivia Rodriguez' }, { name: 'Noah Smith' }, { name: 'Ava Williams' }, { name: 'Isabella Brown' },
  { name: 'Mia Jones' }, { name: 'Charlotte Wilson' }, { name: 'Amelia Taylor' }, { name: 'Harper Anderson' },
  { name: 'Evelyn Thomas' }, { name: 'Abigail Jackson' }, { name: 'Ella White' }, { name: 'Scarlett Harris' },
  { name: 'Elizabeth Martin' }, { name: 'Camila Thompson' }, { name: 'Aria Moore' }, { name: 'Victoria Lee' },
  { name: 'Madison Perez' }, { name: 'Luna Walker' }, { name: 'Grace Hall' }, { name: 'Natalie Allen' },
  { name: 'Sarah Young' }, { name: 'Bella King' }, { name: 'Chloe Wright' }, { name: 'Daisy Scott' },
  { name: 'Emily Green' }, { name: 'Fiona Adams' }, { name: 'Hannah Baker' }, { name: 'Ivy Nelson' },
  { name: 'Jessie Carter' }, { name: 'Kayla Mitchell' }, { name: 'Lily Roberts' }, { name: 'Nora Phillips' },
  { name: 'Penny Campbell' }, { name: 'Quinn Evans' }, { name: 'Ruby Edwards' }, { name: 'Tina Collins' },
  { name: 'Ursula Stewart' }, { name: 'Violet Morris' }, { name: 'Wendy Rogers' }, { name: 'Zara Reed' },
  { name: 'Zoe Cook' }, { name: 'Ethan Morgan' }, { name: 'Frank Bell' }, { name: 'Gary Murphy' },
  { name: 'Henry Bailey' }, { name: 'Ian Cooper' }, { name: 'Jack Howard' }, { name: 'Justin Kelly' },
  { name: 'David Kelly' }, { name: 'Michael Sanders' }, { name: 'James Price' }, { name: 'John Bennett' },
  { name: 'Robert Wood' }, { name: 'Ben Ross' }, { name: 'Chris Henderson' }, { name: 'Daniel Coleman' },
  { name: 'Leo Jenkins' }, { name: 'Mark Perry' }, { name: 'Nate Powell' }, { name: 'Oscar Long' },
  { name: 'Romantic Traveler' }, { name: 'Curious Explorer' }, { name: 'Home Buyer' }, { name: 'Hungry Harry' },
  { name: 'Festival Fiona' }, { name: 'Career Changer' }, { name: 'Path Seeker' }, 
  { name: 'Family Mediator' }, { name: 'Betrayed Spouse' }, { name: 'Fashion Conscious' },
  // New users for 2-option polls from the list
  { name: 'Cereal Consumer' }, { name: 'Drama Llama' }, { name: 'Rap Analyst' }, { name: 'Thirsty Hubby' },
  { name: 'Ghost Ponderer' }, { name: 'Hoodie Champion' }, { name: 'Tender Lover' }, { name: 'Insta Model' },
  { name: 'Message Ignorer' }, { name: 'Charger Keeper' }, { name: 'Party Planner' }, { name: 'Podcast Dreamer' },
  { name: 'Spotify Stalker' }, { name: 'Text Detective' }, { name: 'Grass Avoider' }, { name: 'Tattoo Thinker' },
  { name: 'Dog Pic Defender' }, { name: 'Job Quitter Pro' }, { name: 'Cheese Critic' }, { name: 'Feet Pic Financier' },
  { name: 'Toxic Trait Tom' }, { name: 'Delulu Deb' }, { name: 'Charger Hoarder' }, { name: 'Fridge Raider' },
  { name: 'Archive Diver' }, { name: 'Late Night Texter' }, { name: 'Chaos Agent' }, { name: 'Toothbrush Sharer' },
  { name: 'Story Blocker' }, { name: 'Fries Fighter' }, { name: 'Ex Mom Texter' }, { name: 'Red Flag Racer' },
  { name: 'Group Chat Guru' }, { name: 'KitKat Connoisseur' }, { name: 'Hoodie Hostage Holder' }, // Differentiated user name
  { name: 'DM Slider' }, { name: 'Crisis Responder' }, { name: 'Breath Buddy' }, { name: 'Ugly Day Canceller' },
  { name: 'Poll Progenitor' }
];

export const mockUsers: User[] = usersData.map((user, index) => ({
  id: `user${index + 1}`,
  name: user.name,
  avatarUrl: `https://placehold.co/100x100.png?text=${user.name.substring(0,1)}`,
  username: user.name.toLowerCase().replace(/\s+/g, '').substring(0, 10) + (index + 100), 
}));

const parseTimeRemaining = (timeString: string): number => {
  let totalMilliseconds = 0;
  const daysMatch = timeString.match(/(\d+)\s*days?/);
  const hoursMatch = timeString.match(/(\d+)\s*hours?/);
  const minutesMatch = timeString.match(/(\d+)\s*minutes?/);

  if (daysMatch) totalMilliseconds += parseInt(daysMatch[1], 10) * 24 * 60 * 60 * 1000;
  if (hoursMatch) totalMilliseconds += parseInt(hoursMatch[1], 10) * 60 * 60 * 1000;
  if (minutesMatch) totalMilliseconds += parseInt(minutesMatch[1], 10) * 60 * 1000;
  
  return totalMilliseconds > 0 ? totalMilliseconds : 60000; // Default to 1 minute if parsing fails
};

const getRandomUser = (): User => mockUsers[Math.floor(Math.random() * mockUsers.length)];
const findUser = (name: string): User => {
  const found = mockUsers.find(u => u.name.toLowerCase().startsWith(name.toLowerCase()));
  if (found) return found;
  console.warn(`User starting with "${name}" not found, returning random user.`);
  return getRandomUser();
}

const generateCreatedAt = (deadlineString: string): string => {
  const deadlineMs = parseTimeRemaining(deadlineString);
  let createdAgoMs;

  if (deadlineMs <= 60 * 60 * 1000) { // 1 hour or less
    createdAgoMs = Math.random() * (deadlineMs * 0.5); 
  } else if (deadlineMs <= 24 * 60 * 60 * 1000) { // 1 day or less
    createdAgoMs = Math.random() * (6 * 60 * 60 * 1000) + (15 * 60 * 1000); 
  } else { // more than 1 day
    createdAgoMs = Math.random() * (3 * 24 * 60 * 60 * 1000) + (1 * 24 * 60 * 60 * 1000); 
  }
  return new Date(Date.now() - createdAgoMs).toISOString();
};


const initialPolls: Omit<Poll, 'totalVotes' | 'isVoted' | 'votedOptionId' | 'commentsCount' | 'likes' | 'pledgeAmount' | 'tipCount'>[]  = [ 
  {
    id: 'poll1_original_seasons', // Made ID more specific
    creator: findUser('Alice Wonderland'),
    question: 'What is your favorite season?',
    imageUrls: ['https://placehold.co/600x400.png?text=Seasons'],
    options: [
      { id: 'opt1a', text: 'Spring', votes: 120, imageUrl: 'https://placehold.co/300x200.png?text=Spring', affiliateLink: 'https://example.com/spring-decor' },
      { id: 'opt1b', text: 'Summer', votes: 250, imageUrl: 'https://placehold.co/300x200.png?text=Summer', affiliateLink: 'https://example.com/summer-gear' },
      { id: 'opt1c', text: 'Autumn', votes: 180, imageUrl: 'https://placehold.co/300x200.png?text=Autumn', affiliateLink: 'https://example.com/autumn-fashion' },
      { id: 'opt1d', text: 'Winter', votes: 90, imageUrl: 'https://placehold.co/300x200.png?text=Winter', affiliateLink: 'https://example.com/winter-sports' },
    ],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'poll2_original_language', // Made ID more specific
    creator: findUser('Bob The Builder'),
    question: 'Best programming language for beginners in 2024?',
    imageUrls: ['https://placehold.co/600x400.png?text=Code'],
    options: [
      { id: 'opt2a', text: 'Python', votes: 300, affiliateLink: 'https://example.com/python-course' },
      { id: 'opt2b', text: 'JavaScript', votes: 280, affiliateLink: 'https://example.com/js-bootcamp' },
      { id: 'opt2c', text: 'Java', votes: 150 },
      { id: 'opt2d', text: 'C#', votes: 100 },
    ],
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'poll3_original_travel', // Made ID more specific
    creator: findUser('Charlie Chaplin'),
    question: 'Which travel destination for next summer?',
    imageUrls: ['https://placehold.co/600x400.png?text=Travel'],
    videoUrl: 'placeholder-video-url',
    options: [
      { id: 'opt3a', text: 'Paris, France', votes: 180, videoUrl: 'placeholder-option-video-url', affiliateLink: 'https://example.com/paris-tours' },
      { id: 'opt3b', text: 'Tokyo, Japan', votes: 220, videoUrl: 'placeholder-option-video-url', affiliateLink: 'https://example.com/tokyo-hotels' },
      { id: 'opt3c', text: 'Rome, Italy', votes: 160, videoUrl: 'placeholder-option-video-url' },
    ],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'poll_sophia_vcard_main',
    creator: findUser('Sophia Miller'),
    question: "Finna lose my V-card, besties. To wrap it or not to wrap it? Low-key kinda nervous but also wanna YOLO. What's the tea?",
    imageUrls: ['https://placehold.co/600x400.png?text=YOLO'], 
    options: [
      { id: 'sv_opt1_main', text: "Wrap it like it's your favorite mixtape ('cause STIs are NOT a vibe). Safety first, always! Think about long-term health and peace of mind. It's a sign of respect for yourself and your partner.", votes: generateRandomVotes(), affiliateLink: 'https://example.com/safe-sex-info' },
      { id: 'sv_opt2_main', text: "The stars whisper secrets of protection... and pleasure. Choose wisely. Sometimes the most mysterious path is the safest one, leading to even greater joys when approached with care and consideration.", votes: generateRandomVotes() },
      { id: 'sv_opt3_main', text: "Raw doggin' it? Only if you both got clean bills of health & discussed risks. Otherwise, glove up! This is a serious decision with potential lifelong consequences. Honesty and testing are key.", votes: generateRandomVotes() },
      { id: 'sv_opt4_main', text: "Let the spirits guide you... to the condom aisle. Then flip a coin for flavor. A little humor can ease the nerves, but ultimately, the choice for protection is a wise one. Make it fun, but make it safe.", votes: generateRandomVotes(), affiliateLink: 'https://example.com/condom-variety-pack' },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 hours, 38 minutes")).toISOString(),
    createdAt: generateCreatedAt("6 hours, 38 minutes"),
  },
  {
    id: 'poll_sophia_houseplant',
    creator: findUser('Sophia Miller'),
    question: 'My houseplant is getting too big for its pot. Do I repot it, or prune it back aggressively?',
    imageUrls: ['https://placehold.co/600x400.png?text=Plant'], 
    options: [
      { id: 'sh_opt1', text: 'Repot it! Let it flourish.', votes: generateRandomVotes(), affiliateLink: 'https://example.com/large-pots' },
      { id: 'sh_opt2', text: 'Prune it, keep it manageable.', votes: generateRandomVotes(), affiliateLink: 'https://example.com/pruning-shears' },
      { id: 'sh_opt3', text: 'Get a bigger house for your plant.', votes: generateRandomVotes() },
      { id: 'sh_opt4', text: 'Donate it to a botanical garden.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("22 hours, 14 minutes")).toISOString(),
    createdAt: generateCreatedAt("22 hours, 14 minutes"),
  },
  {
    id: 'poll_alex_code',
    creator: findUser('Alex Johnson'),
    question: 'Should I learn to code to boost my career, or is it too late for an old dog to learn new tricks?',
    imageUrls: ['https://placehold.co/600x400.png?text=Career'], 
    options: [
      { id: 'ac_opt1', text: 'Never too late! Code away!', votes: generateRandomVotes(), affiliateLink: 'https://example.com/coding-bootcamp-for-adults' },
      { id: 'ac_opt2', text: 'Focus on refining current skills.', votes: generateRandomVotes() },
      { id: 'ac_opt3', text: 'Try a beginner course, see if it sticks.', votes: generateRandomVotes(), affiliateLink: 'https://example.com/intro-to-code' },
      { id: 'ac_opt4', text: 'Network instead of code.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("10 days, 21 hours, 10 minutes")).toISOString(),
    createdAt: generateCreatedAt("10 days, 21 hours, 10 minutes"),
  },
  {
    id: 'poll_emma_ghosting',
    creator: findUser('Emma Davis'),
    question: 'My best friend keeps ghosting me for their new significant other. Do I confront them or just accept our friendship has changed?',
    imageUrls: ['https://placehold.co/600x400.png?text=Friendship'], 
    options: [
      { id: 'eg_opt1', text: 'Confront them, open communication is vital.', votes: generateRandomVotes() },
      { id: 'eg_opt2', text: 'Give them space, they\'ll come back around.', votes: generateRandomVotes() },
      { id: 'eg_opt3', text: 'Find new friends who prioritize you.', votes: generateRandomVotes(), affiliateLink: 'https://example.com/friendship-advice-book' },
      { id: 'eg_opt4', text: 'Send a passive-aggressive meme.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 16 hours, 28 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 days, 16 hours, 28 minutes"),
  },
  {
    id: 'poll_liam_pizza',
    creator: findUser('Liam Garcia'),
    question: "Is it ever okay to eat cold pizza for breakfast? Asking for a friend who's currently staring at a leftover slice.",
    imageUrls: ['https://placehold.co/600x400.png?text=Pizza'], 
    options: [
      { id: 'lp_opt1', text: "Absolutely, it's a breakfast staple!", votes: generateRandomVotes() },
      { id: 'lp_opt2', text: "No, heat it up or don't bother.", votes: generateRandomVotes() },
      { id: 'lp_opt3', text: "Only if you're desperate.", votes: generateRandomVotes() },
      { id: 'lp_opt4', text: "It's a culinary crime.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("4 days, 15 hours, 48 minutes")).toISOString(),
    createdAt: generateCreatedAt("4 days, 15 hours, 48 minutes"),
  },
  {
    id: 'poll_olivia_roommate',
    creator: findUser('Olivia Rodriguez'),
    question: 'My roommate never cleans. Do I create a chore chart, or passive-aggressively clean only my side?',
    imageUrls: ['https://placehold.co/600x400.png?text=Chores'], 
    options: [
      { id: 'or_opt1', text: 'Chore chart! Clear expectations.', votes: generateRandomVotes(), affiliateLink: 'https://example.com/chore-charts' },
      { id: 'or_opt2', text: 'Passive aggression wins every time.', votes: generateRandomVotes() },
      { id: 'or_opt3', text: 'Move out.', votes: generateRandomVotes() },
      { id: 'or_opt4', text: 'Hire a cleaner for common areas.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 day, 20 hours, 14 minutes")).toISOString(),
    createdAt: generateCreatedAt("1 day, 20 hours, 14 minutes"),
  },
  {
    id: 'poll_noah_bangs',
    creator: findUser('Noah Smith'),
    question: 'Should I get bangs? It feels like a big commitment for my face shape.',
    imageUrls: ['https://placehold.co/600x400.png?text=Haircut'], 
    options: [
      { id: 'nb_opt1', text: 'Go for it! Hair grows back.', votes: generateRandomVotes() },
      { id: 'nb_opt2', text: 'No bangs, too much maintenance.', votes: generateRandomVotes() },
      { id: 'nb_opt3', text: 'Try clip-in bangs first.', votes: generateRandomVotes(), affiliateLink: 'https://example.com/clip-in-bangs' },
      { id: 'nb_opt4', text: 'Ask your stylist for their professional opinion.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("17 hours, 20 minutes")).toISOString(),
    createdAt: generateCreatedAt("17 hours, 20 minutes"),
  },
  {
    id: 'poll_ava_lunch',
    creator: findUser('Ava Williams'),
    question: "I've got 5 minutes to decide on lunch. Pizza or a sad desk salad? My stomach is conflicted.",
    imageUrls: ['https://placehold.co/600x400.png?text=Lunchtime'], 
    options: [
      { id: 'al_opt1', text: 'Pizza! Always pizza.', votes: generateRandomVotes(), affiliateLink: 'https://example.com/local-pizza-deals' },
      { id: 'al_opt2', text: 'Salad, gotta be healthy today.', votes: generateRandomVotes() },
      { id: 'al_opt3', text: 'Flip a coin.', votes: generateRandomVotes() },
      { id: 'al_opt4', text: 'Order both and regret nothing.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("5 minutes")).toISOString(),
    createdAt: generateCreatedAt("5 minutes"),
  },
  {
    id: 'poll_isabella_socks',
    creator: findUser('Isabella Brown'),
    question: "My partner keeps leaving their dirty socks everywhere. Do I passive-aggressively put them on their pillow, or actually talk about it?",
    imageUrls: ['https://placehold.co/600x400.png?text=Socks'], 
    options: [
        { id: 'is_opt1', text: "Pillow revenge! It's a classic.", votes: generateRandomVotes() },
        { id: 'is_opt2', text: "Communicate, it's the adult thing to do.", votes: generateRandomVotes() },
        { id: 'is_opt3', text: "Hire a maid.", votes: generateRandomVotes() },
        { id: 'is_opt4', text: "Collect them and present them as a 'gift'.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 days, 13 hours, 21 minutes")).toISOString(),
    createdAt: generateCreatedAt("7 days, 13 hours, 21 minutes"),
  },
   {
    id: 'poll_mia_bedroom',
    creator: findUser('Mia Jones'),
    question: "Thinking about spicing things up in the bedroom tonight. Should we try that new position from the internet, or stick to our faves?",
    imageUrls: ['https://placehold.co/600x400.png?text=Bedroom'], 
    options: [
        { id: 'mb_opt1', text: "Go for the new! Adventure awaits.", votes: generateRandomVotes(), affiliateLink: 'https://example.com/kama-sutra-guide' },
        { id: 'mb_opt2', text: "Stick to the classics, they're classics for a reason.", votes: generateRandomVotes() },
        { id: 'mb_opt3', text: "Mix it up: Start with a classic, end with the new.", votes: generateRandomVotes() },
        { id: 'mb_opt4', text: "Negotiate: One new, one old. Fair play.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("15 days, 2 hours, 45 minutes")).toISOString(),
    createdAt: generateCreatedAt("15 days, 2 hours, 45 minutes"),
  },
  {
    id: 'poll_charlotte_date',
    creator: findUser('Charlotte Wilson'),
    question: "Should I go on a third date with someone who's super hot but has absolutely no ambition, or cut my losses?",
    imageUrls: ['https://placehold.co/600x400.png?text=Dating'], 
    options: [
        { id: 'cd_opt1', text: "Hotness fades, ambition lasts. Cut losses.", votes: generateRandomVotes() },
        { id: 'cd_opt2', text: "Enjoy the hotness while it lasts!", votes: generateRandomVotes() },
        { id: 'cd_opt3', text: "Give them another chance, maybe they'll grow.", votes: generateRandomVotes() },
        { id: 'cd_opt4', text: "Friend-zone them and find someone with ambition.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 hours, 33 minutes")).toISOString(),
    createdAt: generateCreatedAt("6 hours, 33 minutes"),
  },
  {
    id: 'poll_amelia_balance',
    creator: findUser('Amelia Taylor'),
    question: "Is it truly possible to balance a demanding career and a fulfilling family life, or is one always sacrificed for the other?",
    imageUrls: ['https://placehold.co/600x400.png?text=Balance'], 
    options: [
        { id: 'ab_opt1', text: "Yes, with careful planning and boundaries.", votes: generateRandomVotes(), affiliateLink: 'https://example.com/work-life-balance-book' },
        { id: 'ab_opt2', text: "No, it's an impossible dream for most.", votes: generateRandomVotes() },
        { id: 'ab_opt3', text: "It depends on your definition of 'balance'.", votes: generateRandomVotes() },
        { id: 'ab_opt4', text: "Outsource everything!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("28 days, 19 hours, 5 minutes")).toISOString(),
    createdAt: generateCreatedAt("28 days, 19 hours, 5 minutes"),
  },
  {
    id: 'poll_harper_masters',
    creator: findUser('Harper Anderson'),
    question: "Should I pursue a master's degree to advance my career, even if it means taking on significant student debt?",
    imageUrls: ['https://placehold.co/600x400.png?text=Education'], 
    options: [
        { id: 'hm_opt1', text: "Invest in yourself, it will pay off.", votes: generateRandomVotes(), affiliateLink: 'https://example.com/masters-programs' },
        { id: 'hm_opt2', text: "Debt is a trap, explore other options.", votes: generateRandomVotes() },
        { id: 'hm_opt3', text: "Only if you're passionate about the subject.", votes: generateRandomVotes() },
        { id: 'hm_opt4', text: "Crunch the numbers, is the ROI worth it?", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("21 days, 13 hours, 38 minutes")).toISOString(),
    createdAt: generateCreatedAt("21 days, 13 hours, 38 minutes"),
  },
  {
    id: 'poll_evelyn_city',
    creator: findUser('Evelyn Thomas'),
    question: "I'm thinking of moving to a completely new city where I know no one. Exciting fresh start, or terrifying leap into the unknown?",
    imageUrls: ['https://placehold.co/600x400.png?text=Moving'], 
    options: [
        { id: 'ec_opt1', text: "Exciting! Embrace the new adventure.", votes: generateRandomVotes() },
        { id: 'ec_opt2', text: "Terrifying, build a network first.", votes: generateRandomVotes() },
        { id: 'ec_opt3', text: "Do it, you'll grow immensely.", votes: generateRandomVotes() },
        { id: 'ec_opt4', text: "Visit first, then decide.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("10 days, 9 hours, 10 minutes")).toISOString(),
    createdAt: generateCreatedAt("10 days, 9 hours, 10 minutes"),
  },
  {
    id: 'poll_abigail_feelings',
    creator: findUser('Abigail Jackson'),
    question: "Should I confess my feelings to my long-time friend, even if it risks ruining our friendship?",
    imageUrls: ['https://placehold.co/600x400.png?text=Feelings'], 
    options: [
        { id: 'af_opt1', text: "Take the leap! You'll regret not knowing.", votes: generateRandomVotes() },
        { id: 'af_opt2', text: "Keep it platonic, friendship is too valuable.", votes: generateRandomVotes() },
        { id: 'af_opt3', text: "Test the waters subtly first.", votes: generateRandomVotes() },
        { id: 'af_opt4', text: "Wait for them to make a move.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 days, 2 hours, 56 minutes")).toISOString(),
    createdAt: generateCreatedAt("3 days, 2 hours, 56 minutes"),
  },
   {
    id: 'poll_ella_car',
    creator: findUser('Ella White'),
    question: "My car is on its last legs. Do I repair it one last time, or finally buy a new (or used) one?",
    imageUrls: ['https://placehold.co/600x400.png?text=Car'], 
    options: [
        { id: 'elc_opt1', text: "Repair it, squeeze out every last mile.", votes: generateRandomVotes() },
        { id: 'elc_opt2', text: "New car time! Enjoy the reliability.", votes: generateRandomVotes(), affiliateLink: 'https://example.com/new-car-deals' },
        { id: 'elc_opt3', text: "Used car, better value.", votes: generateRandomVotes() },
        { id: 'elc_opt4', text: "Public transport is the way!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("18 days, 8 hours, 31 minutes")).toISOString(),
    createdAt: generateCreatedAt("18 days, 8 hours, 31 minutes"),
  },
  {
    id: 'poll_scarlett_cooking',
    creator: findUser('Scarlett Harris'),
    question: "Is it okay to secretly dislike my partner's cooking, or should I tell them the truth (gently, of course)?",
    imageUrls: ['https://placehold.co/600x400.png?text=Cooking'], 
    options: [
        { id: 'sch_opt1', text: "Pretend to love it, save their feelings.", votes: generateRandomVotes() },
        { id: 'sch_opt2', text: "Tell them gently, offer to cook together.", votes: generateRandomVotes() },
        { id: 'sch_opt3', text: "Suggest takeout more often.", votes: generateRandomVotes() },
        { id: 'sch_opt4', text: "Just eat less of it.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 days, 17 hours, 26 minutes")).toISOString(),
    createdAt: generateCreatedAt("7 days, 17 hours, 26 minutes"),
  },
  {
    id: 'poll_elizabeth_sport',
    creator: findUser('Elizabeth Martin'),
    question: "Should I try a new, extreme sport like skydiving or rock climbing, or stick to my cozy hobbies?",
    imageUrls: ['https://placehold.co/600x400.png?text=ExtremeSport'], 
    options: [
        { id: 'els_opt1', text: "Go for it! Adrenaline rush!", votes: generateRandomVotes(), affiliateLink: 'https://example.com/skydiving-experience' },
        { id: 'els_opt2', text: "Stay cozy, safety first.", votes: generateRandomVotes() },
        { id: 'els_opt3', text: "Start small, try bouldering first.", votes: generateRandomVotes() },
        { id: 'els_opt4', text: "Live vicariously through YouTube.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("9 hours, 4 minutes")).toISOString(),
    createdAt: generateCreatedAt("9 hours, 4 minutes"),
  },
  {
    id: 'poll_sofia_pet_surgery', 
    creator: findUser('Sophia Miller'), 
    question: "My pet needs an expensive surgery. Do I drain my savings for it, or consider other options?",
    imageUrls: ['https://placehold.co/600x400.png?text=PetHealth'], 
    options: [
        { id: 'sps_opt1', text: "Save your pet, cost is secondary!", votes: generateRandomVotes() },
        { id: 'sps_opt2', text: "Consider quality of life, explore alternatives.", votes: generateRandomVotes() },
        { id: 'sps_opt3', text: "Look for financial aid/pet charities.", votes: generateRandomVotes(), affiliateLink: 'https://example.com/pet-charities' },
        { id: 'sps_opt4', text: "It's just a pet, be practical.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("25 days, 1 hour, 35 minutes")).toISOString(),
    createdAt: generateCreatedAt("25 days, 1 hour, 35 minutes"),
  },
  {
    id: 'poll_camila_apology',
    creator: findUser('Camila Thompson'),
    question: "Is it better to apologize immediately when you're wrong, or wait until emotions cool down?",
    imageUrls: ['https://placehold.co/600x400.png?text=Apology'], 
    options: [
        { id: 'ca_opt1', text: "Immediately, clear the air.", votes: generateRandomVotes() },
        { id: 'ca_opt2', text: "Wait, a calm apology is more effective.", votes: generateRandomVotes() },
        { id: 'ca_opt3', text: "It depends on the situation.", votes: generateRandomVotes() },
        { id: 'ca_opt4', text: "Never apologize, assert dominance!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("12 days, 11 hours, 51 minutes")).toISOString(),
    createdAt: generateCreatedAt("12 days, 11 hours, 51 minutes"),
  },
  {
    id: 'poll_aria_social_media',
    creator: findUser('Aria Moore'),
    question: "Should I confront my friend about their problematic social media posts, or is it not my place?",
    imageUrls: ['https://placehold.co/600x400.png?text=SocialMedia'], 
    options: [
        { id: 'asm_opt1', text: "Confront them privately, from a place of care.", votes: generateRandomVotes() },
        { id: 'asm_opt2', text: "It's not your place, let them be.", votes: generateRandomVotes() },
        { id: 'asm_opt3', text: "Unfollow/mute them.", votes: generateRandomVotes() },
        { id: 'asm_opt4', text: "Publicly call them out.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 day, 8 hours, 37 minutes")).toISOString(),
    createdAt: generateCreatedAt("1 day, 8 hours, 37 minutes"),
  },
  {
    id: 'poll_victoria_client',
    creator: findUser('Victoria Lee'),
    question: "I'm a freelancer and a potential client is offering a huge project but has a terrible reputation. Do I take the money or protect my peace?",
    imageUrls: ['https://placehold.co/600x400.png?text=Freelance'], 
    options: [
        { id: 'vc_opt1', text: "Take the money, deal with the headache later.", votes: generateRandomVotes() },
        { id: 'vc_opt2', text: "Protect your peace, it's not worth it.", votes: generateRandomVotes() },
        { id: 'vc_opt3', text: "Negotiate stricter terms and upfront payment.", votes: generateRandomVotes() },
        { id: 'vc_opt4', text: "Get a lawyer to review the contract.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("19 days, 20 hours, 2 minutes")).toISOString(),
    createdAt: generateCreatedAt("19 days, 20 hours, 2 minutes"),
  },
  {
    id: 'poll_madison_kids',
    creator: findUser('Madison Perez'),
    question: "My parents are pressuring me to have kids. Do I give in or stand my ground on my childfree choice?",
    imageUrls: ['https://placehold.co/600x400.png?text=Kids'], 
    options: [
        { id: 'mk_opt1', text: "It's your life, stand your ground!", votes: generateRandomVotes() },
        { id: 'mk_opt2', text: "Consider it, maybe you'll change your mind.", votes: generateRandomVotes() },
        { id: 'mk_opt3', text: "Compromise: get a pet instead.", votes: generateRandomVotes() },
        { id: 'mk_opt4', text: "Tell them you're infertile (jk... mostly).", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("30 days, 2 hours, 18 minutes")).toISOString(),
    createdAt: generateCreatedAt("30 days, 2 hours, 18 minutes"),
  },
  {
    id: 'poll_luna_splurge',
    creator: findUser('Luna Walker'),
    question: "Should I splurge on this designer item I've been eyeing, or save that money for something more practical?",
    imageUrls: ['https://placehold.co/600x400.png?text=Splurge'], 
    options: [
        { id: 'ls_opt1', text: "Treat yourself! You deserve it.", votes: generateRandomVotes(), affiliateLink: 'https://example.com/designer-bags' },
        { id: 'ls_opt2', text: "Save it, practicality wins.", votes: generateRandomVotes() },
        { id: 'ls_opt3', text: "Set a budget and stick to it.", votes: generateRandomVotes() },
        { id: 'ls_opt4', text: "Buy a high-quality dupe.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("8 hours, 44 minutes")).toISOString(),
    createdAt: generateCreatedAt("8 hours, 44 minutes"),
  },
  {
    id: 'poll_grace_job',
    creator: findUser('Grace Hall'),
    question: "I received a job offer but I'm also waiting to hear back from my dream company. Do I accept or hold out?",
    imageUrls: ['https://placehold.co/600x400.png?text=JobOffer'], 
    options: [
        { id: 'gj_opt1', text: "Accept the offer, a bird in hand...", votes: generateRandomVotes() },
        { id: 'gj_opt2', text: "Hold out for the dream job, it's worth the risk.", votes: generateRandomVotes() },
        { id: 'gj_opt3', text: "Ask for an extension on the offer.", votes: generateRandomVotes() },
        { id: 'gj_opt4', text: "Negotiate for a later start date.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("14 days, 15 hours, 7 minutes")).toISOString(),
    createdAt: generateCreatedAt("14 days, 15 hours, 7 minutes"),
  },
  {
    id: 'poll_natalie_hair',
    creator: findUser('Natalie Allen'),
    question: "Should I embrace my natural hair texture, or continue with my elaborate styling routine?",
    imageUrls: ['https://placehold.co/600x400.png?text=NaturalHair'], 
    options: [
        { id: 'nh_opt1', text: "Embrace the natural! Freedom awaits.", votes: generateRandomVotes(), affiliateLink: 'https://example.com/natural-hair-products' },
        { id: 'nh_opt2', text: "Stick to the routine, it's your signature.", votes: generateRandomVotes() },
        { id: 'nh_opt3', text: "Mix it up: natural some days, styled others.", votes: generateRandomVotes() },
        { id: 'nh_opt4', text: "Consult a stylist for low-maintenance options.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 days, 23 hours, 29 minutes")).toISOString(),
    createdAt: generateCreatedAt("6 days, 23 hours, 29 minutes"),
  },
  {
    id: 'poll_sarah_lie',
    creator: findUser('Sarah Young'),
    question: "Is it okay to lie to spare someone's feelings, or is brutal honesty always the best policy?",
    imageUrls: ['https://placehold.co/600x400.png?text=Honesty'], 
    options: [
        { id: 'sl_opt1', text: "Lie gently, kindness first.", votes: generateRandomVotes() },
        { id: 'sl_opt2', text: "Honesty, even if it hurts short-term.", votes: generateRandomVotes() },
        { id: 'sl_opt3', text: "It depends on the severity of the lie/truth.", votes: generateRandomVotes() },
        { id: 'sl_opt4', text: "Use white lies sparingly.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 18 hours, 3 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 days, 18 hours, 3 minutes"),
  },
  {
    id: 'poll_alice_creative', 
    creator: findUser('Alice Wonderland'),
    question: "My creative project is stalled. Do I push through the block, or take a break and come back later?",
    imageUrls: ['https://placehold.co/600x400.png?text=CreativeBlock'], 
    options: [
        { id: 'acr_opt1', text: "Push through! Discipline is key.", votes: generateRandomVotes() },
        { id: 'acr_opt2', text: "Take a break, recharge your creativity.", votes: generateRandomVotes() },
        { id: 'acr_opt3', text: "Seek inspiration from others.", votes: generateRandomVotes() },
        { id: 'acr_opt4', text: "Collaborate with someone new.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("11 hours, 52 minutes")).toISOString(),
    createdAt: generateCreatedAt("11 hours, 52 minutes"),
  },
  {
    id: 'poll_bella_spill',
    creator: findUser('Bella King'),
    question: "I accidentally spilled coffee on my friend's expensive rug. Do I confess immediately and offer to clean/pay, or try to clean it secretly?",
    imageUrls: ['https://placehold.co/600x400.png?text=Spill'], 
    options: [
        { id: 'bs_opt1', text: "Confess immediately, honesty is best.", votes: generateRandomVotes() },
        { id: 'bs_opt2', text: "Clean it secretly, hope they don't notice.", votes: generateRandomVotes() },
        { id: 'bs_opt3', text: "Blame the dog.", votes: generateRandomVotes() },
        { id: 'bs_opt4', text: "Offer to buy them a new rug.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("5 days, 10 hours, 1 minute")).toISOString(),
    createdAt: generateCreatedAt("5 days, 10 hours, 1 minute"),
  },
  {
    id: 'poll_chloe_party',
    creator: findUser('Chloe Wright'),
    question: "Is it ever okay to show up late to a party, or is punctuality always king?",
    imageUrls: ['https://placehold.co/600x400.png?text=PartyTime'], 
    options: [
        { id: 'cp_opt1', text: "Fashionably late is a vibe.", votes: generateRandomVotes() },
        { id: 'cp_opt2', text: "Always be on time, it's respectful.", votes: generateRandomVotes() },
        { id: 'cp_opt3', text: "Only if you have a good excuse.", votes: generateRandomVotes() },
        { id: 'cp_opt4', text: "Show up early to help set up!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("20 days, 7 hours, 24 minutes")).toISOString(),
    createdAt: generateCreatedAt("20 days, 7 hours, 24 minutes"),
  },
  {
    id: 'poll_daisy_dating',
    creator: findUser('Daisy Scott'),
    question: "Should I tell my parents I'm dating someone they won't approve of, or keep it a secret?",
    imageUrls: ['https://placehold.co/600x400.png?text=SecretLove'], 
    options: [
        { id: 'dd_opt1', text: "Tell them, honesty is the best policy.", votes: generateRandomVotes() },
        { id: 'dd_opt2', text: "Keep it secret to avoid conflict.", votes: generateRandomVotes() },
        { id: 'dd_opt3', text: "Introduce them gradually.", votes: generateRandomVotes() },
        { id: 'dd_opt4', text: "Wait until it's serious.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 days, 12 hours, 13 minutes")).toISOString(),
    createdAt: generateCreatedAt("3 days, 12 hours, 13 minutes"),
  },
  {
    id: 'poll_emily_coffeeshop_save', // Differentiated ID from 'poll_emily_coffeeshop'
    creator: findUser('Emily Green'),
    question: "My favorite local coffee shop is closing. Do I try to rally the community to save it, or mourn its loss quietly?",
    imageUrls: ['https://placehold.co/600x400.png?text=SaveCoffee'], 
    options: [
        { id: 'ecs_opt1_2', text: "Rally the troops! Fight for your coffee!", votes: generateRandomVotes() },
        { id: 'ecs_opt2_2', text: "Mourn quietly, some things aren't meant to last.", votes: generateRandomVotes() },
        { id: 'ecs_opt3_2', text: "Support other local businesses.", votes: generateRandomVotes() },
        { id: 'ecs_opt4_2', text: "Start your own coffee shop.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("24 days, 16 hours, 39 minutes")).toISOString(),
    createdAt: generateCreatedAt("24 days, 16 hours, 39 minutes"),
  },
  {
    id: 'poll_fiona_language_skill', // Differentiated ID
    creator: findUser('Fiona Adams'),
    question: "Should I learn a new language, or focus on becoming an expert in a skill I already have?",
    imageUrls: ['https://placehold.co/600x400.png?text=LearnSkill'], 
    options: [
        { id: 'fl_opt1_2', text: "New language! Expand your horizons.", votes: generateRandomVotes() },
        { id: 'fl_opt2_2', text: "Master current skills, depth over breadth.", votes: generateRandomVotes() },
        { id: 'fl_opt3_2', text: "Do both, slowly but surely.", votes: generateRandomVotes() },
        { id: 'fl_opt4_2', text: "Learn a language relevant to your existing skill.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("16 hours, 5 minutes")).toISOString(),
    createdAt: generateCreatedAt("16 hours, 5 minutes"),
  },
  {
    id: 'poll_grace_unfollow_friend', // Differentiated ID
    creator: findUser('Grace Hall'), 
    question: "Is it okay to unfollow a friend on social media if their content is consistently annoying/negative?",
    imageUrls: ['https://placehold.co/600x400.png?text=Unfollow'], 
    options: [
        { id: 'gu_opt1', text: "Yes, protect your peace.", votes: generateRandomVotes() },
        { id: 'gu_opt2', text: "No, it's rude and childish.", votes: generateRandomVotes() },
        { id: 'gu_opt3', text: "Mute them instead of unfollowing.", votes: generateRandomVotes() },
        { id: 'gu_opt4', text: "Talk to them about it first.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("9 days, 22 hours, 47 minutes")).toISOString(),
    createdAt: generateCreatedAt("9 days, 22 hours, 47 minutes"),
  },
  {
    id: 'poll_hannah_pet_choice', // Differentiated ID
    creator: findUser('Hannah Baker'),
    question: "I'm torn between getting a dog or a cat. Help me decide, fur parents!",
    imageUrls: ['https://placehold.co/600x400.png?text=DogVsCat'], 
    options: [
        { id: 'hp_opt1_choice', text: "Team Dog! Loyalty and adventure.", votes: generateRandomVotes() },
        { id: 'hp_opt2_choice', text: "Team Cat! Independent and cuddly.", votes: generateRandomVotes() },
        { id: 'hp_opt3_choice', text: "Get both if you can handle it!", votes: generateRandomVotes() },
        { id: 'hp_opt4_choice', text: "Neither, get a fish.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 day, 7 hours, 28 minutes")).toISOString(),
    createdAt: generateCreatedAt("1 day, 7 hours, 28 minutes"),
  },
  {
    id: 'poll_ivy_volunteer_focus', // Differentiated ID
    creator: findUser('Ivy Nelson'),
    question: "Should I volunteer my time to a cause I believe in, or focus solely on my own self-improvement right now?",
    imageUrls: ['https://placehold.co/600x400.png?text=Volunteer'], 
    options: [
        { id: 'iv_opt1_focus', text: "Volunteer! Give back to the community.", votes: generateRandomVotes() },
        { id: 'iv_opt2_focus', text: "Focus on self-improvement first, then volunteer.", votes: generateRandomVotes() },
        { id: 'iv_opt3_focus', text: "Do a little of both.", votes: generateRandomVotes() },
        { id: 'iv_opt4_focus', text: "Join a group that combines both!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("17 days, 13 hours, 40 minutes")).toISOString(),
    createdAt: generateCreatedAt("17 days, 13 hours, 40 minutes"),
  },
  {
    id: 'poll_jessie_family_ties', // Differentiated ID
    creator: findUser('Jessie Carter'),
    question: "Should I cut ties with a toxic family member, or try to maintain a relationship for the sake of 'family'?",
    imageUrls: ['https://placehold.co/600x400.png?text=ToxicFamily'], 
    options: [
        { id: 'jf_opt1_ties', text: "Cut ties, your mental health comes first.", votes: generateRandomVotes() },
        { id: 'jf_opt2_ties', text: "Maintain, family is important no matter what.", votes: generateRandomVotes() },
        { id: 'jf_opt3_ties', text: "Set strict boundaries, limit contact.", votes: generateRandomVotes() },
        { id: 'jf_opt4_ties', text: "Seek family counseling.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 days, 2 hours, 53 minutes")).toISOString(),
    createdAt: generateCreatedAt("7 days, 2 hours, 53 minutes"),
  },
  {
    id: 'poll_kayla_parties_choice', // Differentiated ID
    creator: findUser('Kayla Mitchell'),
    question: "I'm invited to two parties on the same night. Which one do I go to: the wild one with all my party friends, or the chill one with deep conversations?",
    imageUrls: ['https://placehold.co/600x400.png?text=TwoParties'], 
    options: [
        { id: 'kp_opt1_choice', text: "Wild party! YOLO!", votes: generateRandomVotes() },
        { id: 'kp_opt2_choice', text: "Chill party, for the soul.", votes: generateRandomVotes() },
        { id: 'kp_opt3_choice', text: "Go to both, make a grand entrance at each.", votes: generateRandomVotes() },
        { id: 'kp_opt4_choice', text: "Flip a coin.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("27 days, 19 hours, 16 minutes")).toISOString(),
    createdAt: generateCreatedAt("27 days, 19 hours, 16 minutes"),
  },
  {
    id: 'poll_lily_instrument_learn', // Differentiated ID
    creator: findUser('Lily Roberts'),
    question: "Should I learn to play a musical instrument, even if I have no natural talent?",
    imageUrls: ['https://placehold.co/600x400.png?text=Music'], 
    options: [
        { id: 'li_opt1_learn', text: "Go for it! Passion over talent.", votes: generateRandomVotes() },
        { id: 'li_opt2_learn', text: "No, focus on what you're good at.", votes: generateRandomVotes() },
        { id: 'li_opt3_learn', text: "Start with something easy like ukulele.", votes: generateRandomVotes() },
        { id: 'li_opt4_learn', text: "Just listen to music, don't try to make it.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("18 hours, 36 minutes")).toISOString(),
    createdAt: generateCreatedAt("18 hours, 36 minutes"),
  },
  {
    id: 'poll_mia_talk_self_aloud', // Differentiated ID
    creator: findUser('Mia Jones'), 
    question: "Is it okay to talk to yourself out loud when you're alone? Asking for a friend... who is me.",
    imageUrls: ['https://placehold.co/600x400.png?text=TalkToSelf'], 
    options: [
        { id: 'mts_opt1_aloud', text: "Totally normal! It helps organize thoughts.", votes: generateRandomVotes() },
        { id: 'mts_opt2_aloud', text: "Only if you don't answer yourself back.", votes: generateRandomVotes() },
        { id: 'mts_opt3_aloud', text: "Maybe get a therapist.", votes: generateRandomVotes() },
        { id: 'mts_opt4_aloud', text: "Only if it's in a foreign language.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("10 days, 14 hours, 49 minutes")).toISOString(),
    createdAt: generateCreatedAt("10 days, 14 hours, 49 minutes"),
  },
  {
    id: 'poll_nora_book_club_join', // Differentiated ID
    creator: findUser('Nora Phillips'),
    question: "Should I join a book club even though I barely read? I want to be more cultured.",
    imageUrls: ['https://placehold.co/600x400.png?text=BookClub'], 
    options: [
        { id: 'nbc_opt1_join', text: "Join! It'll motivate you to read.", votes: generateRandomVotes() },
        { id: 'nbc_opt2_join', text: "No, don't pretend to be someone you're not.", votes: generateRandomVotes() },
        { id: 'nbc_opt3_join', text: "Start with audiobooks.", votes: generateRandomVotes() },
        { id: 'nbc_opt4_join', text: "Just attend the social events.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("4 days, 1 hour, 22 minutes")).toISOString(),
    createdAt: generateCreatedAt("4 days, 1 hour, 22 minutes"),
  },
  {
    id: 'poll_olivia_travel_world_plan', // Differentiated ID
    creator: findUser('Olivia Rodriguez'), 
    question: "My dream is to travel the world. Do I save every penny, or take out a loan and go now?",
    imageUrls: ['https://placehold.co/600x400.png?text=WorldTravel'], 
    options: [
        { id: 'otw_opt1_plan', text: "Save every penny, travel debt-free.", votes: generateRandomVotes() },
        { id: 'otw_opt2_plan', text: "Go now! Life is short.", votes: generateRandomVotes() },
        { id: 'otw_opt3_plan', text: "Do a mix: save some, borrow a little.", votes: generateRandomVotes() },
        { id: 'otw_opt4_plan', text: "Find remote work and travel while working.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("29 days, 21 hours, 5 minutes")).toISOString(),
    createdAt: generateCreatedAt("29 days, 21 hours, 5 minutes"),
  },
  {
    id: 'poll_penny_pajamas_wfh', // Differentiated ID
    creator: findUser('Penny Campbell'),
    question: "Is it acceptable to wear pajamas all day if you're working from home and have no video calls?",
    imageUrls: ['https://placehold.co/600x400.png?text=WFHPajamas'], 
    options: [
        { id: 'pp_opt1_wfh', text: "Absolutely, peak WFH comfort!", votes: generateRandomVotes() },
        { id: 'pp_opt2_wfh', text: "No, get dressed, it boosts productivity.", votes: generateRandomVotes() },
        { id: 'pp_opt3_wfh', text: "Only if they're stylish pajamas.", votes: generateRandomVotes() },
        { id: 'pp_opt4_wfh', text: "It's a slippery slope to never changing.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 day, 16 hours, 30 minutes")).toISOString(),
    createdAt: generateCreatedAt("1 day, 16 hours, 30 minutes"),
  },
  {
    id: 'poll_quinn_cooking_skills', // Differentiated ID
    creator: findUser('Quinn Evans'),
    question: "Should I learn to cook elaborate meals, or stick to my trusty microwave dinners?",
    imageUrls: ['https://placehold.co/600x400.png?text=CookingSkills'], 
    options: [
        { id: 'qc_opt1_skills', text: "Learn to cook! It's a life skill.", votes: generateRandomVotes() },
        { id: 'qc_opt2_skills', text: "Microwave all the way, efficiency!", votes: generateRandomVotes() },
        { id: 'qc_opt3_skills', text: "Start with simple recipes, then level up.", votes: generateRandomVotes() },
        { id: 'qc_opt4_skills', text: "Order takeout!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("13 days, 10 hours, 58 minutes")).toISOString(),
    createdAt: generateCreatedAt("13 days, 10 hours, 58 minutes"),
  },
  {
    id: 'poll_ruby_move_in_decision', // Differentiated ID
    creator: findUser('Ruby Edwards'),
    question: "My significant other wants to move in together, but I love my personal space. Do I agree or hit the brakes?",
    imageUrls: ['https://placehold.co/600x400.png?text=MoveIn'], 
    options: [
        { id: 'rmi_opt1_decision', text: "Agree, it's the next step!", votes: generateRandomVotes() },
        { id: 'rmi_opt2_decision', text: "Hit the brakes, personal space is vital.", votes: generateRandomVotes() },
        { id: 'rmi_opt3_decision', text: "Suggest a trial period.", votes: generateRandomVotes() },
        { id: 'rmi_opt4_decision', text: "Find a bigger place with separate zones.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("8 days, 14 hours, 45 minutes")).toISOString(),
    createdAt: generateCreatedAt("8 days, 14 hours, 45 minutes"),
  },
  {
    id: 'poll_sophia_organic_choice', // Differentiated ID
    creator: findUser('Sophia Miller'), 
    question: "Is it worth buying organic food, or is it just a marketing gimmick?",
    imageUrls: ['https://placehold.co/600x400.png?text=OrganicFood'], 
    options: [
        { id: 'so_opt1_choice', text: "Definitely worth it for health and environment!", votes: generateRandomVotes() },
        { id: 'so_opt2_choice', text: "Marketing gimmick, save your money.", votes: generateRandomVotes() },
        { id: 'so_opt3_choice', text: "Some things yes, some things no (Dirty Dozen/Clean Fifteen).", votes: generateRandomVotes() },
        { id: 'so_opt4_choice', text: "Grow your own!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("23 days, 20 hours, 17 minutes")).toISOString(),
    createdAt: generateCreatedAt("23 days, 20 hours, 17 minutes"),
  },
  {
    id: 'poll_tina_pet_landlord_issue', // Differentiated ID
    creator: findUser('Tina Collins'),
    question: "Should I get a pet without telling my landlord, and hope they don't find out?",
    imageUrls: ['https://placehold.co/600x400.png?text=SecretPet'], 
    options: [
        { id: 'tpl_opt1_issue', text: "No! Get permission first, avoid eviction.", votes: generateRandomVotes() },
        { id: 'tpl_opt2_issue', text: "Yes, easier to ask forgiveness than permission.", votes: generateRandomVotes() },
        { id: 'tpl_opt3_issue', text: "Find a pet-friendly place.", votes: generateRandomVotes() },
        { id: 'tpl_opt4_issue', text: "Get a very quiet pet.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 hour, 34 minutes")).toISOString(),
    createdAt: generateCreatedAt("1 hour, 34 minutes"),
  },
  {
    id: 'poll_ursula_vows_renewal', // Differentiated ID
    creator: findUser('Ursula Stewart'),
    question: "My partner wants to renew our vows on our 10th anniversary, but I feel like we're just going through the motions. Do I go along with it or be honest?",
    imageUrls: ['https://placehold.co/600x400.png?text=RenewVows'], 
    options: [
        { id: 'uv_opt1_renewal', text: "Go along, it might rekindle something.", votes: generateRandomVotes() },
        { id: 'uv_opt2_renewal', text: "Be honest, address the underlying issues.", votes: generateRandomVotes() },
        { id: 'uv_opt3_renewal', text: "Suggest a different way to celebrate.", votes: generateRandomVotes() },
        { id: 'uv_opt4_renewal', text: "Surprise them with couples counseling instead.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("16 days, 22 hours, 5 minutes")).toISOString(),
    createdAt: generateCreatedAt("16 days, 22 hours, 5 minutes"),
  },
  {
    id: 'poll_violet_minimalism_life', // Differentiated ID
    creator: findUser('Violet Morris'),
    question: "Should I embrace minimalism and declutter my entire life, or cling to my beloved possessions?",
    imageUrls: ['https://placehold.co/600x400.png?text=Minimalism'], 
    options: [
        { id: 'vm_opt1_life', text: "Declutter! Freedom through less stuff.", votes: generateRandomVotes() },
        { id: 'vm_opt2_life', text: "Cling! Memories are priceless.", votes: generateRandomVotes() },
        { id: 'vm_opt3_life', text: "Start small, declutter one room at a time.", votes: generateRandomVotes() },
        { id: 'vm_opt4_life', text: "Only keep things that 'spark joy'.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 days, 13 hours, 41 minutes")).toISOString(),
    createdAt: generateCreatedAt("6 days, 13 hours, 41 minutes"),
  },
  {
    id: 'poll_wendy_texts_privacy', // Differentiated ID
    creator: findUser('Wendy Rogers'),
    question: "Is it okay to secretly read my partner's text messages if I suspect they're hiding something?",
    imageUrls: ['https://placehold.co/600x400.png?text=Privacy'], 
    options: [
        { id: 'wt_opt1_privacy', text: "No! Respect their privacy.", votes: generateRandomVotes() },
        { id: 'wt_opt2_privacy', text: "Yes, if your suspicions are strong.", votes: generateRandomVotes() },
        { id: 'wt_opt3_privacy', text: "Talk to them directly first.", votes: generateRandomVotes() },
        { id: 'wt_opt4_privacy', text: "Hire a private investigator.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 19 hours, 10 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 days, 19 hours, 10 minutes"),
  },
  {
    id: 'poll_zara_tattoo_name', // Differentiated ID
    creator: findUser('Zara Reed'),
    question: "Should I get a tattoo of my current partner's name? Everyone says it's bad luck, but I feel it's true love.",
    imageUrls: ['https://placehold.co/600x400.png?text=NameTattoo'], 
    options: [
        { id: 'zt_opt1_name', text: "No! Bad luck and bad ideas.", votes: generateRandomVotes() },
        { id: 'zt_opt2_name', text: "Yes! Declare your love boldly.", votes: generateRandomVotes() },
        { id: 'zt_opt3_name', text: "Get something symbolic instead.", votes: generateRandomVotes() },
        { id: 'zt_opt4_name', text: "Wait until after you're married.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("9 hours, 56 minutes")).toISOString(),
    createdAt: generateCreatedAt("9 hours, 56 minutes"),
  },
  {
    id: 'poll_zoe_hair_color_change', // Differentiated ID
    creator: findUser('Zoe Cook'),
    question: "I'm thinking about dying my hair a crazy, unnatural color. Bold fashion statement or future regret?",
    imageUrls: ['https://placehold.co/600x400.png?text=HairDye'], 
    options: [
        { id: 'zhc_opt1_change', text: "Bold statement! Express yourself.", votes: generateRandomVotes() },
        { id: 'zhc_opt2_change', text: "Future regret, stick to natural.", votes: generateRandomVotes() },
        { id: 'zhc_opt3_change', text: "Try a temporary color first.", votes: generateRandomVotes() },
        { id: 'zhc_opt4_change', text: "Consult a colorist for best results.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("5 days, 4 hours, 23 minutes")).toISOString(),
    createdAt: generateCreatedAt("5 days, 4 hours, 23 minutes"),
  },
  {
    id: 'poll_ethan_career_switch_40s', // Differentiated ID
    creator: findUser('Ethan Morgan'),
    question: "Should I go back to school to switch careers in my 40s? It feels like now or never.",
    imageUrls: ['https://placehold.co/600x400.png?text=CareerSwitch'], 
    options: [
        { id: 'ecs_opt1_40s', text: "Now or never! Invest in your future.", votes: generateRandomVotes() },
        { id: 'ecs_opt2_40s', text: "Too late, focus on retirement.", votes: generateRandomVotes() },
        { id: 'ecs_opt3_40s', text: "Part-time study, gradual transition.", votes: generateRandomVotes() },
        { id: 'ecs_opt4_40s', text: "Explore certifications instead of a full degree.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("20 days, 11 hours, 57 minutes")).toISOString(),
    createdAt: generateCreatedAt("20 days, 11 hours, 57 minutes"),
  },
  {
    id: 'poll_frank_laser_pet_play', // Differentiated ID
    creator: findUser('Frank Bell'),
    question: "My pet is obsessed with chasing laser pointers. Is it fun for them, or secretly frustrating because they can never 'catch' it?",
    imageUrls: ['https://placehold.co/600x400.png?text=LaserPointer'], 
    options: [
        { id: 'fl_opt1_play', text: "Fun and good exercise!", votes: generateRandomVotes() },
        { id: 'fl_opt2_play', text: "Frustrating, avoid them.", votes: generateRandomVotes() },
        { id: 'fl_opt3_play', text: "Use it as a warm-up, then a real toy.", votes: generateRandomVotes() },
        { id: 'fl_opt4_play', text: "Only if there's a tangible reward at the end.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 days, 19 hours, 32 minutes")).toISOString(),
    createdAt: generateCreatedAt("3 days, 19 hours, 32 minutes"),
  },
  {
    id: 'poll_gary_resume_truth', // Differentiated ID
    creator: findUser('Gary Murphy'),
    question: "Is it ever okay to lie on a resume to get a job, then learn the skills quickly?",
    imageUrls: ['https://placehold.co/600x400.png?text=ResumeLie'], 
    options: [
        { id: 'gr_opt1_truth', text: "No, it's unethical and you'll get caught.", votes: generateRandomVotes() },
        { id: 'gr_opt2_truth', text: "Yes, if you're confident you can learn fast.", votes: generateRandomVotes() },
        { id: 'gr_opt3_truth', text: "Only if it's a minor exaggeration.", votes: generateRandomVotes() },
        { id: 'gr_opt4_truth', text: "Better to be honest and highlight transferable skills.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("25 days, 6 hours, 8 minutes")).toISOString(),
    createdAt: generateCreatedAt("25 days, 6 hours, 8 minutes"),
  },
  {
    id: 'poll_henry_polyamory_explore', // Differentiated ID
    creator: findUser('Henry Bailey'),
    question: "Should I try polyamory with my long-term partner? It sounds exciting but also terrifying.",
    imageUrls: ['https://placehold.co/600x400.png?text=Polyamory'], 
    options: [
        { id: 'hp_opt1_poly_explore', text: "Explore it, but with clear boundaries and communication.", votes: generateRandomVotes() },
        { id: 'hp_opt2_poly_explore', text: "No, stick to monogamy.", votes: generateRandomVotes() },
        { id: 'hp_opt3_poly_explore', text: "Suggest an open relationship first.", votes: generateRandomVotes() },
        { id: 'hp_opt4_poly_explore', text: "Seek couples therapy to discuss it.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 hour, 47 minutes")).toISOString(),
    createdAt: generateCreatedAt("1 hour, 47 minutes"),
  },
  {
    id: 'poll_ian_fiance_dislike', // Differentiated ID
    creator: findUser('Ian Cooper'),
    question: "My best friend just got engaged, but I secretly hate their fiancé. Do I fake enthusiasm or express my concerns?",
    imageUrls: ['https://placehold.co/600x400.png?text=HateFiance'], 
    options: [
        { id: 'if_opt1_dislike', text: "Fake enthusiasm, it's their happiness.", votes: generateRandomVotes() },
        { id: 'if_opt2_dislike', text: "Express concerns gently and privately.", votes: generateRandomVotes() },
        { id: 'if_opt3_dislike', text: "Distance yourself from the friendship.", votes: generateRandomVotes() },
        { id: 'if_opt4_dislike', text: "Get to know the fiancé better.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("16 days, 23 hours, 12 minutes")).toISOString(),
    createdAt: generateCreatedAt("16 days, 23 hours, 12 minutes"),
  },
  {
    id: 'poll_jack_vcard_decision', // Differentiated ID
    creator: findUser('Jack Howard'),
    question: "Finna lose my V-card, besties. To wrap it or not to wrap it? Low-key kinda nervous but also wanna YOLO. What's the tea?",
    imageUrls: ['https://placehold.co/600x400.png?text=VCardAgain'], 
    options: [
        { id: 'jva_opt1_decision', text: "Always wrap it, no cap. Safety first!", votes: generateRandomVotes() },
        { id: 'jva_opt2_decision', text: "YOLO, but smart YOLO. Get tested, then maybe raw dog it.", votes: generateRandomVotes() },
        { id: 'jva_opt3_decision', text: "Nah, pull out game strong. Trust the vibes.", votes: generateRandomVotes() },
        { id: 'jva_opt4_decision', text: "Do both! Wrap it then pull out. Double protection.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 hours, 38 minutes")).toISOString(),
    createdAt: generateCreatedAt("6 hours, 38 minutes"),
  },
  {
    id: 'poll_justin_beer_game', // Differentiated ID
    creator: findUser('Justin Kelly'),
    question: "Wife just gave me the side-eye for another beer during the game. My team's down, and I need this. Do I risk the wrath or just hydrate?",
    imageUrls: ['https://placehold.co/600x400.png?text=AnotherBeer'], 
    options: [
        { id: 'jb_opt1_game', text: "Go for it! It's game day, you earned it.", votes: generateRandomVotes() },
        { id: 'jb_opt2_game', text: "Nah, happy wife, happy life. Stick to water.", votes: generateRandomVotes() },
        { id: 'jb_opt3_game', text: "Sneak one. She'll never know.", votes: generateRandomVotes() },
        { id: 'jb_opt4_game', text: "Compromise: One more, then you owe her a back rub.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("11 days, 15 hours, 3 minutes")).toISOString(),
    createdAt: generateCreatedAt("11 days, 15 hours, 3 minutes"),
  },
  {
    id: 'poll_david_boss_credit_issue', // Differentiated ID
    creator: findUser('David Kelly'),
    question: "My boss is taking credit for my ideas. Do I speak up and risk my job, or let them shine and fume in silence?",
    imageUrls: ['https://placehold.co/600x400.png?text=BossCredit'], 
    options: [
        { id: 'db_opt1_issue', text: "Speak up! Your work deserves recognition.", votes: generateRandomVotes() },
        { id: 'db_opt2_issue', text: "Suck it up, play the long game.", votes: generateRandomVotes() },
        { id: 'db_opt3_issue', text: "Document everything and build a case.", votes: generateRandomVotes() },
        { id: 'db_opt4_issue', text: "Start looking for a new job.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("5 days, 1 hour, 27 minutes")).toISOString(),
    createdAt: generateCreatedAt("5 days, 1 hour, 27 minutes"),
  },
  {
    id: 'poll_michael_marriage_stale_issue', // Differentiated ID
    creator: findUser('Michael Sanders'),
    question: "After 25 years, my marriage feels like a forgotten Netflix subscription. Do I finally cancel it or try to find a new series to binge together?",
    imageUrls: ['https://placehold.co/600x400.png?text=MarriageStale'], 
    options: [
        { id: 'mm_opt1_issue', text: "It's time to explore new horizons. You deserve happiness.", votes: generateRandomVotes() },
        { id: 'mm_opt2_issue', text: "Try couples counseling. You've invested too much to give up easily.", votes: generateRandomVotes() },
        { id: 'mm_opt3_issue', text: "Take a break, assess, then decide. No rushed decisions.", votes: generateRandomVotes() },
        { id: 'mm_opt4_issue', text: "Rekindle the spark with a grand gesture.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("22 days, 18 hours, 40 minutes")).toISOString(),
    createdAt: generateCreatedAt("22 days, 18 hours, 40 minutes"),
  },
  {
    id: 'poll_james_snacks_health', // Differentiated ID
    creator: findUser('James Price'),
    question: "My doctor said I should cut down on late-night snacks. But how am I supposed to watch my shows without my chips and salsa? Give me the hard truth.",
    imageUrls: ['https://placehold.co/600x400.png?text=LateSnacks'], 
    options: [
        { id: 'js_opt1_health', text: "Swap snacks for fruit/veggies. Healthy crunch!", votes: generateRandomVotes() },
        { id: 'js_opt2_health', text: "Limit it to once a week. Treat yourself responsibly.", votes: generateRandomVotes() },
        { id: 'js_opt3_health', text: "Eat dinner later. No need for snacks if you're full.", votes: generateRandomVotes() },
        { id: 'js_opt4_health', text: "Ignore the doctor, live a little!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("13 hours, 2 minutes")).toISOString(),
    createdAt: generateCreatedAt("13 hours, 2 minutes"),
  },
  {
    id: 'poll_john_vacation_choice', // Differentiated ID
    creator: findUser('John Bennett'),
    question: "Dream vacation: Backpacking through Europe on a shoestring budget, or luxury resort in the Maldives? My wallet says one, my soul says the other.",
    imageUrls: ['https://placehold.co/600x400.png?text=VacationDream'], 
    options: [
        { id: 'jv_opt1_choice', text: "Embrace the adventure, Europe!", votes: generateRandomVotes() },
        { id: 'jv_opt2_choice', text: "Maldives, treat yourself!", votes: generateRandomVotes() },
        { id: 'jv_opt3_choice', text: "Save up and do both later.", votes: generateRandomVotes() },
        { id: 'jv_opt4_choice', text: "Compromise: A fancy staycation.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("18 days, 9 hours, 59 minutes")).toISOString(),
    createdAt: generateCreatedAt("18 days, 9 hours, 59 minutes"),
  },
  {
    id: 'poll_robert_llama_passion', // Differentiated ID
    creator: findUser('Robert Wood'),
    question: "Should I quit my stable but soul-crushing job to pursue my passion for llama grooming? My parents think I'm nuts.",
    imageUrls: ['https://placehold.co/600x400.png?text=LlamaPassion'], 
    options: [
        { id: 'rl_opt1_passion', text: "Follow your dreams, llamas await!", votes: generateRandomVotes() },
        { id: 'rl_opt2_passion', text: "Stay put, security is key.", votes: generateRandomVotes() },
        { id: 'rl_opt3_passion', text: "Part-time llama grooming first, then decide.", votes: generateRandomVotes() },
        { id: 'rl_opt4_passion', text: "Find a new stable job that doesn't crush your soul.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 days, 20 hours, 15 minutes")).toISOString(),
    createdAt: generateCreatedAt("6 days, 20 hours, 15 minutes"),
  },
  {
    id: 'poll_ava_ex_wedding_invite', // Differentiated ID
    creator: findUser('Ava Williams'), 
    question: "My ex just invited me to their wedding. Do I go and be the bigger person, or politely decline and avoid the drama?",
    imageUrls: ['https://placehold.co/600x400.png?text=ExWedding'], 
    options: [
        { id: 'aew_opt1_invite', text: "Go, show them you're thriving!", votes: generateRandomVotes() },
        { id: 'aew_opt2_invite', text: "Decline, spare yourself the awkwardness.", votes: generateRandomVotes() },
        { id: 'aew_opt3_invite', text: "Send a nice gift, but don't attend.", votes: generateRandomVotes() },
        { id: 'aew_opt4_invite', text: "Bring a hotter date.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 5 hours, 42 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 days, 5 hours, 42 minutes"),
  },
  {
    id: 'poll_lily_white_dress_fashion', // Differentiated ID
    creator: findUser('Lily Roberts'), 
    question: "Is it okay to wear white after Labor Day? My grandma would have a fit, but it's such a cute outfit!",
    imageUrls: ['https://placehold.co/600x400.png?text=WhiteDress'], 
    options: [
        { id: 'lwd_opt1_fashion', text: "Fashion rules are meant to be broken!", votes: generateRandomVotes() },
        { id: 'lwd_opt2_fashion', text: "Stick to tradition, respect your elders.", votes: generateRandomVotes() },
        { id: 'lwd_opt3_fashion', text: "Who cares? Wear what makes you happy!", votes: generateRandomVotes() },
        { id: 'lwd_opt4_fashion', text: "Only if it's a winter white.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("21 days, 14 hours, 36 minutes")).toISOString(),
    createdAt: generateCreatedAt("21 days, 14 hours, 36 minutes"),
  },
  {
    id: 'poll_emily_cat_counter_naughty', // Differentiated ID
    creator: findUser('Emily Green'), 
    question: "My cat keeps knocking things off the counter just to get attention. Do I ignore her, or teach her a lesson (humanely, of course)?",
    imageUrls: ['https://placehold.co/600x400.png?text=CatShenanigans'], 
    options: [
        { id: 'ecc_opt1_naughty', text: "Ignore the behavior, she's craving attention.", votes: generateRandomVotes() },
        { id: 'ecc_opt2_naughty', text: "Use positive reinforcement for good behavior.", votes: generateRandomVotes() },
        { id: 'ecc_opt3_naughty', text: "A gentle squirt bottle works wonders.", votes: generateRandomVotes() },
        { id: 'ecc_opt4_naughty', text: "Accept your fate; you live with a cat.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 day, 9 hours, 5 minutes")).toISOString(),
    createdAt: generateCreatedAt("1 day, 9 hours, 5 minutes"),
  },
  {
    id: 'poll_charlotte_wallet_found', // Differentiated ID
    creator: findUser('Charlotte Wilson'), 
    question: "I found a wallet with a huge wad of cash. Do I return it to the address inside, or 'find' a way to make it disappear?",
    imageUrls: ['https://placehold.co/600x400.png?text=FoundWallet'], 
    options: [
        { id: 'cw_opt1_found', text: "Return it immediately, it's the right thing to do.", votes: generateRandomVotes() },
        { id: 'cw_opt2_found', text: "Keep it, finders keepers!", votes: generateRandomVotes() },
        { id: 'cw_opt3_found', text: "Turn it into the police station.", votes: generateRandomVotes() },
        { id: 'cw_opt4_found', text: "Donate it to a charity in their name.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("15 days, 17 hours, 29 minutes")).toISOString(),
    createdAt: generateCreatedAt("15 days, 17 hours, 29 minutes"),
  },
  {
    id: 'poll_hannah_bathroom_reno_diy', // Differentiated ID
    creator: findUser('Hannah Baker'), 
    question: "Should I DIY my bathroom renovation and save a ton, or hire a pro and avoid a potential disaster?",
    imageUrls: ['https://placehold.co/600x400.png?text=DIYReno'], 
    options: [
        { id: 'hbr_opt1_diy', text: "DIY! You'll learn so much.", votes: generateRandomVotes() },
        { id: 'hbr_opt2_diy', text: "Hire a pro, peace of mind is priceless.", votes: generateRandomVotes() },
        { id: 'hbr_opt3_diy', text: "Start DIY, call a pro when it gets tough.", votes: generateRandomVotes() },
        { id: 'hbr_opt4_diy', text: "Watch YouTube tutorials and then decide.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 days, 16 hours, 50 minutes")).toISOString(),
    createdAt: generateCreatedAt("3 days, 16 hours, 50 minutes"),
  },
  {
    id: 'poll_sophia_toddler_cape_wear', // Differentiated ID
    creator: findUser('Sophia Miller'), 
    question: "My toddler insists on wearing their superhero cape to daycare every day. Do I let them, or make them wear 'normal' clothes?",
    imageUrls: ['https://placehold.co/600x400.png?text=ToddlerFashion'], 
    options: [
        { id: 'stc_opt1_wear', text: "Let them shine! Embrace the cape.", votes: generateRandomVotes() },
        { id: 'stc_opt2_wear', text: "Daycare has a dress code for a reason.", votes: generateRandomVotes() },
        { id: 'stc_opt3_wear', text: "Compromise: Cape for playtime only.", votes: generateRandomVotes() },
        { id: 'stc_opt4_wear', text: "Use it as a bargaining chip for good behavior.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("26 days, 22 hours, 1 minute")).toISOString(),
    createdAt: generateCreatedAt("26 days, 22 hours, 1 minute"),
  },
  {
    id: 'poll_ava_matching_tattoo_idea', // Differentiated ID
    creator: findUser('Ava Williams'), 
    question: "My partner wants to get a matching tattoo. I love them, but... forever? Should I say yes or suggest something less permanent?",
    imageUrls: ['https://placehold.co/600x400.png?text=MatchingTattoo'], 
    options: [
        { id: 'amt_opt1_idea', text: "Go for it! True love ink.", votes: generateRandomVotes() },
        { id: 'amt_opt2_idea', text: "Suggest temporary tattoos first.", votes: generateRandomVotes() },
        { id: 'amt_opt3_idea', text: "Decline gracefully, it's a big commitment.", votes: generateRandomVotes() },
        { id: 'amt_opt4_idea', text: "Get it somewhere easily hidden.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("10 hours, 11 minutes")).toISOString(),
    createdAt: generateCreatedAt("10 hours, 11 minutes"),
  },
  {
    id: 'poll_olivia_shave_head_charity', // Differentiated ID
    creator: findUser('Olivia Rodriguez'), 
    question: "Should I shave my head for charity, even though I've had long hair my whole life? It's for a great cause but also... my hair!",
    imageUrls: ['https://placehold.co/600x400.png?text=ShaveHead'], 
    options: [
        { id: 'osh_opt1_charity', text: "Do it! A bold move for a good cause.", votes: generateRandomVotes() },
        { id: 'osh_opt2_charity', text: "Donate money instead, keep the hair.", votes: generateRandomVotes() },
        { id: 'osh_opt3_charity', text: "Cut it short, but not all the way.", votes: generateRandomVotes() },
        { id: 'osh_opt4_charity', text: "Wig it out afterward!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("4 days, 18 hours, 33 minutes")).toISOString(),
    createdAt: generateCreatedAt("4 days, 18 hours, 33 minutes"),
  },
  {
    id: 'poll_sarah_dog_bark_neighbor', // Differentiated ID
    creator: findUser('Sarah Young'), 
    question: "My neighbor's dog barks constantly. Do I confront them directly, leave a polite note, or suffer in silence?",
    imageUrls: ['https://placehold.co/600x400.png?text=BarkingDog'], 
    options: [
        { id: 'sdb_opt1_neighbor', text: "Direct confrontation, but be polite.", votes: generateRandomVotes() },
        { id: 'sdb_opt2_neighbor', text: "Leave an anonymous, polite note.", votes: generateRandomVotes() },
        { id: 'sdb_opt3_neighbor', text: "Suffer, it's not worth the drama.", votes: generateRandomVotes() },
        { id: 'sdb_opt4_neighbor', text: "Offer to walk their dog.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("19 days, 1 hour, 46 minutes")).toISOString(),
    createdAt: generateCreatedAt("19 days, 1 hour, 46 minutes"),
  },
  {
    id: 'poll_emma_pineapple_pizza_debate', // Differentiated ID
    creator: findUser('Emma Davis'), 
    question: "Is pineapple on pizza an abomination or a stroke of genius? The debate rages on.",
    imageUrls: ['https://placehold.co/600x400.png?text=PineapplePizza'], 
    options: [
        { id: 'epp_opt1_debate', text: "Genius! Sweet and savory perfection.", votes: generateRandomVotes() },
        { id: 'epp_opt2_debate', text: "Abomination! Keep fruit off my pizza.", votes: generateRandomVotes() },
        { id: 'epp_opt3_debate', text: "Only if it's accompanied by ham.", votes: generateRandomVotes() },
        { id: 'epp_opt4_debate', text: "I'm neutral, but I respect the passion.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 days, 17 hours, 25 minutes")).toISOString(),
    createdAt: generateCreatedAt("7 days, 17 hours, 25 minutes"),
  },
  {
    id: 'poll_amelia_senior_dog_adopt', // Differentiated ID
    creator: findUser('Amelia Taylor'), 
    question: "I'm thinking of adopting a senior dog. Is it a noble act of kindness or setting myself up for heartbreak too soon?",
    imageUrls: ['https://placehold.co/600x400.png?text=SeniorDog'], 
    options: [
        { id: 'asd_opt1_adopt', text: "Noble and rewarding! Give them a good home.", votes: generateRandomVotes() },
        { id: 'asd_opt2_adopt', text: "Heartbreak is inevitable, consider a younger dog.", votes: generateRandomVotes() },
        { id: 'asd_opt3_adopt', text: "Focus on the present joy, not future sorrow.", votes: generateRandomVotes() },
        { id: 'asd_opt4_adopt', text: "Fosters first to see if it's a fit.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 21 hours, 54 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 days, 21 hours, 54 minutes"),
  },
  {
    id: 'poll_grace_bridesmaid_dress_issue', // Differentiated ID
    creator: findUser('Grace Hall'), 
    question: "My friend wants me to be a bridesmaid, but the dress is hideous and expensive. Do I suck it up or decline?",
    imageUrls: ['https://placehold.co/600x400.png?text=BridesmaidDress'], 
    options: [
        { id: 'gb_opt1_issue', text: "Suck it up, it's their big day!", votes: generateRandomVotes() },
        { id: 'gb_opt2_issue', text: "Decline politely, explain your reasons.", votes: generateRandomVotes() },
        { id: 'gb_opt3_issue', text: "Offer to pay for part of the dress.", votes: generateRandomVotes() },
        { id: 'gb_opt4_issue', text: "Suggest a different dress style.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("23 days, 15 hours, 3 minutes")).toISOString(),
    createdAt: generateCreatedAt("23 days, 15 hours, 3 minutes"),
  },
  {
    id: 'poll_elizabeth_regift_etiquette', // Differentiated ID
    creator: findUser('Elizabeth Martin'), 
    question: "Is it okay to re-gift a present if I know the person will actually use it?",
    imageUrls: ['https://placehold.co/600x400.png?text=Regift'], 
    options: [
        { id: 'er_opt1_etiquette', text: "Yes, practical and resourceful!", votes: generateRandomVotes() },
        { id: 'er_opt2_etiquette', text: "No, it's tacky and disrespectful.", votes: generateRandomVotes() },
        { id: 'er_opt3_etiquette', text: "Only if the original giver will never know.", votes: generateRandomVotes() },
        { id: 'er_opt4_etiquette', text: "Only if it's truly something they'll love.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("14 hours, 51 minutes")).toISOString(),
    createdAt: generateCreatedAt("14 hours, 51 minutes"),
  },
  {
    id: 'poll_victoria_solo_trip_adventure', // Differentiated ID
    creator: findUser('Victoria Lee'), 
    question: "I'm considering a spontaneous solo trip across the country. Brave and empowering, or reckless and lonely?",
    imageUrls: ['https://placehold.co/600x400.png?text=SoloTrip'], 
    options: [
        { id: 'vst_opt1_adventure', text: "Brave! Embrace the adventure.", votes: generateRandomVotes() },
        { id: 'vst_opt2_adventure', text: "Reckless, plan it out first.", votes: generateRandomVotes() },
        { id: 'vst_opt3_adventure', text: "Empowering, but bring a friend.", votes: generateRandomVotes() },
        { id: 'vst_opt4_adventure', text: "Visit first, then decide.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 6 hours, 28 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 days, 6 hours, 28 minutes"),
  },
  {
    id: 'poll_madison_plants_dying', // Differentiated ID
    creator: findUser('Madison Perez'), 
    question: "My plants are dying despite my best efforts. Do I give up on being a plant parent or buy more and try again?",
    imageUrls: ['https://placehold.co/600x400.png?text=PlantParent'], 
    options: [
        { id: 'mp_opt1_dying', text: "Try again! Green thumb in the making.", votes: generateRandomVotes() },
        { id: 'mp_opt2_dying', text: "Give up, plants aren't for everyone.", votes: generateRandomVotes() },
        { id: 'mp_opt3_dying', text: "Get a low-maintenance plant.", votes: generateRandomVotes() },
        { id: 'mp_opt4_dying', text: "Hire a plant sitter.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("28 days, 16 hours, 43 minutes")).toISOString(),
    createdAt: generateCreatedAt("28 days, 16 hours, 43 minutes"),
  },
  {
    id: 'poll_liam_crypto_investment', // Differentiated ID
    creator: findUser('Liam Garcia'), 
    question: "Should I invest my small savings in crypto and potentially get rich quick, or put it in a boring old savings account?",
    imageUrls: ['https://placehold.co/600x400.png?text=CryptoVsSavings'], 
    options: [
        { id: 'lc_opt1_investment', text: "To the moon! Crypto all the way.", votes: generateRandomVotes() },
        { id: 'lc_opt2_investment', text: "Play it safe, savings account.", votes: generateRandomVotes() },
        { id: 'lc_opt3_investment', text: "Diversify! A little bit of both.", votes: generateRandomVotes() },
        { id: 'lc_opt4_investment', text: "Consult a financial advisor first.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("9 days, 23 hours, 56 minutes")).toISOString(),
    createdAt: generateCreatedAt("9 days, 23 hours, 56 minutes"),
  },
  {
    id: 'poll_ben_clothes_sharing', // Differentiated ID
    creator: findUser('Ben Ross'),
    question: "My partner keeps 'borrowing' my clothes without asking. Do I hide them, or just accept it's a shared wardrobe now?",
    imageUrls: ['https://placehold.co/600x400.png?text=SharedWardrobe'], 
    options: [
        { id: 'brc_opt1_sharing', text: "Hide them! These are MY clothes.", votes: generateRandomVotes() },
        { id: 'brc_opt2_sharing', text: "Accept it, sharing is caring (sometimes).", votes: generateRandomVotes() },
        { id: 'brc_opt3_sharing', text: "Buy them their own similar clothes.", votes: generateRandomVotes() },
        { id: 'brc_opt4_sharing', text: "Have a designated 'borrowing' drawer.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("15 days, 1 hour, 19 minutes")).toISOString(),
    createdAt: generateCreatedAt("15 days, 1 hour, 19 minutes"),
  },
  {
    id: 'poll_chris_minimalism_declutter', // Differentiated ID
    creator: findUser('Chris Henderson'),
    question: "Should I embrace minimalism and declutter my entire life, or cling to my beloved possessions?",
    imageUrls: ['https://placehold.co/600x400.png?text=DeclutterLife'], 
    options: [
        { id: 'chm_opt1_declutter', text: "Declutter! Freedom through less stuff.", votes: generateRandomVotes() },
        { id: 'chm_opt2_declutter', text: "Cling! Memories are priceless.", votes: generateRandomVotes() },
        { id: 'chm_opt3_declutter', text: "Start small, declutter one room at a time.", votes: generateRandomVotes() },
        { id: 'chm_opt4_declutter', text: "Only keep things that 'spark joy'.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("30 days, 10 hours, 2 minutes")).toISOString(),
    createdAt: generateCreatedAt("30 days, 10 hours, 2 minutes"),
  },
  {
    id: 'poll_daniel_move_in_cohabitation', // Differentiated ID
    creator: findUser('Daniel Coleman'),
    question: "My significant other wants to move in together, but I love my personal space. Do I agree or hit the brakes?",
    imageUrls: ['https://placehold.co/600x400.png?text=Cohabitation'], 
    options: [
        { id: 'dmi_opt1_cohabitation', text: "Agree, it's the next step!", votes: generateRandomVotes() },
        { id: 'dmi_opt2_cohabitation', text: "Hit the brakes, personal space is vital.", votes: generateRandomVotes() },
        { id: 'dmi_opt3_cohabitation', text: "Suggest a trial period.", votes: generateRandomVotes() },
        { id: 'dmi_opt4_cohabitation', text: "Find a bigger place with separate zones.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 days, 18 hours, 39 minutes")).toISOString(),
    createdAt: generateCreatedAt("7 days, 18 hours, 39 minutes"),
  },
  {
    id: 'poll_olivia_organic_food_again', 
    creator: findUser('Olivia Rodriguez'), 
    question: "Is it worth buying organic food, or is it just a marketing gimmick? (Round 2)",
    imageUrls: ['https://placehold.co/600x400.png?text=OrganicDebate'], 
    options: [
        { id: 'oof_opt1_r2', text: "Definitely worth it for health and environment!", votes: generateRandomVotes() },
        { id: 'oof_opt2_r2', text: "Marketing gimmick, save your money.", votes: generateRandomVotes() },
        { id: 'oof_opt3_r2', text: "Some things yes, some things no (Dirty Dozen/Clean Fifteen).", votes: generateRandomVotes() },
        { id: 'oof_opt4_r2', text: "Grow your own!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 14 hours, 55 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 days, 14 hours, 55 minutes"),
  },
  {
    id: 'poll_emma_vows_again_r2', 
    creator: findUser('Emma Davis'), 
    question: "My partner wants to renew our vows on our 10th anniversary, but I feel like we're just going through the motions. Do I go along with it or be honest? (Second Opinion)",
    imageUrls: ['https://placehold.co/600x400.png?text=VowRenewal'], 
    options: [
        { id: 'eva_opt1_r2', text: "Go along, it might rekindle something.", votes: generateRandomVotes() },
        { id: 'eva_opt2_r2', text: "Be honest, address the underlying issues.", votes: generateRandomVotes() },
        { id: 'eva_opt3_r2', text: "Suggest a different way to celebrate.", votes: generateRandomVotes() },
        { id: 'eva_opt4_r2', text: "Surprise them with couples counseling instead.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("24 days, 6 hours, 29 minutes")).toISOString(),
    createdAt: generateCreatedAt("24 days, 6 hours, 29 minutes"),
  },
  {
    id: 'poll_chloe_secret_pet_again_r2', 
    creator: findUser('Chloe Wright'), 
    question: "Should I get a pet without telling my landlord, and hope they don't find out? (Take 2)",
    imageUrls: ['https://placehold.co/600x400.png?text=HiddenPet'], 
    options: [
        { id: 'csp_opt1_r2', text: "No! Get permission first, avoid eviction.", votes: generateRandomVotes() },
        { id: 'csp_opt2_r2', text: "Yes, easier to ask forgiveness than permission.", votes: generateRandomVotes() },
        { id: 'csp_opt3_r2', text: "Find a pet-friendly place.", votes: generateRandomVotes() },
        { id: 'csp_opt4_r2', text: "Get a very quiet pet.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("19 hours, 4 minutes")).toISOString(),
    createdAt: generateCreatedAt("19 hours, 4 minutes"),
  },
  {
    id: 'poll_lily_read_texts_again_r2', 
    creator: findUser('Lily Roberts'), 
    question: "Is it okay to secretly read my partner's text messages if I suspect they're hiding something? (Redux)",
    imageUrls: ['https://placehold.co/600x400.png?text=ReadTexts'], 
    options: [
        { id: 'lrt_opt1_r2', text: "No! Respect their privacy.", votes: generateRandomVotes() },
        { id: 'lrt_opt2_r2', text: "Yes, if your suspicions are strong.", votes: generateRandomVotes() },
        { id: 'lrt_opt3_r2', text: "Talk to them directly first.", votes: generateRandomVotes() },
        { id: 'lrt_opt4_r2', text: "Hire a private investigator.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("11 days, 19 hours, 58 minutes")).toISOString(),
    createdAt: generateCreatedAt("11 days, 19 hours, 58 minutes"),
  },
  {
    id: 'poll_ava_name_tattoo_again_r2', 
    creator: findUser('Ava Williams'), 
    question: "Should I get a tattoo of my current partner's name? Everyone says it's bad luck, but I feel it's true love. (Revisited)",
    imageUrls: ['https://placehold.co/600x400.png?text=PartnerTattoo'], 
    options: [
        { id: 'ant_opt1_r2', text: "No! Bad luck and bad ideas.", votes: generateRandomVotes() },
        { id: 'ant_opt2_r2', text: "Yes! Declare your love boldly.", votes: generateRandomVotes() },
        { id: 'ant_opt3_r2', text: "Get something symbolic instead.", votes: generateRandomVotes() },
        { id: 'ant_opt4_r2', text: "Wait until after you're married.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("5 days, 8 hours, 35 minutes")).toISOString(),
    createdAt: generateCreatedAt("5 days, 8 hours, 35 minutes"),
  },
  {
    id: 'poll_sophia_crazy_hair_again_r2', 
    creator: findUser('Sophia Miller'), 
    question: "I'm thinking about dying my hair a crazy, unnatural color. Bold fashion statement or future regret? (Round Two)",
    imageUrls: ['https://placehold.co/600x400.png?text=CrazyHair'], 
    options: [
        { id: 'sch_opt1_again_r2', text: "Bold statement! Express yourself.", votes: generateRandomVotes() },
        { id: 'sch_opt2_again_r2', text: "Future regret, stick to natural.", votes: generateRandomVotes() },
        { id: 'sch_opt3_again_r2', text: "Try a temporary color first.", votes: generateRandomVotes() },
        { id: 'sch_opt4_again_r2', text: "Consult a colorist for best results.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("20 days, 14 hours, 21 minutes")).toISOString(),
    createdAt: generateCreatedAt("20 days, 14 hours, 21 minutes"),
  },
  {
    id: 'poll_harper_school_40s_again_r2', 
    creator: findUser('Harper Anderson'), 
    question: "Should I go back to school to switch careers in my 40s? It feels like now or never. (Reconsideration)",
    imageUrls: ['https://placehold.co/600x400.png?text=SchoolAt40'], 
    options: [
        { id: 'hs4_opt1_r2', text: "Now or never! Invest in your future.", votes: generateRandomVotes() },
        { id: 'hs4_opt2_r2', text: "Too late, focus on retirement.", votes: generateRandomVotes() },
        { id: 'hs4_opt3_r2', text: "Part-time study, gradual transition.", votes: generateRandomVotes() },
        { id: 'hs4_opt4_r2', text: "Explore certifications instead of a full degree.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 days, 22 hours, 44 minutes")).toISOString(),
    createdAt: generateCreatedAt("3 days, 22 hours, 44 minutes"),
  },
  {
    id: 'poll_evelyn_laser_pet_again_r2', 
    creator: findUser('Evelyn Thomas'), 
    question: "My pet is obsessed with chasing laser pointers. Is it fun for them, or secretly frustrating because they can never 'catch' it? (Re-check)",
    imageUrls: ['https://placehold.co/600x400.png?text=PetLaser'], 
    options: [
        { id: 'elp_opt1_r2', text: "Fun and good exercise!", votes: generateRandomVotes() },
        { id: 'elp_opt2_r2', text: "Frustrating, avoid them.", votes: generateRandomVotes() },
        { id: 'elp_opt3_r2', text: "Use it as a warm-up, then a real toy.", votes: generateRandomVotes() },
        { id: 'elp_opt4_r2', text: "Only if there's a tangible reward at the end.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("25 days, 9 hours, 17 minutes")).toISOString(),
    createdAt: generateCreatedAt("25 days, 9 hours, 17 minutes"),
  },
  {
    id: 'poll_abigail_lie_resume_again_r2', 
    creator: findUser('Abigail Jackson'), 
    question: "Is it ever okay to lie on a resume to get a job, then learn the skills quickly? (Final thoughts)",
    imageUrls: ['https://placehold.co/600x400.png?text=ResumeHonesty'], 
    options: [
        { id: 'alr_opt1_r2', text: "No, it's unethical and you'll get caught.", votes: generateRandomVotes() },
        { id: 'alr_opt2_r2', text: "Yes, if you're confident you can learn fast.", votes: generateRandomVotes() },
        { id: 'alr_opt3_r2', text: "Only if it's a minor exaggeration.", votes: generateRandomVotes() },
        { id: 'alr_opt4_r2', text: "Better to be honest and highlight transferable skills.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 hour, 5 minutes")).toISOString(),
    createdAt: generateCreatedAt("1 hour, 5 minutes"),
  },
  {
    id: 'poll_ella_polyamory_again_r2', 
    creator: findUser('Ella White'), 
    question: "Should I try polyamory with my long-term partner? It sounds exciting but also terrifying. (Deep Dive)",
    imageUrls: ['https://placehold.co/600x400.png?text=TryPolyamory'], 
    options: [
        { id: 'epa_opt1_r2', text: "Explore it, but with clear boundaries and communication.", votes: generateRandomVotes() },
        { id: 'epa_opt2_r2', text: "No, stick to monogamy.", votes: generateRandomVotes() },
        { id: 'epa_opt3_r2', text: "Suggest an open relationship first.", votes: generateRandomVotes() },
        { id: 'epa_opt4_r2', text: "Seek couples therapy to discuss it.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("17 days, 12 hours, 30 minutes")).toISOString(),
    createdAt: generateCreatedAt("17 days, 12 hours, 30 minutes"),
  },
  {
    id: 'poll_scarlett_hate_fiance_again_r2', 
    creator: findUser('Scarlett Harris'), 
    question: "My best friend just got engaged, but I secretly hate their fiancé. Do I fake enthusiasm or express my concerns? (The Sequel)",
    imageUrls: ['https://placehold.co/600x400.png?text=FriendEngagement'], 
    options: [
        { id: 'shf_opt1_r2', text: "Fake enthusiasm, it's their happiness.", votes: generateRandomVotes() },
        { id: 'shf_opt2_r2', text: "Express concerns gently and privately.", votes: generateRandomVotes() },
        { id: 'shf_opt3_r2', text: "Distance yourself from the friendship.", votes: generateRandomVotes() },
        { id: 'shf_opt4_r2', text: "Get to know the fiancé better.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 days, 21 hours, 49 minutes")).toISOString(),
    createdAt: generateCreatedAt("6 days, 21 hours, 49 minutes"),
  },
  {
    id: 'poll_elizabeth_cook_microwave_again_r2', 
    creator: findUser('Elizabeth Martin'), 
    question: "Should I learn to cook elaborate meals, or stick to my trusty microwave dinners? (Kitchen Wars)",
    imageUrls: ['https://placehold.co/600x400.png?text=CookOrMicrowave'], 
    options: [
        { id: 'ecm_opt1_r2', text: "Learn to cook! It's a life skill.", votes: generateRandomVotes() },
        { id: 'ecm_opt2_r2', text: "Microwave all the way, efficiency!", votes: generateRandomVotes() },
        { id: 'ecm_opt3_r2', text: "Start with simple recipes, then level up.", votes: generateRandomVotes() },
        { id: 'ecm_opt4_r2', text: "Order takeout!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 10 hours, 6 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 days, 10 hours, 6 minutes"),
  },
  {
    id: 'poll_sofia_roommate_cleans_again_r2', 
    creator: findUser('Sophia Miller'), 
    question: "My roommate never cleans. Do I create a chore chart, or passive-aggressively clean only my side? (The Cleaning Saga)",
    imageUrls: ['https://placehold.co/600x400.png?text=MessyRoommate'], 
    options: [
        { id: 'src_opt1_r2', text: "Chore chart! Clear expectations.", votes: generateRandomVotes() },
        { id: 'src_opt2_r2', text: "Passive aggression wins every time.", votes: generateRandomVotes() },
        { id: 'src_opt3_r2', text: "Move out.", votes: generateRandomVotes() },
        { id: 'src_opt4_r2', text: "Hire a cleaner for common areas.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("23 days, 14 hours, 43 minutes")).toISOString(),
    createdAt: generateCreatedAt("23 days, 14 hours, 43 minutes"),
  },
  {
    id: 'poll_camila_balance_life_again_r2', 
    creator: findUser('Camila Thompson'), 
    question: "Is it truly possible to balance a demanding career and a fulfilling family life, or is one always sacrificed for the other? (The Balancing Act)",
    imageUrls: ['https://placehold.co/600x400.png?text=WorkLifeBalance'], 
    options: [
        { id: 'cbl_opt1_r2', text: "Yes, with careful planning and boundaries.", votes: generateRandomVotes() },
        { id: 'cbl_opt2_r2', text: "No, it's an impossible dream for most.", votes: generateRandomVotes() },
        { id: 'cbl_opt3_r2', text: "It depends on your definition of 'balance'.", votes: generateRandomVotes() },
        { id: 'cbl_opt4_r2', text: "Outsource everything!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("15 hours, 31 minutes")).toISOString(),
    createdAt: generateCreatedAt("15 hours, 31 minutes"),
  },
  {
    id: 'poll_aria_dirty_socks_again_r2', 
    creator: findUser('Aria Moore'), 
    question: "My partner keeps leaving their dirty socks everywhere. Do I passive-aggressively put them on their pillow, or actually talk about it? (Sockpocalypse)",
    imageUrls: ['https://placehold.co/600x400.png?text=DirtySocksAgain'], 
    options: [
        { id: 'ads_opt1_r2', text: "Pillow revenge! It's a classic.", votes: generateRandomVotes() },
        { id: 'ads_opt2_r2', text: "Communicate, it's the adult thing to do.", votes: generateRandomVotes() },
        { id: 'ads_opt3_r2', text: "Hire a maid.", votes: generateRandomVotes() },
        { id: 'ads_opt4_r2', text: "Collect them and present them as a 'gift'.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("10 days, 2 hours, 59 minutes")).toISOString(),
    createdAt: generateCreatedAt("10 days, 2 hours, 59 minutes"),
  },
  {
    id: 'poll_victoria_third_date_again_r2', 
    creator: findUser('Victoria Lee'), 
    question: "Should I go on a third date with someone who's super hot but has absolutely no ambition, or cut my losses? (Third Time's the Charm?)",
    imageUrls: ['https://placehold.co/600x400.png?text=ThirdDateDilemma'], 
    options: [
        { id: 'vtd_opt1_r2', text: "Hotness fades, ambition lasts. Cut losses.", votes: generateRandomVotes() },
        { id: 'vtd_opt2_r2', text: "Enjoy the hotness while it lasts!", votes: generateRandomVotes() },
        { id: 'vtd_opt3_r2', text: "Give them another chance, maybe they'll grow.", votes: generateRandomVotes() },
        { id: 'vtd_opt4_r2', text: "Friend-zone them and find someone with ambition.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("4 days, 13 hours, 24 minutes")).toISOString(),
    createdAt: generateCreatedAt("4 days, 13 hours, 24 minutes"),
  },
  {
    id: 'poll_madison_masters_debt_again_r2', 
    creator: findUser('Madison Perez'), 
    question: "Should I pursue a master's degree to advance my career, even if it means taking on significant student debt? (Debt vs Degree)",
    imageUrls: ['https://placehold.co/600x400.png?text=MastersDebt'], 
    options: [
        { id: 'mmd_opt1_r2', text: "Invest in yourself, it will pay off.", votes: generateRandomVotes() },
        { id: 'mmd_opt2_r2', text: "Debt is a trap, explore other options.", votes: generateRandomVotes() },
        { id: 'mmd_opt3_r2', text: "Only if you're passionate about the subject.", votes: generateRandomVotes() },
        { id: 'mmd_opt4_r2', text: "Crunch the numbers, is the ROI worth it?", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("19 days, 19 hours, 18 minutes")).toISOString(),
    createdAt: generateCreatedAt("19 days, 19 hours, 18 minutes"),
  },
  {
    id: 'poll_luna_new_city_again_r2', 
    creator: findUser('Luna Walker'), 
    question: "I'm thinking of moving to a completely new city where I know no one. Exciting fresh start, or terrifying leap into the unknown? (Solo City)",
    imageUrls: ['https://placehold.co/600x400.png?text=NewCityAdventure'], 
    options: [
        { id: 'lnc_opt1_r2', text: "Exciting! Embrace the new adventure.", votes: generateRandomVotes() },
        { id: 'lnc_opt2_r2', text: "Terrifying, build a network first.", votes: generateRandomVotes() },
        { id: 'lnc_opt3_r2', text: "Do it, you'll grow immensely.", votes: generateRandomVotes() },
        { id: 'lnc_opt4_r2', text: "Visit first, then decide.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 days, 4 hours, 51 minutes")).toISOString(),
    createdAt: generateCreatedAt("7 days, 4 hours, 51 minutes"),
  },
  {
    id: 'poll_grace_confess_feelings_again_r2', 
    creator: findUser('Grace Hall'), 
    question: "Should I confess my feelings to my long-time friend, even if it risks ruining our friendship? (Friendzone Gambit)",
    imageUrls: ['https://placehold.co/600x400.png?text=ConfessOrNot'], 
    options: [
        { id: 'gcf_opt1_r2', text: "Take the leap! You'll regret not knowing.", votes: generateRandomVotes() },
        { id: 'gcf_opt2_r2', text: "Keep it platonic, friendship is too valuable.", votes: generateRandomVotes() },
        { id: 'gcf_opt3_r2', text: "Test the waters subtly first.", votes: generateRandomVotes() },
        { id: 'gcf_opt4_r2', text: "Wait for them to make a move.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 20 hours, 10 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 days, 20 hours, 10 minutes"),
  },
  {
    id: 'poll_natalie_car_repair_again_r2', 
    creator: findUser('Natalie Allen'), 
    question: "My car is on its last legs. Do I repair it one last time, or finally buy a new (or used) one? (Car Conundrum)",
    imageUrls: ['https://placehold.co/600x400.png?text=CarRepairDecision'], 
    options: [
        { id: 'ncr_opt1_r2', text: "Repair it, squeeze out every last mile.", votes: generateRandomVotes() },
        { id: 'ncr_opt2_r2', text: "New car time! Enjoy the reliability.", votes: generateRandomVotes() },
        { id: 'ncr_opt3_r2', text: "Used car, better value.", votes: generateRandomVotes() },
        { id: 'ncr_opt4_r2', text: "Public transport is the way!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("24 days, 11 hours, 37 minutes")).toISOString(),
    createdAt: generateCreatedAt("24 days, 11 hours, 37 minutes"),
  },
  {
    id: 'poll_sarah_partner_cooking_again_r2', 
    creator: findUser('Sarah Young'), 
    question: "Is it okay to secretly dislike my partner's cooking, or should I tell them the truth (gently, of course)? (Kitchen Confessions)",
    imageUrls: ['https://placehold.co/600x400.png?text=BadCooking'], 
    options: [
        { id: 'spc_opt1_r2', text: "Pretend to love it, save their feelings.", votes: generateRandomVotes() },
        { id: 'spc_opt2_r2', text: "Tell them gently, offer to cook together.", votes: generateRandomVotes() },
        { id: 'spc_opt3_r2', text: "Suggest takeout more often.", votes: generateRandomVotes() },
        { id: 'spc_opt4_r2', text: "Just eat less of it.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("16 hours, 23 minutes")).toISOString(),
    createdAt: generateCreatedAt("16 hours, 23 minutes"),
  },
  {
    id: 'poll_alice_extreme_sport_again_r2', 
    creator: findUser('Alice Wonderland'), 
    question: "Should I try a new, extreme sport like skydiving or rock climbing, or stick to my cozy hobbies? (Adrenaline vs Comfort)",
    imageUrls: ['https://placehold.co/600x400.png?text=NewSport'], 
    options: [
        { id: 'aes_opt1_r2', text: "Go for it! Adrenaline rush!", votes: generateRandomVotes() },
        { id: 'aes_opt2_r2', text: "Stay cozy, safety first.", votes: generateRandomVotes() },
        { id: 'aes_opt3_r2', text: "Start small, try bouldering first.", votes: generateRandomVotes() },
        { id: 'aes_opt4_r2', text: "Live vicariously through YouTube.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("11 days, 8 hours, 4 minutes")).toISOString(),
    createdAt: generateCreatedAt("11 days, 8 hours, 4 minutes"),
  },
  {
    id: 'poll_bella_pet_surgery_again_r2', 
    creator: findUser('Bella King'), 
    question: "My pet needs an expensive surgery. Do I drain my savings for it, or consider other options? (Pet Parent Problems)",
    imageUrls: ['https://placehold.co/600x400.png?text=PetSurgeryHelp'], 
    options: [
        { id: 'bps_opt1_r2', text: "Save your pet, cost is secondary!", votes: generateRandomVotes() },
        { id: 'bps_opt2_r2', text: "Consider quality of life, explore alternatives.", votes: generateRandomVotes() },
        { id: 'bps_opt3_r2', text: "Look for financial aid/pet charities.", votes: generateRandomVotes() },
        { id: 'bps_opt4_r2', text: "It's just a pet, be practical.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("5 days, 2 hours, 16 minutes")).toISOString(),
    createdAt: generateCreatedAt("5 days, 2 hours, 16 minutes"),
  },
  {
    id: 'poll_lily_apology_timing_again_r2', 
    creator: findUser('Lily Roberts'), 
    question: "Is it better to apologize immediately when you're wrong, or wait until emotions cool down? (Sorry Not Sorry?)",
    imageUrls: ['https://placehold.co/600x400.png?text=ApologyTiming'], 
    options: [
        { id: 'lat_opt1_r2', text: "Immediately, clear the air.", votes: generateRandomVotes() },
        { id: 'lat_opt2_r2', text: "Wait, a calm apology is more effective.", votes: generateRandomVotes() },
        { id: 'lat_opt3_r2', text: "It depends on the situation.", votes: generateRandomVotes() },
        { id: 'lat_opt4_r2', text: "Never apologize, assert dominance!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("20 days, 16 hours, 32 minutes")).toISOString(),
    createdAt: generateCreatedAt("20 days, 16 hours, 32 minutes"),
  },
  {
    id: 'poll_emma_problematic_posts_again_r2', 
    creator: findUser('Emma Davis'), 
    question: "Should I confront my friend about their problematic social media posts, or is it not my place? (Social Dilemma)",
    imageUrls: ['https://placehold.co/600x400.png?text=ProblematicPosts'], 
    options: [
        { id: 'epp_opt1_again_r2', text: "Confront them privately, from a place of care.", votes: generateRandomVotes() },
        { id: 'epp_opt2_again_r2', text: "It's not your place, let them be.", votes: generateRandomVotes() },
        { id: 'epp_opt3_again_r2', text: "Unfollow/mute them.", votes: generateRandomVotes() },
        { id: 'epp_opt4_again_r2', text: "Publicly call them out.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 days, 15 hours, 48 minutes")).toISOString(),
    createdAt: generateCreatedAt("3 days, 15 hours, 48 minutes"),
  },
  {
    id: 'poll_olivia_freelance_client_again_r2', 
    creator: findUser('Olivia Rodriguez'), 
    question: "I'm a freelancer and a potential client is offering a huge project but has a terrible reputation. Do I take the money or protect my peace? (Client From Hell?)",
    imageUrls: ['https://placehold.co/600x400.png?text=BadClient'], 
    options: [
        { id: 'ofc_opt1_r2', text: "Take the money, deal with the headache later.", votes: generateRandomVotes() },
        { id: 'ofc_opt2_r2', text: "Protect your peace, it's not worth it.", votes: generateRandomVotes() },
        { id: 'ofc_opt3_r2', text: "Negotiate stricter terms and upfront payment.", votes: generateRandomVotes() },
        { id: 'ofc_opt4_r2', text: "Get a lawyer to review the contract.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("25 days, 12 hours, 5 minutes")).toISOString(),
    createdAt: generateCreatedAt("25 days, 12 hours, 5 minutes"),
  },
  {
    id: 'poll_charlotte_parental_pressure_again_r2', 
    creator: findUser('Charlotte Wilson'), 
    question: "My parents are pressuring me to have kids. Do I give in or stand my ground on my childfree choice? (Baby Blues)",
    imageUrls: ['https://placehold.co/600x400.png?text=ChildfreeChoice'], 
    options: [
        { id: 'cpp_opt1_r2', text: "It's your life, stand your ground!", votes: generateRandomVotes() },
        { id: 'cpp_opt2_r2', text: "Consider it, maybe you'll change your mind.", votes: generateRandomVotes() },
        { id: 'cpp_opt3_r2', text: "Compromise: get a pet instead.", votes: generateRandomVotes() },
        { id: 'cpp_opt4_r2', text: "Tell them you're infertile (jk... mostly).", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 hours, 10 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 hours, 10 minutes"),
  },
  {
    id: 'poll_amelia_designer_splurge_again_r2', 
    creator: findUser('Amelia Taylor'), 
    question: "Should I splurge on this designer item I've been eyeing, or save that money for something more practical? (Luxury vs Logic)",
    imageUrls: ['https://placehold.co/600x400.png?text=DesignerItem'], 
    options: [
        { id: 'ads_opt1_again_r2', text: "Treat yourself! You deserve it.", votes: generateRandomVotes() },
        { id: 'ads_opt2_again_r2', text: "Save it, practicality wins.", votes: generateRandomVotes() },
        { id: 'ads_opt3_again_r2', text: "Set a budget and stick to it.", votes: generateRandomVotes() },
        { id: 'ads_opt4_again_r2', text: "Buy a high-quality dupe.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("17 days, 1 hour, 39 minutes")).toISOString(),
    createdAt: generateCreatedAt("17 days, 1 hour, 39 minutes"),
  },
  {
    id: 'poll_harper_job_offer_again_r2', 
    creator: findUser('Harper Anderson'), 
    question: "I received a job offer but I'm also waiting to hear back from my dream company. Do I accept or hold out? (Career Crossroads)",
    imageUrls: ['https://placehold.co/600x400.png?text=DreamJobWait'], 
    options: [
        { id: 'hjo_opt1_r2', text: "Accept the offer, a bird in hand...", votes: generateRandomVotes() },
        { id: 'hjo_opt2_r2', text: "Hold out for the dream job, it's worth the risk.", votes: generateRandomVotes() },
        { id: 'hjo_opt3_r2', text: "Ask for an extension on the offer.", votes: generateRandomVotes() },
        { id: 'hjo_opt4_r2', text: "Negotiate for a later start date.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 days, 17 hours, 28 minutes")).toISOString(),
    createdAt: generateCreatedAt("6 days, 17 hours, 28 minutes"),
  },
  {
    id: 'poll_evelyn_natural_hair_again_r2', 
    creator: findUser('Evelyn Thomas'), 
    question: "Should I embrace my natural hair texture, or continue with my elaborate styling routine? (Hair Freedom)",
    imageUrls: ['https://placehold.co/600x400.png?text=HairRoutine'], 
    options: [
        { id: 'enh_opt1_r2', text: "Embrace the natural! Freedom awaits.", votes: generateRandomVotes() },
        { id: 'enh_opt2_r2', text: "Stick to the routine, it's your signature.", votes: generateRandomVotes() },
        { id: 'enh_opt3_r2', text: "Mix it up: natural some days, styled others.", votes: generateRandomVotes() },
        { id: 'enh_opt4_r2', text: "Consult a stylist for low-maintenance options.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 15 hours, 45 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 days, 15 hours, 45 minutes"),
  },
  {
    id: 'poll_abigail_white_lie_again_r2', 
    creator: findUser('Abigail Jackson'), 
    question: "Is it okay to lie to spare someone's feelings, or is brutal honesty always the best policy? (Truth Hurts?)",
    imageUrls: ['https://placehold.co/600x400.png?text=WhiteLie'], 
    options: [
        { id: 'awl_opt1_r2', text: "Lie gently, kindness first.", votes: generateRandomVotes() },
        { id: 'awl_opt2_r2', text: "Honesty, even if it hurts short-term.", votes: generateRandomVotes() },
        { id: 'awl_opt3_r2', text: "It depends on the severity of the lie/truth.", votes: generateRandomVotes() },
        { id: 'awl_opt4_r2', text: "Use white lies sparingly.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("23 days, 10 hours, 19 minutes")).toISOString(),
    createdAt: generateCreatedAt("23 days, 10 hours, 19 minutes"),
  },
  {
    id: 'poll_ella_creative_block_again_r2', 
    creator: findUser('Ella White'), 
    question: "My creative project is stalled. Do I push through the block, or take a break and come back later? (Writer's Block)",
    imageUrls: ['https://placehold.co/600x400.png?text=CreativePush'], 
    options: [
        { id: 'ecb_opt1_r2', text: "Push through! Discipline is key.", votes: generateRandomVotes() },
        { id: 'ecb_opt2_r2', text: "Take a break, recharge your creativity.", votes: generateRandomVotes() },
        { id: 'ecb_opt3_r2', text: "Seek inspiration from others.", votes: generateRandomVotes() },
        { id: 'ecb_opt4_r2', text: "Collaborate with someone new.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("15 hours, 7 minutes")).toISOString(),
    createdAt: generateCreatedAt("15 hours, 7 minutes"),
  },
  {
    id: 'poll_scarlett_bangs_again_r2', 
    creator: findUser('Scarlett Harris'), 
    question: "Should I get bangs? It feels like a big commitment for my face shape. (Fringe Benefits?)",
    imageUrls: ['https://placehold.co/600x400.png?text=ToBangOrNot'], 
    options: [
        { id: 'sb_opt1_r2', text: "Go for it! Hair grows back.", votes: generateRandomVotes() },
        { id: 'sb_opt2_r2', text: "No bangs, too much maintenance.", votes: generateRandomVotes() },
        { id: 'sb_opt3_r2', text: "Try clip-in bangs first.", votes: generateRandomVotes() },
        { id: 'sb_opt4_r2', text: "Ask your stylist for their professional opinion.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("10 days, 21 hours, 53 minutes")).toISOString(),
    createdAt: generateCreatedAt("10 days, 21 hours, 53 minutes"),
  },
  {
    id: 'poll_elizabeth_coffee_spill_again_r2', 
    creator: findUser('Elizabeth Martin'), 
    question: "I accidentally spilled coffee on my friend's expensive rug. Do I confess immediately and offer to clean/pay, or try to clean it secretly? (Oops Moment)",
    imageUrls: ['https://placehold.co/600x400.png?text=CoffeeSpillOops'], 
    options: [
        { id: 'ecs_opt1_3_r2', text: "Confess immediately, honesty is best.", votes: generateRandomVotes() },
        { id: 'ecs_opt2_3_r2', text: "Clean it secretly, hope they don't notice.", votes: generateRandomVotes() },
        { id: 'ecs_opt3_3_r2', text: "Blame the dog.", votes: generateRandomVotes() },
        { id: 'ecs_opt4_3_r2', text: "Offer to buy them a new rug.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("4 days, 6 hours, 26 minutes")).toISOString(),
    createdAt: generateCreatedAt("4 days, 6 hours, 26 minutes"),
  },
  {
    id: 'poll_sofia_late_party_again_r2', 
    creator: findUser('Sophia Miller'), 
    question: "Is it ever okay to show up late to a party, or is punctuality always king? (Time Flies?)",
    imageUrls: ['https://placehold.co/600x400.png?text=LateToParty'], 
    options: [
        { id: 'slp_opt1_r2', text: "Fashionably late is a vibe.", votes: generateRandomVotes() },
        { id: 'slp_opt2_r2', text: "Always be on time, it's respectful.", votes: generateRandomVotes() },
        { id: 'slp_opt3_r2', text: "Only if you have a good excuse.", votes: generateRandomVotes() },
        { id: 'slp_opt4_r2', text: "Show up early to help set up!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("19 days, 2 hours, 40 minutes")).toISOString(),
    createdAt: generateCreatedAt("19 days, 2 hours, 40 minutes"),
  },
  {
    id: 'poll_camila_secret_dating_again_r2', 
    creator: findUser('Camila Thompson'), 
    question: "Should I tell my parents I'm dating someone they won't approve of, or keep it a secret? (Family Secrets)",
    imageUrls: ['https://placehold.co/600x400.png?text=SecretRelationship'], 
    options: [
        { id: 'csd_opt1_r2', text: "Tell them, honesty is the best policy.", votes: generateRandomVotes() },
        { id: 'csd_opt2_r2', text: "Keep it secret to avoid conflict.", votes: generateRandomVotes() },
        { id: 'csd_opt3_r2', text: "Introduce them gradually.", votes: generateRandomVotes() },
        { id: 'csd_opt4_r2', text: "Wait until it's serious.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 days, 15 hours, 5 minutes")).toISOString(),
    createdAt: generateCreatedAt("7 days, 15 hours, 5 minutes"),
  },
  {
    id: 'poll_aria_save_coffeeshop_again_r2', 
    creator: findUser('Aria Moore'), 
    question: "My favorite local coffee shop is closing. Do I try to rally the community to save it, or mourn its loss quietly? (Coffee Crisis)",
    imageUrls: ['https://placehold.co/600x400.png?text=LocalCoffeeShop'], 
    options: [
        { id: 'asc_opt1_r2', text: "Rally the troops! Fight for your coffee!", votes: generateRandomVotes() },
        { id: 'asc_opt2_r2', text: "Mourn quietly, some things aren't meant to last.", votes: generateRandomVotes() },
        { id: 'asc_opt3_r2', text: "Support other local businesses.", votes: generateRandomVotes() },
        { id: 'asc_opt4_r2', text: "Start your own coffee shop.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 11 hours, 28 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 days, 11 hours, 28 minutes"),
  },
  {
    id: 'poll_leo_new_language_again_r2', 
    creator: findUser('Leo Jenkins'),
    question: "Should I learn a new language, or focus on becoming an expert in a skill I already have? (Linguistic Leap?)",
    imageUrls: ['https://placehold.co/600x400.png?text=NewLanguageVsSkill'], 
    options: [
        { id: 'lnl_opt1_r2', text: "New language! Expand your horizons.", votes: generateRandomVotes() },
        { id: 'lnl_opt2_r2', text: "Master current skills, depth over breadth.", votes: generateRandomVotes() },
        { id: 'lnl_opt3_r2', text: "Do both, slowly but surely.", votes: generateRandomVotes() },
        { id: 'lnl_opt4_r2', text: "Learn a language relevant to your existing skill.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("24 days, 18 hours, 3 minutes")).toISOString(),
    createdAt: generateCreatedAt("24 days, 18 hours, 3 minutes"),
  },
  {
    id: 'poll_mark_unfollow_friend_again_r2', 
    creator: findUser('Mark Perry'),
    question: "Is it okay to unfollow a friend on social media if their content is consistently annoying/negative? (Digital Detox)",
    imageUrls: ['https://placehold.co/600x400.png?text=UnfollowFriend'], 
    options: [
        { id: 'muf_opt1_r2', text: "Yes, protect your peace.", votes: generateRandomVotes() },
        { id: 'muf_opt2_r2', text: "No, it's rude and childish.", votes: generateRandomVotes() },
        { id: 'muf_opt3_r2', text: "Mute them instead of unfollowing.", votes: generateRandomVotes() },
        { id: 'muf_opt4_r2', text: "Talk to them about it first.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("17 hours, 49 minutes")).toISOString(),
    createdAt: generateCreatedAt("17 hours, 49 minutes"),
  },
  {
    id: 'poll_nate_dog_cat_again_r2', 
    creator: findUser('Nate Powell'),
    question: "I'm torn between getting a dog or a cat. Help me decide, fur parents! (Paws for Thought)",
    imageUrls: ['https://placehold.co/600x400.png?text=DogOrCat'], 
    options: [
        { id: 'ndc_opt1_r2', text: "Team Dog! Loyalty and adventure.", votes: generateRandomVotes() },
        { id: 'ndc_opt2_r2', text: "Team Cat! Independent and cuddly.", votes: generateRandomVotes() },
        { id: 'ndc_opt3_r2', text: "Get both if you can handle it!", votes: generateRandomVotes() },
        { id: 'ndc_opt4_r2', text: "Neither, get a fish.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("12 days, 10 hours, 14 minutes")).toISOString(),
    createdAt: generateCreatedAt("12 days, 10 hours, 14 minutes"),
  },
  {
    id: 'poll_oscar_volunteer_self_again_r2', 
    creator: findUser('Oscar Long'),
    question: "Should I volunteer my time to a cause I believe in, or focus solely on my own self-improvement right now? (Giving Back vs Growing)",
    imageUrls: ['https://placehold.co/600x400.png?text=VolunteerOrSelf'], 
    options: [
        { id: 'ovs_opt1_r2', text: "Volunteer! Give back to the community.", votes: generateRandomVotes() },
        { id: 'ovs_opt2_r2', text: "Focus on self-improvement first, then volunteer.", votes: generateRandomVotes() },
        { id: 'ovs_opt3_r2', text: "Do a little of both.", votes: generateRandomVotes() },
        { id: 'ovs_opt4_r2', text: "Join a group that combines both!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 days, 2 hours, 36 minutes")).toISOString(),
    createdAt: generateCreatedAt("6 days, 2 hours, 36 minutes"),
  },
  // New 2-option polls from the provided list
  {
    id: 'poll_newlist1_engagement_location',
    creator: findUser('Romantic Traveler'),
    question: "Engagement location in two weeks: Paris or Italy?",
    imageUrls: ['https://placehold.co/600x400.png?text=Engagement'], 
    options: [
      { id: 'el_opt1_nl1', text: 'Paris, City of Love!', votes: generateRandomVotes(), affiliateLink: 'https://example.com/paris-engagement-rings' },
      { id: 'el_opt2_nl1', text: 'Italy, Under the Tuscan Sun!', votes: generateRandomVotes(), affiliateLink: 'https://example.com/italy-villas' },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("12 days")).toISOString(),
    createdAt: generateCreatedAt("12 days"),
  },
  {
    id: 'poll_newlist1_virginity_condom',
    creator: findUser('Curious Explorer'),
    question: "Losing my virginity, condom or no condom?",
    imageUrls: ['https://placehold.co/600x400.png?text=FirstTime'], 
    options: [
      { id: 'vc_opt1_nl1', text: 'Condom: Safe is sexy!', votes: generateRandomVotes(), affiliateLink: 'https://example.com/best-condoms' },
      { id: 'vc_opt2_nl1', text: 'No Condom: Trust the moment (after testing!).', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 days")).toISOString(),
    createdAt: generateCreatedAt("7 days"),
  },
  {
    id: 'poll_newlist1_house_to_buy',
    creator: findUser('Home Buyer'),
    question: "Which house to buy? Option A or Option B?",
    imageUrls: ['https://placehold.co/600x400.png?text=HouseHunt'], 
    options: [
      { id: 'htb_opt1_nl1', text: 'Option A: The Cozy Cottage with a large garden and needing some TLC.', votes: generateRandomVotes(), imageUrl: 'https://placehold.co/300x200.png?text=Cottage', affiliateLink: 'https://example.com/fixer-upper-tools' },
      { id: 'htb_opt2_nl1', text: 'Option B: The Modern Marvel, smaller yard but move-in ready and energy efficient.', votes: generateRandomVotes(), imageUrl: 'https://placehold.co/300x200.png?text=ModernHome', affiliateLink: 'https://example.com/smart-home-devices' },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("30 days")).toISOString(),
    createdAt: generateCreatedAt("30 days"),
  },
  {
    id: 'poll_newlist1_lunch_choice', 
    creator: findUser('Hungry Harry'),
    question: "What to eat for lunch? Tuna sandwich or grilled chicken wrap?",
    imageUrls: ['https://placehold.co/600x400.png?text=LunchDecision'], 
    options: [
      { id: 'lc_opt1_nl1', text: 'Tuna Sandwich Classic', votes: generateRandomVotes() },
      { id: 'lc_opt2_nl1', text: 'Grilled Chicken Wrap Delight', votes: generateRandomVotes(), affiliateLink: 'https://example.com/healthy-wrap-recipes' },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 minute")).toISOString(),
    createdAt: generateCreatedAt("1 minute"),
  },
  {
    id: 'poll_newlist1_jazz_fest_dress',
    creator: findUser('Festival Fiona'),
    question: "Dress for the New Orleans Jazz Festival? (Two options)",
    imageUrls: ['https://placehold.co/600x400.png?text=JazzFest'], 
    options: [
      { id: 'jfd_opt1_nl1', text: 'Flowy Bohemian Dress and wide-brimmed hat for sun protection and style.', votes: generateRandomVotes(), imageUrl: 'https://placehold.co/300x200.png?text=BohoDress', affiliateLink: 'https://example.com/boho-dresses' },
      { id: 'jfd_opt2_nl1', text: 'Chic Jumpsuit with comfortable sandals, practical for dancing all day.', votes: generateRandomVotes(), imageUrl: 'https://placehold.co/300x200.png?text=Jumpsuit', affiliateLink: 'https://example.com/stylish-jumpsuits' },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("14 days")).toISOString(),
    createdAt: generateCreatedAt("14 days"),
  },
  {
    id: 'poll_newlist1_quit_job_decision',
    creator: findUser('Career Changer'),
    question: "Should I quit my job? Yes or No?",
    imageUrls: ['https://placehold.co/600x400.png?text=QuitJob'], 
    options: [
      { id: 'qj_opt1_nl1', text: 'Yes, take the leap! Life is too short to be unhappy in your career. Pursue your passion.', votes: generateRandomVotes() },
      { id: 'qj_opt2_nl1', text: 'No, stick it out a bit longer. Financial stability is important. Maybe look for ways to improve current situation.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("12 days")).toISOString(),
    createdAt: generateCreatedAt("12 days"),
  },
  {
    id: 'poll_newlist1_career_path_tech_art',
    creator: findUser('Path Seeker'),
    question: "Which career path should I pursue? Tech or Art?",
    imageUrls: ['https://placehold.co/600x400.png?text=TechVsArt'], 
    options: [
      { id: 'cpta_opt1_nl1', text: 'Tech: Innovation & Impact (and potentially higher salary).', votes: generateRandomVotes(), affiliateLink: 'https://example.com/tech-career-guide' },
      { id: 'cpta_opt2_nl1', text: 'Art: Passion & Creativity (fulfillment but maybe less stability).', votes: generateRandomVotes(), affiliateLink: 'https://example.com/art-supplies' },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("21 days")).toISOString(),
    createdAt: generateCreatedAt("21 days"),
  },
  {
    id: 'poll_newlist1_breakup_boyfriend',
    creator: findUser('Hannah Baker'), 
    question: "Should I break up with my boyfriend? Yes or No? (HB edition)",
    imageUrls: ['https://placehold.co/600x400.png?text=BreakupTime'], 
    options: [
      { id: 'bub_opt1_nl1', text: 'Yes, it\'s time to move on. You deserve happiness and growth.', votes: generateRandomVotes() },
      { id: 'bub_opt2_nl1', text: 'No, try to make it work. Every relationship has ups and downs. Communicate your needs.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("4 days")).toISOString(),
    createdAt: generateCreatedAt("4 days"),
  },
  {
    id: 'poll_newlist1_get_back_together_humor',
    creator: findUser('Hannah Baker'), 
    question: "Should we get back together? ... Asking for a friend who might be me. 😂 (HB comedy edition)",
    imageUrls: ['https://placehold.co/600x400.png?text=BackTogether'], 
    options: [
      { id: 'gbt_opt1_nl1', text: 'LOL, give it another shot! What could possibly go wrong... again?', votes: generateRandomVotes() },
      { id: 'gbt_opt2_nl1', text: 'Nah, run for the hills (again)! Some sequels are never good.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("30 minutes")).toISOString(),
    createdAt: generateCreatedAt("30 minutes"), 
  },
  {
    id: 'poll_newlist1_reunite_relative',
    creator: findUser('Family Mediator'),
    question: "Should I try to reunite with a relative I haven't gotten along with in years? (Family Feud)",
    imageUrls: ['https://placehold.co/600x400.png?text=FamilyReunion'], 
    options: [
      { id: 'rr_opt1_nl1', text: 'Yes, extend the olive branch. Life is too short for grudges.', votes: generateRandomVotes() },
      { id: 'rr_opt2_nl1', text: 'No, some bridges are best left burned. Protect your peace.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("10 days")).toISOString(),
    createdAt: generateCreatedAt("10 days"),
  },
  {
    id: 'poll_newlist1_husband_cheated',
    creator: findUser('Betrayed Spouse'),
    question: "My husband cheated, should I stay and try to work it out with therapy or take this as a sign to run? (Spousal Support)",
    imageUrls: ['https://placehold.co/600x400.png?text=CheatingHusband'], 
    options: [
      { id: 'hc_opt1_nl1', text: 'Therapy: Try to rebuild trust. It won\'t be easy, but might be worth it.', votes: generateRandomVotes(), affiliateLink: 'https://example.com/marriage-counseling' },
      { id: 'hc_opt2_nl1', text: 'Run: This is a dealbreaker. You deserve better than infidelity.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("8 hours")).toISOString(),
    createdAt: generateCreatedAt("8 hours"),
  },
  {
    id: 'poll_newlist1_jeans_fat_workout',
    creator: findUser('Fashion Conscious'),
    question: "Do these jeans make me look fat, should I workout? (Fashion Police)",
    imageUrls: ['https://placehold.co/600x400.png?text=JeansFit'], 
    options: [
      { id: 'jfw_opt1_nl1', text: 'You look great! But workout if it makes YOU feel good, not because of jeans.', votes: generateRandomVotes() },
      { id: 'jfw_opt2_nl1', text: 'It\'s the jeans, not you! Find a better pair that celebrates your shape.', votes: generateRandomVotes(), affiliateLink: 'https://example.com/flattering-jeans' },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 days")).toISOString(),
    createdAt: generateCreatedAt("3 days"),
  },
  // Polls from the first new list (user provided)
  {
    id: 'poll_userlist1_cereal_box_art', // This is the one that caused the error, now uniquely named
    creator: findUser('Cereal Consumer'),
    question: "Should I stop eating this brand of cereal now that they changed the box art and it feels weird?",
    imageUrls: ['https://placehold.co/600x400.png?text=CerealArt'],
    options: [
        { id: 'cba_opt1_ul1', text: "Yes, follow your instincts", votes: generateRandomVotes() },
        { id: 'cba_opt2_ul1', text: "Chill, it's just a box", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 days")).toISOString(),
    createdAt: generateCreatedAt("3 days"),
  },
  {
    id: 'poll_userlist1_sneaky_link_bestie',
    creator: findUser('Drama Llama'),
    question: "Should I make my bestie's man my sneaky link if he already DMed me twice?",
    imageUrls: ['https://placehold.co/600x400.png?text=SneakyLink'],
    options: [
        { id: 'slb_opt1_ul1', text: "Slide quietly", votes: generateRandomVotes() },
        { id: 'slb_opt2_ul1', text: "You need therapy", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 hour")).toISOString(),
    createdAt: generateCreatedAt("1 hour"),
  },
  {
    id: 'poll_userlist1_rapper_battle',
    creator: findUser('Rap Analyst'),
    question: "Trippie Redd vs Hurricane Wisdom — who’s the better rapper, PERIOD?",
    imageUrls: ['https://placehold.co/600x400.png?text=RapBattle'],
    options: [
        { id: 'rb_opt1_ul1', text: "Trippie Redd", votes: generateRandomVotes() },
        { id: 'rb_opt2_ul1', text: "Hurricane Wisdom", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 minutes")).toISOString(),
    createdAt: generateCreatedAt("7 minutes"),
  },
  {
    id: 'poll_userlist1_wife_beer_permission',
    creator: findUser('Thirsty Hubby'),
    question: "My wife said no to another beer. Should I crack it anyway?",
    imageUrls: ['https://placehold.co/600x400.png?text=BeerPermission'],
    options: [
        { id: 'wbp_opt1_ul1', text: "Yes, freedom is brewed", votes: generateRandomVotes() },
        { id: 'wbp_opt2_ul1', text: "Nah bro, she’s your ride", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 minute")).toISOString(),
    createdAt: generateCreatedAt("1 minute"),
  },
  {
    id: 'poll_userlist1_ghost_closure_text',
    creator: findUser('Ghost Ponderer'),
    question: "Should I ghost them or send a “weird but respectful” closure text?",
    imageUrls: ['https://placehold.co/600x400.png?text=GhostOrText'],
    options: [
        { id: 'gct_opt1_ul1', text: "Disappear like vapor", votes: generateRandomVotes() },
        { id: 'gct_opt2_ul1', text: "Be an adult-ish", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 hours")).toISOString(),
    createdAt: generateCreatedAt("6 hours"),
  },
  {
    id: 'poll_userlist1_hoodie_retirement',
    creator: findUser('Hoodie Champion'),
    question: "I’ve worn this hoodie 5 days in a row. Should I retire it for the week?",
    imageUrls: ['https://placehold.co/600x400.png?text=HoodieLife'],
    options: [
        { id: 'hr_opt1_ul1', text: "Yes, it’s time", votes: generateRandomVotes() },
        { id: 'hr_opt2_ul1', text: "No, it’s seasoned now", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("12 hours")).toISOString(),
    createdAt: generateCreatedAt("12 hours"),
  },
  {
    id: 'poll_userlist1_chicken_tenders_date',
    creator: findUser('Tender Lover'),
    question: "She only eats chicken tenders. Should I still take her seriously?",
    imageUrls: ['https://placehold.co/600x400.png?text=TenderDate'],
    options: [
        { id: 'ctd_opt1_ul1', text: "Yes, love her anyway", votes: generateRandomVotes() },
        { id: 'ctd_opt2_ul1', text: "No, she’s a grown toddler", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("9 minutes")).toISOString(),
    createdAt: generateCreatedAt("9 minutes"),
  },
  {
    id: 'poll_userlist1_thirst_trap_respect',
    creator: findUser('Insta Model'),
    question: "Should I post the thirst trap or keep it respectful today?",
    imageUrls: ['https://placehold.co/600x400.png?text=ThirstTrap'],
    options: [
        { id: 'ttr_opt1_ul1', text: "Trap responsibly", votes: generateRandomVotes() },
        { id: 'ttr_opt2_ul1', text: "Respect your grandma", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days")).toISOString(),
    createdAt: generateCreatedAt("2 days"),
  },
  {
    id: 'poll_userlist1_ignore_message_normal',
    creator: findUser('Message Ignorer'),
    question: "Should I pretend I didn’t see the message or answer like a normal person?",
    imageUrls: ['https://placehold.co/600x400.png?text=MessageDilemma'],
    options: [
        { id: 'imn_opt1_ul1', text: "Ignore it, power move", votes: generateRandomVotes() },
        { id: 'imn_opt2_ul1', text: "Be a real human", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("45 minutes")).toISOString(),
    createdAt: generateCreatedAt("45 minutes"),
  },
  {
    id: 'poll_userlist1_charger_return_keep',
    creator: findUser('Charger Keeper'),
    question: "They left their charger at my place. Return it or keep it?",
    imageUrls: ['https://placehold.co/600x400.png?text=ChargerConundrum'],
    options: [
        { id: 'crk_opt1_ul1', text: "Give it back", votes: generateRandomVotes() },
        { id: 'crk_opt2_ul1', text: "Finders keepers", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("31 days")).toISOString(),
    createdAt: generateCreatedAt("31 days"),
  },
  {
    id: 'poll_userlist1_party_snacks_selfies',
    creator: findUser('Party Planner'),
    question: "I’m invited to two birthday parties. Do I go to the one with better snacks or the one with better lighting for selfies?",
    imageUrls: ['https://placehold.co/600x400.png?text=PartyChoice'],
    options: [
        { id: 'pss_opt1_ul1', text: "Snacks always", votes: generateRandomVotes() },
        { id: 'pss_opt2_ul1', text: "Give the gram what it needs", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("5 hours")).toISOString(),
    createdAt: generateCreatedAt("5 hours"),
  },
  {
    id: 'poll_userlist1_podcast_trauma_dump',
    creator: findUser('Podcast Dreamer'),
    question: "Should I start a podcast or just keep trauma dumping on my friends?",
    imageUrls: ['https://placehold.co/600x400.png?text=PodcastOrFriends'],
    options: [
        { id: 'ptd_opt1_ul1', text: "Start the pod", votes: generateRandomVotes() },
        { id: 'ptd_opt2_ul1', text: "They knew the risks", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("14 days")).toISOString(),
    createdAt: generateCreatedAt("14 days"),
  },
  {
    id: 'poll_userlist1_spotify_stalk_confess',
    creator: findUser('Spotify Stalker'),
    question: "Should I tell them I stalked their Spotify before the first date?",
    imageUrls: ['https://placehold.co/600x400.png?text=SpotifyConfession'],
    options: [
        { id: 'ssc_opt1_ul1', text: "Yes, it's cute", votes: generateRandomVotes() },
        { id: 'ssc_opt2_ul1', text: "No, you're insane", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 minutes"),
  },
  {
    id: 'poll_userlist1_lol_ok_meaning',
    creator: findUser('Text Detective'),
    question: "They said “lol ok” — are they mad or just dry texting?",
    imageUrls: ['https://placehold.co/600x400.png?text=LolOkMystery'],
    options: [
        { id: 'lom_opt1_ul1', text: "Mad AF", votes: generateRandomVotes() },
        { id: 'lom_opt2_ul1', text: "Nah they just boring", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("18 hours")).toISOString(),
    createdAt: generateCreatedAt("18 hours"),
  },
  {
    id: 'poll_userlist1_hiking_touch_grass',
    creator: findUser('Grass Avoider'),
    question: "I don’t even like hiking. Should I still go just to say I touched grass?",
    imageUrls: ['https://placehold.co/600x400.png?text=TouchGrass'],
    options: [
        { id: 'htg_opt1_ul1', text: "Yes, impress your feed", votes: generateRandomVotes() },
        { id: 'htg_opt2_ul1', text: "No, stay dusty", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 day")).toISOString(),
    createdAt: generateCreatedAt("1 day"),
  },
  {
    id: 'poll_userlist1_tattoo_idea_list_new_person',
    creator: findUser('Tattoo Thinker'),
    question: "I just met them. Should I add their name to my tattoo idea list or chill tf out?",
    imageUrls: ['https://placehold.co/600x400.png?text=NewPersonTattoo'],
    options: [
        { id: 'tilnp_opt1_ul1', text: "Ink the risk", votes: generateRandomVotes() },
        { id: 'tilnp_opt2_ul1', text: "Breathe and block", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 days")).toISOString(),
    createdAt: generateCreatedAt("3 days"),
  },
  {
    id: 'poll_userlist1_ex_dog_pic_like',
    creator: findUser('Dog Pic Defender'),
    question: "My ex just liked my dog’s pic. Should I block or bark back?",
    imageUrls: ['https://placehold.co/600x400.png?text=ExDogLike'],
    options: [
        { id: 'edpl_opt1_ul1', text: "Block them", votes: generateRandomVotes() },
        { id: 'edpl_opt2_ul1', text: "Bark respectfully", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("22 minutes")).toISOString(),
    createdAt: generateCreatedAt("22 minutes"),
  },
  {
    id: 'poll_userlist1_quit_job_spiritually_dead',
    creator: findUser('Job Quitter Pro'),
    question: "Should I quit my job or keep collecting the paycheck while spiritually dead inside?",
    imageUrls: ['https://placehold.co/600x400.png?text=SoulCrushingJob'],
    options: [
        { id: 'qjsd_opt1_ul1', text: "Quit. Die loud.", votes: generateRandomVotes() },
        { id: 'qjsd_opt2_ul1', text: "Stay. Die silent.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("31 days")).toISOString(),
    createdAt: generateCreatedAt("31 days"),
  },
  {
    id: 'poll_userlist1_playlist_string_cheese',
    creator: findUser('Cheese Critic'),
    question: "Their playlist is 🔥 but they eat string cheese sideways. Should I still date them?",
    imageUrls: ['https://placehold.co/600x400.png?text=StringCheeseCrime'],
    options: [
        { id: 'psc_opt1_ul1', text: "Let it slide", votes: generateRandomVotes() },
        { id: 'psc_opt2_ul1', text: "Absolute jail", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 hours")).toISOString(),
    createdAt: generateCreatedAt("7 hours"),
  },
  {
    id: 'poll_userlist1_feet_pics_gas_money',
    creator: findUser('Feet Pic Financier'),
    question: "Should I sell feet pics to afford gas or just start walking like it’s 1852?",
    imageUrls: ['https://placehold.co/600x400.png?text=FeetPicsForGas'],
    options: [
        { id: 'fpgm_opt1_ul1', text: "Secure the bag", votes: generateRandomVotes() },
        { id: 'fpgm_opt2_ul1', text: "Pioneer mode", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("4 days")).toISOString(),
    createdAt: generateCreatedAt("4 days"),
  },
  // Polls from the second new list (user provided)
  {
    id: 'poll_userlist2_toxic_trait_closure_ghosted',
    creator: findUser('Toxic Trait Tom'),
    question: "My toxic trait is thinking I need closure from someone I ghosted. Should I message them?",
    imageUrls: ['https://placehold.co/600x400.png?text=ToxicClosure'],
    options: [
        { id: 'ttcg_opt1_ul2', text: "Yes, give them whiplash", votes: generateRandomVotes() },
        { id: 'ttcg_opt2_ul2', text: "No, vanish like smoke", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 hours")).toISOString(),
    createdAt: generateCreatedAt("3 hours"),
  },
  {
    id: 'poll_userlist2_forgave_drunk_reminder',
    creator: findUser('Delulu Deb'),
    question: "She said she forgave me but still brings it up when she’s drunk. Should I leave or stay delusional?",
    imageUrls: ['https://placehold.co/600x400.png?text=DrunkForgiveness'],
    options: [
        { id: 'fdr_opt1_ul2', text: "Pack your pride", votes: generateRandomVotes() },
        { id: 'fdr_opt2_ul2', text: "Stay & gaslight back", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 day")).toISOString(),
    createdAt: generateCreatedAt("1 day"),
  },
  {
    id: 'poll_userlist2_charger_9_months',
    creator: findUser('Charger Hoarder'),
    question: "I haven’t returned their charger for 9 months. Is it mine now?",
    imageUrls: ['https://placehold.co/600x400.png?text=ChargerPossession'],
    options: [
        { id: 'c9m_opt1_ul2', text: "Yes, it’s inherited", votes: generateRandomVotes() },
        { id: 'c9m_opt2_ul2', text: "No, be a person", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days")).toISOString(),
    createdAt: generateCreatedAt("2 days"),
  },
  {
    id: 'poll_userlist2_cold_spaghetti_standards',
    creator: findUser('Fridge Raider'),
    question: "Should I eat this cold spaghetti straight out the fridge or pretend I have standards?",
    imageUrls: ['https://placehold.co/600x400.png?text=ColdSpaghetti'],
    options: [
        { id: 'css_opt1_ul2', text: "Fork it up", votes: generateRandomVotes() },
        { id: 'css_opt2_ul2', text: "Microwave your self-worth", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 hour")).toISOString(),
    createdAt: generateCreatedAt("1 hour"),
  },
  {
    id: 'poll_userlist2_rewatch_texts_wounds',
    creator: findUser('Archive Diver'),
    question: "Should I rewatch our texts from 2021 or let my emotional wounds scab?",
    imageUrls: ['https://placehold.co/600x400.png?text=RewatchTexts'],
    options: [
        { id: 'rtw_opt1_ul2', text: "Open the archive", votes: generateRandomVotes() },
        { id: 'rtw_opt2_ul2', text: "Block and breathe", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("45 minutes")).toISOString(),
    createdAt: generateCreatedAt("45 minutes"),
  },
  {
    id: 'poll_userlist2_you_up_reply',
    creator: findUser('Late Night Texter'),
    question: "They said “you up?” at 2:47am. Should I reply or rise above it?",
    imageUrls: ['https://placehold.co/600x400.png?text=YouUpText'],
    options: [
        { id: 'yur_opt1_ul2', text: "Text back “hi 😈”", votes: generateRandomVotes() },
        { id: 'yur_opt2_ul2', text: "Unfollow with grace", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("5 minutes")).toISOString(),
    createdAt: generateCreatedAt("5 minutes"),
  },
  {
    id: 'poll_userlist2_situationship_risk',
    creator: findUser('Chaos Agent'),
    question: "Should I risk it all for a situationship with someone who doesn’t know my last name?",
    imageUrls: ['https://placehold.co/600x400.png?text=SituationshipChaos'],
    options: [
        { id: 'sr_opt1_ul2', text: "Yes, chaos is hot", votes: generateRandomVotes() },
        { id: 'sr_opt2_ul2', text: "No, heal please", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 days")).toISOString(),
    createdAt: generateCreatedAt("6 days"),
  },
  {
    id: 'poll_userlist2_toothbrush_confront',
    creator: findUser('Toothbrush Sharer'),
    question: "He said he’s not ready for a relationship, but we share a toothbrush. Should I confront him?",
    imageUrls: ['https://placehold.co/600x400.png?text=ToothbrushRelationship'],
    options: [
        { id: 'tc_opt1_ul2', text: "Ask him boldly", votes: generateRandomVotes() },
        { id: 'tc_opt2_ul2', text: "Just take the brush", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 minute")).toISOString(),
    createdAt: generateCreatedAt("1 minute"),
  },
  {
    id: 'poll_userlist2_bestie_ex_stories',
    creator: findUser('Story Blocker'),
    question: "My bestie’s ex keeps watching my stories. Should I block or flirt harder?",
    imageUrls: ['https://placehold.co/600x400.png?text=ExWatchingStories'],
    options: [
        { id: 'bes_opt1_ul2', text: "Block with honor", votes: generateRandomVotes() },
        { id: 'bes_opt2_ul2', text: "Tap in for revenge", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("12 hours")).toISOString(),
    createdAt: generateCreatedAt("12 hours"),
  },
  {
    id: 'poll_userlist2_venmo_fries_request',
    creator: findUser('Fries Fighter'),
    question: "They Venmo requested $4.37 for fries. Should I pay or fight?",
    imageUrls: ['https://placehold.co/600x400.png?text=VenmoFries'],
    options: [
        { id: 'vfr_opt1_ul2', text: "Pay it, peasant", votes: generateRandomVotes() },
        { id: 'vfr_opt2_ul2', text: "Block them and fry back", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 minutes"),
  },
  {
    id: 'poll_userlist2_text_ex_mom',
    creator: findUser('Ex Mom Texter'),
    question: "Should I finally stop texting my ex’s mom or is that still fair game?",
    imageUrls: ['https://placehold.co/600x400.png?text=ExMomTexts'],
    options: [
        { id: 'tem_opt1_ul2', text: "Let go of the fam", votes: generateRandomVotes() },
        { id: 'tem_opt2_ul2', text: "She was cool tho", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 days")).toISOString(),
    createdAt: generateCreatedAt("3 days"),
  },
  {
    id: 'poll_userlist2_not_like_other_people',
    creator: findUser('Red Flag Racer'),
    question: "They said “I’m not like other people.” Should I run or give them a shot?",
    imageUrls: ['https://placehold.co/600x400.png?text=NotLikeOthers'],
    options: [
        { id: 'nlop_opt1_ul2', text: "Run", votes: generateRandomVotes() },
        { id: 'nlop_opt2_ul2', text: "Date the red flag", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("31 days")).toISOString(),
    createdAt: generateCreatedAt("31 days"),
  },
  {
    id: 'poll_userlist2_podcast_group_chat_dump',
    creator: findUser('Group Chat Guru'),
    question: "Should I start a podcast or just trauma-dump in the group chat again?",
    imageUrls: ['https://placehold.co/600x400.png?text=PodcastOrGroupChat'],
    options: [
        { id: 'pgcd_opt1_ul2', text: "Start the show", votes: generateRandomVotes() },
        { id: 'pgcd_opt2_ul2', text: "The GC knew the risk", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 days")).toISOString(),
    createdAt: generateCreatedAt("7 days"),
  },
  {
    id: 'poll_userlist2_kitkat_eating_method',
    creator: findUser('KitKat Connoisseur'),
    question: "They eat Kit Kats without breaking them. Is this relationship sustainable?",
    imageUrls: ['https://placehold.co/600x400.png?text=KitKatCrime'],
    options: [
        { id: 'kem_opt1_ul2', text: "No, that’s psychotic", votes: generateRandomVotes() },
        { id: 'kem_opt2_ul2', text: "Yes, love is layered", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("4 hours")).toISOString(),
    createdAt: generateCreatedAt("4 hours"),
  },
  {
    id: 'poll_userlist2_hoodie_hostage_return',
    creator: findUser('Hoodie Hostage Holder'), // Differentiated user
    question: "I wore their hoodie after the breakup. Should I give it back or hold it hostage?",
    imageUrls: ['https://placehold.co/600x400.png?text=HoodieHostage'],
    options: [
        { id: 'hhr_opt1_ul2', text: "Return it with tears", votes: generateRandomVotes() },
        { id: 'hhr_opt2_ul2', text: "It’s yours now", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 minutes")).toISOString(),
    createdAt: generateCreatedAt("6 minutes"),
  },
  {
    id: 'poll_userlist2_dm_after_likes',
    creator: findUser('DM Slider'),
    question: "Should I DM the person who just liked 6 of my posts in a row?",
    imageUrls: ['https://placehold.co/600x400.png?text=DMTheLiker'],
    options: [
        { id: 'dal_opt1_ul2', text: "Slide while it’s warm", votes: generateRandomVotes() },
        { id: 'dal_opt2_ul2', text: "Don’t feed the thirst", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("9 hours")).toISOString(),
    createdAt: generateCreatedAt("9 hours"),
  },
  {
    id: 'poll_userlist2_wyd_mid_crisis_reply',
    creator: findUser('Crisis Responder'),
    question: "They hit me with “wyd” but I was mid-crisis. Should I reply or disappear again?",
    imageUrls: ['https://placehold.co/600x400.png?text=WydCrisis'],
    options: [
        { id: 'wmcr_opt1_ul2', text: "Reply “just vibing”", votes: generateRandomVotes() },
        { id: 'wmcr_opt2_ul2', text: "Don’t explain yourself", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 day")).toISOString(),
    createdAt: generateCreatedAt("1 day"),
  },
  {
    id: 'poll_userlist2_friend_bad_breath',
    creator: findUser('Breath Buddy'),
    question: "My friend has bad breath. Should I say something or let God handle it?",
    imageUrls: ['https://placehold.co/600x400.png?text=BadBreathFriend'],
    options: [
        { id: 'fbb_opt1_ul2', text: "Be honest, gentle", votes: generateRandomVotes() },
        { id: 'fbb_opt2_ul2', text: "Not your ministry", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("18 minutes")).toISOString(),
    createdAt: generateCreatedAt("18 minutes"),
  },
  {
    id: 'poll_userlist2_cancel_plans_ugly_day',
    creator: findUser('Ugly Day Canceller'),
    question: "Should I cancel plans because I feel 2% ugly today?",
    imageUrls: ['https://placehold.co/600x400.png?text=UglyDayPlans'],
    options: [
        { id: 'cpud_opt1_ul2', text: "Cancel with pride", votes: generateRandomVotes() },
        { id: 'cpud_opt2_ul2', text: "Push through the mid", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("10 hours")).toISOString(),
    createdAt: generateCreatedAt("10 hours"),
  },
  {
    id: 'poll_userlist2_create_own_poll_unhinged',
    creator: findUser('Poll Progenitor'),
    question: "Should I create my own poll because I’m tired of pretending I don’t have unhinged opinions too?",
    imageUrls: ['https://placehold.co/600x400.png?text=UnhingedPoll'],
    options: [
        { id: 'copu_opt1_ul2', text: "Do it now", votes: generateRandomVotes() },
        { id: 'copu_opt2_ul2', text: "This is your sign", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days")).toISOString(),
    createdAt: generateCreatedAt("2 days"),
  },
];


const allPollsFull: Poll[] = initialPolls.map((pollSkeleton, index) => {
  const totalVotes = pollSkeleton.options.reduce((sum, option) => sum + option.votes, 0);
  
  // Make every third poll appear as "voted", and for its first option
  const shouldBeVoted = (index % 3 === 0); 
  let determinedVotedOptionId: string | undefined = undefined;
  if (shouldBeVoted && pollSkeleton.options.length > 0) {
    determinedVotedOptionId = pollSkeleton.options[0].id; 
  }

  let pledgeAmount = generateRandomPledge(false); 
  let tipCountGenerated = generateRandomTips();
  
  const likes = (index * 17 % 250) + 10; 
  const commentsCount = (index * 7 % 35) + 2;

  // Specific pledges and tips based on original logic
  if (pollSkeleton.id === 'poll_sophia_vcard_main') { pledgeAmount = 100; tipCountGenerated = 16; }
  else if (pollSkeleton.id === 'poll_sophia_houseplant') { pledgeAmount = 30; tipCountGenerated = 12; }
  else if (pollSkeleton.id === 'poll_alex_code') { pledgeAmount = 5; tipCountGenerated = 4; }
  else if (pollSkeleton.id === 'poll_emma_ghosting') { pledgeAmount = 50; } // tipCountGenerated will be random
  // For polls from user's lists:
  else if (pollSkeleton.id === 'poll_userlist1_cereal_box_art') { pledgeAmount = 7; tipCountGenerated = 2; }
  else if (pollSkeleton.id === 'poll_userlist1_sneaky_link_bestie') { pledgeAmount = 50; tipCountGenerated = 8; }
  else if (pollSkeleton.id === 'poll_userlist1_rapper_battle') { pledgeAmount = 3; tipCountGenerated = 1; }
  else if (pollSkeleton.id === 'poll_userlist1_wife_beer_permission') { pledgeAmount = 100; tipCountGenerated = 12; }
  else if (pollSkeleton.id === 'poll_userlist1_ghost_closure_text') { pledgeAmount = 15; tipCountGenerated = 5; }
  else if (pollSkeleton.id === 'poll_userlist1_hoodie_retirement') { pledgeAmount = 4; tipCountGenerated = 0; }
  else if (pollSkeleton.id === 'poll_userlist1_chicken_tenders_date') { pledgeAmount = 22; tipCountGenerated = 3; }
  else if (pollSkeleton.id === 'poll_userlist1_thirst_trap_respect') { pledgeAmount = 13; tipCountGenerated = 1; }
  else if (pollSkeleton.id === 'poll_userlist1_ignore_message_normal') { pledgeAmount = 6; tipCountGenerated = 0; }
  else if (pollSkeleton.id === 'poll_userlist1_charger_return_keep') { pledgeAmount = 5; tipCountGenerated = 6; }
  else if (pollSkeleton.id === 'poll_userlist1_party_snacks_selfies') { pledgeAmount = 20; tipCountGenerated = 3; }
  else if (pollSkeleton.id === 'poll_userlist1_podcast_trauma_dump') { pledgeAmount = 27; tipCountGenerated = 2; }
  else if (pollSkeleton.id === 'poll_userlist1_spotify_stalk_confess') { pledgeAmount = 2; tipCountGenerated = 1; }
  else if (pollSkeleton.id === 'poll_userlist1_lol_ok_meaning') { pledgeAmount = 8; tipCountGenerated = 9; }
  else if (pollSkeleton.id === 'poll_userlist1_hiking_touch_grass') { pledgeAmount = 11; tipCountGenerated = 4; }
  else if (pollSkeleton.id === 'poll_userlist1_tattoo_idea_list_new_person') { pledgeAmount = 30; tipCountGenerated = 7; }
  else if (pollSkeleton.id === 'poll_userlist1_ex_dog_pic_like') { pledgeAmount = 9; tipCountGenerated = 0; }
  else if (pollSkeleton.id === 'poll_userlist1_quit_job_spiritually_dead') { pledgeAmount = 75; tipCountGenerated = 15; }
  else if (pollSkeleton.id === 'poll_userlist1_playlist_string_cheese') { pledgeAmount = 10; tipCountGenerated = 2; }
  else if (pollSkeleton.id === 'poll_userlist1_feet_pics_gas_money') { pledgeAmount = 40; tipCountGenerated = 6; }
  else if (pollSkeleton.id === 'poll_userlist2_toxic_trait_closure_ghosted') { pledgeAmount = 15; tipCountGenerated = 4; }
  else if (pollSkeleton.id === 'poll_userlist2_forgave_drunk_reminder') { pledgeAmount = 22; tipCountGenerated = 6; }
  else if (pollSkeleton.id === 'poll_userlist2_charger_9_months') { pledgeAmount = 8; tipCountGenerated = 1; }
  else if (pollSkeleton.id === 'poll_userlist2_cold_spaghetti_standards') { pledgeAmount = 5; tipCountGenerated = 0; }
  else if (pollSkeleton.id === 'poll_userlist2_rewatch_texts_wounds') { pledgeAmount = 13; tipCountGenerated = 2; }
  else if (pollSkeleton.id === 'poll_userlist2_you_up_reply') { pledgeAmount = 40; tipCountGenerated = 3; }
  else if (pollSkeleton.id === 'poll_userlist2_situationship_risk') { pledgeAmount = 50; tipCountGenerated = 7; }
  else if (pollSkeleton.id === 'poll_userlist2_toothbrush_confront') { pledgeAmount = 100; tipCountGenerated = 12; }
  else if (pollSkeleton.id === 'poll_userlist2_bestie_ex_stories') { pledgeAmount = 33; tipCountGenerated = 9; }
  else if (pollSkeleton.id === 'poll_userlist2_venmo_fries_request') { pledgeAmount = 4.37; tipCountGenerated = 0; }
  else if (pollSkeleton.id === 'poll_userlist2_text_ex_mom') { pledgeAmount = 18; tipCountGenerated = 5; }
  else if (pollSkeleton.id === 'poll_userlist2_not_like_other_people') { pledgeAmount = 11; tipCountGenerated = 1; }
  else if (pollSkeleton.id === 'poll_userlist2_podcast_group_chat_dump') { pledgeAmount = 27; tipCountGenerated = 4; }
  else if (pollSkeleton.id === 'poll_userlist2_kitkat_eating_method') { pledgeAmount = 6; tipCountGenerated = 2; }
  else if (pollSkeleton.id === 'poll_userlist2_hoodie_hostage_return') { pledgeAmount = 15; tipCountGenerated = 3; }
  else if (pollSkeleton.id === 'poll_userlist2_dm_after_likes') { pledgeAmount = 10; tipCountGenerated = 1; }
  else if (pollSkeleton.id === 'poll_userlist2_wyd_mid_crisis_reply') { pledgeAmount = 20; tipCountGenerated = 2; }
  else if (pollSkeleton.id === 'poll_userlist2_friend_bad_breath') { pledgeAmount = 8; tipCountGenerated = 6; }
  else if (pollSkeleton.id === 'poll_userlist2_cancel_plans_ugly_day') { pledgeAmount = 14; tipCountGenerated = 3; }
  else if (pollSkeleton.id === 'poll_userlist2_create_own_poll_unhinged') { pledgeAmount = 0; tipCountGenerated = 0; }


  return {
    ...pollSkeleton,
    totalVotes,
    isVoted: shouldBeVoted,
    votedOptionId: determinedVotedOptionId,
    likes,
    commentsCount,
    pledgeAmount,
    tipCount: tipCountGenerated,
  };
});


export const mockPolls: Poll[] = allPollsFull;


export const fetchMorePolls = async (offset: number, limit: number): Promise<Poll[]> => {
  console.log(`Fetching more polls: offset ${offset}, limit ${limit}`);
  
  const newPollsToServe = mockPolls.slice(offset, offset + limit);

  if (newPollsToServe.length > 0) {
     return new Promise(resolve => {
        setTimeout(() => {
            resolve(newPollsToServe);
        }, 300);
     });
  }
  
  return new Promise(resolve => {
      setTimeout(() => {
          resolve([]);
      }, 300);
  });
};
