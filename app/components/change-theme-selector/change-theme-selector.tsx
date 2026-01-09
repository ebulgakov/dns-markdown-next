"use client";

import { useTheme } from "next-themes";

function ChangeThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="cursor-pointer hover:underline"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      Поменять тему сайта
    </button>
  );
}

export { ChangeThemeSelector };
