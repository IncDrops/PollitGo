
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
import { CalendarIcon, ImagePlus, VideoIcon, X, PlusCircle, ImageIcon as ImageIconLucide, Film, LinkIcon, AlertCircle, DollarSign, Info, Flame } from 'lucide-react';
import { format } from "date-fns"
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MAX_OPTIONS = 4;
const MAX_POLL_IMAGES = 4;
const MAX_OPTION_TEXT_LENGTH = 365;
const MIN_PAYOUT_PER_MAJORITY_VOTER = 0.10;
const CREATOR_PLEDGE_SHARE_FOR_VOTERS = 0.50;

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
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<PollOptionState[]>([
    { id: `option-${Date.now()}`, text: '' },
    { id: `option-${Date.now() + 1}`, text: '' },
  ]);
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [pledgeAmount, setPledgeAmount] = useState<number | undefined>(undefined);
  const [isSpicy, setIsSpicy] = useState(false);

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

  const handlePollImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newImageFiles = files.slice(0, MAX_POLL_IMAGES - pollImageFiles.length);

      if (pollImageFiles.length + newImageFiles.length > MAX_POLL_IMAGES) {
        toast({
          title: "Image Limit Exceeded",
          description: `You can only upload up to ${MAX_POLL_IMAGES} images for the poll.`,
          variant: "destructive",
        });
      }

      setPollImageFiles(prev => [...prev, ...newImageFiles]);
      const newImageUrls = newImageFiles.map(file => URL.createObjectURL(file));
      setPollImageUrls(prev => [...prev, ...newImageUrls]);
    }
  };

  const handleRemovePollImage = useCallback((indexToRemove: number) => {
    setPollImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    setPollImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    if (pollImageInputRef.current) {
      pollImageInputRef.current.value = "";
    }
  }, []);

  const handlePollVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 60 * 1024 * 1024) {
         toast({ title: "Video Too Large", description: "Video file should be less than 60MB.", variant: "destructive" });
         if (pollVideoInputRef.current) pollVideoInputRef.current.value = "";
         return;
      }
      setPollVideoFile(file);
      setPollVideoUrl(URL.createObjectURL(file));
    }
  };

  const handleRemovePollVideo = useCallback(() => {
    setPollVideoUrl(undefined);
    setPollVideoFile(undefined);
    if (pollVideoInputRef.current) {
      pollVideoInputRef.current.value = "";
    }
  }, []);


  const setOptionImage = useCallback((optionId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setOptions(prevOptions => prevOptions.map(opt =>
        opt.id === optionId ? { ...opt, imageUrl, imageFile: file, videoUrl: undefined, videoFile: undefined } : opt
      ));
    }
  }, []);

  const removeOptionImage = useCallback((optionId: string) => {
    setOptions(prevOptions => prevOptions.map(opt =>
      opt.id === optionId ? { ...opt, imageUrl: undefined, imageFile: undefined } : opt
    ));
  }, []);

  const setOptionVideo = useCallback((optionId: string, event: React.ChangeEvent<HTMLInputElement>) => {
     if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
       if (file.size > 10 * 1024 * 1024) { // 10MB limit for option videos
         toast({ title: "Video Too Large", description: "Option video file should be less than 10MB.", variant: "destructive" });
         return;
      }
      const videoUrl = URL.createObjectURL(file);
      setOptions(prevOptions => prevOptions.map(opt =>
        opt.id === optionId ? { ...opt, videoUrl, videoFile: file, imageUrl: undefined, imageFile: undefined } : opt
      ));
    }
  }, [toast]);

  const removeOptionVideo = useCallback((optionId: string) => {
    setOptions(prevOptions => prevOptions.map(opt =>
      opt.id === optionId ? { ...opt, videoUrl: undefined, videoFile: undefined } : opt
    ));
  }, []);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      toast({ title: "Error", description: "Poll question cannot be empty.", variant: "destructive" });
      return;
    }
    if (options.some(opt => !opt.text.trim())) {
       toast({ title: "Error", description: "All poll options must have text.", variant: "destructive" });
      return;
    }
    if (options.some(opt => opt.text.length > MAX_OPTION_TEXT_LENGTH)) {
      toast({ title: "Error", description: `One or more options exceed the ${MAX_OPTION_TEXT_LENGTH} character limit for text.`, variant: "destructive" });
      return;
    }
    if (!deadline) {
      toast({ title: "Error", description: "Please set a deadline.", variant: "destructive" });
      return;
    }
    if (pledgeAmount !== undefined && pledgeAmount <= 0) {
      toast({ title: "Error", description: "Pledge amount must be greater than zero if set.", variant: "destructive" });
      return;
    }

    const pollData = {
      question,
      options: options.map(({id, imageFile, videoFile, ...rest}) => ({
        ...rest,
        imageUrl: rest.imageUrl || (imageFile ? 'mockUploadedImageUrl' : undefined),
        videoUrl: rest.videoUrl || (videoFile ? 'mockUploadedVideoUrl' : undefined)
      })),
      deadline: deadline.toISOString(),
      pollImageUrls: pollImageUrls.length > 0 ? pollImageUrls : undefined,
      pollVideoUrl: pollVideoUrl,
      pledgeAmount: pledgeAmount && pledgeAmount > 0 ? pledgeAmount : undefined,
      pledgeOutcome: pledgeAmount && pledgeAmount > 0 ? 'pending' : undefined,
      isSpicy,
    };
    console.log('Submitting poll:', pollData);
    console.log('Poll Image Files:', pollImageFiles);
    console.log('Poll Video File:', pollVideoFile);
    console.log('Option Files:', options.map(o => ({image: o.imageFile, video: o.videoFile})));

    if (pollData.pledgeAmount && pollData.pledgeAmount > 0) {
        console.log(`Pledge amount $${pollData.pledgeAmount} submitted. Stripe integration placeholder: This would trigger Stripe payment processing.`);
        toast({
            title: 'Pledge Submitted (Simulated)',
            description: `Your pledge of $${pollData.pledgeAmount.toFixed(2)} would be processed via Stripe now.`,
            duration: 5000,
        });
    }

    toast({
      title: 'Poll Created! (Simulated)',
      description: 'Your poll has been successfully submitted to the console.',
    });

    // Reset form
    setQuestion('');
    setOptions([{ id: `option-${Date.now()}`, text: '' }, { id: `option-${Date.now() + 1}`, text: '' }]);
    const newDefaultDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    newDefaultDeadline.setSeconds(0);
    setDeadline(newDefaultDeadline);
    setPollImageUrls([]);
    setPollImageFiles([]);
    setPollVideoUrl(undefined);
    setPollVideoFile(undefined);
    setPledgeAmount(undefined);
    setIsSpicy(false);
    if (pollImageInputRef.current) pollImageInputRef.current.value = "";
    if (pollVideoInputRef.current) pollVideoInputRef.current.value = "";
  };

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
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold">Poll Media (Optional)</Label>
              <Alert variant="default" className="bg-accent/10 border-accent/30">
                <AlertDescription className="text-xs text-muted-foreground">
                  You can add up to {MAX_POLL_IMAGES} images AND one video (max 60s, ~60MB) for your poll question.
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant="outline" onClick={() => pollImageInputRef.current?.click()} disabled={pollImageUrls.length >= MAX_POLL_IMAGES}>
                  <ImagePlus className="mr-2 h-4 w-4" /> Add Image ({pollImageUrls.length}/{MAX_POLL_IMAGES})
                </Button>
                <input type="file" accept="image/*" multiple onChange={handlePollImageFileChange} ref={pollImageInputRef} className="hidden" />

                <Button type="button" variant="outline" onClick={() => pollVideoInputRef.current?.click()} disabled={!!pollVideoUrl}>
                  <VideoIcon className="mr-2 h-4 w-4" /> Add Video {pollVideoUrl ? '(1/1)' : '(0/1)'}
                </Button>
                <input type="file" accept="video/*" onChange={handlePollVideoFileChange} ref={pollVideoInputRef} className="hidden" />
              </div>
               {pollVideoUrl && (
                <div className="mt-2 p-2 border rounded-md flex justify-between items-center bg-muted/20">
                  <div className="flex items-center text-sm">
                    <Film className="h-5 w-5 mr-2 text-primary" />
                    <span>Poll Video Added (Preview)</span>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={handleRemovePollVideo} aria-label="Remove poll video">
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              )}
              {pollImageUrls.length > 0 && (
                <div className="mt-2 space-y-2">
                  <Label className="text-sm font-medium">Selected Images:</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {pollImageUrls.map((url, index) => (
                      <div key={index} className="relative group aspect-square">
                        <Image src={url} alt={`Poll image preview ${index + 1}`} layout="fill" objectFit="cover" className="rounded-md shadow-sm" data-ai-hint="poll image"/>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemovePollImage(index)}
                          aria-label={`Remove image ${index + 1}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold">Options ({options.length}/{MAX_OPTIONS})</Label>
              {options.map((option, index) => {
                const optionImageInputRef = React.createRef<HTMLInputElement>();
                const optionVideoInputRef = React.createRef<HTMLInputElement>();
                const charCount = option.text.length;
                return (
                  <div key={option.id} className="space-y-3 p-4 border rounded-md bg-card shadow-sm">
                    <div className="flex items-start space-x-2">
                      <Textarea
                        value={option.text}
                        onChange={(e) => handleOptionChange(option.id, 'text', e.target.value)}
                        placeholder={`Option ${index + 1} text (max ${MAX_OPTION_TEXT_LENGTH} chars)`}
                        required
                        maxLength={MAX_OPTION_TEXT_LENGTH}
                        className="flex-grow bg-background rounded-md min-h-[60px]"
                        rows={2}
                      />
                      {options.length > 2 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveOption(option.id)} aria-label="Remove option" className="mt-1">
                          <X className="h-5 w-5 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      {charCount}/{MAX_OPTION_TEXT_LENGTH}
                    </div>
                    <div className="relative">
                       <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                       <Input
                          type="url"
                          value={option.affiliateLink || ''}
                          onChange={(e) => handleOptionChange(option.id, 'affiliateLink', e.target.value)}
                          placeholder="Optional: Affiliate Link (e.g., https://amzn.to/xyz)"
                          className="pl-10 bg-background text-sm rounded-md"
                        />
                    </div>
                    <div className="flex items-center space-x-2 pt-2 border-t mt-3">
                      <span className="text-xs text-muted-foreground">Media (1 image OR 1 video max 10MB):</span>
                      {!option.videoFile && !option.videoUrl && (
                        option.imageFile || option.imageUrl ? (
                          <div className="flex items-center space-x-1">
                            <ImageIconLucide className="h-4 w-4 text-primary" />
                            <span className="text-xs text-muted-foreground truncate max-w-[100px]">{option.imageFile?.name || "Image Added"}</span>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeOptionImage(option.id)} aria-label="Remove option image" className="h-6 w-6">
                              <X className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        ) : (
                          <Button type="button" variant="ghost" size="icon" onClick={() => optionImageInputRef.current?.click()} aria-label="Add image to option" disabled={!!option.videoUrl || !!option.videoFile} className="h-7 w-7">
                            <ImagePlus className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )
                      )}
                       <input type="file" accept="image/*" onChange={(e) => setOptionImage(option.id, e)} ref={optionImageInputRef} className="hidden" />

                      {!option.imageFile && !option.imageUrl && (
                        option.videoFile || option.videoUrl ? (
                           <div className="flex items-center space-x-1">
                            <VideoIcon className="h-4 w-4 text-primary" />
                             <span className="text-xs text-muted-foreground truncate max-w-[100px]">{option.videoFile?.name || "Video Added"}</span>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeOptionVideo(option.id)} aria-label="Remove option video" className="h-6 w-6">
                               <X className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        ) : (
                          <Button type="button" variant="ghost" size="icon" onClick={() => optionVideoInputRef.current?.click()} aria-label="Add video to option" disabled={!!option.imageUrl || !!option.imageFile} className="h-7 w-7">
                            <VideoIcon className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )
                      )}
                      <input type="file" accept="video/*" onChange={(e) => setOptionVideo(option.id, e)} ref={optionVideoInputRef} className="hidden" />
                    </div>
                  </div>
                );
              })}
              {options.length < MAX_OPTIONS && (
                <Button type="button" variant="outline" onClick={handleAddOption} className="w-full rounded-md">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Option
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-base font-semibold">Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal rounded-md"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP HH:mm") : <span>Pick a date and time</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card rounded-lg shadow-xl" side="bottom" align="start">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    initialFocus
                    fromDate={new Date()}
                  />
                  <div className="p-2 border-t">
                     <Label htmlFor="time" className="text-xs text-muted-foreground">Time (24h format)</Label>
                     <Input id="time" type="time" className="rounded-md" defaultValue={deadline ? format(deadline, "HH:mm") : "12:00"} onChange={(e) => {
                       if (deadline) {
                         const [hours, minutes] = e.target.value.split(':');
                         const newDeadline = new Date(deadline);
                         newDeadline.setHours(parseInt(hours,10));
                         newDeadline.setMinutes(parseInt(minutes,10));
                         newDeadline.setSeconds(0);
                         setDeadline(newDeadline);
                       }
                     }} />
                  </div>
                </PopoverContent>
              </Popover>
               <Select onValueChange={(value) => {
                  const now = new Date();
                  let newDeadline;
                  switch(value) {
                    case '1m': newDeadline = new Date(now.getTime() + 1 * 60 * 1000); break;
                    case '5m': newDeadline = new Date(now.getTime() + 5 * 60 * 1000); break;
                    case '15m': newDeadline = new Date(now.getTime() + 15 * 60 * 1000); break;
                    case '1h': newDeadline = new Date(now.getTime() + 1 * 60 * 60 * 1000); break;
                    case '1d': newDeadline = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000); break;
                    case '7d': newDeadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); break;
                    case '31d': newDeadline = new Date(now.getTime() + 31 * 24 * 60 * 60 * 1000); break;
                    default: newDeadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                  }
                  newDeadline.setSeconds(0);
                  setDeadline(newDeadline);
               }}>
                <SelectTrigger className="w-full mt-2 rounded-md">
                  <SelectValue placeholder="Or quick select duration" />
                </SelectTrigger>
                <SelectContent className="bg-card rounded-lg shadow-xl">
                  <SelectItem value="1m">1 Minute</SelectItem>
                  <SelectItem value="5m">5 Minutes</SelectItem>
                  <SelectItem value="15m">15 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="31d">31 Days (approx. 1 month)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Switch id="spicy-content-toggle" checked={isSpicy} onCheckedChange={setIsSpicy} />
                <Label htmlFor="spicy-content-toggle" className="flex items-center text-base font-semibold">
                  <Flame className="mr-2 h-5 w-5 text-orange-500" /> Mark as Spicy Content (18+)
                </Label>
              </div>
              <Alert variant="default" className="bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-400">
                <AlertCircle className="h-4 w-4 !text-orange-500" />
                <AlertTitle className="text-sm font-semibold !text-orange-600 dark:!text-orange-400">Heads up!</AlertTitle>
                <AlertDescription className="text-xs !text-orange-600/80 dark:!text-orange-400/80">
                  Toggling this indicates your poll may contain mature themes. It helps others filter content.
                </AlertDescription>
              </Alert>
            </div>


            <div className="space-y-3 pt-4 border-t">
              <Label htmlFor="pledgeAmount" className="text-base font-semibold flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-primary" /> Pre-Commitment Pledge (Optional)
              </Label>
              <Alert variant="default" className="bg-primary/10 border-primary/30 text-primary-foreground">
                <AlertCircle className="h-4 w-4 !text-primary" />
                <AlertTitle className="text-sm font-semibold !text-primary">Pledge to the Crowd!</AlertTitle>
                <AlertDescription className="text-xs !text-primary/80">
                  By setting a pledge, you commit to accepting the majority vote. If you choose to go against the crowd's decision after the poll ends, your pledged amount will be distributed as "Tip the Crowd" (50% to the platform, 50% to majority voters as PollitPoints).
                </AlertDescription>
              </Alert>
              <Input
                id="pledgeAmount"
                type="number"
                value={pledgeAmount === undefined ? '' : pledgeAmount}
                onChange={(e) => {
                  const val = e.target.value;
                  setPledgeAmount(val === '' ? undefined : parseFloat(val));
                }}
                placeholder="Enter pledge amount (e.g., 10 for $10)"
                min="0"
                step="0.01"
                className="text-base rounded-md"
              />
              {pledgeAmount && pledgeAmount > 0 && (
                <div className="text-xs text-muted-foreground flex items-start mt-1">
                  <Info className="h-3 w-3 mr-1.5 mt-0.5 shrink-0" />
                  <span>Note: To ensure meaningful PollitPoint distribution (&ge;${MIN_PAYOUT_PER_MAJORITY_VOTER.toFixed(2)}/voter), voting may be limited if the majority grows too large for this pledge amount. The actual limit depends on the number of voters for the winning option.</span>
                </div>
              )}
            </div>

          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button type="submit" className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-semibold">
              Poll it &amp; Go
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
