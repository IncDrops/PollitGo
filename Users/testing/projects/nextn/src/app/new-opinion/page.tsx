
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Loader2, UserCircle2, LogIn, ThumbsUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Label } from '@/components/ui/label';

const MAX_TEXT_LENGTH = 500;

export default function NewOpinionPage() {
  const { toast } = useToast();
  const { user: currentUser, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= MAX_TEXT_LENGTH) {
      setText(newText);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!isAuthenticated || !currentUser) {
      toast({ title: "Login Required", description: "You need to be logged in to post.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    if (!text.trim()) {
      toast({ title: "Text Required", description: `Please enter your thoughts.`, variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    console.log('Simulating 2nd Opinion submission. User:', currentUser?.email, 'Data:', { text });

    toast({
      title: `2nd Opinion Creation Simulated`,
      description: 'Post data logged to console. Backend integration is needed to save posts.',
    });

    setText('');
    setIsSubmitting(false);
    router.push('/');
  };

  if (authLoading) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-150px)] items-center justify-center px-4 py-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardHeader>
            <UserCircle2 className="mx-auto h-16 w-16 text-primary mb-4" />
            <CardTitle className="text-2xl">Login Required</CardTitle>
            <CardDescription>You need to be logged in to create a 2nd Opinion.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Please log in or sign up to continue.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button onClick={() => signIn()} className="w-full">
                <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
            <Button variant="outline" asChild className="w-full">
              <NextLink href="/signup">Sign Up</NextLink>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const formDisabled = isSubmitting;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-headline text-center text-foreground flex items-center justify-center">
            <ThumbsUp className="mr-3 h-6 w-6 text-primary" />
            Post a 2nd Opinion
          </CardTitle>
          <CardDescription className="text-center">Share your thoughts, ask for advice, or start a discussion.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            
            <div className="space-y-2">
              <Label htmlFor="opinion-text" className="text-base font-semibold">
                Your Thoughts
              </Label>
              <Textarea
                id="opinion-text"
                value={text}
                onChange={handleTextChange}
                placeholder="What's on your mind? Ask a question, share a story..."
                required
                className="min-h-[150px] text-base rounded-md"
                disabled={formDisabled}
                maxLength={MAX_TEXT_LENGTH}
              />
              <div className="text-right text-sm text-muted-foreground">
                {text.length} / {MAX_TEXT_LENGTH}
              </div>
            </div>

          </CardContent>
          <CardFooter className="border-t pt-6 flex flex-col items-center gap-4">
            <Button type="submit" className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-semibold" disabled={formDisabled}>
              {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              Submit Opinion
            </Button>
            <p className="text-xs text-muted-foreground text-center px-4">
                Poll responsibly, PollitAGo nor its users are responsible for your ultimate decision.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
