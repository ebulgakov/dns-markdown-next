export const formatDate = (date: Date | number): string => {
  const dateFormat = new Intl.DateTimeFormat("ru", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return dateFormat.format(new Date(date)); // Fix for timestamp input - new Date for date number
};

export const formatTime = (date: Date | number): string => {
  const timeFormat = new Intl.DateTimeFormat("ru", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  });

  return timeFormat.format(new Date(date)); // Fix for timestamp input - new Date for date number
};
