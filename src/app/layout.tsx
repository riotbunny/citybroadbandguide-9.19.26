import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "City Broadband Guide",
  description: "Compare local high-speed internet providers, plans, and pricing with City Broadband Guide.",
  openGraph: {
    title: "City Broadband Guide",
    description: "Compare local high-speed internet providers, plans, and pricing.",
    siteName: "City Broadband Guide",
    images: [
      {
        url: "/city-broadband-guide-logo.jpg",
        width: 1200,
        height: 630,
        alt: "City Broadband Guide",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "City Broadband Guide",
    description: "Compare local high-speed internet providers, plans, and pricing.",
    images: ["/city-broadband-guide-logo.jpg"],
  },
};

import Footer from '../components/Footer'
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}<Footer /></body>
    </html>
  );
}
