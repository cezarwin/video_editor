// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientWrapper from "@/components/ClientWrapper";


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Scouting4U Online Video Editor',
  description: 'Scouting4U Online Video Editor.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}