import { resolveInitialValue } from "./resolveInitialValue.ts";

/**
 * value: number | string | undefined
 * total: total window/boundary dimension
 * fallback: default fallback number
 * modalDimension: the dimension of the modal itself (used for "center" calculation)
 */
export const calcWinPercentage = (
  value: number | `%${number}` | `${number}%` | "center" | undefined,
  total: number,
  fallback = 0,
  modalDimension = 0
): number => {
  if (value === "center") {
    return (total / 2) - (modalDimension / 2);
  }

  const resolved = resolveInitialValue(value, fallback);
  return typeof value === "string" && (value.endsWith("%") || value.startsWith("%"))
    ? resolved * total
    : resolved;
};
