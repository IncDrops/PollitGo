
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';


export default function PaymentSuccessPage() {
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
    <div className="container mx-auto flex min-h-[calc(100vh-150px)] items-center justify-center px-4 py-12">
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
            You will be redirected shortly, or you can return to the homepage.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 pt-6">
          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
