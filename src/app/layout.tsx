
'use client';

// import type { Metadata, Viewport } from 'next'; // No longer exporting these from here
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import BottomNavigationBar from '@/components/layout/BottomNavigationBar';
import TopNavigationBar from '@/components/layout/TopNavigationBar';
import { ThemeProvider } from 'next-themes';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Make sure to replace this with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// Metadata and viewport cannot be exported from a Client Component.
// They should be defined in Server Components (like individual page.tsx files)
// or through the file-based metadata API if this layout were a Server Component.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <title>PollitAGo</title> {/* Basic title as a fallback */}
        <meta name="description" content="THE 2nd OPINION APP - Universal Polling Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=League+Spartan:wght@400;600;700&family=Alice&display=swap" rel="stylesheet" />
        <link rel="icon" href="/pollit.png" sizes="40x40" type="image/png" />
      </head>
      <body className="font-body antialiased h-full flex flex-col bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Elements stripe={stripePromise}>
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
      </body>
    </html>
  );
}
