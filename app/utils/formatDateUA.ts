type FormatDateOptions = {
  withYear?: boolean;
};

export function formatDateForUA(
  date: string | Date,
  { withYear = false }: FormatDateOptions = {}
): string {
  const parsed = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  };

  if (withYear) {
    options.year = "numeric";
  }

  return parsed.toLocaleString("uk-UA", options);
}
