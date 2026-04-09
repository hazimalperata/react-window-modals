import { useWindowContext } from "./useWindowContext.ts";
import { useRef, useState } from "react";
import { calcWinPercentage } from "../utils/calcWinPercentage.ts";
import {
  WindowDirections,
  type WindowResizeDirection,
} from "../types/direction.ts";

/**
 * Hook to manage window resizing logic.
 * Call this hook with a specific resize direction (e.g., TOP, RIGHT, BOTTOM, LEFT) to generate resize handlers.
 * Ensures the window layout respects boundaries (constrains).
 *
 * @param direction - The edge being pulled to resize the window.
 */
export const useResizableWindow = (direction: WindowResizeDirection) => {
  const {
    size,
    setSize,
    position,
    setPosition,
    constrain,
    resizing,
    setResizing,
  } = useWindowContext();
  const [directionResizing, setDirectionResizing] =
    useState<WindowResizeDirection | null>(null);

  // Store initial state before the resize starts for correct mathematical diffing
  const start = useRef({ x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 });

  /**
   * Initializes resizing action, records initial snapshot of size and position.
   * Attach this handler to your resize handles `onMouseDown` or `onTouchStart`.
   */
  const onResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setDirectionResizing(direction);
    setResizing(true);
    start.current = {
      x: clientX,
      y: clientY,
      width: size.width ?? 0, // Fallback width
      height: size.height ?? 0, // Fallback height
      left: position.x,
      top: position.y,
    };

    const moveHandler = (ev: MouseEvent | TouchEvent) => {
      const currX = "touches" in ev ? ev.touches[0].clientX : ev.clientX;
      const currY = "touches" in ev ? ev.touches[0].clientY : ev.clientY;

      let newWidth = start.current.width;
      let newHeight = start.current.height;
      let newLeft = start.current.left;
      let newTop = start.current.top;

      // Handle horizontal resize: expanding towards right or expanding towards left
      // Expanding towards left updates both width and x-position of the window.
      if (direction === WindowDirections.RIGHT)
        newWidth = start.current.width + (currX - start.current.x);
      if (direction === WindowDirections.LEFT) {
        newWidth = start.current.width - (currX - start.current.x);
        newLeft = start.current.left + (currX - start.current.x);
      }

      // Handle vertical resize: expanding towards bottom or expanding towards top
      // Expanding towards top updates both height and y-position of the window.
      if (direction === WindowDirections.BOTTOM)
        newHeight = start.current.height + (currY - start.current.y);
      if (direction === WindowDirections.TOP) {
        newHeight = start.current.height - (currY - start.current.y);
        newTop = start.current.top + (currY - start.current.y);
      }

      // Constraint uygula
      if (constrain) {
        if (constrain.minX)
          newWidth = Math.max(
            newWidth,
            calcWinPercentage(constrain?.minX, window.innerWidth, -Infinity),
          );
        if (constrain.maxX)
          newWidth = Math.min(
            newWidth,
            calcWinPercentage(constrain?.maxX, window.innerWidth, Infinity),
          );
        if (constrain.minY)
          newHeight = Math.max(
            newHeight,
            calcWinPercentage(constrain?.minY, window.innerHeight, -Infinity),
          );
        if (constrain.maxY)
          newHeight = Math.min(
            newHeight,
            calcWinPercentage(constrain?.maxY, window.innerHeight, Infinity),
          );

        // Ekran dışına taşma
        if (newLeft < 0) {
          newWidth += newLeft;
          newLeft = 0;
        }
        if (newTop < 0) {
          newHeight += newTop;
          newTop = 0;
        }
        if (newLeft + newWidth > window.innerWidth)
          newWidth = window.innerWidth - newLeft;
        if (newTop + newHeight > window.innerHeight)
          newHeight = window.innerHeight - newTop;
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newLeft, y: newTop });
    };

    const stopHandler = () => {
      setResizing(false);
      setDirectionResizing(null);
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseup", stopHandler);
      window.removeEventListener("touchmove", moveHandler);
      window.removeEventListener("touchend", stopHandler);
    };

    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("mouseup", stopHandler);
    window.addEventListener("touchmove", moveHandler, { passive: false });
    window.addEventListener("touchend", stopHandler);
  };

  return { onResizeStart, resizing, directionResizing };
};
