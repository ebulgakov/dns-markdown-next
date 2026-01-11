export const formatDate = (date: Date | number | string): string => {
  const dateFormat = new Intl.DateTimeFormat("ru", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return dateFormat.format(new Date(date));
};

export const formatDateShort = (date: Date | number | string): string => {
  const dateFormat = new Intl.DateTimeFormat("ru", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit"
  });

  return dateFormat.format(new Date(date));
};

export const formatDateMonthDay = (date: Date | number | string): string => {
  const dateFormat = new Intl.DateTimeFormat("ru", {
    month: "short",
    day: "numeric"
  });

  return dateFormat.format(new Date(date));
};

export const formatTime = (date: Date | number | string): string => {
  const timeFormat = new Intl.DateTimeFormat("ru", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  });

  return timeFormat.format(new Date(date));
};
