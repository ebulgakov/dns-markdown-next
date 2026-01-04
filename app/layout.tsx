import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { StrictMode, type ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "DNS-Markdown",
  description: "Get markdown prices from the dns shop"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <StrictMode>
      <ClerkProvider>
        <html lang="ru">
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <div className="grid min-h-screen md:container mx-auto">
              <div className="mb-10">
                <div className="mt-4 mb-5">
                  <Navbar />
                </div>
                {children}
              </div>
              <Footer />
            </div>
          </body>
        </html>
      </ClerkProvider>
    </StrictMode>
  );
}
