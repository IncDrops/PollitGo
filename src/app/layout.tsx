// src/app/layout.tsx
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import BottomNavigationBar from '@/components/layout/BottomNavigationBar';
import TopNavigationBar from '@/components/layout/TopNavigationBar';
import { ThemeProvider } from 'next-themes';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import NextAuthProvider from '@/components/auth/NextAuthProvider'; // Import NextAuthProvider

const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PUBLISHABLE_KEY) {
  console.error(
    "CRITICAL STRIPE ERROR: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set or is empty. " +
    "Please ensure this variable is correctly set in your .env.local file (e.g., NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOURKEY) " +
    "and that you have RESTARTED your Next.js development server after making changes to .env.local. " +
    "Stripe functionality will not work until this is resolved."
  );
}

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY || '');


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
        <NextAuthProvider> {/* Wrap with NextAuthProvider */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Elements stripe={stripePromise}>
              <div className="flex flex-col flex-grow min-h-0">
                <TopNavigationBar />
                <main className="flex-grow overflow-y-auto pb-[70px] pt-[80px]">
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
