
import type { Poll, User } from '@/types';

const generateRandomVotes = () => Math.floor(Math.random() * 300) + 10;

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
  { name: 'Henry Bailey' }, { name: 'Ian Cooper' }, { name: 'Jack Rivera' }, { name: 'Justin Howard' },
  { name: 'David Kelly' }, { name: 'Michael Sanders' }, { name: 'James Price' }, { name: 'John Bennett' },
  { name: 'Robert Wood' }, { name: 'Ben Ross' }, { name: 'Chris Henderson' }, { name: 'Daniel Coleman' },
  { name: 'Leo Jenkins' }, { name: 'Mark Perry' }, { name: 'Nate Powell' }, { name: 'Oscar Long' }
];

export const mockUsers: User[] = usersData.map((user, index) => ({
  id: `user${index + 1}`,
  name: user.name,
  avatarUrl: 'https://placehold.co/100x100.png', // data-ai-hint="profile avatar" will be in component
  username: user.name.toLowerCase().replace(/\s+/g, '').substring(0, 6) + (Math.floor(Math.random() * 90) + 10),
}));

const parseTimeRemaining = (timeString: string): number => {
  let totalMilliseconds = 0;
  const daysMatch = timeString.match(/(\d+)\s*days?/);
  const hoursMatch = timeString.match(/(\d+)\s*hours?/);
  const minutesMatch = timeString.match(/(\d+)\s*minutes?/);

  if (daysMatch) totalMilliseconds += parseInt(daysMatch[1], 10) * 24 * 60 * 60 * 1000;
  if (hoursMatch) totalMilliseconds += parseInt(hoursMatch[1], 10) * 60 * 60 * 1000;
  if (minutesMatch) totalMilliseconds += parseInt(minutesMatch[1], 10) * 60 * 1000;
  
  return totalMilliseconds;
};

const getRandomUser = (): User => mockUsers[Math.floor(Math.random() * mockUsers.length)];
const findUser = (name: string): User => mockUsers.find(u => u.name.startsWith(name)) || getRandomUser();

