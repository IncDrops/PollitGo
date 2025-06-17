
'use client';

import { useState, type FormEvent, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, ImagePlus, VideoIcon, X, PlusCircle, ImageIcon, Film } from 'lucide-react';
import { format } from "date-fns"
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const MAX_OPTIONS = 4;
const MAX_POLL_IMAGES = 4;

interface PollOptionState {
  id: string;
  text: string;
  imageUrl?: string;
  videoUrl?: string;
}

export default function NewPollPage() {
  const { toast } = useToast();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<PollOptionState[]>([
    { id: `option-${Date.now()}`, text: '' },
    { id: `option-${Date.now() + 1}`, text: '' },
  ]);
  const [deadline, setDeadline] = useState<Date | undefined>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // Default 7 days
  
  const [pollImageUrls, setPollImageUrls] = useState<string[]>([]);
  const [pollVideoUrl, setPollVideoUrl] = useState<string | undefined>();

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

  const handleOptionTextChange = (id: string, value: string) => {
    setOptions(options.map(option => option.id === id ? { ...option, text: value } : option));
  };

  const handleAddPollImage = useCallback(() => {
    if (pollImageUrls.length < MAX_POLL_IMAGES) {
      // Using a unique query param for placeholder to ensure distinct images if needed, though placeholder.co might not differentiate
      setPollImageUrls(prev => [...prev, `https://placehold.co/600x400.png?ts=${Date.now()}${prev.length}`]);
    } else {
      toast({
        title: "Image Limit Reached",
        description: `You can add up to ${MAX_POLL_IMAGES} images for the poll.`,
        variant: "destructive",
      });
    }
  }, [pollImageUrls.length, toast]);

  const handleRemovePollImage = useCallback((indexToRemove: number) => {
    setPollImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  const handleAddPollVideo = useCallback(() => {
    if (!pollVideoUrl) {
      setPollVideoUrl("placeholder-video-url"); // Actual video upload handling would be more complex
    } else {
      toast({
        title: "Video Limit Reached",
        description: "You can add only one video for the poll.",
        variant: "destructive",
      });
    }
  }, [pollVideoUrl, toast]);

  const handleRemovePollVideo = useCallback(() => {
    setPollVideoUrl(undefined);
  }, []);


  const setOptionImage = useCallback((optionId: string) => {
    setOptions(prevOptions => prevOptions.map(opt => 
      opt.id === optionId ? { ...opt, imageUrl: "https://placehold.co/100x100.png", videoUrl: undefined } : opt
    ));
  }, []);

  const removeOptionImage = useCallback((optionId: string) => {
    setOptions(prevOptions => prevOptions.map(opt =>
      opt.id === optionId ? { ...opt, imageUrl: undefined } : opt
    ));
  }, []);

  const setOptionVideo = useCallback((optionId: string) => {
    setOptions(prevOptions => prevOptions.map(opt =>
      opt.id === optionId ? { ...opt, videoUrl: "placeholder-option-video-url", imageUrl: undefined } : opt
    ));
  }, []);

  const removeOptionVideo = useCallback((optionId: string) => {
    setOptions(prevOptions => prevOptions.map(opt =>
      opt.id === optionId ? { ...opt, videoUrl: undefined } : opt
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
    if (!deadline) {
      toast({ title: "Error", description: "Please set a deadline.", variant: "destructive" });
      return;
    }

    const pollData = {
      question,
      options: options.map(({id, ...rest}) => rest),
      deadline: deadline.toISOString(),
      pollImageUrls: pollImageUrls.length > 0 ? pollImageUrls : undefined,
      pollVideoUrl,
    };
    console.log('Submitting poll:', pollData);
    toast({
      title: 'Poll Created!',
      description: 'Your poll has been successfully submitted.',
    });
    setQuestion('');
    setOptions([{ id: `option-${Date.now()}`, text: '' }, { id: `option-${Date.now() + 1}`, text: '' }]);
    setDeadline(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    setPollImageUrls([]);
    setPollVideoUrl(undefined);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center text-foreground">Create New Poll</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="question" className="text-base">Poll Question</Label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What do you want to ask?"
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base">Poll Media</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant="outline" onClick={handleAddPollImage} disabled={pollImageUrls.length >= MAX_POLL_IMAGES}>
                  <ImagePlus className="mr-2 h-4 w-4" /> Add Image ({pollImageUrls.length}/{MAX_POLL_IMAGES})
                </Button>
                <Button type="button" variant="outline" onClick={handleAddPollVideo} disabled={!!pollVideoUrl}>
                  <VideoIcon className="mr-2 h-4 w-4" /> Add Video {pollVideoUrl ? '(1/1)' : '(0/1)'}
                </Button>
              </div>
               {pollVideoUrl && (
                <div className="mt-2 p-2 border rounded-md flex justify-between items-center bg-muted/20">
                  <div className="flex items-center text-sm">
                    <Film className="h-5 w-5 mr-2 text-primary" />
                    <span>Poll Video Added (max 60s)</span>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={handleRemovePollVideo} aria-label="Remove poll video">
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              )}
              {pollImageUrls.length > 0 && (
                <div className="mt-2 space-y-2">
                  <Label className="text-sm">Selected Images:</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {pollImageUrls.map((url, index) => (
                      <div key={index} className="relative group aspect-square">
                        <Image src={url} alt={`Poll image ${index + 1}`} layout="fill" objectFit="cover" className="rounded-md" data-ai-hint="poll image preview" />
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
              <Label className="text-base">Options ({options.length}/{MAX_OPTIONS})</Label>
              {options.map((option, index) => (
                <div key={option.id} className="space-y-2 p-3 border rounded-md bg-muted/20">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      required
                      className="flex-grow bg-background"
                    />
                    {options.length > 2 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveOption(option.id)} aria-label="Remove option">
                        <X className="h-5 w-5 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">Media:</span>
                    {!option.videoUrl && ( 
                      option.imageUrl ? (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeOptionImage(option.id)} aria-label="Remove option image" className="h-auto py-1 px-2 text-xs">
                          <X className="h-3 w-3 mr-1 text-destructive" /> Remove Image
                        </Button>
                      ) : (
                        <Button type="button" variant="ghost" size="icon" onClick={() => setOptionImage(option.id)} aria-label="Add image to option" disabled={!!option.videoUrl} className="h-7 w-7">
                          <ImagePlus className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )
                    )}
                    {!option.imageUrl && ( 
                      option.videoUrl ? (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeOptionVideo(option.id)} aria-label="Remove option video" className="h-auto py-1 px-2 text-xs">
                           <X className="h-3 w-3 mr-1 text-destructive" /> Remove Video
                        </Button>
                      ) : (
                        <Button type="button" variant="ghost" size="icon" onClick={() => setOptionVideo(option.id)} aria-label="Add video to option" disabled={!!option.imageUrl} className="h-7 w-7">
                          <VideoIcon className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )
                    )}
                     {option.imageUrl && <ImageIcon className="h-4 w-4 text-primary ml-auto" title="Image added"/>}
                     {option.videoUrl && <VideoIcon className="h-4 w-4 text-primary ml-auto" title="Video added"/>}
                  </div>
                </div>
              ))}
              {options.length < MAX_OPTIONS && (
                <Button type="button" variant="outline" onClick={handleAddOption} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Option
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-base">Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP HH:mm") : <span>Pick a date and time</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    initialFocus
                    fromDate={new Date()} 
                  />
                  <div className="p-2 border-t">
                     <Input type="time" defaultValue={deadline ? format(deadline, "HH:mm") : "12:00"} onChange={(e) => {
                       if (deadline) {
                         const [hours, minutes] = e.target.value.split(':');
                         const newDeadline = new Date(deadline);
                         newDeadline.setHours(parseInt(hours,10));
                         newDeadline.setMinutes(parseInt(minutes,10));
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
                    case '1h': newDeadline = new Date(now.getTime() + 1 * 60 * 60 * 1000); break;
                    case '1d': newDeadline = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000); break;
                    case '7d': newDeadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); break;
                    case '31d': newDeadline = new Date(now.getTime() + 31 * 24 * 60 * 60 * 1000); break;
                    default: newDeadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                  }
                  setDeadline(newDeadline);
               }}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Or quick select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Minute</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="31d">31 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground">
              Post Poll
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

