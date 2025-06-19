
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle } from 'lucide-react';

export default function PaymentCancelledPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-150px)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md text-center shadow-xl rounded-lg">
        <CardHeader className="border-b pb-6">
          <XCircle className="mx-auto h-16 w-16 text-destructive" />
          <CardTitle className="mt-4 text-2xl font-headline">Payment Cancelled</CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            Your payment was not completed. You can try again or return to the previous page.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            If you encountered an issue, please check your payment details or contact support.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 pt-6">
          <Button asChild className="w-full">
            <Link href="/">Go to Homepage</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/new-poll">Try Creating Poll Again</Link> 
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
