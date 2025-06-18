
import type { Poll, User } from '@/types';

const generateRandomVotes = () => Math.floor(Math.random() * 300) + 10;
const generateRandomTips = () => Math.floor(Math.random() * 50);
const generateRandomPledge = (forcePledge: boolean = false): number | undefined => {
  const shouldPledge = forcePledge || Math.random() > 0.6; // ~40% chance of pledge, or if forced
  return shouldPledge ? parseFloat((Math.random() * 95 + 5).toFixed(2)) : undefined;
};
const generatePollitPoints = () => Math.floor(Math.random() * 5000) + 100;


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
  { name: 'Cereal Consumer' }, { name: 'Drama Llama' }, { name: 'Rap Analyst' }, { name: 'Thirsty Hubby' },
  { name: 'Ghost Ponderer' }, { name: 'Hoodie Champion' }, { name: 'Tender Lover' }, { name: 'Insta Model' },
  { name: 'Message Ignorer' }, { name: 'Charger Keeper' }, { name: 'Party Planner' }, { name: 'Podcast Dreamer' },
  { name: 'Spotify Stalker' }, { name: 'Text Detective' }, { name: 'Grass Avoider' }, { name: 'Tattoo Thinker' },
  { name: 'Dog Pic Defender' }, { name: 'Job Quitter Pro' }, { name: 'Cheese Critic' }, { name: 'Feet Pic Financier' },
  { name: 'Toxic Trait Tom' }, { name: 'Delulu Deb' }, { name: 'Charger Hoarder' }, { name: 'Fridge Raider' },
  { name: 'Archive Diver' }, { name: 'Late Night Texter' }, { name: 'Chaos Agent' }, { name: 'Toothbrush Sharer' },
  { name: 'Story Blocker' }, { name: 'Fries Fighter' }, { name: 'Ex Mom Texter' }, { name: 'Red Flag Racer' },
  { name: 'Group Chat Guru' }, { name: 'KitKat Connoisseur' }, { name: 'Hoodie Hostage Holder' },
  { name: 'DM Slider' }, { name: 'Crisis Responder' }, { name: 'Breath Buddy' }, { name: 'Ugly Day Canceller' },
  { name: 'Poll Progenitor' }
];

export const mockUsers: User[] = usersData.map((user, index) => ({
  id: `user${index + 1}`,
  name: user.name,
  avatarUrl: `https://placehold.co/100x100.png?text=${user.name.substring(0,1).toUpperCase()}`,
  username: user.name.toLowerCase().replace(/\s+/g, '').substring(0, 10) + (index + 100),
  pollitPointsBalance: generatePollitPoints(),
}));

const parseTimeRemaining = (timeString: string): number => {
  let totalMilliseconds = 0;
  const daysMatch = timeString.match(/(\d+)\s*days?/);
  const hoursMatch = timeString.match(/(\d+)\s*hours?/);
  const minutesMatch = timeString.match(/(\d+)\s*minutes?/);

  if (daysMatch) totalMilliseconds += parseInt(daysMatch[1], 10) * 24 * 60 * 60 * 1000;
  if (hoursMatch) totalMilliseconds += parseInt(hoursMatch[1], 10) * 60 * 60 * 1000;
  if (minutesMatch) totalMilliseconds += parseInt(minutesMatch[1], 10) * 60 * 1000;

  return totalMilliseconds > 0 ? totalMilliseconds : 60000; // Default to 1 minute if parsing fails or results in 0
};

const getRandomUser = (): User => mockUsers[Math.floor(Math.random() * mockUsers.length)];
const findUser = (name: string): User => {
  const found = mockUsers.find(u => u.name.toLowerCase().startsWith(name.toLowerCase()));
  if (found) return found;
  console.warn(`User starting with "${name}" not found for poll, returning random user.`);
  return getRandomUser();
}

const generateCreatedAt = (deadlineString: string): string => {
  const deadlineMs = parseTimeRemaining(deadlineString);
  let createdAgoMs;

  if (deadlineMs <= 60 * 60 * 1000) { // Deadline is within an hour
    createdAgoMs = Math.random() * (deadlineMs * 0.5); // Created within the first half of the deadline duration
  } else if (deadlineMs <= 24 * 60 * 60 * 1000) { // Deadline is within a day
    createdAgoMs = Math.random() * (6 * 60 * 60 * 1000) + (15 * 60 * 1000); // Created 15 mins to 6 hours ago
  } else { // Deadline is more than a day
    createdAgoMs = Math.random() * (3 * 24 * 60 * 60 * 1000) + (1 * 24 * 60 * 60 * 1000); // Created 1 to 3 days ago
  }
  return new Date(Date.now() - createdAgoMs).toISOString();
};


