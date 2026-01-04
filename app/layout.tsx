import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
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

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords")
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <StrictMode>
      <NextIntlClientProvider>
        <ClerkProvider>
          <html lang={locale}>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
              <div className="grid min-h-screen md:container mx-auto">
                <div className="mb-10">
                  <div className="mt-4 mb-5">
                    <Navbar />
                  </div>
                  {children}
                </div>
                <Footer locate={locale} />
              </div>
            </body>
          </html>
        </ClerkProvider>
      </NextIntlClientProvider>
    </StrictMode>
  );
}
