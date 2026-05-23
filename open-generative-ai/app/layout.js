import './globals.css';
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Kalivid — AI Faceless Reels & Media Studio',
  description: 'Generate AI faceless reels, images and videos using 200+ models. No content filters, no subscription lock-in.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
