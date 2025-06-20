
'use client';

// import type { Metadata, Viewport } from 'next'; // No longer exporting these from here
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import BottomNavigationBar from '@/components/layout/BottomNavigationBar';
import TopNavigationBar from '@/components/layout/TopNavigationBar';
import { ThemeProvider } from 'next-themes';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import NextAuthProvider from '@/components/auth/NextAuthProvider';

const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

let stripePromise: Promise<Stripe | null> | null = null;

if (STRIPE_PUBLISHABLE_KEY && STRIPE_PUBLISHABLE_KEY.startsWith('pk_')) {
  stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
} else {
  console.error(
    "CRITICAL STRIPE ERROR (RootLayout): NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing, empty, or invalid (must start with 'pk_test_' or 'pk_live_'). " +
    "Stripe functionality (including pledges) will be disabled or severely degraded. " +
    "Please ensure this variable is correctly set in your .env.local file (e.g., NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOURKEY) " +
    "and that you have RESTARTED your Next.js development server after making changes to .env.local."
  );
  // stripePromise remains null, which is acceptable for the Elements provider.
  // Components using useStripe() will receive null.
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <title>PollitAGo</title>
        <meta name="description" content="THE 2nd OPINION APP - Universal Polling Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=League+Spartan:wght@400;600;700&family=Alice&display=swap" rel="stylesheet" />
        <link rel="icon" href="/pollit.png" sizes="40x40" type="image/png" />
      </head>
      <body className="font-body antialiased h-full flex flex-col bg-background">
        <NextAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Elements stripe={stripePromise}> {/* Pass the potentially null stripePromise */}
              <div className="flex flex-col flex-grow min-h-0">
                <TopNavigationBar />
                <main className="flex-grow overflow-y-auto pb-[70px] pt-[80px]"> {/* Adjusted pt for taller TopNav */}
                  {children}
                </main>
                <BottomNavigationBar />
              </div>
            </Elements>
            <Toaster />
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}

