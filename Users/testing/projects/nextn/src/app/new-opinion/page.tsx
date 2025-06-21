
'use client';

import React, { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ImagePlus, VideoIcon, X, Link as LinkIconLucide, AlertCircle, DollarSign, Info, Loader2, UserCircle2, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useStripe } from '@stripe/react-stripe-js';
import useAuth from '@/hooks/useAuth';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const MAX_OPINION_IMAGES = 2;
const MAX_OPINION_TEXT_LENGTH = 500;

export default function NewOpinionPage() {
  const { toast } = useToast();
  const stripe = useStripe();
  const { user: currentUser, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [opinionText, setOpinionText] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  const [pledgeAmount, setPledgeAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [videoUrl, setVideoUrl] = useState<string | undefined>();
  const [videoFile, setVideoFile] = useState<File | undefined>();
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const [isStripeChecked, setIsStripeChecked] = useState(false);

  useEffect(() => {
    if (!authLoading && stripe !== undefined) {
      setIsStripeChecked(true);
    }
  }, [stripe, authLoading]);

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newImageFiles = files.slice(0, MAX_OPINION_IMAGES - imageFiles.length);
      const newImageUrls = newImageFiles.map(file => URL.createObjectURL(file));
      
      setImageFiles(prev => [...prev, ...newImageFiles]);
      setImageUrls(prev => [...prev, ...newImageUrls]);

      if (files.length + imageFiles.length > MAX_OPINION_IMAGES) {
        toast({ title: "Max Images Reached", description: `You can only upload up to ${MAX_OPINION_IMAGES} images.`, variant: "destructive" });
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
      if (file.size > 60 * 1024 * 1024) { // 60s video approx 60MB
        toast({ title: "File Too Large", description: "Video size should be less than 60MB.", variant: "destructive" });
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!isAuthenticated || !currentUser) {
      toast({ title: "Login Required", description: "You need to be logged in to post an opinion.", variant: "destructive", duration: 5000 });
      setIsSubmitting(false);
      return;
    }

    if (!opinionText.trim()) {
      toast({ title: "Opinion Required", description: "Please enter your opinion.", variant: "destructive" });
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
            itemName: `Pledge for 2nd Opinion: ${opinionText.substring(0, 50)}...`,
            metadata: { userId: currentUser.id, action: 'opinion_pledge', opinion: opinionText.substring(0,100) } 
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

    console.log('Simulating opinion submission:', {
      opinionText, affiliateLink, pledgeAmount: numericPledgeAmount || 0, imageFiles, videoFile
    });

    toast({
      title: '2nd Opinion Submitted (Simulated)',
      description: 'Your post data was logged to the console. Implement backend to save it.',
    });

    // Reset form
    setOpinionText('');
    setAffiliateLink('');
    setPledgeAmount('');
    setImageUrls([]);
    setImageFiles([]);
    setVideoUrl(undefined);
    setVideoFile(undefined);
    imageUrls.forEach(url => URL.revokeObjectURL(url));
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    
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
            <CardDescription>You need to be logged in to post a 2nd Opinion.</CardDescription>
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
          <CardTitle className="text-2xl font-headline text-center text-foreground">Post a 2nd Opinion</CardTitle>
          <CardDescription className="text-center">Share your situation and let the community guide you. 500 characters max.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="opinion-text" className="text-base font-semibold">Your Situation</Label>
              <Textarea
                id="opinion-text"
                value={opinionText}
                onChange={(e) => setOpinionText(e.target.value)}
                placeholder="What's on your mind?"
                required
                maxLength={MAX_OPINION_TEXT_LENGTH}
                className="min-h-[120px] text-base rounded-md"
                disabled={formDisabled}
              />
              <div className="text-xs text-muted-foreground text-right">
                {opinionText.length}/{MAX_OPINION_TEXT_LENGTH}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold">Supporting Media (Optional)</Label>
              <Alert variant="default" className="bg-accent/20">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-accent-foreground/80">
                  Add up to {MAX_OPINION_IMAGES} images OR one video (max 60 seconds) to provide context.
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()} disabled={imageUrls.length >= MAX_OPINION_IMAGES || !!videoUrl || formDisabled}>
                  <ImagePlus className="mr-2 h-4 w-4" /> Add Images ({imageUrls.length}/{MAX_OPINION_IMAGES})
                </Button>
                <input type="file" ref={imageInputRef} className="hidden" accept="image/*" multiple onChange={handleImageFileChange} disabled={imageUrls.length >= MAX_OPINION_IMAGES || !!videoUrl || formDisabled}/>
                
                <Button type="button" variant="outline" onClick={() => videoInputRef.current?.click()} disabled={imageUrls.length > 0 || !!videoUrl || formDisabled}>
                  <VideoIcon className="mr-2 h-4 w-4" /> {videoUrl ? 'Change Video' : 'Add Video'}
                </Button>
                <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={handleVideoFileChange} disabled={imageUrls.length > 0 || formDisabled}/>
              </div>

              {imageUrls.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-video group">
                      <Image src={url} alt={`Opinion image ${index + 1}`} fill sizes="50vw" className="rounded-md object-cover" data-ai-hint="opinion visual" />
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
                  placeholder="https://example.com/product-link"
                  className="pl-8 rounded-md"
                  disabled={formDisabled}
                />
              </div>
            </div>

            {showStripeNotReadyAlert && (
              <Alert variant="destructive" className="my-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Stripe Payment System Error</AlertTitle>
                <AlertDescription>
                  Pledges are unavailable because the payment system is not configured correctly. You can still post without a pledge.
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
