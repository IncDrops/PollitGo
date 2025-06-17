import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MessageSquareText, Search } from "lucide-react";

const mockMessages = [
  { id: 'msg1', name: 'Alice Wonderland', lastMessage: 'Hey, how are you doing?', avatarUrl: 'https://placehold.co/100x100.png', unread: 2, time: '10:30 AM' },
  { id: 'msg2', name: 'Bob The Builder', lastMessage: 'Can we build it? Yes we can!', avatarUrl: 'https://placehold.co/100x100.png', unread: 0, time: 'Yesterday' },
  { id: 'msg3', name: 'Charlie Chaplin', lastMessage: 'A day without laughter is a day wasted.', avatarUrl: 'https://placehold.co/100x100.png', unread: 5, time: 'Mon' },
];

export default function MessagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline font-bold text-foreground">Messages</h1>
        <Button variant="ghost" size="icon">
          <MessageSquareText className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input type="text" placeholder="Search messages" className="pl-10 w-full" />
      </div>

      {mockMessages.length > 0 ? (
        <div className="space-y-4">
          {mockMessages.map((msg) => (
            <div key={msg.id} className="flex items-center p-3 bg-card hover:bg-accent/50 rounded-lg cursor-pointer transition-colors">
              <Avatar className="h-12 w-12 mr-4 border">
                <AvatarImage src={msg.avatarUrl} alt={msg.name} data-ai-hint="profile avatar" />
                <AvatarFallback>{msg.name.substring(0,1)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <h3 className="font-semibold text-foreground">{msg.name}</h3>
                <p className="text-sm text-muted-foreground truncate max-w-xs">{msg.lastMessage}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">{msg.time}</p>
                {msg.unread > 0 && (
                  <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                    {msg.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-10">
          <MessageSquareText className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>No messages yet.</p>
          <p className="text-sm">Start a conversation with other users!</p>
        </div>
      )}
    </div>
  );
}
