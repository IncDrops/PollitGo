
import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';

const STRIPE_API_VERSION = '2024-06-20'; // Define API version as a constant

export async function POST(request: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    console.error('CRITICAL: STRIPE_SECRET_KEY environment variable is not set. This is required for Stripe integration to function.');
    return NextResponse.json(
      { error: 'Server configuration error: Stripe secret key is missing. Please check server logs.' },
      { status: 500 }
    );
  }

  // Initialize Stripe client inside the handler
  // This is crucial for build processes that might analyze routes without full runtime env vars
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: STRIPE_API_VERSION,
    typescript: true, // Recommended for type safety
  });

  try {
    const body = await request.json();
    const { 
      amount, // Expected in cents
      currency = 'usd', 
      itemName = 'PollitAGo Item',
      metadata = {} // Pass any metadata you need
    } = body;

    const MIN_AMOUNT_CENTS = 100; // Minimum $1.00

    if (typeof amount !== 'number' || amount < MIN_AMOUNT_CENTS) {
      return NextResponse.json(
        { error: `Amount must be at least $${(MIN_AMOUNT_CENTS/100).toFixed(2)} ${currency.toUpperCase()}. You provided $${(amount/100).toFixed(2)}.` },
        { status: 400 }
      );
    }

    const appUrl = request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: itemName,
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/payment-cancelled`,
      metadata: metadata,
    });

    return NextResponse.json({ id: session.id });

  } catch (error: any) {
    console.error('Error creating Stripe session:', error);
    // Provide a more generic error message to the client for security
    return NextResponse.json(
      { error: 'Failed to create payment session. Please try again later.' },
      { status: 500 }
    );
  }
}

