'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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
    } else if (status === 'canceled') {
      setPaymentStatus('failed');
      setMessage('Payment was canceled.');
    } else if (status === 'requires_payment_method') {
       setPaymentStatus('failed');
       setMessage('Payment failed. Please try another payment method.');
    } else if (paymentIntentId) {
       // If a payment intent ID is present but no clear status, might still be processing or unknown
       setPaymentStatus('unknown');
       setMessage('Payment status is unknown. Please check your account or contact support.');
       // In a real app, you might call an API route here to check the status server-side using the ID
    } else {
      setPaymentStatus('unknown');
      setMessage('No payment status found in the URL.');
    }

  }, [searchParams]); // Depend on searchParams so effect re-runs if parameters change

  if (paymentStatus === 'loading') {
    return <div className="text-center py-12">Loading payment status...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      {paymentStatus === 'success' && (
        <div className="text-green-600 font-bold text-2xl">Payment Successful!</div>
      )}
      {paymentStatus === 'failed' && (
        <div className="text-red-600 font-bold text-2xl">Payment Failed</div>
      )}
      {paymentStatus === 'unknown' && (
        <div className="text-yellow-600 font-bold text-2xl">Unknown Payment Status</div>
      )}
      {message && <p className="mt-4 text-muted-foreground">{message}</p>}
      {/* You might add a button to return to the app or view purchases here */}
    </div>
  );
};

export default PaymentStatus;