
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-150px)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <CardTitle className="text-2xl font-headline">Signup Not Available</CardTitle>
          <CardDescription>
            Firebase Authentication and Firestore have been removed from this application.
            An alternative user creation and data storage system needs to be implemented.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            User registration is currently disabled.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild className="w-full">
            <Link href="/">Go to Homepage</Link>
          </Button>
           <p className="text-sm text-muted-foreground text-center">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Login (Currently Disabled)
              </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
