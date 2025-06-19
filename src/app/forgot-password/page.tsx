
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail, AuthError } from 'firebase/auth';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      setEmailSent(true);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your email for instructions to reset your password.',
      });
    } catch (error) {
      const authError = error as AuthError;
      console.error('Password reset error:', authError);
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (authError.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email address.';
      }
      toast({
        title: 'Password Reset Failed',
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
          <CardTitle className="text-2xl font-headline">Forgot Your Password?</CardTitle>
          {!emailSent ? (
            <CardDescription>
              No problem! Enter your email address below and we&apos;ll send you a link to reset it.
            </CardDescription>
          ) : (
            <CardDescription className="text-green-600">
              A password reset link has been sent to your email address. Please check your inbox (and spam folder).
            </CardDescription>
          )}
        </CardHeader>
        {!emailSent ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send Reset Link
              </Button>
              <Button variant="link" asChild className="text-sm text-muted-foreground hover:text-primary">
                <Link href="/login">
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
            </CardFooter>
          </form>
        ) : (
           <CardFooter className="flex flex-col space-y-4">
              <Button asChild className="w-full">
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
