import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

// const geistMono = Geist_Mono({ 
//   variable: "--font-geist-mono",
//   subsets: ["latin"]
// });

export const metadata: Metadata = {
  title: "Scrapp",
  description: "Time to scrap the right way!"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"dark"}>
        <main
          className={`w-full ${geistSans.className} antialiased`}>
          <Navbar />
          <Toaster />
          {children}
        </main>
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
