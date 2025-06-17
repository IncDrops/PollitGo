import { BellRing, UserPlus, Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const mockNotifications = [
  { id: 'notif1', type: 'follow', user: { name: 'Bob The Builder', avatarUrl: 'https://placehold.co/100x100.png' }, content: 'started following you.', time: '2h ago', read: false },
  { id: 'notif2', type: 'like', user: { name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/100x100.png' }, content: 'liked your poll "Favorite Season?".', time: '5h ago', read: false },
  { id: 'notif3', type: 'comment', user: { name: 'Charlie Chaplin', avatarUrl: 'https://placehold.co/100x100.png' }, content: 'commented on your poll "Travel Destination".', time: '1d ago', read: true },
  { id: 'notif4', type: 'tip', user: { name: 'Anonymous Gifter', avatarUrl: 'https://placehold.co/100x100.png' }, content: 'tipped you 100 PollitPoints!', time: '2d ago', read: true },
];

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'follow': return <UserPlus className="h-5 w-5 text-blue-500" />;
    case 'like': return <Heart className="h-5 w-5 text-red-500 fill-red-500" />;
    case 'comment': return <MessageCircle className="h-5 w-5 text-green-500" />;
    case 'tip': return <BellRing className="h-5 w-5 text-yellow-500" />; // Using BellRing for tip, can be replaced with a coin/gift icon
    default: return <BellRing className="h-5 w-5 text-gray-500" />;
  }
};

export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline font-bold text-foreground">Notifications</h1>
        <Button variant="outline" size="sm">Mark all as read</Button>
      </div>

      {mockNotifications.length > 0 ? (
        <div className="space-y-3">
          {mockNotifications.map((notif) => (
            <div key={notif.id} className={`flex items-start p-4 rounded-lg ${!notif.read ? 'bg-accent/30' : 'bg-card'} border`}>
              <div className="flex-shrink-0 mr-3 mt-1">
                <NotificationIcon type={notif.type} />
              </div>
              <Avatar className="h-10 w-10 mr-3 border">
                <AvatarImage src={notif.user.avatarUrl} alt={notif.user.name} data-ai-hint="profile avatar" />
                <AvatarFallback>{notif.user.name.substring(0,1)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <p className="text-sm">
                  <span className="font-semibold text-foreground">{notif.user.name}</span>{' '}
                  <span className="text-muted-foreground">{notif.content}</span>
                </p>
                <p className="text-xs text-muted-foreground">{notif.time}</p>
              </div>
              {!notif.read && (
                <span className="h-2.5 w-2.5 bg-primary rounded-full self-center ml-2" title="Unread"></span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-10">
          <BellRing className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>No new notifications.</p>
          <p className="text-sm">You're all caught up!</p>
        </div>
      )}
    </div>
  );
}
