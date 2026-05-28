/**
 * Root Layout
 */

import React from 'react';
import type { Metadata } from 'next';
import { ToastProvider } from '@/components/common/Toast';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'OEDX AI - Advanced Chat Platform',
  description: 'Experience the power of AI conversations',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#030712" />
      </head>
      <body>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
