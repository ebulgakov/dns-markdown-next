type CustomDate = Date | number | string;

const formatGenerator = (options: Intl.DateTimeFormatOptions): ((date: CustomDate) => string) => {
  return (date: CustomDate): string => {
    const dateFormat = new Intl.DateTimeFormat("ru", options);
    return dateFormat.format(new Date(date));
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
