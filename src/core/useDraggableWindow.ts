import { useWindowContext } from "./useWindowContext.ts";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import type { OffsetPosition } from "../types/position.ts";
import { calcWinPercentage } from "../utils/calcWinPercentage.ts";

/**
 * Hook to manage window dragging logic.
 * It listens to mouse and touch events to update the window's position based on user interaction.
 * It strictly adheres to `constrain` boundaries if they are provided in the WindowContext.
 */
export function useDraggableWindow() {
  const { setPosition, position, size, dragging, setDragging, constrain } =
    useWindowContext();

  // Ref to hold the initial offset between the mouse click position and the window's top-left corner
  const offset = useRef<OffsetPosition>({ x: 0, y: 0 });

  /**
   * Initializes the drag action by recording the initial mouse/touch offset.
   * This ensures the window doesn't jump to the cursor's location but moves relative to where it was grabbed.
   */
  const startDrag = useCallback(
    (clientX: number, clientY: number) => {
      setDragging(true);
      offset.current = {
        x: clientX - position.x,
        y: clientY - position.y,
      };
    },
    [position, setDragging],
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startDrag(e.clientX, e.clientY);
    },
    [startDrag],
  );

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      startDrag(touch.clientX, touch.clientY);
    },
    [startDrag],
  );

  /**
   * Core movement logic. Calculates new coordinates, applies constraints, and sets the state.
   */
  const onMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!dragging) return;

      // Calculate the raw new position based on current mouse/touch coordinates and our stored offset
      let newX = clientX - offset.current.x;
      let newY = clientY - offset.current.y;

      // Parse physical pixel limits. Default to unconstrained (Infinity / -Infinity) if not set.
      const minX = calcWinPercentage(
        constrain?.minX,
        window.innerWidth,
        -Infinity,
      );
      const minY = calcWinPercentage(
        constrain?.minY,
        window.innerHeight,
        -Infinity,
      );
      const maxX =
        calcWinPercentage(constrain?.maxX, window.innerWidth, Infinity) -
        (size?.width ?? 0);
      const maxY =
        calcWinPercentage(constrain?.maxY, window.innerHeight, Infinity) -
        (size?.height ?? 0);

      // Clamp new positions within the derived MIN/MAX bounds
      newX = Math.min(Math.max(newX, minX), maxX);
      newY = Math.min(Math.max(newY, minY), maxY);

      // Persist to context
      setPosition({ x: newX, y: newY });
    },
    [dragging, setPosition, size?.width, size?.height, constrain],
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => onMove(e.clientX, e.clientY),
    [onMove],
  );
  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      onMove(touch.clientX, touch.clientY);
    },
    [onMove],
  );

  const stopDrag = useCallback(() => setDragging(false), [setDragging]);
  const onMouseUp = stopDrag;
  const onTouchEnd = stopDrag;

  // Global event listeners
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  return useMemo(
    () => ({
      onMouseDown,
      onTouchStart,
      dragging,
    }),
    [onMouseDown, onTouchStart, dragging],
  );
}
