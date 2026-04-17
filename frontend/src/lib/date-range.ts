function toYearMonth(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  return `${year}-${month}`;
}

export function getDefaultMonthRange() {
  const end = new Date();
  const start = new Date(end.getFullYear(), end.getMonth() - 11, 1);

  return {
    from: toYearMonth(start),
    to: toYearMonth(end),
  };
}

export function normalizeMonthRange(
  fromValue: string | null,
  toValue: string | null,
) {
  if (fromValue && toValue) {
    return {
      from: fromValue,
      to: toValue,
    };
  }

  return getDefaultMonthRange();
}
