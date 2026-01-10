import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import ruJson from "./locates/ru.json";

import type { LocaleList } from "@/types/i18n";


const defaultLocateList: LocaleList = ruJson;

export default getRequestConfig(async () => {
  const store = await cookies();
  const defaultLocale = "ru";
  const localeCookie = store.get("locale")?.value || defaultLocale;
  const availableLocales = ["en", "ru"];
  const locale = availableLocales.includes(localeCookie || "") ? localeCookie : defaultLocale;

  return {
    locale,
    messages: (await import(`./locates/${locale}.json`)).default,
    getMessageFallback: ({ key, namespace }: { key: string; namespace?: string }): string => {
      if (!namespace) return key; // No namespace provided, return key as is

      const namespaceObj = defaultLocateList[namespace];
      return namespaceObj.hasOwnProperty(key) ? namespaceObj[key] : key;
    }
  };
});
