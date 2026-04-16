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
  const { setPosition, position, size, dragging, setDragging, constrain, scaleMultiplier } =
    useWindowContext();

  // Ref to hold the initial offset between the mouse click position and the window's top-left corner
  const offset = useRef<OffsetPosition>({ x: 0, y: 0 });
  const startPosition = useRef<OffsetPosition>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  /**
   * Initializes the drag action by recording the initial mouse/touch offset.
   * This ensures the window doesn't jump to the cursor's location but moves relative to where it was grabbed.
   */
  const startDrag = useCallback(
    (clientX: number, clientY: number) => {
      setDragging(true);
      offset.current = { x: clientX, y: clientY };
      startPosition.current = { ...position };
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

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        // Calculate the raw new position based on current mouse/touch coordinates and our stored offset
        let newX = startPosition.current.x + (clientX - offset.current.x) / scaleMultiplier;
        let newY = startPosition.current.y + (clientY - offset.current.y) / scaleMultiplier;

        // Get border width if exists
        const container = document.querySelector(`[data-window-id]`) as HTMLElement; // Assuming we can identify the container
        const borderX = container ? parseInt(getComputedStyle(container).borderLeftWidth) + parseInt(getComputedStyle(container).borderRightWidth) : 0;
        const borderY = container ? parseInt(getComputedStyle(container).borderTopWidth) + parseInt(getComputedStyle(container).borderBottomWidth) : 0;

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
          ((size?.width ?? 0) + borderX);
        const maxY =
          calcWinPercentage(constrain?.maxY, window.innerHeight, Infinity) -
          ((size?.height ?? 0) + borderY);

        // Clamp new positions within the derived MIN/MAX bounds
        newX = Math.min(Math.max(newX, minX), maxX);
        newY = Math.min(Math.max(newY, minY), maxY);

        // Snap logic
        if (constrain?.snap) {
          const { edges, gridSize, threshold = 10 } = constrain.snap;
          if (edges) {
            if (Math.abs(newX) < threshold) newX = 0;
            if (Math.abs(newX + (size?.width ?? 0) - window.innerWidth) < threshold)
              newX = window.innerWidth - (size?.width ?? 0);
            if (Math.abs(newY) < threshold) newY = 0;
            if (Math.abs(newY + (size?.height ?? 0) - window.innerHeight) < threshold)
              newY = window.innerHeight - (size?.height ?? 0);
          }
          if (gridSize) {
            newX = Math.round(newX / gridSize) * gridSize;
            newY = Math.round(newY / gridSize) * gridSize;
          }
        }

        // Persist to context
        setPosition({ x: newX, y: newY });
      });
    },
    [dragging, setPosition, size?.width, size?.height, constrain, scaleMultiplier],
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
