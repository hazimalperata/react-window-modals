import { useWindowContext } from "./useWindowContext.ts";
import { useRef, useState } from "react";
import { calcWinPercentage } from "../utils/calcWinPercentage.ts";
import type { WindowResizeDirection } from "../types/direction.ts";

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
    scaleMultiplier,
  } = useWindowContext();
  const [directionResizing, setDirectionResizing] =
    useState<WindowResizeDirection | null>(null);

  // Store initial state before the resize starts for correct mathematical diffing
  const start = useRef({ x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 });
  const rafRef = useRef<number | null>(null);

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
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const currX = "touches" in ev ? ev.touches[0].clientX : ev.clientX;
        const currY = "touches" in ev ? ev.touches[0].clientY : ev.clientY;

        let newWidth = start.current.width;
        let newHeight = start.current.height;
        let newLeft = start.current.left;
        let newTop = start.current.top;

        const deltaX = (currX - start.current.x) / scaleMultiplier;
        const deltaY = (currY - start.current.y) / scaleMultiplier;

        const isRight = typeof direction === "string" && direction.includes("right");
        const isLeft = typeof direction === "string" && direction.includes("left");
        const isTop = typeof direction === "string" && direction.includes("top");
        const isBottom = typeof direction === "string" && direction.includes("bottom");

        // Handle horizontal resize
        if (isRight) newWidth = start.current.width + deltaX;
        if (isLeft) {
          newWidth = start.current.width - deltaX;
          newLeft = start.current.left + deltaX;
        }

        // Handle vertical resize
        if (isBottom) newHeight = start.current.height + deltaY;
        if (isTop) {
          newHeight = start.current.height - deltaY;
          newTop = start.current.top + deltaY;
        }

        // Aspect Ratio handling (simple version)
        // If we want to maintain aspect ratio, we would need an aspect ratio prop
        // For now, we ensure that diagonal resizing (e.g. TOP_LEFT) doesn't break
        // by handling both dimensions independently.

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
          if (constrain.minWidth) newWidth = Math.max(newWidth, constrain.minWidth);
          if (constrain.minHeight) newHeight = Math.max(newHeight, constrain.minHeight);
          if (constrain.maxWidth) newWidth = Math.min(newWidth, constrain.maxWidth);
          if (constrain.maxHeight) newHeight = Math.min(newHeight, constrain.maxHeight);

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
      });
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
