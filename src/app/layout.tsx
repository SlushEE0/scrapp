import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";

import "./globals.css";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Optix Toolkit",
  description: "DNHS Team Optix 3749"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"dark"}>
        <SidebarProvider>
          <main
            className={`z-0 absolute w-full ${geistSans.className} antialiased`}>
            <Navbar />
            <Toaster />
            {children}
          </main>
        </SidebarProvider>
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
