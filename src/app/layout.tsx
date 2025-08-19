import type { Metadata } from "next";
import { Geist, Geist_Mono, Princess_Sofia } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import AuthGuard from "@/components/AuthGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const princessSofia = Princess_Sofia({
  variable: "--font-princess-sofia",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "IIT Connect - Campus Community Platform",
  description:
    "Connect with your IIT Ropar community - discussions, rides, games, and more",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${princessSofia.variable} antialiased bg-gradient-to-br from-blue-600 to-teal-500 min-h-screen`}
      >
        <Providers>
          <AuthGuard>{children}</AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
