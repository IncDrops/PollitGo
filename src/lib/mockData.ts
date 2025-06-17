
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
  {
    id: 'poll_grace_unfollow',
    creator: findUser('Grace Hall'), // Changed user, as Grace Hall already exists
    question: "Is it okay to unfollow a friend on social media if their content is consistently annoying/negative?",
    imageUrls: ['https://placehold.co/600x400.png'], 
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
    id: 'poll_hannah_pet',
    creator: findUser('Hannah Baker'),
    question: "I'm torn between getting a dog or a cat. Help me decide, fur parents!",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'hp_opt1', text: "Team Dog! Loyalty and adventure.", votes: generateRandomVotes() },
        { id: 'hp_opt2', text: "Team Cat! Independent and cuddly.", votes: generateRandomVotes() },
        { id: 'hp_opt3', text: "Get both if you can handle it!", votes: generateRandomVotes() },
        { id: 'hp_opt4', text: "Neither, get a fish.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 day, 7 hours, 28 minutes")).toISOString(),
    createdAt: generateCreatedAt("1 day, 7 hours, 28 minutes"),
  },
  {
    id: 'poll_ivy_volunteer',
    creator: findUser('Ivy Nelson'),
    question: "Should I volunteer my time to a cause I believe in, or focus solely on my own self-improvement right now?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'iv_opt1', text: "Volunteer! Give back to the community.", votes: generateRandomVotes() },
        { id: 'iv_opt2', text: "Focus on self-improvement first, then volunteer.", votes: generateRandomVotes() },
        { id: 'iv_opt3', text: "Do a little of both.", votes: generateRandomVotes() },
        { id: 'iv_opt4', text: "Join a group that combines both!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("17 days, 13 hours, 40 minutes")).toISOString(),
    createdAt: generateCreatedAt("17 days, 13 hours, 40 minutes"),
  },
  {
    id: 'poll_jessie_family',
    creator: findUser('Jessie Carter'),
    question: "Should I cut ties with a toxic family member, or try to maintain a relationship for the sake of 'family'?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'jf_opt1', text: "Cut ties, your mental health comes first.", votes: generateRandomVotes() },
        { id: 'jf_opt2', text: "Maintain, family is important no matter what.", votes: generateRandomVotes() },
        { id: 'jf_opt3', text: "Set strict boundaries, limit contact.", votes: generateRandomVotes() },
        { id: 'jf_opt4', text: "Seek family counseling.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 days, 2 hours, 53 minutes")).toISOString(),
    createdAt: generateCreatedAt("7 days, 2 hours, 53 minutes"),
  },
  {
    id: 'poll_kayla_parties',
    creator: findUser('Kayla Mitchell'),
    question: "I'm invited to two parties on the same night. Which one do I go to: the wild one with all my party friends, or the chill one with deep conversations?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'kp_opt1', text: "Wild party! YOLO!", votes: generateRandomVotes() },
        { id: 'kp_opt2', text: "Chill party, for the soul.", votes: generateRandomVotes() },
        { id: 'kp_opt3', text: "Go to both, make a grand entrance at each.", votes: generateRandomVotes() },
        { id: 'kp_opt4', text: "Flip a coin.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("27 days, 19 hours, 16 minutes")).toISOString(),
    createdAt: generateCreatedAt("27 days, 19 hours, 16 minutes"),
  },
  {
    id: 'poll_lily_instrument',
    creator: findUser('Lily Roberts'),
    question: "Should I learn to play a musical instrument, even if I have no natural talent?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'li_opt1', text: "Go for it! Passion over talent.", votes: generateRandomVotes() },
        { id: 'li_opt2', text: "No, focus on what you're good at.", votes: generateRandomVotes() },
        { id: 'li_opt3', text: "Start with something easy like ukulele.", votes: generateRandomVotes() },
        { id: 'li_opt4', text: "Just listen to music, don't try to make it.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("18 hours, 36 minutes")).toISOString(),
    createdAt: generateCreatedAt("18 hours, 36 minutes"),
  },
  {
    id: 'poll_mia_talk_self',
    creator: findUser('Mia Jones'), // Already exists
    question: "Is it okay to talk to yourself out loud when you're alone? Asking for a friend... who is me.",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'mts_opt1', text: "Totally normal! It helps organize thoughts.", votes: generateRandomVotes() },
        { id: 'mts_opt2', text: "Only if you don't answer yourself back.", votes: generateRandomVotes() },
        { id: 'mts_opt3', text: "Maybe get a therapist.", votes: generateRandomVotes() },
        { id: 'mts_opt4', text: "Only if it's in a foreign language.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("10 days, 14 hours, 49 minutes")).toISOString(),
    createdAt: generateCreatedAt("10 days, 14 hours, 49 minutes"),
  },
  {
    id: 'poll_nora_book_club',
    creator: findUser('Nora Phillips'),
    question: "Should I join a book club even though I barely read? I want to be more cultured.",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'nbc_opt1', text: "Join! It'll motivate you to read.", votes: generateRandomVotes() },
        { id: 'nbc_opt2', text: "No, don't pretend to be someone you're not.", votes: generateRandomVotes() },
        { id: 'nbc_opt3', text: "Start with audiobooks.", votes: generateRandomVotes() },
        { id: 'nbc_opt4', text: "Just attend the social events.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("4 days, 1 hour, 22 minutes")).toISOString(),
    createdAt: generateCreatedAt("4 days, 1 hour, 22 minutes"),
  },
  {
    id: 'poll_olivia_travel_world',
    creator: findUser('Olivia Rodriguez'), // Already exists
    question: "My dream is to travel the world. Do I save every penny, or take out a loan and go now?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'otw_opt1', text: "Save every penny, travel debt-free.", votes: generateRandomVotes() },
        { id: 'otw_opt2', text: "Go now! Life is short.", votes: generateRandomVotes() },
        { id: 'otw_opt3', text: "Do a mix: save some, borrow a little.", votes: generateRandomVotes() },
        { id: 'otw_opt4', text: "Find remote work and travel while working.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("29 days, 21 hours, 5 minutes")).toISOString(),
    createdAt: generateCreatedAt("29 days, 21 hours, 5 minutes"),
  },
  {
    id: 'poll_penny_pajamas',
    creator: findUser('Penny Campbell'),
    question: "Is it acceptable to wear pajamas all day if you're working from home and have no video calls?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'pp_opt1', text: "Absolutely, peak WFH comfort!", votes: generateRandomVotes() },
        { id: 'pp_opt2', text: "No, get dressed, it boosts productivity.", votes: generateRandomVotes() },
        { id: 'pp_opt3', text: "Only if they're stylish pajamas.", votes: generateRandomVotes() },
        { id: 'pp_opt4', text: "It's a slippery slope to never changing.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 day, 16 hours, 30 minutes")).toISOString(),
    createdAt: generateCreatedAt("1 day, 16 hours, 30 minutes"),
  },
  {
    id: 'poll_quinn_cooking',
    creator: findUser('Quinn Evans'),
    question: "Should I learn to cook elaborate meals, or stick to my trusty microwave dinners?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'qc_opt1', text: "Learn to cook! It's a life skill.", votes: generateRandomVotes() },
        { id: 'qc_opt2', text: "Microwave all the way, efficiency!", votes: generateRandomVotes() },
        { id: 'qc_opt3', text: "Start with simple recipes, then level up.", votes: generateRandomVotes() },
        { id: 'qc_opt4', text: "Order takeout!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("13 days, 10 hours, 58 minutes")).toISOString(),
    createdAt: generateCreatedAt("13 days, 10 hours, 58 minutes"),
  },
  {
    id: 'poll_ruby_move_in',
    creator: findUser('Ruby Edwards'),
    question: "My significant other wants to move in together, but I love my personal space. Do I agree or hit the brakes?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'rmi_opt1', text: "Agree, it's the next step!", votes: generateRandomVotes() },
        { id: 'rmi_opt2', text: "Hit the brakes, personal space is vital.", votes: generateRandomVotes() },
        { id: 'rmi_opt3', text: "Suggest a trial period.", votes: generateRandomVotes() },
        { id: 'rmi_opt4', text: "Find a bigger place with separate zones.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("8 days, 14 hours, 45 minutes")).toISOString(),
    createdAt: generateCreatedAt("8 days, 14 hours, 45 minutes"),
  },
  {
    id: 'poll_sophia_organic',
    creator: findUser('Sophia Miller'), // Already exists
    question: "Is it worth buying organic food, or is it just a marketing gimmick?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'so_opt1', text: "Definitely worth it for health and environment!", votes: generateRandomVotes() },
        { id: 'so_opt2', text: "Marketing gimmick, save your money.", votes: generateRandomVotes() },
        { id: 'so_opt3', text: "Some things yes, some things no (Dirty Dozen/Clean Fifteen).", votes: generateRandomVotes() },
        { id: 'so_opt4', text: "Grow your own!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("23 days, 20 hours, 17 minutes")).toISOString(),
    createdAt: generateCreatedAt("23 days, 20 hours, 17 minutes"),
  },
  {
    id: 'poll_tina_pet_landlord',
    creator: findUser('Tina Collins'),
    question: "Should I get a pet without telling my landlord, and hope they don't find out?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'tpl_opt1', text: "No! Get permission first, avoid eviction.", votes: generateRandomVotes() },
        { id: 'tpl_opt2', text: "Yes, easier to ask forgiveness than permission.", votes: generateRandomVotes() },
        { id: 'tpl_opt3', text: "Find a pet-friendly place.", votes: generateRandomVotes() },
        { id: 'tpl_opt4', text: "Get a very quiet pet.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 hour, 34 minutes")).toISOString(),
    createdAt: generateCreatedAt("1 hour, 34 minutes"),
  },
  {
    id: 'poll_ursula_vows',
    creator: findUser('Ursula Stewart'),
    question: "My partner wants to renew our vows on our 10th anniversary, but I feel like we're just going through the motions. Do I go along with it or be honest?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'uv_opt1', text: "Go along, it might rekindle something.", votes: generateRandomVotes() },
        { id: 'uv_opt2', text: "Be honest, address the underlying issues.", votes: generateRandomVotes() },
        { id: 'uv_opt3', text: "Suggest a different way to celebrate.", votes: generateRandomVotes() },
        { id: 'uv_opt4', text: "Surprise them with couples counseling instead.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("16 days, 22 hours, 5 minutes")).toISOString(),
    createdAt: generateCreatedAt("16 days, 22 hours, 5 minutes"),
  },
  {
    id: 'poll_violet_minimalism',
    creator: findUser('Violet Morris'),
    question: "Should I embrace minimalism and declutter my entire life, or cling to my beloved possessions?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'vm_opt1', text: "Declutter! Freedom through less stuff.", votes: generateRandomVotes() },
        { id: 'vm_opt2', text: "Cling! Memories are priceless.", votes: generateRandomVotes() },
        { id: 'vm_opt3', text: "Start small, declutter one room at a time.", votes: generateRandomVotes() },
        { id: 'vm_opt4', text: "Only keep things that 'spark joy'.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 days, 13 hours, 41 minutes")).toISOString(),
    createdAt: generateCreatedAt("6 days, 13 hours, 41 minutes"),
  },
  {
    id: 'poll_wendy_texts',
    creator: findUser('Wendy Rogers'),
    question: "Is it okay to secretly read my partner's text messages if I suspect they're hiding something?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'wt_opt1', text: "No! Respect their privacy.", votes: generateRandomVotes() },
        { id: 'wt_opt2', text: "Yes, if your suspicions are strong.", votes: generateRandomVotes() },
        { id: 'wt_opt3', text: "Talk to them directly first.", votes: generateRandomVotes() },
        { id: 'wt_opt4', text: "Hire a private investigator.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 19 hours, 10 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 days, 19 hours, 10 minutes"),
  },
  {
    id: 'poll_zara_tattoo',
    creator: findUser('Zara Reed'),
    question: "Should I get a tattoo of my current partner's name? Everyone says it's bad luck, but I feel it's true love.",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'zt_opt1', text: "No! Bad luck and bad ideas.", votes: generateRandomVotes() },
        { id: 'zt_opt2', text: "Yes! Declare your love boldly.", votes: generateRandomVotes() },
        { id: 'zt_opt3', text: "Get something symbolic instead.", votes: generateRandomVotes() },
        { id: 'zt_opt4', text: "Wait until after you're married.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("9 hours, 56 minutes")).toISOString(),
    createdAt: generateCreatedAt("9 hours, 56 minutes"),
  },
  {
    id: 'poll_zoe_hair_color',
    creator: findUser('Zoe Cook'),
    question: "I'm thinking about dying my hair a crazy, unnatural color. Bold fashion statement or future regret?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'zhc_opt1', text: "Bold statement! Express yourself.", votes: generateRandomVotes() },
        { id: 'zhc_opt2', text: "Future regret, stick to natural.", votes: generateRandomVotes() },
        { id: 'zhc_opt3', text: "Try a temporary color first.", votes: generateRandomVotes() },
        { id: 'zhc_opt4', text: "Consult a colorist for best results.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("5 days, 4 hours, 23 minutes")).toISOString(),
    createdAt: generateCreatedAt("5 days, 4 hours, 23 minutes"),
  },
  {
    id: 'poll_ethan_career_switch',
    creator: findUser('Ethan Morgan'),
    question: "Should I go back to school to switch careers in my 40s? It feels like now or never.",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'ecs_opt1', text: "Now or never! Invest in your future.", votes: generateRandomVotes() },
        { id: 'ecs_opt2', text: "Too late, focus on retirement.", votes: generateRandomVotes() },
        { id: 'ecs_opt3', text: "Part-time study, gradual transition.", votes: generateRandomVotes() },
        { id: 'ecs_opt4', text: "Explore certifications instead of a full degree.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("20 days, 11 hours, 57 minutes")).toISOString(),
    createdAt: generateCreatedAt("20 days, 11 hours, 57 minutes"),
  },
  {
    id: 'poll_frank_laser',
    creator: findUser('Frank Bell'),
    question: "My pet is obsessed with chasing laser pointers. Is it fun for them, or secretly frustrating because they can never 'catch' it?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'fl_opt1', text: "Fun and good exercise!", votes: generateRandomVotes() },
        { id: 'fl_opt2', text: "Frustrating, avoid them.", votes: generateRandomVotes() },
        { id: 'fl_opt3', text: "Use it as a warm-up, then a real toy.", votes: generateRandomVotes() },
        { id: 'fl_opt4', text: "Only if there's a tangible reward at the end.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 days, 19 hours, 32 minutes")).toISOString(),
    createdAt: generateCreatedAt("3 days, 19 hours, 32 minutes"),
  },
  {
    id: 'poll_gary_resume',
    creator: findUser('Gary Murphy'),
    question: "Is it ever okay to lie on a resume to get a job, then learn the skills quickly?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'gr_opt1', text: "No, it's unethical and you'll get caught.", votes: generateRandomVotes() },
        { id: 'gr_opt2', text: "Yes, if you're confident you can learn fast.", votes: generateRandomVotes() },
        { id: 'gr_opt3', text: "Only if it's a minor exaggeration.", votes: generateRandomVotes() },
        { id: 'gr_opt4', text: "Better to be honest and highlight transferable skills.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("25 days, 6 hours, 8 minutes")).toISOString(),
    createdAt: generateCreatedAt("25 days, 6 hours, 8 minutes"),
  },
  {
    id: 'poll_henry_polyamory',
    creator: findUser('Henry Bailey'),
    question: "Should I try polyamory with my long-term partner? It sounds exciting but also terrifying.",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'hp_opt1_poly', text: "Explore it, but with clear boundaries and communication.", votes: generateRandomVotes() },
        { id: 'hp_opt2_poly', text: "No, stick to monogamy.", votes: generateRandomVotes() },
        { id: 'hp_opt3_poly', text: "Suggest an open relationship first.", votes: generateRandomVotes() },
        { id: 'hp_opt4_poly', text: "Seek couples therapy to discuss it.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 hour, 47 minutes")).toISOString(),
    createdAt: generateCreatedAt("1 hour, 47 minutes"),
  },
  {
    id: 'poll_ian_fiance',
    creator: findUser('Ian Cooper'),
    question: "My best friend just got engaged, but I secretly hate their fiancé. Do I fake enthusiasm or express my concerns?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'if_opt1', text: "Fake enthusiasm, it's their happiness.", votes: generateRandomVotes() },
        { id: 'if_opt2', text: "Express concerns gently and privately.", votes: generateRandomVotes() },
        { id: 'if_opt3', text: "Distance yourself from the friendship.", votes: generateRandomVotes() },
        { id: 'if_opt4', text: "Get to know the fiancé better.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("16 days, 23 hours, 12 minutes")).toISOString(),
    createdAt: generateCreatedAt("16 days, 23 hours, 12 minutes"),
  },
  {
    id: 'poll_jack_vcard_again',
    creator: findUser('Jack Howard'),
    question: "Finna lose my V-card, besties. To wrap it or not to wrap it? Low-key kinda nervous but also wanna YOLO. What's the tea?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'jva_opt1', text: "Always wrap it, no cap. Safety first!", votes: generateRandomVotes() },
        { id: 'jva_opt2', text: "YOLO, but smart YOLO. Get tested, then maybe raw dog it.", votes: generateRandomVotes() },
        { id: 'jva_opt3', text: "Nah, pull out game strong. Trust the vibes.", votes: generateRandomVotes() },
        { id: 'jva_opt4', text: "Do both! Wrap it then pull out. Double protection.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 hours, 38 minutes")).toISOString(),
    createdAt: generateCreatedAt("6 hours, 38 minutes"),
  },
  {
    id: 'poll_justin_beer',
    creator: findUser('Justin Kelly'),
    question: "Wife just gave me the side-eye for another beer during the game. My team's down, and I need this. Do I risk the wrath or just hydrate?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'jb_opt1', text: "Go for it! It's game day, you earned it.", votes: generateRandomVotes() },
        { id: 'jb_opt2', text: "Nah, happy wife, happy life. Stick to water.", votes: generateRandomVotes() },
        { id: 'jb_opt3', text: "Sneak one. She'll never know.", votes: generateRandomVotes() },
        { id: 'jb_opt4', text: "Compromise: One more, then you owe her a back rub.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("11 days, 15 hours, 3 minutes")).toISOString(),
    createdAt: generateCreatedAt("11 days, 15 hours, 3 minutes"),
  },
  {
    id: 'poll_david_boss',
    creator: findUser('David Kelly'),
    question: "My boss is taking credit for my ideas. Do I speak up and risk my job, or let them shine and fume in silence?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'db_opt1', text: "Speak up! Your work deserves recognition.", votes: generateRandomVotes() },
        { id: 'db_opt2', text: "Suck it up, play the long game.", votes: generateRandomVotes() },
        { id: 'db_opt3', text: "Document everything and build a case.", votes: generateRandomVotes() },
        { id: 'db_opt4', text: "Start looking for a new job.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("5 days, 1 hour, 27 minutes")).toISOString(),
    createdAt: generateCreatedAt("5 days, 1 hour, 27 minutes"),
  },
  {
    id: 'poll_michael_marriage',
    creator: findUser('Michael Sanders'),
    question: "After 25 years, my marriage feels like a forgotten Netflix subscription. Do I finally cancel it or try to find a new series to binge together?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'mm_opt1', text: "It's time to explore new horizons. You deserve happiness.", votes: generateRandomVotes() },
        { id: 'mm_opt2', text: "Try couples counseling. You've invested too much to give up easily.", votes: generateRandomVotes() },
        { id: 'mm_opt3', text: "Take a break, assess, then decide. No rushed decisions.", votes: generateRandomVotes() },
        { id: 'mm_opt4', text: "Rekindle the spark with a grand gesture.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("22 days, 18 hours, 40 minutes")).toISOString(),
    createdAt: generateCreatedAt("22 days, 18 hours, 40 minutes"),
  },
  {
    id: 'poll_james_snacks',
    creator: findUser('James Price'),
    question: "My doctor said I should cut down on late-night snacks. But how am I supposed to watch my shows without my chips and salsa? Give me the hard truth.",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'js_opt1', text: "Swap snacks for fruit/veggies. Healthy crunch!", votes: generateRandomVotes() },
        { id: 'js_opt2', text: "Limit it to once a week. Treat yourself responsibly.", votes: generateRandomVotes() },
        { id: 'js_opt3', text: "Eat dinner later. No need for snacks if you're full.", votes: generateRandomVotes() },
        { id: 'js_opt4', text: "Ignore the doctor, live a little!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("13 hours, 2 minutes")).toISOString(),
    createdAt: generateCreatedAt("13 hours, 2 minutes"),
  },
  {
    id: 'poll_john_vacation',
    creator: findUser('John Bennett'),
    question: "Dream vacation: Backpacking through Europe on a shoestring budget, or luxury resort in the Maldives? My wallet says one, my soul says the other.",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'jv_opt1', text: "Embrace the adventure, Europe!", votes: generateRandomVotes() },
        { id: 'jv_opt2', text: "Maldives, treat yourself!", votes: generateRandomVotes() },
        { id: 'jv_opt3', text: "Save up and do both later.", votes: generateRandomVotes() },
        { id: 'jv_opt4', text: "Compromise: A fancy staycation.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("18 days, 9 hours, 59 minutes")).toISOString(),
    createdAt: generateCreatedAt("18 days, 9 hours, 59 minutes"),
  },
  {
    id: 'poll_robert_llama',
    creator: findUser('Robert Wood'),
    question: "Should I quit my stable but soul-crushing job to pursue my passion for llama grooming? My parents think I'm nuts.",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'rl_opt1', text: "Follow your dreams, llamas await!", votes: generateRandomVotes() },
        { id: 'rl_opt2', text: "Stay put, security is key.", votes: generateRandomVotes() },
        { id: 'rl_opt3', text: "Part-time llama grooming first, then decide.", votes: generateRandomVotes() },
        { id: 'rl_opt4', text: "Find a new stable job that doesn't crush your soul.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 days, 20 hours, 15 minutes")).toISOString(),
    createdAt: generateCreatedAt("6 days, 20 hours, 15 minutes"),
  },
  {
    id: 'poll_ava_ex_wedding',
    creator: findUser('Ava Williams'), // Already exists
    question: "My ex just invited me to their wedding. Do I go and be the bigger person, or politely decline and avoid the drama?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'aew_opt1', text: "Go, show them you're thriving!", votes: generateRandomVotes() },
        { id: 'aew_opt2', text: "Decline, spare yourself the awkwardness.", votes: generateRandomVotes() },
        { id: 'aew_opt3', text: "Send a nice gift, but don't attend.", votes: generateRandomVotes() },
        { id: 'aew_opt4', text: "Bring a hotter date.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 5 hours, 42 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 days, 5 hours, 42 minutes"),
  },
  {
    id: 'poll_lily_white_dress',
    creator: findUser('Lily Roberts'), // Already exists
    question: "Is it okay to wear white after Labor Day? My grandma would have a fit, but it's such a cute outfit!",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'lwd_opt1', text: "Fashion rules are meant to be broken!", votes: generateRandomVotes() },
        { id: 'lwd_opt2', text: "Stick to tradition, respect your elders.", votes: generateRandomVotes() },
        { id: 'lwd_opt3', text: "Who cares? Wear what makes you happy!", votes: generateRandomVotes() },
        { id: 'lwd_opt4', text: "Only if it's a winter white.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("21 days, 14 hours, 36 minutes")).toISOString(),
    createdAt: generateCreatedAt("21 days, 14 hours, 36 minutes"),
  },
  {
    id: 'poll_emily_cat_counter',
    creator: findUser('Emily Green'), // Already exists
    question: "My cat keeps knocking things off the counter just to get attention. Do I ignore her, or teach her a lesson (humanely, of course)?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'ecc_opt1', text: "Ignore the behavior, she's craving attention.", votes: generateRandomVotes() },
        { id: 'ecc_opt2', text: "Use positive reinforcement for good behavior.", votes: generateRandomVotes() },
        { id: 'ecc_opt3', text: "A gentle squirt bottle works wonders.", votes: generateRandomVotes() },
        { id: 'ecc_opt4', text: "Accept your fate; you live with a cat.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 day, 9 hours, 5 minutes")).toISOString(),
    createdAt: generateCreatedAt("1 day, 9 hours, 5 minutes"),
  },
  {
    id: 'poll_charlotte_wallet',
    creator: findUser('Charlotte Wilson'), // Already exists
    question: "I found a wallet with a huge wad of cash. Do I return it to the address inside, or 'find' a way to make it disappear?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'cw_opt1', text: "Return it immediately, it's the right thing to do.", votes: generateRandomVotes() },
        { id: 'cw_opt2', text: "Keep it, finders keepers!", votes: generateRandomVotes() },
        { id: 'cw_opt3', text: "Turn it into the police station.", votes: generateRandomVotes() },
        { id: 'cw_opt4', text: "Donate it to a charity in their name.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("15 days, 17 hours, 29 minutes")).toISOString(),
    createdAt: generateCreatedAt("15 days, 17 hours, 29 minutes"),
  },
  {
    id: 'poll_hannah_bathroom_reno',
    creator: findUser('Hannah Baker'), // Already exists
    question: "Should I DIY my bathroom renovation and save a ton, or hire a pro and avoid a potential disaster?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'hbr_opt1', text: "DIY! You'll learn so much.", votes: generateRandomVotes() },
        { id: 'hbr_opt2', text: "Hire a pro, peace of mind is priceless.", votes: generateRandomVotes() },
        { id: 'hbr_opt3', text: "Start DIY, call a pro when it gets tough.", votes: generateRandomVotes() },
        { id: 'hbr_opt4', text: "Watch YouTube tutorials and then decide.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 days, 16 hours, 50 minutes")).toISOString(),
    createdAt: generateCreatedAt("3 days, 16 hours, 50 minutes"),
  },
  {
    id: 'poll_sophia_toddler_cape',
    creator: findUser('Sophia Miller'), // Already exists
    question: "My toddler insists on wearing their superhero cape to daycare every day. Do I let them, or make them wear 'normal' clothes?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'stc_opt1', text: "Let them shine! Embrace the cape.", votes: generateRandomVotes() },
        { id: 'stc_opt2', text: "Daycare has a dress code for a reason.", votes: generateRandomVotes() },
        { id: 'stc_opt3', text: "Compromise: Cape for playtime only.", votes: generateRandomVotes() },
        { id: 'stc_opt4', text: "Use it as a bargaining chip for good behavior.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("26 days, 22 hours, 1 minute")).toISOString(),
    createdAt: generateCreatedAt("26 days, 22 hours, 1 minute"),
  },
  {
    id: 'poll_ava_matching_tattoo',
    creator: findUser('Ava Williams'), // Already exists
    question: "My partner wants to get a matching tattoo. I love them, but... forever? Should I say yes or suggest something less permanent?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'amt_opt1', text: "Go for it! True love ink.", votes: generateRandomVotes() },
        { id: 'amt_opt2', text: "Suggest temporary tattoos first.", votes: generateRandomVotes() },
        { id: 'amt_opt3', text: "Decline gracefully, it's a big commitment.", votes: generateRandomVotes() },
        { id: 'amt_opt4', text: "Get it somewhere easily hidden.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("10 hours, 11 minutes")).toISOString(),
    createdAt: generateCreatedAt("10 hours, 11 minutes"),
  },
  {
    id: 'poll_olivia_shave_head',
    creator: findUser('Olivia Rodriguez'), // Already exists
    question: "Should I shave my head for charity, even though I've had long hair my whole life? It's for a great cause but also... my hair!",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'osh_opt1', text: "Do it! A bold move for a good cause.", votes: generateRandomVotes() },
        { id: 'osh_opt2', text: "Donate money instead, keep the hair.", votes: generateRandomVotes() },
        { id: 'osh_opt3', text: "Cut it short, but not all the way.", votes: generateRandomVotes() },
        { id: 'osh_opt4', text: "Wig it out afterward!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("4 days, 18 hours, 33 minutes")).toISOString(),
    createdAt: generateCreatedAt("4 days, 18 hours, 33 minutes"),
  },
  {
    id: 'poll_sarah_dog_bark',
    creator: findUser('Sarah Young'), // Already exists
    question: "My neighbor's dog barks constantly. Do I confront them directly, leave a polite note, or suffer in silence?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'sdb_opt1', text: "Direct confrontation, but be polite.", votes: generateRandomVotes() },
        { id: 'sdb_opt2', text: "Leave an anonymous, polite note.", votes: generateRandomVotes() },
        { id: 'sdb_opt3', text: "Suffer, it's not worth the drama.", votes: generateRandomVotes() },
        { id: 'sdb_opt4', text: "Offer to walk their dog.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("19 days, 1 hour, 46 minutes")).toISOString(),
    createdAt: generateCreatedAt("19 days, 1 hour, 46 minutes"),
  },
  {
    id: 'poll_emma_pineapple_pizza',
    creator: findUser('Emma Davis'), // Already exists
    question: "Is pineapple on pizza an abomination or a stroke of genius? The debate rages on.",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'epp_opt1', text: "Genius! Sweet and savory perfection.", votes: generateRandomVotes() },
        { id: 'epp_opt2', text: "Abomination! Keep fruit off my pizza.", votes: generateRandomVotes() },
        { id: 'epp_opt3', text: "Only if it's accompanied by ham.", votes: generateRandomVotes() },
        { id: 'epp_opt4', text: "I'm neutral, but I respect the passion.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 days, 17 hours, 25 minutes")).toISOString(),
    createdAt: generateCreatedAt("7 days, 17 hours, 25 minutes"),
  },
  {
    id: 'poll_amelia_senior_dog',
    creator: findUser('Amelia Taylor'), // Already exists
    question: "I'm thinking of adopting a senior dog. Is it a noble act of kindness or setting myself up for heartbreak too soon?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'asd_opt1', text: "Noble and rewarding! Give them a good home.", votes: generateRandomVotes() },
        { id: 'asd_opt2', text: "Heartbreak is inevitable, consider a younger dog.", votes: generateRandomVotes() },
        { id: 'asd_opt3', text: "Focus on the present joy, not future sorrow.", votes: generateRandomVotes() },
        { id: 'asd_opt4', text: "Fosters first to see if it's a fit.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 21 hours, 54 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 days, 21 hours, 54 minutes"),
  },
  {
    id: 'poll_grace_bridesmaid',
    creator: findUser('Grace Hall'), // Already exists
    question: "My friend wants me to be a bridesmaid, but the dress is hideous and expensive. Do I suck it up or decline?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'gb_opt1', text: "Suck it up, it's their big day!", votes: generateRandomVotes() },
        { id: 'gb_opt2', text: "Decline politely, explain your reasons.", votes: generateRandomVotes() },
        { id: 'gb_opt3', text: "Offer to pay for part of the dress.", votes: generateRandomVotes() },
        { id: 'gb_opt4', text: "Suggest a different dress style.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("23 days, 15 hours, 3 minutes")).toISOString(),
    createdAt: generateCreatedAt("23 days, 15 hours, 3 minutes"),
  },
  {
    id: 'poll_elizabeth_regift',
    creator: findUser('Elizabeth Martin'), // Already exists
    question: "Is it okay to re-gift a present if I know the person will actually use it?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'er_opt1', text: "Yes, practical and resourceful!", votes: generateRandomVotes() },
        { id: 'er_opt2', text: "No, it's tacky and disrespectful.", votes: generateRandomVotes() },
        { id: 'er_opt3', text: "Only if the original giver will never know.", votes: generateRandomVotes() },
        { id: 'er_opt4', text: "Only if it's truly something they'll love.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("14 hours, 51 minutes")).toISOString(),
    createdAt: generateCreatedAt("14 hours, 51 minutes"),
  },
  {
    id: 'poll_victoria_solo_trip',
    creator: findUser('Victoria Lee'), // Already exists
    question: "I'm considering a spontaneous solo trip across the country. Brave and empowering, or reckless and lonely?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'vst_opt1', text: "Brave! Embrace the adventure.", votes: generateRandomVotes() },
        { id: 'vst_opt2', text: "Reckless, plan it out first.", votes: generateRandomVotes() },
        { id: 'vst_opt3', text: "Empowering, but bring a friend.", votes: generateRandomVotes() },
        { id: 'vst_opt4', text: "Visit first, then decide.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 6 hours, 28 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 days, 6 hours, 28 minutes"),
  },
  {
    id: 'poll_madison_plants',
    creator: findUser('Madison Perez'), // Already exists
    question: "My plants are dying despite my best efforts. Do I give up on being a plant parent or buy more and try again?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'mp_opt1', text: "Try again! Green thumb in the making.", votes: generateRandomVotes() },
        { id: 'mp_opt2', text: "Give up, plants aren't for everyone.", votes: generateRandomVotes() },
        { id: 'mp_opt3', text: "Get a low-maintenance plant.", votes: generateRandomVotes() },
        { id: 'mp_opt4', text: "Hire a plant sitter.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("28 days, 16 hours, 43 minutes")).toISOString(),
    createdAt: generateCreatedAt("28 days, 16 hours, 43 minutes"),
  },
  {
    id: 'poll_liam_crypto',
    creator: findUser('Liam Garcia'), // Already exists
    question: "Should I invest my small savings in crypto and potentially get rich quick, or put it in a boring old savings account?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'lc_opt1', text: "To the moon! Crypto all the way.", votes: generateRandomVotes() },
        { id: 'lc_opt2', text: "Play it safe, savings account.", votes: generateRandomVotes() },
        { id: 'lc_opt3', text: "Diversify! A little bit of both.", votes: generateRandomVotes() },
        { id: 'lc_opt4', text: "Consult a financial advisor first.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("9 days, 23 hours, 56 minutes")).toISOString(),
    createdAt: generateCreatedAt("9 days, 23 hours, 56 minutes"),
  },
  {
    id: 'poll_ben_clothes',
    creator: findUser('Ben Ross'),
    question: "My partner keeps 'borrowing' my clothes without asking. Do I hide them, or just accept it's a shared wardrobe now?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'brc_opt1', text: "Hide them! These are MY clothes.", votes: generateRandomVotes() },
        { id: 'brc_opt2', text: "Accept it, sharing is caring (sometimes).", votes: generateRandomVotes() },
        { id: 'brc_opt3', text: "Buy them their own similar clothes.", votes: generateRandomVotes() },
        { id: 'brc_opt4', text: "Have a designated 'borrowing' drawer.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("15 days, 1 hour, 19 minutes")).toISOString(),
    createdAt: generateCreatedAt("15 days, 1 hour, 19 minutes"),
  },
  {
    id: 'poll_chris_minimalism',
    creator: findUser('Chris Henderson'),
    question: "Should I embrace minimalism and declutter my entire life, or cling to my beloved possessions?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'chm_opt1', text: "Declutter! Freedom through less stuff.", votes: generateRandomVotes() },
        { id: 'chm_opt2', text: "Cling! Memories are priceless.", votes: generateRandomVotes() },
        { id: 'chm_opt3', text: "Start small, declutter one room at a time.", votes: generateRandomVotes() },
        { id: 'chm_opt4', text: "Only keep things that 'spark joy'.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("30 days, 10 hours, 2 minutes")).toISOString(),
    createdAt: generateCreatedAt("30 days, 10 hours, 2 minutes"),
  },
  {
    id: 'poll_daniel_move_in',
    creator: findUser('Daniel Coleman'),
    question: "My significant other wants to move in together, but I love my personal space. Do I agree or hit the brakes?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'dmi_opt1', text: "Agree, it's the next step!", votes: generateRandomVotes() },
        { id: 'dmi_opt2', text: "Hit the brakes, personal space is vital.", votes: generateRandomVotes() },
        { id: 'dmi_opt3', text: "Suggest a trial period.", votes: generateRandomVotes() },
        { id: 'dmi_opt4', text: "Find a bigger place with separate zones.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 days, 18 hours, 39 minutes")).toISOString(),
    createdAt: generateCreatedAt("7 days, 18 hours, 39 minutes"),
  },
  {
    id: 'poll_olivia_organic_food_again', // Renamed ID slightly to avoid collision
    creator: findUser('Olivia Rodriguez'), // User exists
    question: "Is it worth buying organic food, or is it just a marketing gimmick?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'oof_opt1', text: "Definitely worth it for health and environment!", votes: generateRandomVotes() },
        { id: 'oof_opt2', text: "Marketing gimmick, save your money.", votes: generateRandomVotes() },
        { id: 'oof_opt3', text: "Some things yes, some things no (Dirty Dozen/Clean Fifteen).", votes: generateRandomVotes() },
        { id: 'oof_opt4', text: "Grow your own!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 14 hours, 55 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 days, 14 hours, 55 minutes"),
  },
  {
    id: 'poll_emma_vows_again', // Renamed ID slightly
    creator: findUser('Emma Davis'), // User exists
    question: "My partner wants to renew our vows on our 10th anniversary, but I feel like we're just going through the motions. Do I go along with it or be honest?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'eva_opt1', text: "Go along, it might rekindle something.", votes: generateRandomVotes() },
        { id: 'eva_opt2', text: "Be honest, address the underlying issues.", votes: generateRandomVotes() },
        { id: 'eva_opt3', text: "Suggest a different way to celebrate.", votes: generateRandomVotes() },
        { id: 'eva_opt4', text: "Surprise them with couples counseling instead.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("24 days, 6 hours, 29 minutes")).toISOString(),
    createdAt: generateCreatedAt("24 days, 6 hours, 29 minutes"),
  },
  {
    id: 'poll_chloe_secret_pet_again', // Renamed ID slightly
    creator: findUser('Chloe Wright'), // User exists
    question: "Should I get a pet without telling my landlord, and hope they don't find out?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'csp_opt1', text: "No! Get permission first, avoid eviction.", votes: generateRandomVotes() },
        { id: 'csp_opt2', text: "Yes, easier to ask forgiveness than permission.", votes: generateRandomVotes() },
        { id: 'csp_opt3', text: "Find a pet-friendly place.", votes: generateRandomVotes() },
        { id: 'csp_opt4', text: "Get a very quiet pet.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("19 hours, 4 minutes")).toISOString(),
    createdAt: generateCreatedAt("19 hours, 4 minutes"),
  },
  {
    id: 'poll_lily_read_texts_again', // Renamed ID
    creator: findUser('Lily Roberts'), // User exists
    question: "Is it okay to secretly read my partner's text messages if I suspect they're hiding something?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'lrt_opt1', text: "No! Respect their privacy.", votes: generateRandomVotes() },
        { id: 'lrt_opt2', text: "Yes, if your suspicions are strong.", votes: generateRandomVotes() },
        { id: 'lrt_opt3', text: "Talk to them directly first.", votes: generateRandomVotes() },
        { id: 'lrt_opt4', text: "Hire a private investigator.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("11 days, 19 hours, 58 minutes")).toISOString(),
    createdAt: generateCreatedAt("11 days, 19 hours, 58 minutes"),
  },
  {
    id: 'poll_ava_name_tattoo_again', // Renamed ID
    creator: findUser('Ava Williams'), // User exists
    question: "Should I get a tattoo of my current partner's name? Everyone says it's bad luck, but I feel it's true love.",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'ant_opt1', text: "No! Bad luck and bad ideas.", votes: generateRandomVotes() },
        { id: 'ant_opt2', text: "Yes! Declare your love boldly.", votes: generateRandomVotes() },
        { id: 'ant_opt3', text: "Get something symbolic instead.", votes: generateRandomVotes() },
        { id: 'ant_opt4', text: "Wait until after you're married.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("5 days, 8 hours, 35 minutes")).toISOString(),
    createdAt: generateCreatedAt("5 days, 8 hours, 35 minutes"),
  },
  {
    id: 'poll_sophia_crazy_hair_again', // Renamed ID
    creator: findUser('Sophia Miller'), // User exists
    question: "I'm thinking about dying my hair a crazy, unnatural color. Bold fashion statement or future regret?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'sch_opt1_again', text: "Bold statement! Express yourself.", votes: generateRandomVotes() },
        { id: 'sch_opt2_again', text: "Future regret, stick to natural.", votes: generateRandomVotes() },
        { id: 'sch_opt3_again', text: "Try a temporary color first.", votes: generateRandomVotes() },
        { id: 'sch_opt4_again', text: "Consult a colorist for best results.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("20 days, 14 hours, 21 minutes")).toISOString(),
    createdAt: generateCreatedAt("20 days, 14 hours, 21 minutes"),
  },
  {
    id: 'poll_harper_school_40s_again', // Renamed ID
    creator: findUser('Harper Anderson'), // User exists
    question: "Should I go back to school to switch careers in my 40s? It feels like now or never.",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'hs4_opt1', text: "Now or never! Invest in your future.", votes: generateRandomVotes() },
        { id: 'hs4_opt2', text: "Too late, focus on retirement.", votes: generateRandomVotes() },
        { id: 'hs4_opt3', text: "Part-time study, gradual transition.", votes: generateRandomVotes() },
        { id: 'hs4_opt4', text: "Explore certifications instead of a full degree.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 days, 22 hours, 44 minutes")).toISOString(),
    createdAt: generateCreatedAt("3 days, 22 hours, 44 minutes"),
  },
  {
    id: 'poll_evelyn_laser_pet_again', // Renamed ID
    creator: findUser('Evelyn Thomas'), // User exists
    question: "My pet is obsessed with chasing laser pointers. Is it fun for them, or secretly frustrating because they can never 'catch' it?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'elp_opt1', text: "Fun and good exercise!", votes: generateRandomVotes() },
        { id: 'elp_opt2', text: "Frustrating, avoid them.", votes: generateRandomVotes() },
        { id: 'elp_opt3', text: "Use it as a warm-up, then a real toy.", votes: generateRandomVotes() },
        { id: 'elp_opt4', text: "Only if there's a tangible reward at the end.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("25 days, 9 hours, 17 minutes")).toISOString(),
    createdAt: generateCreatedAt("25 days, 9 hours, 17 minutes"),
  },
  {
    id: 'poll_abigail_lie_resume_again', // Renamed ID
    creator: findUser('Abigail Jackson'), // User exists
    question: "Is it ever okay to lie on a resume to get a job, then learn the skills quickly?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'alr_opt1', text: "No, it's unethical and you'll get caught.", votes: generateRandomVotes() },
        { id: 'alr_opt2', text: "Yes, if you're confident you can learn fast.", votes: generateRandomVotes() },
        { id: 'alr_opt3', text: "Only if it's a minor exaggeration.", votes: generateRandomVotes() },
        { id: 'alr_opt4', text: "Better to be honest and highlight transferable skills.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 hour, 5 minutes")).toISOString(),
    createdAt: generateCreatedAt("1 hour, 5 minutes"),
  },
  {
    id: 'poll_ella_polyamory_again', // Renamed ID
    creator: findUser('Ella White'), // User exists
    question: "Should I try polyamory with my long-term partner? It sounds exciting but also terrifying.",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'epa_opt1', text: "Explore it, but with clear boundaries and communication.", votes: generateRandomVotes() },
        { id: 'epa_opt2', text: "No, stick to monogamy.", votes: generateRandomVotes() },
        { id: 'epa_opt3', text: "Suggest an open relationship first.", votes: generateRandomVotes() },
        { id: 'epa_opt4', text: "Seek couples therapy to discuss it.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("17 days, 12 hours, 30 minutes")).toISOString(),
    createdAt: generateCreatedAt("17 days, 12 hours, 30 minutes"),
  },
  {
    id: 'poll_scarlett_hate_fiance_again', // Renamed ID
    creator: findUser('Scarlett Harris'), // User exists
    question: "My best friend just got engaged, but I secretly hate their fiancé. Do I fake enthusiasm or express my concerns?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'shf_opt1', text: "Fake enthusiasm, it's their happiness.", votes: generateRandomVotes() },
        { id: 'shf_opt2', text: "Express concerns gently and privately.", votes: generateRandomVotes() },
        { id: 'shf_opt3', text: "Distance yourself from the friendship.", votes: generateRandomVotes() },
        { id: 'shf_opt4', text: "Get to know the fiancé better.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 days, 21 hours, 49 minutes")).toISOString(),
    createdAt: generateCreatedAt("6 days, 21 hours, 49 minutes"),
  },
  {
    id: 'poll_elizabeth_cook_microwave_again', // Renamed ID
    creator: findUser('Elizabeth Martin'), // User exists
    question: "Should I learn to cook elaborate meals, or stick to my trusty microwave dinners?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'ecm_opt1', text: "Learn to cook! It's a life skill.", votes: generateRandomVotes() },
        { id: 'ecm_opt2', text: "Microwave all the way, efficiency!", votes: generateRandomVotes() },
        { id: 'ecm_opt3', text: "Start with simple recipes, then level up.", votes: generateRandomVotes() },
        { id: 'ecm_opt4', text: "Order takeout!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 10 hours, 6 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 days, 10 hours, 6 minutes"),
  },
  {
    id: 'poll_sofia_roommate_cleans_again', // Renamed ID
    creator: findUser('Sophia Miller'), // User exists
    question: "My roommate never cleans. Do I create a chore chart, or passive-aggressively clean only my side?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'src_opt1', text: "Chore chart! Clear expectations.", votes: generateRandomVotes() },
        { id: 'src_opt2', text: "Passive aggression wins every time.", votes: generateRandomVotes() },
        { id: 'src_opt3', text: "Move out.", votes: generateRandomVotes() },
        { id: 'src_opt4', text: "Hire a cleaner for common areas.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("23 days, 14 hours, 43 minutes")).toISOString(),
    createdAt: generateCreatedAt("23 days, 14 hours, 43 minutes"),
  },
  {
    id: 'poll_camila_balance_life_again', // Renamed ID
    creator: findUser('Camila Thompson'), // User exists
    question: "Is it truly possible to balance a demanding career and a fulfilling family life, or is one always sacrificed for the other?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'cbl_opt1', text: "Yes, with careful planning and boundaries.", votes: generateRandomVotes() },
        { id: 'cbl_opt2', text: "No, it's an impossible dream for most.", votes: generateRandomVotes() },
        { id: 'cbl_opt3', text: "It depends on your definition of 'balance'.", votes: generateRandomVotes() },
        { id: 'cbl_opt4', text: "Outsource everything!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("15 hours, 31 minutes")).toISOString(),
    createdAt: generateCreatedAt("15 hours, 31 minutes"),
  },
  {
    id: 'poll_aria_dirty_socks_again', // Renamed ID
    creator: findUser('Aria Moore'), // User exists
    question: "My partner keeps leaving their dirty socks everywhere. Do I passive-aggressively put them on their pillow, or actually talk about it?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'ads_opt1', text: "Pillow revenge! It's a classic.", votes: generateRandomVotes() },
        { id: 'ads_opt2', text: "Communicate, it's the adult thing to do.", votes: generateRandomVotes() },
        { id: 'ads_opt3', text: "Hire a maid.", votes: generateRandomVotes() },
        { id: 'ads_opt4', text: "Collect them and present them as a 'gift'.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("10 days, 2 hours, 59 minutes")).toISOString(),
    createdAt: generateCreatedAt("10 days, 2 hours, 59 minutes"),
  },
  {
    id: 'poll_victoria_third_date_again', // Renamed ID
    creator: findUser('Victoria Lee'), // User exists
    question: "Should I go on a third date with someone who's super hot but has absolutely no ambition, or cut my losses?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'vtd_opt1', text: "Hotness fades, ambition lasts. Cut losses.", votes: generateRandomVotes() },
        { id: 'vtd_opt2', text: "Enjoy the hotness while it lasts!", votes: generateRandomVotes() },
        { id: 'vtd_opt3', text: "Give them another chance, maybe they'll grow.", votes: generateRandomVotes() },
        { id: 'vtd_opt4', text: "Friend-zone them and find someone with ambition.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("4 days, 13 hours, 24 minutes")).toISOString(),
    createdAt: generateCreatedAt("4 days, 13 hours, 24 minutes"),
  },
  {
    id: 'poll_madison_masters_debt_again', // Renamed ID
    creator: findUser('Madison Perez'), // User exists
    question: "Should I pursue a master's degree to advance my career, even if it means taking on significant student debt?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'mmd_opt1', text: "Invest in yourself, it will pay off.", votes: generateRandomVotes() },
        { id: 'mmd_opt2', text: "Debt is a trap, explore other options.", votes: generateRandomVotes() },
        { id: 'mmd_opt3', text: "Only if you're passionate about the subject.", votes: generateRandomVotes() },
        { id: 'mmd_opt4', text: "Crunch the numbers, is the ROI worth it?", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("19 days, 19 hours, 18 minutes")).toISOString(),
    createdAt: generateCreatedAt("19 days, 19 hours, 18 minutes"),
  },
  {
    id: 'poll_luna_new_city_again', // Renamed ID
    creator: findUser('Luna Walker'), // User exists
    question: "I'm thinking of moving to a completely new city where I know no one. Exciting fresh start, or terrifying leap into the unknown?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'lnc_opt1', text: "Exciting! Embrace the new adventure.", votes: generateRandomVotes() },
        { id: 'lnc_opt2', text: "Terrifying, build a network first.", votes: generateRandomVotes() },
        { id: 'lnc_opt3', text: "Do it, you'll grow immensely.", votes: generateRandomVotes() },
        { id: 'lnc_opt4', text: "Visit first, then decide.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 days, 4 hours, 51 minutes")).toISOString(),
    createdAt: generateCreatedAt("7 days, 4 hours, 51 minutes"),
  },
  {
    id: 'poll_grace_confess_feelings_again', // Renamed ID
    creator: findUser('Grace Hall'), // User exists
    question: "Should I confess my feelings to my long-time friend, even if it risks ruining our friendship?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'gcf_opt1', text: "Take the leap! You'll regret not knowing.", votes: generateRandomVotes() },
        { id: 'gcf_opt2', text: "Keep it platonic, friendship is too valuable.", votes: generateRandomVotes() },
        { id: 'gcf_opt3', text: "Test the waters subtly first.", votes: generateRandomVotes() },
        { id: 'gcf_opt4', text: "Wait for them to make a move.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 20 hours, 10 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 days, 20 hours, 10 minutes"),
  },
  {
    id: 'poll_natalie_car_repair_again', // Renamed ID
    creator: findUser('Natalie Allen'), // User exists
    question: "My car is on its last legs. Do I repair it one last time, or finally buy a new (or used) one?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'ncr_opt1', text: "Repair it, squeeze out every last mile.", votes: generateRandomVotes() },
        { id: 'ncr_opt2', text: "New car time! Enjoy the reliability.", votes: generateRandomVotes() },
        { id: 'ncr_opt3', text: "Used car, better value.", votes: generateRandomVotes() },
        { id: 'ncr_opt4', text: "Public transport is the way!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("24 days, 11 hours, 37 minutes")).toISOString(),
    createdAt: generateCreatedAt("24 days, 11 hours, 37 minutes"),
  },
  {
    id: 'poll_sarah_partner_cooking_again', // Renamed ID
    creator: findUser('Sarah Young'), // User exists
    question: "Is it okay to secretly dislike my partner's cooking, or should I tell them the truth (gently, of course)?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'spc_opt1', text: "Pretend to love it, save their feelings.", votes: generateRandomVotes() },
        { id: 'spc_opt2', text: "Tell them gently, offer to cook together.", votes: generateRandomVotes() },
        { id: 'spc_opt3', text: "Suggest takeout more often.", votes: generateRandomVotes() },
        { id: 'spc_opt4', text: "Just eat less of it.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("16 hours, 23 minutes")).toISOString(),
    createdAt: generateCreatedAt("16 hours, 23 minutes"),
  },
  {
    id: 'poll_alice_extreme_sport_again', // Renamed ID
    creator: findUser('Alice Wonderland'), // User exists
    question: "Should I try a new, extreme sport like skydiving or rock climbing, or stick to my cozy hobbies?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'aes_opt1', text: "Go for it! Adrenaline rush!", votes: generateRandomVotes() },
        { id: 'aes_opt2', text: "Stay cozy, safety first.", votes: generateRandomVotes() },
        { id: 'aes_opt3', text: "Start small, try bouldering first.", votes: generateRandomVotes() },
        { id: 'aes_opt4', text: "Live vicariously through YouTube.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("11 days, 8 hours, 4 minutes")).toISOString(),
    createdAt: generateCreatedAt("11 days, 8 hours, 4 minutes"),
  },
  {
    id: 'poll_bella_pet_surgery_again', // Renamed ID
    creator: findUser('Bella King'), // User exists
    question: "My pet needs an expensive surgery. Do I drain my savings for it, or consider other options?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'bps_opt1', text: "Save your pet, cost is secondary!", votes: generateRandomVotes() },
        { id: 'bps_opt2', text: "Consider quality of life, explore alternatives.", votes: generateRandomVotes() },
        { id: 'bps_opt3', text: "Look for financial aid/pet charities.", votes: generateRandomVotes() },
        { id: 'bps_opt4', text: "It's just a pet, be practical.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("5 days, 2 hours, 16 minutes")).toISOString(),
    createdAt: generateCreatedAt("5 days, 2 hours, 16 minutes"),
  },
  {
    id: 'poll_lily_apology_timing_again', // Renamed ID
    creator: findUser('Lily Roberts'), // User exists
    question: "Is it better to apologize immediately when you're wrong, or wait until emotions cool down?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'lat_opt1', text: "Immediately, clear the air.", votes: generateRandomVotes() },
        { id: 'lat_opt2', text: "Wait, a calm apology is more effective.", votes: generateRandomVotes() },
        { id: 'lat_opt3', text: "It depends on the situation.", votes: generateRandomVotes() },
        { id: 'lat_opt4', text: "Never apologize, assert dominance!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("20 days, 16 hours, 32 minutes")).toISOString(),
    createdAt: generateCreatedAt("20 days, 16 hours, 32 minutes"),
  },
  {
    id: 'poll_emma_problematic_posts_again', // Renamed ID
    creator: findUser('Emma Davis'), // User exists
    question: "Should I confront my friend about their problematic social media posts, or is it not my place?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'epp_opt1_again', text: "Confront them privately, from a place of care.", votes: generateRandomVotes() },
        { id: 'epp_opt2_again', text: "It's not your place, let them be.", votes: generateRandomVotes() },
        { id: 'epp_opt3_again', text: "Unfollow/mute them.", votes: generateRandomVotes() },
        { id: 'epp_opt4_again', text: "Publicly call them out.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 days, 15 hours, 48 minutes")).toISOString(),
    createdAt: generateCreatedAt("3 days, 15 hours, 48 minutes"),
  },
  {
    id: 'poll_olivia_freelance_client_again', // Renamed ID
    creator: findUser('Olivia Rodriguez'), // User exists
    question: "I'm a freelancer and a potential client is offering a huge project but has a terrible reputation. Do I take the money or protect my peace?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'ofc_opt1', text: "Take the money, deal with the headache later.", votes: generateRandomVotes() },
        { id: 'ofc_opt2', text: "Protect your peace, it's not worth it.", votes: generateRandomVotes() },
        { id: 'ofc_opt3', text: "Negotiate stricter terms and upfront payment.", votes: generateRandomVotes() },
        { id: 'ofc_opt4', text: "Get a lawyer to review the contract.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("25 days, 12 hours, 5 minutes")).toISOString(),
    createdAt: generateCreatedAt("25 days, 12 hours, 5 minutes"),
  },
  {
    id: 'poll_charlotte_parental_pressure_again', // Renamed ID
    creator: findUser('Charlotte Wilson'), // User exists
    question: "My parents are pressuring me to have kids. Do I give in or stand my ground on my childfree choice?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'cpp_opt1', text: "It's your life, stand your ground!", votes: generateRandomVotes() },
        { id: 'cpp_opt2', text: "Consider it, maybe you'll change your mind.", votes: generateRandomVotes() },
        { id: 'cpp_opt3', text: "Compromise: get a pet instead.", votes: generateRandomVotes() },
        { id: 'cpp_opt4', text: "Tell them you're infertile (jk... mostly).", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 hours, 10 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 hours, 10 minutes"),
  },
  {
    id: 'poll_amelia_designer_splurge_again', // Renamed ID
    creator: findUser('Amelia Taylor'), // User exists
    question: "Should I splurge on this designer item I've been eyeing, or save that money for something more practical?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'ads_opt1_again', text: "Treat yourself! You deserve it.", votes: generateRandomVotes() },
        { id: 'ads_opt2_again', text: "Save it, practicality wins.", votes: generateRandomVotes() },
        { id: 'ads_opt3_again', text: "Set a budget and stick to it.", votes: generateRandomVotes() },
        { id: 'ads_opt4_again', text: "Buy a high-quality dupe.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("17 days, 1 hour, 39 minutes")).toISOString(),
    createdAt: generateCreatedAt("17 days, 1 hour, 39 minutes"),
  },
  {
    id: 'poll_harper_job_offer_again', // Renamed ID
    creator: findUser('Harper Anderson'), // User exists
    question: "I received a job offer but I'm also waiting to hear back from my dream company. Do I accept or hold out?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'hjo_opt1', text: "Accept the offer, a bird in hand...", votes: generateRandomVotes() },
        { id: 'hjo_opt2', text: "Hold out for the dream job, it's worth the risk.", votes: generateRandomVotes() },
        { id: 'hjo_opt3', text: "Ask for an extension on the offer.", votes: generateRandomVotes() },
        { id: 'hjo_opt4', text: "Negotiate for a later start date.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 days, 17 hours, 28 minutes")).toISOString(),
    createdAt: generateCreatedAt("6 days, 17 hours, 28 minutes"),
  },
  {
    id: 'poll_evelyn_natural_hair_again', // Renamed ID
    creator: findUser('Evelyn Thomas'), // User exists
    question: "Should I embrace my natural hair texture, or continue with my elaborate styling routine?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'enh_opt1', text: "Embrace the natural! Freedom awaits.", votes: generateRandomVotes() },
        { id: 'enh_opt2', text: "Stick to the routine, it's your signature.", votes: generateRandomVotes() },
        { id: 'enh_opt3', text: "Mix it up: natural some days, styled others.", votes: generateRandomVotes() },
        { id: 'enh_opt4', text: "Consult a stylist for low-maintenance options.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 15 hours, 45 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 days, 15 hours, 45 minutes"),
  },
  {
    id: 'poll_abigail_white_lie_again', // Renamed ID
    creator: findUser('Abigail Jackson'), // User exists
    question: "Is it okay to lie to spare someone's feelings, or is brutal honesty always the best policy?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'awl_opt1', text: "Lie gently, kindness first.", votes: generateRandomVotes() },
        { id: 'awl_opt2', text: "Honesty, even if it hurts short-term.", votes: generateRandomVotes() },
        { id: 'awl_opt3', text: "It depends on the severity of the lie/truth.", votes: generateRandomVotes() },
        { id: 'awl_opt4', text: "Use white lies sparingly.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("23 days, 10 hours, 19 minutes")).toISOString(),
    createdAt: generateCreatedAt("23 days, 10 hours, 19 minutes"),
  },
  {
    id: 'poll_ella_creative_block_again', // Renamed ID
    creator: findUser('Ella White'), // User exists
    question: "My creative project is stalled. Do I push through the block, or take a break and come back later?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'ecb_opt1', text: "Push through! Discipline is key.", votes: generateRandomVotes() },
        { id: 'ecb_opt2', text: "Take a break, recharge your creativity.", votes: generateRandomVotes() },
        { id: 'ecb_opt3', text: "Seek inspiration from others.", votes: generateRandomVotes() },
        { id: 'ecb_opt4', text: "Collaborate with someone new.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("15 hours, 7 minutes")).toISOString(),
    createdAt: generateCreatedAt("15 hours, 7 minutes"),
  },
  {
    id: 'poll_scarlett_bangs_again', // Renamed ID
    creator: findUser('Scarlett Harris'), // User exists
    question: "Should I get bangs? It feels like a big commitment for my face shape.",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'sb_opt1', text: "Go for it! Hair grows back.", votes: generateRandomVotes() },
        { id: 'sb_opt2', text: "No bangs, too much maintenance.", votes: generateRandomVotes() },
        { id: 'sb_opt3', text: "Try clip-in bangs first.", votes: generateRandomVotes() },
        { id: 'sb_opt4', text: "Ask your stylist for their professional opinion.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("10 days, 21 hours, 53 minutes")).toISOString(),
    createdAt: generateCreatedAt("10 days, 21 hours, 53 minutes"),
  },
  {
    id: 'poll_elizabeth_coffee_spill_again', // Renamed ID
    creator: findUser('Elizabeth Martin'), // User exists
    question: "I accidentally spilled coffee on my friend's expensive rug. Do I confess immediately and offer to clean/pay, or try to clean it secretly?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'ecs_opt1_3', text: "Confess immediately, honesty is best.", votes: generateRandomVotes() },
        { id: 'ecs_opt2_3', text: "Clean it secretly, hope they don't notice.", votes: generateRandomVotes() },
        { id: 'ecs_opt3_3', text: "Blame the dog.", votes: generateRandomVotes() },
        { id: 'ecs_opt4_3', text: "Offer to buy them a new rug.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("4 days, 6 hours, 26 minutes")).toISOString(),
    createdAt: generateCreatedAt("4 days, 6 hours, 26 minutes"),
  },
  {
    id: 'poll_sofia_late_party_again', // Renamed ID
    creator: findUser('Sophia Miller'), // User exists
    question: "Is it ever okay to show up late to a party, or is punctuality always king?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'slp_opt1', text: "Fashionably late is a vibe.", votes: generateRandomVotes() },
        { id: 'slp_opt2', text: "Always be on time, it's respectful.", votes: generateRandomVotes() },
        { id: 'slp_opt3', text: "Only if you have a good excuse.", votes: generateRandomVotes() },
        { id: 'slp_opt4', text: "Show up early to help set up!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("19 days, 2 hours, 40 minutes")).toISOString(),
    createdAt: generateCreatedAt("19 days, 2 hours, 40 minutes"),
  },
  {
    id: 'poll_camila_secret_dating_again', // Renamed ID
    creator: findUser('Camila Thompson'), // User exists
    question: "Should I tell my parents I'm dating someone they won't approve of, or keep it a secret?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'csd_opt1', text: "Tell them, honesty is the best policy.", votes: generateRandomVotes() },
        { id: 'csd_opt2', text: "Keep it secret to avoid conflict.", votes: generateRandomVotes() },
        { id: 'csd_opt3', text: "Introduce them gradually.", votes: generateRandomVotes() },
        { id: 'csd_opt4', text: "Wait until it's serious.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 days, 15 hours, 5 minutes")).toISOString(),
    createdAt: generateCreatedAt("7 days, 15 hours, 5 minutes"),
  },
  {
    id: 'poll_aria_save_coffeeshop_again', // Renamed ID
    creator: findUser('Aria Moore'), // User exists
    question: "My favorite local coffee shop is closing. Do I try to rally the community to save it, or mourn its loss quietly?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'asc_opt1', text: "Rally the troops! Fight for your coffee!", votes: generateRandomVotes() },
        { id: 'asc_opt2', text: "Mourn quietly, some things aren't meant to last.", votes: generateRandomVotes() },
        { id: 'asc_opt3', text: "Support other local businesses.", votes: generateRandomVotes() },
        { id: 'asc_opt4', text: "Start your own coffee shop.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days, 11 hours, 28 minutes")).toISOString(),
    createdAt: generateCreatedAt("2 days, 11 hours, 28 minutes"),
  },
  {
    id: 'poll_leo_new_language_again', // Renamed ID
    creator: findUser('Leo Jenkins'),
    question: "Should I learn a new language, or focus on becoming an expert in a skill I already have?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'lnl_opt1', text: "New language! Expand your horizons.", votes: generateRandomVotes() },
        { id: 'lnl_opt2', text: "Master current skills, depth over breadth.", votes: generateRandomVotes() },
        { id: 'lnl_opt3', text: "Do both, slowly but surely.", votes: generateRandomVotes() },
        { id: 'lnl_opt4', text: "Learn a language relevant to your existing skill.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("24 days, 18 hours, 3 minutes")).toISOString(),
    createdAt: generateCreatedAt("24 days, 18 hours, 3 minutes"),
  },
  {
    id: 'poll_mark_unfollow_friend_again', // Renamed ID
    creator: findUser('Mark Perry'),
    question: "Is it okay to unfollow a friend on social media if their content is consistently annoying/negative?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'muf_opt1', text: "Yes, protect your peace.", votes: generateRandomVotes() },
        { id: 'muf_opt2', text: "No, it's rude and childish.", votes: generateRandomVotes() },
        { id: 'muf_opt3', text: "Mute them instead of unfollowing.", votes: generateRandomVotes() },
        { id: 'muf_opt4', text: "Talk to them about it first.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("17 hours, 49 minutes")).toISOString(),
    createdAt: generateCreatedAt("17 hours, 49 minutes"),
  },
  {
    id: 'poll_nate_dog_cat_again', // Renamed ID
    creator: findUser('Nate Powell'),
    question: "I'm torn between getting a dog or a cat. Help me decide, fur parents!",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'ndc_opt1', text: "Team Dog! Loyalty and adventure.", votes: generateRandomVotes() },
        { id: 'ndc_opt2', text: "Team Cat! Independent and cuddly.", votes: generateRandomVotes() },
        { id: 'ndc_opt3', text: "Get both if you can handle it!", votes: generateRandomVotes() },
        { id: 'ndc_opt4', text: "Neither, get a fish.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("12 days, 10 hours, 14 minutes")).toISOString(),
    createdAt: generateCreatedAt("12 days, 10 hours, 14 minutes"),
  },
  {
    id: 'poll_oscar_volunteer_self_again', // Renamed ID
    creator: findUser('Oscar Long'),
    question: "Should I volunteer my time to a cause I believe in, or focus solely on my own self-improvement right now?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
        { id: 'ovs_opt1', text: "Volunteer! Give back to the community.", votes: generateRandomVotes() },
        { id: 'ovs_opt2', text: "Focus on self-improvement first, then volunteer.", votes: generateRandomVotes() },
        { id: 'ovs_opt3', text: "Do a little of both.", votes: generateRandomVotes() },
        { id: 'ovs_opt4', text: "Join a group that combines both!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 days, 2 hours, 36 minutes")).toISOString(),
    createdAt: generateCreatedAt("6 days, 2 hours, 36 minutes"),
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
    id: 'poll_lunch_choice_new', // Renamed ID slightly
    creator: findUser('Hungry Harry'),
    question: "What to eat for lunch? Tuna sandwich or grilled chicken wrap?",
    imageUrls: ['https://placehold.co/600x400.png'], 
    options: [
      { id: 'lc_opt1_new_v2', text: 'Tuna Sandwich Classic', votes: generateRandomVotes() },
      { id: 'lc_opt2_new_v2', text: 'Grilled Chicken Wrap Delight', votes: generateRandomVotes() },
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
  
  const shouldBeVoted = (index % 3 === 0); 
  let determinedVotedOptionId: string | undefined = undefined;
  if (shouldBeVoted && pollSkeleton.options.length > 0) {
    determinedVotedOptionId = pollSkeleton.options[0].id; 
  }

  let pledgeAmount = generateRandomPledge();
  let tipCount = generateRandomTips();
  
  // Deterministic likes and comments counts
  const likes = (index * 7 % 280) + 20; // Cycle through values for variety but keep consistent
  const commentsCount = (index * 3 % 45) + 5;


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
  }


  return {
    ...pollSkeleton,
    totalVotes,
    isVoted: shouldBeVoted,
    votedOptionId: determinedVotedOptionId,
    likes,
    commentsCount,
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

    
