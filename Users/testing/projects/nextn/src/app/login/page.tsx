// src/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogInIcon } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false, // Prevent NextAuth.js from redirecting automatically
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        // Specific check for "CredentialsSignin" which is a common NextAuth error for bad creds
        if (result.error === "CredentialsSignin") {
          throw new Error(result.error); 
        }
        // For other errors (like "failed to fetch" if NEXTAUTH_URL is bad or endpoint crashes),
        // result.error might be a more generic message or null if the fetch itself failed.
        // The actual fetch error would be caught by the outer catch block.
        // If result.error is present and not CredentialsSignin, it's likely a configuration issue.
        throw new Error(result.error || "Login failed due to an unexpected NextAuth issue.");
      }

      if (result?.ok && !result.error) {
        toast({
          title: 'Login Successful',
          description: "Welcome back!",
        });
        router.push('/'); // Redirect to homepage or dashboard
        router.refresh(); // Force refresh to update session state if needed
      } else {
        // This case might not be hit if result.error is properly thrown
        throw new Error("An unknown error occurred during login.");
      }

    } catch (error: any) {
      console.error('Login error details:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.message && error.message.toLowerCase().includes('failed to fetch')) {
          errorMessage = "Could not connect to authentication service. Please ensure NEXTAUTH_URL in .env.local is correct (e.g. http://localhost:9003) and that your server was restarted after setting it. Check terminal for more specific errors.";
      } else if (error.message === "CredentialsSignin") {
         errorMessage = 'Invalid email or password provided.';
      } else if (error.message) {
        // Use error message if available and not "CredentialsSignin"
        errorMessage = error.message;
      }
      
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-150px)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <LogInIcon className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-2xl font-headline">Welcome Back!</CardTitle>
          <CardDescription>
            Log in to your PollitAGo account to continue.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link href="/forgot-password" passHref>
                        <Button variant="link" type="button" className="p-0 h-auto text-sm" disabled={isLoading}>
                          Forgot password?
                        </Button>
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Log In
              </Button>
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
