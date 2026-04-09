export const WindowDirections = {
  TOP: "top",
  TOP_RIGHT: "top_right",
  RIGHT: "right",
  BOTTOM_RIGHT: "bottom-right",
  BOTTOM: "bottom",
  BOTTOM_LEFT: "bottom-left",
  LEFT: "left",
  TOP_LEFT: "top-left",
} as const;

export type WindowResizeDirection =
  (typeof WindowDirections)[keyof typeof WindowDirections];
