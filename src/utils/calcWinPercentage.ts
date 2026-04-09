import { resolveInitialValue } from "./resolveInitialValue.ts";

/**
 * value: number | string | undefined
 * total: toplam boyut
 * fallback: number
 */
export const calcWinPercentage = (
  value: number | `%${number}` | undefined,
  total: number,
  fallback = 0,
): number => {
  const resolved = resolveInitialValue(value, fallback);
  return typeof value === "string" && value.endsWith("%")
    ? resolved * total
    : resolved;
};
