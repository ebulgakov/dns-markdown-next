import { ClerkProvider } from "@clerk/nextjs";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Roboto, Roboto_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import { StrictMode, type ReactNode } from "react";

import "./globals.css";

import { getPriceListCity } from "@/api/get";
import { getUser as getGenericUser } from "@/api/post";
import { getSessionInfo } from "@/api/user";
import { ClerkError } from "@/app/components/clerk-error";
import { Footer } from "@/app/components/footer";
import { Navbar } from "@/app/components/navbar";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { UserProvider } from "@/app/contexts/user-context";
import { cn } from "@/app/lib/utils";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { User } from "@/types/user";

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
    keywords: t("keywords"),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
        { url: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" }
      ],
      apple: "/apple-touch-icon.png"
    }
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
    const authData = await getSessionInfo();
    userId = authData.userId;
  } catch {
    userId = null;
  }

  let genericUser: User | null = null;
  try {
    genericUser = await getGenericUser();
  } catch (error) {
    const e = error as Error;
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки пользователя</AlertTitle>
        <AlertDescription>{e.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <StrictMode>
      <NextIntlClientProvider>
        <ClerkProvider proxyUrl={process.env.NEXT_PUBLIC_CLERK_PROXY_URL}>
          <html lang={locale} suppressHydrationWarning>
            <body
              className={cn(["font-sans antialiased", robotoSans.variable, robotoMono.variable])}
            >
              <UserProvider
                value={{
                  hiddenSections: genericUser?.hiddenSections || [],
                  favoriteSections: genericUser?.favoriteSections || [],
                  favorites: genericUser?.favorites || []
                }}
              >
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                  <div className="px-4">
                    <div className="mx-auto grid min-h-screen md:container">
                      <div className="mb-10">
                        <ClerkError />

                        <Navbar locate={locale} isUserLoggedIn={!!userId} city={city} />

                        {children}
                      </div>
                      <Footer locate={locale} />
                    </div>
                  </div>
                </ThemeProvider>
                <SpeedInsights />
              </UserProvider>
            </body>
            {process.env.GA_ID && <GoogleAnalytics gaId={process.env.GA_ID} />}
          </html>
        </ClerkProvider>
      </NextIntlClientProvider>
    </StrictMode>
  );
}
