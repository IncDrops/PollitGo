
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-150px)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <CardTitle className="text-2xl font-headline">Password Reset Not Available</CardTitle>
          <CardDescription>
            Firebase Authentication has been removed. Password reset functionality is unavailable.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <p className="text-sm text-muted-foreground text-center">
            An alternative authentication system needs to be implemented for password recovery.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild className="w-full">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login (Currently Disabled)
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
