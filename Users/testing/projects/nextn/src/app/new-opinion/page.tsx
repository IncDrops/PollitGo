'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { ImageIcon as ImageIconLucide, Film, X, Loader2, UserCircle2, LogIn, AlertCircle, ThumbsUp, Link as LinkIconLucide, DollarSign, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import useAuth from '@/hooks/useAuth';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStripe } from '@stripe/react-stripe-js';

const MAX_IMAGES = 2;
const MAX_TEXT_LENGTH = 500;
const MAX_VIDEO_SIZE_MB = 100; // 100MB limit for a ~60s video

export default function NewOpinionPage() {
  const { toast } = useToast();
  const { user: currentUser, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const stripe = useStripe();

  const [text, setText] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  const [pledgeAmount, setPledgeAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [videoUrl, setVideoUrl] = useState<string | undefined>();
  const [videoFile, setVideoFile] = useState<File | undefined>();
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= MAX_TEXT_LENGTH) {
      setText(newText);
    }
  };

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newImageFiles = files.slice(0, MAX_IMAGES - imageFiles.length);
      const newImageUrls = newImageFiles.map(file => URL.createObjectURL(file));
      
      setImageFiles(prev => [...prev, ...newImageFiles]);
      setImageUrls(prev => [...prev, ...newImageUrls]);

      if (files.length + imageFiles.length > MAX_IMAGES) {
        toast({ title: "Max Images Reached", description: `You can only upload up to ${MAX_IMAGES} images.`, variant: "destructive" });
      }
      if (event.target) event.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => {
      const urlToRemove = prev[index];
      URL.revokeObjectURL(urlToRemove);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith('video/')) {
        toast({ title: "Invalid File Type", description: "Please select a video file.", variant: "destructive" });
        return;
      }
      if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) { 
        toast({ title: "File Too Large", description: `Video size should be less than ${MAX_VIDEO_SIZE_MB}MB.`, variant: "destructive" });
        return;
      }
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      if (event.target) event.target.value = '';
    }
  };

  const removeVideo = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoFile(undefined);
    setVideoUrl(undefined);
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

    const numericPledgeAmount = parseFloat(pledgeAmount);

    if (pledgeAmount && (isNaN(numericPledgeAmount) || numericPledgeAmount <= 0)) {
        toast({ title: "Invalid Pledge", description: "Pledge amount must be a positive number.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }

    if (numericPledgeAmount > 0 && !stripe) {
      toast({ 
        title: "Payment System Error", 
        description: "Stripe is not available for pledges. This could be due to a missing or invalid configuration. Please check console logs.", 
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
          description: `Your pledge of $${numericPledgeAmount.toFixed(2)} is being prepared. You'll be redirected to Stripe.`,
        });

        const response = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(numericPledgeAmount * 100),
            currency: 'usd',
            itemName: `Pledge for 2nd Opinion: ${text.substring(0, 50)}...`,
            metadata: { userId: currentUser.id, action: 'opinion_pledge', text: text.substring(0,100) } 
          }),
        });
        
        const sessionData = await response.json();
        if (response.ok && sessionData.id) {
          const result = await stripe.redirectToCheckout({ sessionId: sessionData.id });
          if (result.error) throw new Error(result.error.message || "Failed to redirect to Stripe.");
          return; 
        } else {
          throw new Error(sessionData.error || 'Failed to create Stripe session.');
        }
      } catch (error: any) {
        console.error("Stripe error:", error);
        toast({ title: "Pledge Failed", description: error.message || "Could not process pledge.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
    }

    console.log('Simulating 2nd Opinion submission. User:', currentUser?.email, 'Data:', {
      text,
      imageFiles,
      videoFile,
      affiliateLink,
      pledgeAmount: numericPledgeAmount || 0,
    });

    toast({
      title: `2nd Opinion Creation Simulated`,
      description: 'Post data logged to console. Backend integration is needed to save posts.',
    });

    setText('');
    setImageUrls([]);
    setImageFiles([]);
    setVideoUrl(undefined);
    setVideoFile(undefined);
    setAffiliateLink('');
    setPledgeAmount('');
    
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
  const isStripeNotReadyForPledge = parseFloat(pledgeAmount) > 0 && !stripe;

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

            <div className="space-y-2">
              <Label className="text-base font-semibold">Attach Media (Optional)</Label>
              <Alert variant="default" className="bg-accent/20">
                <AlertCircle className="h-4 w-4 !text-accent-foreground" />
                <AlertDescription className="text-accent-foreground/80">
                  You can add up to {MAX_IMAGES} images OR one video to your post.
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()} disabled={imageUrls.length >= MAX_IMAGES || !!videoUrl || formDisabled} className="rounded-md">
                    <ImageIconLucide className="mr-2 h-4 w-4" /> Add Images ({imageUrls.length}/{MAX_IMAGES})
                </Button>
                <input type="file" ref={imageInputRef} className="hidden" accept="image/*" multiple onChange={handleImageFileChange} disabled={imageUrls.length >= MAX_IMAGES || !!videoUrl || formDisabled}/>
                
                <Button type="button" variant="outline" onClick={() => videoInputRef.current?.click()} disabled={!!videoUrl || imageUrls.length > 0 || formDisabled} className="rounded-md">
                    <Film className="mr-2 h-4 w-4" /> {videoUrl ? 'Change Video' : `Add Video (Max ${MAX_VIDEO_SIZE_MB}MB)`}
                </Button>
                <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={handleVideoFileChange} disabled={!!videoUrl || imageUrls.length > 0 || formDisabled}/>
              </div>

              {imageUrls.length > 0 && (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square group">
                      <Image src={url} alt={`Post image ${index + 1}`} fill className="object-cover rounded-md" sizes="50vw" data-ai-hint="opinion visual" />
                      {!formDisabled && <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeImage(index)}> <X className="h-4 w-4" /></Button>}
                    </div>
                  ))}
                </div>
              )}
              {videoUrl && (
                <div className="mt-3 relative group">
                  <video src={videoUrl} controls className="w-full rounded-md max-h-60" data-ai-hint="opinion video" />
                  {!formDisabled && <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={removeVideo}> <X className="h-4 w-4" /></Button>}
                </div>
              )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="affiliate-link" className="text-base font-semibold">Affiliate Link (Optional)</Label>
                <div className="relative">
                    <LinkIconLucide className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="affiliate-link"
                        type="url"
                        value={affiliateLink}
                        onChange={(e) => setAffiliateLink(e.target.value)}
                        placeholder="https://example.com/product"
                        className="pl-8 rounded-md"
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            {isStripeNotReadyForPledge && (
              <Alert variant="destructive" className="my-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Stripe Payment System Error</AlertTitle>
                <AlertDescription>
                  The payment system (Stripe) is not available for pledges. This could be due to a missing or invalid 
                  Stripe Publishable Key. You can still create the post without a pledge.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3 pt-4 border-t">
              <Label htmlFor="pledgeAmount" className="text-base font-semibold flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-primary" /> Pre-Commitment Pledge (Optional)
              </Label>
              <Alert variant="default" className="bg-primary/10">
                  <Info className="h-4 w-4 !text-primary" />
                  <AlertDescription className="text-primary/80">
                  Boost your post! A pledge can be used to reward insightful comments or interactions. Minimum $1.00. Max pledge $1,000.
                  </AlertDescription>
              </Alert>
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
                disabled={formDisabled || isStripeNotReadyForPledge}
              />
            </div>
            
          </CardContent>
          <CardFooter className="border-t pt-6 flex flex-col items-center gap-4">
            <Button type="submit" className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-semibold" disabled={formDisabled}>
              {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              Poll it &amp; Go
            </Button>
            <p className="text-xs text-muted-foreground text-center px-4">
                Poll responsibly, PollitAgo nor its users are responsible for your ultimate decision.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
