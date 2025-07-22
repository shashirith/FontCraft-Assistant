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
  title: "FontCraft Chat - Typography & Font Design Conversations",
  description: "Connect with typography experts, font designers, and brand specialists in FontCraft Chat. Get personalized font recommendations, explore typeface collections, and discuss custom typography solutions for your projects.",
  keywords: ["typography", "fonts", "typeface", "font design", "custom fonts", "brand identity", "design chat", "fontcraft"],
  authors: [{ name: "FontCraft Team" }],
  openGraph: {
    title: "FontCraft Chat - Typography & Font Design Conversations",
    description: "Connect with typography experts and get personalized font recommendations for your design projects.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FontCraft Chat - Typography & Font Design Conversations",
    description: "Connect with typography experts and get personalized font recommendations for your design projects.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
