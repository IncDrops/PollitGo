
import type { Poll, User } from '@/types';

const generateRandomVotes = () => Math.floor(Math.random() * 300) + 10;
const generateRandomTips = () => Math.floor(Math.random() * 50);
const generateRandomPledge = (forcePledge: boolean = false): number | undefined => {
  const shouldPledge = forcePledge || Math.random() > 0.7; // 30% chance of pledge, or if forced
  return shouldPledge ? Math.floor(Math.random() * 95) + 5 : undefined;
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
  avatarUrl: `https://placehold.co/100x100.png?text=${user.name.substring(0,1)}`,
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

  return totalMilliseconds > 0 ? totalMilliseconds : 60000;
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

  if (deadlineMs <= 60 * 60 * 1000) {
    createdAgoMs = Math.random() * (deadlineMs * 0.5);
  } else if (deadlineMs <= 24 * 60 * 60 * 1000) {
    createdAgoMs = Math.random() * (6 * 60 * 60 * 1000) + (15 * 60 * 1000);
  } else {
    createdAgoMs = Math.random() * (3 * 24 * 60 * 60 * 1000) + (1 * 24 * 60 * 60 * 1000);
  }
  return new Date(Date.now() - createdAgoMs).toISOString();
};


const initialPolls: Omit<Poll, 'totalVotes' | 'isVoted' | 'votedOptionId' | 'commentsCount' | 'likes' | 'tipCount' | 'pledgeAmount' | 'pledgeOutcome'>[]  = [
  {
    id: 'poll1_original_seasons',
    creator: findUser('Alice Wonderland'),
    question: 'What is your favorite season?',
    imageUrls: ['https://placehold.co/600x400.png?text=SeasonsPoll'],
    options: [
      { id: 'opt1a_s', text: 'Spring', votes: 120, imageUrl: 'https://placehold.co/300x200.png?text=SpringOption', affiliateLink: 'https://example.com/spring-decor' },
      { id: 'opt1b_s', text: 'Summer', votes: 250, imageUrl: 'https://placehold.co/300x200.png?text=SummerOption', affiliateLink: 'https://example.com/summer-gear' },
      { id: 'opt1c_s', text: 'Autumn', votes: 180, imageUrl: 'https://placehold.co/300x200.png?text=AutumnOption', affiliateLink: 'https://example.com/autumn-fashion' },
      { id: 'opt1d_s', text: 'Winter', votes: 90, imageUrl: 'https://placehold.co/300x200.png?text=WinterOption', affiliateLink: 'https://example.com/winter-sports' },
    ],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'poll2_original_language',
    creator: findUser('Bob The Builder'),
    question: 'Best programming language for beginners in 2024?',
    imageUrls: ['https://placehold.co/600x400.png?text=CodePoll'],
    options: [
      { id: 'opt2a_l', text: 'Python', votes: 300, affiliateLink: 'https://example.com/python-course' },
      { id: 'opt2b_l', text: 'JavaScript', votes: 280, affiliateLink: 'https://example.com/js-bootcamp' },
      { id: 'opt2c_l', text: 'Java', votes: 150 },
      { id: 'opt2d_l', text: 'C#', votes: 100 },
    ],
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'poll3_original_travel',
    creator: findUser('Charlie Chaplin'),
    question: 'Which travel destination for next summer?',
    imageUrls: ['https://placehold.co/600x400.png?text=TravelPoll'],
    videoUrl: 'placeholder-video-url',
    options: [
      { id: 'opt3a_t', text: 'Paris, France', votes: 180, videoUrl: 'placeholder-option-video-url', affiliateLink: 'https://example.com/paris-tours' },
      { id: 'opt3b_t', text: 'Tokyo, Japan', votes: 220, videoUrl: 'placeholder-option-video-url', affiliateLink: 'https://example.com/tokyo-hotels' },
      { id: 'opt3c_t', text: 'Rome, Italy', votes: 160, videoUrl: 'placeholder-option-video-url' },
    ],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'poll_sophia_vcard_main_sv',
    creator: findUser('Sophia Miller'),
    question: "Finna lose my V-card, besties. To wrap it or not to wrap it? Low-key kinda nervous but also wanna YOLO. What's the tea?",
    imageUrls: ['https://placehold.co/600x400.png?text=YOLOPoll'],
    options: [
      { id: 'sv_opt1_main_sv1', text: "Wrap it like it's your favorite mixtape ('cause STIs are NOT a vibe). Safety first, always! Think about long-term health and peace of mind. It's a sign of respect for yourself and your partner.", votes: generateRandomVotes(), affiliateLink: 'https://example.com/safe-sex-info' },
      { id: 'sv_opt2_main_sv2', text: "The stars whisper secrets of protection... and pleasure. Choose wisely. Sometimes the most mysterious path is the safest one, leading to even greater joys when approached with care and consideration.", votes: generateRandomVotes() },
      { id: 'sv_opt3_main_sv3', text: "Raw doggin' it? Only if you both got clean bills of health & discussed risks. Otherwise, glove up! This is a serious decision with potential lifelong consequences. Honesty and testing are key.", votes: generateRandomVotes() },
      { id: 'sv_opt4_main_sv4', text: "Let the spirits guide you... to the condom aisle. Then flip a coin for flavor. A little humor can ease the nerves, but ultimately, the choice for protection is a wise one. Make it fun, but make it safe.", votes: generateRandomVotes(), affiliateLink: 'https://example.com/condom-variety-pack' },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("6 hours, 38 minutes")).toISOString(),
    createdAt: generateCreatedAt("6 hours, 38 minutes"),
  },
  // ... (Keep other existing 4-option polls, ensuring their IDs are unique)
  // Adding the 2-option polls from the user's list
  {
    id: 'poll_userlist1_cereal_box_art_ul1',
    creator: findUser('Cereal Consumer'),
    question: "Should I stop eating this brand of cereal now that they changed the box art and it feels weird?",
    imageUrls: ['https://placehold.co/600x400.png?text=CerealArtPoll'],
    options: [
        { id: 'cba_opt1_ul1_a', text: "Yes, follow your instincts", votes: generateRandomVotes() },
        { id: 'cba_opt2_ul1_b', text: "Chill, it's just a box", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 days")).toISOString(),
    createdAt: generateCreatedAt("3 days"),
  },
  {
    id: 'poll_userlist1_sneaky_link_bestie_ul1',
    creator: findUser('Drama Llama'),
    question: "Should I make my bestie's man my sneaky link if he already DMed me twice?",
    imageUrls: ['https://placehold.co/600x400.png?text=SneakyLinkPoll'],
    options: [
        { id: 'slb_opt1_ul1_a', text: "Slide quietly", votes: generateRandomVotes() },
        { id: 'slb_opt2_ul1_b', text: "You need therapy", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 hour")).toISOString(),
    createdAt: generateCreatedAt("1 hour"),
  },
  {
    id: 'poll_userlist1_rapper_battle_ul1',
    creator: findUser('Rap Analyst'),
    question: "Trippie Redd vs Hurricane Wisdom — who’s the better rapper, PERIOD?",
    imageUrls: ['https://placehold.co/600x400.png?text=RapBattlePoll'],
    options: [
        { id: 'rb_opt1_ul1_a', text: "Trippie Redd", votes: generateRandomVotes() },
        { id: 'rb_opt2_ul1_b', text: "Hurricane Wisdom", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("7 minutes")).toISOString(),
    createdAt: generateCreatedAt("7 minutes"),
  },
  {
    id: 'poll_userlist1_wife_beer_permission_ul1',
    creator: findUser('Thirsty Hubby'),
    question: "My wife said no to another beer. Should I crack it anyway?",
    imageUrls: ['https://placehold.co/600x400.png?text=BeerPermissionPoll'],
    options: [
        { id: 'wbp_opt1_ul1_a', text: "Yes, freedom is brewed", votes: generateRandomVotes() },
        { id: 'wbp_opt2_ul1_b', text: "Nah bro, she’s your ride", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("1 minute")).toISOString(),
    createdAt: generateCreatedAt("1 minute"),
  },
  // ... Continue for all polls from user's lists, ensuring unique IDs for polls and options
  // Example for one from the second list:
  {
    id: 'poll_userlist2_toxic_trait_closure_ghosted_ul2',
    creator: findUser('Toxic Trait Tom'),
    question: "My toxic trait is thinking I need closure from someone I ghosted. Should I message them?",
    imageUrls: ['https://placehold.co/600x400.png?text=ToxicClosurePoll'],
    options: [
        { id: 'ttcg_opt1_ul2_a', text: "Yes, give them whiplash", votes: generateRandomVotes() },
        { id: 'ttcg_opt2_ul2_b', text: "No, vanish like smoke", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("3 hours")).toISOString(),
    createdAt: generateCreatedAt("3 hours"),
  },
  // ... (all other polls from both lists, ensuring unique IDs and correct structure)
  {
    id: 'poll_userlist2_create_own_poll_unhinged_ul2',
    creator: findUser('Poll Progenitor'),
    question: "Should I create my own poll because I’m tired of pretending I don’t have unhinged opinions too?",
    imageUrls: ['https://placehold.co/600x400.png?text=UnhingedPollCreator'],
    options: [
        { id: 'copu_opt1_ul2_a', text: "Do it now", votes: generateRandomVotes() },
        { id: 'copu_opt2_ul2_b', text: "This is your sign", votes: generateRandomVotes() },
    ],
    deadline: new Date(Date.now() + parseTimeRemaining("2 days")).toISOString(),
    createdAt: generateCreatedAt("2 days"),
  },
];


const allPollsFull: Poll[] = initialPolls.map((pollSkeleton, index) => {
  const totalVotes = pollSkeleton.options.reduce((sum, option) => sum + option.votes, 0);
  const shouldBeVoted = (index % 3 === 0);
  let determinedVotedOptionId: string | undefined = undefined;
  if (shouldBeVoted && pollSkeleton.options.length > 0) {
    determinedVotedOptionId = pollSkeleton.options[0].id;
  }

  let pledgeAmount = generateRandomPledge(index % 5 === 0); // Add pledge to every 5th poll for variety
  let pledgeOutcome: 'accepted' | 'tipped_crowd' | 'pending' | undefined = undefined;
  if (pledgeAmount && pledgeAmount > 0) {
      pledgeOutcome = 'pending';
  }

  let tipCountGenerated = generateRandomTips();
  const likes = (index * 17 % 250) + 10;
  const commentsCount = (index * 7 % 35) + 2;

  // Override pledge/tip for specific polls from user list
  if (pollSkeleton.id === 'poll_userlist1_cereal_box_art_ul1') { pledgeAmount = 7; tipCountGenerated = 2; }
  else if (pollSkeleton.id === 'poll_userlist1_sneaky_link_bestie_ul1') { pledgeAmount = 50; tipCountGenerated = 8; }
  else if (pollSkeleton.id === 'poll_userlist1_rapper_battle_ul1') { pledgeAmount = 3; tipCountGenerated = 1; }
  else if (pollSkeleton.id === 'poll_userlist1_wife_beer_permission_ul1') { pledgeAmount = 100; tipCountGenerated = 12; }
  else if (pollSkeleton.id === 'poll_userlist1_ghost_closure_text_ul1') { pledgeAmount = 15; tipCountGenerated = 5; }
  else if (pollSkeleton.id === 'poll_userlist1_hoodie_retirement_ul1') { pledgeAmount = 4; tipCountGenerated = 0; }
  else if (pollSkeleton.id === 'poll_userlist1_chicken_tenders_date_ul1') { pledgeAmount = 22; tipCountGenerated = 3; }
  else if (pollSkeleton.id === 'poll_userlist1_thirst_trap_respect_ul1') { pledgeAmount = 13; tipCountGenerated = 1; }
  else if (pollSkeleton.id === 'poll_userlist1_ignore_message_normal_ul1') { pledgeAmount = 6; tipCountGenerated = 0; }
  else if (pollSkeleton.id === 'poll_userlist1_charger_return_keep_ul1') { pledgeAmount = 5; tipCountGenerated = 6; }
  else if (pollSkeleton.id === 'poll_userlist1_party_snacks_selfies_ul1') { pledgeAmount = 20; tipCountGenerated = 3; }
  else if (pollSkeleton.id === 'poll_userlist1_podcast_trauma_dump_ul1') { pledgeAmount = 27; tipCountGenerated = 2; }
  else if (pollSkeleton.id === 'poll_userlist1_spotify_stalk_confess_ul1') { pledgeAmount = 2; tipCountGenerated = 1; }
  else if (pollSkeleton.id === 'poll_userlist1_lol_ok_meaning_ul1') { pledgeAmount = 8; tipCountGenerated = 9; }
  else if (pollSkeleton.id === 'poll_userlist1_hiking_touch_grass_ul1') { pledgeAmount = 11; tipCountGenerated = 4; }
  else if (pollSkeleton.id === 'poll_userlist1_tattoo_idea_list_new_person_ul1') { pledgeAmount = 30; tipCountGenerated = 7; }
  else if (pollSkeleton.id === 'poll_userlist1_ex_dog_pic_like_ul1') { pledgeAmount = 9; tipCountGenerated = 0; }
  else if (pollSkeleton.id === 'poll_userlist1_quit_job_spiritually_dead_ul1') { pledgeAmount = 75; tipCountGenerated = 15; }
  else if (pollSkeleton.id === 'poll_userlist1_playlist_string_cheese_ul1') { pledgeAmount = 10; tipCountGenerated = 2; }
  else if (pollSkeleton.id === 'poll_userlist1_feet_pics_gas_money_ul1') { pledgeAmount = 40; tipCountGenerated = 6; }
  else if (pollSkeleton.id === 'poll_userlist2_toxic_trait_closure_ghosted_ul2') { pledgeAmount = 15; tipCountGenerated = 4; }
  else if (pollSkeleton.id === 'poll_userlist2_forgave_drunk_reminder_ul2') { pledgeAmount = 22; tipCountGenerated = 6; }
  else if (pollSkeleton.id === 'poll_userlist2_charger_9_months_ul2') { pledgeAmount = 8; tipCountGenerated = 1; }
  else if (pollSkeleton.id === 'poll_userlist2_cold_spaghetti_standards_ul2') { pledgeAmount = 5; tipCountGenerated = 0; }
  else if (pollSkeleton.id === 'poll_userlist2_rewatch_texts_wounds_ul2') { pledgeAmount = 13; tipCountGenerated = 2; }
  else if (pollSkeleton.id === 'poll_userlist2_you_up_reply_ul2') { pledgeAmount = 40; tipCountGenerated = 3; }
  else if (pollSkeleton.id === 'poll_userlist2_situationship_risk_ul2') { pledgeAmount = 50; tipCountGenerated = 7; }
  else if (pollSkeleton.id === 'poll_userlist2_toothbrush_confront_ul2') { pledgeAmount = 100; tipCountGenerated = 12; }
  else if (pollSkeleton.id === 'poll_userlist2_bestie_ex_stories_ul2') { pledgeAmount = 33; tipCountGenerated = 9; }
  else if (pollSkeleton.id === 'poll_userlist2_venmo_fries_request_ul2') { pledgeAmount = 4.37; tipCountGenerated = 0; }
  else if (pollSkeleton.id === 'poll_userlist2_text_ex_mom_ul2') { pledgeAmount = 18; tipCountGenerated = 5; }
  else if (pollSkeleton.id === 'poll_userlist2_not_like_other_people_ul2') { pledgeAmount = 11; tipCountGenerated = 1; }
  else if (pollSkeleton.id === 'poll_userlist2_podcast_group_chat_dump_ul2') { pledgeAmount = 27; tipCountGenerated = 4; }
  else if (pollSkeleton.id === 'poll_userlist2_kitkat_eating_method_ul2') { pledgeAmount = 6; tipCountGenerated = 2; }
  else if (pollSkeleton.id === 'poll_userlist2_hoodie_hostage_return_ul2') { pledgeAmount = 15; tipCountGenerated = 3; }
  else if (pollSkeleton.id === 'poll_userlist2_dm_after_likes_ul2') { pledgeAmount = 10; tipCountGenerated = 1; }
  else if (pollSkeleton.id === 'poll_userlist2_wyd_mid_crisis_reply_ul2') { pledgeAmount = 20; tipCountGenerated = 2; }
  else if (pollSkeleton.id === 'poll_userlist2_friend_bad_breath_ul2') { pledgeAmount = 8; tipCountGenerated = 6; }
  else if (pollSkeleton.id === 'poll_userlist2_cancel_plans_ugly_day_ul2') { pledgeAmount = 14; tipCountGenerated = 3; }
  else if (pollSkeleton.id === 'poll_userlist2_create_own_poll_unhinged_ul2') { pledgeAmount = 0; tipCountGenerated = 0; }


  // Ensure pledgeOutcome is set if pledgeAmount exists
  if (pledgeAmount && pledgeAmount > 0 && !pledgeOutcome) {
      pledgeOutcome = 'pending';
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
