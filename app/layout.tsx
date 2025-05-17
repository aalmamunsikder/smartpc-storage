import React from 'react';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { NotificationsProvider } from '@/hooks/use-notifications';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

export const metadata: Metadata = {
  title: 'SmartPC Storag Connect',
  description: 'SmartPC Desktop Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <NotificationsProvider>
            {children}
            <Toaster />
          </NotificationsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 