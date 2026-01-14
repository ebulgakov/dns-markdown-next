import type { CustomDate } from "@/types/common";

const toDate = (value: CustomDate): Date => {
  if (value instanceof Date) return value;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    // Avoid UTC parsing shifting the day when formatted in local timezones.
    return new Date(`${value}T00:00:00`);
  }
  return new Date(value);
};

const formatGenerator = (options: Intl.DateTimeFormatOptions): ((date: CustomDate) => string) => {
  const dateFormat = new Intl.DateTimeFormat("ru", options);
  return (date: CustomDate): string => {
    const d = toDate(date);
    if (Number.isNaN(d.getTime())) return "";
    return dateFormat.format(d);
  };
};

export const formatDate = (date: CustomDate): string => {
  const format = formatGenerator({
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return format(date);
};

export const formatDateShort = (date: CustomDate): string => {
  const format = formatGenerator({
    year: "2-digit",
    month: "2-digit",
    day: "2-digit"
  });

  return format(date);
};

export const formatDateMonthDay = (date: CustomDate): string => {
  const format = formatGenerator({
    month: "short",
    day: "numeric"
  });

  return format(date);
};

export const formatTime = (date: Date | number | string): string => {
  const format = formatGenerator({
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  });

  return format(date);
};
