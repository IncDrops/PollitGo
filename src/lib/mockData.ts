
import type { Poll, User } from '@/types';

const generateRandomVotes = () => Math.floor(Math.random() * 300) + 10;
const generateRandomTips = () => Math.floor(Math.random() * 25);
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
  // New users for 2-option polls
  { name: 'Romantic Traveler' }, { name: 'Curious Explorer' }, { name: 'Home Buyer' }, { name: 'Hungry Harry' },
  { name: 'Festival Fiona' }, { name: 'Career Changer' }, { name: 'Path Seeker' }, 
  { name: 'Family Mediator' }, { name: 'Betrayed Spouse' }, { name: 'Fashion Conscious' }
];

export const mockUsers: User[] = usersData.map((user, index) => ({
  id: `user${index + 1}`,
  name: user.name,
  avatarUrl: `https://placehold.co/100x100.png?text=${user.name.substring(0,1)}`,
  username: user.name.toLowerCase().replace(/\s+/g, '').substring(0, 6) + (index + 100), // Deterministic username
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
    createdAgoMs = Math.random() * (deadlineMs * 0.5); // created up to halfway to deadline
  } else if (deadlineMs <= 24 * 60 * 60 * 1000) { // 1 day or less
    createdAgoMs = Math.random() * (6 * 60 * 60 * 1000) + (15 * 60 * 1000); // 15 mins to 6 hours ago
  } else { // more than 1 day
    createdAgoMs = Math.random() * (3 * 24 * 60 * 60 * 1000) + (1 * 24 * 60 * 60 * 1000); // 1 to 4 days ago
  }
  return new Date(Date.now() - createdAgoMs).toISOString();
};


const initialPolls: Omit<Poll, 'totalVotes' | 'isVoted' | 'votedOptionId' | 'commentsCount' | 'likes' | 'pledgeAmount' | 'tipCount'>[]  = [ // Make some fields optional here as they are added later
  {
    id: 'poll1',
    creator: findUser('Alice Wonderland'),
    question: 'What is your favorite season?',
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
      { id: 'opt1a', text: 'Spring', votes: 120, imageUrl: 'https://placehold.co/300x200.png' },
      { id: 'opt1b', text: 'Summer', votes: 250, imageUrl: 'https://placehold.co/300x200.png' },
      { id: 'opt1c', text: 'Autumn', votes: 180, imageUrl: 'https://placehold.co/300x200.png' },
      { id: 'opt1d', text: 'Winter', votes: 90, imageUrl: 'https://placehold.co/300x200.png' },
    ],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
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
  },
  {
    id: 'poll_sophia_vcard_main',
    creator: findUser('Sophia Miller'),
    question: "Finna lose my V-card, besties. To wrap it or not to wrap it? Low-key kinda nervous but also wanna YOLO. What's the tea?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
      { id: 'sv_opt1_main', text: "Wrap it like it's your favorite mixtape ('cause STIs are NOT a vibe).", votes: generateRandomVotes() },
      { id: 'sv_opt2_main', text: "The stars whisper secrets of protection... and pleasure. Choose wisely.", votes: generateRandomVotes() },
      { id: 'sv_opt3_main', text: "Raw doggin' it? Only if you both got clean bills of health & discussed risks. Otherwise, glove up!", votes: generateRandomVotes() },
      { id: 'sv_opt4_main', text: "Let the spirits guide you... to the condom aisle. Then flip a coin for flavor.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 hours, 38 minutes")).toISOString(),
    createdAt: generateCreatedAt("6 hours, 38 minutes"),
    // pledgeAmount: 100, // Will be set in processing loop if specified for this poll
    // tipCount: 16, // Will be set in processing loop
  },
  {
    id: 'poll_sophia_houseplant',
    creator: findUser('Sophia Miller'),
    question: 'My houseplant is getting too big for its pot. Do I repot it, or prune it back aggressively?',
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
      { id: 'sh_opt1', text: 'Repot it! Let it flourish.', votes: generateRandomVotes() },
      { id: 'sh_opt2', text: 'Prune it, keep it manageable.', votes: generateRandomVotes() },
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
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
      { id: 'ac_opt1', text: 'Never too late! Code away!', votes: generateRandomVotes() },
      { id: 'ac_opt2', text: 'Focus on refining current skills.', votes: generateRandomVotes() },
      { id: 'ac_opt3', text: 'Try a beginner course, see if it sticks.', votes: generateRandomVotes() },
      { id: 'ac_opt4', text: 'Network instead of code.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("10 days, 21 hours, 10 minutes")).toISOString(),
    createdAt: generateCreatedAt("10 days, 21 hours, 10 minutes"),
  },
  {
    id: 'poll_emma_ghosting',
    creator: findUser('Emma Davis'),
    question: 'My best friend keeps ghosting me for their new significant other. Do I confront them or just accept our friendship has changed?',
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
      { id: 'eg_opt1', text: 'Confront them, open communication is vital.', votes: generateRandomVotes() },
      { id: 'eg_opt2', text: 'Give them space, they\'ll come back around.', votes: generateRandomVotes() },
      { id: 'eg_opt3', text: 'Find new friends who prioritize you.', votes: generateRandomVotes() },
      { id: 'eg_opt4', text: 'Send a passive-aggressive meme.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 16 hours, 28 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 days, 16 hours, 28 minutes"),
  },
  {
    id: 'poll_liam_pizza',
    creator: findUser('Liam Garcia'),
    question: "Is it ever okay to eat cold pizza for breakfast? Asking for a friend who's currently staring at a leftover slice.",
    imageUrls: ['https://placehold.co/600x400.png'], 
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
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
      { id: 'or_opt1', text: 'Chore chart! Clear expectations.', votes: generateRandomVotes() },
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
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
      { id: 'nb_opt1', text: 'Go for it! Hair grows back.', votes: generateRandomVotes() },
      { id: 'nb_opt2', text: 'No bangs, too much maintenance.', votes: generateRandomVotes() },
      { id: 'nb_opt3', text: 'Try clip-in bangs first.', votes: generateRandomVotes() },
      { id: 'nb_opt4', text: 'Ask your stylist for their professional opinion.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("17 hours, 20 minutes")).toISOString(),
    createdAt: generateCreatedAt("17 hours, 20 minutes"),
  },
  {
    id: 'poll_ava_lunch',
    creator: findUser('Ava Williams'),
    question: "I've got 5 minutes to decide on lunch. Pizza or a sad desk salad? My stomach is conflicted.",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
      { id: 'al_opt1', text: 'Pizza! Always pizza.', votes: generateRandomVotes() },
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
    imageUrls: ['https://placehold.co/600x400.png'], 
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
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'mb_opt1', text: "Go for the new! Adventure awaits.", votes: generateRandomVotes() },
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
    imageUrls: ['https://placehold.co/600x400.png'], 
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
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'ab_opt1', text: "Yes, with careful planning and boundaries.", votes: generateRandomVotes() },
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
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'hm_opt1', text: "Invest in yourself, it will pay off.", votes: generateRandomVotes() },
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
    imageUrls: ['https://placehold.co/600x400.png'], 
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
    imageUrls: ['https://placehold.co/600x400.png'], 
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
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'elc_opt1', text: "Repair it, squeeze out every last mile.", votes: generateRandomVotes() },
        { id: 'elc_opt2', text: "New car time! Enjoy the reliability.", votes: generateRandomVotes() },
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
    imageUrls: ['https://placehold.co/600x400.png'], 
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
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'els_opt1', text: "Go for it! Adrenaline rush!", votes: generateRandomVotes() },
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
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'sps_opt1', text: "Save your pet, cost is secondary!", votes: generateRandomVotes() },
        { id: 'sps_opt2', text: "Consider quality of life, explore alternatives.", votes: generateRandomVotes() },
        { id: 'sps_opt3', text: "Look for financial aid/pet charities.", votes: generateRandomVotes() },
        { id: 'sps_opt4', text: "It's just a pet, be practical.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("25 days, 1 hour, 35 minutes")).toISOString(),
    createdAt: generateCreatedAt("25 days, 1 hour, 35 minutes"),
  },
  {
    id: 'poll_camila_apology',
    creator: findUser('Camila Thompson'),
    question: "Is it better to apologize immediately when you're wrong, or wait until emotions cool down?",
    imageUrls: ['https://placehold.co/600x400.png'], 
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
    imageUrls: ['https://placehold.co/600x400.png'], 
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
    imageUrls: ['https://placehold.co/600x400.png'], 
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
    imageUrls: ['https://placehold.co/600x400.png'], 
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
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'ls_opt1', text: "Treat yourself! You deserve it.", votes: generateRandomVotes() },
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
    imageUrls: ['https://placehold.co/600x400.png'], 
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
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'nh_opt1', text: "Embrace the natural! Freedom awaits.", votes: generateRandomVotes() },
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
    imageUrls: ['https://placehold.co/600x400.png'], 
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
    imageUrls: ['https://placehold.co/600x400.png'], 
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
    imageUrls: ['https://placehold.co/600x400.png'], 
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
    imageUrls: ['https://placehold.co/600x400.png'], 
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
    imageUrls: ['https://placehold.co/600x400.png'], 
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
    id: 'poll_emily_coffeeshop',
    creator: findUser('Emily Green'),
    question: "My favorite local coffee shop is closing. Do I try to rally the community to save it, or mourn its loss quietly?",
    imageUrls: ['https://placehold.co/600x400.png'], 
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
    id: 'poll_fiona_language',
    creator: findUser('Fiona Adams'),
    question: "Should I learn a new language, or focus on becoming an expert in a skill I already have?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'fl_opt1_2', text: "New language! Expand your horizons.", votes: generateRandomVotes() },
        { id: 'fl_opt2_2', text: "Master current skills, depth over breadth.", votes: generateRandomVotes() },
        { id: 'fl_opt3_2', text: "Do both, slowly but surely.", votes: generateRandomVotes() },
        { id: 'fl_opt4_2', text: "Learn a language relevant to your existing skill.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("16 hours, 5 minutes")).toISOString(),
    createdAt: generateCreatedAt("16 hours, 5 minutes"),
  },

  // New 2-option polls
  {
    id: 'poll_engagement_location',
    creator: findUser('Romantic Traveler'),
    question: "Engagement location in two weeks: Paris or Italy?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
      { id: 'el_opt1', text: 'Paris, City of Love!', votes: generateRandomVotes() },
      { id: 'el_opt2', text: 'Italy, Under the Tuscan Sun!', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("12 days")).toISOString(),
    createdAt: generateCreatedAt("12 days"),
  },
  {
    id: 'poll_virginity_condom_new',
    creator: findUser('Curious Explorer'),
    question: "Losing my virginity, condom or no condom?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
      { id: 'vc_opt1_new', text: 'Condom: Safe is sexy!', votes: generateRandomVotes() },
      { id: 'vc_opt2_new', text: 'No Condom: Trust the moment (after testing!).', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 days")).toISOString(),
    createdAt: generateCreatedAt("7 days"),
  },
  {
    id: 'poll_house_to_buy',
    creator: findUser('Home Buyer'),
    question: "Which house to buy? Option A or Option B?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
      { id: 'htb_opt1', text: 'Option A: The Cozy Cottage', votes: generateRandomVotes(), imageUrl: 'https://placehold.co/300x200.png' },
      { id: 'htb_opt2', text: 'Option B: The Modern Marvel', votes: generateRandomVotes(), imageUrl: 'https://placehold.co/300x200.png' },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("30 days")).toISOString(),
    createdAt: generateCreatedAt("30 days"),
  },
  {
    id: 'poll_lunch_choice',
    creator: findUser('Hungry Harry'),
    question: "What to eat for lunch? Tuna sandwich or grilled chicken wrap?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
      { id: 'lc_opt1_new', text: 'Tuna Sandwich Classic', votes: generateRandomVotes() },
      { id: 'lc_opt2_new', text: 'Grilled Chicken Wrap Delight', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 minute")).toISOString(),
    createdAt: generateCreatedAt("1 minute"),
  },
  {
    id: 'poll_jazz_fest_dress',
    creator: findUser('Festival Fiona'),
    question: "Dress for the New Orleans Jazz Festival? (Two options)",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
      { id: 'jfd_opt1', text: 'Flowy Bohemian Dress', votes: generateRandomVotes(), imageUrl: 'https://placehold.co/300x200.png' },
      { id: 'jfd_opt2', text: 'Chic Jumpsuit', votes: generateRandomVotes(), imageUrl: 'https://placehold.co/300x200.png' },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("14 days")).toISOString(),
    createdAt: generateCreatedAt("14 days"),
  },
  {
    id: 'poll_quit_job',
    creator: findUser('Career Changer'),
    question: "Should I quit my job? Yes or No?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
      { id: 'qj_opt1', text: 'Yes, take the leap!', votes: generateRandomVotes() },
      { id: 'qj_opt2', text: 'No, stick it out a bit longer.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("12 days")).toISOString(),
    createdAt: generateCreatedAt("12 days"),
  },
  {
    id: 'poll_career_path_tech_art',
    creator: findUser('Path Seeker'),
    question: "Which career path should I pursue? Tech or Art?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
      { id: 'cpta_opt1', text: 'Tech: Innovation & Impact', votes: generateRandomVotes() },
      { id: 'cpta_opt2', text: 'Art: Passion & Creativity', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("21 days")).toISOString(),
    createdAt: generateCreatedAt("21 days"),
  },
  {
    id: 'poll_breakup_boyfriend',
    creator: findUser('Hannah Baker'), // Using existing user for connection
    question: "Should I break up with my boyfriend? Yes or No?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
      { id: 'bub_opt1', text: 'Yes, it\'s time to move on.', votes: generateRandomVotes() },
      { id: 'bub_opt2', text: 'No, try to make it work.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("4 days")).toISOString(),
    createdAt: generateCreatedAt("4 days"),
  },
  {
    id: 'poll_get_back_together_humor',
    creator: findUser('Hannah Baker'), // Same user
    question: "Should we get back together? ... Asking for a friend who might be me. 😂",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
      { id: 'gbt_opt1', text: 'LOL, give it another shot!', votes: generateRandomVotes() },
      { id: 'gbt_opt2', text: 'Nah, run for the hills (again)!', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("30 minutes")).toISOString(),
    createdAt: generateCreatedAt("30 minutes"), 
  },
  {
    id: 'poll_reunite_relative',
    creator: findUser('Family Mediator'),
    question: "Should I try to reunite with a relative I haven't gotten along with in years?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
      { id: 'rr_opt1', text: 'Yes, extend the olive branch.', votes: generateRandomVotes() },
      { id: 'rr_opt2', text: 'No, some bridges are best left burned.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("10 days")).toISOString(),
    createdAt: generateCreatedAt("10 days"),
  },
  {
    id: 'poll_husband_cheated',
    creator: findUser('Betrayed Spouse'),
    question: "My husband cheated, should I stay and try to work it out with therapy or take this as a sign to run?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
      { id: 'hc_opt1', text: 'Therapy: Try to rebuild trust.', votes: generateRandomVotes() },
      { id: 'hc_opt2', text: 'Run: This is a dealbreaker.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("8 hours")).toISOString(),
    createdAt: generateCreatedAt("8 hours"),
  },
  {
    id: 'poll_jeans_fat_workout',
    creator: findUser('Fashion Conscious'),
    question: "Do these jeans make me look fat, should I workout?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
      { id: 'jfw_opt1', text: 'You look great! But workout if it makes YOU feel good.', votes: generateRandomVotes() },
      { id: 'jfw_opt2', text: 'It\'s the jeans, not you! Find a better pair.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 days")).toISOString(),
    createdAt: generateCreatedAt("3 days"),
  },
];


// This will be the final array of polls with all properties set.
const allPollsFull: Poll[] = initialPolls.map((pollSkeleton, index) => {
  const totalVotes = pollSkeleton.options.reduce((sum, option) => sum + option.votes, 0);
  
  // Deterministic voting status
  const shouldBeVoted = (index % 3 === 0); 
  let determinedVotedOptionId: string | undefined = undefined;
  if (shouldBeVoted && pollSkeleton.options.length > 0) {
    determinedVotedOptionId = pollSkeleton.options[0].id; // Always vote for the first option if voted
  }

  // Specific pledge/tip logic
  let pledgeAmount = generateRandomPledge();
  let tipCount = generateRandomTips();

  if (pollSkeleton.id === 'poll_sophia_vcard_main') {
    pledgeAmount = 100;
    tipCount = 16;
  } else if (pollSkeleton.id === 'poll_sophia_houseplant') {
    pledgeAmount = 30;
    tipCount = 12;
  } else if (pollSkeleton.id === 'poll_alex_code') {
    pledgeAmount = 5;
    tipCount = 4;
  } else if (pollSkeleton.id === 'poll_emma_ghosting') {
    pledgeAmount = 50;
    // tipCount remains random via generateRandomTips()
  } else if (pollSkeleton.id === 'poll_olivia_roommate' || pollSkeleton.id === 'poll_noah_bangs' || pollSkeleton.id === 'poll_ava_lunch' || pollSkeleton.id === 'poll_isabella_socks' || pollSkeleton.id === 'poll_mia_bedroom' || pollSkeleton.id === 'poll_charlotte_date' || pollSkeleton.id === 'poll_amelia_balance' || pollSkeleton.id === 'poll_harper_masters' || pollSkeleton.id === 'poll_evelyn_city' || pollSkeleton.id === 'poll_abigail_feelings' || pollSkeleton.id === 'poll_ella_car' || pollSkeleton.id === 'poll_scarlett_cooking' || pollSkeleton.id === 'poll_elizabeth_sport' || pollSkeleton.id === 'poll_sofia_pet_surgery' || pollSkeleton.id === 'poll_camila_apology' || pollSkeleton.id === 'poll_aria_social_media' || pollSkeleton.id === 'poll_victoria_client' || pollSkeleton.id === 'poll_madison_kids' || pollSkeleton.id === 'poll_luna_splurge' || pollSkeleton.id === 'poll_grace_job' || pollSkeleton.id === 'poll_natalie_hair' || pollSkeleton.id === 'poll_sarah_lie' || pollSkeleton.id === 'poll_alice_creative' || pollSkeleton.id === 'poll_bella_spill' || pollSkeleton.id === 'poll_chloe_party' || pollSkeleton.id === 'poll_daisy_dating' || pollSkeleton.id === 'poll_emily_coffeeshop' || pollSkeleton.id === 'poll_fiona_language') {
     // For polls with "Pledges: I pledge to..." or similar text, we assign a random pledge.
     // This is already handled by generateRandomPledge() default behavior for many.
     // If explicit pledge amount was mentioned in user prompt, it should be handled like poll_sophia_houseplant
  }


  return {
    ...pollSkeleton,
    totalVotes,
    isVoted: shouldBeVoted,
    votedOptionId: determinedVotedOptionId,
    likes: Math.floor(Math.random() * 300) + 20,
    commentsCount: Math.floor(Math.random() * 50) + 5,
    pledgeAmount,
    tipCount,
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

    