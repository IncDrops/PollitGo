'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { UserCircle2, Bell, ShieldCheck, Palette, LogOut, HelpCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-headline font-bold mb-8 text-foreground">Settings</h1>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-headline"><UserCircle2 className="mr-2 h-5 w-5 text-primary" /> Account</CardTitle>
            <CardDescription>Manage your account information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="current_user" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="user@example.com" />
            </div>
            <Button variant="outline">Change Password</Button>
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
              <Select defaultValue="system">
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
            <Info className="mr-2 h-5 w-5" /> About PollitGo
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
