
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle2, Bell, ShieldCheck, Palette, LogOut, HelpCircle, Info, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import useAuth from '@/hooks/useAuth'; // Import useAuth hook
import { fetchUserProfile } from '@/lib/firebase'; // Import fetchUserProfile function
import type { UserProfile } from '@/types'; // Assuming you have a UserProfile type

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const { user: authUser, loading: authLoading } = useAuth(); // Use the auth hook
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null); // State for real user profile
  const [isProfileLoading, setIsProfileLoading] = useState(true); // Loading state for profile fetch

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);


  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid File Type", description: "Please select an image.", variant: "destructive" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "File Too Large", description: "Image size should be less than 5MB.", variant: "destructive" });
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (authUser) {
      setIsProfileLoading(true);
      fetchUserProfile(authUser.id)
        .then(profileData => {
          setUserProfile(profileData);
        })
        .catch(error => {
          console.error("Error fetching user profile in settings:", error);
          toast({
            title: "Error",
            description: "Could not load your profile information.",
            variant: "destructive",
          });
          setUserProfile(null); 
        })
        .finally(() => {
          setIsProfileLoading(false);
        });
    } else {
      setUserProfile(null);
      setIsProfileLoading(false);
    }
  }, [authUser, authLoading, toast]);

  const handleSaveChanges = () => {
    console.log("Saving settings. Avatar file to upload:", avatarFile);
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
  };
  
  if (!mounted || authLoading || isProfileLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading settings...</div>;
  }

  if (!authUser || !userProfile) {
    return <div className="container mx-auto px-4 py-8 text-center text-destructive">Please log in to view settings.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-headline font-bold mb-8 text-foreground">Settings</h1>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-headline"><UserCircle2 className="mr-2 h-5 w-5 text-primary" /> Account</CardTitle>
            <CardDescription>Manage your account information and profile picture.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 ring-2 ring-primary ring-offset-2 ring-offset-background">
                  <AvatarImage src={avatarPreview || userProfile.avatarUrl || 'https://placehold.co/100x100.png'} alt={userProfile.name || "User avatar"} data-ai-hint="profile avatar" />
                  <AvatarFallback>{userProfile.name ? userProfile.name.substring(0,1).toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background group-hover:bg-accent"
                  onClick={() => avatarInputRef.current?.click()}
                  aria-label="Change profile picture"
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  type="file"
                  ref={avatarInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="flex-grow w-full space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue={userProfile.username} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={userProfile.email} /> 
                </div>
              </div>
            </div>
            <Button variant="outline" className="mt-4 sm:mt-0">Change Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-headline"><Bell className="mr-2 h-5 w-5 text-primary" /> Notifications</CardTitle>
            <CardDescription>Configure your notification preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="flex-grow">Enable Push Notifications</Label>
              <Switch id="push-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="flex-grow">Enable Email Notifications</Label>
              <Switch id="email-notifications" />
            </div>
             <div>
              <Label htmlFor="notification-sound">Notification Sound</Label>
              <Select defaultValue="default">
                <SelectTrigger id="notification-sound">
                  <SelectValue placeholder="Select sound" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="ding">Ding</SelectItem>
                  <SelectItem value="chime">Chime</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-headline"><Palette className="mr-2 h-5 w-5 text-primary" /> Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the app.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="flex items-center justify-between">
              <Label htmlFor="compact-mode" className="flex-grow">Compact Mode</Label>
              <Switch id="compact-mode" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-headline"><ShieldCheck className="mr-2 h-5 w-5 text-primary" /> Privacy & Security</CardTitle>
            <CardDescription>Manage your privacy settings and account security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="private-account" className="flex-grow">Private Account</Label>
              <Switch id="private-account" />
            </div>
            <Button variant="outline">Two-Factor Authentication</Button>
            <Button variant="link" className="p-0 h-auto text-muted-foreground">Manage Blocked Users</Button>
          </CardContent>
        </Card>
        
        <Separator />

        <div className="space-y-2">
           <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
            <HelpCircle className="mr-2 h-5 w-5" /> Help & Support
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
            <Info className="mr-2 h-5 w-5" /> About PollitAGo
          </Button>
        </div>

        <Button variant="destructive" className="w-full" onClick={() => toast({ title: "Logged Out", description: "You have been successfully logged out.", variant: "default"})}>
          <LogOut className="mr-2 h-5 w-5" /> Log Out
        </Button>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSaveChanges} className="bg-primary hover:bg-primary/90 text-primary-foreground">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
