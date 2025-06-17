'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, ImagePlus, VideoIcon, X, PlusCircle } from 'lucide-react';
import { format } from "date-fns"
import { useToast } from '@/hooks/use-toast';

const MAX_OPTIONS = 4;

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
  const [pollImageUrl, setPollImageUrl] = useState<string | undefined>();
  const [pollVideoUrl, setPollVideoUrl] = useState<string | undefined>();

  const handleAddOption = () => {
    if (options.length < MAX_OPTIONS) {
      setOptions([...options, { id: `option-${Date.now()}`, text: '' }]);
    }
  };

  const handleRemoveOption = (id: string) => {
    if (options.length > 2) { // Minimum 2 options
      setOptions(options.filter(option => option.id !== id));
    } else {
      toast({
        title: "Minimum Options",
        description: "A poll must have at least two options.",
        variant: "destructive",
      });
    }
  };

  const handleOptionChange = (id: string, field: 'text' | 'imageUrl' | 'videoUrl', value: string) => {
    setOptions(options.map(option => option.id === id ? { ...option, [field]: value } : option));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Basic validation
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
      options: options.map(({id, ...rest}) => rest), // remove client-side id
      deadline: deadline.toISOString(),
      pollImageUrl,
      pollVideoUrl,
    };
    console.log('Submitting poll:', pollData);
    toast({
      title: 'Poll Created!',
      description: 'Your poll has been successfully submitted.',
    });
    // Reset form or redirect
    setQuestion('');
    setOptions([{ id: `option-${Date.now()}`, text: '' }, { id: `option-${Date.now() + 1}`, text: '' }]);
    setDeadline(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    setPollImageUrl(undefined);
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

            <div className="space-y-1">
              <Label className="text-base">Poll Image/Video (Optional)</Label>
              <div className="flex space-x-2">
                <Button type="button" variant="outline" className="flex-1">
                  <ImagePlus className="mr-2 h-4 w-4" /> Add Image
                  {/* Placeholder for file input */}
                </Button>
                <Button type="button" variant="outline" className="flex-1">
                  <VideoIcon className="mr-2 h-4 w-4" /> Add Video
                  {/* Placeholder for file input */}
                </Button>
              </div>
               {/* Show placeholder if image/video is added */}
            </div>

            <div className="space-y-2">
              <Label className="text-base">Options ({options.length}/{MAX_OPTIONS})</Label>
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, 'text', e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                    className="flex-grow"
                  />
                  {/* Placeholder for option image/video upload */}
                  <Button type="button" variant="ghost" size="icon" aria-label="Add media to option">
                     <ImagePlus className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  {options.length > 2 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveOption(option.id)} aria-label="Remove option">
                      <X className="h-5 w-5 text-destructive" />
                    </Button>
                  )}
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
                    fromDate={new Date()} // Can't select past dates
                  />
                  {/* Basic Time selection - could be improved with dedicated time picker */}
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
