import type {Metadata} from 'next';
import { Inter, Roboto_Mono } from 'next/font/google'; // Changed to Google Fonts
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ 
  variable: '--font-inter', // Updated variable name
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono', // Updated variable name
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Photo Poet',
  description: 'Generate beautiful poems from your photos using AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased bg-background text-foreground min-h-full flex flex-col`}>
        <div className="flex-grow">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
