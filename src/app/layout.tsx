import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import BottomNavigationBar from '@/components/layout/BottomNavigationBar';
import TopNavigationBar from '@/components/layout/TopNavigationBar';

export const metadata: Metadata = {
  title: 'PollitGo',
  description: 'Universal Polling Platform',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased h-full flex flex-col bg-background">
        <div className="flex flex-col flex-grow min-h-0">
          <TopNavigationBar />
          <main className="flex-grow overflow-y-auto pb-[70px] pt-[60px]"> {/* Padding to avoid overlap with nav bars */}
            {children}
          </main>
          <BottomNavigationBar />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
