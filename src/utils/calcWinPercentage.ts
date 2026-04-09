import type { WindowSizeInitialValue } from "../types/size.ts";

export const calcWinPercentage = (
  value: WindowSizeInitialValue | undefined,
  total: number,
  initial = undefined,
) => {
  if (value === undefined) return initial;
  if (typeof value === "number") return value;
  const numeric = parseFloat(value.toString().replace("%", ""));
  return (numeric / 100) * total;
};
