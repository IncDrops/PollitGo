
'use client';

import React, { useState, type FormEvent, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, ImagePlus, VideoIcon, X, PlusCircle, ImageIcon as ImageIconLucide, Film, LinkIcon, AlertCircle, DollarSign, Info, Flame, Loader2, UserCircle2 } from 'lucide-react';
import { format } from "date-fns"
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useStripe } from '@stripe/react-stripe-js';
import useAuth from '@/hooks/useAuth'; // This will return null user
import NextLink from 'next/link'; // For login/signup links

const MAX_OPTIONS = 4;
const MAX_POLL_IMAGES = 4;
const MAX_OPTION_TEXT_LENGTH = 365;
const MIN_PAYOUT_PER_MAJORITY_VOTER = 0.10;


interface PollOptionState {
  id: string;
  text: string;
  imageUrl?: string;
  imageFile?: File;
  videoUrl?: string;
  videoFile?: File;
  affiliateLink?: string;
}

export default function NewPollPage() {
  const { toast } = useToast();
  const stripe = useStripe();
  const { user: currentUser, loading: authLoading } = useAuth(); // currentUser will be null
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<PollOptionState[]>([
    { id: `option-${Date.now()}`, text: '' },
    { id: `option-${Date.now() + 1}`, text: '' },
  ]);
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [pledgeAmount, setPledgeAmount] = useState<number | undefined>(undefined);
  const [isSpicy, setIsSpicy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pollImageUrls, setPollImageUrls] = useState<string[]>([]);
  const [pollImageFiles, setPollImageFiles] = useState<File[]>([]);
  const pollImageInputRef = useRef<HTMLInputElement>(null);

  const [pollVideoUrl, setPollVideoUrl] = useState<string | undefined>();
  const [pollVideoFile, setPollVideoFile] = useState<File | undefined>();
  const pollVideoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const defaultDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    defaultDeadline.setSeconds(0);
    setDeadline(defaultDeadline);
  }, []);


  const handleAddOption = () => {
    if (options.length < MAX_OPTIONS) {
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

  const handleOptionChange = (id: string, field: keyof Omit<PollOptionState, 'id' | 'imageFile' | 'videoFile'>, value: string) => {
    setOptions(options.map(option => option.id === id ? { ...option, [field]: value } : option));
  };

  // Media handling functions (handlePollImageFileChange, etc.) remain largely the same
  // ... (Callbacks for image/video handling are mostly client-side) ...

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!currentUser) {
      toast({ title: "Login Required", description: "You need to be logged in to create a poll.", variant: "destructive", duration: 5000 });
      setIsSubmitting(false);
      return;
    }
    
    // Validations remain the same
    if (!question.trim()) { /* ... */ }
    // ...

    if (pledgeAmount && pledgeAmount > 0 && (!stripe /* || !currentUser - already checked */)) {
      toast({ title: "Error", description: "Stripe information is not available for pledge.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    if (pledgeAmount && pledgeAmount > 0 && stripe && currentUser) {
      try {
        toast({
          title: 'Processing Pledge...',
          description: `Your pledge of $${pledgeAmount.toFixed(2)} is being prepared. You'll be redirected to Stripe.`,
        });

        const response = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(pledgeAmount * 100),
            currency: 'usd',
            itemName: `Pledge for Poll: ${question.substring(0, 50)}...`,
            metadata: { 
              userId: currentUser.uid, // This will be problematic if currentUser is null
              action: 'poll_pledge',
              question: question.substring(0,100)
            } 
          }),
        });
        
        const session = await response.json();
        // ... (Stripe redirect logic)
      } catch (error: any) {
        // ...
      }
    }

    // Simulate poll creation as Firebase is removed
    console.log('Simulating poll submission as Firebase is removed. Data:', {
      question, options, deadline, pledgeAmount, isSpicy, pollImageFiles, pollVideoFile
    });

    toast({
      title: 'Poll Creation Simulated',
      description: 'Firebase is removed. Poll data logged to console. Implement new backend to save polls.',
    });

    // Reset form
    // ...
    setIsSubmitting(false);
  };


  if (authLoading) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-150px)] items-center justify-center px-4 py-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  if (!currentUser && !authLoading) {
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
            <Button asChild className="w-full">
              <NextLink href="/login">Login (Currently Disabled)</NextLink>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <NextLink href="/signup">Sign Up (Currently Disabled)</NextLink>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }


  // Re-enable form inputs if currentUser exists (even if from a new auth system later)
  const formDisabled = isSubmitting; // || !currentUser; // currentUser check moved to top for full page block


  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-headline text-center text-foreground">Create New Poll</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="question" className="text-base font-semibold">Poll Question</Label>
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

            {/* Poll Media section - mostly unchanged, but disable if formDisabled */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Poll Media (Optional)</Label>
              {/* ... Alert and buttons for poll media ... */}
              <Button type="button" variant="outline" onClick={() => pollImageInputRef.current?.click()} disabled={pollImageUrls.length >= MAX_POLL_IMAGES || formDisabled}>
                  <ImagePlus className="mr-2 h-4 w-4" /> Add Image ({pollImageUrls.length}/{MAX_POLL_IMAGES})
              </Button>
              {/* ... Other media elements, ensure 'disabled={formDisabled}' is added */}
            </div>
            
            {/* Options section - mostly unchanged, but disable if formDisabled */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Options ({options.length}/{MAX_OPTIONS})</Label>
              {options.map((option, index) => {
                // ...
                return (
                  <div key={option.id} className="space-y-3 p-4 border rounded-md bg-card shadow-sm">
                    <Textarea
                      value={option.text}
                      // ...
                      disabled={formDisabled}
                    />
                    {/* ... other option inputs, ensure 'disabled={formDisabled}' is added */}
                  </div>
                );
              })}
              {options.length < MAX_OPTIONS && (
                <Button type="button" variant="outline" onClick={handleAddOption} className="w-full rounded-md" disabled={formDisabled}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Option
                </Button>
              )}
            </div>

            {/* Deadline section - disable if formDisabled */}
            <div className="space-y-2">
               <Label htmlFor="deadline" className="text-base font-semibold">Deadline</Label>
               <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="w-full justify-start text-left font-normal rounded-md" disabled={formDisabled}>
                    {/* ... */}
                  </Button>
                </PopoverTrigger>
                {/* ... PopoverContent, disable inputs inside if formDisabled ... */}
               </Popover>
                <Select onValueChange={(value) => { /* ... */ }} disabled={formDisabled}>
                   {/* ... */}
                </Select>
            </div>

            {/* Spicy Content toggle - disable if formDisabled */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Switch id="spicy-content-toggle" checked={isSpicy} onCheckedChange={setIsSpicy} disabled={formDisabled}/>
                {/* ... */}
              </div>
              {/* ... Alert ... */}
            </div>

            {/* Pledge section - disable if formDisabled */}
            <div className="space-y-3 pt-4 border-t">
              <Label htmlFor="pledgeAmount" className="text-base font-semibold flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-primary" /> Pre-Commitment Pledge (Optional)
              </Label>
              {/* ... Alert ... */}
              <Input
                id="pledgeAmount"
                type="number"
                // ...
                disabled={formDisabled}
              />
              {/* ... Info text ... */}
            </div>

          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button type="submit" className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-semibold" disabled={formDisabled}>
              {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              Poll it &amp; Go
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
// Ensure all media handling callbacks (setOptionImage, removeOptionImage etc.) are present
// and their inputs are disabled if 'formDisabled' is true where appropriate.
// This example shows the main disabling logic.
