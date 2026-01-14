import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Roboto, Roboto_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import { StrictMode, type ReactNode } from "react";

import "./globals.css";

import { Footer } from "@/app/components/footer";
import { Navbar } from "@/app/components/navbar";
import { cn } from "@/app/lib/utils";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { getPriceListCity } from "@/db/pricelist/queries";

import type { Metadata } from "next";

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["cyrillic", "latin"]
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["cyrillic", "latin"]
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

  let city;
  try {
    city = await getPriceListCity();
  } catch {
    city = undefined;
  }

  let userId;
  try {
    const authData = await auth();
    userId = authData.userId;
  } catch {
    userId = null;
  }

  return (
    <StrictMode>
      <NextIntlClientProvider>
        <ClerkProvider>
          <html lang={locale} suppressHydrationWarning>
            <body
              className={cn(["font-sans antialiased", robotoSans.variable, robotoMono.variable])}
            >
              <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                <div className="px-4">
                  <div className="mx-auto grid min-h-screen md:container">
                    <div className="mb-10">
                      <div className="mt-4 mb-5">
                        <Navbar locate={locale} isUserLoggedIn={!!userId} city={city} />
                      </div>
                      {children}
                    </div>
                    <Footer locate={locale} />
                  </div>
                </div>
              </ThemeProvider>
            </body>
            <GoogleAnalytics gaId="G-9JRYZ5VS6V" />
          </html>
        </ClerkProvider>
      </NextIntlClientProvider>
    </StrictMode>
  );
}
