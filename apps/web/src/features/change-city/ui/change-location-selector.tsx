"use client";
import { ChangeEvent } from "react";

type ChangeLocationSelectorProps = {
  locate?: string;
};

function ChangeLocationSelector({ locate = "ru" }: ChangeLocationSelectorProps) {
  const handleChangeLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
    document.cookie = `locale=${event.target.value}; path=/; max-age=31536000`;
    window.location.reload();
  };
  return (
    <select
      role="combobox"
      aria-label="Поменять язык"
      aria-expanded="false"
      defaultValue={locate}
      name="locate"
      onChange={handleChangeLanguage}
    >
      <option value="ru">🇷🇺</option>
      <option value="en">🇬🇧</option>
    </select>
  );
}

export { ChangeLocationSelector };
