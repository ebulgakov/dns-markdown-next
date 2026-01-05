export const formatDate = (date: Date | number): string => {
  const dateFormat = new Intl.DateTimeFormat("ru", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  return dateFormat.format(date);
};

export const formatTime = (date: Date | number): string => {
  const timeFormat = new Intl.DateTimeFormat("ru", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  });

  return timeFormat.format(date);
};
