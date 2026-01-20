"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

import { sendGAEvent } from "@/app/lib/sendGAEvent";

function ChangeThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const t = useTranslations("ChangeThemeSelector");
  const altTheme = theme === "light" ? "dark" : "light";

  useEffect(() => {
    // https://react.dev/reference/react-dom/client/hydrateRoot#handling-different-client-and-server-content
    setIsClient(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const handleSendGAEvent = (theme: string) => {
    sendGAEvent({
      event: "change_theme",
      value: theme,
      category: "Utility",
      action: "click"
    });
  };

  return isClient ? (
    <button
      suppressHydrationWarning={false}
      className="flex cursor-pointer items-center"
      onClick={() => {
        setTheme(altTheme);
        handleSendGAEvent(altTheme);
      }}
    >
      {t(altTheme)} {altTheme === "light" ? "🌞" : "🌜"}
    </button>
  ) : null;
}

export { ChangeThemeSelector };
