export const resolveInitialValue = (
  value: number | `%${number}` | `${number}%` | string | undefined,
  fallback = 0,
): number => {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "number") return value;
  if (value === "center") return fallback;
  
  if (typeof value === "string") {
    if (value.startsWith("%") || value.endsWith("%")) {
      const numeric = parseFloat(value.replace("%", ""));
      return isNaN(numeric) ? fallback : numeric / 100;
    }
  }

  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
};
