"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

function ChangeThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const t = useTranslations("ChangeThemeSelector");
  const altTheme = theme === "light" ? "dark" : "light";

  useEffect(() => {
    // https://react.dev/reference/react-dom/client/hydrateRoot#handling-different-client-and-server-content
    setIsClient(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  return isClient ? (
    <button
      suppressHydrationWarning={false}
      className="cursor-pointer flex items-center"
      onClick={() => setTheme(altTheme)}
    >
      {t(altTheme)} {altTheme === "light" ? "🌞" : "🌜"}
    </button>
  ) : null;
}

export { ChangeThemeSelector };
