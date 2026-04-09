export type WindowPositionInitialValue = number | `%${number}` | `${number}%` | "center" | undefined;

export type InitialWindowPosition = {
  x: WindowPositionInitialValue;
  y: WindowPositionInitialValue;
};

export type WindowPosition = {
  x: number;
  y: number;
};

export type OffsetPosition = WindowPosition;
