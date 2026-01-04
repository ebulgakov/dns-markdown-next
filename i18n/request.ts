import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const store = await cookies();
  const defaultLocale = "ru";
  const localeCookie = store.get("locale")?.value || defaultLocale;
  const availableLocales = ["en", "ru"];
  const locale = availableLocales.includes(localeCookie || "") ? localeCookie : defaultLocale;

  return {
    locale,
    messages: (await import(`./locates/${locale}.json`)).default
  };
});
