
import type { Poll, User } from '@/types';

const generateRandomVotes = () => Math.floor(Math.random() * 300) + 10;
const generateRandomTips = () => Math.floor(Math.random() * 50);
const generateRandomPledge = (forcePledge: boolean = false): number | undefined => {
  const shouldPledge = forcePledge || Math.random() > 0.6;
  return shouldPledge ? parseFloat((Math.random() * 95 + 5).toFixed(2)) : undefined;
};
const generatePollitPoints = () => Math.floor(Math.random() * 5000) + 100;

const usersData: { name: string }[] = [
  { name: 'Alice Wonderland' }, { name: 'Bob The Builder' }, { name: 'Charlie Chaplin' },
  { name: 'Sophia Miller' }, { name: 'Alex Johnson' }, { name: 'Emma Davis' }, { name: 'Liam Garcia' },
  { name: 'Olivia Rodriguez' }, { name: 'Noah Smith' }, { name: 'Ava Williams' }, { name: 'Isabella Brown' },
  { name: 'Mia Jones' }, { name: 'Charlotte Wilson' }, { name: 'Amelia Taylor' }, { name: 'Harper Anderson' },
  { name: 'Evelyn Thomas' }, { name: 'Abigail Jackson' }, { name: 'Ella White' }, { name: 'Scarlett Harris' },
  { name: 'Elizabeth Martin' }, { name: 'Poll Progenitor' }, { name: 'Curious Explorer' }, { name: 'Path Seeker' }
];

