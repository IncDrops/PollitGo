
import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';

// Ensure your Stripe secret key is set as an environment variable
// For example, in a .env.local file: STRIPE_SECRET_KEY=sk_test_yourkey
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

const MIN_AMOUNT_CENTS = 100; // Minimum $1.00

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      amount, // Expected in cents
      currency = 'usd', 
      itemName = 'PollitAGo Item',
      metadata = {} // Pass any metadata you need
    } = body;

    if (typeof amount !== 'number' || amount < MIN_AMOUNT_CENTS) {
      return NextResponse.json(
        { error: `Amount must be at least ${MIN_AMOUNT_CENTS/100} ${currency.toUpperCase()}. You provided ${amount/100}.` },
        { status: 400 }
      );
    }

    const appUrl = request.nextUrl.origin; // Gets the base URL (e.g., http://localhost:9003 or https://yourdomain.com)

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
      metadata: metadata, // Pass along metadata to Stripe session
    });

    return NextResponse.json({ id: session.id });

  } catch (error: any) {
    console.error('Error creating Stripe session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Stripe session.' },
      { status: 500 }
    );
  }
}
