export function toDateOnlyValue(value: string) {
  return value.slice(0, 10);
}

export function formatDateOnly(value: string) {
  const [year, month, day] = toDateOnlyValue(value).split('-');

  return `${day}/${month}/${year}`;
}
