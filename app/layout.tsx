import { ClerkProvider } from "@clerk/nextjs";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Roboto, Roboto_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import { StrictMode, type ReactNode } from "react";

import "./globals.css";

import { Footer } from "@/app/components/footer";
import { Navbar } from "@/app/components/navbar";
import { UserProvider } from "@/app/contexts/user-context";
import { cn } from "@/app/lib/utils";
import { QueryProvider } from "@/app/providers/query-provider";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { getUser as getGenericUser } from "@/services/post";
import { getSessionInfo } from "@/services/user";
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
  } catch {
    genericUser = null;
  }

  return (
    <StrictMode>
      <NextIntlClientProvider>
        <ClerkProvider proxyUrl={process.env.NEXT_PUBLIC_CLERK_PROXY_URL}>
          <html lang={locale} suppressHydrationWarning>
            <body
              className={cn(["font-sans antialiased", robotoSans.variable, robotoMono.variable])}
            >
              <QueryProvider>
                <UserProvider
                  value={{
                    hiddenSections: genericUser?.hiddenSections || [],
                    favoriteSections: genericUser?.favoriteSections || [],
                    favorites: genericUser?.favorites || [],
                    city: genericUser?.city || process.env.DEFAULT_CITY!
                  }}
                >
                  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                    <div className="px-4">
                      <div className="mx-auto grid min-h-screen md:container">
                        <div className="mb-10">
                          <Navbar locate={locale} isUserLoggedIn={!!userId} />

                          {children}
                        </div>
                        <Footer locate={locale} />
                      </div>
                    </div>
                  </ThemeProvider>
                  <SpeedInsights />
                </UserProvider>
              </QueryProvider>
            </body>
            {process.env.GA_ID && <GoogleAnalytics gaId={process.env.GA_ID} />}
          </html>
        </ClerkProvider>
      </NextIntlClientProvider>
    </StrictMode>
  );
}
