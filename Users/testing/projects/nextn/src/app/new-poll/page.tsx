
'use client';

import React, { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { X, PlusCircle, Loader2, UserCircle2, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const MAX_POLL_OPTIONS = 4;
const MAX_OPTION_TEXT_LENGTH = 365;

interface PollOptionState {
  id: string;
  text: string;
}

export default function NewPollPage() {
  const { toast } = useToast();
  const { user: currentUser, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<PollOptionState[]>([
    { id: `option-${Date.now()}`, text: '' },
    { id: `option-${Date.now() + 1}`, text: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddOption = () => {
    if (options.length < MAX_POLL_OPTIONS) {
      setOptions([...options, { id: `option-${Date.now()}`, text: '' }]);
    }
  };

  const handleRemoveOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(option => option.id !== id));
    } else {
      toast({
        title: "Minimum Options",
        description: "A poll must have at least two options.",
        variant: "destructive",
      });
    }
  };

  const handleOptionChange = (id: string, value: string) => {
    let processedValue = value;
    if (value.length > MAX_OPTION_TEXT_LENGTH) {
      processedValue = value.substring(0, MAX_OPTION_TEXT_LENGTH);
      toast({
        title: "Character Limit Reached",
        description: `Option text cannot exceed ${MAX_OPTION_TEXT_LENGTH} characters.`,
        variant: "destructive",
      });
    }
    setOptions(options.map(option => option.id === id ? { ...option, text: processedValue } : option));
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!isAuthenticated || !currentUser) {
      toast({ title: "Login Required", description: "You need to be logged in to create a poll.", variant: "destructive", duration: 5000 });
      setIsSubmitting(false);
      return;
    }

    if (!question.trim()) {
      toast({ title: "Question Required", description: `Please enter the main question for your poll.`, variant: "destructive" });
      setIsSubmitting(false);
      return;
    }
    if (options.some(opt => !opt.text.trim())) {
      toast({ title: "Option Text Required", description: "All poll options must have text.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }
    
    console.log('Simulating poll submission. User:', currentUser?.email, 'Data:', { question, options });

    toast({
      title: `Poll Creation Simulated`,
      description: 'Post data logged to console. Implement backend to save polls.',
    });

    // Reset form fields
    setQuestion('');
    setOptions([{ id: `option-${Date.now()}`, text: '' }, { id: `option-${Date.now() + 1}`, text: '' }]);
    
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
            <CardDescription>You need to be logged in to create a new poll.</CardDescription>
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
          <CardTitle className="text-2xl font-headline text-center text-foreground">Create New Poll</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="question" className="text-base font-semibold">
                Poll Question
              </Label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What do you want to ask?"
                required
                className="min-h-[100px] text-base rounded-md"
                disabled={formDisabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-base font-semibold">Options ({options.length}/{MAX_POLL_OPTIONS})</Label>
              {options.map((option, index) => (
                <div key={option.id} className="space-y-3 p-4 border rounded-md bg-card shadow-sm">
                  <div className="flex items-center justify-between">
                      <Label htmlFor={`option-text-${option.id}`} className="font-medium">Option {index + 1}</Label>
                      {options.length > 2 && <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveOption(option.id)} className="h-7 w-7 text-destructive hover:bg-destructive/10" disabled={formDisabled}><X className="h-4 w-4" /></Button>}
                  </div>
                  <Textarea
                    id={`option-text-${option.id}`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    placeholder={`Enter text for option ${index + 1}`}
                    required
                    className="rounded-md"
                    disabled={formDisabled}
                    maxLength={MAX_OPTION_TEXT_LENGTH}
                  />
                    <div className="text-xs text-muted-foreground text-right">
                      {option.text.length}/{MAX_OPTION_TEXT_LENGTH}
                  </div>
                </div>
              ))}
              {options.length < MAX_POLL_OPTIONS && (
                <Button type="button" variant="outline" onClick={handleAddOption} className="w-full rounded-md" disabled={formDisabled}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Option
                </Button>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 flex flex-col items-center gap-4">
            <Button type="submit" className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-semibold" disabled={formDisabled}>
              {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              Create Poll
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