export const mockUsers: User[] = usersData.map((user, index) => ({
  id: `user${index + 1}`,
  name: user.name,
  avatarUrl: `https://placehold.co/100x100.png?text=${user.name.split(' ').map(n => n[0]).join('')}`,
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

const urlSafeText = (text: string, maxLength: number = 20) => encodeURIComponent(text.substring(0, maxLength));

type PollSkeleton = Omit<Poll, 'totalVotes' | 'isVoted' | 'votedOptionId' | 'commentsCount' | 'likes' | 'tipCount' | 'pledgeAmount' | 'pledgeOutcome'>;

// 40 Two-Option Polls
const twoOptionPolls: PollSkeleton[] = [
  { id: '2opt_cereal_art', creator: getRandomUser(), question: "New cereal box art is weird, stop eating?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Cereal Art")}`], options: [{ id: '2opt_cereal_a', text: "Trust gut, ditch it" }, { id: '2opt_cereal_b', text: "It's just a box, chill" }], deadline: new Date(Date.now() + parseTimeRemaining("3 days")).toISOString(), createdAt: generateCreatedAt("3 days") },
  { id: '2opt_sneaky_link', creator: getRandomUser(), question: "Bestie's man DMed me twice. Sneaky link?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("DM Drama")}`], options: [{ id: '2opt_sneaky_a', text: "Slide quietly" }, { id: '2opt_sneaky_b', text: "Therapy, girl" }], deadline: new Date(Date.now() + parseTimeRemaining("1 hour")).toISOString(), createdAt: generateCreatedAt("1 hour") },
  { id: '2opt_rapper_battle', creator: getRandomUser(), question: "Trippie Redd vs Hurricane Wisdom: better rapper?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Rap Battle")}`], options: [{ id: '2opt_rap_a', text: "Trippie Redd" }, { id: '2opt_rap_b', text: "Hurricane Wisdom" }], deadline: new Date(Date.now() + parseTimeRemaining("7 minutes")).toISOString(), createdAt: generateCreatedAt("7 minutes") },
  { id: '2opt_wife_beer', creator: getRandomUser(), question: "Wife said no more beer. Crack one anyway?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Beer Choice")}`], options: [{ id: '2opt_beer_a', text: "Freedom is brewed" }, { id: '2opt_beer_b', text: "Nah, she's your ride" }], deadline: new Date(Date.now() + parseTimeRemaining("1 minute")).toISOString(), createdAt: generateCreatedAt("1 minute") },
  { id: '2opt_toxic_closure_ghosted', creator: getRandomUser(), question: "Toxic trait: need closure from someone I ghosted. Message them?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Ghost Closure")}`], options: [{ id: '2opt_toxic_a', text: "Yes, give whiplash" }, { id: '2opt_toxic_b', text: "No, vanish like smoke" }], deadline: new Date(Date.now() + parseTimeRemaining("3 hours")).toISOString(), createdAt: generateCreatedAt("3 hours") },
  { id: '2opt_hoodie_retirement', creator: getRandomUser(), question: "Favorite hoodie falling apart. Retire or wear to threads?", options: [{ id: '2opt_hoodie_a', text: "Retire with honors" }, { id: '2opt_hoodie_b', text: "Threads of glory!" }], deadline: new Date(Date.now() + parseTimeRemaining("2 days")).toISOString(), createdAt: generateCreatedAt("2 days") },
  { id: '2opt_forgave_drunk_reminder', creator: getRandomUser(), question: "Forgave ex when drunk. Counts? Remind them I was drunk?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Drunk Forgive")}`], options: [{ id: '2opt_forgive_a', text: "Yes, full disclosure" }, { id: '2opt_forgive_b', text: "No, let it ride lol" }], deadline: new Date(Date.now() + parseTimeRemaining("24 hours")).toISOString(), createdAt: generateCreatedAt("24 hours") },
  { id: '2opt_charger_9_months', creator: getRandomUser(), question: "Friend 'borrowed' charger 9 months ago. Mine or theirs now?", options: [{ id: '2opt_charger9_a', text: "Still yours, demand it!" }, { id: '2opt_charger9_b', text: "Adopted, let it go" }], deadline: new Date(Date.now() + parseTimeRemaining("6 hours")).toISOString(), createdAt: generateCreatedAt("6 hours") },
  { id: '2opt_cold_spaghetti_standards', creator: getRandomUser(), question: "Eating cold spaghetti from fridge at 3 AM. Rock bottom or peak living?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("3AM Spaghetti")}`], options: [{ id: '2opt_spaghetti_a', text: "Rock bottom, seek help" }, { id: '2opt_spaghetti_b', text: "Peak living, iconic" }], deadline: new Date(Date.now() + parseTimeRemaining("15 minutes")).toISOString(), createdAt: generateCreatedAt("15 minutes") },
  { id: '2opt_rewatch_texts_wounds', creator: getRandomUser(), question: "Re-reading old ex texts & crying. Delete archive or keep picking scab?", options: [{ id: '2opt_rewatch_a', text: "Delete & heal, queen" }, { id: '2opt_rewatch_b', text: "Nah, feel your feels" }], deadline: new Date(Date.now() + parseTimeRemaining("1 day")).toISOString(), createdAt: generateCreatedAt("1 day") },
  { id: '2opt_chicken_tenders_date', creator: getRandomUser(), question: "Order chicken tenders on fancy first date: Y/N?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Date Tenders")}`], options: [{ id: '2opt_tenders_a', text: "Yes, be yourself" }, { id: '2opt_tenders_b', text: "Bad first impression" }], deadline: new Date(Date.now() + parseTimeRemaining("8 hours")).toISOString(), createdAt: generateCreatedAt("8 hours") },
  { id: '2opt_situationship_risk', creator: getRandomUser(), question: "Situationship too comfy. Risk it by asking 'What are we?'", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Situationship")}`], options: [{ id: '2opt_situation_a', text: "Yes, clarity or chaos!" }, { id: '2opt_situation_b', text: "No, enjoy ambiguity" }], deadline: new Date(Date.now() + parseTimeRemaining("12 hours")).toISOString(), createdAt: generateCreatedAt("12 hours") },
  { id: '2opt_thirst_trap_respect', creator: getRandomUser(), question: "Post thirst trap, can I still demand respect?", options: [{ id: '2opt_thirst_a', text: "Yes, respect unconditional" }, { id: '2opt_thirst_b', text: "It's complicated..." }], deadline: new Date(Date.now() + parseTimeRemaining("4 hours")).toISOString(), createdAt: generateCreatedAt("4 hours") },
  { id: '2opt_ignore_message_normal', creator: getRandomUser(), question: "Ignore message 3 days, then reply like nothing happened: Normal?", options: [{ id: '2opt_ignore_a', text: "Totally normal" }, { id: '2opt_ignore_b', text: "Kinda rude, ngl" }], deadline: new Date(Date.now() + parseTimeRemaining("5 hours")).toISOString(), createdAt: generateCreatedAt("5 hours") },
  { id: '2opt_bestie_ex_stories', creator: getRandomUser(), question: "Bestie posts stories with their new partner (my ex's ex). Mute or unfriend?", options: [{ id: '2opt_bestie_a', text: "Mute for sanity" }, { id: '2opt_bestie_b', text: "Unfriend, cut cord" }], deadline: new Date(Date.now() + parseTimeRemaining("30 minutes")).toISOString(), createdAt: generateCreatedAt("30 minutes") },
  { id: '2opt_charger_return_keep', creator: getRandomUser(), question: "Friend left charger. Return or fair game?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Charger Dilemma")}`], options: [{ id: '2opt_charger_a', text: "Return, good karma" }, { id: '2opt_charger_b', text: "Finders keepers!" }], deadline: new Date(Date.now() + parseTimeRemaining("1 day")).toISOString(), createdAt: generateCreatedAt("1 day") },
  { id: '2opt_venmo_fries_request', creator: getRandomUser(), question: "Friend ate 3 of my fries. Venmo request $0.75?", options: [{ id: '2opt_venmo_a', text: "Yes, principle matters" }, { id: '2opt_venmo_b', text: "No, petty AF" }], deadline: new Date(Date.now() + parseTimeRemaining("1 hour")).toISOString(), createdAt: generateCreatedAt("1 hour") },
  { id: '2opt_party_snacks_selfies', creator: getRandomUser(), question: "Hosting party: Focus on good snacks or good selfie lighting?", options: [{ id: '2opt_party_a', text: "Snacks supreme" }, { id: '2opt_party_b', text: "Lighting for the 'gram!" }], deadline: new Date(Date.now() + parseTimeRemaining("4 days")).toISOString(), createdAt: generateCreatedAt("4 days") },
  { id: '2opt_text_ex_mom', creator: getRandomUser(), question: "Still text ex's mom happy birthday: Weird or sweet?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Ex Mom Bday")}`], options: [{ id: '2opt_exmom_a', text: "Sweet, if close" }, { id: '2opt_exmom_b', text: "Kinda weird, move on" }], deadline: new Date(Date.now() + parseTimeRemaining("6 days")).toISOString(), createdAt: generateCreatedAt("6 days") },
  { id: '2opt_podcast_trauma_dump', creator: getRandomUser(), question: "Start podcast to trauma dump or get therapist?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Podcast vs Therapy")}`], options: [{ id: '2opt_podcast_a', text: "Podcast, share story!" }, { id: '2opt_podcast_b', text: "Therapist, help first" }], deadline: new Date(Date.now() + parseTimeRemaining("9 hours")).toISOString(), createdAt: generateCreatedAt("9 hours") },
  { id: '2opt_not_like_other_people', creator: getRandomUser(), question: "Date said 'I'm not like other people.' Red flag or intriguing?", options: [{ id: '2opt_redflag_a', text: "Massive red flag, abort!" }, { id: '2opt_redflag_b', text: "Intriguing, tell more..." }], deadline: new Date(Date.now() + parseTimeRemaining("2 hours")).toISOString(), createdAt: generateCreatedAt("2 hours") },
  { id: '2opt_spotify_stalk_confess', creator: getRandomUser(), question: "I stalk crush's Spotify. Confess or keep intel secret?", options: [{ id: '2opt_spotify_a', text: "Confess, kinda cute" }, { id: '2opt_spotify_b', text: "Secret intel for win" }], deadline: new Date(Date.now() + parseTimeRemaining("12 hours")).toISOString(), createdAt: generateCreatedAt("12 hours") },
  { id: '2opt_podcast_group_chat_dump', creator: getRandomUser(), question: "Turn unhinged group chat into podcast. Good idea or disaster?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Group Chat Podcast")}`], options: [{ id: '2opt_groupchat_a', text: "Genius! I'd listen." }, { id: '2opt_groupchat_b', text: "Friendships will end." }], deadline: new Date(Date.now() + parseTimeRemaining("3 days")).toISOString(), createdAt: generateCreatedAt("3 days") },
  { id: '2opt_kitkat_eating_method', creator: getRandomUser(), question: "Eat KitKat: Break fingers or bite whole thing like psycho?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("KitKat Method")}`], options: [{ id: '2opt_kitkat_a', text: "Break fingers, civilized" }, { id: '2opt_kitkat_b', text: "Whole thing, chaos mode" }], deadline: new Date(Date.now() + parseTimeRemaining("10 minutes")).toISOString(), createdAt: generateCreatedAt("10 minutes") },
  { id: '2opt_hiking_touch_grass', creator: getRandomUser(), question: "Friends want to hike. Is 'touching grass' overrated?", options: [{ id: '2opt_grass_a', text: "Yes, indoors forever" }, { id: '2opt_grass_b', text: "No, fresh air is good!" }], deadline: new Date(Date.now() + parseTimeRemaining("7 days")).toISOString(), createdAt: generateCreatedAt("7 days") },
  { id: '2opt_hoodie_hostage_return', creator: getRandomUser(), question: "Have 3 ex's hoodies. Return or emotional distress compensation?", options: [{ id: '2opt_hostage_a', text: "Return, bigger person" }, { id: '2opt_hostage_b', text: "Keep 'em, trophies" }], deadline: new Date(Date.now() + parseTimeRemaining("4 days")).toISOString(), createdAt: generateCreatedAt("4 days") },
  { id: '2opt_tattoo_idea_list_new_person', creator: getRandomUser(), question: "Tattoo ideas list from ex. Still get w/ new person?", options: [{ id: '2opt_tattoo_a', text: "Get them, your body!" }, { id: '2opt_tattoo_b', text: "Too weird, new list" }], deadline: new Date(Date.now() + parseTimeRemaining("10 days")).toISOString(), createdAt: generateCreatedAt("10 days") },
  { id: '2opt_ex_dog_pic_like', creator: getRandomUser(), question: "Ex liked pic of my dog. Wants me back or just likes dogs?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Dog Pic Signal")}`], options: [{ id: '2opt_dogpic_a', text: "They want you back!" }, { id: '2opt_dogpic_b', text: "Just likes dogs, chill" }], deadline: new Date(Date.now() + parseTimeRemaining("20 hours")).toISOString(), createdAt: generateCreatedAt("20 hours") },
  { id: '2opt_quit_job_spiritually_dead', creator: getRandomUser(), question: "Job makes me spiritually dead. Quit with no backup plan?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Quit Job YOLO")}`], options: [{ id: '2opt_quitjob_a', text: "Yes, YOLO, follow spirit" }, { id: '2opt_quitjob_b', text: "No, secure job first" }], deadline: new Date(Date.now() + parseTimeRemaining("14 days")).toISOString(), createdAt: generateCreatedAt("14 days") },
  { id: '2opt_playlist_string_cheese', creator: getRandomUser(), question: "Weirder: Playlist for cat or biting string cheese?", options: [{ id: '2opt_catcheese_a', text: "Cat playlist weirder" }, { id: '2opt_catcheese_b', text: "String cheese bite weirder" }], deadline: new Date(Date.now() + parseTimeRemaining("3 hours")).toISOString(), createdAt: generateCreatedAt("3 hours") },
  { id: '2opt_feet_pics_gas_money', creator: getRandomUser(), question: "Friend suggested selling feet pics for gas money. Good idea?", options: [{ id: '2opt_feetpics_a', text: "Secure the bag!" }, { id: '2opt_feetpics_b', text: "Explore other options..." }], deadline: new Date(Date.now() + parseTimeRemaining("6 hours")).toISOString(), createdAt: generateCreatedAt("6 hours") },
  { id: '2opt_create_own_poll_unhinged', creator: getRandomUser(), question: "Create own poll b/c tired of pretending I don't have unhinged opinions?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("My Poll Time")}`], options: [{ id: '2opt_createpoll_a', text: "Do it now" }, { id: '2opt_createpoll_b', text: "This is your sign" }], deadline: new Date(Date.now() + parseTimeRemaining("2 days")).toISOString(), createdAt: generateCreatedAt("2 days") },
  { id: '2opt_coffee_vs_tea', creator: getRandomUser(), question: "Morning kickstart: Coffee or Tea?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Coffee vs Tea")}`], options: [{ id: '2opt_coffee_a', text: "Coffee for the win!" }, { id: '2opt_coffee_b', text: "Tea, calm and steady" }], deadline: new Date(Date.now() + parseTimeRemaining("1 day")).toISOString(), createdAt: generateCreatedAt("1 day") },
  { id: '2opt_pineapple_pizza', creator: getRandomUser(), question: "Pineapple on pizza: Culinary crime or delicious delight?", options: [{ id: '2opt_pizza_a', text: "Crime against humanity" }, { id: '2opt_pizza_b', text: "Sweet & savory perfection" }], deadline: new Date(Date.now() + parseTimeRemaining("5 hours")).toISOString(), createdAt: generateCreatedAt("5 hours") },
  { id: '2opt_early_bird_night_owl', creator: getRandomUser(), question: "Are you an early bird or a night owl?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Bird or Owl")}`], options: [{ id: '2opt_birdowl_a', text: "Early bird gets the worm!" }, { id: '2opt_birdowl_b', text: "Night owl, thrive in dark" }], deadline: new Date(Date.now() + parseTimeRemaining("30 minutes")).toISOString(), createdAt: generateCreatedAt("30 minutes") },
  { id: '2opt_call_vs_text', creator: getRandomUser(), question: "Quick question: Better to call or text?", options: [{ id: '2opt_calltext_a', text: "Text, quick and easy" }, { id: '2opt_calltext_b', text: "Call, more personal" }], deadline: new Date(Date.now() + parseTimeRemaining("2 hours")).toISOString(), createdAt: generateCreatedAt("2 hours") },
  { id: '2opt_work_from_home_office', creator: getRandomUser(), question: "Ideal work setup: Work from home or in the office?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("WFH or Office")}`], options: [{ id: '2opt_wfh_a', text: "Home sweet office" }, { id: '2opt_wfh_b', text: "Office for collaboration" }], deadline: new Date(Date.now() + parseTimeRemaining("10 days")).toISOString(), createdAt: generateCreatedAt("10 days") },
  { id: '2opt_android_vs_ios', creator: getRandomUser(), question: "Smartphone allegiance: Android or iOS?", options: [{ id: '2opt_mobileos_a', text: "Android for customization" }, { id: '2opt_mobileos_b', text: "iOS for simplicity" }], deadline: new Date(Date.now() + parseTimeRemaining("6 days")).toISOString(), createdAt: generateCreatedAt("6 days") },
  { id: '2opt_cancel_plans_ugly_day', creator: getRandomUser(), question: "Woke up feeling ugly. Valid reason to cancel plans?", options: [{ id: 'opt_cpud1_a', text: "Absolutely, self-care!" }, { id: 'opt_cpud1_b', text: "No, push through it" }], deadline: new Date(Date.now() + parseTimeRemaining("45 minutes")).toISOString(), createdAt: generateCreatedAt("45 minutes") },
];

