import PollFeed from '@/components/polls/PollFeed';

export default function HomePage() {
  return (
    <div className="container mx-auto px-0 sm:px-4 py-0"> {/* Adjusted padding for mobile-first */}
      <PollFeed />
    </div>
  );
}
