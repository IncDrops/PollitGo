
// src/app/settings/page.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle2, Bell, ShieldCheck, Palette, LogOut, HelpCircle, Info, Camera, Loader2, AlertCircle, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import useAuth from '@/hooks/useAuth';
import { signOut, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  
  const { user: appUser, loading: authLoading, isAuthenticated } = useAuth();
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');


  useEffect(() => {
    setMounted(true); // Indicate component has mounted for theme select
    if (appUser) {
      setDisplayName(appUser.name || '');
      // For username, if your NextAuth session/token includes a username field, use that.
      // Otherwise, derive from email or leave blank/allow user to set.
      setUsername( (appUser as any).username || appUser.email?.split('@')[0] || ''); 
      setAvatarPreview(appUser.image || null);
    } else if (!authLoading) { // If not loading and no user, reset fields
        setDisplayName('');
        setUsername('');
        setAvatarPreview(null);
    }
  }, [appUser, authLoading]);

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

  const handleSaveChanges = async () => {
    if (!isAuthenticated || !appUser) {
      toast({ title: "Not Authenticated", description: "Please log in to save changes.", variant: "destructive"});
      return;
    }
    setIsSaving(true);
    
    // Simulate saving settings. In a real app:
    // 1. Call an API endpoint to update user profile in your database (name, username).
    // 2. If avatarFile exists, upload it to storage (e.g., Cloudinary, S3, or your own server)
    //    and get back the URL to save in the user's profile.
    console.log("Simulating saving settings for user:", appUser.email);
    console.log("New display name:", displayName);
    console.log("New username:", username);
    if (avatarFile) {
      console.log("New avatar file to upload:", avatarFile.name);
      // Placeholder for avatar upload logic
    }

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    
    toast({
      title: "Settings Save Simulated",
      description: "User profile changes are not persisted. Database integration is needed.",
    });

    // Optional: If NextAuth session needs updating after profile change,
    // you might call `getSession()` or trigger a session update if your backend supports it.
    // For now, client-side changes are just visual until a DB is in place.
    
    setIsSaving(false);
  };

  const handleLogout = async () => {
    setIsSaving(true); // Use isSaving to disable buttons during logout process
    await signOut({ redirect: false, callbackUrl: '/' }); // Redirect to home after logout
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    // router.push('/') is handled by callbackUrl, but good to be explicit if needed elsewhere
    setIsSaving(false);
  };
  
  if (!mounted || authLoading) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-150px)] items-center justify-center px-4 py-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading settings...</p>
      </div>
    );
  }

  if (!isAuthenticated) { // Check if user is not authenticated after loading
    return (
       <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-headline font-bold mb-8 text-foreground">Settings</h1>
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center text-xl font-headline"><AlertCircle className="mr-2 h-5 w-5 text-destructive" /> Settings Unavailable</CardTitle>
                  <CardDescription>You need to be logged in to view and manage your settings.</CardDescription>
              </CardHeader>
              <CardContent>
                  <p className="text-muted-foreground">
                      Please log in to access your account settings, notification preferences, and more.
                  </p>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                   <Button onClick={() => signIn()} className="w-full" disabled={isSaving}>
                        <LogIn className="mr-2 h-4 w-4" /> Login
                   </Button>
                   <Button variant="outline" asChild className="w-full" disabled={isSaving}>
                      <Link href="/">Go to Homepage</Link>
                   </Button>
              </CardFooter>
          </Card>
      </div>
    );
  }

  // User is authenticated and appUser should be available
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-headline font-bold mb-8 text-foreground">Settings</h1>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-headline"><UserCircle2 className="mr-2 h-5 w-5 text-primary" /> Account</CardTitle>
            <CardDescription>Manage your account information and profile picture. Email: {appUser?.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 ring-2 ring-primary ring-offset-2 ring-offset-background">
                  <AvatarImage src={avatarPreview || `https://placehold.co/100x100.png?text=${displayName ? displayName.charAt(0).toUpperCase() : 'U'}`} alt={displayName || "User avatar"} data-ai-hint="profile avatar" />
                  <AvatarFallback>{displayName ? displayName.charAt(0).toUpperCase() : (appUser?.name ? appUser.name.charAt(0).toUpperCase() : 'U')}</AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background group-hover:bg-accent"
                  onClick={() => avatarInputRef.current?.click()}
                  aria-label="Change profile picture"
                  disabled={isSaving}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  type="file"
                  ref={avatarInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={isSaving}
                />
              </div>
              <div className="flex-grow w-full space-y-4">
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} disabled={isSaving} />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g., cooluser123" disabled={isSaving} />
                   <p className="text-xs text-muted-foreground mt-1">This will be your public @username. (Feature in development)</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="mt-4 sm:mt-0" disabled>Change Password (Not Implemented)</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-headline"><Bell className="mr-2 h-5 w-5 text-primary" /> Notifications</CardTitle>
            <CardDescription>Configure your notification preferences. (Settings not yet functional)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="flex-grow">Enable Push Notifications</Label>
              <Switch id="push-notifications" defaultChecked disabled={isSaving}/>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="flex-grow">Enable Email Notifications</Label>
              <Switch id="email-notifications" disabled={isSaving} />
            </div>
             <div>
              <Label htmlFor="notification-sound">Notification Sound</Label>
              <Select defaultValue="default" disabled={isSaving}>
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
              {mounted && ( // Ensure theme select only renders client-side
                <Select value={theme} onValueChange={setTheme} disabled={isSaving}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
             <div className="flex items-center justify-between">
              <Label htmlFor="compact-mode" className="flex-grow">Compact Mode (Not Implemented)</Label>
              <Switch id="compact-mode" disabled={isSaving || true}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-headline"><ShieldCheck className="mr-2 h-5 w-5 text-primary" /> Privacy & Security</CardTitle>
            <CardDescription>Manage your privacy settings and account security. (Features not implemented)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="private-account" className="flex-grow">Private Account</Label>
              <Switch id="private-account" disabled/>
            </div>
            <Button variant="outline" disabled>Two-Factor Authentication</Button>
            <Button variant="link" className="p-0 h-auto text-muted-foreground" disabled>Manage Blocked Users</Button>
          </CardContent>
        </Card>
        
        <Separator />

        <div className="space-y-2">
           <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" disabled>
            <HelpCircle className="mr-2 h-5 w-5" /> Help & Support (Not Implemented)
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" disabled>
            <Info className="mr-2 h-5 w-5" /> About PollitAGo (Not Implemented)
          </Button>
        </div>

        <Button variant="destructive" className="w-full" onClick={handleLogout} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-5 w-5" />}
           Log Out
        </Button>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSaveChanges} className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Changes (Simulated)
          </Button>
        </div>
      </div>
    </div>
  );
}


    