// 20 Three-Option Polls
const threeOptionPolls: PollSkeleton[] = [
  { id: '3opt_travel_destination', creator: getRandomUser(), question: 'Next summer travel: Paris, Tokyo, or Rome?', imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Summer Travel")}`], videoUrl: 'placeholder-video-url', options: [{ id: '3opt_travel_a', text: 'Paris, France', imageUrl: `https://placehold.co/300x200.png?text=${urlSafeText("Paris")}` , affiliateLink: 'https://example.com/paris-tours' }, { id: '3opt_travel_b', text: 'Tokyo, Japan', imageUrl: `https://placehold.co/300x200.png?text=${urlSafeText("Tokyo")}`, affiliateLink: 'https://example.com/tokyo-hotels' }, { id: '3opt_travel_c', text: 'Rome, Italy', imageUrl: `https://placehold.co/300x200.png?text=${urlSafeText("Rome")}` }], deadline: new Date(Date.now() + parseTimeRemaining("30 days")).toISOString(), createdAt: generateCreatedAt("30 days") },
  { id: '3opt_weekend_activity', creator: getRandomUser(), question: 'Ideal weekend: Hiking, Binge-watching, or New Restaurant?', options: [{ id: '3opt_weekend_a', text: 'Hiking in nature' }, { id: '3opt_weekend_b', text: 'Binge-watching a series' }, { id: '3opt_weekend_c', text: 'Trying a new restaurant' }], deadline: new Date(Date.now() + parseTimeRemaining("5 days")).toISOString(), createdAt: generateCreatedAt("5 days") },
  { id: '3opt_social_media', creator: getRandomUser(), question: 'Favorite social media: Instagram, TikTok, or X (Twitter)?', imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Social Media")}`], options: [{ id: '3opt_social_a', text: 'Instagram' }, { id: '3opt_social_b', text: 'TikTok' }, { id: '3opt_social_c', text: 'X (Twitter)' }], deadline: new Date(Date.now() + parseTimeRemaining("2 days")).toISOString(), createdAt: generateCreatedAt("2 days") },
  { id: '3opt_music_genre', creator: getRandomUser(), question: 'Current music mood: Pop, Rock, or Electronic?', options: [{ id: '3opt_music_a', text: 'Pop anthems' }, { id: '3opt_music_b', text: 'Classic Rock' }, { id: '3opt_music_c', text: 'Electronic beats' }], deadline: new Date(Date.now() + parseTimeRemaining("12 hours")).toISOString(), createdAt: generateCreatedAt("12 hours") },
  { id: '3opt_pet_preference', creator: getRandomUser(), question: 'Preferred pet: Dog, Cat, or Something else?', imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Pets")}`], options: [{ id: '3opt_pet_a', text: 'Dog (Man\'s best friend)' }, { id: '3opt_pet_b', text: 'Cat (Feline overlord)' }, { id: '3opt_pet_c', text: 'Something else (Fish, bird, etc.)' }], deadline: new Date(Date.now() + parseTimeRemaining("7 days")).toISOString(), createdAt: generateCreatedAt("7 days") },
  { id: '3opt_book_genre', creator: getRandomUser(), question: 'Next book to read: Fantasy, Thriller, or Romance?', options: [{ id: '3opt_book_a', text: 'Epic Fantasy saga' }, { id: '3opt_book_b', text: 'Gripping Thriller' }, { id: '3opt_book_c', text: 'Heartwarming Romance' }], deadline: new Date(Date.now() + parseTimeRemaining("4 days")).toISOString(), createdAt: generateCreatedAt("4 days") },
  { id: '3opt_exercise_type', creator: getRandomUser(), question: 'Favorite way to exercise: Gym, Running, or Home workout?', imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Exercise")}`], options: [{ id: '3opt_exercise_a', text: 'Pumping iron at the Gym' }, { id: '3opt_exercise_b', text: 'Hitting the pavement Running' }, { id: '3opt_exercise_c', text: 'Convenient Home workout' }], deadline: new Date(Date.now() + parseTimeRemaining("1 day")).toISOString(), createdAt: generateCreatedAt("1 day") },
  { id: '3opt_gaming_platform', creator: getRandomUser(), question: 'Gaming platform of choice: PC, Console, or Mobile?', options: [{ id: '3opt_gaming_a', text: 'PC Master Race' }, { id: '3opt_gaming_b', text: 'Console (PlayStation/Xbox/Switch)' }, { id: '3opt_gaming_c', text: 'Mobile gaming on the go' }], deadline: new Date(Date.now() + parseTimeRemaining("6 hours")).toISOString(), createdAt: generateCreatedAt("6 hours") },
  { id: '3opt_dessert_choice', creator: getRandomUser(), question: 'Ultimate dessert: Chocolate cake, Ice cream, or Fruit tart?', imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Dessert")}`], options: [{ id: '3opt_dessert_a', text: 'Decadent Chocolate Cake' }, { id: '3opt_dessert_b', text: 'Cool & Creamy Ice Cream' }, { id: '3opt_dessert_c', text: 'Fresh Fruit Tart' }], deadline: new Date(Date.now() + parseTimeRemaining("3 hours")).toISOString(), createdAt: generateCreatedAt("3 hours") },
  { id: '3opt_superpower', creator: getRandomUser(), question: 'If you could have one superpower: Flight, Invisibility, or Telepathy?', options: [{ id: '3opt_super_a', text: 'Soar with Flight' }, { id: '3opt_super_b', text: 'Sneak with Invisibility' }, { id: '3opt_super_c', text: 'Read minds with Telepathy' }], deadline: new Date(Date.now() + parseTimeRemaining("10 days")).toISOString(), createdAt: generateCreatedAt("10 days") },
  { id: '3opt_you_up_reply_chaos', creator: getRandomUser(), question: "Got 'you up?' text at 2 AM. Max chaos/comedy reply?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("2AM Text")}`], options: [{ id: 'yur1_opt_a', text: "'New phone, who dis?'" }, { id: 'yur1_opt_b', text: "'Yes, and I was just thinking of you... not.'" }, { id: 'yur1_opt_c', text: "Send Wikipedia link to 'Sleep'" }], deadline: new Date(Date.now() + parseTimeRemaining("5 minutes")).toISOString(), createdAt: generateCreatedAt("5 minutes") },
  { id: '3opt_toothbrush_confront', creator: getRandomUser(), question: "Think roommate uses my toothbrush. How to confront?", options: [{ id: 'tc1_opt_a', text: "Hide it and see" }, { id: 'tc1_opt_b', text: "Passive-aggressive note" }, { id: 'tc1_opt_c', text: "Buy them new one, hint hint" }], deadline: new Date(Date.now() + parseTimeRemaining("2 days")).toISOString(), createdAt: generateCreatedAt("2 days") },
  { id: '3opt_dm_after_likes', creator: getRandomUser(), question: "How many posts like before I DM?", options: [{ id: 'dal1_opt_a', text: "1 like is invitation" }, { id: 'dal1_opt_b', text: "3-5, show interest" }, { id: 'dal1_opt_c', text: "Likes don't matter, shoot shot" }], deadline: new Date(Date.now() + parseTimeRemaining("2 days")).toISOString(), createdAt: generateCreatedAt("2 days") },
  { id: '3opt_wyd_mid_crisis_reply', creator: getRandomUser(), question: "Texted 'wyd' during existential crisis. Best reply?", options: [{ id: 'wmcr1_opt_a', text: "'Contemplating void, u?'" }, { id: 'wmcr1_opt_b', text: "'Nm, hbu?' (lie)" }, { id: 'wmcr1_opt_c', text: "Full trauma dump" }], deadline: new Date(Date.now() + parseTimeRemaining("50 minutes")).toISOString(), createdAt: generateCreatedAt("50 minutes") },
  { id: '3opt_friend_bad_breath', creator: getRandomUser(), question: "Friend has bad breath. How to tell them?", options: [{ id: 'fbb1_opt_a', text: "Offer gum constantly" }, { id: 'fbb1_opt_b', text: "Tell privately & nicely" }, { id: 'fbb1_opt_c', text: "Suffer in silence" }], deadline: new Date(Date.now() + parseTimeRemaining("18 hours")).toISOString(), createdAt: generateCreatedAt("18 hours") },
  { id: '3opt_vacation_type', creator: getRandomUser(), question: 'Ideal vacation: Beach relaxation, City exploration, or Mountain adventure?', imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Vacation Type")}`], options: [{ id: '3opt_vac_a', text: 'Beach & Sun' }, { id: '3opt_vac_b', text: 'Urban Adventure' }, { id: '3opt_vac_c', text: 'Mountain Retreat' }], deadline: new Date(Date.now() + parseTimeRemaining("15 days")).toISOString(), createdAt: generateCreatedAt("15 days") },
  { id: '3opt_learning_skill', creator: getRandomUser(), question: 'Skill to learn next: New language, Coding, or Musical instrument?', options: [{ id: '3opt_skill_a', text: 'Learn a Language' }, { id: '3opt_skill_b', text: 'Start Coding' }, { id: '3opt_skill_c', text: 'Play an Instrument' }], deadline: new Date(Date.now() + parseTimeRemaining("20 days")).toISOString(), createdAt: generateCreatedAt("20 days") },
  { id: '3opt_movie_snack', creator: getRandomUser(), question: 'Best movie snack: Popcorn, Candy, or Nachos?', imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Movie Snack")}`], options: [{ id: '3opt_snack_a', text: 'Classic Popcorn' }, { id: '3opt_snack_b', text: 'Sweet Candy' }, { id: '3opt_snack_c', text: 'Cheesy Nachos' }], deadline: new Date(Date.now() + parseTimeRemaining("45 minutes")).toISOString(), createdAt: generateCreatedAt("45 minutes") },
  { id: '3opt_transport_mode', creator: getRandomUser(), question: 'Preferred city transport: Public transit, Cycling, or Walking?', options: [{ id: '3opt_trans_a', text: 'Efficient Public Transit' }, { id: '3opt_trans_b', text: 'Eco-friendly Cycling' }, { id: '3opt_trans_c', text: 'Healthy Walking' }], deadline: new Date(Date.now() + parseTimeRemaining("8 days")).toISOString(), createdAt: generateCreatedAt("8 days") },
  { id: '3opt_season_preference', creator: getRandomUser(), question: 'Favorite season group: Spring/Summer, Autumn, or Winter?', imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Seasons")}`], options: [{ id: '3opt_season_a', text: 'Warm Spring/Summer' }, { id: '3opt_season_b', text: 'Cozy Autumn' }, { id: '3opt_season_c', text: 'Crisp Winter' }], deadline: new Date(Date.now() + parseTimeRemaining("5 days")).toISOString(), createdAt: generateCreatedAt("5 days") },
];

// 10 Four-Option Polls
const fourOptionPolls: PollSkeleton[] = [
  { id: '4opt_seasons_detail', creator: getRandomUser(), question: 'What is your favorite season overall?', imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Favorite Season")}`, `https://placehold.co/600x400.png?text=${urlSafeText("Seasonal")}`], options: [{ id: '4opt_s1_a', text: 'Spring - new beginnings', imageUrl: `https://placehold.co/300x200.png?text=${urlSafeText("Spring")}`, affiliateLink: 'https://example.com/spring-decor' }, { id: '4opt_s1_b', text: 'Summer - sunny days', imageUrl: `https://placehold.co/300x200.png?text=${urlSafeText("Summer")}`, affiliateLink: 'https://example.com/summer-gear' }, { id: '4opt_s1_c', text: 'Autumn - cozy vibes', imageUrl: `https://placehold.co/300x200.png?text=${urlSafeText("Autumn")}`, affiliateLink: 'https://example.com/autumn-fashion' }, { id: '4opt_s1_d', text: 'Winter - snow & holidays', imageUrl: `https://placehold.co/300x200.png?text=${urlSafeText("Winter")}`, affiliateLink: 'https://example.com/winter-sports' }], deadline: new Date(Date.now() + parseTimeRemaining("7 days")).toISOString(), createdAt: generateCreatedAt("7 days") },
  { id: '4opt_language_beginners', creator: getRandomUser(), question: 'Best programming language for beginners 2024?', imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Coding Lang")}`], options: [{ id: '4opt_l1_a', text: 'Python', affiliateLink: 'https://example.com/python-course' }, { id: '4opt_l1_b', text: 'JavaScript', affiliateLink: 'https://example.com/js-bootcamp' }, { id: '4opt_l1_c', text: 'Java' }, { id: '4opt_l1_d', text: 'C#' }], deadline: new Date(Date.now() + parseTimeRemaining("3 days")).toISOString(), createdAt: generateCreatedAt("3 days") },
  { id: '4opt_movie_night_genre', creator: getRandomUser(), question: 'Movie night! What genre should we watch?', imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Movie Night")}`], options: [{ id: '4opt_gm1_a', text: 'Comedy' }, { id: '4opt_gm1_b', text: 'Horror' }, { id: '4opt_gm1_c', text: 'Sci-Fi' }, { id: '4opt_gm1_d', text: 'Documentary' }], deadline: new Date(Date.now() + parseTimeRemaining("2 hours")).toISOString(), createdAt: generateCreatedAt("2 hours") },
  { id: '4opt_lol_ok_meaning', creator: getRandomUser(), question: "What does 'lol ok' REALLY mean in a text?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("lol ok meaning")}`], options: [{ id: '4opt_lom1_a', text: "Mildly amused" }, { id: '4opt_lom1_b', text: "Politely ending it" }, { id: '4opt_lom1_c', text: "Hates you secretly" }, { id: '4opt_lom1_d', text: "Means nothing, chill" }], deadline: new Date(Date.now() + parseTimeRemaining("25 minutes")).toISOString(), createdAt: generateCreatedAt("25 minutes") },
  { id: '4opt_communication_style', creator: getRandomUser(), question: 'Preferred communication: Texts, Calls, Emails, or In-person?', options: [{ id: '4opt_comm_a', text: 'Quick Texts' }, { id: '4opt_comm_b', text: 'Voice Calls' }, { id: '4opt_comm_c', text: 'Formal Emails' }, { id: '4opt_comm_d', text: 'Face-to-face' }], deadline: new Date(Date.now() + parseTimeRemaining("4 days")).toISOString(), createdAt: generateCreatedAt("4 days") },
  { id: '4opt_dream_car_type', creator: getRandomUser(), question: 'Dream car type: Sports Car, SUV, Truck, or Luxury Sedan?', imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Dream Car")}`], options: [{ id: '4opt_car_a', text: 'Sleek Sports Car' }, { id: '4opt_car_b', text: 'Versatile SUV' }, { id: '4opt_car_c', text: 'Rugged Truck' }, { id: '4opt_car_d', text: 'Elegant Luxury Sedan' }], deadline: new Date(Date.now() + parseTimeRemaining("25 days")).toISOString(), createdAt: generateCreatedAt("25 days") },
  { id: '4opt_coffee_style', creator: getRandomUser(), question: 'How do you take your coffee: Black, With Sugar, With Cream, or All of the above?', options: [{ id: '4opt_coffee_s_a', text: 'Black as night' }, { id: '4opt_coffee_s_b', text: 'A little sweet (Sugar)' }, { id: '4opt_coffee_s_c', text: 'Creamy & smooth' }, { id: '4opt_coffee_s_d', text: 'The works! (Cream & Sugar)' }], deadline: new Date(Date.now() + parseTimeRemaining("50 minutes")).toISOString(), createdAt: generateCreatedAt("50 minutes") },
  { id: '4opt_ideal_living', creator: getRandomUser(), question: 'Ideal living situation: City Apartment, Suburban House, Countryside Farm, or Beachfront Villa?', imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("Ideal Living")}`], options: [{ id: '4opt_live_a', text: 'Bustling City Apartment' }, { id: '4opt_live_b', text: 'Quiet Suburban House' }, { id: '4opt_live_c', text: 'Peaceful Countryside Farm' }, { id: '4opt_live_d', text: 'Relaxing Beachfront Villa' }], deadline: new Date(Date.now() + parseTimeRemaining("40 days")).toISOString(), createdAt: generateCreatedAt("40 days") },
  { id: '4opt_hobby_type', creator: getRandomUser(), question: 'Preferred hobby type: Creative, Active, Relaxing, or Intellectual?', options: [{ id: '4opt_hobby_a', text: 'Creative (Art, Writing)' }, { id: '4opt_hobby_b', text: 'Active (Sports, Hiking)' }, { id: '4opt_hobby_c', text: 'Relaxing (Reading, Meditation)' }, { id: '4opt_hobby_d', text: 'Intellectual (Puzzles, Learning)' }], deadline: new Date(Date.now() + parseTimeRemaining("9 days")).toISOString(), createdAt: generateCreatedAt("9 days") },
  { id: '4opt_vcard_decision', creator: getRandomUser(), question: "Losing V-card: To wrap or not? What's the tea?", imageUrls: [`https://placehold.co/600x400.png?text=${urlSafeText("V-Card Talk")}`], options: [{ id: '4opt_sv1_a', text: "Wrap it! STIs NOT a vibe.", affiliateLink: 'https://example.com/safe-sex-info' }, { id: '4opt_sv1_b', text: "Stars whisper protection... & pleasure." }, { id: '4opt_sv1_c', text: "Raw doggin'? Only if both clean & discussed." }, { id: '4opt_sv1_d', text: "Spirits guide to condom aisle. Flip coin for flavor.", affiliateLink: 'https://example.com/condom-variety-pack' }], deadline: new Date(Date.now() + parseTimeRemaining("6 hours, 38 minutes")).toISOString(), createdAt: generateCreatedAt("6 hours, 38 minutes") },
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

  return {
    ...pollSkeleton,
    options: optionsWithVotes,
    totalVotes,
    isVoted: shouldBeVoted,
    votedOptionId: determinedVotedOptionId,
    likes: (index * 17 % 250) + 10,
    commentsCount: (index * 7 % 35) + 2,
    pledgeAmount,
    pledgeOutcome,
    tipCount: generateRandomTips(),
  };
});


export const mockPolls: Poll[] = [...allPollsFull].sort(() => Math.random() - 0.5); // Shuffle for variety on feed


export const fetchMorePolls = async (offset: number, limit: number): Promise<Poll[]> => {
  console.log(`Fetching more polls: offset ${offset}, limit ${limit}`);
  await new Promise(resolve => setTimeout(resolve, 300)); 

  const newPollsToServe = mockPolls.slice(offset, offset + limit);
  return newPollsToServe;
};

    