
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import BottomNavigationBar from '@/components/layout/BottomNavigationBar';
import TopNavigationBar from '@/components/layout/TopNavigationBar';
import { ThemeProvider } from 'next-themes';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Make sure to replace this with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export const metadata: Metadata = {
  title: 'PollitAGo',
  description: 'THE 2nd OPINION APP - Universal Polling Platform',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
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