const initialPolls: Poll[] = [
  {
    id: 'poll1',
    creator: findUser('Alice Wonderland'),
    question: 'What is your favorite season?',
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="seasons nature"
    options: [
      { id: 'opt1a', text: 'Spring', votes: 120, imageUrl: 'https://placehold.co/300x200.png' },
      { id: 'opt1b', text: 'Summer', votes: 250, imageUrl: 'https://placehold.co/300x200.png' },
      { id: 'opt1c', text: 'Autumn', votes: 180, imageUrl: 'https://placehold.co/300x200.png' },
      { id: 'opt1d', text: 'Winter', votes: 90, imageUrl: 'https://placehold.co/300x200.png' },
    ],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 350,
    totalVotes: 640,
    commentsCount: 15,
    isVoted: false,
    pledgeAmount: Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 5 : undefined,
    tipCount: Math.floor(Math.random() * 20),
  },
  {
    id: 'poll2',
    creator: findUser('Bob The Builder'),
    question: 'Best programming language for beginners in 2024?',
    options: [
      { id: 'opt2a', text: 'Python', votes: 300 },
      { id: 'opt2b', text: 'JavaScript', votes: 280 },
      { id: 'opt2c', text: 'Java', votes: 150 },
      { id: 'opt2d', text: 'C#', votes: 100 },
    ],
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 420,
    totalVotes: 830,
    commentsCount: 22,
    isVoted: true,
    votedOptionId: 'opt2a',
    pledgeAmount: Math.random() > 0.8 ? Math.floor(Math.random() * 30) + 10 : undefined,
    tipCount: Math.floor(Math.random() * 10),
  },
  {
    id: 'poll3',
    creator: findUser('Charlie Chaplin'),
    question: 'Which travel destination for next summer?',
    videoUrl: 'placeholder-video-url',
    options: [
      { id: 'opt3a', text: 'Paris, France', votes: 180, videoUrl: 'placeholder-option-video-url' },
      { id: 'opt3b', text: 'Tokyo, Japan', votes: 220, videoUrl: 'placeholder-option-video-url' },
      { id: 'opt3c', text: 'Rome, Italy', votes: 160, videoUrl: 'placeholder-option-video-url' },
    ],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    likes: 210,
    totalVotes: 560,
    commentsCount: 8,
    isVoted: false,
    tipCount: Math.floor(Math.random() * 15),
  },
  // Sophia V-card poll (was Jack in user list)
  {
    id: 'poll_sophia_vcard',
    creator: findUser('Sophia Miller'), // Ensuring Sophia is the creator
    question: "Finna lose my V-card, besties. To wrap it or not to wrap it? Low-key kinda nervous but also wanna YOLO. What's the tea?",
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="young adult girl thoughtful"
    options: [
      { id: 'sv_opt1', text: "Wrap it like it's your favorite mixtape ('cause STIs are NOT a vibe).", votes: generateRandomVotes() },
      { id: 'sv_opt2', text: "The stars whisper secrets of protection... and pleasure. Choose wisely.", votes: generateRandomVotes() },
      { id: 'sv_opt3', text: "Raw doggin' it? Only if you both got clean bills of health & discussed risks. Otherwise, glove up!", votes: generateRandomVotes() },
      { id: 'sv_opt4', text: "Let the spirits guide you... to the condom aisle. Then flip a coin for flavor.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 hours, 38 minutes")).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 200) + 50,
    totalVotes: 0, // Will be calculated
    commentsCount: Math.floor(Math.random() * 20) + 5,
    isVoted: Math.random() > 0.5,
    pledgeAmount: 100,
    tipCount: 16,
  },
  // Sophia houseplant poll
  {
    id: 'poll_sophia_houseplant',
    creator: findUser('Sophia Miller'),
    question: 'My houseplant is getting too big for its pot. Do I repot it, or prune it back aggressively?',
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="houseplant pot growth"
    options: [
      { id: 'sh_opt1', text: 'Repot it! Let it flourish.', votes: generateRandomVotes() },
      { id: 'sh_opt2', text: 'Prune it, keep it manageable.', votes: generateRandomVotes() },
      { id: 'sh_opt3', text: 'Get a bigger house for your plant.', votes: generateRandomVotes() },
      { id: 'sh_opt4', text: 'Donate it to a botanical garden.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("22 hours, 14 minutes")).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 150) + 20,
    totalVotes: 0,
    commentsCount: Math.floor(Math.random() * 10),
    isVoted: Math.random() > 0.5,
    pledgeAmount: 30,
    tipCount: 12,
  },
  // Alex code poll
  {
    id: 'poll_alex_code',
    creator: findUser('Alex Johnson'),
    question: 'Should I learn to code to boost my career, or is it too late for an old dog to learn new tricks?',
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="coding career computer"
    options: [
      { id: 'ac_opt1', text: 'Never too late! Code away!', votes: generateRandomVotes() },
      { id: 'ac_opt2', text: 'Focus on refining current skills.', votes: generateRandomVotes() },
      { id: 'ac_opt3', text: 'Try a beginner course, see if it sticks.', votes: generateRandomVotes() },
      { id: 'ac_opt4', text: 'Network instead of code.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("10 days, 21 hours, 10 minutes")).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 200),
    totalVotes: 0,
    commentsCount: Math.floor(Math.random() * 15),
    isVoted: Math.random() > 0.5,
    pledgeAmount: 5,
    tipCount: 4,
  },
  // Emma ghosting poll
  {
    id: 'poll_emma_ghosting',
    creator: findUser('Emma Davis'),
    question: 'My best friend keeps ghosting me for their new significant other. Do I confront them or just accept our friendship has changed?',
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="friendship conflict couple"
    options: [
      { id: 'eg_opt1', text: 'Confront them, open communication is vital.', votes: generateRandomVotes() },
      { id: 'eg_opt2', text: 'Give them space, they\'ll come back around.', votes: generateRandomVotes() },
      { id: 'eg_opt3', text: 'Find new friends who prioritize you.', votes: generateRandomVotes() },
      { id: 'eg_opt4', text: 'Send a passive-aggressive meme.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 16 hours, 28 minutes")).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 180),
    totalVotes: 0,
    commentsCount: Math.floor(Math.random() * 25),
    isVoted: Math.random() > 0.5,
    pledgeAmount: 50,
    tipCount: Math.floor(Math.random() * 20), // Random tip count
  },
  // Liam cold pizza poll
  {
    id: 'poll_liam_pizza',
    creator: findUser('Liam Garcia'),
    question: "Is it ever okay to eat cold pizza for breakfast? Asking for a friend who's currently staring at a leftover slice.",
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="pizza breakfast food"
    options: [
      { id: 'lp_opt1', text: "Absolutely, it's a breakfast staple!", votes: generateRandomVotes() },
      { id: 'lp_opt2', text: "No, heat it up or don't bother.", votes: generateRandomVotes() },
      { id: 'lp_opt3', text: "Only if you're desperate.", votes: generateRandomVotes() },
      { id: 'lp_opt4', text: "It's a culinary crime.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("4 days, 15 hours, 48 minutes")).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 250),
    totalVotes: 0,
    commentsCount: Math.floor(Math.random() * 30),
    isVoted: Math.random() > 0.5,
    tipCount: Math.floor(Math.random() * 10),
  },
  // Olivia roommate poll
  {
    id: 'poll_olivia_roommate',
    creator: findUser('Olivia Rodriguez'),
    question: 'My roommate never cleans. Do I create a chore chart, or passive-aggressively clean only my side?',
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="roommate cleaning chores"
    options: [
      { id: 'or_opt1', text: 'Chore chart! Clear expectations.', votes: generateRandomVotes() },
      { id: 'or_opt2', text: 'Passive aggression wins every time.', votes: generateRandomVotes() },
      { id: 'or_opt3', text: 'Move out.', votes: generateRandomVotes() },
      { id: 'or_opt4', text: 'Hire a cleaner for common areas.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 day, 20 hours, 14 minutes")).toISOString(),
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 100),
    totalVotes: 0,
    commentsCount: Math.floor(Math.random() * 18),
    isVoted: Math.random() > 0.5,
    tipCount: Math.floor(Math.random() * 8),
  },
  // Noah bangs poll
  {
    id: 'poll_noah_bangs',
    creator: findUser('Noah Smith'),
    question: 'Should I get bangs? It feels like a big commitment for my face shape.',
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="haircut bangs style"
    options: [
      { id: 'nb_opt1', text: 'Go for it! Hair grows back.', votes: generateRandomVotes() },
      { id: 'nb_opt2', text: 'No bangs, too much maintenance.', votes: generateRandomVotes() },
      { id: 'nb_opt3', text: 'Try clip-in bangs first.', votes: generateRandomVotes() },
      { id: 'nb_opt4', text: 'Ask your stylist for their professional opinion.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("17 hours, 20 minutes")).toISOString(),
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 90),
    totalVotes: 0,
    commentsCount: Math.floor(Math.random() * 12),
    isVoted: Math.random() > 0.5,
    tipCount: Math.floor(Math.random() * 5),
  },
  // Ava lunch poll
  {
    id: 'poll_ava_lunch',
    creator: findUser('Ava Williams'),
    question: "I've got 5 minutes to decide on lunch. Pizza or a sad desk salad? My stomach is conflicted.",
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="lunch food decision"
    options: [
      { id: 'al_opt1', text: 'Pizza! Always pizza.', votes: generateRandomVotes() },
      { id: 'al_opt2', text: 'Salad, gotta be healthy today.', votes: generateRandomVotes() },
      { id: 'al_opt3', text: 'Flip a coin.', votes: generateRandomVotes() },
      { id: 'al_opt4', text: 'Order both and regret nothing.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("5 minutes")).toISOString(),
    createdAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 50),
    totalVotes: 0,
    commentsCount: Math.floor(Math.random() * 5),
    isVoted: Math.random() > 0.5,
    tipCount: Math.floor(Math.random() * 3),
  },
  // Isabella socks poll
  {
    id: 'poll_isabella_socks',
    creator: findUser('Isabella Brown'),
    question: "My partner keeps leaving their dirty socks everywhere. Do I passive-aggressively put them on their pillow, or actually talk about it?",
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="socks couple conflict"
    options: [
        { id: 'is_opt1', text: "Pillow revenge! It's a classic.", votes: generateRandomVotes() },
        { id: 'is_opt2', text: "Communicate, it's the adult thing to do.", votes: generateRandomVotes() },
        { id: 'is_opt3', text: "Hire a maid.", votes: generateRandomVotes() },
        { id: 'is_opt4', text: "Collect them and present them as a 'gift'.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 days, 13 hours, 21 minutes")).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 120),
    totalVotes: 0,
    commentsCount: Math.floor(Math.random() * 20),
    isVoted: Math.random() > 0.5,
    tipCount: Math.floor(Math.random() * 7),
  },
  // Mia bedroom poll
   {
    id: 'poll_mia_bedroom',
    creator: findUser('Mia Jones'),
    question: "Thinking about spicing things up in the bedroom tonight. Should we try that new position from the internet, or stick to our faves?",
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="couple bedroom intimacy"
    options: [
        { id: 'mb_opt1', text: "Go for the new! Adventure awaits.", votes: generateRandomVotes() },
        { id: 'mb_opt2', text: "Stick to the classics, they're classics for a reason.", votes: generateRandomVotes() },
        { id: 'mb_opt3', text: "Mix it up: Start with a classic, end with the new.", votes: generateRandomVotes() },
        { id: 'mb_opt4', text: "Negotiate: One new, one old. Fair play.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("15 days, 2 hours, 45 minutes")).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 220),
    totalVotes: 0,
    commentsCount: Math.floor(Math.random() * 35),
    isVoted: Math.random() > 0.5,
    tipCount: Math.floor(Math.random() * 12),
  },
  // Charlotte third date poll
  {
    id: 'poll_charlotte_date',
    creator: findUser('Charlotte Wilson'),
    question: "Should I go on a third date with someone who's super hot but has absolutely no ambition, or cut my losses?",
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="dating relationship ambition"
    options: [
        { id: 'cd_opt1', text: "Hotness fades, ambition lasts. Cut losses.", votes: generateRandomVotes() },
        { id: 'cd_opt2', text: "Enjoy the hotness while it lasts!", votes: generateRandomVotes() },
        { id: 'cd_opt3', text: "Give them another chance, maybe they'll grow.", votes: generateRandomVotes() },
        { id: 'cd_opt4', text: "Friend-zone them and find someone with ambition.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 hours, 33 minutes")).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 150),
    totalVotes: 0,
    commentsCount: Math.floor(Math.random() * 22),
    isVoted: Math.random() > 0.5,
    tipCount: Math.floor(Math.random() * 9),
  },
    // Amelia career/family poll
  {
    id: 'poll_amelia_balance',
    creator: findUser('Amelia Taylor'),
    question: "Is it truly possible to balance a demanding career and a fulfilling family life, or is one always sacrificed for the other?",
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="work life balance"
    options: [
        { id: 'ab_opt1', text: "Yes, with careful planning and boundaries.", votes: generateRandomVotes() },
        { id: 'ab_opt2', text: "No, it's an impossible dream for most.", votes: generateRandomVotes() },
        { id: 'ab_opt3', text: "It depends on your definition of 'balance'.", votes: generateRandomVotes() },
        { id: 'ab_opt4', text: "Outsource everything!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("28 days, 19 hours, 5 minutes")).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 300),
    totalVotes: 0,
    commentsCount: Math.floor(Math.random() * 40),
    isVoted: Math.random() > 0.5,
    tipCount: Math.floor(Math.random() * 18),
  },
  // Harper master's degree poll
  {
    id: 'poll_harper_masters',
    creator: findUser('Harper Anderson'),
    question: "Should I pursue a master's degree to advance my career, even if it means taking on significant student debt?",
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="education career debt"
    options: [
        { id: 'hm_opt1', text: "Invest in yourself, it will pay off.", votes: generateRandomVotes() },
        { id: 'hm_opt2', text: "Debt is a trap, explore other options.", votes: generateRandomVotes() },
        { id: 'hm_opt3', text: "Only if you're passionate about the subject.", votes: generateRandomVotes() },
        { id: 'hm_opt4', text: "Crunch the numbers, is the ROI worth it?", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("21 days, 13 hours, 38 minutes")).toISOString(),
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 200),
    totalVotes: 0,
    commentsCount: Math.floor(Math.random() * 28),
    isVoted: Math.random() > 0.5,
    tipCount: Math.floor(Math.random() * 11),
  },
    // Evelyn new city poll
  {
    id: 'poll_evelyn_city',
    creator: findUser('Evelyn Thomas'),
    question: "I'm thinking of moving to a completely new city where I know no one. Exciting fresh start, or terrifying leap into the unknown?",
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="moving city adventure"
    options: [
        { id: 'ec_opt1', text: "Exciting! Embrace the new adventure.", votes: generateRandomVotes() },
        { id: 'ec_opt2', text: "Terrifying, build a network first.", votes: generateRandomVotes() },
        { id: 'ec_opt3', text: "Do it, you'll grow immensely.", votes: generateRandomVotes() },
        { id: 'ec_opt4', text: "Visit first, then decide.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("10 days, 9 hours, 10 minutes")).toISOString(),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 230),
    totalVotes: 0,
    commentsCount: Math.floor(Math.random() * 33),
    isVoted: Math.random() > 0.5,
    tipCount: Math.floor(Math.random() * 13),
  },
  // Abigail confess feelings poll
  {
    id: 'poll_abigail_feelings',
    creator: findUser('Abigail Jackson'),
    question: "Should I confess my feelings to my long-time friend, even if it risks ruining our friendship?",
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="love friendship risk"
    options: [
        { id: 'af_opt1', text: "Take the leap! You'll regret not knowing.", votes: generateRandomVotes() },
        { id: 'af_opt2', text: "Keep it platonic, friendship is too valuable.", votes: generateRandomVotes() },
        { id: 'af_opt3', text: "Test the waters subtly first.", votes: generateRandomVotes() },
        { id: 'af_opt4', text: "Wait for them to make a move.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 days, 2 hours, 56 minutes")).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 180),
    totalVotes: 0,
    commentsCount: Math.floor(Math.random() * 26),
    isVoted: Math.random() > 0.5,
    tipCount: Math.floor(Math.random() * 10),
  },
  // Ethan career switch poll
  {
    id: 'poll_ethan_career',
    creator: findUser('Ethan Morgan'),
    question: "Should I go back to school to switch careers in my 40s? It feels like now or never.",
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="career change education"
    options: [
        { id: 'eth_opt1', text: "Now or never! Invest in your future.", votes: generateRandomVotes() },
        { id: 'eth_opt2', text: "Too late, focus on retirement.", votes: generateRandomVotes() },
        { id: 'eth_opt3', text: "Part-time study, gradual transition.", votes: generateRandomVotes() },
        { id: 'eth_opt4', text: "Explore certifications instead of a full degree.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("20 days, 11 hours, 57 minutes")).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 190),
    totalVotes: 0,
    commentsCount: Math.floor(Math.random() * 24),
    isVoted: Math.random() > 0.5,
    tipCount: Math.floor(Math.random() * 9),
  },
  // Frank laser pointer poll
  {
    id: 'poll_frank_laser',
    creator: findUser('Frank Bell'),
    question: "My pet is obsessed with chasing laser pointers. Is it fun for them, or secretly frustrating because they can never 'catch' it?",
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="pet cat dog laser"
    options: [
        { id: 'fra_opt1', text: "Fun and good exercise!", votes: generateRandomVotes() },
        { id: 'fra_opt2', text: "Frustrating, avoid them.", votes: generateRandomVotes() },
        { id: 'fra_opt3', text: "Use it as a warm-up, then a real toy.", votes: generateRandomVotes() },
        { id: 'fra_opt4', text: "Only if there's a tangible reward at the end.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 days, 19 hours, 32 minutes")).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 160),
    totalVotes: 0,
    commentsCount: Math.floor(Math.random() * 17),
    isVoted: Math.random() > 0.5,
    tipCount: Math.floor(Math.random() * 6),
  },
  // David boss credit poll
   {
    id: 'poll_david_boss',
    creator: findUser('David Kelly'),
    question: "My boss is taking credit for my ideas. Do I speak up and risk my job, or let them shine and fume in silence?",
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="work conflict boss"
    options: [
        { id: 'db_opt1', text: "Speak up! Your work deserves recognition.", votes: generateRandomVotes() },
        { id: 'db_opt2', text: "Suck it up, play the long game.", votes: generateRandomVotes() },
        { id: 'db_opt3', text: "Document everything and build a case.", votes: generateRandomVotes() },
        { id: 'db_opt4', text: "Start looking for a new job.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("5 days, 1 hour, 27 minutes")).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 210),
    totalVotes: 0,
    commentsCount: Math.floor(Math.random() * 29),
    isVoted: Math.random() > 0.5,
    tipCount: Math.floor(Math.random() * 14),
  },
  // John dream vacation poll
  {
    id: 'poll_john_vacation',
    creator: findUser('John Bennett'),
    question: "Dream vacation: Backpacking through Europe on a shoestring budget, or luxury resort in the Maldives? My wallet says one, my soul says the other.",
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="travel vacation budget"
    options: [
        { id: 'jv_opt1', text: "Embrace the adventure, Europe!", votes: generateRandomVotes() },
        { id: 'jv_opt2', text: "Maldives, treat yourself!", votes: generateRandomVotes() },
        { id: 'jv_opt3', text: "Save up and do both later.", votes: generateRandomVotes() },
        { id: 'jv_opt4', text: "Compromise: A fancy staycation.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("18 days, 9 hours, 59 minutes")).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 280),
    totalVotes: 0,
    commentsCount: Math.floor(Math.random() * 38),
    isVoted: Math.random() > 0.5,
    tipCount: Math.floor(Math.random() * 16),
  },
  // Olivia roommate poll (duplicate from above, using different ID)
  {
    id: 'poll_olivia_roommate_2',
    creator: findUser('Olivia Rodriguez'), // Same Olivia
    question: 'My roommate never cleans. Do I create a chore chart, or passive-aggressively clean only my side?',
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="roommate chores conflict"
    options: [
      { id: 'or2_opt1', text: 'Chore chart! Clear expectations.', votes: generateRandomVotes() },
      { id: 'or2_opt2', text: 'Passive aggression wins every time.', votes: generateRandomVotes() },
      { id: 'or2_opt3', text: 'Move out.', votes: generateRandomVotes() },
      { id: 'or2_opt4', text: 'Hire a cleaner for common areas.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 14 hours, 55 minutes")).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 130),
    totalVotes: 0,
    commentsCount: Math.floor(Math.random() * 19),
    isVoted: Math.random() > 0.5,
    tipCount: Math.floor(Math.random() * 7),
    pledgeAmount: (Math.random() > 0.85) ? (Math.floor(Math.random() * 20) + 5) : undefined,
  },
  // Leo new language poll
  {
    id: 'poll_leo_language',
    creator: findUser('Leo Jenkins'),
    question: "Should I learn a new language, or focus on becoming an expert in a skill I already have?",
    imageUrls: ['https://placehold.co/600x400.png'], // data-ai-hint="language learning skill"
    options: [
        { id: 'll_opt1', text: "New language! Expand your horizons.", votes: generateRandomVotes() },
        { id: 'll_opt2', text: "Master current skills, depth over breadth.", votes: generateRandomVotes() },
        { id: 'll_opt3', text: "Do both, slowly but surely.", votes: generateRandomVotes() },
        { id: 'll_opt4', text: "Learn a language relevant to your existing skill.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("24 days, 18 hours, 3 minutes")).toISOString(),
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 170),
    totalVotes: 0,
    commentsCount: Math.floor(Math.random() * 23),
    isVoted: Math.random() > 0.5,
    tipCount: Math.floor(Math.random() * 8),
  },
];

// Calculate totalVotes and randomly assign votedOptionId for initial polls
const processedPolls = initialPolls.map(poll => {
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  let votedOptionId = poll.votedOptionId;
  if (poll.isVoted && !votedOptionId && poll.options.length > 0) {
    votedOptionId = poll.options[Math.floor(Math.random() * poll.options.length)].id;
  }
  return { ...poll, totalVotes, votedOptionId };
});

export const mockPolls: Poll[] = processedPolls;

// Function to get more polls, simulating API call for infinite scroll
export const fetchMorePolls = async (offset: number, limit: number): Promise<Poll[]> => {
  console.log(`Fetching more polls: offset ${offset}, limit ${limit}`);
  // For this demo, if we've shown all initial detailed polls, return empty or generate very generic ones.
  // This ensures the "You've reached the end!" message eventually appears.
  if (offset >= mockPolls.length && mockPolls.length > 20) { // only stop if initial list is large
     return new Promise(resolve => {
        setTimeout(() => {
            resolve([]);
        }, 300);
     });
  }

  // Fallback to generating some very simple polls if needed for extensive scrolling.
  return new Promise(resolve => {
    setTimeout(() => {
      const newPolls = Array.from({ length: limit }, (_, i) => {
        const creator = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const optionCount = Math.floor(Math.random() * 3) + 2; // 2-4 options
        const options = Array.from({ length: optionCount }, (__, optIdx) => ({
          id: `gen_opt${offset + i}_${optIdx}`,
          text: `Generated Option ${optIdx + 1}`,
          votes: generateRandomVotes(),
        }));
        const totalGeneratedVotes = options.reduce((sum, opt) => sum + opt.votes, 0);
        return {
          id: `gen_poll_${offset + i + 1000}`, // Ensure unique IDs
          creator,
          question: `Generic generated poll question #${offset + i + 1}? What do you think?`,
          options,
          deadline: new Date(Date.now() + (Math.floor(Math.random()*20)+1) * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - (Math.floor(Math.random()*5)+1) * 24 * 60 * 60 * 1000).toISOString(),
          likes: Math.floor(Math.random() * 100),
          totalVotes: totalGeneratedVotes,
          commentsCount: Math.floor(Math.random() * 10),
          isVoted: Math.random() > 0.6,
          votedOptionId: Math.random() > 0.6 ? options[Math.floor(Math.random() * options.length)].id : undefined,
          imageUrls: Math.random() > 0.5 ? [`https://placehold.co/600x400.png?id=gen${offset+i}`] : undefined, // data-ai-hint="abstract random"
          tipCount: Math.floor(Math.random() * 5),
          pledgeAmount: Math.random() > 0.9 ? Math.floor(Math.random() * 20) : undefined,
        };
      });
      resolve(newPolls as Poll[]);
    }, 500); // Simulate network delay
  });
};
