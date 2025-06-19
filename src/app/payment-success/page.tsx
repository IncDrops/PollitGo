
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2 } from 'lucide-react';
import React, { useEffect, Suspense } from 'react'; // Import Suspense
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Inner component that uses useSearchParams
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      // You can use this session_id to fetch session details from your backend
      // and display more specific information or update your database if needed.
      // For example, you might verify the payment status and fulfill an order.
      console.log('Stripe Checkout Session ID:', sessionId);
      toast({
        title: 'Payment Confirmed',
        description: 'Your payment was successful. Session ID: ' + sessionId.substring(0, 10) + '...',
      });
    }
  }, [searchParams, toast]);

  return (
    <Card className="w-full max-w-md text-center shadow-xl rounded-lg">
      <CardHeader className="border-b pb-6">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
        <CardTitle className="mt-4 text-2xl font-headline">Payment Successful!</CardTitle>
        <CardDescription className="mt-2 text-muted-foreground">
          Thank you for your payment. Your transaction has been completed.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">
          Your details are being processed. You can now return to the homepage.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 pt-6">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Main page component
export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-150px)] items-center justify-center px-4 py-12">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      }>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
