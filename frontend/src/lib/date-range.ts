export function getCurrentYearRange() {
  const now = new Date();
  const year = now.getFullYear();

  return {
    from: `${year}-01`,
    to: `${year}-12`,
  };
}

export function normalizeMonthRange(
  fromValue: string | null,
  toValue: string | null,
) {
  const currentYearRange = getCurrentYearRange();

  if (!fromValue || !toValue) {
    return currentYearRange;
  }

  const fromYear = Number(fromValue.split('-')[0]);
  const toYear = Number(toValue.split('-')[0]);
  const currentYear = Number(currentYearRange.from.split('-')[0]);

  if (fromYear === currentYear && toYear === currentYear) {
    return {
      from: `${currentYear}-01`,
      to: `${currentYear}-12`,
    };
  }

  return currentYearRange;
}