const initialPolls: Omit<Poll, 'totalVotes' | 'isVoted' | 'votedOptionId' | 'commentsCount' | 'likes' | 'tipCount' | 'pledgeAmount' | 'pledgeOutcome'>[]  = [
  {
    id: 'poll_original_seasons_s1',
    creator: findUser('Alice Wonderland'),
    question: 'What is your favorite season?',
    imageUrls: ['https://placehold.co/600x400.png?text=SeasonsPoll'],
    options: [
      { id: 'opt_s1_a', text: 'Spring', votes: 120, imageUrl: 'https://placehold.co/300x200.png?text=SpringOpt', affiliateLink: 'https://example.com/spring-decor' },
      { id: 'opt_s1_b', text: 'Summer', votes: 250, imageUrl: 'https://placehold.co/300x200.png?text=SummerOpt', affiliateLink: 'https://example.com/summer-gear' },
      { id: 'opt_s1_c', text: 'Autumn', votes: 180, imageUrl: 'https://placehold.co/300x200.png?text=AutumnOpt', affiliateLink: 'https://example.com/autumn-fashion' },
      { id: 'opt_s1_d', text: 'Winter', votes: 90, imageUrl: 'https://placehold.co/300x200.png?text=WinterOpt', affiliateLink: 'https://example.com/winter-sports' },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 days")).toISOString(),
    createdAt: generateCreatedAt("7 days"),
  },
  {
    id: 'poll_ul1_cereal_box_art_cba1',
    creator: findUser('Cereal Consumer'),
    question: "Should I stop eating this brand of cereal now that they changed the box art and it feels weird?",
    imageUrls: ['https://placehold.co/600x400.png?text=CerealArtPoll'],
    options: [
        { id: 'opt_cba1_a', text: "Yes, follow your instincts", votes: generateRandomVotes() },
        { id: 'opt_cba1_b', text: "Chill, it's just a box", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 days")).toISOString(),
    createdAt: generateCreatedAt("3 days"),
  },
  {
    id: 'poll_original_language_l1',
    creator: findUser('Bob The Builder'),
    question: 'Best programming language for beginners in 2024?',
    imageUrls: ['https://placehold.co/600x400.png?text=CodePoll'],
    options: [
      { id: 'opt_l1_a', text: 'Python', votes: 300, affiliateLink: 'https://example.com/python-course' },
      { id: 'opt_l1_b', text: 'JavaScript', votes: 280, affiliateLink: 'https://example.com/js-bootcamp' },
      { id: 'opt_l1_c', text: 'Java', votes: 150 },
      { id: 'opt_l1_d', text: 'C#', votes: 100 },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 days")).toISOString(),
    createdAt: generateCreatedAt("3 days"),
  },
  {
    id: 'poll_ul1_sneaky_link_bestie_slb1',
    creator: findUser('Drama Llama'),
    question: "Should I make my bestie's man my sneaky link if he already DMed me twice?",
    imageUrls: ['https://placehold.co/600x400.png?text=SneakyLinkPoll'],
    options: [
        { id: 'opt_slb1_a', text: "Slide quietly", votes: generateRandomVotes() },
        { id: 'opt_slb1_b', text: "You need therapy", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 hour")).toISOString(),
    createdAt: generateCreatedAt("1 hour"),
  },
  {
    id: 'poll_original_travel_t1',
    creator: findUser('Charlie Chaplin'),
    question: 'Which travel destination for next summer?',
    imageUrls: ['https://placehold.co/600x400.png?text=TravelPoll'],
    videoUrl: 'placeholder-video-url', // This would be a real URL to a video file
    options: [
      { id: 'opt_t1_a', text: 'Paris, France', votes: 180, videoUrl: 'placeholder-option-video-url', affiliateLink: 'https://example.com/paris-tours' },
      { id: 'opt_t1_b', text: 'Tokyo, Japan', votes: 220, videoUrl: 'placeholder-option-video-url', affiliateLink: 'https://example.com/tokyo-hotels' },
      { id: 'opt_t1_c', text: 'Rome, Italy', votes: 160, videoUrl: 'placeholder-option-video-url' },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("30 days")).toISOString(),
    createdAt: generateCreatedAt("30 days"),
  },
  {
    id: 'poll_ul1_rapper_battle_rb1',
    creator: findUser('Rap Analyst'),
    question: "Trippie Redd vs Hurricane Wisdom — who’s the better rapper, PERIOD?",
    imageUrls: ['https://placehold.co/600x400.png?text=RapBattlePoll'],
    options: [
        { id: 'opt_rb1_a', text: "Trippie Redd", votes: generateRandomVotes() },
        { id: 'opt_rb1_b', text: "Hurricane Wisdom", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 minutes")).toISOString(),
    createdAt: generateCreatedAt("7 minutes"),
  },
  {
    id: 'poll_sophia_vcard_main_sv1',
    creator: findUser('Sophia Miller'),
    question: "Finna lose my V-card, besties. To wrap it or not to wrap it? Low-key kinda nervous but also wanna YOLO. What's the tea?",
    imageUrls: ['https://placehold.co/600x400.png?text=YOLOPoll'],
    options: [
      { id: 'opt_sv1_a', text: "Wrap it like it's your favorite mixtape ('cause STIs are NOT a vibe). Safety first, always! Think about long-term health and peace of mind. It's a sign of respect for yourself and your partner.", votes: generateRandomVotes(), affiliateLink: 'https://example.com/safe-sex-info' },
      { id: 'opt_sv1_b', text: "The stars whisper secrets of protection... and pleasure. Choose wisely. Sometimes the most mysterious path is the safest one, leading to even greater joys when approached with care and consideration.", votes: generateRandomVotes() },
      { id: 'opt_sv1_c', text: "Raw doggin' it? Only if you both got clean bills of health & discussed risks. Otherwise, glove up! This is a serious decision with potential lifelong consequences. Honesty and testing are key.", votes: generateRandomVotes() },
      { id: 'opt_sv1_d', text: "Let the spirits guide you... to the condom aisle. Then flip a coin for flavor. A little humor can ease the nerves, but ultimately, the choice for protection is a wise one. Make it fun, but make it safe.", votes: generateRandomVotes(), affiliateLink: 'https://example.com/condom-variety-pack' },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 hours, 38 minutes")).toISOString(),
    createdAt: generateCreatedAt("6 hours, 38 minutes"),
  },
  {
    id: 'poll_ul1_wife_beer_permission_wbp1',
    creator: findUser('Thirsty Hubby'),
    question: "My wife said no to another beer. Should I crack it anyway?",
    imageUrls: ['https://placehold.co/600x400.png?text=BeerQuestPoll'],
    options: [
        { id: 'opt_wbp1_a', text: "Yes, freedom is brewed", votes: generateRandomVotes() },
        { id: 'opt_wbp1_b', text: "Nah bro, she’s your ride", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 minute")).toISOString(),
    createdAt: generateCreatedAt("1 minute"),
  },
  {
    id: 'poll_generic_movie_night_gm1',
    creator: findUser('Alex Johnson'),
    question: 'Movie night! What genre should we watch?',
    imageUrls: ['https://placehold.co/600x400.png?text=MovieNightPoll'],
    options: [
      { id: 'opt_gm1_a', text: 'Comedy', votes: generateRandomVotes() },
      { id: 'opt_gm1_b', text: 'Horror', votes: generateRandomVotes() },
      { id: 'opt_gm1_c', text: 'Sci-Fi', votes: generateRandomVotes() },
      { id: 'opt_gm1_d', text: 'Documentary', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 hours")).toISOString(),
    createdAt: generateCreatedAt("2 hours"),
  },
  {
    id: 'poll_ul2_toxic_trait_closure_ghosted_ttcg1',
    creator: findUser('Toxic Trait Tom'),
    question: "My toxic trait is thinking I need closure from someone I ghosted. Should I message them?",
    imageUrls: ['https://placehold.co/600x400.png?text=ToxicClosurePoll'],
    options: [
        { id: 'opt_ttcg1_a', text: "Yes, give them whiplash", votes: generateRandomVotes() },
        { id: 'opt_ttcg1_b', text: "No, vanish like smoke", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 hours")).toISOString(),
    createdAt: generateCreatedAt("3 hours"),
  },
  {
    id: 'poll_generic_weekend_activity_gwa1',
    creator: findUser('Emma Davis'),
    question: 'Ideal weekend activity?',
    options: [
      { id: 'opt_gwa1_a', text: 'Hiking in nature', votes: generateRandomVotes() },
      { id: 'opt_gwa1_b', text: 'Binge-watching a series', votes: generateRandomVotes() },
      { id: 'opt_gwa1_c', text: 'Trying a new restaurant', votes: generateRandomVotes() },
      { id: 'opt_gwa1_d', text: 'Reading a book', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("5 days")).toISOString(),
    createdAt: generateCreatedAt("5 days"),
  },
  {
    id: 'poll_ul1_ghost_closure_text_gct1',
    creator: findUser('Ghost Ponderer'),
    question: "Should I text the person I ghosted for closure (for me, not them)?",
    options: [
        { id: 'opt_gct1_a', text: "Do it, you need answers", votes: generateRandomVotes() },
        { id: 'opt_gct1_b', text: "Leave them in peace, lol", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("10 hours")).toISOString(),
    createdAt: generateCreatedAt("10 hours"),
  },
  {
    id: 'poll_generic_coffee_tea_gct2',
    creator: findUser('Liam Garcia'),
    question: 'Coffee or Tea to start the day?',
    imageUrls: ['https://placehold.co/600x400.png?text=MorningBrewPoll'],
    options: [
      { id: 'opt_gct2_a', text: 'Coffee, definitely!', votes: generateRandomVotes() },
      { id: 'opt_gct2_b', text: 'Tea, for a calm start.', votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 day")).toISOString(),
    createdAt: generateCreatedAt("1 day"),
  },
  {
    id: 'poll_ul1_hoodie_retirement_hr1',
    creator: findUser('Hoodie Champion'),
    question: "My favorite hoodie is falling apart. Should I retire it or wear it till it's literal threads?",
    options: [
        { id: 'opt_hr1_a', text: "Retire with honors", votes: generateRandomVotes() },
        { id: 'opt_hr1_b', text: "Threads of glory!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days")).toISOString(),
    createdAt: generateCreatedAt("2 days"),
  },
   {
    id: 'poll_ul2_forgave_drunk_reminder_fdr1',
    creator: findUser('Delulu Deb'),
    question: "I forgave my ex when I was drunk. Does it count? Should I remind them I was drunk?",
    imageUrls: ['https://placehold.co/600x400.png?text=DrunkForgivenessPoll'],
    options: [
        { id: 'fdr1_opt_a', text: "Yes, full disclosure", votes: generateRandomVotes() },
        { id: 'fdr1_opt_b', text: "No, let it ride lol", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("24 hours")).toISOString(),
    createdAt: generateCreatedAt("24 hours"),
  },
  {
    id: 'poll_ul2_charger_9_months_c9m1',
    creator: findUser('Charger Hoarder'),
    question: "My friend 'borrowed' my charger 9 months ago. Is it mine or theirs now?",
    options: [
        { id: 'c9m1_opt_a', text: "Still yours, demand it!", votes: generateRandomVotes() },
        { id: 'c9m1_opt_b', text: "It's adopted, let it go", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 hours")).toISOString(),
    createdAt: generateCreatedAt("6 hours"),
  },
  {
    id: 'poll_ul2_cold_spaghetti_standards_css1',
    creator: findUser('Fridge Raider'),
    question: "Eating cold spaghetti from the fridge at 3 AM. Have I hit rock bottom or peak living?",
    imageUrls: ['https://placehold.co/600x400.png?text=ColdSpaghettiPoll'],
    options: [
        { id: 'css1_opt_a', text: "Rock bottom, seek help", votes: generateRandomVotes() },
        { id: 'css1_opt_b', text: "Peak living, iconic", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("15 minutes")).toISOString(),
    createdAt: generateCreatedAt("15 minutes"),
  },
  {
    id: 'poll_ul2_rewatch_texts_wounds_rtw1',
    creator: findUser('Archive Diver'),
    question: "Re-reading old texts from my ex and crying. Should I delete the archive or keep picking the scab?",
    options: [
        { id: 'rtw1_opt_a', text: "Delete and heal, queen", votes: generateRandomVotes() },
        { id: 'rtw1_opt_b', text: "Nah, feel your feels", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 day")).toISOString(),
    createdAt: generateCreatedAt("1 day"),
  },
  {
    id: 'poll_ul1_chicken_tenders_date_ctd1',
    creator: findUser('Tender Lover'),
    question: "Is it acceptable to order chicken tenders on a first date at a fancy restaurant?",
    imageUrls: ['https://placehold.co/600x400.png?text=TenderDatePoll'],
    options: [
        { id: 'opt_ctd1_a', text: "Yes, be yourself", votes: generateRandomVotes() },
        { id: 'opt_ctd1_b', text: "Maybe not the best first impression", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("8 hours")).toISOString(),
    createdAt: generateCreatedAt("8 hours"),
  },
  {
    id: 'poll_ul2_you_up_reply_yur1',
    creator: findUser('Late Night Texter'),
    question: "Got a 'you up?' text at 2 AM. How should I reply for maximum chaos/comedy?",
    imageUrls: ['https://placehold.co/600x400.png?text=LateNightReplyPoll'],
    options: [
        { id: 'yur1_opt_a', text: "'New phone, who dis?'", votes: generateRandomVotes() },
        { id: 'yur1_opt_b', text: "'Yes, and I was just thinking of you... not.'", votes: generateRandomVotes() },
        { id: 'yur1_opt_c', text: "Send a Wikipedia link to 'Sleep'", votes: generateRandomVotes() },
        { id: 'yur1_opt_d', text: "Ignore and post a cryptic story", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("5 minutes")).toISOString(),
    createdAt: generateCreatedAt("5 minutes"),
  },
  {
    id: 'poll_ul2_situationship_risk_sr1',
    creator: findUser('Chaos Agent'),
    question: "My situationship is getting too comfy. Should I risk it all by asking 'What are we?'",
    imageUrls: ['https://placehold.co/600x400.png?text=SituationshipPoll'],
    options: [
        { id: 'sr1_opt_a', text: "Yes, clarity is key (or chaos)", votes: generateRandomVotes() },
        { id: 'sr1_opt_b', text: "No, enjoy the ambiguity, coward", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("12 hours")).toISOString(),
    createdAt: generateCreatedAt("12 hours"),
  },
   {
    id: 'poll_ul1_thirst_trap_respect_ttr1',
    creator: findUser('Insta Model'),
    question: "If I post a thirst trap, can I still demand respect?",
    options: [
        { id: 'opt_ttr1_a', text: "Yes, respect is unconditional", votes: generateRandomVotes() },
        { id: 'opt_ttr1_b', text: "It's complicated...", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("4 hours")).toISOString(),
    createdAt: generateCreatedAt("4 hours"),
  },
  {
    id: 'poll_ul2_toothbrush_confront_tc1',
    creator: findUser('Toothbrush Sharer'),
    question: "I think my roommate is using my toothbrush. How do I confront them without making it weird?",
    options: [
        { id: 'tc1_opt_a', text: "Hide it and see what happens", votes: generateRandomVotes() },
        { id: 'tc1_opt_b', text: "Leave a passive-aggressive note", votes: generateRandomVotes() },
        { id: 'tc1_opt_c', text: "Buy them a new one and say 'Thought you'd like this!'", votes: generateRandomVotes() },
        { id: 'tc1_opt_d', text: "Just ask them directly but nicely", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days")).toISOString(),
    createdAt: generateCreatedAt("2 days"),
  },
  {
    id: 'poll_ul1_ignore_message_normal_imn1',
    creator: findUser('Message Ignorer'),
    question: "Is it normal to ignore someone's message for 3 days then reply like nothing happened?",
    options: [
        { id: 'opt_imn1_a', text: "Totally normal behavior", votes: generateRandomVotes() },
        { id: 'opt_imn1_b', text: "That's kinda rude, ngl", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("5 hours")).toISOString(),
    createdAt: generateCreatedAt("5 hours"),
  },
  {
    id: 'poll_ul2_bestie_ex_stories_bes1',
    creator: findUser('Story Blocker'),
    question: "My bestie keeps posting stories with their new partner (my ex's ex). Mute or unfriend?",
    options: [
        { id: 'bes1_opt_a', text: "Mute for your sanity", votes: generateRandomVotes() },
        { id: 'bes1_opt_b', text: "Unfriend, cut the cord", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("30 minutes")).toISOString(),
    createdAt: generateCreatedAt("30 minutes"),
  },
  {
    id: 'poll_ul1_charger_return_keep_crk1',
    creator: findUser('Charger Keeper'),
    question: "My friend left their charger at my place. Should I return it or is it fair game now?",
    imageUrls: ['https://placehold.co/600x400.png?text=ChargerDilemmaPoll'],
    options: [
        { id: 'opt_crk1_a', text: "Return it, good karma", votes: generateRandomVotes() },
        { id: 'opt_crk1_b', text: "Finders keepers, new charger!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 day")).toISOString(),
    createdAt: generateCreatedAt("1 day"),
  },
  {
    id: 'poll_ul2_venmo_fries_request_vfr1',
    creator: findUser('Fries Fighter'),
    question: "My friend ate 3 of my fries. Can I Venmo request them $0.75?",
    options: [
        { id: 'vfr1_opt_a', text: "Yes, principle matters", votes: generateRandomVotes() },
        { id: 'vfr1_opt_b', text: "No, that's petty AF", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 hour")).toISOString(),
    createdAt: generateCreatedAt("1 hour"),
  },
  {
    id: 'poll_ul1_party_snacks_selfies_pss1',
    creator: findUser('Party Planner'),
    question: "Hosting a party. Focus on good snacks or good selfie lighting?",
    options: [
        { id: 'opt_pss1_a', text: "Snacks are supreme", votes: generateRandomVotes() },
        { id: 'opt_pss1_b', text: "Lighting for the 'gram!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("4 days")).toISOString(),
    createdAt: generateCreatedAt("4 days"),
  },
  {
    id: 'poll_ul2_text_ex_mom_tem1',
    creator: findUser('Ex Mom Texter'),
    question: "Is it weird to still text my ex's mom happy birthday?",
    imageUrls: ['https://placehold.co/600x400.png?text=ExMomTextPoll'],
    options: [
        { id: 'tem1_opt_a', text: "Sweet, if you were close", votes: generateRandomVotes() },
        { id: 'tem1_opt_b', text: "Kinda weird, move on", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 days")).toISOString(),
    createdAt: generateCreatedAt("6 days"),
  },
  {
    id: 'poll_ul1_podcast_trauma_dump_ptd1',
    creator: findUser('Podcast Dreamer'),
    question: "Should I start a podcast to trauma dump or get a therapist?",
    imageUrls: ['https://placehold.co/600x400.png?text=PodcastTherapyPoll'],
    options: [
        { id: 'opt_ptd1_a', text: "Podcast, share your story!", votes: generateRandomVotes() },
        { id: 'opt_ptd1_b', text: "Therapist, professional help first", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("9 hours")).toISOString(),
    createdAt: generateCreatedAt("9 hours"),
  },
  {
    id: 'poll_ul2_not_like_other_people_nlp1',
    creator: findUser('Red Flag Racer'),
    question: "My date said 'I'm not like other people.' Red flag or intriguing?",
    options: [
        { id: 'nlp1_opt_a', text: "Massive red flag, abort!", votes: generateRandomVotes() },
        { id: 'nlp1_opt_b', text: "Intriguing, tell me more...", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 hours")).toISOString(),
    createdAt: generateCreatedAt("2 hours"),
  },
  {
    id: 'poll_ul1_spotify_stalk_confess_ssc1',
    creator: findUser('Spotify Stalker'),
    question: "I stalk my crush's Spotify. Should I confess or keep my intel secret?",
    options: [
        { id: 'opt_ssc1_a', text: "Confess, it's kinda cute", votes: generateRandomVotes() },
        { id: 'opt_ssc1_b', text: "Secret intel for the win", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("12 hours")).toISOString(),
    createdAt: generateCreatedAt("12 hours"),
  },
  {
    id: 'poll_ul2_podcast_group_chat_dump_pgcd1',
    creator: findUser('Group Chat Guru'),
    question: "Turning our unhinged group chat into a podcast. Good idea or recipe for disaster?",
    imageUrls: ['https://placehold.co/600x400.png?text=GroupChatPodcastPoll'],
    options: [
        { id: 'pgcd1_opt_a', text: "Genius! I'd listen.", votes: generateRandomVotes() },
        { id: 'pgcd1_opt_b', text: "Friendships will end.", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 days")).toISOString(),
    createdAt: generateCreatedAt("3 days"),
  },
  {
    id: 'poll_ul1_lol_ok_meaning_lom1',
    creator: findUser('Text Detective'),
    question: "What does 'lol ok' REALLY mean in a text?",
    imageUrls: ['https://placehold.co/600x400.png?text=TextMeaningPoll'],
    options: [
        { id: 'opt_lom1_a', text: "They're mildly amused", votes: generateRandomVotes() },
        { id: 'opt_lom1_b', text: "They're politely ending it", votes: generateRandomVotes() },
        { id: 'opt_lom1_c', text: "They hate you secretly", votes: generateRandomVotes() },
        { id: 'opt_lom1_d', text: "It means nothing, chill", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("25 minutes")).toISOString(),
    createdAt: generateCreatedAt("25 minutes"),
  },
  {
    id: 'poll_ul2_kitkat_eating_method_kem1',
    creator: findUser('KitKat Connoisseur'),
    question: "How do you eat a KitKat? Break off fingers or bite into the whole thing like a psycho?",
    imageUrls: ['https://placehold.co/600x400.png?text=KitKatPoll'],
    options: [
        { id: 'kem1_opt_a', text: "Break fingers, civilized", votes: generateRandomVotes() },
        { id: 'kem1_opt_b', text: "Whole thing, chaos mode", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("10 minutes")).toISOString(),
    createdAt: generateCreatedAt("10 minutes"),
  },
  {
    id: 'poll_ul1_hiking_touch_grass_htg1',
    creator: findUser('Grass Avoider'),
    question: "My friends want to go hiking. Is 'touching grass' overrated?",
    options: [
        { id: 'opt_htg1_a', text: "Yes, indoors forever", votes: generateRandomVotes() },
        { id: 'opt_htg1_b', text: "No, fresh air is good!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 days")).toISOString(),
    createdAt: generateCreatedAt("7 days"),
  },
  {
    id: 'poll_ul2_hoodie_hostage_return_hhr1',
    creator: findUser('Hoodie Hostage Holder'),
    question: "I have 3 of my ex's hoodies. Do I return them or are they mine now by emotional distress compensation?",
    options: [
        { id: 'hhr1_opt_a', text: "Return them, be the bigger person", votes: generateRandomVotes() },
        { id: 'hhr1_opt_b', text: "Keep 'em, trophies of war", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("4 days")).toISOString(),
    createdAt: generateCreatedAt("4 days"),
  },
  {
    id: 'poll_ul1_tattoo_idea_list_new_person_tilnp1',
    creator: findUser('Tattoo Thinker'),
    question: "I have a list of tattoo ideas I made with my ex. Can I still get them or is that weird with a new person?",
    options: [
        { id: 'opt_tilnp1_a', text: "Get them, your body your art!", votes: generateRandomVotes() },
        { id: 'opt_tilnp1_b', text: "Too weird, new list time", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("10 days")).toISOString(),
    createdAt: generateCreatedAt("10 days"),
  },
  {
    id: 'poll_ul2_dm_after_likes_dal1',
    creator: findUser('DM Slider'),
    question: "How many of my posts should someone like before I can slide into their DMs?",
    options: [
        { id: 'dal1_opt_a', text: "1 like is an invitation", votes: generateRandomVotes() },
        { id: 'dal1_opt_b', text: "3-5, show genuine interest", votes: generateRandomVotes() },
        { id: 'dal1_opt_c', text: "10+, make it obvious", votes: generateRandomVotes() },
        { id: 'dal1_opt_d', text: "Likes don't matter, shoot your shot", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days")).toISOString(),
    createdAt: generateCreatedAt("2 days"),
  },
  {
    id: 'poll_ul1_ex_dog_pic_like_edpl1',
    creator: findUser('Dog Pic Defender'),
    question: "My ex liked a picture of my dog. Are they trying to get back with me or just like dogs?",
    imageUrls: ['https://placehold.co/600x400.png?text=DogPicLikePoll'],
    options: [
        { id: 'opt_edpl1_a', text: "They want you back!", votes: generateRandomVotes() },
        { id: 'opt_edpl1_b', text: "They just like dogs, chill", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("20 hours")).toISOString(),
    createdAt: generateCreatedAt("20 hours"),
  },
  {
    id: 'poll_ul2_wyd_mid_crisis_reply_wmcr1',
    creator: findUser('Crisis Responder'),
    question: "Someone texted 'wyd' while I'm having an existential crisis. Best reply?",
    options: [
        { id: 'wmcr1_opt_a', text: "'Contemplating the void, u?'", votes: generateRandomVotes() },
        { id: 'wmcr1_opt_b', text: "'Nm, hbu?' (lie)", votes: generateRandomVotes() },
        { id: 'wmcr1_opt_c', text: "Full trauma dump", votes: generateRandomVotes() },
        { id: 'wmcr1_opt_d', text: "Send a picture of a possum", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("50 minutes")).toISOString(),
    createdAt: generateCreatedAt("50 minutes"),
  },
  {
    id: 'poll_ul1_quit_job_spiritually_dead_qjsd1',
    creator: findUser('Job Quitter Pro'),
    question: "My job makes me spiritually dead. Should I quit with no backup plan?",
    imageUrls: ['https://placehold.co/600x400.png?text=QuitJobPoll'],
    options: [
        { id: 'opt_qjsd1_a', text: "Yes, YOLO, follow your spirit", votes: generateRandomVotes() },
        { id: 'opt_qjsd1_b', text: "No, secure a new job first, adulting!", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("14 days")).toISOString(),
    createdAt: generateCreatedAt("14 days"),
  },
  {
    id: 'poll_ul2_friend_bad_breath_fbb1',
    creator: findUser('Breath Buddy'),
    question: "My friend has bad breath. How do I tell them without ruining the friendship?",
    options: [
        { id: 'fbb1_opt_a', text: "Offer gum/mints constantly", votes: generateRandomVotes() },
        { id: 'fbb1_opt_b', text: "Tell them directly but privately", votes: generateRandomVotes() },
        { id: 'fbb1_opt_c', text: "Anonymous note (risky!)", votes: generateRandomVotes() },
        { id: 'fbb1_opt_d', text: "Suffer in silence", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("18 hours")).toISOString(),
    createdAt: generateCreatedAt("18 hours"),
  },
  {
    id: 'poll_ul1_playlist_string_cheese_psc1',
    creator: findUser('Cheese Critic'),
    question: "Is it weirder to make a playlist for your cat or to eat string cheese by biting into it?",
    options: [
        { id: 'opt_psc1_a', text: "Cat playlist is weirder", votes: generateRandomVotes() },
        { id: 'opt_psc1_b', text: "String cheese bite is weirder", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 hours")).toISOString(),
    createdAt: generateCreatedAt("3 hours"),
  },
  {
    id: 'poll_ul2_cancel_plans_ugly_day_cpud1',
    creator: findUser('Ugly Day Canceller'),
    question: "Woke up feeling ugly. Is that a valid reason to cancel plans?",
    options: [
        { id: 'cpud1_opt_a', text: "Absolutely, self-care!", votes: generateRandomVotes() },
        { id: 'cpud1_opt_b', text: "No, push through it", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("45 minutes")).toISOString(),
    createdAt: generateCreatedAt("45 minutes"),
  },
  {
    id: 'poll_ul1_feet_pics_gas_money_fpgm1',
    creator: findUser('Feet Pic Financier'),
    question: "My friend suggested selling feet pics for gas money. Good idea or nah?",
    options: [
        { id: 'opt_fpgm1_a', text: "Secure the bag, sis/bro!", votes: generateRandomVotes() },
        { id: 'opt_fpgm1_b', text: "Maybe explore other options...", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 hours")).toISOString(),
    createdAt: generateCreatedAt("6 hours"),
  },
  {
    id: 'poll_ul2_create_own_poll_unhinged_copu1',
    creator: findUser('Poll Progenitor'),
    question: "Should I create my own poll because I’m tired of pretending I don’t have unhinged opinions too?",
    imageUrls: ['https://placehold.co/600x400.png?text=MyUnhingedPoll'],
    options: [
        { id: 'opt_copu1_a', text: "Do it now", votes: generateRandomVotes() },
        { id: 'opt_copu1_b', text: "This is your sign", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days")).toISOString(),
    createdAt: generateCreatedAt("2 days"),
  },
];


const allPollsFull: Poll[] = initialPolls.map((pollSkeleton, index) => {
  const totalVotes = pollSkeleton.options.reduce((sum, option) => sum + option.votes, 0);
  // Make roughly 1/3 of polls already voted by the mock current user for variety
  const shouldBeVoted = (index % 3 === 0);
  let determinedVotedOptionId: string | undefined = undefined;
  if (shouldBeVoted && pollSkeleton.options.length > 0) {
    // Vote for the first option for simplicity in mock data
    determinedVotedOptionId = pollSkeleton.options[0].id;
  }

  // Add pledge to roughly every 4th poll, and ensure specific listed polls get their pledges
  let pledgeAmount = generateRandomPledge(index % 4 === 0);
  let pledgeOutcome: 'accepted' | 'tipped_crowd' | 'pending' | undefined = undefined;

  let tipCountGenerated = generateRandomTips();
  const likes = (index * 17 % 250) + 10; // Dynamic likes
  const commentsCount = (index * 7 % 35) + 2; // Dynamic comments

  // Specific pledges and tip counts from user's list
  const specificPledges: Record<string, {pledge: number, tips: number}> = {
    'poll_ul1_cereal_box_art_cba1': { pledge: 7, tips: 2 },
    'poll_ul1_sneaky_link_bestie_slb1': { pledge: 50, tips: 8 },
    'poll_ul1_rapper_battle_rb1': { pledge: 3, tips: 1 },
    'poll_ul1_wife_beer_permission_wbp1': { pledge: 100, tips: 12 },
    'poll_ul1_ghost_closure_text_gct1': { pledge: 15, tips: 5 },
    'poll_ul1_hoodie_retirement_hr1': { pledge: 4, tips: 0 },
    'poll_ul1_chicken_tenders_date_ctd1': { pledge: 22, tips: 3 },
    'poll_ul1_thirst_trap_respect_ttr1': { pledge: 13, tips: 1 },
    'poll_ul1_ignore_message_normal_imn1': { pledge: 6, tips: 0 },
    'poll_ul1_charger_return_keep_crk1': { pledge: 5, tips: 6 },
    'poll_ul1_party_snacks_selfies_pss1': { pledge: 20, tips: 3 },
    'poll_ul1_podcast_trauma_dump_ptd1': { pledge: 27, tips: 2 },
    'poll_ul1_spotify_stalk_confess_ssc1': { pledge: 2, tips: 1 },
    'poll_ul1_lol_ok_meaning_lom1': { pledge: 8, tips: 9 },
    'poll_ul1_hiking_touch_grass_htg1': { pledge: 11, tips: 4 },
    'poll_ul1_tattoo_idea_list_new_person_tilnp1': { pledge: 30, tips: 7 },
    'poll_ul1_ex_dog_pic_like_edpl1': { pledge: 9, tips: 0 },
    'poll_ul1_quit_job_spiritually_dead_qjsd1': { pledge: 75, tips: 15 },
    'poll_ul1_playlist_string_cheese_psc1': { pledge: 10, tips: 2 },
    'poll_ul1_feet_pics_gas_money_fpgm1': { pledge: 40, tips: 6 },
    'poll_ul2_toxic_trait_closure_ghosted_ttcg1': { pledge: 15, tips: 4 },
    'poll_ul2_forgave_drunk_reminder_fdr1': { pledge: 22, tips: 6 },
    'poll_ul2_charger_9_months_c9m1': { pledge: 8, tips: 1 },
    'poll_ul2_cold_spaghetti_standards_css1': { pledge: 5, tips: 0 },
    'poll_ul2_rewatch_texts_wounds_rtw1': { pledge: 13, tips: 2 },
    'poll_ul2_you_up_reply_yur1': { pledge: 40, tips: 3 },
    'poll_ul2_situationship_risk_sr1': { pledge: 50, tips: 7 },
    'poll_ul2_toothbrush_confront_tc1': { pledge: 100, tips: 12 },
    'poll_ul2_bestie_ex_stories_bes1': { pledge: 33, tips: 9 },
    'poll_ul2_venmo_fries_request_vfr1': { pledge: 4.37, tips: 0 },
    'poll_ul2_text_ex_mom_tem1': { pledge: 18, tips: 5 },
    'poll_ul2_not_like_other_people_nlp1': { pledge: 11, tips: 1 },
    'poll_ul2_podcast_group_chat_dump_pgcd1': { pledge: 27, tips: 4 },
    'poll_ul2_kitkat_eating_method_kem1': { pledge: 6, tips: 2 },
    'poll_ul2_hoodie_hostage_return_hhr1': { pledge: 15, tips: 3 },
    'poll_ul2_dm_after_likes_dal1': { pledge: 10, tips: 1 },
    'poll_ul2_wyd_mid_crisis_reply_wmcr1': { pledge: 20, tips: 2 },
    'poll_ul2_friend_bad_breath_fbb1': { pledge: 8, tips: 6 },
    'poll_ul2_cancel_plans_ugly_day_cpud1': { pledge: 14, tips: 3 },
    'poll_ul2_create_own_poll_unhinged_copu1': { pledge: 0, tips: 0 }, // User specified no pledge for this one
  };

  if (specificPledges[pollSkeleton.id]) {
    pledgeAmount = specificPledges[pollSkeleton.id].pledge;
    tipCountGenerated = specificPledges[pollSkeleton.id].tips;
  }

  if (pledgeAmount && pledgeAmount > 0) {
      pledgeOutcome = 'pending';
  } else {
    pledgeAmount = undefined; // Ensure it's undefined if 0 or not set
    pledgeOutcome = undefined;
  }


  return {
    ...pollSkeleton,
    totalVotes,
    isVoted: shouldBeVoted,
    votedOptionId: determinedVotedOptionId,
    likes,
    commentsCount,
    pledgeAmount,
    pledgeOutcome,
    tipCount: tipCountGenerated,
  };
});


export const mockPolls: Poll[] = allPollsFull;


export const fetchMorePolls = async (offset: number, limit: number): Promise<Poll[]> => {
  console.log(`Fetching more polls: offset ${offset}, limit ${limit}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const newPollsToServe = mockPolls.slice(offset, offset + limit);
  return newPollsToServe;
};

