
'use client';

import React, { useState, type FormEvent, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, ImagePlus, VideoIcon, X, PlusCircle, ImageIcon as ImageIconLucide, Film, Link as LinkIconLucide, AlertCircle, DollarSign, Info, Flame, Loader2, UserCircle2, LogIn } from 'lucide-react';
import { format } from "date-fns"
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useStripe } from '@stripe/react-stripe-js';
import useAuth from '@/hooks/useAuth';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { cn } from '@/lib/utils';

const MAX_OPTIONS = 4;
const MAX_POLL_IMAGES = 4;
const MAX_OPTION_TEXT_LENGTH = 365;

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
  const { user: currentUser, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<PollOptionState[]>([
    { id: `option-${Date.now()}`, text: '' },
    { id: `option-${Date.now() + 1}`, text: '' },
  ]);
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [pledgeAmount, setPledgeAmount] = useState<string>('');
  const [isSpicy, setIsSpicy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pollImageUrls, setPollImageUrls] = useState<string[]>([]);
  const [pollImageFiles, setPollImageFiles] = useState<File[]>([]);
  const pollImageInputRef = useRef<HTMLInputElement>(null);

  const [pollVideoUrl, setPollVideoUrl] = useState<string | undefined>();
  const [pollVideoFile, setPollVideoFile] = useState<File | undefined>();
  const pollVideoInputRef = useRef<HTMLInputElement>(null);
  
  const [isStripeChecked, setIsStripeChecked] = useState(false);

  useEffect(() => {
    const defaultDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    defaultDeadline.setSeconds(0);
    setDeadline(defaultDeadline);
  }, []);

  useEffect(() => {
    if (!authLoading && stripe !== undefined) {
      setIsStripeChecked(true);
    }
  }, [stripe, authLoading]);


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
    let processedValue = value;
    if (field === 'text' && value.length > MAX_OPTION_TEXT_LENGTH) {
      processedValue = value.substring(0, MAX_OPTION_TEXT_LENGTH);
      toast({
        title: "Character Limit Reached",
        description: `Option text cannot exceed ${MAX_OPTION_TEXT_LENGTH} characters.`,
        variant: "destructive",
      });
    }
    setOptions(options.map(option => option.id === id ? { ...option, [field]: processedValue } : option));
  };

  const handlePollImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newImageFiles = files.slice(0, MAX_POLL_IMAGES - pollImageFiles.length);
      const newImageUrls = newImageFiles.map(file => URL.createObjectURL(file));
      
      setPollImageFiles(prev => [...prev, ...newImageFiles]);
      setPollImageUrls(prev => [...prev, ...newImageUrls]);

      if (files.length + pollImageFiles.length > MAX_POLL_IMAGES) {
        toast({ title: "Max Images Reached", description: `You can only upload up to ${MAX_POLL_IMAGES} images for the poll.`, variant: "destructive" });
      }
      if (event.target) event.target.value = '';
    }
  };

  const removePollImage = (index: number) => {
    setPollImageFiles(prev => prev.filter((_, i) => i !== index));
    setPollImageUrls(prev => {
      const urlToRemove = prev[index];
      URL.revokeObjectURL(urlToRemove);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handlePollVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith('video/')) {
        toast({ title: "Invalid File Type", description: "Please select a video file.", variant: "destructive" });
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast({ title: "File Too Large", description: "Video size should be less than 50MB.", variant: "destructive" });
        return;
      }
      if (pollVideoUrl) URL.revokeObjectURL(pollVideoUrl);
      setPollVideoFile(file);
      setPollVideoUrl(URL.createObjectURL(file));
      if (event.target) event.target.value = '';
    }
  };

  const removePollVideo = () => {
    if (pollVideoUrl) URL.revokeObjectURL(pollVideoUrl);
    setPollVideoFile(undefined);
    setPollVideoUrl(undefined);
  };

  const handleOptionMediaChange = (optionId: string, type: 'image' | 'video', event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const newOptions = options.map(opt => {
        if (opt.id === optionId) {
          if (type === 'image') {
            if (opt.imageUrl) URL.revokeObjectURL(opt.imageUrl);
            return { ...opt, imageFile: file, imageUrl: URL.createObjectURL(file), videoFile: undefined, videoUrl: undefined };
          } else {
            if (opt.videoUrl) URL.revokeObjectURL(opt.videoUrl);
            return { ...opt, videoFile: file, videoUrl: URL.createObjectURL(file), imageFile: undefined, imageUrl: undefined };
          }
        }
        return opt;
      });
      setOptions(newOptions);
      if (event.target) event.target.value = '';
    }
  };

  const removeOptionMedia = (optionId: string, type: 'image' | 'video') => {
    const newOptions = options.map(opt => {
      if (opt.id === optionId) {
        if (type === 'image' && opt.imageUrl) {
          URL.revokeObjectURL(opt.imageUrl);
          return { ...opt, imageFile: undefined, imageUrl: undefined };
        }
        if (type === 'video' && opt.videoUrl) {
          URL.revokeObjectURL(opt.videoUrl);
          return { ...opt, videoFile: undefined, videoUrl: undefined };
        }
      }
      return opt;
    });
    setOptions(newOptions);
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
      toast({ title: "Question Required", description: "Please enter a poll question.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }
    if (options.some(opt => !opt.text.trim())) {
      toast({ title: "Option Text Required", description: "All options must have text.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }
    if (!deadline) {
      toast({ title: "Deadline Required", description: "Please set a deadline for the poll.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    const numericPledgeAmount = parseFloat(pledgeAmount);

    if (pledgeAmount && (isNaN(numericPledgeAmount) || numericPledgeAmount <= 0)) {
        toast({ title: "Invalid Pledge", description: "Pledge amount must be a positive number.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }

    if (numericPledgeAmount > 0 && !stripe) {
      toast({ 
        title: "Payment System Error", 
        description: "The payment system is not available. You cannot make a pledge at this time.", 
        variant: "destructive",
        duration: 7000
      });
      setIsSubmitting(false);
      return;
    }

    if (numericPledgeAmount > 0 && stripe && currentUser) {
      try {
        toast({
          title: 'Processing Pledge...',
          description: `Your pledge of $${numericPledgeAmount.toFixed(2)} is being prepared.`,
        });

        const response = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(numericPledgeAmount * 100),
            currency: 'usd',
            itemName: `Pledge for Poll: ${question.substring(0, 50)}...`,
            metadata: { userId: currentUser.id, action: 'poll_pledge', question: question.substring(0,100) } 
          }),
        });
        
        const session = await response.json();
        if (response.ok && session.id) {
          const result = await stripe.redirectToCheckout({ sessionId: session.id });
          if (result.error) throw new Error(result.error.message);
          return; 
        } else {
          throw new Error(session.error || 'Failed to create Stripe session.');
        }
      } catch (error: any) {
        console.error("Stripe error:", error);
        toast({ title: "Pledge Failed", description: error.message || "Could not process pledge.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
    }

    console.log('Simulating poll submission:', {
      question, options, deadline, pledgeAmount: numericPledgeAmount || 0, isSpicy, pollImageFiles, pollVideoFile
    });

    toast({
      title: 'Poll Submitted (Simulated)',
      description: 'Your poll data was logged to the console. Implement backend to save it.',
    });

    // Reset form
    setQuestion('');
    setOptions([{ id: `option-${Date.now()}`, text: '' }, { id: `option-${Date.now() + 1}`, text: '' }]);
    setDeadline(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    setPledgeAmount('');
    setIsSpicy(false);
    setPollImageUrls([]);
    setPollImageFiles([]);
    setPollVideoUrl(undefined);
    setPollVideoFile(undefined);
    options.forEach(opt => {
      if(opt.imageUrl) URL.revokeObjectURL(opt.imageUrl);
      if(opt.videoUrl) URL.revokeObjectURL(opt.videoUrl);
    });
    
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
  const showStripeNotReadyAlert = isStripeChecked && parseFloat(pledgeAmount) > 0 && !stripe;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-headline text-center text-foreground">Create New Poll</CardTitle>
          <CardDescription className="text-center">Ask a question and let the community vote.</CardDescription>
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

            <div className="space-y-2">
              <Label className="text-base font-semibold">Poll Media (Optional)</Label>
              <Alert variant="default" className="bg-accent/20">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-accent-foreground/80">
                  You can add up to {MAX_POLL_IMAGES} images OR one video for the entire poll. Options can also have individual media.
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button type="button" variant="outline" onClick={() => pollImageInputRef.current?.click()} disabled={pollImageUrls.length >= MAX_POLL_IMAGES || !!pollVideoUrl || formDisabled} className="rounded-md">
                    <ImageIconLucide className="mr-2 h-4 w-4" /> Add Images ({pollImageUrls.length}/{MAX_POLL_IMAGES})
                </Button>
                <input type="file" ref={pollImageInputRef} className="hidden" accept="image/*" multiple onChange={handlePollImageFileChange} disabled={pollImageUrls.length >= MAX_POLL_IMAGES || !!pollVideoUrl || formDisabled}/>
                
                <Button type="button" variant="outline" onClick={() => pollVideoInputRef.current?.click()} disabled={pollImageUrls.length > 0 || !!pollVideoUrl || formDisabled} className="rounded-md">
                    <Film className="mr-2 h-4 w-4" /> {pollVideoUrl ? 'Change Video' : 'Add Video'}
                </Button>
                <input type="file" ref={pollVideoInputRef} className="hidden" accept="video/*" onChange={handlePollVideoFileChange} disabled={pollImageUrls.length > 0 || formDisabled}/>
              </div>

              {pollImageUrls.length > 0 && (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {pollImageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square group">
                      <Image src={url} alt={`Poll image ${index + 1}`} fill sizes="25vw" className="rounded-md object-cover" data-ai-hint="poll visual" />
                      {!formDisabled && <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removePollImage(index)}> <X className="h-4 w-4" /></Button>}
                    </div>
                  ))}
                </div>
              )}
              {pollVideoUrl && (
                <div className="mt-3 relative group">
                  <video src={pollVideoUrl} controls className="w-full rounded-md max-h-60" data-ai-hint="poll video" />
                  {!formDisabled && <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={removePollVideo}> <X className="h-4 w-4" /></Button>}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label className="text-base font-semibold">Options ({options.length}/{MAX_OPTIONS})</Label>
              {options.map((option, index) => {
                const optionImageInputId = `option-image-${option.id}`;
                const optionVideoInputId = `option-video-${option.id}`;
                return (
                  <div key={option.id} className="space-y-3 p-4 border rounded-md bg-card shadow-sm">
                    <div className="flex items-center justify-between">
                        <Label htmlFor={`option-text-${option.id}`} className="font-medium">Option {index + 1}</Label>
                        {options.length > 2 && <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveOption(option.id)} className="h-7 w-7 text-destructive hover:bg-destructive/10" disabled={formDisabled}><X className="h-4 w-4" /></Button>}
                    </div>
                    <Textarea
                      id={`option-text-${option.id}`}
                      value={option.text}
                      onChange={(e) => handleOptionChange(option.id, 'text', e.target.value)}
                      placeholder={`Enter text for option ${index + 1}`}
                      required
                      className="rounded-md"
                      disabled={formDisabled}
                      maxLength={MAX_OPTION_TEXT_LENGTH}
                    />
                     <div className="text-xs text-muted-foreground text-right">
                        {option.text.length}/{MAX_OPTION_TEXT_LENGTH}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById(optionImageInputId)?.click()} disabled={!!option.videoUrl || formDisabled} className="rounded-md">
                            <ImageIconLucide className="mr-2 h-4 w-4" /> {option.imageUrl ? 'Change Image' : 'Add Image'}
                        </Button>
                        <input type="file" id={optionImageInputId} className="hidden" accept="image/*" onChange={(e) => handleOptionMediaChange(option.id, 'image', e)} disabled={!!option.videoUrl || formDisabled}/>
                        
                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById(optionVideoInputId)?.click()} disabled={!!option.imageUrl || formDisabled} className="rounded-md">
                            <Film className="mr-2 h-4 w-4" /> {option.videoUrl ? 'Change Video' : 'Add Video'}
                        </Button>
                        <input type="file" id={optionVideoInputId} className="hidden" accept="video/*" onChange={(e) => handleOptionMediaChange(option.id, 'video', e)} disabled={!!option.imageUrl || formDisabled}/>
                    </div>

                    {option.imageUrl && (
                        <div className="relative w-full h-32 group mt-2">
                            <Image src={option.imageUrl} alt={`Option image`} fill sizes="50vw" className="object-cover rounded-md" data-ai-hint="option visual"/>
                            {!formDisabled && <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeOptionMedia(option.id, 'image')}> <X className="h-4 w-4" /></Button>}
                        </div>
                    )}
                    {option.videoUrl && (
                         <div className="relative w-full mt-2 group">
                            <video src={option.videoUrl} controls className="w-full rounded-md max-h-40" data-ai-hint="option video"/>
                           {!formDisabled && <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeOptionMedia(option.id, 'video')}> <X className="h-4 w-4" /></Button>}
                        </div>
                    )}
                    <div>
                        <Label htmlFor={`option-affiliate-${option.id}`} className="text-xs font-medium">Affiliate Link (Optional)</Label>
                         <div className="relative">
                            <LinkIconLucide className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                            id={`option-affiliate-${option.id}`}
                            type="url"
                            value={option.affiliateLink || ''}
                            onChange={(e) => handleOptionChange(option.id, 'affiliateLink', e.target.value)}
                            placeholder="https://example.com/product"
                            className="pl-8 rounded-md"
                            disabled={formDisabled}
                            />
                        </div>
                    </div>
                  </div>
                );
              })}
              {options.length < MAX_OPTIONS && (
                <Button type="button" variant="outline" onClick={handleAddOption} className="w-full rounded-md" disabled={formDisabled}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Option
                </Button>
              )}
            </div>

            <div className="space-y-2">
               <Label htmlFor="deadline" className="text-base font-semibold">Deadline</Label>
               <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="w-full justify-start text-left font-normal rounded-md" disabled={formDisabled}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP HH:mm") : <span>Pick a date & time</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    initialFocus
                    disabled={formDisabled || ((date) => date < new Date(new Date().setDate(new Date().getDate() -1)))}
                  />
                  <div className="p-3 border-t border-border">
                    <Label htmlFor="deadline-time">Time</Label>
                    <Input 
                      type="time" 
                      id="deadline-time"
                      defaultValue={deadline ? format(deadline, "HH:mm") : "00:00"}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':').map(Number);
                        setDeadline(prev => {
                          const newDate = prev ? new Date(prev) : new Date();
                          newDate.setHours(hours, minutes, 0, 0);
                          return newDate;
                        });
                      }}
                      disabled={formDisabled}
                      className="rounded-md"
                    />
                  </div>
                </PopoverContent>
               </Popover>
               <Select 
                 onValueChange={(value) => {
                   const now = new Date();
                   let newDeadline = new Date(now);
                   if (value === "1h") newDeadline.setHours(now.getHours() + 1);
                   else if (value === "6h") newDeadline.setHours(now.getHours() + 6);
                   else if (value === "1d") newDeadline.setDate(now.getDate() + 1);
                   else if (value === "7d") newDeadline.setDate(now.getDate() + 7);
                   else if (value === "custom" && deadline) return;
                   else newDeadline.setDate(now.getDate() + 7);
                   newDeadline.setSeconds(0,0);
                   setDeadline(newDeadline);
                 }} 
                 disabled={formDisabled}
                >
                <SelectTrigger className="w-full rounded-md">
                  <SelectValue placeholder="Quick Set Deadline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="6h">6 Hours</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="custom">Custom (Use Calendar)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Switch id="spicy-content-toggle" checked={isSpicy} onCheckedChange={setIsSpicy} disabled={formDisabled}/>
                <Label htmlFor="spicy-content-toggle" className="flex items-center font-semibold">
                  <Flame className="mr-2 h-5 w-5 text-orange-500" /> Spicy Content (18+)
                </Label>
              </div>
              <Alert variant={isSpicy ? "destructive" : "default"}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{isSpicy ? "Heads Up!" : "Content Note"}</AlertTitle>
                <AlertDescription>
                  {isSpicy 
                    ? "Spicy polls are subject to stricter content moderation. Ensure compliance with community guidelines."
                    : "Mark this if your poll contains mature themes or sensitive topics."
                  }
                </AlertDescription>
              </Alert>
            </div>
            
            {showStripeNotReadyAlert && (
              <Alert variant="destructive" className="my-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Stripe Payment System Error</AlertTitle>
                <AlertDescription>
                  Pledges are unavailable because the payment system is not configured correctly. You can still create the poll without a pledge.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3 pt-4 border-t">
              <Label htmlFor="pledgeAmount" className="text-base font-semibold flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-primary" /> Pre-Commitment Pledge (Optional)
              </Label>
              <Input
                id="pledgeAmount"
                type="number"
                value={pledgeAmount}
                onChange={(e) => setPledgeAmount(e.target.value)}
                placeholder="e.g., 5.00 for $5.00 (min $1.00)"
                min="1"
                max="1000"
                step="0.01"
                className="rounded-md"
                disabled={formDisabled || showStripeNotReadyAlert}
              />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 flex flex-col space-y-4">
            <Button type="submit" className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-semibold" disabled={formDisabled}>
              {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              Poll it &amp; Go
            </Button>
            <p className="text-xs text-muted-foreground text-center px-4">
            <p className="text-xs text-muted-foreground mt-4 text-center">Poll Responsibly, only you are liable for your ultimate decision.</p>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
