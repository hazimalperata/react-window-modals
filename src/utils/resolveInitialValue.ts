export const resolveInitialValue = (
  value: number | `%${number}` | undefined,
  fallback = 0,
): number => {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "number") return value;
  if (value.startsWith("%")) {
    const numeric = parseFloat(value);
    return isNaN(numeric) ? fallback : numeric / 100;
  }
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
};
