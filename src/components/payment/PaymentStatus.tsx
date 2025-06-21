'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const PaymentStatus = () => {
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed' | 'unknown'>('loading');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // This effect runs only on the client side after mounting
    const status = searchParams.get('redirect_status');
    const paymentIntentId = searchParams.get('payment_intent'); // Example for Stripe PaymentIntents

    if (status === 'succeeded') {
      setPaymentStatus('success');
      setMessage('Your payment was successful!');
      // You might fetch more details using paymentIntentId here if needed
      // based on your backend implementation
    } else if (status === 'canceled') {
      setPaymentStatus('failed');
      setMessage('Payment was canceled.');
    } else if (status === 'requires_payment_method') {
        setPaymentStatus('failed');
        setMessage('Payment failed: Please try another payment method.');
    }
     else if (paymentIntentId) {
        // If payment_intent is present but no clear status, you might
        // want to call your backend to check the PaymentIntent status more reliably
        // For now, we'll set it to unknown or loading
        setPaymentStatus('unknown'); // Or keep as loading and trigger a backend check
        setMessage('Checking payment status...');
        // Example: call a backend API route here with paymentIntentId
     }
    else {
      setPaymentStatus('unknown');
      setMessage('Payment status is unknown.');
    }
  }, [searchParams]); // Re-run effect if search params change

  let statusIcon;
  let statusTitle;
  let statusMessageClass = 'text-muted-foreground';

  switch (paymentStatus) {
    case 'loading':
      statusIcon = <Loader2 className="h-8 w-8 animate-spin text-primary" />;
      statusTitle = 'Processing Payment...';
      statusMessageClass = 'text-primary';
      break;
    case 'success':
      statusIcon = <CheckCircle2 className="h-8 w-8 text-green-500" />;
      statusTitle = 'Payment Successful!';
      statusMessageClass = 'text-green-600';
      break;
    case 'failed':
      statusIcon = <XCircle className="h-8 w-8 text-red-500" />;
      statusTitle = 'Payment Failed';
      statusMessageClass = 'text-red-600';
      break;
    case 'unknown':
      statusIcon = <AlertCircle className="h-8 w-8 text-yellow-500" />;
      statusTitle = 'Unknown Payment Status';
      statusMessageClass = 'text-yellow-600';
      break;
  }


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader className="flex flex-col items-center">
          {statusIcon}
          <CardTitle className="mt-4 text-2xl">{statusTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={statusMessageClass}>{message || 'Please wait...'}</p>
          {/* You might add a link back to the home page or order history here */}
          {paymentStatus !== 'loading' && (
             <div className="mt-6">
                 <Button asChild>
                    <Link href="/">Go to Homepage</Link>
                 </Button>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStatus;
